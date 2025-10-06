import React, { useMemo, useState, useEffect } from "react";

/* ================= THEME ================= */
const light = {
  pageBg: "linear-gradient(180deg, #f8fafc, #eef2ff)",
  cardBg: "rgba(255,255,255,0.92)",
  border: "#e5e7eb",
  text: "#0f172a",
  sub: "#64748b",
  shadow: "0 10px 30px rgba(2,6,23,.06)",
  glass: "rgba(255,255,255,0.7)",
  solidBtn: "#111827",
};
const dark = {
  pageBg: "linear-gradient(180deg, #0b1020, #0e172a)",
  cardBg: "rgba(20,25,40,0.85)",
  border: "#263042",
  text: "#e5e7eb",
  sub: "#93a4c0",
  shadow: "0 10px 30px rgba(0,0,0,.55)",
  glass: "rgba(15,20,32,0.55)",
  solidBtn: "#0ea5e9",
};

const SHOW_SECTIONS = false;

/* ===== BLUEPRINTS (unchanged content trimmed) ===== */
const NEW_INCENTIVES = { /* …same as before… */ 
  key:"new_incentives", title:"New Incentives", color:"#10b981",
  categories:[ /* …all your categories from previous file… */ ]
};
const REALISED = { /* … */ key:"realised_investment", title:"Realised Investment", color:"#0ea5e9",
  categories:[ /* … */ ]
};
const ONTRACK = { /* … */ key:"ontrack", title:"On-Track Enhancement", color:"#f59e0b",
  categories:[ /* … */ ]
};
/* NEW: Dashboard */
const DASHBOARD = { key:"dashboard", title:"Dashboard", color:"#e30613", categories:[] };
const MODULES = [DASHBOARD, NEW_INCENTIVES, REALISED, ONTRACK];

