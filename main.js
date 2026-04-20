// 1. SCROLL PROGRESS BAR
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  document.getElementById('progress').style.width = pct + '%';
});

// 2. SCROLL REVEAL via IntersectionObserver
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(el => {
      if (el.isIntersecting) {
        el.target.classList.add('visible');
        observer.unobserve(el.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
}

// 3. CUSTOM CURSOR (desktop only)
if (window.matchMedia('(hover: hover)').matches) {
  const cursor = document.createElement('div');
  cursor.id = 'cursor';
  document.body.appendChild(cursor);
  document.body.classList.add('has-custom-cursor');

  let mx = 0, my = 0, cx = 0, cy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
  });

  (function lerp() {
    cx += (mx - cx) * 0.12;
    cy += (my - cy) * 0.12;
    cursor.style.transform = `translate(${cx}px, ${cy}px)`;
    requestAnimationFrame(lerp);
  })();
}

// 4. MOBILE MENU toggle (vanilla JS)
const hamburger = document.getElementById('hamburger');
const menuOverlay = document.getElementById('menu-overlay');
const menuLinks = menuOverlay.querySelectorAll('a');

hamburger.addEventListener('click', () => {
  const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
  hamburger.setAttribute('aria-expanded', !isExpanded);
  document.body.classList.toggle('menu-open');
});

menuLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  });
});
