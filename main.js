// 1. SCROLL PROGRESS BAR
const progress = document.getElementById('progress');
function updateScrollProgress() {
  const scrollableHeight = document.body.scrollHeight - window.innerHeight;
  const pct = scrollableHeight > 0 
    ? (window.scrollY / scrollableHeight) * 100 : 0;
  progress.style.width = pct + '%';
}
window.addEventListener('scroll', updateScrollProgress);
window.addEventListener('resize', updateScrollProgress);
updateScrollProgress();

// 2. SCROLL REVEAL via IntersectionObserver
const revealEls = document.querySelectorAll('.reveal');
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revealObserver.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('visible'));
}

// 3. CUSTOM CURSOR (desktop only)
if (
  window.matchMedia('(hover: hover)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches
) {
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
  if (!isExpanded) {
    menuOverlay.setAttribute('aria-hidden', 'false');
  } else {
    menuOverlay.setAttribute('aria-hidden', 'true');
  }
});

menuLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    menuOverlay.setAttribute('aria-hidden', 'true');
  });
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && 
      document.body.classList.contains('menu-open')) {
    document.body.classList.remove('menu-open');
    hamburger.setAttribute('aria-expanded', 'false');
    menuOverlay.setAttribute('aria-hidden', 'true');
    hamburger.focus();
  }
});

document.querySelectorAll('.project-row').forEach(row => {
  row.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      row.querySelector('.project-arrow').click();
    }
  });
});
