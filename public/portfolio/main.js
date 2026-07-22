/* ============================================================
   Dhruv Patel — Portfolio
   Vanilla JS · portable to Render as a static asset.
   Loop 1: foundation (progress, reveal, active-nav, cursor, menu,
            keyboard focus, smooth-scroll). GSAP arrives in Loop 2.
   Fully gated by prefers-reduced-motion. No frameworks.
   ============================================================ */
(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var prefersSmooth = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
  var canHover = window.matchMedia('(hover: hover)').matches && !prefersReduced;

  // Gate ALL DOM mutation on the `load` event so React hydration in the
  // Next.js SSR host completes first. This eliminates hydration-mismatch
  // warnings. CSS reveal-safety (3s) prevents invisible content if load
  // is delayed.
  function init() {

  /* 1. Scroll progress + nav scrolled state */
  var navEl = document.querySelector('nav');
  var progressBar = document.getElementById('progress');

  function onScroll() {
    var docEl = document.documentElement;
    var scrollable = docEl.scrollHeight - window.innerHeight;
    if (progressBar) {
      progressBar.style.width = scrollable > 0 ? (window.scrollY / scrollable) * 100 + '%' : '0%';
    }
    if (navEl) {
      if (window.scrollY > 40) navEl.classList.add('scrolled');
      else navEl.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  // Defer initial onScroll to the next frame so it doesn't set inline styles
  // (#progress width) synchronously during script execution — which would
  // race React hydration in the Next.js SSR host and log a mismatch warning.
  if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(onScroll);
  } else {
    setTimeout(onScroll, 0);
  }

  /* 2. Reveal on scroll */
  var revealEls = document.querySelectorAll('.reveal');
  if (!prefersReduced && 'IntersectionObserver' in window) {
    var revealIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); revealIo.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { revealIo.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* 3. Active nav link via section observer */
  var navLinks = document.querySelectorAll('.nav-links a[data-nav]');
  var sections = [];
  navLinks.forEach(function (link) {
    var id = link.getAttribute('href');
    if (id && id.charAt(0) === '#') {
      var sec = document.querySelector(id);
      if (sec) sections.push({ link: link, el: sec });
    }
  });
  if ('IntersectionObserver' in window && sections.length) {
    var navIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var match = null;
        for (var i = 0; i < sections.length; i++) { if (sections[i].el === e.target) { match = sections[i]; break; } }
        if (!match) return;
        if (e.isIntersecting) {
          navLinks.forEach(function (l) { l.removeAttribute('aria-current'); });
          match.link.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (s) { navIo.observe(s.el); });
  }

  /* 4. Custom cursor (desktop + no reduced motion) */
  if (canHover) {
    var cursor = document.createElement('div');
    cursor.id = 'cursor';
    var follower = document.createElement('div');
    follower.id = 'cursor-follower';
    document.body.appendChild(cursor);
    document.body.appendChild(follower);
    document.body.classList.add('has-custom-cursor');

    var mx = 0, my = 0, fx = 0, fy = 0;
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      cursor.style.transform = 'translate(' + mx + 'px,' + my + 'px)';
    });
    (function lerp() {
      fx += (mx - fx) * 0.12;
      fy += (my - fy) * 0.12;
      follower.style.transform = 'translate(' + fx + 'px,' + fy + 'px)';
      requestAnimationFrame(lerp);
    })();

    var hoverSel = 'a, button, .project-row, [data-cursor]';
    document.querySelectorAll(hoverSel).forEach(function (el) {
      el.addEventListener('mouseenter', function () { cursor.classList.add('cursor-hover'); follower.classList.add('follower-hover'); });
      el.addEventListener('mouseleave', function () { cursor.classList.remove('cursor-hover'); follower.classList.remove('follower-hover'); });
    });
  }

  /* 5. Mobile menu */
  var hamburger = document.getElementById('hamburger');
  var menuOverlay = document.getElementById('menu-overlay');
  if (hamburger && menuOverlay) {
    var menuLinks = menuOverlay.querySelectorAll('a');
    function setMenu(open) {
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('menu-open', open);
      menuOverlay.setAttribute('aria-hidden', open ? 'false' : 'true');
    }
    hamburger.addEventListener('click', function () {
      setMenu(hamburger.getAttribute('aria-expanded') !== 'true');
    });
    menuLinks.forEach(function (link) { link.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('menu-open')) { setMenu(false); hamburger.focus(); }
    });
  }

  /* 6. Project row keyboard + focus treatment (W16) */
  document.querySelectorAll('.project-row').forEach(function (row) {
    row.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        var link = row.querySelector('.project-arrow');
        if (link && link.href) { window.open(link.href, '_blank', 'noopener'); }
      }
    });
    row.addEventListener('focusin', function () { row.classList.add('is-focused'); });
    row.addEventListener('focusout', function () { row.classList.remove('is-focused'); });
  });

  /* 7. Smooth in-page anchor scroll (a11y-aware) */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (!id || id === '#' || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: prefersSmooth ? 'smooth' : 'auto', block: 'start' });
      if (target.id !== 'main') {
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      } else {
        target.focus({ preventScroll: true });
      }
      history.pushState(null, '', id);
    });
  });
  } // end init()

  // Launch after `load` — guarantees React hydration is done.
  if (document.readyState === 'complete') {
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(init);
    } else {
      setTimeout(init, 0);
    }
  } else {
    window.addEventListener('load', function () {
      if (typeof requestAnimationFrame === 'function') {
        requestAnimationFrame(init);
      } else {
        setTimeout(init, 0);
      }
    }, { once: true });
  }
})();
