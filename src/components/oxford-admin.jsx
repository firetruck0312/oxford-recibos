import { useState, useMemo } from "react";

// ─── BRAND TOKENS — Oxford (contraste WCAG AA garantizado) ───────────────────
const B = {
  // Verdes Oxford
  green:      "#8DC63F",
  greenDark:  "#3d6010",   // ratio 8.5:1 sobre blanco
  greenDeep:  "#2a4408",
  greenLight: "#BEDE6A",
  greenBg:    "#eef7e0",
  greenBg2:   "#f6fbef",
  // Acentos
  orange:     "#C45E00",   // oscurecido para ratio >4.5:1 sobre blanco
  orangeBg:   "#fff5e6",
  orangeBrd:  "#F5A623",
  // Semánticos — todos oscurecidos para legibilidad
  red:        "#a82020",   // ratio 7:1 sobre blanco
  redBg:      "#fdf0f0",
  redBrd:     "#e09090",
  teal:       "#1a6b45",   // ratio 6.5:1 sobre blanco
  tealBg:     "#e8f7f0",
  tealBrd:    "#70c8a0",
  // Texto — negro verdoso, siempre legible
  text:       "#111c06",   // ratio 17:1
  textMid:    "#2d4a0e",   // ratio 10:1
  textMuted:  "#4a6e22",   // ratio 5.5:1 — mínimo recomendado
  // Fondos panel
  bg:         "#f0f7e8",
  sidebar:    "#1e3d08",
  sidebarHov: "#2a5210",
  panel:      "#ffffff",
  panelAlt:   "#f6fbef",
  border:     "#c4e090",
  borderMid:  "#a8cc70",
  shadow:     "rgba(61,96,16,0.10)",
};

const MESES_ORDEN = ["AGT","SEPT","OCT","NOV","DIC","ENE","FEB","MAR","ABR","MAY","JUN"];
const MESES_LABEL = { AGT:"Ago",SEPT:"Sep",OCT:"Oct",NOV:"Nov",DIC:"Dic",ENE:"Ene",FEB:"Feb",MAR:"Mar",ABR:"Abr",MAY:"May",JUN:"Jun" };
const MESES_FULL  = { AGT:"Agosto",SEPT:"Septiembre",OCT:"Octubre",NOV:"Noviembre",DIC:"Diciembre",ENE:"Enero",FEB:"Febrero",MAR:"Marzo",ABR:"Abril",MAY:"Mayo",JUN:"Junio" };
const NIVELES     = ["PREESCOLAR","PRIMARIA","SECUNDARIA"];
const CONCEPTOS   = { INSC:"Inscripción",MTTO:"Mantenimiento",GTO_APERT:"Gastos de Apertura","50DLLS":"50 Dólares",C_VALORES:"Clases de Valores" };
const genId = () => Math.random().toString(36).slice(2,7).toUpperCase();

