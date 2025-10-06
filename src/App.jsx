import React, { useMemo, useState } from "react";

// ================= Modernized Prototype (No Tailwind / No shadcn) =================
// - Vertical left pane with the 3 modules
// - Clean, modern glassy cards, soft shadows, rounded corners
// - Sticky sidebar, responsive layout, smooth transitions
// - Plain React + inline styles so it runs in any Vite React app

// ---- Data Blueprints (same fields, reorganized UI) ----
const NEW_INCENTIVES = {
  key: "new_incentives",
  title: "New Incentives",
  color: "#10b981", // emerald
  categories: [
    { key: "company_profile", title: "Company Profile", fields: [
      { key: "company_name", label: "Company Name" },
      { key: "roc_no", label: "ROC Number" },
      { key: "biz_address", label: "Business Address", type: "longtext" },
      { key: "industry_type", label: "Industry Type (Manufacturing/Services)" },
      { key: "contact_information", label: "Contact Information", type: "longtext" },
      { key: "incorporation_date", label: "Incorporation Date", type: "date" },
      { key: "ownership_type", label: "Ownership Type (Local/Foreign/Joint Venture)" },
    ]},
    { key: "application_details", title: "Application Details", fields: [
      { key: "application_type", label: "Application Type (New/Expansion/Diversification)" },
      { key: "incentive_package_type", label: "Incentive Package Type" },
      { key: "application_date", label: "Application Date", type: "date" },
      { key: "project_title", label: "Project Title" },
      { key: "submission_status", label: "Submission Status" },
      { key: "reference_number", label: "Reference Number" },
      { key: "related_previous", label: "Related Previous/Approved Applications" },
    ]},
    { key: "sector_classification", title: "Sector Classification", fields: [
      { key: "economic_sector", label: "Economic Sector (MSIC Code)" },
      { key: "sub_sector", label: "Sub-sector" },
      { key: "product_desc", label: "Product/Service Description", type: "longtext" },
      { key: "location", label: "Location (State, District, Zone)" },
    ]},
    { key: "project_cost_finance", title: "Project Cost & Finance", fields: [
      { key: "total_project_cost", label: "Total Project Cost", type: "number" },
      { key: "investment_breakdown", label: "Existing vs New Investment Breakdown", type: "longtext" },
      { key: "annual_opex", label: "Annual OPEX", type: "number" },
      { key: "project_phase", label: "Project Phase (3 Phases × 5 Years)" },
      { key: "grand_total_financing", label: "Grand Total Financing", type: "number" },
      { key: "paid_up_capital", label: "Paid-up Capital", type: "number" },
      { key: "authorised_capital", label: "Authorised Capital", type: "number" },
      { key: "shareholders_fund", label: "Shareholders’ Fund", type: "number" },
    ]},
    { key: "manpower_details", title: "Manpower Details", fields: [
      { key: "num_employees", label: "No. of Employees (MASCO)" },
      { key: "job_level", label: "Job Level" },
      { key: "education_level", label: "Education Level" },
      { key: "field_st", label: "Field (S&T)" },
      { key: "salary_range", label: "Salary Range" },
      { key: "nationality", label: "Nationality" },
      { key: "gender", label: "Gender" },
    ]},
    { key: "specific_industry_info", title: "Specific Industry Info", fields: [
      { key: "rnd_details", label: "R&D Details", type: "longtext" },
      { key: "production_capacity", label: "Production Capacity" },
      { key: "machine_list", label: "Machine List", type: "longtext" },
      { key: "energy_consumption", label: "Energy Consumption" },
      { key: "pue_ratio", label: "PUE Ratio (DESAC)" },
      { key: "mkn_approval", label: "MKN Approval" },
    ]},
    { key: "nia_scorecard", title: "NIA Scorecard Info", fields: [
      { key: "pre_qualifier", label: "Pre-Qualifier" },
      { key: "pillars", label: "Pillars: Economic Complexity, High Skilled Jobs, ESG, Domestic Linkage, Industrial Cluster", type: "longtext" },
      { key: "indicators_scoring", label: "NIA Indicators Scoring", type: "longtext" },
      { key: "summary_score", label: "Summary Score & Evaluation Comments", type: "longtext" },
    ]},
    { key: "supporting_documents", title: "Supporting Documents", fields: [
      { key: "docs", label: "Upload Docs (SSM, License, Tax Letter, etc.)", type: "file" },
      { key: "package_custom", label: "Customizable (Admin-configurable)", type: "longtext" },
    ]},
    { key: "declarations", title: "Declarations", fields: [
      { key: "authorized_person", label: "Declaration by Authorized Personnel" },
      { key: "declared_at", label: "Date & Time Stamp", type: "date" },
    ]},
    { key: "evaluation_section", title: "Evaluation Section", fields: [
      { key: "wer", label: "Working Evaluation Report (WER)", type: "longtext" },
      { key: "recommendation", label: "Recommendation Comments", type: "longtext" },
      { key: "wdl", label: "Decision Letter (WDL)", type: "longtext" },
    ]},
    { key: "post_incentives_actions", title: "Post Incentives Actions", fields: [
      { key: "compliance", label: "Compliance Condition Fulfilment", type: "longtext" },
      { key: "kpi_update", label: "KPI Update", type: "longtext" },
      { key: "extension_requests", label: "Extension/Amendment Requests", type: "longtext" },
      { key: "annual_reporting", label: "Annual Reporting", type: "longtext" },
      { key: "withdrawal", label: "Withdrawal", type: "longtext" },
    ]},
    { key: "notifications_triggers", title: "Notifications & Triggers", fields: [
      { key: "status_alerts", label: "Status Alerts" },
      { key: "submission_reminders", label: "Submission Reminders" },
      { key: "incomplete_warnings", label: "Incomplete Form Warnings" },
    ]},
    { key: "admin_configuration", title: "Admin Configuration", fields: [
      { key: "form_rules", label: "Form Field Rules", type: "longtext" },
      { key: "msic_master", label: "MSIC Code Masterlist", type: "longtext" },
      { key: "nia_weight", label: "NIA Pillar Weightage", type: "longtext" },
      { key: "incentive_mapping", label: "Incentive Package & Type Mapping", type: "longtext" },
      { key: "score_formulas", label: "Score Formulas", type: "longtext" },
      { key: "doc_requirements", label: "Custom Document Requirements", type: "longtext" },
    ]},
  ],
};

