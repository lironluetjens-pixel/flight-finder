import React, { useState, useEffect } from "react"
const STEPS = [
  { label: "Connecting to flight database", duration: 800 },
  { label: "Searching available routes", duration: 1200 },
  { label: "Fetching real-time prices", duration: 2000 },
  { label: "Checking baggage policies", duration: 800 },
  { label: "Analysing family comfort scores", duration: 700 },
  { label: "Ranking your top 5 flights", duration: 500 },
]
const TOTAL = STEPS.reduce((s, step) => s + step.duration, 0)
export default function SearchProgress() {
  const [elapsed, setElapsed] = useState(0)
  const [stepIdx, setStepIdx] = useState(0)
  useEffect(() => {
    const start = Date.now()
    const interval = setInterval(() => {
      const e = Date.now() - start
      setElapsed(e)
      let acc = 0
      for (let i = 0; i < STEPS.length; i++) {
        acc += STEPS[i].duration
        if (e < acc) { setStepIdx(i); break }
        if (i === STEPS.length - 1) setStepIdx(i)
      }
    }, 50)
    return () => clearInterval(interval)
  }, [])
  const pct = Math.round(Math.min(elapsed / TOTAL, 0.95) * 100)
  const step = STEPS[stepIdx] || STEPS[STEPS.length - 1]
  return (
    <div style={{ background: "var(--white)", borderRadius: "var(--radius)", padding: "36px 40px", border: "1px solid var(--border)", boxShadow: "var(--shadow)", marginBottom: 24 }}>
      <style>{`@keyframes planeFly { 0%{transform:translateX(-8px) rotate(-3deg)} 50%{transform:translateX(8px) rotate(3deg)} 100%{transform:translateX(-8px) rotate(-3deg)} }`}</style>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 36, display: "inline-block", animation: "planeFly 2s ease-in-out infinite" }}>?</div>
      </div>
      <div style={{ height: 6, background: "var(--border)", borderRadius: 100, overflow: "hidden", marginBottom: 16 }}>
        <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg, var(--navy), var(--gold))", borderRadius: 100, transition: "width 0.2s ease" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: "var(--muted)" }}>{step.label}...</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--navy)" }}>{pct}%</div>
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {STEPS.map((s, i) => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 100, background: i <= stepIdx ? "var(--navy)" : "var(--border)", transition: "background 0.3s ease" }} />
        ))}
      </div>
      <div style={{ marginTop: 16, fontSize: 12, color: "var(--muted)", textAlign: "center", opacity: 0.6 }}>
        Checking 6 family comfort factors — usually takes 5–8 seconds
      </div>
    </div>
  )
}
