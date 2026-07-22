# Portfolio Engineering Worklog — Dhruv Patel

Single source of truth for the portfolio rebuild. Every agent/cron run MUST read this
before working and append a new `---` section after working. Do NOT overwrite.

---

Task ID: 0 (Audit + Roadmap)
Agent: Principal Engineer (orchestrator)
Task: Audit the existing vanilla portfolio (uploaded to /home/z/my-project/upload/) and
produce a complete engineering roadmap before writing any code.

Work Log:
- Read all uploaded source: index.html (203 lines), style.css (681 lines), main.js (122 lines),
  README.md, render.yaml, AGENTS.md, .gitignore.
- Cross-referenced AGENTS.md spec against actual implementation to find drift.
- Compared current state against the user's stated target (Apple/Stripe/Vercel/Linear/Anthropic
  feel; recruiter-impact-first; GSAP; FastAPI backend; Lighthouse 100).
- Mapped every gap to recruiter impact and sequenced into 8 loops.

Stage Summary — see full audit below.

## 1. Current Architecture (as-found)

```
Static site, no build step, no framework.
├── index.html   semantic HTML, 6 sections, GSAP *claimed* but not used
├── style.css    design tokens in :root, STIX Two Text + DM Mono, dark theme
├── main.js      vanilla only: progress bar, IntersectionObserver reveal,
│                custom cursor, mobile menu, keyboard handlers
├── render.yaml  Render static config (missing repo: field per AGENTS.md spec)
├── README.md    minimal, mentions GSAP (drift)
├── AGENTS.md    detailed spec, ~60% drifted from actual code
└── resume.pdf   binary asset
```

## 2. Strengths (preserve these)

1. Genuinely fast foundation — no framework, no build, ~3 files, minimal DOM.
   This is the right call for a 100-Lighthouse target.
2. Strong accessibility baseline — skip link, sr-only, aria-expanded on hamburger,
   aria-hidden on overlay, focus-visible outline, prefers-reduced-motion gating,
   Escape-to-close menu, Enter/Space activation on project rows.
3. Real, dense, technical content — A.R.I.A. ships mAP@0.297 on IIT-Madras val,
   26.8k+11.5k image two-stage rehearsal; Resolve = 48hr K8s self-healing build;
   MaternalGuard = 3rd place + SHAP explainability. This is recruiter-grade material.
4. Editorial typographic identity — STIX Two Text (serif display) + DM Mono is
   distinctive and premium. Better than generic Inter/SF clones.
5. Performant reveal pattern — IntersectionObserver + unobserve, passive scroll
   listeners, will-change on cursor, transform-only animations (GPU-friendly).
6. Tasteful custom cursor — mix-blend-mode difference, desktop + reduced-motion gated.
7. Semantic sectioning — nav/main/section/footer, real heading hierarchy.

## 3. Weaknesses — ranked by recruiter impact (highest → lowest)

