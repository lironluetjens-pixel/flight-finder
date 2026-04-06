function scoreFlights(flights) {
  const scored = flights.map((f) => {
    let score = 40; const reasons = [];
    const price = f.pricePerAdult || 0;
    if (price===0) { score+=0 }
    else if (price<80)  { score+=40; reasons.push("Excellent price") }
    else if (price<120) { score+=28; reasons.push("Good price") }
    else if (price<180) { score+=12; reasons.push("Fair price") }
    else if (price<280) { score+=0;  reasons.push("Average price") }
    else                { score-=18; reasons.push("Expensive") }
    if (f.pricePerChild&&f.pricePerAdult&&f.pricePerChild<f.pricePerAdult) {
      const d=1-(f.pricePerChild/f.pricePerAdult);
      if(d>=0.3){score+=12;reasons.push("Strong child discount")}
      else if(d>=0.2){score+=7;reasons.push("Good child discount")}
      else if(d>=0.1){score+=3}
    }
    if(f.stops===0){score+=28;reasons.push("Direct flight")}
    else if(f.stops===1){score-=8;reasons.push("1 stop")}
    else{score-=22;reasons.push("Multiple stops")}
    const h=f.departureHour;
    if(h>=9&&h<=13){score+=20;reasons.push("Ideal departure time")}
    else if(h>=6&&h<9){score+=12;reasons.push("Early morning - more punctual")}
    else if(h>=14&&h<=17){score+=8;reasons.push("Afternoon - mild delay risk")}
    else if(h>=18&&h<=20){score-=5;reasons.push("Evening - higher delay risk")}
    else if(h>20){score-=14;reasons.push("Late night - not ideal with kids")}
    else if(h>=4&&h<6){score-=8;reasons.push("Very early departure")}
    else if(h<4){score-=20;reasons.push("Red-eye - not suitable for kids")}
    if(f.baggageIncluded){score+=6;reasons.push("Checked baggage included")}
    else{score-=28;reasons.push("No checked bag - extra cost x4")}
    const sp={"El Al":true,"Lufthansa":true,"British Airways":true,"Emirates":true,"Aegean":true,"Vueling":false,"EasyJet":false,"Ryanair":false,"Wizz Air":false,"ITA":false};
    const seated=f.seatsTogether??sp[f.airline]??null;
    if(seated===true){score+=8;reasons.push("Family seating guaranteed")}
    if(seated===false){score-=10;reasons.push("Must pay to sit together")}
    const rat={"El Al":4.2,"Lufthansa":4.4,"British Airways":4.1,"Emirates":4.5,"Aegean":3.8,"Swiss":4.2,"Vueling":3.4,"EasyJet":3.0,"Ryanair":2.8,"Wizz Air":2.9,"ITA":3.2,"LOT":3.5,"Turkish Airlines":3.8};
    const r=rat[f.airline]||3.4;
    score+=Math.round((r/5)*10);
    if(r>=4.2)reasons.push("Top family airline");
    else if(r>=3.8)reasons.push("Good family service");
    else if(r<3.0)reasons.push("Basic service - no kids meals");
    if(f.durationMinutes>0){
      if(f.durationMinutes>600){score-=12;reasons.push("Very long flight (10h+)")}
      else if(f.durationMinutes>420){score-=6;reasons.push("Long flight (7h+)")}
      else if(f.durationMinutes<180){score+=5;reasons.push("Short flight")}
    }
    const c=Math.max(0,Math.min(100,score));
    const label=c>=68?"Book":c>=44?"Wait":"Ignore";
    return{...f,seatsTogether:seated,dealScore:c,label,reasons};
  });
  return scored.sort((a,b)=>b.dealScore-a.dealScore).slice(0,5);
}
module.exports={scoreFlights};