// ─── DATA DEMO ────────────────────────────────────────────────────────────────
const ALUMNOS_INIT = [
  { id:"A001", nombre:"ROBERTO CRUZ JR", nivel:"PREESCOLAR", colegiatura:2900, activo:true,
    extras:{INSC:2200,MTTO:1000,GTO_APERT:3300,C_VALORES:150}, pagados:["AGT","SEPT","OCT","NOV"],
    historial:[{folio:"01001",fecha:"05 agosto 2025",concepto:"Agosto",monto:2900},{folio:"01024",fecha:"08 septiembre 2025",concepto:"Septiembre",monto:2900},{folio:"01051",fecha:"03 octubre 2025",concepto:"Octubre",monto:2900},{folio:"01089",fecha:"07 noviembre 2025",concepto:"Noviembre",monto:2900}]},
  { id:"A002", nombre:"FRANCISCO JAVIER CASTILLO RIOS", nivel:"PREESCOLAR", colegiatura:2900, activo:true,
    extras:{INSC:2200,MTTO:1000,C_VALORES:150}, pagados:["SEPT","OCT"],
    historial:[{folio:"01022",fecha:"09 septiembre 2025",concepto:"Septiembre",monto:2900},{folio:"01048",fecha:"10 octubre 2025",concepto:"Octubre",monto:2900}]},
  { id:"A003", nombre:"JUAN JAIR SANCHEZ PEÑA", nivel:"PREESCOLAR", colegiatura:2700, activo:true,
    extras:{INSC:2200,MTTO:1000,GTO_APERT:3300,C_VALORES:150}, pagados:["AGT","SEPT","NOV"],
    historial:[{folio:"01005",fecha:"04 agosto 2025",concepto:"Agosto",monto:2700},{folio:"01031",fecha:"06 septiembre 2025",concepto:"Septiembre",monto:2700},{folio:"01088",fecha:"06 noviembre 2025",concepto:"Noviembre",monto:2700}]},
  { id:"A004", nombre:"ERON DANEY SILVA VALDEZ", nivel:"PREESCOLAR", colegiatura:2900, activo:true,
    extras:{INSC:1750,MTTO:1000,GTO_APERT:3300,C_VALORES:150}, pagados:["AGT","SEPT","OCT","NOV"],
    historial:[{folio:"01008",fecha:"05 agosto 2025",concepto:"Agosto",monto:2900},{folio:"01033",fecha:"08 septiembre 2025",concepto:"Septiembre",monto:2900},{folio:"01060",fecha:"07 octubre 2025",concepto:"Octubre",monto:2900},{folio:"01091",fecha:"05 noviembre 2025",concepto:"Noviembre",monto:2900}]},
  { id:"A005", nombre:"MANUEL JUAREZ HERNANDEZ", nivel:"PRIMARIA", colegiatura:2750, activo:true,
    extras:{INSC:2200,MTTO:1000,GTO_APERT:3300,C_VALORES:150}, pagados:["AGT","SEPT","OCT","NOV"],
    historial:[{folio:"01010",fecha:"06 agosto 2025",concepto:"Agosto",monto:2750},{folio:"01035",fecha:"09 septiembre 2025",concepto:"Septiembre",monto:2750},{folio:"01063",fecha:"08 octubre 2025",concepto:"Octubre",monto:2750},{folio:"01094",fecha:"06 noviembre 2025",concepto:"Noviembre",monto:2750}]},
  { id:"A006", nombre:"ANA ELIZABETH PEREZ VELA", nivel:"PRIMARIA", colegiatura:3100, activo:true,
    extras:{INSC:2200}, pagados:[], historial:[]},
  { id:"A007", nombre:"CRISTINA HERNANDEZ BARRADAS", nivel:"PRIMARIA", colegiatura:3100, activo:true,
    extras:{INSC:2200,MTTO:1000,GTO_APERT:3300,C_VALORES:150}, pagados:["AGT","SEPT","OCT","NOV"],
    historial:[{folio:"01012",fecha:"05 agosto 2025",concepto:"Agosto",monto:3100},{folio:"01038",fecha:"08 septiembre 2025",concepto:"Septiembre",monto:3100},{folio:"01067",fecha:"07 octubre 2025",concepto:"Octubre",monto:3100},{folio:"01095",fecha:"05 noviembre 2025",concepto:"Noviembre",monto:3100}]},
  { id:"A008", nombre:"JOSE TREVIÑO ALMAZAN", nivel:"PRIMARIA", colegiatura:3100, activo:true,
    extras:{INSC:2200,MTTO:1000,GTO_APERT:3300,C_VALORES:150}, pagados:["AGT"],
    historial:[{folio:"01014",fecha:"07 agosto 2025",concepto:"Agosto",monto:3100}]},
  { id:"A009", nombre:"MARIA ISABELLA RODRIGUEZ MENDEZ", nivel:"PRIMARIA", colegiatura:3100, activo:true,
    extras:{INSC:2200,MTTO:1000,GTO_APERT:3300,C_VALORES:150}, pagados:["AGT","SEPT","OCT","NOV"],
    historial:[{folio:"01015",fecha:"06 agosto 2025",concepto:"Agosto",monto:3100},{folio:"01040",fecha:"09 septiembre 2025",concepto:"Septiembre",monto:3100},{folio:"01069",fecha:"08 octubre 2025",concepto:"Octubre",monto:3100},{folio:"01097",fecha:"07 noviembre 2025",concepto:"Noviembre",monto:3100}]},
  { id:"A010", nombre:"MAXIMILIANO MARTINEZ CORDOVA", nivel:"PRIMARIA", colegiatura:3100, activo:true,
    extras:{INSC:2200,MTTO:1000,GTO_APERT:3300,C_VALORES:150}, pagados:["AGT","SEPT","OCT"],
    historial:[{folio:"01016",fecha:"05 agosto 2025",concepto:"Agosto",monto:3100},{folio:"01042",fecha:"06 septiembre 2025",concepto:"Septiembre",monto:3100},{folio:"01070",fecha:"07 octubre 2025",concepto:"Octubre",monto:3100}]},
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmt        = n  => new Intl.NumberFormat("es-MX",{style:"currency",currency:"MXN"}).format(n||0);
const mesesPend  = a  => MESES_ORDEN.filter(m => !a.pagados.includes(m));
const deudaTotal = a  => mesesPend(a).length * a.colegiatura;
const pagadoTotal= a  => a.historial.reduce((s,h) => s+h.monto, 0);

// ─── PILL ─────────────────────────────────────────────────────────────────────
// Siempre: fondo claro, texto oscuro garantizado
function Pill({ label, variant="gray" }) {
  const map = {
    green:  { bg:B.greenBg,   color:B.greenDark,  border:B.borderMid  },
    red:    { bg:B.redBg,     color:B.red,        border:B.redBrd     },
    orange: { bg:B.orangeBg,  color:B.orange,     border:B.orangeBrd  },
    gray:   { bg:"#f0f0f0",   color:"#444",       border:"#ccc"       },
    teal:   { bg:B.tealBg,    color:B.teal,       border:B.tealBrd    },
  };
  const { bg, color, border } = map[variant] || map.gray;
  return (
    <span style={{ display:"inline-block", padding:"3px 10px", borderRadius:"20px",
      fontSize:"10px", fontWeight:700, letterSpacing:"0.5px", textTransform:"uppercase",
      background:bg, color, border:`1px solid ${border}` }}>
      {label}
    </span>
  );
}

// ─── MODAL ────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:100,
      display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}>
      <div style={{ background:B.panel, borderRadius:"16px", border:`1px solid ${B.border}`,
        width:"100%", maxWidth:"500px", maxHeight:"88vh", overflowY:"auto",
        boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
          padding:"18px 22px 14px", borderBottom:`1px solid ${B.border}` }}>
          <div style={{ fontFamily:"'Nunito',sans-serif", fontSize:"17px", fontWeight:800,
            color:B.text }}>{title}</div>
          <button onClick={onClose} style={{ background:"none", border:"none",
            color:B.textMuted, fontSize:"22px", cursor:"pointer", lineHeight:1 }}>×</button>
        </div>
        <div style={{ padding:"18px 22px 22px" }}>{children}</div>
      </div>
    </div>
  );
}

// ─── FORM FIELD ───────────────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div style={{ marginBottom:"14px" }}>
      <div style={{ fontSize:"10px", fontWeight:700, letterSpacing:"1.5px",
        textTransform:"uppercase", color:B.textMuted, marginBottom:"6px" }}>
        {label}
      </div>
      {children}
    </div>
  );
}
const inputSt = {
  width:"100%", padding:"10px 12px",
  background:B.panel, border:`1.5px solid ${B.border}`,
  borderRadius:"9px", color:B.text, fontSize:"14px",
  fontFamily:"'Nunito',sans-serif", boxSizing:"border-box",
};
const selectSt = { ...inputSt, cursor:"pointer" };

