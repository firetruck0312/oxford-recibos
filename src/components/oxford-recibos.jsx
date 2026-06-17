import { useState, useMemo } from "react";

// ─── BRAND TOKENS (Oxford identity) ─────────────────────────────────────────
const B = {
  green:     "#8DC63F",
  greenDark: "#6BA028",
  greenDeep: "#4d7a1a",
  greenLight:"#BEDE6A",
  greenBg:   "#f0f8e8",
  orange:    "#F5A623",
  orangeAlt: "#E8892A",
  yellow:    "#F5E642",
  white:     "#FFFFFF",
  dark:      "#1a2e0a",
  darkMid:   "#2d4a12",
  text:      "#1e3a0a",
  muted:     "#5a7a3a",
  border:    "rgba(141,198,63,0.25)",
  shadow:    "rgba(109,160,40,0.18)",
};

const MESES_ORDEN = ["AGT","SEPT","OCT","NOV","DIC","ENE","FEB","MAR","ABR","MAY","JUN"];
const MESES_LABEL = { AGT:"Agosto", SEPT:"Septiembre", OCT:"Octubre", NOV:"Noviembre", DIC:"Diciembre", ENE:"Enero", FEB:"Febrero", MAR:"Marzo", ABR:"Abril", MAY:"Mayo", JUN:"Junio" };
const CONCEPTOS_EXTRA = { INSC:"Inscripción", MTTO:"Mantenimiento", GTO_APERT:"Gastos de Apertura", "50DLLS":"50 Dólares", C_VALORES:"Clases de Valores" };

const SCHOOL = {
  razonSocial: "CENTRO EDUCATIVO OXFORD DE MATAMOROS, S.A. DE C.V.",
  direccion: "Matamoros, Tamaulipas",
  telefono: "868-000-0000",
  ciclo: "2025-2026",
  recargo: 150,
};

const ALUMNOS = [
  { id:1, nombre:"ROBERTO CRUZ JR", nivel:"PREESCOLAR", colegiatura:2900,
    extras:{ INSC:2200, MTTO:1000, GTO_APERT:3300, C_VALORES:150 }, pagados:["AGT","SEPT","OCT","NOV"] },
  { id:2, nombre:"FRANCISCO JAVIER CASTILLO RIOS", nivel:"PREESCOLAR", colegiatura:2900,
    extras:{ INSC:2200, MTTO:1000, C_VALORES:150 }, pagados:["SEPT","OCT"] },
  { id:3, nombre:"JUAN JAIR SANCHEZ PEÑA", nivel:"PREESCOLAR", colegiatura:2700,
    extras:{ INSC:2200, MTTO:1000, GTO_APERT:3300, C_VALORES:150 }, pagados:["AGT","SEPT","NOV"] },
  { id:4, nombre:"ERON DANEY SILVA VALDEZ", nivel:"PREESCOLAR", colegiatura:2900,
    extras:{ INSC:1750, MTTO:1000, GTO_APERT:3300, C_VALORES:150 }, pagados:["AGT","SEPT","OCT","NOV"] },
  { id:5, nombre:"MANUEL JUAREZ HERNANDEZ", nivel:"PRIMARIA", colegiatura:2750,
    extras:{ INSC:2200, MTTO:1000, GTO_APERT:3300, C_VALORES:150 }, pagados:["AGT","SEPT","OCT","NOV"] },
  { id:6, nombre:"ANA ELIZABETH PEREZ VELA", nivel:"PRIMARIA", colegiatura:3100,
    extras:{ INSC:2200 }, pagados:[] },
  { id:7, nombre:"CRISTINA HERNANDEZ BARRADAS", nivel:"PRIMARIA", colegiatura:3100,
    extras:{ INSC:2200, MTTO:1000, GTO_APERT:3300, C_VALORES:150 }, pagados:["AGT","SEPT","OCT","NOV"] },
  { id:8, nombre:"JOSE TREVIÑO ALMAZAN", nivel:"PRIMARIA", colegiatura:3100,
    extras:{ INSC:2200, MTTO:1000, GTO_APERT:3300, C_VALORES:150 }, pagados:["AGT"] },
  { id:9, nombre:"MARIA ISABELLA RODRIGUEZ MENDEZ", nivel:"PRIMARIA", colegiatura:3100,
    extras:{ INSC:2200, MTTO:1000, GTO_APERT:3300, C_VALORES:150 }, pagados:["AGT","SEPT","OCT","NOV"] },
  { id:10, nombre:"MAXIMILIANO MARTINEZ CORDOVA", nivel:"PRIMARIA", colegiatura:3100,
    extras:{ INSC:2200, MTTO:1000, GTO_APERT:3300, C_VALORES:150 }, pagados:["AGT","SEPT","OCT"] },
];

