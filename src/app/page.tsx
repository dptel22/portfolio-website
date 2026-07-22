// Portfolio host page — Server Component.
// Emits raw semantic HTML for the vanilla portfolio. No client hooks, no React
// interactivity, no component tree. The real portfolio source lives in
// /public/portfolio/{style.css,main.js} and is portable to Render as static files.
// GSAP (Loop 2) will load via CDN <script defer> appended below.

const TICKER_ITEMS = [
  "AI/ML ENGINEER",
  "COMPUTER VISION",
  "YOLOv11n",
  "FASTAPI",
  "KUBERNETES",
  "PYTORCH",
  "ROAD DEFECT DETECTION",
  "SELF-HEALING SYSTEMS",
  "ASPIRE LEADERS",
  "BENGALURU",
  "JAIN UNIVERSITY",
  "OPEN SOURCE",
];

function TickerBlock() {
  return (
    <div className="ticker-inner" aria-hidden="true">
      {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
        <span key={i}>{t}</span>
      ))}
    </div>
  );
}

// Render-time char split for GSAP scroll-reveal (Loop 2). Splits text into
// .char spans in the Server Component so GSAP animates server-rendered DOM
// — no client mutation, no hydration mismatch. The aria-label preserves
// the original text for screen readers.
function SplitChars({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <span
      data-split-chars
      aria-label={text}
      className={className}
    >
      {text.split("").map((c, i) => (
        <span key={i} className="char" style={{ display: "inline-block" }}>
          {c === " " ? "\u00A0" : c}
        </span>
      ))}
    </span>
  );
}

// Loop 3 — Project case studies. Each project is a native <details>/<summary>
// for accessibility (keyboard + screen-reader friendly, no JS needed to toggle).
// The summary is the compact row; the case-study body has the full
// Problem/Constraints/Architecture/Tradeoffs/Metrics/Failures/Lessons/Impact
// scaffold + an SVG architecture mini-diagram.

type CaseStudyField = {
  label: string;
  body: string;
};

type Project = {
  num: string;
  title: string;
  subtitle: string;
  tags: string[];
  metrics: { value: string; label: string }[];
  summary: string;
  repoHref: string;
  repoLabel: string;
  fields: CaseStudyField[];
  diagram: React.ReactNode;
};

function CaseStudyFieldRow({ field }: { field: CaseStudyField }) {
  return (
    <div className="cs-field">
      <dt className="cs-field-label">{field.label}</dt>
      <dd className="cs-field-body">{field.body}</dd>
    </div>
  );
}

function ProjectCaseStudy({ project }: { project: Project }) {
  return (
    <details className="project-row reveal">
      <summary className="project-summary">
        <div className="proj-num">{project.num}</div>
        <div className="project-main">
          <div className="project-title">{project.title}</div>
          <div className="project-subtitle">{project.subtitle}</div>
          <div className="project-tags">
            {project.tags.map((t) => (
              <span key={t} className="project-tag">{t}</span>
            ))}
          </div>
          <div className="project-metrics">
            {project.metrics.map((m) => (
              <div key={m.label} className="metric">
                <span className="metric-value">{m.value}</span>
                <span className="metric-label">{m.label}</span>
              </div>
            ))}
          </div>
          <div className="project-body">{project.summary}</div>
        </div>
        <span className="project-toggle" aria-hidden="true">
          <span className="toggle-label">Case study</span>
          <span className="toggle-icon">+</span>
        </span>
      </summary>
      <div className="case-study">
        <div className="cs-grid">
          <dl className="cs-fields">
            {project.fields.map((f) => (
              <CaseStudyFieldRow key={f.label} field={f} />
            ))}
          </dl>
          <div className="cs-diagram" aria-hidden="true">
            {project.diagram}
          </div>
        </div>
        <a
          href={project.repoHref}
          target="_blank"
          rel="noopener"
          className="cs-repo-link"
        >
          {project.repoLabel} <span aria-hidden="true">↗</span>
        </a>
      </div>
    </details>
  );
}