// ─── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, accent, warn }) {
  const valueColor = accent ? B.greenDark : warn ? B.red : B.text;
  return (
    <div style={{ background:B.panel, border:`1.5px solid ${accent?B.borderMid:warn?B.redBrd:B.border}`,
      borderRadius:"14px", padding:"16px 20px",
      boxShadow:`0 2px 12px ${B.shadow}` }}>
      <div style={{ fontSize:"10px", fontWeight:700, letterSpacing:"1.5px",
        textTransform:"uppercase", color:B.textMuted, marginBottom:"6px" }}>
        {label}
      </div>
      <div style={{ fontSize:"clamp(20px,3vw,28px)", fontWeight:900, color:valueColor,
        fontFamily:"'Nunito',sans-serif", lineHeight:1.1 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize:"11px", color:B.textMuted, marginTop:"4px" }}>{sub}</div>}
    </div>
  );
}

// ─── TABLE WRAPPER ────────────────────────────────────────────────────────────
function PanelTable({ children }) {
  return (
    <div style={{ background:B.panel, borderRadius:"14px", border:`1.5px solid ${B.border}`,
      overflow:"hidden", boxShadow:`0 2px 12px ${B.shadow}` }}>
      <div style={{ overflowX:"auto" }}>{children}</div>
    </div>
  );
}

const TH = ({ children, right }) => (
  <th style={{ padding:"11px 14px", textAlign: right?"right":"left",
    fontSize:"10px", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase",
    color:B.textMuted, background:B.greenBg, borderBottom:`1.5px solid ${B.border}`,
    whiteSpace:"nowrap" }}>
    {children}
  </th>
);
const TD = ({ children, right, bold, muted, mono }) => (
  <td style={{ padding:"11px 14px", textAlign:right?"right":"left",
    fontSize:"13px", fontWeight:bold?700:400,
    color: muted ? B.textMuted : B.text,
    fontFamily: mono ? "'Courier New',monospace" : "'Nunito',sans-serif",
    whiteSpace:"nowrap" }}>
    {children}
  </td>
);

// ─── SECTION HEADER ───────────────────────────────────────────────────────────
function SectionHeader({ eyebrow, title, action }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between",
      alignItems:"flex-end", marginBottom:"20px", flexWrap:"wrap", gap:"12px" }}>
      <div>
        <div style={{ fontSize:"10px", fontWeight:700, letterSpacing:"2px",
          textTransform:"uppercase", color:B.green, marginBottom:"4px" }}>
          {eyebrow}
        </div>
        <div style={{ fontFamily:"'Nunito',sans-serif", fontSize:"clamp(18px,3vw,24px)",
          fontWeight:900, color:B.text, lineHeight:1.1 }}>
          {title}
        </div>
      </div>
      {action}
    </div>
  );
}

// ─── DIVIDER ──────────────────────────────────────────────────────────────────
const Div = () => <div style={{ height:"1px", background:B.border, margin:"0 0 20px" }}/>;