const fmt = n => new Intl.NumberFormat("es-MX",{style:"currency",currency:"MXN"}).format(n||0);
const today = () => new Date().toLocaleDateString("es-MX",{day:"2-digit",month:"long",year:"numeric"});
let folioBase = parseInt(localStorage.getItem("oxford_folio")||"1000");
const newFolio = () => { folioBase++; localStorage.setItem("oxford_folio",folioBase); return String(folioBase).padStart(5,"0"); };

function distribuirPago(alumno, montoTotal, conRecargo) {
  const pendientes = MESES_ORDEN.filter(m => !alumno.pagados.includes(m));
  let restante = montoTotal;
  const lineas = [];
  for (const mes of pendientes) {
    if (restante <= 0) break;
    const costo = alumno.colegiatura + (conRecargo ? SCHOOL.recargo : 0);
    if (restante >= costo) { lineas.push({ mes, tipo:"completo", pagado:costo, pendiente:0 }); restante -= costo; }
    else { lineas.push({ mes, tipo:"abono", pagado:restante, pendiente:costo-restante }); restante = 0; }
  }
  return { lineas, sobrante: restante };
}

// ─── OXFORD LOGO SVG ─────────────────────────────────────────────────────────
function OxfordLogo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="50" fill={B.green}/>
      <g transform="translate(50,50) rotate(45)">
        <rect x="-22" y="-22" width="44" height="44" rx="7" fill={B.orange}/>
        <rect x="-22" y="-22" width="22" height="22" rx="5" fill={B.greenDark}/>
        <rect x="0"   y="0"   width="22" height="22" rx="5" fill={B.yellow}/>
        <rect x="-22" y="0"   width="22" height="22" rx="5" fill={B.yellow}/>
        <rect x="0"   y="-22" width="22" height="22" rx="5" fill={B.greenDark}/>
      </g>
      <circle cx="50" cy="50" r="10" fill={B.white}/>
      <circle cx="50" cy="53" r="5" fill={B.green}/>
    </svg>
  );
}

