function scoreFlights(flights){
  const scored=flights.map((f)=>{
    let score=40;const reasons=[];
    const p=f.pricePerAdult||0;
    if(p===0){score+=0}else if(p<80){score+=40;reasons.push("Excellent price")}else if(p<120){score+=28;reasons.push("Good price")}else if(p<180){score+=12;reasons.push("Fair price")}else if(p<280){score+=0;reasons.push("Average price")}else{score-=18;reasons.push("Expensive")}
    if(f.pricePerChild&&f.pricePerAdult&&f.pricePerChild<f.pricePerAdult){const d=1-(f.pricePerChild/f.pricePerAdult);if(d>=0.30){score+=14;reasons.push("Strong child discount (30%+)")}else if(d>=0.20){score+=8;reasons.push("Good child discount")}else if(d>=0.10){score+=3}}
    if(f.isSelfTransfer||f.isMultiTicket){score-=45;reasons.push("CRITICAL: Self-transfer — risky with young kids")}
    if(f.stops===0){score+=28;reasons.push("Direct flight")}else if(f.stops===1){score-=8;reasons.push("1 stop")}else{score-=22;reasons.push("Multiple stops")}
    const h=f.departureHour;
    if(h<0||h===undefined){score+=0}else if(h>=9&&h<=13){score+=20;reasons.push("Ideal time — low delay risk")}else if(h>=6&&h<9){score+=14;reasons.push("Early morning — most punctual")}else if(h>=14&&h<=17){score+=6;reasons.push("Afternoon — moderate delay risk")}else if(h>=18&&h<=20){score-=6;reasons.push("Evening — higher delay risk")}else if(h>20){score-=15;reasons.push("Late night — hard with kids")}else if(h>=4&&h<6){score-=6;reasons.push("Very early departure")}else if(h<4){score-=22;reasons.push("Red-eye — not suitable for kids")}
    if(f.baggageIncluded===true){score+=8;reasons.push("Checked baggage included")}else if(f.baggageIncluded===false){score-=24;reasons.push("No checked bag — extra cost for family")}
    const gc={"El Al":1,"Lufthansa":1,"British Airways":1,"Emirates":1,"Swiss":1,"Turkish Airlines":1,"Aegean":1,"LOT":1,"Air France":1,"KLM":1};
    const rc={"Ryanair":1,"Wizz Air":1};
    if(gc[f.airline]){score+=5;reasons.push("Generous cabin bag policy")}if(rc[f.airline]){score-=5;reasons.push("Restrictive cabin bag rules")}
    const fs={"El Al":1,"Lufthansa":1,"British Airways":1,"Emirates":1,"Swiss":1,"Turkish Airlines":1,"Aegean":1,"LOT":1,"Air France":1,"KLM":1};
    const nfs={"Ryanair":1,"Wizz Air":1,"EasyJet":1};
    if(fs[f.airline]){score+=6;reasons.push("Free stroller/car seat gate-check")}if(nfs[f.airline]){score-=5;reasons.push("Stroller may incur charges")}
    const sp={"El Al":true,"Lufthansa":true,"British Airways":true,"Emirates":true,"Swiss":true,"Turkish Airlines":true,"Aegean":true,"LOT":true,"Air France":true,"KLM":true,"Vueling":false,"EasyJet":false,"Ryanair":false,"Wizz Air":false,"ITA":false};
    const seated=f.seatsTogether??sp[f.airline]??null;
    if(seated===true){score+=10;reasons.push("Adjacent seating guaranteed free")}if(seated===false){score-=12;reasons.push("Must pay extra to sit together")}
    const hf={"Ryanair":1,"Wizz Air":1,"EasyJet":1,"Vueling":1};
    if(hf[f.airline]&&f.baggageIncluded===false){score-=6;reasons.push("Low base fare hides extras")}
    const rat={"El Al":4.2,"Lufthansa":4.4,"British Airways":4.1,"Emirates":4.5,"Swiss":4.2,"Turkish Airlines":3.9,"Aegean":3.8,"LOT":3.5,"Air France":3.9,"KLM":3.8,"Vueling":3.3,"EasyJet":3.0,"Ryanair":2.8,"Wizz Air":2.9,"ITA":3.1};
    const r=rat[f.airline]||3.3;score+=Math.round((r/5)*10);
    if(r>=4.2)reasons.push("Top family airline");else if(r>=3.8)reasons.push("Good family service");else if(r<3.0)reasons.push("Basic service — no kids meals");
    if(f.durationMinutes>0){if(f.durationMinutes>600){score-=12;reasons.push("Very long flight (10h+)")}else if(f.durationMinutes>420){score-=6;reasons.push("Long flight (7h+)")}else if(f.durationMinutes<180){score+=5;reasons.push("Short flight — easy for kids")}}
    const c=Math.max(0,Math.min(100,score));const label=c>=68?"Book":c>=44?"Wait":"Ignore";
    return{...f,seatsTogether:seated,dealScore:c,label,reasons};
  });
  return scored.sort((a,b)=>b.dealScore-a.dealScore).slice(0,5);
}
module.exports={scoreFlights};
