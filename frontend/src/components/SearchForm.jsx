import React, { useState } from "react"
export default function SearchForm({ onSearch, loading }) {
  const [tripType, setTripType] = useState("return")
  const [form, setForm] = useState({ origin: "TLV", destination: "BCN", departDate: "", returnDate: "", adults: 2 })
  const [childAges, setChildAges] = useState([3, 6])
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))
  const addChild = () => setChildAges(a => [...a, 5])
  const removeChild = (i) => setChildAges(a => a.filter((_, idx) => idx !== i))
  const setAge = (i, val) => setChildAges(a => a.map((v, idx) => idx === i ? parseInt(val) || 0 : v))
  const submit = (e) => { e.preventDefault(); if (!form.departDate) return alert("Please pick a departure date"); if (tripType === "return" && !form.returnDate) return alert("Please pick a return date"); onSearch({ ...form, tripType, children: childAges.length, childAges }) }
  const totalPax = parseInt(form.adults || 0) + childAges.length
  const inp = { width: "100%", padding: "12px 16px", fontSize: 15, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, outline: "none", color: "var(--white)" }
  const lbl = { display: "block", fontSize: 11, fontWeight: 500, color: "var(--gold)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }
  const tbtn = (t) => ({ padding: "8px 20px", fontSize: 13, fontWeight: 500, cursor: "pointer", border: `1px solid ${tripType === t ? "var(--gold)" : "rgba(255,255,255,0.15)"}`, borderRadius: 100, background: tripType === t ? "var(--gold)" : "transparent", color: tripType === t ? "var(--navy)" : "rgba(255,255,255,0.6)" })
  return (
    <div style={{ background: "var(--navy)", borderRadius: "var(--radius)", padding: "40px 48px", marginBottom: 32, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -60, right: -60, width: 300, height: 300, borderRadius: "50%", background: "rgba(201,168,76,0.06)", pointerEvents: "none" }} />
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: 3, color: "var(--gold)", textTransform: "uppercase", marginBottom: 8 }}>Smart Family Travel</div>
        <div style={{ fontFamily: "Playfair Display, serif", fontSize: 36, color: "var(--white)", lineHeight: 1.2, marginBottom: 8 }}>Find Your Best Flight</div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>Ranked by price, timing, baggage and family comfort</div>
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
        <div style={{ marginBottom: 16 }}>
          <label style={lbl}>Adults</label>
          <input style={{ ...inp, width: "50%" }} type="number" min={1} max={9} value={form.adults} onChange={set("adults")} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <label style={lbl}>Children & ages</label>
            <button type="button" onClick={addChild} style={{ fontSize: 12, padding: "4px 12px", background: "rgba(201,168,76,0.2)", color: "var(--gold)", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 100, cursor: "pointer" }}>+ Add child</button>
          </div>
          {childAges.length === 0 && <div style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>No children added.</div>}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {childAges.map((age, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "8px 12px" }}>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Child {i+1}</span>
                <input type="number" min={0} max={17} value={age} onChange={e => setAge(i, e.target.value)} style={{ width: 48, padding: "4px 8px", fontSize: 14, fontWeight: 600, background: "transparent", border: "none", outline: "none", color: "var(--white)", textAlign: "center" }} />
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>yrs</span>
                <button type="button" onClick={() => removeChild(i)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: 16, padding: 0 }}>x</button>
              </div>
            ))}
          </div>
          {childAges.some(a => a >= 12) && <div style={{ marginTop: 8, fontSize: 12, color: "var(--gold)", opacity: 0.8 }}>Children 12+ may be priced as adults depending on the airline.</div>}
        </div>
        {totalPax > 0 && <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>{form.adults} adult{form.adults != 1 ? "s" : ""}{childAges.length > 0 ? ` + ${childAges.length} child${childAges.length !== 1 ? "ren" : ""} (ages ${childAges.join(", ")})` : ""} — {totalPax} passengers total</div>}
        <button type="submit" disabled={loading} style={{ width: "100%", padding: 16, fontSize: 15, fontWeight: 600, background: loading ? "rgba(201,168,76,0.5)" : "var(--gold)", color: "var(--navy)", border: "none", borderRadius: 10, cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? "Searching flights..." : "Find best flights"}
        </button>
      </form>
    </div>
  )
}
