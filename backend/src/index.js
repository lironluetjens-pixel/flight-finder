require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { scoreFlights } = require("./scoringEngine");
const { getMockFlights } = require("./mockFlights");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Main search endpoint
app.post("/api/search", async (req, res) => {
  const { origin, destination, departDate, adults = 2, children = 2 } = req.body;

  if (!origin || !destination || !departDate) {
    return res.status(400).json({
      error: "Missing required fields: origin, destination, departDate",
    });
  }

  try {
    let rawFlights;

    // Use real API if key exists, otherwise use mock data
    if (process.env.AVIATIONSTACK_KEY && process.env.AVIATIONSTACK_KEY !== "your_api_key_here") {
      rawFlights = await fetchRealFlights(origin, destination, departDate, adults, children);
    } else {
      console.log("No API key found — using mock flight data");
      rawFlights = getMockFlights(origin, destination, departDate);
    }

    const rankedFlights = scoreFlights(rawFlights);

    res.json({
      searchId: Date.now().toString(),
      origin,
      destination,
      departDate,
      passengers: { adults, children },
      fetchedAt: new Date().toISOString(),
      usingMockData: !process.env.AVIATIONSTACK_KEY || process.env.AVIATIONSTACK_KEY === "your_api_key_here",
      results: rankedFlights,
    });
  } catch (err) {
    console.error("Search error:", err.message);
    res.status(503).json({
      error: "Flight search failed. Please try again.",
      detail: err.message,
    });
  }
});

// Real API fetch (used when AVIATIONSTACK_KEY is set)
async function fetchRealFlights(origin, destination, date, adults, children) {
  const fetch = require("node-fetch");
  const url = `http://api.aviationstack.com/v1/flights?access_key=${process.env.AVIATIONSTACK_KEY}&dep_iata=${origin}&arr_iata=${destination}&flight_date=${date}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error(`API returned ${response.status}`);

  const data = await response.json();
  if (!data.data || data.data.length === 0) return getMockFlights(origin, destination, date);

  // Normalise Aviationstack response to our format
  return data.data.map((f) => {
    const depTime = f.departure?.scheduled || "";
    const depHour = depTime ? new Date(depTime).getHours() : 12;
    return {
      airline: f.airline?.name || "Unknown",
      flightNumber: f.flight?.iata || "",
      origin,
      destination,
      departureTime: depTime,
      arrivalTime: f.arrival?.scheduled || "",
      departureHour: depHour,
      durationMinutes: 0,
      stops: 0,
      pricePerAdult: 150,      // Aviationstack free tier has no pricing — use scoring neutral
      pricePerChild: 120,
      totalPrice: (150 * adults) + (120 * children),
      baggageIncluded: true,   // Unknown on free tier — assume included
      baggageDetails: "Check airline website for baggage details",
      seatsAvailable: null,
    };
  });
}

app.listen(PORT, () => {
  console.log(`✈️  Flight Finder backend running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
});
