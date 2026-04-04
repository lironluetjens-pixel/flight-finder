require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { scoreFlights } = require("./scoringEngine");
const { getMockFlights } = require("./mockFlights");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.post("/api/search", async (req, res) => {
  const { origin, destination, departDate, returnDate, adults = 2, children = 2, tripType = "return" } = req.body;

  if (!origin || !destination || !departDate) {
    return res.status(400).json({ error: "Missing required fields: origin, destination, departDate" });
  }

  try {
    let rawFlights;
    const hasSerpKey = process.env.SERPAPI_KEY && process.env.SERPAPI_KEY !== "your_key_here";

    if (hasSerpKey) {
      console.log("Fetching real flights from Google Flights via SerpApi...");
      rawFlights = await fetchGoogleFlights({ origin, destination, departDate, returnDate, adults, children, tripType });
    } else {
      console.log("No SerpApi key — using mock data");
      rawFlights = getMockFlights(origin, destination, departDate);
    }

    const ranked = scoreFlights(rawFlights);

    res.json({
      searchId: Date.now().toString(),
      origin,
      destination,
      departDate,
      returnDate,
      tripType,
      passengers: { adults: parseInt(adults), children: parseInt(children) },
      fetchedAt: new Date().toISOString(),
      usingMockData: !hasSerpKey,
      results: ranked,
    });
  } catch (err) {
    console.error("Search error:", err.message);
    res.status(503).json({ error: "Flight search failed. Please try again.", detail: err.message });
  }
});

async function fetchGoogleFlights({ origin, destination, departDate, returnDate, adults, children, tripType }) {
  const fetch = require("node-fetch");

  const params = new URLSearchParams({
    engine: "google_flights",
    departure_id: origin,
    arrival_id: destination,
    outbound_date: departDate,
    currency: "USD",
    hl: "en",
    adults: adults.toString(),
    children: children.toString(),
    type: tripType === "return" ? "1" : "2",
    api_key: process.env.SERPAPI_KEY,
  });

  if (tripType === "return" && returnDate) {
    params.set("return_date", returnDate);
  }

  const url = `https://serpapi.com/search.json?${params.toString()}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`SerpApi returned ${response.status}`);

  const data = await response.json();

  const flights = [
    ...(data.best_flights || []),
    ...(data.other_flights || []),
  ];

  if (!flights.length) {
    console.log("No flights from SerpApi, falling back to mock");
    return getMockFlights(origin, destination, departDate);
  }

  return flights.map((f) => {
    const leg = f.flights?.[0] || {};
    const depTime = leg.departure_airport?.time || "";
    const depHour = depTime ? parseInt(depTime.split(":")[0]) : 12;
    const airline = leg.airline || "Unknown";

    // Baggage: SerpApi returns carry_on_baggage and checked_bags
    const checkedBags = f.extensions?.includes("Checked baggage included") ||
                        f.extensions?.includes("1 checked bag") ||
                        f.layovers?.length === 0;

    const baggageIncluded = checkedBags;
    const baggageDetails = f.extensions?.join(" · ") || "Check airline website for baggage details";

    // Seat policy lookup
    const seatPolicies = {
      "El Al": true, "Lufthansa": true, "British Airways": true, "Emirates": true,
      "Vueling": false, "EasyJet": false, "Ryanair": false, "Wizz Air": false,
    };

    const totalPrice = f.price || 0;
    const pax = parseInt(adults) + parseInt(children);
    const pricePerAdult = pax > 0 ? Math.round(totalPrice / pax) : totalPrice;
    const pricePerChild = Math.round(pricePerAdult * 0.75);

    return {
      airline,
      flightNumber: leg.flight_number || "",
      origin,
      destination,
      departureTime: depTime ? `${departDate}T${depTime}:00` : `${departDate}T12:00:00`,
      arrivalTime: leg.arrival_airport?.time ? `${departDate}T${leg.arrival_airport.time}:00` : "",
      departureHour: depHour,
      durationMinutes: f.total_duration || 0,
      stops: f.flights ? f.flights.length - 1 : 0,
      stopCity: f.layovers?.[0]?.name || null,
      pricePerAdult,
      pricePerChild,
      totalPrice,
      baggageIncluded,
      baggageDetails,
      seatsTogether: seatPolicies[airline] ?? null,
      seatsAvailable: null,
    };
  });
}

app.listen(PORT, () => {
  console.log(`✈️  Flight Finder backend running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
});