const REALISED = {
  key: "realised_investment",
  title: "Realised Investment",
  color: "#0ea5e9", // sky
  categories: [
    { key: "company_profile", title: "Company Profile", fields: [
      { key: "company_name", label: "Company Name" },
      { key: "roc_no", label: "ROC Number" },
      { key: "contact_info", label: "Contact Info", type: "longtext" },
      { key: "sector", label: "Sector/Sub-sector" },
      { key: "ownership_type", label: "Ownership Type" },
      { key: "proj_location", label: "Project Location (State/District)" },
      { key: "authorised_capital", label: "Authorised Capital", type: "number" },
      { key: "paid_up_capital", label: "Paid-up Capital", type: "number" },
    ]},
    { key: "project_info", title: "Project Info", fields: [
      { key: "project_title", label: "Project Title" },
      { key: "incentive_type", label: "Incentive Type" },
      { key: "approval_date", label: "Approval Date", type: "date" },
      { key: "reference_number", label: "Reference Number" },
      { key: "investment_category", label: "Investment Category" },
      { key: "project_phase", label: "Project Phase" },
    ]},
    { key: "investment_details", title: "Investment Details", fields: [
      { key: "approved_value", label: "Approved Investment Value", type: "number" },
      { key: "realised_capex_opex", label: "Realised CAPEX/OPEX (by year)", type: "longtext" },
      { key: "equipment_ratio", label: "Equipment Ratio" },
      { key: "tax_utilisation", label: "Tax Incentive Utilisation" },
      { key: "machinery_acq", label: "Machinery Acquisition" },
    ]},
    { key: "employment", title: "Employment", fields: [
      { key: "num_jobs", label: "Number of Jobs Created" },
      { key: "job_categories", label: "Job Categories (MASCO)" },
      { key: "local_vs_foreign", label: "Local vs Foreign Workers" },
      { key: "avg_salary", label: "Average Salary" },
      { key: "nationality", label: "Nationality" },
      { key: "qualification", label: "Academic Qualification" },
    ]},
    { key: "compliance", title: "Compliance", fields: [
      { key: "condition_compliance", label: "Condition of Approval Compliance" },
      { key: "submission_date", label: "Submission Date", type: "date" },
      { key: "kpi_fulfilment", label: "KPI Fulfilment" },
      { key: "annual_reports", label: "Annual Reports (APR)" },
      { key: "operational_evidence", label: "Operational Evidence" },
    ]},
    { key: "impact_analysis", title: "Impact Analysis", fields: [
      { key: "gdp_contrib", label: "GDP Contribution" },
      { key: "vendor_dev", label: "Vendor Development" },
      { key: "esg_details", label: "ESG Details" },
      { key: "training_intern", label: "Training/Internship" },
      { key: "tech_transfer", label: "Technology Transfer" },
      { key: "procurement_ratio", label: "Procurement Ratio" },
    ]},
    { key: "attachments", title: "Attachments", fields: [
      { key: "annual_reports", label: "Annual Reports", type: "file" },
      { key: "financial_docs", label: "Financial Docs", type: "file" },
      { key: "supporting_letters", label: "Supporting Letters", type: "file" },
      { key: "operational_photos", label: "Operational Photos", type: "file" },
    ]},
  ],
};