/* ================= UTIL: responsive cols ================= */
function useTwoColumns(breakpoint = 1200) {
  const [two, setTwo] = React.useState(() => window.innerWidth >= breakpoint);
  React.useEffect(() => {
    const onResize = () => setTwo(window.innerWidth >= breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);
  return two;
}

/* ================= STYLES ================= */
function makeStyles(p) {
  return {
    shell: {
      minHeight: "100vh",
      width: "100%",            // <- full width, no 100vw overflow
      background: p.pageBg,
      color: p.text,
      overflowX: "hidden",
    },
    topbar: {
      position: "sticky", top: 0, zIndex: 20,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "10px 16px",
      borderBottom: `1px solid ${p.border}`,
      backdropFilter: "blur(8px)",
      background: p.glass,
    },
    brandRow: { display: "flex", alignItems: "center", gap: 10 },
    logo: { height: 26, width: "auto" },
    title: { margin: 0, fontSize: 16, fontWeight: 700 },
    topActions: { display: "flex", gap: 8 },
    pillBtn: { padding: "6px 10px", borderRadius: 999, border: `1px solid ${p.border}`, background: p.cardBg, color: p.text, cursor: "pointer" },

    layout: {
      display: "grid",
      gridTemplateColumns: "260px minmax(0, 1fr)", // wider sidebar, flexible content
      gap: 16,
      padding: 12,
      width: "100%",             // <- important
      maxWidth: "100%",
    },

    sidebar: {
      position: "sticky", top: 68, alignSelf: "start",
      height: "calc(100vh - 86px)", overflow: "auto",
      padding: 14, borderRadius: 20, border: `1px solid ${p.border}`,
      backdropFilter: "blur(6px)", background: p.cardBg, boxShadow: p.shadow,
    },
    brand: { fontSize: 18, fontWeight: 700, marginBottom: 10 },

    moduleBtn: (active, color) => ({
      display: "flex", alignItems: "center", gap: 10, width: "100%",
      padding: "10px 12px", borderRadius: 14, border: `1px solid ${p.border}`,
      background: active ? color : p.cardBg, color: active ? "#fff" : p.text,
      cursor: "pointer", fontSize: 14, transition: "all .18s ease",
    }),
    dot: (color) => ({ width: 8, height: 8, borderRadius: 999, background: color }),

    content: {
      display: "grid", gap: 16, width: "100%", maxWidth: "100%", paddingRight: 12,
      minHeight: "calc(100vh - 68px)",
    },

    header: { display: "flex", alignItems: "center", justifyContent: "space-between" },
    h1: { fontSize: 26, margin: "4px 0 6px" },
    sub: { fontSize: 13, color: p.sub, marginTop: 0 },

    btnGhost: { padding: "8px 10px", border: `1px solid ${p.border}`, background: p.cardBg, borderRadius: 12, color: p.text, cursor: "pointer" },
    btnSolid: { padding: "8px 10px", border: "1px solid transparent", background: p.solidBtn, color: "#fff", borderRadius: 12, cursor: "pointer" },

    card: { border: `1px solid ${p.border}`, background: p.cardBg, borderRadius: 18, padding: 20, boxShadow: p.shadow, width: "100%" },

    grid2: { display: "grid", columnGap: 16, rowGap: 14, gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", alignItems: "start" },

    /* NEW: fluid card grid for Dashboard KPIs */
    gridAuto: { display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" },

    label: { fontSize: 12, color: p.sub },
    input: {
      width: "100%", minWidth: 0, boxSizing: "border-box",
      padding: "10px 12px", border: `1px solid ${p.border}`, borderRadius: 12,
      fontSize: 14, outline: "none", background: "transparent", color: p.text,
    },
    textarea: { minHeight: 96 },
    actions: { display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 14 },
    badgeRow: { display: "flex", gap: 6, marginLeft: "auto", fontSize: 11, color: p.sub },
    sectionTitle: { fontWeight: 600, fontSize: 16, margin: 0 },

    barWrap: { width: "100%", height: 8, background: p.border, borderRadius: 999, overflow: "hidden" },
    bar: (color, v) => ({ height: "100%", width: `${v}%`, background: color }),
  };
}

/* ================= INPUTS ================= */
function InputForField({ field, value, onChange, s }) {
  const base = s.input;
  if (field.type === "longtext") {
    return <textarea style={{ ...base, ...s.textarea }} value={value || ""} onChange={(e)=>onChange(e.target.value)} placeholder={field.label} />;
  }
  if (field.type === "date") return <input type="date" style={base} value={value || ""} onChange={(e)=>onChange(e.target.value)} />;
  if (field.type === "number") return <input type="number" style={base} value={value || ""} onChange={(e)=>onChange(e.target.value)} placeholder="0" />;
  if (field.type === "file") return <input type="file" onChange={(e)=>onChange(e.target.files?.[0]?.name || "")} />;
  return <input style={base} value={value || ""} onChange={(e)=>onChange(e.target.value)} placeholder={field.label} />;
}

/* ================= CATEGORY CARD ================= */
function CategoryCard({ moduleKey, category, color, state, setState, s }) {
  const twoCols = useTwoColumns(1200);
  return (
    <div style={s.card} id={`${moduleKey}.${category.key}`}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
        <h3 style={s.sectionTitle}>{category.title}</h3>
        <div style={s.badgeRow}><span>draft</span>•<span>autosave</span></div>
      </div>

      <div style={{ ...s.grid2, gridTemplateColumns: twoCols ? "minmax(0,1fr) minmax(0,1fr)" : "1fr" }}>
        {category.fields.map((f) => (
          <div key={f.key} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={s.label}>{f.label}</label>
            <InputForField field={f} s={s} value={state[`${moduleKey}.${category.key}.${f.key}`]}
              onChange={(v) => setState((prev) => ({ ...prev, [`${moduleKey}.${category.key}.${f.key}`]: v }))} />
          </div>
        ))}
      </div>

      <div style={s.actions}>
        <button style={s.btnGhost}>Save Draft</button>
        <button style={{ ...s.btnGhost, color: "#fff", background: color, borderColor: color }}>Submit Section</button>
      </div>
    </div>
  );
}

/* ================= DASHBOARD VIEW ================= */
function DashboardView({ s }) {
  const kpis = [
    { label: "Applications (YTD)", value: "184", color: "#0ea5e9" },
    { label: "Approved Incentives", value: "97", color: "#10b981" },
    { label: "Realised Investment (RM)", value: "4.12B", color: "#eab308" },
  ];
  const progress = [
    { label: "Compliance Filings", value: 72, color: "#10b981" },
    { label: "APR Received", value: 54, color: "#0ea5e9" },
    { label: "On-Track Projects", value: 81, color: "#f59e0b" },
  ];

  return (
    <>
      <div style={s.header}>
        <div>
          <h2 style={s.h1}>Dashboard</h2>
          <p style={s.sub}>Overview • KPIs • quick actions</p>
        </div>
      </div>

      {/* fluid KPI cards */}
      <div style={s.gridAuto}>
        {kpis.map((k) => (
          <div key={k.label} style={s.card}>
            <div style={{ fontSize: 12, color: s.label?.color || "#64748b" }}>{k.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, marginTop: 6 }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div style={s.card}>
        <h4 style={{ marginTop: 0 }}>Progress</h4>
        <div style={{ display: "grid", gap: 12, marginTop: 8 }}>
          {progress.map((p) => (
            <div key={p.label}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <span style={{ color: "#64748b" }}>{p.label}</span><span>{p.value}%</span>
              </div>
              <div style={s.barWrap}><div style={s.bar(p.color, p.value)} /></div>
            </div>
          ))}
        </div>
      </div>

      <div style={s.grid2}>
        <div style={s.card}>
          <h4 style={{ marginTop: 0 }}>Quick Actions</h4>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
            <button style={s.btnSolid}>New Application</button>
            <button style={s.btnGhost}>Import APR</button>
            <button style={s.btnGhost}>Upload Supporting Docs</button>
            <button style={s.btnGhost}>Generate WER</button>
          </div>
        </div>
        <div style={s.card}>
          <h4 style={{ marginTop: 0 }}>Recent Activity</h4>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13 }}>
            <li>3 submissions received today</li>
            <li>2 projects marked On-Track</li>
            <li>1 APR pending verification</li>
          </ul>
        </div>
      </div>
    </>
  );
}

/* ================= APP ================= */
export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("mida_theme");
    if (stored) return stored === "dark";
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const palette = darkMode ? dark : light;
  const s = makeStyles(palette);

  useEffect(() => {
    localStorage.setItem("mida_theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const [active, setActive] = useState(MODULES[0].key);
  const current = useMemo(() => MODULES.find((m) => m.key === active), [active]);
  const [state, setState] = useState({});

  return (
    <div style={s.shell}>
      <div style={s.topbar}>
        <div style={s.brandRow}>
          <img src="/mida-logo.png" alt="MIDA" style={s.logo} />
          <h1 style={s.title}>MIDA Prototype Portal</h1>
        </div>
        <div style={s.topActions}>
          <button style={s.pillBtn} onClick={() => setDarkMode((v) => !v)}>
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </div>

      <div style={s.layout}>
        <aside style={s.sidebar}>
          <div style={s.brand}>Investment Portal</div>
          <p style={{ fontSize: 12, color: palette.sub, marginTop: 0, marginBottom: 8 }}>Select a module</p>
          <div style={{ display: "grid", gap: 8 }}>
            {MODULES.map((m) => (
              <button key={m.key} onClick={() => setActive(m.key)} style={s.moduleBtn(active === m.key, m.color)}>
                <span style={s.dot(m.color)} />
                <span>{m.title}</span>
              </button>
            ))}
          </div>
        </aside>

        <main style={s.content}>
          {current.key === "dashboard" ? (
            <DashboardView s={s} />
          ) : (
            <>
              <div style={s.header}>
                <div>
                  <h2 style={s.h1}>{current.title} — Prototype</h2>
                  <p style={s.sub}>Full-screen layout • left module nav • autosave feel</p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={s.btnGhost}>Triggers</button>
                  <button style={s.btnSolid}>Publish Demo</button>
                </div>
              </div>

              {current.categories.map((c) => (
                <CategoryCard
                  key={c.key}
                  moduleKey={current.key}
                  category={c}
                  color={current.color}
                  state={state}
                  setState={setState}
                  s={s}
                />
              ))}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
