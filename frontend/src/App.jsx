import React, { useState } from "react"
import axios from "axios"
import SearchForm from "./components/SearchForm"
import FlightCard from "./components/FlightCard"
const API = import.meta.env.VITE_API_URL || ""
export default function App() {
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [meta, setMeta] = useState(null)
  const handleSearch = async (formData) => {
    setLoading(true); setError(null); setResults(null)
    try { const { data } = await axios.post(`${API}/api/search`, formData); setResults(data.results); setMeta(data) }
    catch (err) { setError(err.response?.data?.error || "Something went wrong.") }
    finally { setLoading(false) }
  }
  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 20px 80px" }}>
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div style={{ fontFamily: "Playfair Display, serif", fontSize: 42, color: "var(--navy)", letterSpacing: -1, marginBottom: 8 }}>Family Wings</div>
        <div style={{ fontSize: 15, color: "var(--muted)", maxWidth: 480, margin: "0 auto", lineHeight: 1.6 }}>Stop scrolling through hundreds of flights. We score every option by price, baggage, departure time, and family comfort — then show you only the top 5 worth booking.</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 20, flexWrap: "wrap" }}>
          {[["Direct flights prioritised","Direct"], ["Baggage scoring","Baggage"], ["Family seating check","Seating"], ["Book on 3 sites","Booking"]].map(([label]) => (
            <div key={label} style={{ fontSize: 13, color: "var(--muted)", padding: "4px 12px", border: "1px solid var(--border)", borderRadius: 100, background: "var(--white)" }}>{label}</div>
          ))}
        </div>
      </div>
      <SearchForm onSearch={handleSearch} loading={loading} />
      {error && <div style={{ background: "var(--red-bg)", color: "var(--red)", padding: "14px 18px", borderRadius: 12, border: "1px solid #f5c0c0", marginBottom: 20 }}>{error}</div>}
      {loading && (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{ fontSize: 40, marginBottom: 12, animation: "pulse 1.5s infinite" }}>?</div>
          <div style={{ fontSize: 16, color: "var(--muted)", marginBottom: 8 }}>Searching for the smartest flights...</div>
          <div style={{ fontSize: 13, color: "var(--muted)", opacity: 0.6 }}>Comparing prices, baggage, timing and family comfort</div>
        </div>
      )}
      {results && (
        <div className="fade-up">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 8 }}>
            <div>
              <div style={{ fontFamily: "Playfair Display, serif", fontSize: 24, color: "var(--text)" }}>{meta?.origin} to {meta?.destination}</div>
              <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>{meta?.departDate}{meta?.returnDate ? ` — ${meta.returnDate}` : ""} · {(meta?.passengers?.adults || 0) + (meta?.passengers?.children || 0)} passengers</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: meta?.usingMockData ? "var(--amber)" : "var(--green)" }} />
              <span style={{ fontSize: 13, color: "var(--muted)" }}>{meta?.usingMockData ? "Demo data" : "Live prices"}</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
            {[["var(--green)","Book — great deal"],["var(--amber)","Wait — decent option"],["var(--red)","Ignore — not worth it"]].map(([c,label]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--muted)" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />{label}
              </div>
            ))}
          </div>
          {results.length === 0
            ? <div style={{ textAlign: "center", padding: 60, color: "var(--muted)" }}>No flights found.</div>
            : results.map((flight, i) => <FlightCard key={i} flight={flight} rank={i+1} animClass={`fade-up-${Math.min(i+1,5)}`} />)
          }
          <div style={{ marginTop: 32, padding: "16px 20px", background: "var(--white)", borderRadius: 12, border: "1px solid var(--border)", fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
            Prices sourced from Google Flights and may change. Click a booking link to see the latest price and complete your purchase directly. Family Wings does not sell tickets.
          </div>
        </div>
      )}
      <div style={{ marginTop: 60, textAlign: "center", fontSize: 12, color: "var(--muted)", opacity: 0.6 }}>Family Wings — smarter flights for families</div>
    </div>
  )
}