const ONTRACK = {
  key: "ontrack",
  title: "On-Track Enhancement",
  color: "#f59e0b", // amber
  categories: [
    { key: "general_info", title: "General Info", fields: [
      { key: "company_roc", label: "Company Name & ROC" },
      { key: "project_title", label: "Project Title" },
      { key: "approval_type_ref", label: "Approval Type/Ref" },
      { key: "project_type", label: "Project Type" },
      { key: "project_location", label: "Project Location" },
      { key: "approval_date", label: "Approval Date", type: "date" },
      { key: "implementation_duration", label: "Implementation Duration" },
    ]},
    { key: "milestones", title: "Milestone Monitoring", fields: [
      { key: "milestone_desc", label: "Milestone Descriptions", type: "longtext" },
      { key: "planned_vs_actual", label: "Planned vs Actual Dates", type: "longtext" },
      { key: "construction_start_end", label: "Construction Start/End" },
      { key: "production_start", label: "Production Start Date", type: "date" },
      { key: "reason_delay", label: "Reason for Delay", type: "longtext" },
      { key: "issues_challenges", label: "Issues/Challenges", type: "longtext" },
    ]},
    { key: "stakeholder_input", title: "Stakeholder Input", fields: [
      { key: "assigned_officers", label: "Assigned PACU Officer / IPA / UPEN / BPEN" },
      { key: "facilitation_type", label: "Facilitation Type" },
      { key: "site_visit_records", label: "Site Visit Records", type: "longtext" },
      { key: "handholding", label: "Handholding Activities", type: "longtext" },
      { key: "notes_comments", label: "Notes/Comments", type: "longtext" },
    ]},
    { key: "kpi_tracking", title: "KPI Tracking", fields: [
      { key: "capex_disbursed", label: "Investment Disbursed (CAPEX)", type: "number" },
      { key: "jobs_created", label: "Jobs Created" },
      { key: "training_conducted", label: "Training Conducted" },
      { key: "facility_setup", label: "Facility/Plant Setup" },
      { key: "utility_usage", label: "Utility Usage" },
      { key: "local_supplier", label: "Local Supplier Engagement" },
    ]},
    { key: "system_logs_status", title: "System Logs/Status", fields: [
      { key: "last_updated_by", label: "Last Updated By/Date" },
      { key: "project_status", label: "Project Status" },
      { key: "alert_flags", label: "Alert Flags" },
      { key: "reminder_triggers", label: "Reminder Triggers" },
    ]},
    { key: "compliance_linkage", title: "Compliance Linkage", fields: [
      { key: "update_prereq", label: "Update Pre-requisite for New Application" },
      { key: "doc_upload", label: "Documentation Upload", type: "file" },
      { key: "integration", label: "Integration with InvestMalaysia & Realised Investment Modules", type: "longtext" },
    ]},
  ],
};

const MODULES = [NEW_INCENTIVES, REALISED, ONTRACK];

// ---- UI Helpers ----
const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: "280px 1fr",
    gap: 18,
    padding: 18,
    background: "linear-gradient(180deg, #f8fafc, #eef2ff)",
  },
  sidebar: {
    position: "sticky",
    top: 12,
    alignSelf: "start",
    height: "calc(100vh - 24px)",
    overflow: "auto",
    padding: 16,
    borderRadius: 20,
    border: "1px solid #e5e7eb",
    backdropFilter: "blur(6px)",
    background: "rgba(255,255,255,0.75)",
    boxShadow: "0 8px 30px rgba(0,0,0,.06)",
  },
  brand: { fontSize: 18, fontWeight: 700, marginBottom: 10 },
  moduleBtn: (active, color) => ({
    display: "flex",
    alignItems: "center",
    gap: 10,
    width: "100%",
    padding: "10px 12px",
    borderRadius: 14,
    border: "1px solid #e5e7eb",
    background: active ? color : "#fff",
    color: active ? "#fff" : "#0f172a",
    cursor: "pointer",
    fontSize: 14,
    transition: "all .18s ease",
  }),
  pill: (color) => ({ width: 8, height: 8, borderRadius: 999, background: color }),
  contentWrap: {
    display: "grid",
    gap: 16,
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  h1: { fontSize: 26, margin: 0 },
  sub: { fontSize: 13, color: "#64748b", marginTop: 2 },
  toolbar: { display: "flex", gap: 8 },
  btnGhost: { padding: "8px 10px", border: "1px solid #e5e7eb", background: "#fff", borderRadius: 12 },
  btnSolid: { padding: "8px 10px", border: "1px solid transparent", background: "#111827", color: "#fff", borderRadius: 12 },
  card: {
    border: "1px solid #e5e7eb",
    background: "rgba(255,255,255,0.9)",
    borderRadius: 18,
    padding: 16,
    boxShadow: "0 10px 30px rgba(2,6,23,.06)",
  },
  grid2: { display: "grid", gap: 14, gridTemplateColumns: "1fr 1fr" },
  label: { fontSize: 12, color: "#334155" },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    fontSize: 14,
    outline: "none",
  },
  textarea: { minHeight: 96 },
  actions: { display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 14 },
  badgeRow: { display: "flex", gap: 6, marginLeft: "auto", fontSize: 11, color: "#64748b" },
  sectionTitle: { fontWeight: 600, fontSize: 16, margin: 0 },
  catLink: { color: "#2563eb", textDecoration: "none", fontSize: 13 },
};