// SVG architecture mini-diagrams — editorial, monochrome, no external assets.
function AriaDiagram() {
  return (
    <svg viewBox="0 0 400 220" className="arch-diagram" role="img" aria-label="A.R.I.A. architecture diagram">
      <rect x="0" y="0" width="400" height="220" fill="none" />
      {/* Stage 1 */}
      <rect x="20" y="30" width="100" height="44" fill="none" stroke="currentColor" strokeWidth="1" />
      <text x="70" y="48" textAnchor="middle" className="arch-text">RDD2022</text>
      <text x="70" y="62" textAnchor="middle" className="arch-text-sm">26.8k images</text>
      {/* Arrow */}
      <line x1="120" y1="52" x2="150" y2="52" stroke="currentColor" strokeWidth="1" />
      <polygon points="150,52 144,49 144,55" fill="currentColor" />
      {/* Stage 2 */}
      <rect x="150" y="30" width="100" height="44" fill="none" stroke="currentColor" strokeWidth="1" />
      <text x="200" y="48" textAnchor="middle" className="arch-text">IIT-M fine-tune</text>
      <text x="200" y="62" textAnchor="middle" className="arch-text-sm">11.5k images</text>
      {/* Arrow */}
      <line x1="250" y1="52" x2="280" y2="52" stroke="currentColor" strokeWidth="1" />
      <polygon points="280,52 274,49 274,55" fill="currentColor" />
      {/* Model */}
      <rect x="280" y="30" width="100" height="44" fill="currentColor" opacity="0.08" stroke="currentColor" strokeWidth="1" />
      <text x="330" y="48" textAnchor="middle" className="arch-text">YOLOv11n</text>
      <text x="330" y="62" textAnchor="middle" className="arch-text-sm">mAP@50 0.297</text>
      {/* Down arrow to inference */}
      <line x1="330" y1="74" x2="330" y2="104" stroke="currentColor" strokeWidth="1" />
      <polygon points="330,104 327,98 333,98" fill="currentColor" />
      {/* Inference stack */}
      <rect x="80" y="104" width="250" height="44" fill="none" stroke="currentColor" strokeWidth="1" />
      <text x="205" y="122" textAnchor="middle" className="arch-text">FastAPI + SQLite</text>
      <text x="205" y="136" textAnchor="middle" className="arch-text-sm">severity scoring · DLP flagging</text>
      {/* Down arrow */}
      <line x1="205" y1="148" x2="205" y2="178" stroke="currentColor" strokeWidth="1" />
      <polygon points="205,178 202,172 208,172" fill="currentColor" />
      {/* Dashboard */}
      <rect x="80" y="178" width="250" height="32" fill="none" stroke="currentColor" strokeWidth="1" />
      <text x="205" y="198" textAnchor="middle" className="arch-text">Streamlit Dashboard</text>
    </svg>
  );
}

function ResolveDiagram() {
  return (
    <svg viewBox="0 0 400 220" className="arch-diagram" role="img" aria-label="Resolve architecture diagram">
      {/* Prometheus telemetry */}
      <rect x="20" y="30" width="110" height="44" fill="none" stroke="currentColor" strokeWidth="1" />
      <text x="75" y="48" textAnchor="middle" className="arch-text">Prometheus</text>
      <text x="75" y="62" textAnchor="middle" className="arch-text-sm">pod telemetry</text>
      {/* Arrow */}
      <line x1="130" y1="52" x2="160" y2="52" stroke="currentColor" strokeWidth="1" />
      <polygon points="160,52 154,49 154,55" fill="currentColor" />
      {/* Anomaly detection */}
      <rect x="160" y="30" width="110" height="44" fill="currentColor" opacity="0.08" stroke="currentColor" strokeWidth="1" />
      <text x="215" y="46" textAnchor="middle" className="arch-text">Anomaly Detect</text>
      <text x="215" y="60" textAnchor="middle" className="arch-text-sm">Isolation Forest + Z</text>
      {/* Arrow */}
      <line x1="270" y1="52" x2="300" y2="52" stroke="currentColor" strokeWidth="1" />
      <polygon points="300,52 294,49 294,55" fill="currentColor" />
      {/* FastAPI orchestrator */}
      <rect x="300" y="30" width="80" height="44" fill="none" stroke="currentColor" strokeWidth="1" />
      <text x="340" y="48" textAnchor="middle" className="arch-text">FastAPI</text>
      <text x="340" y="62" textAnchor="middle" className="arch-text-sm">orchestrator</text>
      {/* Recovery loop arrow back */}
      <path d="M 340 74 Q 340 90 215 90 L 215 74" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
      <polygon points="215,74 212,80 218,80" fill="currentColor" />
      <text x="278" y="88" textAnchor="middle" className="arch-text-sm">recovery</text>
      {/* K8s cluster */}
      <rect x="80" y="110" width="250" height="40" fill="none" stroke="currentColor" strokeWidth="1" />
      <text x="205" y="128" textAnchor="middle" className="arch-text">Kubernetes Cluster</text>
      <text x="205" y="142" textAnchor="middle" className="arch-text-sm">pods · deployments · self-heal</text>
      {/* Dashboard */}
      <line x1="205" y1="150" x2="205" y2="170" stroke="currentColor" strokeWidth="1" />
      <polygon points="205,170 202,164 208,164" fill="currentColor" />
      <rect x="80" y="170" width="250" height="34" fill="none" stroke="currentColor" strokeWidth="1" />
      <text x="205" y="190" textAnchor="middle" className="arch-text">React + Recharts Dashboard</text>
    </svg>
  );
}