| # | Weakness | Why it hurts recruiter confidence | Fix cost |
|---|----------|-----------------------------------|----------|
| W1 | **Projects are one dense paragraph each.** No Problem/Constraints/Architecture/Tradeoffs/Metrics/Failures/Lessons/Impact structure. Recruiters can't see engineering thinking, only read a wall of text. | Core ask unmet. This is THE gap between "designer portfolio" and "engineer portfolio." | High |
| W2 | **Broken & weak links.** Resume href = `./Resume.pdf` but file is `resume.pdf` (case-sensitive 404 on Render/Linux). Every project arrow → `github.com/dptel22` profile root, not the actual repo. | "This person doesn't check their own links." Credibility killer in 5 seconds. | Low |
| W3 | **AGENTS.md ↔ code drift ~60%.** Spec says GSAP + char-split hero + 2x2 bento + electric-lime accent + Cabinet Grotesk/Satoshi fonts + YOLOv8/silkworm projects. Reality: no GSAP, slideUp CSS, 3-row list, no accent, STIX+DM Mono, A.R.I.A./Resolve/MaternalGuard. | Senior engineer reviewing repo = "docs lie." Kills maintainability score. | Low |
| W4 | **No "Architecture / Systems" section.** User's own flow (Hero→About→Projects→Architecture→Timeline→Experience→Contact) is missing the Architecture step. No system diagram, no "how my stack fits together," no backend readiness signal. | Backend/Systems recruiters (target audience) see only ML, not systems thinking. | Med |
| W5 | **Metrics are buried in prose.** mAP@0.297, 26.8k images, 45,228 applicants, 3rd place, 48hr build — all invisible to a 15-second scan. No large numerical callouts. | The strongest proof points don't register. | Med |
| W6 | **No backend / API surface at all.** User wants future-ready ML inference, telemetry, contact API, analytics, live demos. Currently 100% static with no FastAPI service. | "Can this person build backend?" → unproven. | High |
| W7 | **Body copy in DM Mono at 16px.** Mono fonts for paragraphs = eye strain, hurts readability + Lighthouse A11y. Mono should be labels/tags/metrics only. | Premium feel undercut by legibility. | Low |
| W8 | **CSS bug — stray `}` at style.css:629** after the `body.has-custom-cursor` block. Invalid declaration, signals carelessness. | Polish gap. | Trivial |
| W9 | **No GSAP despite claiming it** (README + AGENTS.md). Animations are CSS-only fade-ups — clean but not "Apple keynote / mask reveals / split text / parallax / motion hierarchy." | Doesn't deliver the stated animation philosophy. | Med |
| W10 | **Hero is generic.** "Building ML systems that ship" is fine but no "currently building X," no availability/status, no location/time, no sense of "now." Apple/Linear/Vercel heroes have immediacy. | Weak 15-second hook. | Med |
| W11 | **Experience section is thin** — 2 items, one vague ("building internal demos"). No hackathon wins as structured entries, no open-source, no coursework framing. | Looks empty for a 2nd-year student. | Med |
| W12 | **No favicon, no OG/Twitter card, no theme-color, no JSON-LD Person schema.** Sharing the link in Slack/email = no preview. | Distribution + SEO gap. | Low |
| W13 | **All 3 projects visually identical.** A.R.I.A. (the hero project) gets no extra weight. No imagery, no architecture mini-diagrams, no screenshots. | Visual hierarchy missing; hero project under-served. | Med |
| W14 | **Contact is weak** — email + 2 socials only. No form, no "what I'm looking for," no availability, no response-time signal. | Friction for recruiters who prefer forms. | Low |
| W15 | **render.yaml missing `repo:` field** documented in AGENTS.md. | Drift. | Trivial |
| W16 | **Project rows: tabindex=0 + Enter handler but no distinct keyboard focus treatment** beyond default outline. | A11y polish. | Low |

## 4. Critical-thinking challenges to the stated brief

(Principal Engineer duty — not blind agreement.)

- **"Lighthouse 100 Performance" + "GSAP + ScrollTrigger + parallax + split text" partially conflict.**
  GSAP is ~70KB and any scroll-bound work risks jank. Recommendation: load GSAP from CDN
  with `defer`, gate 100% behind `prefers-reduced-motion`, use CSS-first for reveals and
  reserve GSAP for split-text + scrubbed parallax that CSS genuinely cannot do. Target is
  still reachable but demands discipline, not "add GSAP everywhere."
- **"No build tools / no npm" + "FastAPI backend with live ML demos, telemetry, analytics"
  on Render.** Fine for the frontend, but the FastAPI service is a *separate* Render web
  service, not part of the static site. The static site must talk to it via fetch with a
  configured base URL. We will NOT bake backend logic into the static bundle.
- **"Turn every project into a case study" on a single page** risks a 6000-word wall.
  Recommendation: card → expandable case-study panel (vanilla, `<details>`-style or
  hash-routed) so the landing scan stays fast and the depth is opt-in. This also serves
  the "minimal DOM / 100 Performance" goal.
- **Target roles span AI/ML *and* Backend *and* Systems.** Current site leans AI/ML only.
  Resolve (K8s + FastAPI orchestration) and A.R.I.A. (FastAPI + SQLite) must be framed to
  also satisfy backend/systems recruiters, not just ML recruiters.
- **Sandbox reality check (transparent):** This build environment is a Next.js 16 sandbox;
  the only user-visible route is `/` via `src/app/page.tsx` served on port 3000. To honor
  the "vanilla HTML/CSS/JS + GSAP, no React, no build tools" constraint *in the portfolio
  code itself*, we render the portfolio as a single Server Component page that emits raw
  semantic HTML, links to vanilla CSS/JS in `/public/portfolio/`, and loads GSAP via CDN
  `<script defer>`. No React component tree, no JSX interactivity, no client hooks. The
  portfolio source stays vanilla and portable to Render as-is. I'll call this out explicitly
  in every loop so there is no confusion.

## 5. Engineering Roadmap — 8 loops (45–60 min each, approval-gated)

