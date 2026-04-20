import re

with open('portfolio-website/index.html', 'r') as f:
    html = f.read()

# 1. Marquee
marquee_content = "AI/ML ENGINEER &middot; COMPUTER VISION &middot; KUBERNETES &middot; FASTAPI &middot; YOLOV11N &middot; F1 NERD &middot; OPEN SOURCE &middot; PYTORCH &middot; SYSTEMS BUILDER &middot;"
html = re.sub(r'(<div class="marquee-track">)\s*<span>.*?</span>\s*<span>.*?</span>',
              f'\\1\n      <span>{marquee_content}</span>\n      <span>{marquee_content}</span>', html, flags=re.DOTALL)

# 2. About Section
about_bio = """<div class="about-left">
          <h2 class="section-label">01 // Background</h2>
          <p>2nd year CSE AI/ML student at Jain University, Bengaluru.</p>
          <p>I work at the intersection of machine learning and systems &mdash; training models, building APIs, and shipping end-to-end. From road defect detectors to self-healing Kubernetes platforms.</p>
          <p>Outside code: Arsenal fan, F1 nerd, strength training 4&times; a week.</p>
          <p class="accent-text">Currently: Building &middot; Learning &middot; Open to internships (2026&ndash;27)</p>
        </div>"""

html = re.sub(r'<div class="about-left">.*?</div>', about_bio, html, flags=re.DOTALL)

# Skills
skills = ["Python", "PyTorch", "YOLOv11n", "Computer Vision", "XGBoost", "SHAP", "FastAPI", "React", "Kubernetes", "Prometheus", "SQL", "GCP", "AWS", "Time-Series", "Isolation Forest", "Linux", "Git", "Kaggle"]
skills_html = '<div class="about-right skill-tags">\n          ' + '\n          '.join([f'<span class="skill-tag">{s}</span>' for s in skills]) + '\n        </div>'
html = re.sub(r'<div class="about-right skill-tags">.*?</div>', skills_html, html, flags=re.DOTALL)

# 3. Projects
# Card 1 - ARIA
aria_card = """<article class="project-card">
          <div class="card-number">01</div>
          <div class="card-content">
            <h3>Autonomous Road Intelligence Architecture</h3>
            <p class="card-problem">Road defect detection + severity mapping against municipal contracts.</p>
            <ul class="card-bullets">
              <li>YOLOv11n trained on 38k+ images (RDD2022 + IIT Madras) via 2-stage rehearsal curriculum to prevent catastrophic forgetting.</li>
              <li>4-class defect detector (longitudinal crack, transverse crack, alligator crack, pothole) &mdash; mAP@50 0.297 val / 0.161 held-out test.</li>
              <li>Backend severity scoring (defect type &times; bounding box area) feeds geospatial contract mapping &mdash; flags DLP violations on active municipal road contracts.</li>
              <li>FastAPI + SQLite + Streamlit dashboard. Jan 2026.</li>
            </ul>
            <p class="card-tech">YOLOv11n &middot; PyTorch &middot; FastAPI &middot; SQLite &middot; Streamlit &middot; Roboflow</p>
            <div class="card-links">
              <a href="https://github.com/dptel22/Project-ARIA" target="_blank" rel="noopener noreferrer">View Source &rarr;</a>
            </div>
          </div>
        </article>"""

html = re.sub(r'<article class="project-card">\s*<div class="card-number">01</div>.*?</article>', aria_card, html, flags=re.DOTALL)

# Card 2 - Resolve
resolve_card = """<article class="project-card">
          <div class="card-number">02</div>
          <div class="card-content">
            <h3>Resolve</h3>
            <p class="card-problem">Self-healing Kubernetes platform. MIT-BLR Hackathon, March 2026.</p>
            <ul class="card-bullets">
              <li>Anomaly detection on Prometheus telemetry using Isolation Forest + Z-Score &mdash; detects pod degradation before hard failures.</li>
              <li>FastAPI orchestrates automated pod recovery; React + Recharts dashboard shows cluster health in real time.</li>
              <li>Built end-to-end under 48 hours at MIT Bangalore Hackathon.</li>
            </ul>
            <p class="card-tech">Kubernetes &middot; Prometheus &middot; Isolation Forest &middot; FastAPI &middot; React &middot; Recharts</p>
            <div class="card-links">
              <a href="https://github.com/dptel22" target="_blank" rel="noopener noreferrer">View Source &rarr;</a>
            </div>
          </div>
        </article>"""

html = re.sub(r'<article class="project-card">\s*<div class="card-number">02</div>.*?</article>', resolve_card, html, flags=re.DOTALL)

# Card 3 - VitaSakhi
vitasakhi_card = """<article class="project-card">
          <div class="card-number">03</div>
          <div class="card-content">
            <h3>VitaSakhi</h3>
            <p class="card-problem">Maternal health risk prediction. DevCraft/Byte.exe Hackathon &mdash; 3rd place.</p>
            <ul class="card-bullets">
              <li>XGBoost classifier on UCI Maternal Health dataset; SHAP explainability surfaces which of 6 vitals drive each risk prediction.</li>
              <li>Full-stack: FastAPI backend + React + Vite frontend. April 2026.</li>
            </ul>
            <p class="card-tech">XGBoost &middot; SHAP &middot; scikit-learn &middot; FastAPI &middot; React &middot; Vite</p>
            <div class="card-links">
              <a href="https://github.com/dptel22" target="_blank" rel="noopener noreferrer">View Source &rarr;</a>
            </div>
          </div>
        </article>"""

html = re.sub(r'<article class="project-card">\s*<div class="card-number">03</div>.*?</article>', vitasakhi_card, html, flags=re.DOTALL)

# Delete Card 4
html = re.sub(r'<article class="project-card">\s*<div class="card-number">04</div>.*?</article>', '', html, flags=re.DOTALL)


# 4. Experience Section
experience = """<div class="timeline">
        <div class="timeline-entry">
          <div class="timeline-left">2026 &mdash; NOW</div>
          <div class="timeline-right">
            <h3>Cloud & DevOps Club</h3>
            <p>Tech Team Member &mdash; building internal cloud infra demos and ML tooling at the intersection of Kubernetes and AI.</p>
          </div>
        </div>

        <div class="timeline-entry">
          <div class="timeline-left">Oct 2025</div>
          <div class="timeline-right">
            <h3>Aspire Leaders Program</h3>
            <p>Selected from 45,228 global applicants. 40 hours of leadership coursework. Harvard-founded program.</p>
          </div>
        </div>

        <div class="timeline-entry">
          <div class="timeline-left">2026</div>
          <div class="timeline-right">
            <h3>Hackathons (3)</h3>
            <p>MIT-BLR (Resolve), DevCraft/Byte.exe (VitaSakhi &mdash; 3rd place), and ARIA &mdash; all shipped end-to-end under 48 hours.</p>
          </div>
        </div>
      </div>"""

html = re.sub(r'<div class="timeline">.*?</div>\s*</div>\s*</section>', experience + '\n    </div>\n  </section>', html, flags=re.DOTALL)

# 5. Contact Email
html = html.replace('dhruvpatel@placeholder.com', 'dhruvpt933@gmail.com')

with open('portfolio-website/index.html', 'w') as f:
    f.write(html)
