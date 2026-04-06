import React, { useState, useEffect, useRef } from "react"
const API = import.meta.env.VITE_API_URL || ""
function getDates(base,range=7){const dates=[],b=new Date(base);for(let i=-range;i<=range;i++){const d=new Date(b);d.setDate(d.getDate()+i);dates.push({iso:d.toISOString().split("T")[0],weekday:d.toLocaleDateString("en-GB",{weekday:"short"}),day:d.getDate(),month:d.toLocaleDateString("en-GB",{month:"short"}),offset:i})}return dates}
function priceColor(price,min,max){if(!price)return"rgba(255,255,255,0.2)";const r=(price-min)/(max-min||1);if(r<0.33)return"#2ecc71";if(r<0.66)return"#f39c12";return"#e74c3c"}
export default function FlexDates({baseDate,selectedDate,onSelect,origin,destination,label}){
  const[open,setOpen]=useState(false),[prices,setPrices]=useState({}),[loading,setLoading]=useState(false);
  const scrollRef=useRef();
  useEffect(()=>{if(!open||!origin||!destination||!baseDate)return;setLoading(true);fetch(`${API}/api/prices`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({origin,destination,baseDate,adults:1})}).then(r=>r.json()).then(data=>{setPrices(data.prices||{});setLoading(false)}).catch(()=>setLoading(false))},[open,origin,destination,baseDate]);
  useEffect(()=>{if(open&&scrollRef.current){const sel=scrollRef.current.querySelector("[data-selected=true]");if(sel)sel.scrollIntoView({inline:"center",behavior:"smooth"})}},[open]);
  if(!baseDate)return null;
  const dates=getDates(baseDate),pv=Object.values(prices).filter(Boolean),minP=Math.min(...pv),maxP=Math.max(...pv);
  return(
    <div style={{marginTop:8}}>
      <button type="button" onClick={()=>setOpen(e=>!e)} style={{fontSize:12,color:open?"var(--gold)":"rgba(255,255,255,0.45)",background:"none",border:"none",cursor:"pointer",padding:0,display:"flex",alignItems:"center",gap:5}}>
        <span style={{fontSize:10}}>{open?"?":"?"}</span>Flexible dates{label?` · ${label}`:""}
        {open&&pv.length>0&&<span style={{fontSize:10,opacity:0.5}}> · price by day</span>}
      </button>
      {open&&(
        <div style={{marginTop:8,background:"rgba(0,0,0,0.2)",borderRadius:12,padding:"12px 8px",border:"1px solid rgba(255,255,255,0.08)"}}>
          <div ref={scrollRef} style={{display:"flex",gap:4,overflowX:"auto",paddingBottom:4,scrollbarWidth:"thin",scrollbarColor:"rgba(255,255,255,0.1) transparent"}}>
            {dates.map(d=>{
              const isSel=d.iso===selectedDate,isBase=d.offset===0,price=prices[d.iso],dot=priceColor(price,minP,maxP);
              return(
                <button key={d.iso} type="button" data-selected={isSel} onClick={()=>onSelect(d.iso)} style={{minWidth:52,padding:"8px 4px",display:"flex",flexDirection:"column",alignItems:"center",gap:3,border:`1px solid ${isSel?"var(--gold)":isBase?"rgba(255,255,255,0.25)":"rgba(255,255,255,0.08)"}`,borderRadius:8,cursor:"pointer",flexShrink:0,background:isSel?"var(--gold)":isBase?"rgba(255,255,255,0.06)":"transparent",transition:"all 0.15s"}}
                  onMouseOver={e=>{if(!isSel)e.currentTarget.style.background="rgba(255,255,255,0.08)"}}
                  onMouseOut={e=>{if(!isSel)e.currentTarget.style.background=isBase?"rgba(255,255,255,0.06)":"transparent"}}>
                  <span style={{fontSize:10,color:isSel?"var(--navy)":"rgba(255,255,255,0.45)",fontWeight:500}}>{d.weekday}</span>
                  <span style={{fontSize:15,fontWeight:700,color:isSel?"var(--navy)":isBase?"var(--gold)":"rgba(255,255,255,0.85)",lineHeight:1}}>{d.day}</span>
                  <span style={{fontSize:9,color:isSel?"var(--navy)":"rgba(255,255,255,0.35)"}}>{d.month}</span>
                  {loading?<span style={{width:6,height:6,borderRadius:"50%",background:"rgba(255,255,255,0.15)"}}/>:price?<span style={{fontSize:9,color:isSel?"var(--navy)":dot,fontWeight:600}}>${Math.round(price)}</span>:<span style={{width:4,height:4,borderRadius:"50%",background:isBase?"var(--gold)":"rgba(255,255,255,0.15)"}}/>}
                </button>
              )
            })}
          </div>
          {pv.length>0&&(
            <div style={{display:"flex",gap:12,marginTop:8,paddingLeft:4}}>
              {[["#2ecc71","Cheapest"],["#f39c12","Average"],["#e74c3c","Expensive"]].map(([c,l])=>(
                <div key={l} style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:"rgba(255,255,255,0.4)"}}>
                  <span style={{width:6,height:6,borderRadius:"50%",background:c,display:"inline-block"}}/>{l}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
