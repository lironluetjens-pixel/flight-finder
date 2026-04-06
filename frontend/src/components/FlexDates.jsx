import React, { useState, useEffect } from "react"
const API = import.meta.env.VITE_API_URL || ""
function getDates(base,range=7){const dates=[],b=new Date(base);for(let i=-range;i<=range;i++){const d=new Date(b);d.setDate(d.getDate()+i);dates.push({iso:d.toISOString().split("T")[0],weekday:d.toLocaleDateString("en-GB",{weekday:"short"}),day:d.getDate(),month:d.toLocaleDateString("en-GB",{month:"short"}),offset:i})}return dates}
function priceColor(price,min,max){if(!price)return null;const r=(price-min)/(max-min||1);if(r<0.33)return"#2ecc71";if(r<0.66)return"#f39c12";return"#e74c3c"}
export default function FlexDates({baseDate,selectedDate,onSelect,origin,destination,label}){
  const[open,setOpen]=useState(false),[prices,setPrices]=useState({}),[loading,setLoading]=useState(false);
  useEffect(()=>{if(!open||!origin||!destination||!baseDate)return;setLoading(true);fetch(`${API}/api/prices`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({origin,destination,baseDate,adults:1})}).then(r=>r.json()).then(data=>{setPrices(data.prices||{});setLoading(false)}).catch(()=>setLoading(false))},[open,origin,destination,baseDate]);
  if(!baseDate)return null;
  const dates=getDates(baseDate),pv=Object.values(prices).filter(Boolean),minP=pv.length?Math.min(...pv):0,maxP=pv.length?Math.max(...pv):0;
  return(
    <div style={{marginTop:6}}>
      <button type="button" onClick={()=>setOpen(o=>!o)} style={{fontSize:12,fontWeight:500,color:open?"var(--gold)":"rgba(255,255,255,0.5)",background:open?"rgba(201,168,76,0.12)":"transparent",border:`1px solid ${open?"rgba(201,168,76,0.3)":"rgba(255,255,255,0.1)"}`,borderRadius:100,padding:"4px 12px",cursor:"pointer",transition:"all 0.2s",display:"inline-flex",alignItems:"center",gap:5,outline:"none"}}>
        <span style={{fontSize:10}}>{open?"?":"?"}</span>Flexible {label||"dates"}
      </button>
      {open&&(
        <div style={{marginTop:8,background:"rgba(0,0,0,0.25)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,padding:12,minHeight:90}}>
          <div style={{display:"flex",gap:4,overflowX:"auto",paddingBottom:6,scrollbarWidth:"thin",scrollbarColor:"rgba(255,255,255,0.15) transparent"}}>
            {dates.map(d=>{
              const isSel=d.iso===selectedDate,isBase=d.offset===0,price=prices[d.iso],pc=priceColor(price,minP,maxP);
              return(
                <button key={d.iso} type="button" onClick={()=>{onSelect(d.iso);setOpen(false)}}
                  style={{minWidth:54,maxWidth:54,padding:"6px 2px",flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",gap:2,border:`1.5px solid ${isSel?"var(--gold)":isBase?"rgba(255,255,255,0.3)":"rgba(255,255,255,0.07)"}`,borderRadius:8,cursor:"pointer",background:isSel?"var(--gold)":isBase?"rgba(255,255,255,0.05)":"transparent",transition:"all 0.15s",outline:"none"}}
                  onMouseOver={e=>{if(!isSel)e.currentTarget.style.background="rgba(255,255,255,0.08)"}}
                  onMouseOut={e=>{if(!isSel)e.currentTarget.style.background=isBase?"rgba(255,255,255,0.05)":"transparent"}}>
                  <span style={{fontSize:9,color:isSel?"var(--navy)":"rgba(255,255,255,0.4)",fontWeight:500,lineHeight:1}}>{d.weekday}</span>
                  <span style={{fontSize:16,fontWeight:700,color:isSel?"var(--navy)":isBase?"var(--gold)":"rgba(255,255,255,0.9)",lineHeight:1.1}}>{d.day}</span>
                  <span style={{fontSize:9,color:isSel?"var(--navy)":"rgba(255,255,255,0.35)",lineHeight:1}}>{d.month}</span>
                  <span style={{height:16,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    {loading?<span style={{width:5,height:5,borderRadius:"50%",background:"rgba(255,255,255,0.15)"}}/>:price?<span style={{fontSize:8,fontWeight:700,color:isSel?"var(--navy)":pc||"rgba(255,255,255,0.5)"}}>${Math.round(price)}</span>:isBase?<span style={{width:4,height:4,borderRadius:"50%",background:"var(--gold)",opacity:0.6}}/>:<span style={{width:3,height:3,borderRadius:"50%",background:"rgba(255,255,255,0.1)"}}/>}
                  </span>
                </button>
              )
            })}
          </div>
          {pv.length>0&&(
            <div style={{display:"flex",gap:14,marginTop:8,paddingLeft:2}}>
              {[["#2ecc71","Cheapest"],["#f39c12","Mid range"],["#e74c3c","Expensive"]].map(([c,l])=>(
                <div key={l} style={{display:"flex",alignItems:"center",gap:4}}>
                  <span style={{width:6,height:6,borderRadius:"50%",background:c,display:"inline-block",flexShrink:0}}/>
                  <span style={{fontSize:10,color:"rgba(255,255,255,0.35)"}}>{l}</span>
                </div>
              ))}
            </div>
          )}
          {loading&&!pv.length&&<div style={{fontSize:11,color:"rgba(255,255,255,0.3)",marginTop:6}}>Loading prices...</div>}
        </div>
      )}
    </div>
  )
}