function InputForField({ field, value, onChange }) {
  const base = styles.input;
  if (field.type === "longtext") {
    return (
      <textarea
        style={{ ...base, ...styles.textarea }}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.label}
      />
    );
  }
  if (field.type === "date") {
    return <input type="date" style={base} value={value || ""} onChange={(e) => onChange(e.target.value)} />;
  }
  if (field.type === "number") {
    return <input type="number" style={base} value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder="0" />;
  }
  if (field.type === "file") {
    return <input type="file" onChange={(e) => onChange(e.target.files?.[0]?.name || "")} />;
  }
  return <input style={base} value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={field.label} />;
}

function CategoryCard({ moduleKey, category, color, state, setState }) {
  return (
    <div style={styles.card} id={`${moduleKey}.${category.key}`}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
        <h3 style={styles.sectionTitle}>{category.title}</h3>
        <div style={styles.badgeRow}><span>draft</span>•<span>autosave</span></div>
      </div>
      <div style={styles.grid2}>
        {category.fields.map((f) => (
          <div key={f.key} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={styles.label}>{f.label}</label>
            <InputForField
              field={f}
              value={state[`${moduleKey}.${category.key}.${f.key}`]}
              onChange={(v) => setState((prev) => ({ ...prev, [`${moduleKey}.${category.key}.${f.key}`]: v }))}
            />
          </div>
        ))}
      </div>
      <div style={styles.actions}>
        <button style={styles.btnGhost}>Save Draft</button>
        <button style={{ ...styles.btnGhost, color: "#fff", background: color, borderColor: color }}>Submit Section</button>
      </div>
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState(MODULES[0].key);
  const current = useMemo(() => MODULES.find((m) => m.key === active), [active]);
  const [state, setState] = useState({});

  return (
    <div style={styles.page}>
      {/* LEFT: Vertical Module Pane */}
      <aside style={styles.sidebar}>
        <div style={styles.brand}>Investment Portal</div>
        <p style={{ fontSize: 12, color: "#64748b", marginTop: 0, marginBottom: 10 }}>Select a module</p>
        <div style={{ display: "grid", gap: 8 }}>
          {MODULES.map((m) => (
            <button key={m.key} onClick={() => setActive(m.key)} style={styles.moduleBtn(active === m.key, m.color)}>
              <span style={styles.pill(m.color)} />
              <span>{m.title}</span>
            </button>
          ))}
        </div>

        {/* quick navigation for categories */}
        <div style={{ marginTop: 18 }}>
          <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>Sections</div>
          <div style={{ display: "grid", gap: 6 }}>
            {current.categories.map((c) => (
              <a key={c.key} href={`#${current.key}.${c.key}`} style={styles.catLink}>• {c.title}</a>
            ))}
          </div>
        </div>
      </aside>

      {/* RIGHT: Work Area */}
      <main style={styles.contentWrap}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.h1}>{current.title} — Prototype</h1>
            <div style={styles.sub}>Modern UI • vertical module nav • autosave feel • no backend yet</div>
          </div>
          <div style={styles.toolbar}>
            <button style={styles.btnGhost}>Triggers</button>
            <button style={styles.btnSolid}>Publish Demo</button>
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
          />
        ))}

        <div style={styles.card}>
          <h4 style={{ marginTop: 0 }}>Recent Activity</h4>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13 }}>
            <li>Autosaved draft a moment ago</li>
            <li>Reminder set for missing fields in {current.categories[0]?.title}</li>
            <li>Validation rules loaded from Admin Configuration</li>
          </ul>
        </div>

        <footer style={{ textAlign: "center", fontSize: 12, color: "#6b7280" }}>
          © Prototype • Replace local state with API calls to persist.
        </footer>
      </main>
    </div>
  );
}
