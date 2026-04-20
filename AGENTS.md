---

# AGENTS.md — Portfolio Website: Dhruv Patel

## Project Overview
Static personal portfolio site for Dhruv Patel (AI/ML Engineer, CSE 2nd year, Bengaluru).
No framework. No build step. No package.json. Open index.html directly in a browser to develop.
Target: MLH Fellowship reviewers and AI/ML internship recruiters.

## File Structure (target state)
├── index.html ← entire site, single page, all sections
├── style.css ← all styles, design tokens as CSS variables at :root
├── main.js ← all JS: GSAP animations, cursor, nav scroll, mobile menu
├── render.yaml ← Render static site deployment config
├── resume.pdf ← Dhruv's resume (placeholder or real)
├── AGENTS.md ← this file
└── README.md ← project description + live URL


## Design Tokens (never hardcode values — always use these variables)
```css
--bg: #0a0a0a
--surface: #111111
--surface-2: #1a1a1a
--border: rgba(255,255,255,0.07)
--text: #e8e8e6
--text-muted: #888884
--text-faint: #444440
--accent: #c8f560        /* electric lime — ONLY on hover + 1 CTA, nowhere else */
--accent-alt: #f0ede6    /* cream — section labels, marquee text */
--font-display: 'Cabinet Grotesk', 'Plus Jakarta Sans', sans-serif
--font-body: 'Satoshi', 'Inter', sans-serif
```

## Sections (index.html structure — in this order)
1. `<nav>` — fixed top, DP monogram left, nav links + resume button right
2. `#hero` — 100vh, h1 split into `.word > .char` spans for GSAP animation
3. `#marquee` — infinite CSS scroll strip with tech keywords
4. `#about` — 2-col grid: bio left, skill tags right
5. `#projects` — 2x2 bento grid, 4 cards with `.project-card` class
6. `#experience` — timeline layout with `.timeline-entry` items
7. `#contact` — 3 link buttons (email, LinkedIn, GitHub)
8. `<footer>` — single line

## Animation Rules (GSAP — main.js)
- CDN: `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js`
- CDN: `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js`
- Register plugin: `gsap.registerPlugin(ScrollTrigger)` at top of main.js
- Hero sequence: GSAP timeline on DOMContentLoaded — nav → label → .char spans (clip-path reveal) → tagline → buttons
- Char split pattern (always use this, not SplitText plugin):
  ```js
  function splitChars(el) {
    const text = el.textContent;
    el.innerHTML = text.split('').map(c =>
      `<span class="char" style="display:inline-block">${c === ' ' ? '&nbsp;' : c}</span>`
    ).join('');
  }
  ```
- All scroll reveals use ScrollTrigger with `trigger: el, start: "top 80%"`
- Clip-path reveal pattern: `from: { clipPath: "inset(100% 0 0 0)" }, to: { clipPath: "inset(0% 0 0 0)" }`
- Custom cursor: `#cursor` (12px solid accent circle) + `#cursor-follower` (40px outline circle, GSAP lerp duration 0.12)
- prefers-reduced-motion: wrap all GSAP calls in `if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches)`

## CSS Rules (style.css)
- All design tokens defined at `:root` — never hardcode hex values in component styles
- Border-radius: 0px on all cards and project tiles (sharp edges, editorial aesthetic)
- Marquee animation: CSS only, `@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`, content duplicated twice inside container
- No colored backgrounds on skill tags — use `background: var(--surface-2)`, `border: 1px solid var(--border)`
- No gradient buttons — accent color is solid only, used on border + text hover states
- Mobile: single column at 375px, hamburger nav, cursor hidden, font-size hero override

## Render Deployment (render.yaml)
```yaml
services:
  - type: web
    name: dhruv-portfolio
    runtime: static
    repo: https://github.com/dptel22/portfolio-website
    branch: main
    staticPublishPath: .
    pullRequestPreviewsEnabled: true
```

## Recruiter-Critical Content (never remove or rename these)
- Hero tagline: "Building systems that learn, scale, and matter."
- About bio must mention: AI/ML, Computer Vision, Kubernetes, FastAPI, Bengaluru, MLH, internships
- Projects must include: Road Damage Detection (YOLOv8), Maternal Health Risk (scikit-learn), Silkworm IoT (sensors/MQTT), 1 placeholder
- Contact section must have: LinkedIn (https://www.linkedin.com/in/dhruv-patel-949946261/), GitHub (https://github.com/dptel22)
- Resume download button must exist in nav

## What Agents Must NOT Do
- Do NOT add React, Vue, Svelte, or any JS framework
- Do NOT add package.json, webpack, vite, or any build tool
- Do NOT use localStorage or sessionStorage (sandboxed iframe restriction)
- Do NOT add border-radius to project cards (aesthetic decision)
- Do NOT use purple, violet, indigo, or gradient colors anywhere
- Do NOT add more than 2 non-neutral accent colors visible in any viewport
- Do NOT use inline onclick/onfocus handlers — all events in main.js only
- Do NOT use external image URLs from memory — SVG shapes or CSS only for visuals

## How to Test Locally
Open index.html directly in Chrome/Firefox. No server needed for static assets.
For live reload: `python3 -m http.server 8080` in project root, then open localhost:8080.

## PR Conventions
- Branch naming: `feat/description`, `fix/description`
- PR titles: `feat: ` or `fix: ` prefix
- One PR per logical feature (don't bundle unrelated changes)
- Always update README.md if the live Render URL changes

---