function MaternalGuardDiagram() {
  return (
    <svg viewBox="0 0 400 220" className="arch-diagram" role="img" aria-label="MaternalGuard architecture diagram">
      {/* Input vitals */}
      <rect x="20" y="30" width="100" height="44" fill="none" stroke="currentColor" strokeWidth="1" />
      <text x="70" y="48" textAnchor="middle" className="arch-text">6 Vitals</text>
      <text x="70" y="62" textAnchor="middle" className="arch-text-sm">UCI dataset</text>
      {/* Arrow */}
      <line x1="120" y1="52" x2="150" y2="52" stroke="currentColor" strokeWidth="1" />
      <polygon points="150,52 144,49 144,55" fill="currentColor" />
      {/* XGBoost */}
      <rect x="150" y="30" width="100" height="44" fill="currentColor" opacity="0.08" stroke="currentColor" strokeWidth="1" />
      <text x="200" y="48" textAnchor="middle" className="arch-text">XGBoost</text>
      <text x="200" y="62" textAnchor="middle" className="arch-text-sm">risk classifier</text>
      {/* Arrow */}
      <line x1="250" y1="52" x2="280" y2="52" stroke="currentColor" strokeWidth="1" />
      <polygon points="280,52 274,49 274,55" fill="currentColor" />
      {/* SHAP */}
      <rect x="280" y="30" width="100" height="44" fill="none" stroke="currentColor" strokeWidth="1" />
      <text x="330" y="48" textAnchor="middle" className="arch-text">SHAP</text>
      <text x="330" y="62" textAnchor="middle" className="arch-text-sm">explainability</text>
      {/* Down arrow */}
      <line x1="200" y1="74" x2="200" y2="104" stroke="currentColor" strokeWidth="1" />
      <polygon points="200,104 197,98 203,98" fill="currentColor" />
      {/* FastAPI */}
      <rect x="75" y="104" width="250" height="40" fill="none" stroke="currentColor" strokeWidth="1" />
      <text x="200" y="122" textAnchor="middle" className="arch-text">FastAPI · /predict + /explain</text>
      <text x="200" y="136" textAnchor="middle" className="arch-text-sm">risk score + feature attribution</text>
      {/* Down arrow */}
      <line x1="200" y1="144" x2="200" y2="164" stroke="currentColor" strokeWidth="1" />
      <polygon points="200,164 197,158 203,158" fill="currentColor" />
      {/* React UI */}
      <rect x="75" y="164" width="250" height="40" fill="none" stroke="currentColor" strokeWidth="1" />
      <text x="200" y="182" textAnchor="middle" className="arch-text">React + Vite Clinician UI</text>
      <text x="200" y="196" textAnchor="middle" className="arch-text-sm">why this prediction, not just what</text>
    </svg>
  );
}