// ─── RECIBO ───────────────────────────────────────────────────────────────────
function Recibo({ alumno, lineas, total, folio, fecha, formato, copia }) {
  const isTicket = formato === "ticket";
  return (
    <div id={`recibo-${copia}`} style={{
      fontFamily:"'Arial Narrow',Arial,sans-serif",
      width: isTicket ? "74mm" : "138mm",
      padding: isTicket ? "6mm" : "8mm 10mm",
      background: "#fff",
      color: "#111",
      fontSize:"10px",
      lineHeight:1.55,
      borderRadius:"6px",
      margin:"0 auto",
      boxSizing:"border-box",
    }}>
      {/* Header con franja verde */}
      <div style={{ background:B.green, margin: isTicket?"-6mm -6mm 8px":"-8mm -10mm 10px", padding: isTicket?"10px 12px":"10px 14px", display:"flex", alignItems:"center", gap:"10px" }}>
        {/* Mini logo en blanco */}
        <svg width="28" height="28" viewBox="0 0 100 100" style={{flexShrink:0}}>
          <circle cx="50" cy="50" r="50" fill="rgba(255,255,255,0.25)"/>
          <g transform="translate(50,50) rotate(45)">
            <rect x="-22" y="-22" width="44" height="44" rx="7" fill={B.orange}/>
            <rect x="-22" y="-22" width="22" height="22" rx="5" fill={B.greenDark}/>
            <rect x="0"   y="0"   width="22" height="22" rx="5" fill={B.yellow}/>
            <rect x="-22" y="0"   width="22" height="22" rx="5" fill={B.yellow}/>
            <rect x="0"   y="-22" width="22" height="22" rx="5" fill={B.greenDark}/>
          </g>
          <circle cx="50" cy="50" r="10" fill={B.white}/>
          <circle cx="50" cy="53" r="5" fill={B.green}/>
        </svg>
        <div>
          <div style={{ color:"#fff", fontWeight:900, fontSize: isTicket?"11px":"12px", letterSpacing:"1px", textTransform:"uppercase" }}>OXFORD</div>
          <div style={{ color:"rgba(255,255,255,0.85)", fontSize:"7.5px", letterSpacing:".5px" }}>{SCHOOL.razonSocial}</div>
        </div>
      </div>

      {/* Título */}
      <div style={{ textAlign:"center", marginBottom:"8px" }}>
        <div style={{ fontSize: isTicket?"12px":"13px", fontWeight:900, letterSpacing:"3px", color:B.greenDark, textTransform:"uppercase" }}>Recibo de Pago</div>
        <div style={{ fontSize:"8.5px", color:"#666", marginTop:"2px" }}>
          Folio <strong style={{color:B.greenDark}}>#{folio}</strong> &nbsp;·&nbsp; {fecha}
        </div>
        {copia==="escuela" && <div style={{ display:"inline-block", background:B.green, color:"#fff", fontSize:"7px", padding:"2px 8px", borderRadius:"20px", marginTop:"3px", fontWeight:700, letterSpacing:"1px" }}>COPIA ESCUELA</div>}
        {copia==="padre"  && <div style={{ display:"inline-block", background:B.orange, color:"#fff", fontSize:"7px", padding:"2px 8px", borderRadius:"20px", marginTop:"3px", fontWeight:700, letterSpacing:"1px" }}>ORIGINAL</div>}
      </div>

      {/* Alumno */}
      <div style={{ background:B.greenBg, border:`1px solid ${B.border}`, borderRadius:"6px", padding:"7px 10px", marginBottom:"8px" }}>
        <div style={{ fontSize:"7.5px", color:B.muted, textTransform:"uppercase", letterSpacing:"1.5px", marginBottom:"2px" }}>Alumno</div>
        <div style={{ fontWeight:900, fontSize:"11px", color:B.dark }}>{alumno.nombre}</div>
        <div style={{ fontSize:"8.5px", color:B.muted, marginTop:"1px" }}>{alumno.nivel} · Ciclo {SCHOOL.ciclo}</div>
      </div>

      {/* Conceptos */}
      <div style={{ marginBottom:"8px" }}>
        <div style={{ fontSize:"7.5px", color:B.muted, textTransform:"uppercase", letterSpacing:"1.5px", marginBottom:"5px" }}>Concepto(s)</div>
        {lineas.map((l,i) => (
          <div key={i} style={{ marginBottom:"4px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:"9.5px" }}>
              <span style={{ display:"flex", alignItems:"center", gap:"4px" }}>
                {l.tipo==="completo" && <span style={{ color:B.green, fontWeight:900 }}>✓</span>}
                {l.tipo==="abono"    && <span style={{ color:B.orange, fontWeight:900 }}>◑</span>}
                {l.tipo==="sobrante" && <span style={{ color:"#5b8dd9", fontWeight:900 }}>+</span>}
                <span>{l.label}</span>
              </span>
              <span style={{ fontWeight:700 }}>{fmt(l.monto)}</span>
            </div>
            {l.tipo==="abono" && (
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:"8px", color:B.orange, paddingLeft:"14px", marginTop:"1px" }}>
                <span>Pendiente de este mes</span><span>{fmt(l.pendiente)}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Total */}
      <div style={{ background:B.green, borderRadius:"8px", padding:"10px 12px", display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"8px" }}>
        <div style={{ color:"rgba(255,255,255,0.85)", fontSize:"8px", textTransform:"uppercase", letterSpacing:"1.5px", fontWeight:700 }}>Total recibido</div>
        <div style={{ color:"#fff", fontWeight:900, fontSize: isTicket?"20px":"22px", letterSpacing:"-0.5px" }}>{fmt(total)}</div>
      </div>

      {/* Footer */}
      <div style={{ textAlign:"center", fontSize:"7.5px", color:"#aaa", borderTop:"1px dashed #ddd", paddingTop:"6px" }}>
        <div>Comprobante oficial de pago · Conserve este documento</div>
        <div style={{ marginTop:"2px", color:B.green, fontWeight:700 }}>oxford.edu.mx · {SCHOOL.telefono}</div>
      </div>
    </div>
  );
}

// ─── VISTA RECIBO ─────────────────────────────────────────────────────────────
function VistaRecibo({ alumno, lineas, total, folio, fecha, onBack }) {
  const [formato, setFormato] = useState("cuarto");
  const printStyle = formato==="ticket"
    ? `@media print { body * { visibility:hidden!important; } .pa, .pa * { visibility:visible!important; } .pa { position:fixed!important;top:0!important;left:0!important;width:80mm!important;border:none!important;box-shadow:none!important; } }`
    : `@media print { body * { visibility:hidden!important; } .pa, .pa * { visibility:visible!important; } .pa { position:fixed!important;top:0!important;left:0!important;width:148mm!important;border:none!important;box-shadow:none!important; } }`;

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;900&display=swap'); *{box-sizing:border-box;margin:0;padding:0;} ${printStyle}`}</style>
      <div style={{ minHeight:"100vh", background:`linear-gradient(145deg, ${B.greenDark} 0%, ${B.green} 60%, ${B.greenLight} 100%)`, padding:"20px 16px" }}>
        {/* Toolbar */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px", gap:"10px", flexWrap:"wrap" }}>
          <button onClick={onBack} style={{ background:"rgba(255,255,255,0.18)", border:"1px solid rgba(255,255,255,0.3)", color:"#fff", padding:"9px 18px", borderRadius:"10px", fontSize:"13px", cursor:"pointer", fontFamily:"inherit" }}>← Volver</button>
          <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
            {["cuarto","ticket"].map(f=>(
              <button key={f} onClick={()=>setFormato(f)} style={{ background:formato===f?"#fff":"rgba(255,255,255,0.15)", border:"none", color:formato===f?B.greenDark:"#fff", padding:"9px 16px", borderRadius:"10px", fontSize:"12px", fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
                {f==="cuarto"?"¼ Carta":"Ticket 80mm"}
              </button>
            ))}
            <button onClick={()=>window.print()} style={{ background:B.orange, border:"none", color:"#fff", padding:"9px 22px", borderRadius:"10px", fontSize:"13px", fontWeight:900, cursor:"pointer", fontFamily:"inherit", letterSpacing:".5px" }}>
              🖨️ Imprimir
            </button>
          </div>
        </div>
        <div style={{ color:"rgba(255,255,255,0.6)", textAlign:"center", fontSize:"10px", letterSpacing:"2px", marginBottom:"14px", textTransform:"uppercase" }}>
          2 copias · Original padre · Copia escuela
        </div>
        <div className="pa" style={{ display:"flex", flexDirection:formato==="ticket"?"row":"column", gap:"14px", alignItems:"center", justifyContent:"center" }}>
          {["padre","escuela"].map(c=>(
            <div key={c} style={{ background:"#fff", borderRadius:"10px", padding:"10px", boxShadow:`0 12px 40px rgba(0,0,0,0.25)` }}>
              <Recibo alumno={alumno} lineas={lineas} total={total} folio={c==="padre"?folio:`${folio}-C`} fecha={fecha} formato={formato} copia={c}/>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── APP PRINCIPAL ────────────────────────────────────────────────────────────
export default function OxfordRecibos() {
  const [q, setQ]               = useState("");
  const [alumno, setAlumno]     = useState(null);
  const [paso, setPaso]         = useState("buscar");
  const [tipoPago, setTipoPago] = useState(null);
  const [nMeses, setNMeses]     = useState(1);
  const [montoCustom, setMonto] = useState("");
  const [extraKey, setExtraKey] = useState(null);
  const [conRecargo, setRec]    = useState(false);
  const [folio]                 = useState(() => newFolio());
  const [fecha]                 = useState(() => today());

  const resultados = useMemo(() => {
    if (!q.trim()) return [];
    return ALUMNOS.filter(a=>a.nombre.toLowerCase().includes(q.toLowerCase())).slice(0,7);
  },[q]);

  const mesesPend = useMemo(()=>{
    if (!alumno) return [];
    return MESES_ORDEN.filter(m=>!alumno.pagados.includes(m));
  },[alumno]);

  const { lineas, total } = useMemo(()=>{
    if (!alumno) return { lineas:[], total:0 };
    if (tipoPago==="extra" && extraKey) {
      const monto = alumno.extras[extraKey]||0;
      return { lineas:[{ label:CONCEPTOS_EXTRA[extraKey], monto, tipo:"completo" }], total:monto };
    }
    if (tipoPago==="mensualidad") {
      const mi = montoCustom!==""?parseFloat(montoCustom)||0:null;
      if (mi!==null) {
        const { lineas:dist, sobrante } = distribuirPago(alumno, mi, conRecargo);
        const ls = dist.map(d=>({ label:MESES_LABEL[d.mes]+(conRecargo?" (inc. recargo)":""), monto:d.pagado, tipo:d.tipo, pendiente:d.pendiente, mes:d.mes }));
        if (sobrante>0) ls.push({ label:"Saldo a favor", monto:sobrante, tipo:"sobrante" });
        return { lineas:ls, total:mi };
      } else {
        const meses = mesesPend.slice(0,nMeses);
        const ls = meses.map(m=>({ label:MESES_LABEL[m]+(conRecargo?" (inc. recargo)":""), monto:alumno.colegiatura+(conRecargo?SCHOOL.recargo:0), tipo:"completo", mes:m }));
        return { lineas:ls, total:ls.reduce((a,l)=>a+l.monto,0) };
      }
    }
    return { lineas:[], total:0 };
  },[alumno, tipoPago, extraKey, nMeses, montoCustom, conRecargo, mesesPend]);

  const selAlumno = a => { setAlumno(a); setQ(a.nombre); setPaso("pago"); setTipoPago(null); setMonto(""); setNMeses(1); setExtraKey(null); setRec(false); };
  const reset = () => { setAlumno(null); setQ(""); setPaso("buscar"); setTipoPago(null); };

  if (paso==="recibo") return <VistaRecibo alumno={alumno} lineas={lineas} total={total} folio={folio} fecha={fecha} onBack={()=>setPaso("pago")}/>;

  // Pill chip helper
  const Chip = ({ active, onClick, children }) => (
    <div onClick={onClick} style={{ background:active?"#fff":"rgba(255,255,255,0.15)", border:`2px solid ${active?B.greenDark:"transparent"}`, borderRadius:"12px", padding:"12px 10px", cursor:"pointer", textAlign:"center", transition:"all .15s" }}>
      {children}
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;900&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        body { background:${B.green}; font-family:'Nunito',sans-serif; }
        input,select { outline:none; font-family:'Nunito',sans-serif; }
        button:active { transform:scale(.97); opacity:.9; }
        ::placeholder { color:rgba(255,255,255,0.45); }
      `}</style>

      <div style={{ minHeight:"100vh", background:`linear-gradient(150deg, ${B.greenDeep} 0%, ${B.greenDark} 40%, ${B.green} 100%)` }}>

        {/* ── HEADER ── */}
        <div style={{ padding:"24px 20px 20px", display:"flex", alignItems:"center", gap:"14px", borderBottom:"1px solid rgba(255,255,255,0.12)" }}>
          <OxfordLogo size={48}/>
          <div>
            <div style={{ color:"#fff", fontWeight:900, fontSize:"20px", letterSpacing:"1px", lineHeight:1.1 }}>OXFORD</div>
            <div style={{ color:"rgba(255,255,255,0.65)", fontSize:"11px", fontWeight:600, letterSpacing:"2px" }}>RECIBOS DE PAGO · {SCHOOL.ciclo}</div>
          </div>
        </div>

        <div style={{ padding:"20px 16px 60px" }}>

          {/* ── BUSCADOR ── */}
          <div style={{ marginBottom:"18px" }}>
            <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.55)", letterSpacing:"2px", fontWeight:700, textTransform:"uppercase", marginBottom:"8px" }}>Buscar Alumno</div>
            <div style={{ position:"relative" }}>
              <span style={{ position:"absolute", left:"14px", top:"50%", transform:"translateY(-50%)", fontSize:"18px" }}>🔍</span>
              <input
                type="text" value={q}
                onChange={e=>{ setQ(e.target.value); if(alumno) reset(); }}
                placeholder="Escribe el nombre del alumno..."
                style={{ width:"100%", padding:"15px 15px 15px 44px", background:"rgba(255,255,255,0.18)", backdropFilter:"blur(8px)", border:"2px solid rgba(255,255,255,0.3)", borderRadius:"14px", color:"#fff", fontSize:"16px", fontWeight:600 }}
              />
            </div>

            {/* Resultados */}
            {resultados.length>0 && !alumno && (
              <div style={{ marginTop:"8px", background:"rgba(255,255,255,0.12)", backdropFilter:"blur(12px)", borderRadius:"14px", border:"1px solid rgba(255,255,255,0.2)", overflow:"hidden" }}>
                {resultados.map((a,i)=>(
                  <div key={a.id} onClick={()=>selAlumno(a)} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"13px 16px", borderBottom:i<resultados.length-1?"1px solid rgba(255,255,255,0.1)":"none", cursor:"pointer" }}>
                    <div>
                      <div style={{ color:"#fff", fontWeight:800, fontSize:"14px" }}>{a.nombre}</div>
                      <div style={{ color:"rgba(255,255,255,0.55)", fontSize:"11px", marginTop:"2px" }}>{a.nivel}</div>
                    </div>
                    <span style={{ color:"rgba(255,255,255,0.6)", fontSize:"22px" }}>›</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── ALUMNO BADGE ── */}
          {alumno && (
            <div style={{ background:"rgba(255,255,255,0.2)", backdropFilter:"blur(10px)", border:"2px solid rgba(255,255,255,0.4)", borderRadius:"16px", padding:"14px 18px", marginBottom:"20px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ fontSize:"9px", color:"rgba(255,255,255,0.6)", letterSpacing:"2px", fontWeight:700, textTransform:"uppercase" }}>Alumno seleccionado</div>
                <div style={{ color:"#fff", fontWeight:900, fontSize:"17px", marginTop:"3px" }}>{alumno.nombre}</div>
                <div style={{ color:"rgba(255,255,255,0.65)", fontSize:"12px", marginTop:"1px" }}>{alumno.nivel} · Colegiatura {fmt(alumno.colegiatura)}/mes</div>
              </div>
              <button onClick={reset} style={{ background:"rgba(255,255,255,0.2)", border:"none", color:"#fff", width:"32px", height:"32px", borderRadius:"50%", fontSize:"16px", cursor:"pointer", fontFamily:"inherit" }}>×</button>
            </div>
          )}

          {/* ── TIPO DE PAGO ── */}
          {paso!=="buscar" && alumno && (
            <div style={{ marginBottom:"20px" }}>
              <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.55)", letterSpacing:"2px", fontWeight:700, textTransform:"uppercase", marginBottom:"10px" }}>¿Qué va a pagar?</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
                {[
                  { key:"mensualidad", emoji:"📅", label:"Mensualidad(es)" },
                  { key:"extra",       emoji:"📋", label:"Concepto extra"  },
                ].map(t=>(
                  <div key={t.key} onClick={()=>{ setTipoPago(t.key); setExtraKey(null); setMonto(""); }} style={{ background:tipoPago===t.key?"#fff":"rgba(255,255,255,0.15)", border:`2px solid ${tipoPago===t.key?B.greenDark:"transparent"}`, borderRadius:"14px", padding:"18px 12px", cursor:"pointer", textAlign:"center", transition:"all .15s" }}>
                    <div style={{ fontSize:"26px", marginBottom:"6px" }}>{t.emoji}</div>
                    <div style={{ color:tipoPago===t.key?B.greenDark:"#fff", fontWeight:900, fontSize:"14px" }}>{t.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── MENSUALIDADES ── */}
          {tipoPago==="mensualidad" && alumno && (
            <div>
              {mesesPend.length===0 ? (
                <div style={{ textAlign:"center", color:"rgba(255,255,255,0.6)", padding:"24px", background:"rgba(255,255,255,0.1)", borderRadius:"14px" }}>
                  ✅ Sin meses pendientes
                </div>
              ) : (<>
                <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.55)", letterSpacing:"2px", fontWeight:700, textTransform:"uppercase", marginBottom:"10px" }}>¿Cuántos meses?</div>

                {/* Chips N meses */}
                <div style={{ display:"flex", gap:"8px", marginBottom:"14px" }}>
                  {[1,2,3,4].filter(n=>n<=mesesPend.length).map(n=>(
                    <div key={n} onClick={()=>{ setNMeses(n); setMonto(""); }} style={{ flex:1, background:nMeses===n&&montoCustom===""?"#fff":"rgba(255,255,255,0.15)", border:`2px solid ${nMeses===n&&montoCustom===""?B.greenDark:"transparent"}`, borderRadius:"12px", padding:"13px 6px", cursor:"pointer", textAlign:"center" }}>
                      <div style={{ color:nMeses===n&&montoCustom===""?B.greenDark:"#fff", fontWeight:900, fontSize:"22px" }}>{n}</div>
                      <div style={{ color:nMeses===n&&montoCustom===""?B.muted:"rgba(255,255,255,0.55)", fontSize:"10px", marginTop:"2px" }}>{n===1?"mes":"meses"}</div>
                    </div>
                  ))}
                </div>

                {/* Preview meses */}
                {montoCustom==="" && (
                  <div style={{ background:"rgba(255,255,255,0.12)", borderRadius:"12px", padding:"12px 14px", marginBottom:"12px" }}>
                    <div style={{ fontSize:"9px", color:"rgba(255,255,255,0.5)", marginBottom:"7px", textTransform:"uppercase", letterSpacing:"1.5px" }}>Cubrirá (más viejo → más nuevo)</div>
                    {mesesPend.slice(0,nMeses).map(m=>(
                      <div key={m} style={{ display:"flex", justifyContent:"space-between", color:"#fff", fontSize:"13px", fontWeight:700, marginBottom:"3px" }}>
                        <span>✓ {MESES_LABEL[m]}</span>
                        <span style={{ color:B.yellow }}>{fmt(alumno.colegiatura+(conRecargo?SCHOOL.recargo:0))}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Monto libre */}
                <div style={{ textAlign:"center", color:"rgba(255,255,255,0.4)", fontSize:"11px", marginBottom:"8px" }}>— o ingresa monto exacto —</div>
                <input
                  type="number"
                  placeholder={`Ej: ${alumno.colegiatura*2} (distribuye solo)`}
                  value={montoCustom}
                  onChange={e=>setMonto(e.target.value)}
                  style={{ width:"100%", padding:"15px 16px", background:"rgba(255,255,255,0.18)", border:"2px solid rgba(255,255,255,0.35)", borderRadius:"14px", color:"#fff", fontSize:"22px", fontWeight:900, marginBottom:"10px" }}
                />

                {/* Preview distribución */}
                {montoCustom!=="" && parseFloat(montoCustom)>0 && (()=>{
                  const { lineas:dist, sobrante } = distribuirPago(alumno, parseFloat(montoCustom), conRecargo);
                  return (
                    <div style={{ background:"rgba(255,255,255,0.12)", border:"2px solid rgba(255,255,255,0.2)", borderRadius:"12px", padding:"12px 14px", marginBottom:"12px" }}>
                      <div style={{ fontSize:"9px", color:B.yellow, fontWeight:700, letterSpacing:"2px", textTransform:"uppercase", marginBottom:"8px" }}>Distribución automática</div>
                      {dist.map((d,i)=>(
                        <div key={i} style={{ marginBottom:"5px" }}>
                          <div style={{ display:"flex", justifyContent:"space-between", color:"#fff", fontSize:"13px", fontWeight:700 }}>
                            <span style={{ display:"flex", gap:"5px", alignItems:"center" }}>
                              {d.tipo==="completo"?<span style={{color:"#aaee88"}}>✓</span>:<span style={{color:B.orange}}>◑</span>}
                              {MESES_LABEL[d.mes]}{d.tipo==="abono"&&<span style={{fontSize:"10px",color:B.orange,fontWeight:400}}>abono parcial</span>}
                            </span>
                            <span style={{ color:d.tipo==="completo"?B.yellow:B.orange }}>{fmt(d.pagado)}</span>
                          </div>
                          {d.tipo==="abono" && <div style={{ display:"flex", justifyContent:"space-between", fontSize:"11px", color:"rgba(245,166,35,0.75)", paddingLeft:"18px" }}><span>Pendiente</span><span>{fmt(d.pendiente)}</span></div>}
                        </div>
                      ))}
                      {sobrante>0 && <div style={{ display:"flex", justifyContent:"space-between", fontSize:"12px", color:"#8bc8ff", borderTop:"1px solid rgba(255,255,255,0.15)", paddingTop:"6px", marginTop:"4px" }}><span>→ Saldo a favor</span><span>{fmt(sobrante)}</span></div>}
                    </div>
                  );
                })()}

                {/* Recargo toggle */}
                <div onClick={()=>setRec(r=>!r)} style={{ display:"flex", alignItems:"center", gap:"12px", padding:"12px 14px", background:"rgba(255,255,255,0.1)", borderRadius:"12px", marginBottom:"18px", cursor:"pointer", border:`2px solid ${conRecargo?"rgba(255,255,255,0.4)":"transparent"}` }}>
                  <div style={{ width:"42px", height:"24px", background:conRecargo?B.orange:"rgba(255,255,255,0.2)", borderRadius:"12px", position:"relative", transition:"all .2s", flexShrink:0 }}>
                    <div style={{ position:"absolute", width:"20px", height:"20px", background:"#fff", borderRadius:"50%", top:"2px", left:conRecargo?"20px":"2px", transition:"left .2s" }}/>
                  </div>
                  <div>
                    <div style={{ color:"#fff", fontWeight:800, fontSize:"13px" }}>Recargo {fmt(SCHOOL.recargo)}/mes</div>
                    <div style={{ color:"rgba(255,255,255,0.5)", fontSize:"11px" }}>Se suma a cada mensualidad</div>
                  </div>
                </div>

                <button onClick={()=>setPaso("recibo")} disabled={lineas.length===0} style={{ width:"100%", padding:"17px", background:lineas.length===0?"rgba(255,255,255,0.15)":B.orange, border:"none", borderRadius:"14px", color:"#fff", fontSize:"16px", fontWeight:900, cursor:lineas.length===0?"not-allowed":"pointer", letterSpacing:".5px", transition:"all .2s" }}>
                  {lineas.length===0 ? "Selecciona un pago" : `Generar Recibo · ${fmt(total)} →`}
                </button>
              </>)}
            </div>
          )}

          {/* ── EXTRAS ── */}
          {tipoPago==="extra" && alumno && (
            <div>
              <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.55)", letterSpacing:"2px", fontWeight:700, textTransform:"uppercase", marginBottom:"10px" }}>Selecciona concepto</div>
              {Object.entries(alumno.extras).map(([k,v])=>(
                <div key={k} onClick={()=>setExtraKey(k)} style={{ background:extraKey===k?"rgba(255,255,255,0.28)":"rgba(255,255,255,0.12)", border:`2px solid ${extraKey===k?"rgba(255,255,255,0.6)":"transparent"}`, borderRadius:"12px", padding:"13px 16px", marginBottom:"7px", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div style={{ color:"#fff", fontWeight:800, fontSize:"14px" }}>{CONCEPTOS_EXTRA[k]||k}</div>
                  <div style={{ color:B.yellow, fontWeight:900, fontSize:"16px" }}>{fmt(v)}</div>
                </div>
              ))}
              {extraKey && (
                <button onClick={()=>setPaso("recibo")} style={{ width:"100%", marginTop:"10px", padding:"17px", background:B.orange, border:"none", borderRadius:"14px", color:"#fff", fontSize:"16px", fontWeight:900, cursor:"pointer" }}>
                  Generar Recibo · {fmt(alumno.extras[extraKey])} →
                </button>
              )}
            </div>
          )}

          {/* Empty state */}
          {!q && !alumno && (
            <div style={{ textAlign:"center", marginTop:"60px" }}>
              <div style={{ fontSize:"56px", marginBottom:"14px" }}>🎓</div>
              <div style={{ color:"rgba(255,255,255,0.45)", fontSize:"15px", fontWeight:600 }}>Busca al alumno para comenzar</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
