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
    try {
      const { data } = await axios.post(`${API}/api/search`, formData)
      setResults(data.results); setMeta(data)
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.")
    } finally { setLoading(false) }
  }
  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 20px 80px" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: 3, color: "var(--gold)", textTransform: "uppercase" }}>Powered by real flight data</div>
      </div>
      <SearchForm onSearch={handleSearch} loading={loading} />
      {error && <div style={{ background: "var(--red-bg)", color: "var(--red)", padding: "14px 18px", borderRadius: 12, border: "1px solid #f5c0c0", marginBottom: 20 }}>{error}</div>}
      {loading && (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{ fontSize: 32, marginBottom: 12, animation: "pulse 1.5s infinite" }}>?</div>
          <div style={{ fontSize: 16, color: "var(--muted)" }}>Finding the smartest flights...</div>
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
            {[["var(--green)", "Book — great deal"], ["var(--amber)", "Wait — decent option"], ["var(--red)", "Ignore — not worth it"]].map(([c, label]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--muted)" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />{label}
              </div>
            ))}
          </div>
          {results.length === 0
            ? <div style={{ textAlign: "center", padding: 60, color: "var(--muted)" }}>No flights found.</div>
            : results.map((flight, i) => <FlightCard key={i} flight={flight} rank={i + 1} animClass={`fade-up-${Math.min(i+1,5)}`} />)
          }
        </div>
      )}
    </div>
  )
}