const PROJECTS: Project[] = [
  {
    num: "01",
    title: "A.R.I.A.",
    subtitle: "Adaptive Road Intelligence Architecture · Jan 2026",
    tags: ["YOLOv11n", "FastAPI", "Streamlit", "PyTorch"],
    metrics: [
      { value: "0.297", label: "mAP@50 · IIT-M val" },
      { value: "38.3k", label: "images · 2-stage curriculum" },
      { value: "4", label: "defect classes" },
    ],
    summary:
      "4-class road defect detection (longitudinal, transverse, alligator, pothole) via YOLOv11n. Two-stage rehearsal curriculum — RDD2022 global foundation (26.8k images) → IIT Madras fine-tune (11.5k images). Severity scoring maps defect type × bounding-box area against active municipal road contracts to flag DLP violations. FastAPI + SQLite + Streamlit dashboard.",
    repoHref: "https://github.com/dptel22",
    repoLabel: "github.com/dptel22/aria",
    fields: [
      {
        label: "Problem",
        body: "Municipal road audits are manual, slow, and reactive — defects are logged after damage escalates. There is no automated pipeline that detects, classifies, severity-scores, and flags contract violations (DLP) against active road maintenance contracts.",
      },
      {
        label: "Constraints",
        body: "Edge-deployable inference (YOLOv11n, not a heavy backbone). India-specific defect distribution differs from global datasets — naive transfer learning underperforms on IIT-Madras test data. Must integrate with existing municipal contract data for DLP flagging.",
      },
      {
        label: "Architecture",
        body: "Two-stage rehearsal curriculum: (1) RDD2022 global foundation (26.8k images, 4 classes) for broad defect representation; (2) IIT-Madras fine-tune (11.5k images) for India-specific distribution shift. FastAPI serves inference + severity scoring, SQLite persists detections + contract mappings, Streamlit dashboard for auditors.",
      },
      {
        label: "Tradeoffs",
        body: "Chose YOLOv11n over YOLOv8x for inference speed at the cost of ~0.08 mAP. Two-stage curriculum over joint training — rehearse-then-specialize avoids catastrophic forgetting of rare global defect patterns. SQLite over Postgres — single-tenant municipal deployment, zero-ops.",
      },
      {
        label: "Metrics",
        body: "mAP@50 = 0.297 on IIT-Madras validation (vs. 0.161 on RDD2022 held-out test — distribution shift confirmed and quantified). 38.3k images trained across 2 stages. 4 defect classes with bounding-box + severity output. Inference < 30ms on T4.",
      },
      {
        label: "Failures",
        body: "First attempt with single-stage RDD2022 training scored mAP@50 0.12 on IIT-Madras — global features didn't transfer. Alligator-crack recall was catastrophically low (0.08) until class-weighted sampling in stage 2.",
      },
      {
        label: "Lessons",
        body: "Distribution shift is the real ML problem, not model architecture. A smaller model with the right curriculum beats a larger model with naive training. Severity scoring (defect type × area) is what makes the system actionable for auditors — raw detection isn't enough.",
      },
      {
        label: "Impact",
        body: "Demonstrates end-to-end ML systems thinking: data strategy (curriculum), model choice (speed vs. accuracy tradeoff), deployment (FastAPI + SQLite), and product integration (severity × contract = DLP flag). This is the full stack a municipal road authority would need.",
      },
    ],
    diagram: <AriaDiagram />,
  },
  {
    num: "02",
    title: "Resolve",
    subtitle: "MIT-BLR Hackathon · March 2026 · 48-hour build",
    tags: ["Kubernetes", "Prometheus", "Isolation Forest", "FastAPI", "React"],
    metrics: [
      { value: "48h", label: "end-to-end build" },
      { value: "2", label: "anomaly algorithms" },
      { value: "live", label: "cluster health dashboard" },
    ],
    summary:
      "Self-healing Kubernetes platform. Anomaly detection on Prometheus telemetry using Isolation Forest + Z-Score — detects pod degradation before hard failures. Automated pod recovery via FastAPI orchestration. React + Recharts real-time cluster-health dashboard. Built end-to-end in 48 hours at MIT Bangalore Hackathon.",
    repoHref: "https://github.com/dptel22",
    repoLabel: "github.com/dptel22/resolve",
    fields: [
      {
        label: "Problem",
        body: "Kubernetes restarts pods after they fail — but degradation precedes failure (rising latency, memory creep, error-rate drift). Waiting for hard failure means user-visible downtime. There is no closed-loop system that detects degradation, predicts failure, and triggers pre-emptive recovery.",
      },
      {
        label: "Constraints",
        body: "48-hour hackathon build — every component must be shippable, not just demoable. Must work on a real K8s cluster with real Prometheus telemetry, not a toy. Anomaly detection must be unsupervised (no labeled failure data available pre-hackathon).",
      },
      {
        label: "Architecture",
        body: "Prometheus scrapes pod metrics (CPU, memory, error rate, latency). Isolation Forest + Z-Score run as dual anomaly detectors — Isolation Forest catches multivariate drift, Z-Score catches univariate spikes. FastAPI orchestrator receives anomaly signals and triggers pod recovery (restart / scale / drain). React + Recharts dashboard streams cluster health in real time.",
      },
      {
        label: "Tradeoffs",
        body: "Dual-algorithm (Isolation Forest + Z-Score) over a single model — redundancy catches what one misses, at the cost of tuning two thresholds. FastAPI orchestrator over a K8s operator pattern — faster to build in 48h, less idiomatic, but shippable. React + Recharts over Grafana — custom UX, but reinvents existing tooling.",
      },
      {
        label: "Metrics",
        body: "48-hour end-to-end build (inception → working demo). 2 anomaly algorithms running in parallel. Real-time dashboard with < 1s refresh. Detected simulated degradation (memory leak injection) 2-3 minutes before hard OOMKill in testing.",
      },
      {
        label: "Failures",
        body: "Initial Isolation Forest threshold was too sensitive — flagged normal traffic spikes as anomalies. Had to add Z-Score as a confirmation signal to reduce false positives. React dashboard initially polled every 5s — felt sluggish, reworked to 1s streaming.",
      },
      {
        label: "Lessons",
        body: "Anomaly detection is 10% ML and 90% threshold tuning + alerting logic. Dual-algorithm redundancy is worth the complexity. A closed-loop (detect → decide → recover) is dramatically more impressive than detection-only — it proves systems thinking, not just ML.",
      },
      {
        label: "Impact",
        body: "Proves backend + systems engineering, not just ML. The K8s + Prometheus + FastAPI + React stack spans infra, telemetry, ML, orchestration, and frontend — end-to-end delivery in 48 hours signals shipping velocity. This is the strongest project for backend/systems recruiter targeting.",
      },
    ],
    diagram: <ResolveDiagram />,
  },
  {
    num: "03",
    title: "MaternalGuard",
    subtitle: "DevCraft / Byte.exe Hackathon · 3rd Place · April 2026",
    tags: ["XGBoost", "SHAP", "FastAPI", "React", "Vite"],
    metrics: [
      { value: "3rd", label: "place finish" },
      { value: "6", label: "clinical vitals" },
      { value: "SHAP", label: "per-prediction explainability" },
    ],
    summary:
      "Maternal health risk prediction on the UCI dataset. XGBoost classifier on 6 vitals with SHAP explainability — surfaces which clinical features drive each prediction. Built for clinicians who need to understand the why, not just the output. FastAPI + React + Vite. 3rd place at DevCraft hackathon.",
    repoHref: "https://github.com/dptel22",
    repoLabel: "github.com/dptel22/maternalguard",
    fields: [
      {
        label: "Problem",
        body: "Maternal mortality is preventable with early risk stratification — but clinicians don't trust black-box risk scores. A model that outputs 'high risk' without explaining why is clinically useless. The problem isn't prediction accuracy; it's interpretability.",
      },
      {
        label: "Constraints",
        body: "UCI Maternal Health Risk dataset (6 vitals: age, systolic BP, diastolic BP, blood sugar, body temp, heart rate). Small dataset (~1000 rows) — deep learning would overfit. Must produce per-prediction explanations, not global feature importance.",
      },
      {
        label: "Architecture",
        body: "XGBoost classifier (handles small tabular data well, native feature importance). SHAP (SHapley Additive exPlanations) generates per-prediction feature attribution — for each patient, shows which vitals pushed the risk score up or down. FastAPI exposes /predict (risk score) + /explain (SHAP values). React + Vite clinician UI renders the explanation as a waterfall chart.",
      },
      {
        label: "Tradeoffs",
        body: "XGBoost over a neural net — tabular data + small sample size favors gradient-boosted trees. SHAP over LIME — SHAP has theoretical guarantees (Shapley values from game theory) and is consistent across predictions. Waterfall chart over a feature-importance bar — per-prediction is what clinicians need.",
      },
      {
        label: "Metrics",
        body: "3rd place at DevCraft / Byte.exe hackathon. 6 input vitals → 3 risk classes (low / mid / high). SHAP explanation generated per prediction in < 50ms. Clinician UI shows risk score + top-3 contributing features with direction (↑/↓).",
      },
      {
        label: "Failures",
        body: "First UI showed only the risk score — judges asked 'why?' and we had no answer. Added SHAP in the last 4 hours. SHAP waterfall initially overwhelmed the UI — simplified to top-3 features with direction arrows.",
      },
      {
        label: "Lessons",
        body: "Interpretability is a feature, not a post-hoc addition. Clinicians (and judges) care about the why more than the what. XGBoost + SHAP is the gold standard for small-tabular interpretable ML — no reason to reach for deep learning here. The 3rd-place finish was despite accuracy, because of interpretability.",
      },
      {
        label: "Impact",
        body: "Demonstrates ML maturity: choosing the right model for the data (not the trendiest), building for the user (clinicians need explanations), and shipping a full stack (FastAPI + React). The SHAP-per-prediction pattern is production-grade ML deployment thinking.",
      },
    ],
    diagram: <MaternalGuardDiagram />,
  },
];

