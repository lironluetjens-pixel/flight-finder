import React, { useState, useRef, useEffect } from "react"
const AIRPORTS = [
  {code:"TLV",city:"Tel Aviv",name:"Ben Gurion",country:"Israel",aliases:["tel aviv","tlv","israel","ben gurion"]},
  {code:"BCN",city:"Barcelona",name:"El Prat",country:"Spain",aliases:["barcelona","bcn","spain"]},
  {code:"FRA",city:"Frankfurt",name:"Frankfurt Airport",country:"Germany",aliases:["frankfurt","fra","ffm","germany","fraport"]},
  {code:"LHR",city:"London",name:"Heathrow",country:"UK",aliases:["london","lhr","heathrow","england","uk"]},
  {code:"CDG",city:"Paris",name:"Charles de Gaulle",country:"France",aliases:["paris","cdg","france"]},
  {code:"AMS",city:"Amsterdam",name:"Schiphol",country:"Netherlands",aliases:["amsterdam","ams","schiphol"]},
  {code:"MAD",city:"Madrid",name:"Barajas",country:"Spain",aliases:["madrid","mad","barajas"]},
  {code:"FCO",city:"Rome",name:"Fiumicino",country:"Italy",aliases:["rome","fco","fiumicino","italy","roma"]},
  {code:"MXP",city:"Milan",name:"Malpensa",country:"Italy",aliases:["milan","mxp","malpensa","milano"]},
  {code:"ATH",city:"Athens",name:"Eleftherios Venizelos",country:"Greece",aliases:["athens","ath","greece"]},
  {code:"VIE",city:"Vienna",name:"Vienna Airport",country:"Austria",aliases:["vienna","vie","austria","wien"]},
  {code:"ZRH",city:"Zurich",name:"Zurich Airport",country:"Switzerland",aliases:["zurich","zrh","switzerland"]},
  {code:"BRU",city:"Brussels",name:"Brussels Airport",country:"Belgium",aliases:["brussels","bru","belgium"]},
  {code:"CPH",city:"Copenhagen",name:"Kastrup",country:"Denmark",aliases:["copenhagen","cph","denmark"]},
  {code:"ARN",city:"Stockholm",name:"Arlanda",country:"Sweden",aliases:["stockholm","arn","sweden"]},
  {code:"OSL",city:"Oslo",name:"Gardermoen",country:"Norway",aliases:["oslo","osl","norway"]},
  {code:"WAW",city:"Warsaw",name:"Chopin Airport",country:"Poland",aliases:["warsaw","waw","poland"]},
  {code:"PRG",city:"Prague",name:"Vaclav Havel",country:"Czech Republic",aliases:["prague","prg","czech"]},
  {code:"BUD",city:"Budapest",name:"Liszt Ferenc",country:"Hungary",aliases:["budapest","bud","hungary"]},
  {code:"DUB",city:"Dublin",name:"Dublin Airport",country:"Ireland",aliases:["dublin","dub","ireland"]},
  {code:"LIS",city:"Lisbon",name:"Humberto Delgado",country:"Portugal",aliases:["lisbon","lis","portugal","lisboa"]},
  {code:"MUC",city:"Munich",name:"Munich Airport",country:"Germany",aliases:["munich","muc","munchen"]},
  {code:"BER",city:"Berlin",name:"Brandenburg",country:"Germany",aliases:["berlin","ber","brandenburg"]},
  {code:"NCE",city:"Nice",name:"Nice Cote dAzur",country:"France",aliases:["nice","nce","riviera"]},
  {code:"DXB",city:"Dubai",name:"Dubai International",country:"UAE",aliases:["dubai","dxb","uae","emirates"]},
  {code:"JFK",city:"New York",name:"John F. Kennedy",country:"USA",aliases:["new york","jfk","kennedy","nyc"]},
  {code:"LAX",city:"Los Angeles",name:"LAX",country:"USA",aliases:["los angeles","lax","la"]},
  {code:"BKK",city:"Bangkok",name:"Suvarnabhumi",country:"Thailand",aliases:["bangkok","bkk","thailand"]},
  {code:"HKT",city:"Phuket",name:"Phuket International",country:"Thailand",aliases:["phuket","hkt"]},
  {code:"CAI",city:"Cairo",name:"Cairo International",country:"Egypt",aliases:["cairo","cai","egypt"]},
  {code:"CMN",city:"Casablanca",name:"Mohammed V",country:"Morocco",aliases:["casablanca","cmn","morocco"]},
  {code:"LCA",city:"Larnaca",name:"Larnaca Airport",country:"Cyprus",aliases:["larnaca","lca","cyprus","paphos"]},
  {code:"SKG",city:"Thessaloniki",name:"Macedonia Airport",country:"Greece",aliases:["thessaloniki","skg","salonica"]},
  {code:"HER",city:"Heraklion",name:"Nikos Kazantzakis",country:"Greece",aliases:["heraklion","her","crete","kreta"]},
  {code:"RHO",city:"Rhodes",name:"Diagoras Airport",country:"Greece",aliases:["rhodes","rho","rodos"]},
  {code:"CFU",city:"Corfu",name:"Ioannis Kapodistrias",country:"Greece",aliases:["corfu","cfu","kerkyra"]},
]
function doSearch(q) {
  if (!q||q.length<2) return []
  const lq = q.toLowerCase().trim()
  return AIRPORTS.filter(a=>a.code.toLowerCase().startsWith(lq)||a.city.toLowerCase().includes(lq)||a.country.toLowerCase().startsWith(lq)||a.aliases.some(x=>x.includes(lq))).slice(0,6)
}
export default function AirportInput({ value, onChange, placeholder, label }) {
  const [query, setQuery] = useState(value||"")
  const [sugg, setSugg] = useState([])
  const [open, setOpen] = useState(false)
  const ref = useRef()
  useEffect(()=>{ const h=(e)=>{ if(!ref.current?.contains(e.target)) setOpen(false) }; document.addEventListener("mousedown",h); return()=>document.removeEventListener("mousedown",h) },[])
  const handleChange=(e)=>{ const v=e.target.value; setQuery(v); const r=doSearch(v); setSugg(r); setOpen(r.length>0); const exact=AIRPORTS.find(a=>a.code===v.toUpperCase()); if(exact) onChange(exact.code) }
  const select=(a)=>{ setQuery(`${a.code} — ${a.city}`); onChange(a.code); setOpen(false); setSugg([]) }
  const lbl={display:"block",fontSize:11,fontWeight:500,color:"var(--gold)",letterSpacing:1,textTransform:"uppercase",marginBottom:6}
  const inp={width:"100%",padding:"12px 16px",fontSize:16,fontWeight:600,background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,outline:"none",color:"var(--white)"}
  return (
    <div ref={ref} style={{position:"relative"}}>
      <label style={lbl}>{label}</label>
      <input style={inp} value={query} onChange={handleChange} onFocus={()=>query.length>=2&&setOpen(sugg.length>0)} placeholder={placeholder} autoComplete="off" />
      {open&&sugg.length>0&&(
        <div style={{position:"absolute",top:"100%",left:0,right:0,zIndex:100,background:"#162040",border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,marginTop:4,overflow:"hidden",boxShadow:"0 8px 32px rgba(0,0,0,0.4)"}}>
          {sugg.map(a=>(
            <div key={a.code} onClick={()=>select(a)} style={{padding:"10px 16px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid rgba(255,255,255,0.06)"}}
              onMouseOver={e=>e.currentTarget.style.background="rgba(255,255,255,0.08)"}
              onMouseOut={e=>e.currentTarget.style.background="transparent"}>
              <div>
                <span style={{fontSize:15,fontWeight:700,color:"var(--gold)"}}>{a.code}</span>
                <span style={{fontSize:14,color:"rgba(255,255,255,0.8)",marginLeft:10}}>{a.city}</span>
                <span style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginLeft:6}}>{a.name}</span>
              </div>
              <span style={{fontSize:12,color:"rgba(255,255,255,0.3)"}}>{a.country}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
