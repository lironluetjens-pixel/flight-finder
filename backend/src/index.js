require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { scoreFlights } = require("./scoringEngine");
const { getMockFlights } = require("./mockFlights");
const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors()); app.use(express.json());
app.get("/api/health", (req, res) => res.json({ status: "ok", time: new Date().toISOString() }));
function parseHour(t) { if (!t) return 12; const u = t.toUpperCase().trim(); const isPM = u.includes("PM"); const isAM = u.includes("AM"); const c = u.replace("AM","").replace("PM","").trim(); let h = parseInt(c.split(":")[0]) || 0; if (isPM && h !== 12) h += 12; if (isAM && h === 12) h = 0; return h; }
function buildISO(date, t) { if (!t || !date) return ""; const h = parseHour(t); const u = t.toUpperCase().replace("AM","").replace("PM","").trim(); const m = parseInt(u.split(":")[1]) || 0; return `${date}T${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:00`; }
function normalise(f, origin, destination, departDate, adults, children) {
  const legs = f.flights || []; const first = legs[0] || {}; const last = legs[legs.length-1] || first;
  const rawDep = first.departure_airport?.time || ""; const rawArr = last.arrival_airport?.time || "";
  const airline = first.airline || "Unknown";
  const totalPrice = f.price || 0; const pax = parseInt(adults) + parseInt(children);
  const pricePerAdult = pax > 0 ? Math.round(totalPrice / pax) : totalPrice;
  const ext = (f.extensions || []).join(" ").toLowerCase();
  const baggageIncluded = ext.includes("checked bag") || ext.includes("baggage included") || ext.includes("1 bag");
  const sp = { "El Al": true, "Lufthansa": true, "British Airways": true, "Emirates": true, "Vueling": false, "EasyJet": false, "Ryanair": false, "Wizz Air": false };
  return { airline, flightNumber: first.flight_number || "", origin, destination, departureTime: buildISO(departDate, rawDep), arrivalTime: buildISO(departDate, rawArr), departureHour: parseHour(rawDep), durationMinutes: f.total_duration || 0, stops: Math.max(0, legs.length - 1), stopCity: f.layovers?.[0]?.name || null, pricePerAdult, pricePerChild: Math.round(pricePerAdult * 0.75), totalPrice, baggageIncluded, baggageDetails: f.extensions?.join(" - ") || "Check airline website for baggage details", seatsTogether: sp[airline] ?? null, seatsAvailable: null };
}
async function fetchGoogleFlights({ origin, destination, departDate, returnDate, adults, children, tripType }) {
  const fetch = require("node-fetch");
  const params = new URLSearchParams({ engine: "google_flights", departure_id: origin.toUpperCase(), arrival_id: destination.toUpperCase(), outbound_date: departDate, currency: "USD", hl: "en", adults: String(adults), children: String(children), type: tripType === "return" ? "1" : "2", api_key: process.env.SERPAPI_KEY });
  if (tripType === "return" && returnDate) params.set("return_date", returnDate);
  console.log(`Searching: ${origin} -> ${destination} on ${departDate} (${tripType}), ${adults} adults ${children} children`);
  const response = await fetch(`https://serpapi.com/search.json?${params.toString()}`);
  const data = await response.json();
  if (data.error) { console.error("SerpApi error:", data.error); return getMockFlights(origin, destination, departDate); }
  if (!response.ok) { console.error("SerpApi HTTP error:", response.status); return getMockFlights(origin, destination, departDate); }
  const flights = [...(data.best_flights || []), ...(data.other_flights || [])];
  console.log(`SerpApi returned ${flights.length} flights`);
  if (!flights.length) { console.log("No flights found, using mock data"); return getMockFlights(origin, destination, departDate); }
  return flights.map(f => normalise(f, origin, destination, departDate, adults, children));
}
app.post("/api/search", async (req, res) => {
  const { origin, destination, departDate, returnDate, adults = 2, children = 2, childAges = [], tripType = "return" } = req.body;
  if (!origin || !destination || !departDate) return res.status(400).json({ error: "Missing required fields" });
  try {
    const hasSerpKey = process.env.SERPAPI_KEY && process.env.SERPAPI_KEY !== "your_key_here";
    const rawFlights = hasSerpKey ? await fetchGoogleFlights({ origin, destination, departDate, returnDate, adults, children, tripType }) : getMockFlights(origin, destination, departDate);
    if (!hasSerpKey) console.log("No SerpApi key - using mock data");
    const results = scoreFlights(rawFlights);
    res.json({ searchId: Date.now().toString(), origin, destination, departDate, returnDate, tripType, passengers: { adults: parseInt(adults), children: parseInt(children), childAges }, fetchedAt: new Date().toISOString(), usingMockData: !hasSerpKey || rawFlights === getMockFlights(origin, destination, departDate), results });
  } catch (err) { console.error("Search error:", err.message); res.status(503).json({ error: "Flight search failed. Please try again.", detail: err.message }); }
});
app.listen(PORT, () => console.log(`??  Flight Finder backend running on http://localhost:${PORT}`));