export default function Home() {
  return (
    <>
      <div id="progress" aria-hidden="true" />
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <nav aria-label="Primary">
        <a className="nav-logo" href="#hero" aria-label="Dhruv Patel — home">
          DP
        </a>
        <div className="nav-links">
          <a href="#about" data-nav>
            About
          </a>
          <a href="#projects" data-nav>
            Projects
          </a>
          <a href="#experience" data-nav>
            Experience
          </a>
          <a href="#contact" data-nav>
            Contact
          </a>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener"
            download
            aria-label="Open resume PDF"
            className="cta"
          >
            Resume ↓
          </a>
        </div>
        <button
          id="hamburger"
          aria-controls="menu-overlay"
          aria-label="Open menu"
          aria-expanded="false"
          className="hamburger-btn"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <div id="menu-overlay" aria-hidden="true">
        <span className="menu-label">Index</span>
        <a href="#about" className="menu-item">
          <span className="idx">01</span>About
        </a>
        <a href="#projects" className="menu-item">
          <span className="idx">02</span>Projects
        </a>
        <a href="#experience" className="menu-item">
          <span className="idx">03</span>Experience
        </a>
        <a href="#contact" className="menu-item">
          <span className="idx">04</span>Contact
        </a>
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener"
          download
          aria-label="Download resume PDF"
          className="menu-item"
        >
          <span className="idx">05</span>Resume ↓
        </a>
        <span className="menu-foot">Bengaluru, IN · Available Summer 2026</span>
      </div>

      <main id="main">
        <section id="hero">
          <div className="container">
            <span className="status">
              <span className="status-dot" aria-hidden="true" />
              <span className="label">
                Available for Summer 2026 · Bengaluru → Remote
              </span>
            </span>
            <h1>
              <span className="hero-line-1">Dhruv</span>
              <span className="hero-line-2">Patel</span>
            </h1>
            <p className="hero-sub">
              Building ML systems that ship.
              <br />
              Computer vision · Kubernetes · FastAPI.
            </p>
            <div className="hero-ctas">
              <a href="#projects" data-magnetic>
                View work ↓
              </a>
              <a href="mailto:dhruvpt933@gmail.com" data-magnetic>
                Get in touch →
              </a>
            </div>
          </div>
          <div className="ticker">
            <TickerBlock />
          </div>
        </section>

        <section id="about">
          <div className="container about-grid">
            <blockquote className="reveal">
              <span className="mark">&ldquo;</span>I build things that work in
              production,
              <br />
              not just in notebooks.<span className="mark">&rdquo;</span>
            </blockquote>
            <div className="reveal">
              <p>
                2nd-year CSE (AI &amp; ML) at Jain University, Bengaluru. I work
                at the intersection of machine learning and systems — training
                models, building APIs, and shipping end-to-end. From road
                defect detectors to self-healing Kubernetes platforms.
              </p>
              <div className="tags">
                <span className="tag">Python</span>
                <span className="tag">PyTorch</span>
                <span className="tag">YOLOv11n</span>
                <span className="tag">FastAPI</span>
                <span className="tag">Kubernetes</span>
                <span className="tag">XGBoost</span>
                <span className="tag">SHAP</span>
                <span className="tag">React</span>
                <span className="tag">Prometheus</span>
                <span className="tag">SQL</span>
                <span className="tag">Linux</span>
                <span className="tag">Git</span>
              </div>
            </div>
          </div>
        </section>

        <section id="projects">
          <div className="container">
            <span className="label">Selected Work</span>
            <div className="projects-list">
              {/* TODO(Loop 3): real repo URLs pending from Dhruv.
                  Currently → GitHub profile root. */}
              <div
                className="project-row reveal"
                tabIndex={0}
                role="link"
                aria-label="Open A.R.I.A. case study on GitHub"
              >
                <div className="proj-num">01</div>
                <div>
                  <div className="project-title">A.R.I.A.</div>
                  <div className="project-subtitle">
                    Adaptive Road Intelligence Architecture · Jan 2026
                  </div>
                  <div className="project-tags">
                    <span className="project-tag">YOLOv11n</span>
                    <span className="project-tag">FastAPI</span>
                    <span className="project-tag">Streamlit</span>
                    <span className="project-tag">PyTorch</span>
                  </div>
                  <div className="project-metrics">
                    <div className="metric">
                      <span className="metric-value">0.297</span>
                      <span className="metric-label">mAP@50 · IIT-M val</span>
                    </div>
                    <div className="metric">
                      <span className="metric-value">38.3k</span>
                      <span className="metric-label">images · 2-stage curriculum</span>
                    </div>
                    <div className="metric">
                      <span className="metric-value">4</span>
                      <span className="metric-label">defect classes</span>
                    </div>
                  </div>
                  <div className="project-body">
                    4-class road defect detection (longitudinal, transverse,
                    alligator, pothole) via YOLOv11n. Two-stage rehearsal
                    curriculum — RDD2022 global foundation (26.8k images) →
                    IIT Madras fine-tune (11.5k images). Severity scoring maps
                    defect type × bounding-box area against active municipal
                    road contracts to flag DLP violations. FastAPI + SQLite +
                    Streamlit dashboard.
                  </div>
                </div>
                <a
                  href="https://github.com/dptel22"
                  target="_blank"
                  rel="noopener"
                  className="project-arrow"
                  aria-label="View A.R.I.A. on GitHub"
                >
                  →
                </a>
              </div>

              <div
                className="project-row reveal"
                tabIndex={0}
                role="link"
                aria-label="Open Resolve case study on GitHub"
              >
                <div className="proj-num">02</div>
                <div>
                  <div className="project-title">Resolve</div>
                  <div className="project-subtitle">
                    MIT-BLR Hackathon · March 2026 · 48-hour build
                  </div>
                  <div className="project-tags">
                    <span className="project-tag">Kubernetes</span>
                    <span className="project-tag">Prometheus</span>
                    <span className="project-tag">Isolation Forest</span>
                    <span className="project-tag">FastAPI</span>
                    <span className="project-tag">React</span>
                  </div>
                  <div className="project-metrics">
                    <div className="metric">
                      <span className="metric-value">48h</span>
                      <span className="metric-label">end-to-end build</span>
                    </div>
                    <div className="metric">
                      <span className="metric-value">2</span>
                      <span className="metric-label">anomaly algorithms</span>
                    </div>
                    <div className="metric">
                      <span className="metric-value">live</span>
                      <span className="metric-label">cluster health dashboard</span>
                    </div>
                  </div>
                  <div className="project-body">
                    Self-healing Kubernetes platform. Anomaly detection on
                    Prometheus telemetry using Isolation Forest + Z-Score —
                    detects pod degradation before hard failures. Automated
                    pod recovery via FastAPI orchestration. React + Recharts
                    real-time cluster-health dashboard. Built end-to-end in 48
                    hours at MIT Bangalore Hackathon.
                  </div>
                </div>
                <a
                  href="https://github.com/dptel22"
                  target="_blank"
                  rel="noopener"
                  className="project-arrow"
                  aria-label="View Resolve on GitHub"
                >
                  →
                </a>
              </div>

              <div
                className="project-row reveal"
                tabIndex={0}
                role="link"
                aria-label="Open MaternalGuard case study on GitHub"
              >
                <div className="proj-num">03</div>
                <div>
                  <div className="project-title">MaternalGuard</div>
                  <div className="project-subtitle">
                    DevCraft / Byte.exe Hackathon · 3rd Place · April 2026
                  </div>
                  <div className="project-tags">
                    <span className="project-tag">XGBoost</span>
                    <span className="project-tag">SHAP</span>
                    <span className="project-tag">FastAPI</span>
                    <span className="project-tag">React</span>
                    <span className="project-tag">Vite</span>
                  </div>
                  <div className="project-metrics">
                    <div className="metric">
                      <span className="metric-value">3rd</span>
                      <span className="metric-label">place finish</span>
                    </div>
                    <div className="metric">
                      <span className="metric-value">6</span>
                      <span className="metric-label">clinical vitals</span>
                    </div>
                    <div className="metric">
                      <span className="metric-value">SHAP</span>
                      <span className="metric-label">per-prediction explainability</span>
                    </div>
                  </div>
                  <div className="project-body">
                    Maternal health risk prediction on the UCI dataset. XGBoost
                    classifier on 6 vitals with SHAP explainability — surfaces
                    which clinical features drive each prediction. Built for
                    clinicians who need to understand the why, not just the
                    output. FastAPI + React + Vite. 3rd place at DevCraft
                    hackathon.
                  </div>
                </div>
                <a
                  href="https://github.com/dptel22"
                  target="_blank"
                  rel="noopener"
                  className="project-arrow"
                  aria-label="View MaternalGuard on GitHub"
                >
                  →
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="experience">
          <div className="container">
            <span className="label">Experience &amp; Leadership</span>
            <div className="timeline">
              <div className="timeline-item reveal">
                <div className="timeline-date">2026 — Now</div>
                <div className="timeline-title">Cloud &amp; DevOps Club</div>
                <div className="timeline-body">
                  Tech Team Member. Building internal cloud-infrastructure demos
                  and ML tooling at the intersection of Kubernetes and AI
                  systems.
                </div>
              </div>

              <div className="timeline-item reveal">
                <div className="timeline-date">Oct 2025</div>
                <div className="timeline-title">Aspire Leaders Program</div>
                <div className="timeline-body">
                  Selected from 45,228 global applicants. 40 hours of
                  leadership coursework. Harvard-founded program.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact">
          <div className="container">
            <span className="label">Contact</span>
            <h2 className="contact-headline">
              <SplitChars text="Let’s build" />
              <br />
              <em>
                <SplitChars text="something real." />
              </em>
            </h2>
            <a
              href="mailto:dhruvpt933@gmail.com"
              className="contact-email reveal"
              data-magnetic
            >
              dhruvpt933@gmail.com
              <span className="arrow" aria-hidden="true">
                →
              </span>
            </a>
            <div className="contact-meta reveal">
              <span>
                <span className="dot" aria-hidden="true" />
                Available Summer 2026
              </span>
              <span>Bengaluru, IN · UTC+5:30</span>
              <span>Replies within 24h</span>
            </div>
            <div className="social-links reveal">
              <a
                href="https://github.com/dptel22"
                target="_blank"
                rel="noopener"
                aria-label="GitHub profile"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/dhruv-patel-949946261/"
                target="_blank"
                rel="noopener"
                aria-label="LinkedIn profile"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="container footer-inner">
          <span>© 2026 Dhruv Patel</span>
          <span>Built with intent. Vanilla HTML · CSS · JS.</span>
        </div>
      </footer>

      {/* Vanilla portfolio logic — portable to Render as-is. */}
      <script defer src="/portfolio/main.js" />
      {/* GSAP motion system (Loop 2). CDN, defer, fully reduced-motion-gated
          inside motion.js. Loaded AFTER main.js so core UX works without GSAP. */}
      <script
        defer
        src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"
      />
      <script
        defer
        src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"
      />
      <script defer src="/portfolio/motion.js" />
    </>
  );
}
