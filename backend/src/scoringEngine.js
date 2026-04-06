function scoreFlights(flights){
  const scored=flights.map((f)=>{
    let score=0;const reasons=[];
    const p=f.pricePerAdult||0;
    if(p===0){score+=20}
    else if(p<80){score+=50;reasons.push("Excellent price — under $80")}
    else if(p<130){score+=40;reasons.push("Good price")}
    else if(p<200){score+=28;reasons.push("Fair price")}
    else if(p<300){score+=14;reasons.push("Above average price")}
    else if(p<500){score+=0;reasons.push("Expensive — $"+p+"/adult")}
    else if(p<800){score-=15;reasons.push("Very expensive — $"+p+"/adult")}
    else{score-=30;reasons.push("Extremely expensive — $"+p+"/adult")}
    if(f.pricePerChild&&f.pricePerAdult&&f.pricePerChild<f.pricePerAdult){const d=1-(f.pricePerChild/f.pricePerAdult);if(d>=0.30){score+=8;reasons.push("Strong child discount (30%+)")}else if(d>=0.20){score+=4;reasons.push("Good child discount")}}
    if(f.isSelfTransfer||f.isMultiTicket){score-=60;reasons.push("CRITICAL: Self-transfer — risky with young kids")}
    if(f.stops===0){score+=20;reasons.push("Direct flight")}else if(f.stops===1){score-=5;reasons.push("1 stop")}else{score-=15;reasons.push("Multiple stops")}
    const h=f.departureHour;
    if(h<0||h===undefined){score+=0}
    else if(h>=9&&h<=13){score+=12;reasons.push("Ideal time")}
    else if(h>=6&&h<9){score+=8;reasons.push("Early — more punctual")}
    else if(h>=14&&h<=17){score+=4;reasons.push("Afternoon")}
    else if(h>=18&&h<=20){score-=3;reasons.push("Evening")}
    else if(h>20){score-=8;reasons.push("Late night")}
    else if(h<6){score-=6;reasons.push("Very early")}
    if(f.baggageIncluded===true){score+=8;reasons.push("Checked baggage included")}
    else if(f.baggageIncluded===false){score-=12;reasons.push("No checked bag — extra cost")}
    const sp={"El Al":true,"Lufthansa":true,"British Airways":true,"Emirates":true,"Swiss":true,"Turkish Airlines":true,"Aegean":true,"LOT":true,"Air France":true,"KLM":true,"Vueling":false,"EasyJet":false,"Ryanair":false,"Wizz Air":false,"ITA":false};
    const seated=f.seatsTogether??sp[f.airline]??null;
    if(seated===true){score+=8;reasons.push("Family seating guaranteed")}
    if(seated===false){score-=8;reasons.push("Must pay to sit together")}
    const gc={"El Al":1,"Lufthansa":1,"British Airways":1,"Emirates":1,"Swiss":1,"Turkish Airlines":1,"Aegean":1,"LOT":1,"Air France":1,"KLM":1};
    const nfs={"Ryanair":1,"Wizz Air":1,"EasyJet":1};
    if(gc[f.airline]){score+=4;reasons.push("Free stroller + generous cabin bag")}
    if(nfs[f.airline]){score-=4;reasons.push("Stroller fees + restrictive baggage")}
    const rat={"El Al":4.2,"Lufthansa":4.4,"British Airways":4.1,"Emirates":4.5,"Swiss":4.2,"Turkish Airlines":3.9,"Aegean":3.8,"LOT":3.5,"Air France":3.9,"KLM":3.8,"Vueling":3.3,"EasyJet":3.0,"Ryanair":2.8,"Wizz Air":2.9,"ITA":3.1};
    const r=rat[f.airline]||3.3;
    const rb=Math.round(((r-2.8)/(4.5-2.8))*4);score+=rb;
    if(r>=4.2)reasons.push("Top family airline");else if(r>=3.8)reasons.push("Good family service");else if(r<3.0)reasons.push("Basic service");
    if(nfs[f.airline]&&f.baggageIncluded===false){score-=4;reasons.push("Hidden extras likely")}
    if(f.durationMinutes>600){score-=8;reasons.push("Very long (10h+)")}
    else if(f.durationMinutes>420){score-=4;reasons.push("Long flight (7h+)")}
    else if(f.durationMinutes>0&&f.durationMinutes<180){score+=3;reasons.push("Short flight")}
    const c=Math.max(0,Math.min(100,score));
    let label;
    if(p>1000)label="Ignore";
    else if(p>500&&c<90)label="Wait";
    else if(c>=65)label="Book";
    else if(c>=38)label="Wait";
    else label="Ignore";
    return{...f,seatsTogether:seated,dealScore:c,label,reasons};
  });
  return scored.sort((a,b)=>b.dealScore-a.dealScore).slice(0,5);
}
module.exports={scoreFlights};
