import React, { useState } from "react"
function getDates(base, range=7) {
  const dates=[]; const b=new Date(base);
  for(let i=-range;i<=range;i++){const d=new Date(b);d.setDate(d.getDate()+i);dates.push({iso:d.toISOString().split("T")[0],label:d.toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"}),offset:i})}
  return dates;
}
export default function FlexDates({baseDate,selectedDate,onSelect,label}){
  const [open,setOpen]=useState(false)
  if(!baseDate) return null
  const dates=getDates(baseDate)
  return(
    <div style={{marginTop:10,marginBottom:4}}>
      <button type="button" onClick={()=>setOpen(e=>!e)} style={{fontSize:12,color:"var(--gold)",background:"rgba(201,168,76,0.15)",border:"1px solid rgba(201,168,76,0.25)",borderRadius:100,padding:"5px 14px",cursor:"pointer"}}>
        {open?"Hide":"Show"} flexible dates {label?`(${label})`:""}
      </button>
      {open&&(
        <div style={{marginTop:10}}>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginBottom:8}}>Select alternative date within 7 days</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {dates.map(d=>{
              const sel=d.iso===selectedDate; const isBase=d.offset===0;
              return(
                <button key={d.iso} type="button" onClick={()=>onSelect(d.iso)} style={{padding:"6px 12px",fontSize:12,fontWeight:isBase?600:400,border:`1px solid ${sel?"var(--gold)":isBase?"rgba(255,255,255,0.3)":"rgba(255,255,255,0.1)"}`,borderRadius:8,cursor:"pointer",background:sel?"var(--gold)":isBase?"rgba(255,255,255,0.08)":"transparent",color:sel?"var(--navy)":"rgba(255,255,255,0.7)"}}>
                  {d.label}{isBase&&<span style={{marginLeft:4,fontSize:10,opacity:0.7}}>?</span>}{d.offset>0&&<span style={{marginLeft:4,fontSize:10,opacity:0.5}}>+{d.offset}d</span>}{d.offset<0&&<span style={{marginLeft:4,fontSize:10,opacity:0.5}}>{d.offset}d</span>}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
