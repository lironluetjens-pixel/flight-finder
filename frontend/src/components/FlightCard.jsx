import React, { useState } from "react"
const LABEL = { Book: { bg: "var(--green-bg)", text: "var(--green)", border: "#b2dfc4", dot: "#1a7a4a" }, Wait: { bg: "var(--amber-bg)", text: "var(--amber)", border: "#f0d898", dot: "#c9a84c" }, Ignore: { bg: "var(--red-bg)", text: "var(--red)", border: "#f5c0c0", dot: "#9a1f1f" } }
const sc = (s) => s >= 70 ? "var(--green)" : s >= 45 ? "var(--amber)" : "var(--red)"
const fmt = (iso) => { try { const d = new Date(iso); if (isNaN(d)) return "--"; return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) } catch { return "--" } }
const dur = (m) => { if (!m) return ""; return `${Math.floor(m/60)}h${m%60>0?` ${m%60}m`:""}` }
function Tag({ children, color }) {
  const c = { green:{bg:"var(--green-bg)",text:"var(--green)",border:"#b2dfc4"}, red:{bg:"var(--red-bg)",text:"var(--red)",border:"#f5c0c0"}, neutral:{bg:"#f0f0ec",text:"var(--muted)",border:"var(--border)"} }[color]||{bg:"#f0f0ec",text:"var(--muted)",border:"var(--border)"}
  return <span style={{fontSize:12,padding:"4px 10px",borderRadius:100,background:c.bg,color:c.text,border:`1px solid ${c.border}`,fontWeight:500}}>{children}</span>
}
function BookingLinks({ f }) {
  const date = f.departureTime?.split("T")[0] || ""
  const dateShort = date.replace(/-/g,"")
  const links = [
    { label:"Google Flights", color:"#4285f4", url:`https://www.google.com/travel/flights?q=${encodeURIComponent(`${f.origin} to ${f.destination} ${date}`)}` },
    { label:"Skyscanner", color:"#0770e3", url:`https://www.skyscanner.net/transport/flights/${(f.origin||"").toLowerCase()}/${(f.destination||"").toLowerCase()}/${dateShort}` },
    { label:"Kayak", color:"#ff690f", url:`https://www.kayak.com/flights/${f.origin}-${f.destination}/${date}` },
  ]
  return (
    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
      {links.map(l=>(
        <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer"
          style={{padding:"7px 14px",fontSize:12,fontWeight:600,background:l.color,color:"#fff",borderRadius:7,textDecoration:"none",transition:"opacity 0.15s"}}
          onMouseOver={e=>e.currentTarget.style.opacity="0.8"} onMouseOut={e=>e.currentTarget.style.opacity="1"}
        >{l.label}</a>
      ))}
    </div>
  )
}
export default function FlightCard({ flight: f, rank, animClass }) {
  const [open, setOpen] = useState(false)
  const lc = LABEL[f.label] || LABEL.Wait
  return (
    <div className={animClass} style={{background:"var(--white)",borderRadius:"var(--radius)",marginBottom:16,border:`1px solid ${f.label==="Book"?"#b2dfc4":"var(--border)"}`,boxShadow:f.label==="Book"?"0 4px 20px rgba(26,122,74,0.1)":"var(--shadow)",overflow:"hidden",transition:"transform 0.15s"}}
      onMouseOver={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseOut={e=>e.currentTarget.style.transform=""}>
      {f.label==="Book"&&<div style={{height:3,background:"linear-gradient(90deg,var(--green),#4abe82)"}}/>}
      <div style={{padding:"24px 28px"}}>
        <div style={{display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
          <div style={{minWidth:130}}>
            <div style={{fontSize:11,color:"var(--muted)",marginBottom:4}}>#{rank}</div>
            <div style={{fontSize:18,fontWeight:600}}>{f.airline}</div>
            <div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>{f.flightNumber}</div>
            <div style={{display:"inline-flex",alignItems:"center",gap:5,marginTop:8,fontSize:12,fontWeight:600,padding:"4px 10px",borderRadius:100,background:lc.bg,color:lc.text,border:`1px solid ${lc.border}`}}>
              <span style={{width:6,height:6,borderRadius:"50%",background:lc.dot,display:"inline-block"}}/>{f.label}
            </div>
          </div>
          <div style={{flex:1,display:"flex",alignItems:"center",gap:12,minWidth:260}}>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:26,fontWeight:700,letterSpacing:-0.5}}>{fmt(f.departureTime)}</div>
              <div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>{f.origin}</div>
            </div>
            <div style={{flex:1,textAlign:"center"}}>
              <div style={{fontSize:11,color:"var(--muted)",marginBottom:4}}>{f.stops===0?"Direct":`${f.stops} stop${f.stops>1?"s":""}${f.stopCity?` · ${f.stopCity}`:""}`}</div>
              <div style={{height:1,background:"var(--border)",position:"relative"}}><div style={{position:"absolute",right:-4,top:-4,width:8,height:8,borderTop:"1px solid var(--muted)",borderRight:"1px solid var(--muted)",transform:"rotate(45deg)"}}/></div>
              <div style={{fontSize:11,color:"var(--muted)",marginTop:4}}>{dur(f.durationMinutes)}</div>
            </div>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:26,fontWeight:700,letterSpacing:-0.5}}>{fmt(f.arrivalTime)}</div>
              <div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>{f.destination}</div>
            </div>
          </div>
          <div style={{textAlign:"right",minWidth:110}}>
            <div style={{fontSize:28,fontWeight:700,letterSpacing:-0.5}}>${Math.round(f.pricePerAdult)}</div>
            <div style={{fontSize:12,color:"var(--muted)"}}>per adult</div>
            {f.pricePerChild&&f.pricePerChild<f.pricePerAdult&&<div style={{fontSize:12,color:"var(--green)",marginTop:2,fontWeight:500}}>${Math.round(f.pricePerChild)} per child</div>}
            <div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>${Math.round(f.totalPrice)} total</div>
          </div>
          <div style={{textAlign:"center",minWidth:60,padding:"8px 12px",background:"var(--cream)",borderRadius:12}}>
            <div style={{fontSize:30,fontWeight:700,color:sc(f.dealScore),lineHeight:1}}>{Math.round(f.dealScore)}</div>
            <div style={{fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:0.5,marginTop:2}}>score</div>
          </div>
        </div>
        <div style={{marginTop:16,paddingTop:16,borderTop:"1px solid var(--border)",display:"flex",flexWrap:"wrap",gap:8}}>
          <Tag color={f.baggageIncluded?"green":"red"}>{f.baggageIncluded?"Baggage included":"No checked bag"} — {f.baggageDetails}</Tag>
          {f.seatsTogether===true&&<Tag color="green">Family seating guaranteed</Tag>}
          {f.seatsTogether===false&&<Tag color="red">Must pay to sit together</Tag>}
          {f.seatsAvailable>0&&<Tag color={f.seatsAvailable<=3?"red":"neutral"}>{f.seatsAvailable<=3?`Only ${f.seatsAvailable} seats left`:`${f.seatsAvailable} seats`}</Tag>}
        </div>
        <div style={{marginTop:16,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
          <BookingLinks f={f} />
          {f.reasons?.length>0&&<button onClick={()=>setOpen(o=>!o)} style={{fontSize:13,color:"var(--muted)",background:"none",border:"none",cursor:"pointer",padding:0,textDecoration:"underline"}}>{open?"Hide breakdown":"Why this score?"}</button>}
        </div>
      </div>
      {open&&f.reasons&&(
        <div style={{background:"var(--cream)",borderTop:"1px solid var(--border)",padding:"16px 28px"}}>
          <div style={{fontSize:11,color:"var(--muted)",marginBottom:10,fontWeight:500,textTransform:"uppercase",letterSpacing:0.5}}>Score breakdown</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {f.reasons.map((r,i)=><span key={i} style={{fontSize:12,padding:"4px 12px",borderRadius:100,background:"var(--white)",border:"1px solid var(--border)",color:"var(--text)"}}>{r}</span>)}
          </div>
        </div>
      )}
    </div>
  )
}