// ═══════════════════════════════════════════════════════════════════════════════
// VIEW: DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
function ViewDashboard({ alumnos }) {
  const activos  = alumnos.filter(a => a.activo);
  const morosos  = activos.filter(a => mesesPend(a).length > 0).sort((a,b) => deudaTotal(b)-deudaTotal(a));
  const alDia    = activos.filter(a => mesesPend(a).length === 0);
  const porCobrar= morosos.reduce((s,a) => s+deudaTotal(a), 0);
  const cobrado  = activos.reduce((s,a) => s+pagadoTotal(a), 0);

  return (
    <div>
      <SectionHeader eyebrow="Resumen ciclo 2025-2026" title="Dashboard" />
      <Div/>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",
        gap:"12px", marginBottom:"28px" }}>
        <StatCard label="Alumnos activos"  value={activos.length} />
        <StatCard label="Al corriente"     value={alDia.length}
          sub={`${Math.round(alDia.length/activos.length*100)}% del total`} accent />
        <StatCard label="Con adeudo"       value={morosos.length} warn={morosos.length>0} />
        <StatCard label="Por cobrar"       value={fmt(porCobrar)} warn={porCobrar>0}
          sub="adeudos acumulados" />
        <StatCard label="Cobrado en ciclo" value={fmt(cobrado)} accent />
      </div>

      {/* Top morosos */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
        marginBottom:"10px" }}>
        <div style={{ fontSize:"13px", fontWeight:700, color:B.text }}>Mayores adeudos</div>
        <Pill label={`${morosos.length} alumnos`} variant="red" />
      </div>
      <PanelTable>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"13px" }}>
          <thead>
            <tr><TH>Alumno</TH><TH>Nivel</TH><TH>Meses que debe</TH><TH right>Adeudo</TH></tr>
          </thead>
          <tbody>
            {morosos.slice(0,8).map((a,i) => {
              const pend = mesesPend(a);
              return (
                <tr key={a.id} style={{ background: i%2===0 ? B.panel : B.panelAlt,
                  borderBottom:`1px solid ${B.border}` }}>
                  <TD bold>{a.nombre}</TD>
                  <TD muted>{a.nivel}</TD>
                  <TD>{pend.map(m => MESES_LABEL[m]).join(", ")}</TD>
                  <td style={{ padding:"11px 14px", textAlign:"right", fontWeight:700,
                    color:B.red, fontSize:"14px", whiteSpace:"nowrap" }}>
                    {fmt(deudaTotal(a))}
                  </td>
                </tr>
              );
            })}
            {morosos.length === 0 && (
              <tr><td colSpan={4} style={{ padding:"30px", textAlign:"center",
                color:B.textMuted, fontStyle:"italic" }}>
                ✅ Todos los alumnos están al corriente
              </td></tr>
            )}
          </tbody>
        </table>
      </PanelTable>

      {/* Cobertura por mes */}
      <div style={{ fontSize:"13px", fontWeight:700, color:B.text,
        marginTop:"28px", marginBottom:"12px" }}>
        Cobertura de pago por mes
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(85px,1fr))",
        gap:"8px" }}>
        {MESES_ORDEN.map(m => {
          const pagaron = activos.filter(a => a.pagados.includes(m)).length;
          const pct = activos.length ? Math.round(pagaron/activos.length*100) : 0;
          const clr = pct>=80 ? B.teal : pct>=50 ? B.orange : B.red;
          const bg  = pct>=80 ? B.tealBg : pct>=50 ? B.orangeBg : B.redBg;
          return (
            <div key={m} style={{ background:bg, border:`1.5px solid ${clr}33`,
              borderRadius:"10px", padding:"10px 8px", textAlign:"center" }}>
              <div style={{ fontSize:"10px", color:B.textMuted,
                fontWeight:600, marginBottom:"4px" }}>{MESES_FULL[m]}</div>
              <div style={{ fontSize:"20px", fontWeight:900, color:clr,
                fontFamily:"'Nunito',sans-serif" }}>{pct}%</div>
              <div style={{ fontSize:"10px", color:B.textMuted,
                marginTop:"2px" }}>{pagaron}/{activos.length}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// VIEW: ALUMNOS
// ═══════════════════════════════════════════════════════════════════════════════
function ViewAlumnos({ alumnos, setAlumnos, onSelect, onCreate }) {
  const [q,      setQ]      = useState("");
  const [nivel,  setNivel]  = useState("TODOS");
  const [estado, setEstado] = useState("TODOS");

  const filtrados = useMemo(() => alumnos.filter(a => {
    const mQ = !q.trim() || a.nombre.toLowerCase().includes(q.toLowerCase());
    const mN = nivel==="TODOS" || a.nivel===nivel;
    const mE = estado==="TODOS"
      || (estado==="ACTIVO"  && a.activo && mesesPend(a).length===0)
      || (estado==="MOROSO"  && a.activo && mesesPend(a).length>0)
      || (estado==="BAJA"    && !a.activo);
    return mQ && mN && mE;
  }), [alumnos,q,nivel,estado]);

  const darBaja    = id => { if(!confirm("¿Dar de baja?")) return; setAlumnos(p=>p.map(a=>a.id===id?{...a,activo:false}:a)); };
  const reactivar  = id => setAlumnos(p=>p.map(a=>a.id===id?{...a,activo:true}:a));

  const btnSt = (color, bg, brd) => ({
    background:bg, border:`1px solid ${brd}`, color,
    padding:"5px 12px", borderRadius:"7px", fontSize:"12px",
    fontWeight:700, cursor:"pointer", fontFamily:"inherit",
  });

  return (
    <div>
      <SectionHeader eyebrow="Gestión" title="Alumnos"
        action={
          <button onClick={onCreate} style={{ background:B.green, border:"none",
            color:"#fff", padding:"10px 20px", borderRadius:"10px",
            fontSize:"13px", fontWeight:800, cursor:"pointer", fontFamily:"inherit" }}>
            + Nuevo alumno
          </button>
        }
      />
      <Div/>

      {/* Filtros */}
      <div style={{ display:"flex", gap:"8px", marginBottom:"16px", flexWrap:"wrap" }}>
        <input value={q} onChange={e=>setQ(e.target.value)}
          placeholder="Buscar por nombre..."
          style={{ ...inputSt, flex:"1", minWidth:"200px" }} />
        <select value={nivel} onChange={e=>setNivel(e.target.value)} style={{ ...selectSt, width:"auto" }}>
          <option value="TODOS">Todos los niveles</option>
          {NIVELES.map(n=><option key={n}>{n}</option>)}
        </select>
        <select value={estado} onChange={e=>setEstado(e.target.value)} style={{ ...selectSt, width:"auto" }}>
          <option value="TODOS">Todos</option>
          <option value="ACTIVO">Al día</option>
          <option value="MOROSO">Con adeudo</option>
          <option value="BAJA">Bajas</option>
        </select>
      </div>

      <PanelTable>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr>
              <TH>Alumno</TH><TH>Nivel</TH><TH>Estado</TH>
              <TH>Meses pendientes</TH><TH right>Adeudo</TH><TH>Acciones</TH>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((a,i) => {
              const pend   = mesesPend(a);
              const moroso = pend.length > 0 && a.activo;
              return (
                <tr key={a.id} style={{ background: i%2===0 ? B.panel : B.panelAlt,
                  borderBottom:`1px solid ${B.border}` }}>
                  <td style={{ padding:"11px 14px" }}>
                    <div style={{ fontWeight:700, color:B.text, fontSize:"13px" }}>{a.nombre}</div>
                    <div style={{ fontSize:"11px", color:B.textMuted, marginTop:"2px",
                      fontFamily:"'Courier New',monospace" }}>#{a.id}</div>
                  </td>
                  <TD muted>{a.nivel}</TD>
                  <td style={{ padding:"11px 14px" }}>
                    {!a.activo  ? <Pill label="Baja"       variant="gray"   /> :
                     moroso     ? <Pill label="Con adeudo" variant="red"    /> :
                                  <Pill label="Al día"     variant="teal"   />}
                  </td>
                  <td style={{ padding:"11px 14px", fontSize:"12px",
                    color: moroso ? B.red : B.textMuted }}>
                    {pend.length===0 ? <span style={{color:B.teal}}>✓ Sin adeudos</span>
                      : pend.map(m=>MESES_LABEL[m]).join(", ")}
                  </td>
                  <td style={{ padding:"11px 14px", textAlign:"right", fontWeight:700,
                    color: moroso ? B.red : B.textMuted, fontSize:"13px" }}>
                    {pend.length===0 ? "—" : fmt(deudaTotal(a))}
                  </td>
                  <td style={{ padding:"11px 14px" }}>
                    <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
                      <button onClick={()=>onSelect(a)}
                        style={btnSt(B.greenDark, B.greenBg, B.borderMid)}>
                        Ver perfil
                      </button>
                      {a.activo
                        ? <button onClick={()=>darBaja(a.id)}
                            style={btnSt(B.red, B.redBg, B.redBrd)}>
                            Dar de baja
                          </button>
                        : <button onClick={()=>reactivar(a.id)}
                            style={btnSt(B.teal, B.tealBg, B.tealBrd)}>
                            Reactivar
                          </button>}
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtrados.length===0 && (
              <tr><td colSpan={6} style={{ padding:"40px", textAlign:"center",
                color:B.textMuted, fontStyle:"italic" }}>
                Sin resultados con los filtros actuales
              </td></tr>
            )}
          </tbody>
        </table>
      </PanelTable>
      <div style={{ marginTop:"8px", fontSize:"12px", color:B.textMuted }}>
        {filtrados.length} alumno{filtrados.length!==1?"s":""} encontrado{filtrados.length!==1?"s":""}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// VIEW: PERFIL ALUMNO
// ═══════════════════════════════════════════════════════════════════════════════
function ViewPerfil({ alumno, setAlumnos, onBack }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ nombre:alumno.nombre, nivel:alumno.nivel, colegiatura:alumno.colegiatura });
  const pend = mesesPend(alumno);

  const guardar = () => {
    setAlumnos(p => p.map(a => a.id===alumno.id
      ? {...a, ...form, nombre:form.nombre.toUpperCase(), colegiatura:Number(form.colegiatura)}
      : a));
    setEditing(false);
  };
  const f = k => e => setForm(p=>({...p,[k]:e.target.value}));

  return (
    <div>
      {/* Breadcrumb */}
      <button onClick={onBack} style={{ background:"none", border:"none",
        color:B.textMuted, cursor:"pointer", fontSize:"13px", fontFamily:"inherit",
        padding:0, marginBottom:"16px", display:"flex", alignItems:"center", gap:"6px" }}>
        ← Regresar a Alumnos
      </button>

      {/* Header card */}
      <div style={{ background:B.panel, border:`1.5px solid ${B.border}`,
        borderRadius:"16px", padding:"20px 24px", marginBottom:"20px",
        boxShadow:`0 2px 12px ${B.shadow}` }}>
        <div style={{ display:"flex", justifyContent:"space-between",
          alignItems:"flex-start", flexWrap:"wrap", gap:"12px", marginBottom:"16px" }}>
          <div style={{ flex:1, minWidth:"260px" }}>
            {/* ID */}
            <div style={{ fontSize:"10px", fontWeight:700, letterSpacing:"2px",
              textTransform:"uppercase", color:B.textMuted, marginBottom:"4px",
              fontFamily:"'Courier New',monospace" }}>#{alumno.id}</div>
            {/* Nombre */}
            {editing
              ? <input value={form.nombre} onChange={f("nombre")}
                  style={{ ...inputSt, fontSize:"18px", fontWeight:800, marginBottom:"8px" }}/>
              : <div style={{ fontSize:"clamp(16px,2.5vw,22px)", fontWeight:900,
                  color:B.text, marginBottom:"8px", fontFamily:"'Nunito',sans-serif",
                  lineHeight:1.2 }}>{alumno.nombre}</div>}
            {/* Badges */}
            <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", alignItems:"center" }}>
              {!alumno.activo ? <Pill label="Baja" variant="gray"/> :
               pend.length>0 ? <Pill label="Con adeudo" variant="red"/> :
                               <Pill label="Al día" variant="teal"/>}
              {editing
                ? <select value={form.nivel} onChange={f("nivel")} style={{ ...selectSt, padding:"4px 10px", width:"auto", fontSize:"12px" }}>
                    {NIVELES.map(n=><option key={n}>{n}</option>)}
                  </select>
                : <Pill label={alumno.nivel} variant="green"/>}
            </div>
          </div>
          {/* Acciones */}
          <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
            {editing
              ? <>
                  <button onClick={guardar} style={{ background:B.green, border:"none",
                    color:"#fff", padding:"9px 18px", borderRadius:"9px",
                    fontSize:"13px", fontWeight:800, cursor:"pointer", fontFamily:"inherit" }}>
                    Guardar cambios
                  </button>
                  <button onClick={()=>setEditing(false)} style={{ background:B.panel,
                    border:`1.5px solid ${B.border}`, color:B.textMuted,
                    padding:"9px 16px", borderRadius:"9px", fontSize:"13px",
                    cursor:"pointer", fontFamily:"inherit" }}>
                    Cancelar
                  </button>
                </>
              : <button onClick={()=>setEditing(true)} style={{ background:B.greenBg,
                  border:`1.5px solid ${B.borderMid}`, color:B.greenDark,
                  padding:"9px 18px", borderRadius:"9px", fontSize:"13px",
                  fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
                  ✏️ Editar datos
                </button>}
          </div>
        </div>

        {/* Stats rápidos */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",
          gap:"12px", paddingTop:"16px", borderTop:`1px solid ${B.border}` }}>
          {[
            { label:"Colegiatura/mes",
              value: editing
                ? <input type="number" value={form.colegiatura} onChange={f("colegiatura")}
                    style={{ ...inputSt, fontSize:"18px", fontWeight:800, width:"140px" }}/>
                : <span style={{ color:B.greenDark, fontWeight:900, fontSize:"20px",
                    fontFamily:"'Nunito',sans-serif" }}>{fmt(alumno.colegiatura)}</span> },
            { label:"Total cobrado",
              value:<span style={{ color:B.teal, fontWeight:900, fontSize:"20px",
                fontFamily:"'Nunito',sans-serif" }}>{fmt(pagadoTotal(alumno))}</span> },
            { label:"Adeudo actual",
              value:<span style={{ color:pend.length>0?B.red:B.textMuted, fontWeight:900,
                fontSize:"20px", fontFamily:"'Nunito',sans-serif" }}>
                {pend.length>0 ? fmt(deudaTotal(alumno)) : "—"}</span> },
            { label:"Meses pendientes",
              value: pend.length===0
                ? <span style={{ color:B.teal, fontWeight:700, fontSize:"14px" }}>✓ Ninguno</span>
                : <span style={{ color:B.red, fontWeight:700, fontSize:"13px" }}>
                    {pend.map(m=>MESES_LABEL[m]).join(", ")}</span> },
          ].map((s,i) => (
            <div key={i}>
              <div style={{ fontSize:"10px", fontWeight:700, letterSpacing:"1.5px",
                textTransform:"uppercase", color:B.textMuted, marginBottom:"6px" }}>
                {s.label}
              </div>
              {s.value}
            </div>
          ))}
        </div>
      </div>

      {/* Mapa de pagos */}
      <div style={{ fontSize:"13px", fontWeight:700, color:B.text, marginBottom:"10px" }}>
        Mapa de pagos — Ciclo 2025-2026
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(78px,1fr))",
        gap:"8px", marginBottom:"24px" }}>
        {MESES_ORDEN.map(m => {
          const paid = alumno.pagados.includes(m);
          return (
            <div key={m} style={{ background: paid ? B.tealBg : B.redBg,
              border:`1.5px solid ${paid ? B.tealBrd+"88" : B.redBrd+"88"}`,
              borderRadius:"10px", padding:"10px 8px", textAlign:"center" }}>
              <div style={{ fontSize:"10px", color:B.textMuted, fontWeight:600,
                marginBottom:"4px" }}>{MESES_FULL[m]}</div>
              <div style={{ fontSize:"20px", marginBottom:"2px" }}>{paid?"✓":"○"}</div>
              <div style={{ fontSize:"11px", fontWeight:700,
                color: paid ? B.teal : B.red }}>
                {paid ? "Pagado" : "Pendiente"}
              </div>
            </div>
          );
        })}
      </div>

      {/* Historial de recibos */}
      <div style={{ fontSize:"13px", fontWeight:700, color:B.text, marginBottom:"10px" }}>
        Historial de recibos
      </div>
      <PanelTable>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr><TH>Folio</TH><TH>Concepto</TH><TH>Fecha</TH><TH right>Monto</TH></tr>
          </thead>
          <tbody>
            {alumno.historial.length===0
              ? <tr><td colSpan={4} style={{ padding:"30px", textAlign:"center",
                  color:B.textMuted, fontStyle:"italic" }}>Sin pagos registrados</td></tr>
              : alumno.historial.slice().reverse().map((h,i) => (
                  <tr key={h.folio} style={{ background: i%2===0?B.panel:B.panelAlt,
                    borderBottom:`1px solid ${B.border}` }}>
                    <TD mono muted>#{h.folio}</TD>
                    <TD bold>{h.concepto}</TD>
                    <TD muted>{h.fecha}</TD>
                    <td style={{ padding:"11px 14px", textAlign:"right", fontWeight:700,
                      color:B.teal, fontSize:"14px" }}>{fmt(h.monto)}</td>
                  </tr>
                ))}
          </tbody>
        </table>
      </PanelTable>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// VIEW: ADEUDOS
// ═══════════════════════════════════════════════════════════════════════════════
function ViewAdeudos({ alumnos }) {
  const morosos   = alumnos.filter(a=>a.activo&&mesesPend(a).length>0).sort((a,b)=>deudaTotal(b)-deudaTotal(a));
  const totalPor  = morosos.reduce((s,a)=>s+deudaTotal(a), 0);

  const exportCSV = () => {
    const rows = [["#","Nombre","Nivel",...MESES_ORDEN.map(m=>MESES_FULL[m]),"Total MXN"]];
    morosos.forEach((a,i) => rows.push([
      i+1, a.nombre, a.nivel,
      ...MESES_ORDEN.map(m => a.pagados.includes(m)?"✓":"✗"),
      deudaTotal(a)
    ]));
    const blob = new Blob([rows.map(r=>r.join(",")).join("\n")],{type:"text/csv"});
    const url  = URL.createObjectURL(blob);
    Object.assign(document.createElement("a"),{href:url,download:"adeudos_oxford.csv"}).click();
  };

  return (
    <div>
      <SectionHeader eyebrow="Cobranza" title="Reporte de Adeudos"
        action={
          <button onClick={exportCSV} style={{ background:B.greenBg,
            border:`1.5px solid ${B.borderMid}`, color:B.greenDark,
            padding:"10px 20px", borderRadius:"10px", fontSize:"13px",
            fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
            ↓ Exportar CSV
          </button>
        }
      />
      <Div/>

      {/* KPIs */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",
        gap:"12px", marginBottom:"24px" }}>
        <StatCard label="Alumnos con adeudo" value={morosos.length} warn={morosos.length>0}/>
        <StatCard label="Total por cobrar"   value={fmt(totalPor)} warn={totalPor>0}/>
        <StatCard label="Promedio por alumno" value={fmt(morosos.length?totalPor/morosos.length:0)}/>
      </div>

      {/* Tabla matricial */}
      <PanelTable>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"12px" }}>
          <thead>
            <tr>
              <TH>#</TH><TH>Alumno</TH><TH>Nivel</TH>
              {MESES_ORDEN.map(m=><TH key={m}>{MESES_LABEL[m]}</TH>)}
              <TH right>Total</TH>
            </tr>
          </thead>
          <tbody>
            {morosos.map((a,i) => (
              <tr key={a.id} style={{ background: i%2===0?B.panel:B.panelAlt,
                borderBottom:`1px solid ${B.border}` }}>
                <TD muted>{i+1}</TD>
                <td style={{ padding:"11px 14px", fontWeight:700, color:B.text,
                  fontSize:"12px", whiteSpace:"nowrap", maxWidth:"180px",
                  overflow:"hidden", textOverflow:"ellipsis" }}>
                  {a.nombre}
                </td>
                <TD muted>{a.nivel}</TD>
                {MESES_ORDEN.map(m => {
                  const paid = a.pagados.includes(m);
                  return (
                    <td key={m} style={{ padding:"11px 14px", textAlign:"center" }}>
                      <span style={{ fontSize:"14px", color: paid ? B.teal : B.redBrd,
                        fontWeight:700 }}>{paid ? "✓" : "○"}</span>
                    </td>
                  );
                })}
                <td style={{ padding:"11px 14px", textAlign:"right", fontWeight:800,
                  color:B.red, fontSize:"13px", whiteSpace:"nowrap" }}>
                  {fmt(deudaTotal(a))}
                </td>
              </tr>
            ))}
            {morosos.length===0 && (
              <tr><td colSpan={MESES_ORDEN.length+4} style={{ padding:"40px",
                textAlign:"center", color:B.textMuted, fontStyle:"italic" }}>
                ✅ Sin alumnos con adeudo
              </td></tr>
            )}
          </tbody>
          {morosos.length>0 && (
            <tfoot>
              <tr style={{ borderTop:`2px solid ${B.border}`, background:B.greenBg }}>
                <td colSpan={3+MESES_ORDEN.length} style={{ padding:"11px 14px",
                  fontSize:"12px", color:B.textMuted, fontWeight:700 }}>
                  Total general
                </td>
                <td style={{ padding:"11px 14px", textAlign:"right", fontWeight:900,
                  color:B.red, fontSize:"15px" }}>{fmt(totalPor)}</td>
              </tr>
            </tfoot>
          )}
        </table>
      </PanelTable>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODAL: NUEVO ALUMNO
// ═══════════════════════════════════════════════════════════════════════════════
function ModalNuevo({ onClose, onSave }) {
  const [form, setForm] = useState({ nombre:"", nivel:"PREESCOLAR", colegiatura:"" });
  const f = k => e => setForm(p=>({...p,[k]:e.target.value}));
  const valid = form.nombre.trim() && Number(form.colegiatura)>0;

  return (
    <Modal title="Nuevo Alumno" onClose={onClose}>
      <Field label="Nombre completo">
        <input value={form.nombre} onChange={f("nombre")}
          placeholder="APELLIDO NOMBRE" style={inputSt}/>
      </Field>
      <Field label="Nivel escolar">
        <select value={form.nivel} onChange={f("nivel")} style={selectSt}>
          {NIVELES.map(n=><option key={n}>{n}</option>)}
        </select>
      </Field>
      <Field label="Colegiatura mensual (MXN)">
        <input type="number" value={form.colegiatura} onChange={f("colegiatura")}
          placeholder="Ej: 2900" style={inputSt}/>
      </Field>
      <div style={{ display:"flex", gap:"10px", marginTop:"6px" }}>
        <button
          disabled={!valid}
          onClick={()=>onSave({
            id:genId(), nombre:form.nombre.toUpperCase(),
            nivel:form.nivel, colegiatura:Number(form.colegiatura),
            activo:true, extras:{INSC:0}, pagados:[], historial:[]
          })}
          style={{ flex:1, padding:"11px", border:"none", borderRadius:"10px",
            fontSize:"14px", fontWeight:800, cursor:valid?"pointer":"not-allowed",
            background: valid ? B.green : B.border,
            color: valid ? "#fff" : B.textMuted, fontFamily:"inherit" }}>
          Guardar alumno
        </button>
        <button onClick={onClose} style={{ padding:"11px 18px", border:`1.5px solid ${B.border}`,
          background:B.panel, color:B.textMuted, borderRadius:"10px",
          fontSize:"14px", cursor:"pointer", fontFamily:"inherit" }}>
          Cancelar
        </button>
      </div>
    </Modal>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SIDEBAR
// ═══════════════════════════════════════════════════════════════════════════════
const NAV = [
  { id:"dashboard", icon:"◈", label:"Dashboard"  },
  { id:"alumnos",   icon:"◉", label:"Alumnos"     },
  { id:"adeudos",   icon:"◎", label:"Adeudos"     },
];

function Sidebar({ active, setActive, collapsed }) {
  return (
    <div style={{ background:B.sidebar, borderRight:`1px solid rgba(255,255,255,0.06)`,
      display:"flex", flexDirection:"column", width:collapsed?"60px":"220px",
      transition:"width .25s", flexShrink:0, overflow:"hidden" }}>
      {/* Logo */}
      <div style={{ padding: collapsed?"16px 12px":"20px 20px 16px",
        borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          {/* Mini SVG logo */}
          <svg width="30" height="30" viewBox="0 0 100 100" style={{flexShrink:0}}>
            <circle cx="50" cy="50" r="50" fill={B.green}/>
            <g transform="translate(50,50) rotate(45)">
              <rect x="-22" y="-22" width="44" height="44" rx="7" fill="#F5A623"/>
              <rect x="-22" y="-22" width="22" height="22" rx="5" fill="#3d6010"/>
              <rect x="0" y="0" width="22" height="22" rx="5" fill="#F5E642"/>
              <rect x="-22" y="0" width="22" height="22" rx="5" fill="#F5E642"/>
              <rect x="0" y="-22" width="22" height="22" rx="5" fill="#3d6010"/>
            </g>
            <circle cx="50" cy="50" r="10" fill="#fff"/>
            <circle cx="50" cy="53" r="5" fill={B.green}/>
          </svg>
          {!collapsed && (
            <div>
              <div style={{ color:"#fff", fontFamily:"'Nunito',sans-serif",
                fontWeight:900, fontSize:"15px", lineHeight:1.1 }}>Oxford</div>
              <div style={{ color:"rgba(255,255,255,0.45)", fontSize:"9px",
                letterSpacing:"1.5px", textTransform:"uppercase" }}>Admin</div>
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:"12px 8px" }}>
        {NAV.map(n => {
          const isActive = active === n.id;
          return (
            <div key={n.id} onClick={()=>setActive(n.id)} style={{
              display:"flex", alignItems:"center", gap:"11px",
              padding:"11px 12px", borderRadius:"10px", cursor:"pointer",
              marginBottom:"3px",
              background: isActive ? "rgba(141,198,63,0.18)" : "transparent",
              border:`1px solid ${isActive?"rgba(141,198,63,0.4)":"transparent"}`,
              transition:"all .15s",
            }}>
              <span style={{ fontSize:"16px", flexShrink:0,
                color: isActive ? B.green : "rgba(255,255,255,0.45)" }}>
                {n.icon}
              </span>
              {!collapsed && (
                <span style={{ fontSize:"13px", whiteSpace:"nowrap",
                  fontWeight: isActive ? 800 : 400,
                  color: isActive ? "#fff" : "rgba(255,255,255,0.55)" }}>
                  {n.label}
                </span>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div style={{ padding:"14px 18px", borderTop:"1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ color:"rgba(255,255,255,0.35)", fontSize:"10px" }}>Ciclo 2025-2026</div>
          <div style={{ color:"rgba(255,255,255,0.2)", fontSize:"9px", marginTop:"2px" }}>
            v1.0 · Oxford Recibos
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════════════════════════════════════════════
export default function OxfordAdmin() {
  const [alumnos,    setAlumnos]    = useState(ALUMNOS_INIT);
  const [view,       setView]       = useState("dashboard");
  const [perfilId,   setPerfilId]   = useState(null);
  const [showNuevo,  setShowNuevo]  = useState(false);
  const [collapsed,  setCollapsed]  = useState(false);

  const perfilAlumno = perfilId ? alumnos.find(a=>a.id===perfilId) : null;

  const handleSelect = a => { setPerfilId(a.id); setView("perfil"); };
  const handleCreate = a => { setAlumnos(p=>[...p,a]); setShowNuevo(false); };

  const renderView = () => {
    if (view==="perfil" && perfilAlumno)
      return <ViewPerfil alumno={perfilAlumno} setAlumnos={setAlumnos}
               onBack={()=>{ setView("alumnos"); setPerfilId(null); }}/>;
    if (view==="dashboard") return <ViewDashboard alumnos={alumnos}/>;
    if (view==="alumnos")   return <ViewAlumnos alumnos={alumnos} setAlumnos={setAlumnos}
                                     onSelect={handleSelect} onCreate={()=>setShowNuevo(true)}/>;
    if (view==="adeudos") return <ViewAdeudos alumnos={alumnos}/>;
  };

  const navActive = view==="perfil" ? "alumnos" : view;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        body { background:${B.bg}; font-family:'Nunito',sans-serif; color:${B.text}; }
        input, select { outline:none; color-scheme:light; }
        button { transition:opacity .15s, transform .1s; }
        button:active { opacity:.85; transform:scale(.98); }
        ::-webkit-scrollbar { width:5px; height:5px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:${B.border}; border-radius:4px; }
      `}</style>

      <div style={{ display:"flex", height:"100vh", overflow:"hidden" }}>
        <Sidebar active={navActive} setActive={v=>{ setView(v); setPerfilId(null); }} collapsed={collapsed}/>

        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
          {/* Topbar */}
          <div style={{ background:B.panel, borderBottom:`1.5px solid ${B.border}`,
            padding:"12px 24px", display:"flex", alignItems:"center", gap:"16px",
            flexShrink:0, boxShadow:`0 2px 8px ${B.shadow}` }}>
            <button onClick={()=>setCollapsed(c=>!c)} style={{ background:"none",
              border:"none", color:B.textMuted, fontSize:"20px", cursor:"pointer",
              padding:"4px", lineHeight:1 }}>☰</button>
            {/* Breadcrumb */}
            <div style={{ fontSize:"13px", color:B.textMuted }}>
              Oxford <span style={{color:B.border}}>›</span>{" "}
              <span style={{ color:B.text, fontWeight:700 }}>
                {view==="perfil" && perfilAlumno ? perfilAlumno.nombre : NAV.find(n=>n.id===navActive)?.label}
              </span>
            </div>
            <div style={{ flex:1 }}/>
            {/* Avatar */}
            <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
              <div style={{ width:"32px", height:"32px", borderRadius:"50%",
                background:B.greenBg, border:`2px solid ${B.borderMid}`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:"13px", fontWeight:800, color:B.greenDark }}>D</div>
              <div style={{ fontSize:"12px", color:B.textMuted, lineHeight:1.2 }}>
                <div style={{ color:B.text, fontWeight:700 }}>Director</div>
                <div>Oxford Matamoros</div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div style={{ flex:1, overflowY:"auto", padding:"clamp(16px,3vw,32px)" }}>
            {renderView()}
          </div>
        </div>
      </div>

      {showNuevo && <ModalNuevo onClose={()=>setShowNuevo(false)} onSave={handleCreate}/>}
    </>
  );
}
