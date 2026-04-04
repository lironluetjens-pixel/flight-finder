// scoringEngine.js — family of 4 optimised (2 adults + 2 children ages 3 & 6)

function scoreFlights(flights) {
  const scored = flights.map((f) => {
    let score = 40;
    const reasons = [];

    // 1. PRICE per adult
    const price = f.pricePerAdult || 0;
    if (price < 100)      { score += 35; reasons.push("Great price") }
    else if (price < 150) { score += 15; reasons.push("Fair price") }
    else if (price < 250) { score += 0;  reasons.push("Average price") }
    else                  { score -= 20; reasons.push("Expensive") }

    // 2. CHILD FARE — families benefit heavily from child discounts
    if (f.pricePerChild && f.pricePerAdult) {
      const disc = 1 - (f.pricePerChild / f.pricePerAdult);
      if (disc >= 0.25)      { score += 10; reasons.push("Good child discount") }
      else if (disc >= 0.10) { score += 5 }
    }

    // 3. STOPS — direct is strongly preferred for young children
    if (f.stops === 0)      { score += 25; reasons.push("Direct flight") }
    else if (f.stops === 1) { score -= 5;  reasons.push("1 stop") }
    else                    { score -= 20; reasons.push("Multiple stops — hard with kids") }

    // 4. DEPARTURE TIME
    // Note: early flights are more punctual but hard on a 3 and 6 year old.
    // Moderate penalty for very early — cheap early flights can still win overall.
    const hour = f.departureHour;
    if (hour >= 10 && hour <= 16)    { score += 20; reasons.push("Good departure time") }
    else if (hour >= 7 && hour < 10) { score += 8;  reasons.push("Early morning — more punctual") }
    else if (hour >= 5 && hour < 7)  { score -= 10; reasons.push("Very early — difficult with young kids") }
    else if (hour < 5)               { score -= 20; reasons.push("Red-eye — not suitable for ages 3 & 6") }
    else if (hour > 20)              { score -= 12; reasons.push("Late night departure") }

    // 5. BAGGAGE — critical for family of 4
    // Strollers/car seats are gate-checked free — not penalised here.
    // Only penalise if checked bag not included in ticket price.
    if (f.baggageIncluded)  { score += 5;  reasons.push("Checked baggage included") }
    else                    { score -= 30; reasons.push("No checked bag — extra cost x4 passengers") }

    // 6. SEATING TOGETHER — non-negotiable with a 3 and 6 year old
    const seatPolicies = {
      "El Al":           true,  // free family seating
      "Lufthansa":       true,  // guaranteed together
      "British Airways": true,  // children seated with adults free
      "Emirates":        true,  // family seating standard
      "Vueling":         false, // charges for seat selection
      "EasyJet":         false, // charges for seat selection
      "Ryanair":         false, // charges for seat selection
      "Wizz Air":        false, // charges for seat selection
    };
    const seated = f.seatsTogether ?? seatPolicies[f.airline] ?? null;
    if (seated === true)  { score += 8;  reasons.push("Family seating guaranteed") }
    if (seated === false) { score -= 10; reasons.push("Must pay extra to sit together") }

    // 7. FAMILY-FRIENDLY CARRIER
    // Rates airlines on: priority boarding, kids meals, entertainment, overall service
    const carrierRatings = {
      "El Al":           4.2,  // strong family service, Hebrew entertainment
      "Lufthansa":       4.4,  // kids meals, priority boarding, great service
      "British Airways": 4.1,  // family boarding, good kids menu
      "Emirates":        4.5,  // best in class family amenities
      "Vueling":         3.5,  // decent but basic
      "EasyJet":         3.0,  // minimal service
      "Ryanair":         2.8,  // low service, no amenities
      "Wizz Air":        2.9,  // low service, no amenities
    };
    const rating = carrierRatings[f.airline] || 3.5;
    score += Math.round((rating / 5) * 10);
    if (rating >= 4.0) reasons.push("Top family-friendly airline");
    if (rating < 3.2)  reasons.push("Low family service — no kids meals or priority boarding");

    // 8. RETURN TRIP small bonus
    if (f.isReturn) score += 3;

    const clamped = Math.max(0, Math.min(100, score));
    const label = clamped >= 70 ? "Book" : clamped >= 45 ? "Wait" : "Ignore";

    return { ...f, seatsTogether: seated, dealScore: clamped, label, reasons };
  });

  return scored
    .sort((a, b) => b.dealScore - a.dealScore)
    .slice(0, 5);
}

module.exports = { scoreFlights };
