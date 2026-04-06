require("dotenv").config();
const express=require("express"),cors=require("cors");
const{scoreFlights}=require("./scoringEngine"),{getMockFlights}=require("./mockFlights");
const app=express(),PORT=process.env.PORT||3001;
app.use(cors());app.use(express.json());
app.get("/api/health",(req,res)=>res.json({status:"ok",time:new Date().toISOString()}));
function parseHour(t){if(!t)return -1;const u=t.toUpperCase().trim(),isPM=u.includes("PM"),isAM=u.includes("AM"),c=u.replace("AM","").replace("PM","").trim();let h=parseInt(c.split(":")[0])||0;if(isPM&&h!==12)h+=12;if(isAM&&h===12)h=0;return h;}
function buildISO(date,t){if(!t||!date)return"";const h=parseHour(t);if(h<0)return"";const u=t.toUpperCase().replace("AM","").replace("PM","").trim(),m=parseInt(u.split(":")[1])||0;return`${date}T${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:00`;}
function detectBaggage(f){
  const ext=(f.extensions||[]).join(" ").toLowerCase();
  const included=ext.includes("checked bag")||ext.includes("baggage included")||ext.includes("1 bag")||ext.includes("2 bags")||ext.includes("free bag");
  const airlineName=(f.flights?.[0]?.airline||"").toLowerCase();
  const always=["lufthansa","british airways","el al","emirates","swiss","turkish","aegean","lot","air france","klm","tap","iberia","finnair","austrian","brussels"];
  const never=["ryanair","wizz","easyjet"];
  if(never.some(a=>airlineName.includes(a)))return false;
  if(always.some(a=>airlineName.includes(a))||included)return true;
  return null;
}
function normalise(f,origin,destination,departDate,adults,children){
  const legs=f.flights||[],first=legs[0]||{},last=legs[legs.length-1]||first;
  const rawDep=first.departure_airport?.time||"",rawArr=last.arrival_airport?.time||"";
  const airline=first.airline||"Unknown",totalPrice=f.price||0;
  const pax=parseInt(adults)+parseInt(children),pricePerAdult=pax>0?Math.round(totalPrice/pax):totalPrice;
  const isSelfTransfer=(f.type==="Self transfer")||(f.extensions||[]).some(e=>e.toLowerCase().includes("self transfer"));
  const baggageIncluded=detectBaggage(f);
  let baggageDetails=f.extensions?.join(" · ")||"";
  if(!baggageDetails)baggageDetails=baggageIncluded===true?"Baggage typically included":baggageIncluded===false?"Bag fees likely apply":"Check airline website";
  const sp={"El Al":true,"Lufthansa":true,"British Airways":true,"Emirates":true,"Swiss":true,"Turkish Airlines":true,"Aegean":true,"LOT":true,"Air France":true,"KLM":true,"Vueling":false,"EasyJet":false,"Ryanair":false,"Wizz Air":false,"ITA":false};
  return{airline,flightNumber:first.flight_number||"",origin,destination,departureTime:buildISO(departDate,rawDep),arrivalTime:buildISO(departDate,rawArr),departureHour:parseHour(rawDep),durationMinutes:f.total_duration||0,stops:Math.max(0,legs.length-1),stopCity:f.layovers?.[0]?.name||null,pricePerAdult,pricePerChild:Math.round(pricePerAdult*0.75),totalPrice,baggageIncluded,baggageDetails,seatsTogether:sp[airline]??null,isSelfTransfer,seatsAvailable:null};
}
async function fetchGoogleFlights({origin,destination,departDate,returnDate,adults,children,tripType}){
  const fetch=require("node-fetch");
  const params=new URLSearchParams({engine:"google_flights",departure_id:origin.toUpperCase(),arrival_id:destination.toUpperCase(),outbound_date:departDate,currency:"USD",hl:"en",adults:String(adults),children:String(children),type:tripType==="return"?"1":"2",api_key:process.env.SERPAPI_KEY});
  if(tripType==="return"&&returnDate)params.set("return_date",returnDate);
  console.log(`Searching: ${origin} -> ${destination} on ${departDate}`);
  const response=await fetch(`https://serpapi.com/search.json?${params.toString()}`);
  const data=await response.json();
  if(data.error){console.error("SerpApi error:",data.error);return getMockFlights(origin,destination,departDate);}
  const flights=[...(data.best_flights||[]),...(data.other_flights||[])];
  console.log(`SerpApi returned ${flights.length} flights`);
  if(!flights.length){console.log("No flights, using mock");return getMockFlights(origin,destination,departDate);}
  return flights.map(f=>normalise(f,origin,destination,departDate,adults,children));
}
app.post("/api/prices",async(req,res)=>{
  const{origin,destination,baseDate,adults=1}=req.body;
  if(!origin||!destination||!baseDate)return res.status(400).json({error:"Missing fields"});
  if(!process.env.SERPAPI_KEY)return res.json({prices:{}});
  try{
    const fetch=require("node-fetch");
    const params=new URLSearchParams({engine:"google_flights",departure_id:origin.toUpperCase(),arrival_id:destination.toUpperCase(),outbound_date:baseDate,currency:"USD",hl:"en",adults:String(adults),type:"2",api_key:process.env.SERPAPI_KEY});
    const response=await fetch(`https://serpapi.com/search.json?${params.toString()}`);
    const data=await response.json();
    const prices={};
    if(data.price_insights?.price_history){data.price_insights.price_history.forEach(([date,price])=>{prices[date]=price;});}
    const basePrice=(data.best_flights?.[0]?.price||data.other_flights?.[0]?.price||0);
    if(basePrice&&!prices[baseDate])prices[baseDate]=basePrice;
    res.json({prices});
  }catch(err){console.error("Price calendar error:",err.message);res.json({prices:{}});}
});
app.post("/api/search",async(req,res)=>{
  const{origin,destination,departDate,returnDate,adults=2,children=2,childAges=[],tripType="return"}=req.body;
  if(!origin||!destination||!departDate)return res.status(400).json({error:"Missing required fields"});
  try{
    const hasSerpKey=process.env.SERPAPI_KEY&&process.env.SERPAPI_KEY!=="your_key_here";
    const rawFlights=hasSerpKey?await fetchGoogleFlights({origin,destination,departDate,returnDate,adults,children,tripType}):getMockFlights(origin,destination,departDate);
    if(!hasSerpKey)console.log("No SerpApi key — using mock data");
    res.json({searchId:Date.now().toString(),origin,destination,departDate,returnDate,tripType,passengers:{adults:parseInt(adults),children:parseInt(children),childAges},fetchedAt:new Date().toISOString(),usingMockData:!hasSerpKey,results:scoreFlights(rawFlights)});
  }catch(err){console.error("Search error:",err.message);res.status(503).json({error:"Flight search failed. Please try again."});}
});
app.listen(PORT,()=>console.log(`??  Flight Finder backend running on http://localhost:${PORT}`));
