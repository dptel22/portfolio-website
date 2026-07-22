/* ============================================================
   Dhruv Patel — Portfolio · GSAP motion system (Loop 2)
   ------------------------------------------------------------
   Vanilla JS + GSAP 3.12 + ScrollTrigger. Fully gated by
   prefers-reduced-motion. Loaded AFTER main.js so the core UX
   (cursor, menu, reveal, nav) works with or without GSAP.

   Architecture decision: CSS owns the hero entrance (Loop 1
   keyframes are already premium). GSAP owns scroll-driven and
   interaction animations where CSS genuinely cannot compete:
     1. Scrubbed parallax on section labels — depth on scroll.
     2. Rich reveal — y-drift on top of CSS opacity (coordinated).
     3. Project metric chips — staggered entrance per row.
     4. Magnetic CTAs — physics-based micro-interaction.
     5. Project-row hover lift — coordinated with CSS hover.
     6. Contact headline split-text mask reveal on scroll.

   GSAP is gated on the `load` event (not DOMContentLoaded) so
   React hydration completes before any inline-style mutation.
   This eliminates hydration-mismatch warnings in the Next.js
   SSR host. The ~100ms delay reads as intentional settling.
   ============================================================ */
(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return; // CSS reveal (Loop 1) handles reduced-motion users.

  function whenReady(cb) {
    function tryStart() {
      if (window.gsap && window.ScrollTrigger) { cb(); return true; }
      return false;
    }
    if (tryStart()) return;
    var tries = 0;
    var iv = setInterval(function () {
      tries++;
      if (tryStart()) { clearInterval(iv); }
      else if (tries > 80) { clearInterval(iv); } // ~4s, give up silently
    }, 50);
  }

  function start() {
    function launch() {
      // Double-defer: load event + rAF ensures React hydration is 100% done
      // before any inline-style mutation. This is the critical fix for the
      // Next.js SSR hydration-mismatch warning.
      if (typeof requestAnimationFrame === 'function') {
        requestAnimationFrame(function () { whenReady(init); });
      } else {
        setTimeout(function () { whenReady(init); }, 0);
      }
    }
    if (document.readyState === 'complete') { launch(); }
    else { window.addEventListener('load', launch, { once: true }); }
  }

  start();

  function init() {
    var gsap = window.gsap;
    var ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    var finePointer = window.matchMedia('(pointer: fine)').matches;

    /* ----------------------------------------------------------
       1. Scrubbed parallax on section labels (subtle depth).
          Desktop + fine-pointer only — avoids touch scroll quirks.
       ---------------------------------------------------------- */
    if (finePointer) {
      document.querySelectorAll('section .label').forEach(function (label) {
        gsap.fromTo(
          label,
          { y: -16 },
          {
            y: 16,
            ease: 'none',
            scrollTrigger: {
              trigger: label.closest('section'),
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.6,
            },
          }
        );
      });
    }

    /* ----------------------------------------------------------
       2. Rich reveal — GSAP y-drift on top of CSS opacity.
          CSS reveal (main.js IntersectionObserver) owns .visible
          + opacity. GSAP adds a richer y-easing and ensures
          .visible is added via onEnter. Uses gsap.to() from the
          CSS initial state (no client-side `from` mutation) to
          avoid hydration mismatches in the Next.js SSR host.
       ---------------------------------------------------------- */
    gsap.utils.toArray('.reveal').forEach(function (el) {
      if (el.closest('#hero')) return; // hero handled by CSS keyframes
      gsap.to(
        el,
        {
          y: 0,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            once: true,
            onEnter: function () { el.classList.add('visible'); },
          },
        }
      );
    });

    /* ----------------------------------------------------------
       3. Project metric chips — staggered y-drift on row enter.
          CSS sets initial y via .metric transform; gsap.to() animates to 0.
       ---------------------------------------------------------- */
    document.querySelectorAll('.project-row').forEach(function (row) {
      var metrics = row.querySelectorAll('.metric');
      gsap.to(
        metrics,
        {
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
          stagger: 0.08,
          scrollTrigger: { trigger: row, start: 'top 80%', once: true },
        }
      );
    });

    /* ----------------------------------------------------------
       4. Magnetic CTAs — physics-based micro-interaction.
          Desktop + fine-pointer only.
       ---------------------------------------------------------- */
    if (finePointer) {
      document.querySelectorAll('[data-magnetic]').forEach(function (el) {
        var strength = 0.35;
        el.addEventListener('mousemove', function (e) {
          var rect = el.getBoundingClientRect();
          var x = (e.clientX - (rect.left + rect.width / 2)) * strength;
          var y = (e.clientY - (rect.top + rect.height / 2)) * strength;
          gsap.to(el, { x: x, y: y, duration: 0.4, ease: 'power2.out' });
        });
        el.addEventListener('mouseleave', function () {
          gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
        });
      });
    }

    /* ----------------------------------------------------------
       5. Project-row hover lift — coordinated with CSS hover.
       ---------------------------------------------------------- */
    if (finePointer) {
      document.querySelectorAll('.project-row').forEach(function (row) {
        var title = row.querySelector('.project-title');
        var arrow = row.querySelector('.project-arrow');
        row.addEventListener('mouseenter', function () {
          if (title) gsap.to(title, { x: 6, duration: 0.4, ease: 'power3.out' });
          if (arrow) gsap.to(arrow, { x: 6, duration: 0.4, ease: 'power3.out' });
        });
        row.addEventListener('mouseleave', function () {
          if (title) gsap.to(title, { x: 0, duration: 0.5, ease: 'power3.out' });
          if (arrow) gsap.to(arrow, { x: 0, duration: 0.5, ease: 'power3.out' });
        });
      });
    }

    /* ----------------------------------------------------------
       6. Contact headline split-text mask reveal on scroll.
          Purposeful split-text: the headline reveals char-by-char
          as it enters the viewport. Initial hidden state is in CSS
          (.char opacity:0, translateY(110%)). GSAP uses gsap.to() to
          animate to visible — no client-side `from` mutation, so no
          hydration mismatch. Adds .is-revealed as a CSS fallback.
       ---------------------------------------------------------- */
    var headline = document.querySelector('[data-split-chars]');
    if (headline && headline.querySelectorAll('.char').length) {
      var allChars = document.querySelectorAll('[data-split-chars] .char');
      gsap.to(
        allChars,
        {
          y: '0%',
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.025,
          scrollTrigger: {
            trigger: headline,
            start: 'top 85%',
            once: true,
            onEnter: function () {
              document.querySelectorAll('[data-split-chars]').forEach(function (c) {
                c.classList.add('is-revealed');
              });
            },
          },
        }
      );
    }

    /* ----------------------------------------------------------
       7. Refresh ScrollTrigger after fonts load (prevents
          position drift when webfonts swap).
       ---------------------------------------------------------- */
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
    }
  }
})();
