import React, { useState } from "react"

export default function SearchForm({ onSearch, loading }) {
  const [tripType, setTripType] = useState("return")
  const [form, setForm] = useState({
    origin: "TLV", destination: "BCN",
    departDate: "", returnDate: "",
    adults: 2, children: 2,
  })

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    if (!form.departDate) return alert("Please pick a departure date")
    if (tripType === "return" && !form.returnDate) return alert("Please pick a return date")
    onSearch({ ...form, tripType })
  }

  const btn = (active) => ({
    padding: "8px 20px", fontSize: 14, fontWeight: 500, cursor: "pointer", border: "none",
    background: active ? "#2563eb" : "#fff", color: active ? "#fff" : "#555", transition: "all 0.15s",
  })

  const inp = {
    width: "100%", padding: "10px 14px", fontSize: 15,
    border: "1px solid #ddd", borderRadius: 8, outline: "none",
  }

  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: 32, border: "1px solid #e8e8e4", marginBottom: 32 }}>
      <div style={{ fontSize: 28, fontWeight: 600, marginBottom: 6, color: "#111" }}>Flight Finder</div>
      <div style={{ fontSize: 15, color: "#666", marginBottom: 24 }}>
        Smart flights for a family of 4 (2 adults + children ages 3 &amp; 6) — ranked by price, timing, baggage &amp; family comfort
      </div>

      {/* Trip type toggle */}
      <div style={{ display: "flex", gap: 0, marginBottom: 24, border: "1px solid #ddd", borderRadius: 8, overflow: "hidden", width: "fit-content" }}>
        <button type="button" style={btn(tripType === "oneway")} onClick={() => setTripType("oneway")}>One way</button>
        <button type="button" style={btn(tripType === "return")} onClick={() => setTripType("return")}>Return</button>
      </div>

      <form onSubmit={submit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#555", marginBottom: 6 }}>From</label>
            <input style={inp} value={form.origin} onChange={set("origin")} placeholder="TLV" />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#555", marginBottom: 6 }}>To</label>
            <input style={inp} value={form.destination} onChange={set("destination")} placeholder="BCN" />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#555", marginBottom: 6 }}>Departure</label>
            <input style={inp} type="date" value={form.departDate} onChange={set("departDate")} />
          </div>
          {tripType === "return" && (
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#555", marginBottom: 6 }}>Return</label>
              <input style={inp} type="date" value={form.returnDate} onChange={set("returnDate")} />
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#555", marginBottom: 6 }}>Adults</label>
              <input style={inp} type="number" min={1} max={9} value={form.adults} onChange={set("adults")} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#555", marginBottom: 6 }}>Children</label>
              <input style={inp} type="number" min={0} max={9} value={form.children} onChange={set("children")} />
            </div>
          </div>
        </div>

        {/* Family context reminder */}
        <div style={{ fontSize: 13, color: "#555", marginBottom: 16, padding: "10px 14px", background: "#f0fdf4", borderRadius: 8, border: "1px solid #bbf7d0" }}>
          Scoring accounts for: checked baggage (x4 pax), family seating, airline service quality, and child-friendly departure times
        </div>

        <button style={{ width: "100%", padding: 14, fontSize: 16, fontWeight: 600, background: "#2563eb", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer" }} type="submit" disabled={loading}>
          {loading ? "Searching..." : "Find best flights"}
        </button>
      </form>
    </div>
  )
}
