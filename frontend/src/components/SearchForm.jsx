import React, { useState } from "react"
export default function SearchForm({ onSearch, loading }) {
  const [tripType, setTripType] = useState("return")
  const [form, setForm] = useState({ origin: "TLV", destination: "BCN", departDate: "", returnDate: "", adults: 2, children: 2 })
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))
  const submit = (e) => {
    e.preventDefault()
    if (!form.departDate) return alert("Please pick a departure date")
    if (tripType === "return" && !form.returnDate) return alert("Please pick a return date")
    onSearch({ ...form, tripType })
  }
  const totalPax = parseInt(form.adults || 0) + parseInt(form.children || 0)
  const tbtn = (t) => ({ padding: "8px 20px", fontSize: 13, fontWeight: 500, cursor: "pointer", border: `1px solid ${tripType === t ? "var(--gold)" : "rgba(255,255,255,0.15)"}`, borderRadius: 100, background: tripType === t ? "var(--gold)" : "transparent", color: tripType === t ? "var(--navy)" : "rgba(255,255,255,0.6)", transition: "all 0.2s" })
  const inp = { width: "100%", padding: "12px 16px", fontSize: 15, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, outline: "none", color: "var(--white)" }
  const lbl = { display: "block", fontSize: 11, fontWeight: 500, color: "var(--gold)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }
  return (
    <div style={{ background: "var(--navy)", borderRadius: "var(--radius)", padding: "40px 48px", marginBottom: 32, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -60, right: -60, width: 300, height: 300, borderRadius: "50%", background: "rgba(201,168,76,0.06)", pointerEvents: "none" }} />
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: 3, color: "var(--gold)", textTransform: "uppercase", marginBottom: 8 }}>Smart Family Travel</div>
        <div style={{ fontFamily: "Playfair Display, serif", fontSize: 36, color: "var(--white)", lineHeight: 1.2, marginBottom: 8 }}>Find Your Best Flight</div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", fontWeight: 300 }}>Ranked by price, timing, baggage and family comfort</div>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <button type="button" style={tbtn("oneway")} onClick={() => setTripType("oneway")}>One way</button>
        <button type="button" style={tbtn("return")} onClick={() => setTripType("return")}>Return</button>
      </div>
      <form onSubmit={submit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          <div><label style={lbl}>From</label><input style={{ ...inp, fontSize: 18, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }} value={form.origin} onChange={set("origin")} placeholder="TLV" /></div>
          <div><label style={lbl}>To</label><input style={{ ...inp, fontSize: 18, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }} value={form.destination} onChange={set("destination")} placeholder="BCN" /></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: tripType === "return" ? "1fr 1fr" : "1fr", gap: 12, marginBottom: 12 }}>
          <div><label style={lbl}>Departure</label><input style={{ ...inp, colorScheme: "dark" }} type="date" value={form.departDate} onChange={set("departDate")} /></div>
          {tripType === "return" && <div><label style={lbl}>Return</label><input style={{ ...inp, colorScheme: "dark" }} type="date" value={form.returnDate} onChange={set("returnDate")} /></div>}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          <div><label style={lbl}>Adults</label><input style={inp} type="number" min={1} max={9} value={form.adults} onChange={set("adults")} /></div>
          <div><label style={lbl}>Children (under 12)</label><input style={inp} type="number" min={0} max={9} value={form.children} onChange={set("children")} /></div>
        </div>
        {totalPax > 0 && <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>Searching for {form.adults} adult{form.adults != 1 ? "s" : ""}{form.children > 0 ? ` + ${form.children} child${form.children != 1 ? "ren" : ""}` : ""} — {totalPax} passengers total</div>}
        <button type="submit" disabled={loading} style={{ width: "100%", padding: 16, fontSize: 15, fontWeight: 600, background: loading ? "rgba(201,168,76,0.5)" : "var(--gold)", color: "var(--navy)", border: "none", borderRadius: 10, cursor: loading ? "not-allowed" : "pointer", transition: "all 0.2s" }}>
          {loading ? "Searching flights..." : "Find best flights"}
        </button>
      </form>
    </div>
  )
}
