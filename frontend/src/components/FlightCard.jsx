import React, { useState } from "react"

const labelColors = {
  Book:   { bg: "#dcfce7", text: "#166534", border: "#bbf7d0" },
  Wait:   { bg: "#fef9c3", text: "#854d0e", border: "#fef08a" },
  Ignore: { bg: "#fee2e2", text: "#991b1b", border: "#fecaca" },
}
const scoreColor = (s) => s >= 70 ? "#16a34a" : s >= 45 ? "#ca8a04" : "#dc2626"
const fmt = (iso) => { try { return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) } catch { return "--" } }
const dur = (m) => m ? `${Math.floor(m / 60)}h ${m % 60}m` : ""

export default function FlightCard({ flight: f, rank }) {
  const [open, setOpen] = useState(false)
  const lc = labelColors[f.label] || labelColors.Wait

  return (
    <div style={{ background: "#fff", borderRadius: 14, marginBottom: 14, border: `1px solid ${f.label === "Book" ? "#bbf7d0" : "#e8e8e4"}`, overflow: "hidden" }}>
      <div style={{ padding: "20px 24px" }}>

        {/* Main row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>

          {/* Airline + label */}
          <div style={{ minWidth: 120 }}>
            <div style={{ fontSize: 17, fontWeight: 600, color: "#111" }}>{f.airline}</div>
            <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>{f.flightNumber}</div>
            <div style={{ display: "inline-block", marginTop: 6, fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: lc.bg, color: lc.text, border: `1px solid ${lc.border}` }}>{f.label}</div>
          </div>

          {/* Departure */}
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#111" }}>{fmt(f.departureTime)}</div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{f.origin}</div>
          </div>

          {/* Route */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <div style={{ fontSize: 12, color: "#888" }}>
              {f.stops === 0 ? "Direct" : `${f.stops} stop${f.stops > 1 ? "s" : ""}${f.stopCity ? ` via ${f.stopCity}` : ""}`}
            </div>
            <div style={{ width: "100%", height: 1, background: "#ddd" }} />
            <div style={{ fontSize: 12, color: "#aaa" }}>{dur(f.durationMinutes)}</div>
          </div>

          {/* Arrival */}
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#111" }}>{fmt(f.arrivalTime)}</div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{f.destination}</div>
          </div>

          {/* Price */}
          <div style={{ textAlign: "right", minWidth: 100 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#111" }}>${Math.round(f.pricePerAdult)}</div>
            <div style={{ fontSize: 12, color: "#888" }}>per adult</div>
            {f.pricePerChild && f.pricePerChild < f.pricePerAdult && (
              <div style={{ fontSize: 12, color: "#16a34a", marginTop: 2 }}>${Math.round(f.pricePerChild)} per child</div>
            )}
            <div style={{ fontSize: 12, color: "#aaa", marginTop: 2 }}>${Math.round(f.totalPrice)} total</div>
          </div>

          {/* Score */}
          <div style={{ textAlign: "center", minWidth: 52 }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: scoreColor(f.dealScore) }}>{Math.round(f.dealScore)}</div>
            <div style={{ fontSize: 11, color: "#aaa", textTransform: "uppercase", letterSpacing: 0.5 }}>score</div>
          </div>

          <div style={{ fontSize: 11, color: "#ccc" }}>#{rank}</div>
        </div>

        {/* Tags row */}
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid #f0f0ec", display: "flex", flexWrap: "wrap", gap: 10 }}>
          <span style={{ fontSize: 13, color: "#555" }}>
            {f.baggageIncluded ? "[bag]" : "[!]"} {f.baggageDetails}
          </span>
          {f.seatsTogether === true && (
            <span style={{ fontSize: 13, color: "#16a34a" }}>[ok] Family seating guaranteed</span>
          )}
          {f.seatsTogether === false && (
            <span style={{ fontSize: 13, color: "#dc2626" }}>[!] Must pay to sit together</span>
          )}
          {f.seatsAvailable > 0 && (
            <span style={{ fontSize: 13, color: f.seatsAvailable <= 3 ? "#dc2626" : "#888" }}>
              {f.seatsAvailable <= 3 ? `Only ${f.seatsAvailable} seats left` : `${f.seatsAvailable} seats available`}
            </span>
          )}
        </div>

        {/* Score breakdown toggle */}
        {f.reasons?.length > 0 && (
          <button onClick={() => setOpen(o => !o)} style={{ marginTop: 10, fontSize: 13, color: "#2563eb", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            {open ? "Hide score breakdown" : "Why this score?"}
          </button>
        )}
      </div>

      {/* Score breakdown */}
      {open && f.reasons && (
        <div style={{ background: "#f8f8f6", borderTop: "1px solid #eee", padding: "12px 24px" }}>
          <div style={{ fontSize: 12, color: "#888", marginBottom: 8, fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.5 }}>Score factors</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {f.reasons.map((r, i) => (
              <span key={i} style={{ fontSize: 12, padding: "3px 10px", borderRadius: 20, background: "#fff", border: "1px solid #e0e0e0", color: "#444" }}>{r}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