Each loop ends with the 12-part deliverable format and a self-review scorecard.
The autonomous 15-min webDevReview cron advances sub-steps within the current loop
and writes progress back here.

- **Loop 1 — Foundation repair & typographic system.**
  Fix W2/W3/W7/W8/W12/W15. Correct resume + repo links, kill the stray `}`, sync
  AGENTS.md to reality, introduce a readable sans body face (reserve DM Mono for
  labels/metrics), add favicon/OG/theme-color/JSON-LD Person. Recruiter impact: HIGH
  (credibility + polish + shareability). Risk: low.

- **Loop 2 — GSAP motion system.**
  Fix W9. Introduce GSAP + ScrollTrigger (CDN, defer, reduced-motion gated). Split-text
  hero with mask reveal, scrubbed parallax on section labels, motion hierarchy, magnetic
  cursor on CTAs. Recruiter impact: MED-HIGH (the "Apple keynote" feel). Risk: perf
  regression — must re-verify Lighthouse.

- **Loop 3 — Project case studies (the hero loop).**
  Fix W1/W5/W13. Convert 3 project rows into expandable case studies with the full
  Problem/Constraints/Architecture/Tradeoffs/Metrics/Failures/Lessons/Impact scaffold.
  Large metric callouts, SVG architecture mini-diagrams, links to *actual* repos (need
  real URLs from Dhruv). Recruiter impact: HIGHEST — this is the core proof. Risk: content
  gathering (need real repo URLs + verified metrics).

- **Loop 4 — Architecture & Systems section.**
  Fix W4. New section: system diagram of how the portfolio + future FastAPI services fit
  together; tech-stack-as-a-system (not tag cloud); data-flow for a sample ML inference
  request. Recruiter impact: HIGH for backend/systems roles. Risk: must stay editorial,
  not slide-deck-y.

- **Loop 5 — FastAPI backend foundation (mini-service).**
  Fix W6 (part 1). Stand up a Python FastAPI service (separate Render web service,
  mirrored locally as a mini-service on its own port) with modular routes: `/health`,
  `/contact` (POST, validation, email forward/store), `/telemetry` stub, `/projects` read
  API, and an `/inference/*` namespace scaffold for future ML demos. CORS-locked to the
  portfolio origin. Recruiter impact: HIGH — proves backend capability. Risk: deployment
  wiring; keep surface minimal first.

- **Loop 6 — Live signals.**
  Fix W6 (part 2). Wire the frontend to backend: GitHub activity feed (cached), project
  telemetry dashboard (latency/uptime stubs that become real), deployment status badge,
  visitor analytics (privacy-first, no cookies). Recruiter impact: VERY HIGH — "this
  person ships and instruments." Risk: rate limits, privacy.

- **Loop 7 — Lighthouse 100 + performance hardening.**
  Verify all four categories at 100. Image optimization, font subsetting/preload, critical
  CSS inline, defer non-critical, cache headers, CLS audit. Recruiter impact: MED (table
  stakes but proves discipline). Risk: GSAP vs perf tradeoff resurfaces.

- **Loop 8 — Editorial polish & content depth.**
  Fix W10/W11/W14. "Currently building" hero hook + availability status; expand experience
  with structured hackathon/open-source entries; contact form wired to FastAPI + response-
  time signal; final copy pass. Recruiter impact: MED-HIGH. Risk: scope creep.

## 6. Success criteria (definition of done)

- 15-second scan → "this person is different" (metrics visible, hero has immediacy).
- 60-second scan → "I need to interview him" (case studies legible, system thinking visible).
- Lighthouse 100/100/100/100 on the deployed URL.
- Every link works; every repo link points to a real, public repo.
- FastAPI backend live with `/health` 200 and `/contact` accepting POSTs.
- AGENTS.md and README.md match the shipped code exactly.
- Self-review scorecard ≥ 9/10 on all seven categories (design/eng/recruiter/ux/a11y/perf/maintainability).

## 7. Unresolved / needs input from Dhruv

- Real GitHub repo URLs for A.R.I.A., Resolve, MaternalGuard (currently all → profile root).
- Confirmation of project metrics (mAP numbers, dataset sizes, hackathon dates/placements).
- Preferred contact mechanism (mailto vs form vs both).
- FastAPI base URL / Render service name once backend is deployed.
- Whether to keep STIX Two Text + DM Mono or migrate toward AGENTS.md's Cabinet Grotesk/Satoshi
  (my recommendation: keep STIX Two Text for display, add a readable sans for body, keep DM Mono
  for labels/metrics only — best of both).

