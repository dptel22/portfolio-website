// 1. SCROLL PROGRESS BAR & NAV BLUR
const navEl = document.querySelector('nav');
const progressBar = document.getElementById('progress');

function onScroll() {
  if (progressBar) {
    const scrollable = document.body.scrollHeight - window.innerHeight;
    progressBar.style.width = scrollable > 0
      ? (window.scrollY / scrollable) * 100 + '%' : '0%';
  }
  const pastHero = window.scrollY > 80;
  navEl.style.background = pastHero
    ? 'rgba(10,10,10,0.95)' : 'rgba(10,10,10,0.6)';
  navEl.style.backdropFilter = pastHero ? 'blur(20px)' : 'blur(6px)';
  navEl.style.borderBottomColor = pastHero
    ? 'rgba(252,249,243,0.1)' : 'transparent';
}

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll, { passive: true });
onScroll();

// 2. SCROLL REVEAL via IntersectionObserver
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
}

// 3. CUSTOM CURSOR (desktop only)
if (
  window.matchMedia('(hover: hover)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches
) {
  const cursor = document.createElement('div');
  cursor.id = 'cursor';
  document.body.appendChild(cursor);

  const follower = document.createElement('div');
  follower.id = 'cursor-follower';
  document.body.appendChild(follower);

  document.body.classList.add('has-custom-cursor');

  let mx = 0, my = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.transform = `translate(${mx}px, ${my}px)`;
  });

  (function lerpFollower() {
    fx += (mx - fx) * 0.1;
    fy += (my - fy) * 0.1;
    follower.style.transform = `translate(${fx}px, ${fy}px)`;
    requestAnimationFrame(lerpFollower);
  })();

  document.querySelectorAll('a, button, .project-row').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor-hover');
      follower.classList.add('follower-hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor-hover');
      follower.classList.remove('follower-hover');
    });
  });
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
