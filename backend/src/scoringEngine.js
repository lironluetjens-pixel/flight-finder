function scoreFlights(flights) {
  const scored = flights.map((f) => {
    let score = 40;
    const reasons = [];
    const price = f.pricePerAdult || 0;
    if (price < 100) { score += 35; reasons.push("Great price") }
    else if (price < 150) { score += 15; reasons.push("Fair price") }
    else if (price < 250) { score += 0; reasons.push("Average price") }
    else { score -= 20; reasons.push("Expensive") }
    if (f.pricePerChild && f.pricePerAdult) {
      const disc = 1 - (f.pricePerChild / f.pricePerAdult);
      if (disc >= 0.25) { score += 10; reasons.push("Good child discount") }
      else if (disc >= 0.10) { score += 5 }
    }
    if (f.stops === 0) { score += 25; reasons.push("Direct flight") }
    else if (f.stops === 1) { score -= 5; reasons.push("1 stop") }
    else { score -= 20; reasons.push("Multiple stops") }
    const hour = f.departureHour;
    if (hour >= 10 && hour <= 16) { score += 20; reasons.push("Good departure time") }
    else if (hour >= 7 && hour < 10) { score += 8; reasons.push("Early morning - more punctual") }
    else if (hour >= 5 && hour < 7) { score -= 10; reasons.push("Very early departure") }
    else if (hour < 5) { score -= 20; reasons.push("Red-eye - difficult with kids") }
    else if (hour > 20) { score -= 12; reasons.push("Late night departure") }
    if (f.baggageIncluded) { score += 5; reasons.push("Baggage included") }
    else { score -= 30; reasons.push("No checked bag - add cost for family") }
    const seatPolicies = {
      "El Al": { guaranteed: true }, "Lufthansa": { guaranteed: true },
      "British Airways": { guaranteed: true }, "Emirates": { guaranteed: true },
      "Vueling": { guaranteed: false }, "EasyJet": { guaranteed: false },
      "Ryanair": { guaranteed: false }, "Wizz Air": { guaranteed: false },
    };
    const sp = seatPolicies[f.airline];
    if (sp) {
      if (sp.guaranteed) { score += 8; reasons.push("Family seating guaranteed") }
      else { score -= 10; reasons.push("Must pay to sit together") }
    }
    const ratings = { "El Al": 4.2, "Lufthansa": 4.4, "British Airways": 4.1, "Emirates": 4.5, "Vueling": 3.5, "EasyJet": 3.0, "Ryanair": 2.8, "Wizz Air": 2.9 };
    const rating = ratings[f.airline] || 3.5;
    score += Math.round((rating / 5) * 10);
    if (rating >= 4.0) reasons.push("Family-friendly airline");
    if (rating < 3.2) reasons.push("Low family service rating");
    if (f.isReturn) score += 3;
    const clamped = Math.max(0, Math.min(100, score));
    const label = clamped >= 70 ? "Book" : clamped >= 45 ? "Wait" : "Ignore";
    return { ...f, dealScore: clamped, label, reasons };
  });
  return scored.sort((a, b) => b.dealScore - a.dealScore).slice(0, 5);
}
module.exports = { scoreFlights };
