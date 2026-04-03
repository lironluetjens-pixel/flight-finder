# Flight Finder

Smart flight search for a family of 4. Returns only the top 3–5 flights ranked by price, timing, directness, and baggage.

## Quick start (Windows)

1. Double-click `setup.bat` — installs all dependencies
2. Open a terminal in this folder, run: `cd backend && npm run dev`
3. Open a second terminal, run: `cd frontend && npm run dev`
4. Open your browser at: http://localhost:5173

## Adding a real API key (optional)

1. Sign up at https://aviationstack.com (free)
2. Copy your API key
3. Open `backend/.env`
4. Replace `your_api_key_here` with your key
5. Restart the backend

## Project structure

```
flight-finder/
  backend/
    src/
      index.js          ← Express server + API routes
      scoringEngine.js  ← Scoring logic (price, stops, time, baggage)
      mockFlights.js    ← Demo data (used when no API key)
    .env                ← Your API key goes here (never commit this)
  frontend/
    src/
      App.jsx           ← Main app
      components/
        SearchForm.jsx  ← Search inputs
        FlightCard.jsx  ← Flight result card
```

## Deal score (0–100)

| Factor | Points |
|---|---|
| Price under $100/adult | +40 |
| Direct flight | +30 |
| Good departure time (10am–4pm) | +20 |
| No baggage included | −25 |
| Red-eye / very early | −15 |
