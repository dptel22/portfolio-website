document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  function splitChars(el) {
    const text = el.textContent;
    el.innerHTML = text.split('').map(c =>
      `<span class="char" style="display:inline-block">${c === ' ' ? '&nbsp;' : c}</span>`
    ).join('');
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('h1 .word').forEach(splitChars);

  if (!reduceMotion) {
    const tl = gsap.timeline();
    tl.fromTo("nav", { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })
      .fromTo(".hero-label", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, 0.3)
      .fromTo("h1 .word:first-child .char",
        { clipPath: "inset(100% 0 0 0)" },
        { clipPath: "inset(0% 0 0 0)", stagger: 0.04, duration: 0.7, ease: "power4.out" }, 0.5)
      .fromTo("h1 .word:last-child .char",
        { clipPath: "inset(100% 0 0 0)" },
        { clipPath: "inset(0% 0 0 0)", stagger: 0.04, duration: 0.7, ease: "power4.out" }, 0.8)
      .fromTo(".tagline", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, 1.2)
      .fromTo(".hero-buttons a", { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.1 }, 1.5)
      .to(".scroll-indicator", { y: 8, repeat: -1, yoyo: true, duration: 1.2, ease: "sine.inOut" }, 1.8);

    gsap.utils.toArray("section h2").forEach(h2 => {
      gsap.fromTo(h2,
        { clipPath: "inset(100% 0 0 0)" },
        { clipPath: "inset(0% 0 0 0)", scrollTrigger: { trigger: h2, start: "top 80%" }, duration: 0.8, ease: "power4.out", onComplete: () => h2.style.willChange = 'auto' }
      );
    });

    gsap.utils.toArray("section p, .about-left p").forEach(p => {
      if(!p.classList.contains("tagline") && !p.closest(".project-card")) {
        gsap.fromTo(p, { opacity: 0, y: 40 },
          { opacity: 1, y: 0, scrollTrigger: { trigger: p, start: "top 85%" }, duration: 0.7, onComplete: () => p.style.willChange = 'auto' }
        );
      }
    });

    gsap.fromTo(".project-card", { opacity: 0, y: 60 }, {
      opacity: 1, y: 0,
      stagger: 0.1,
      scrollTrigger: { trigger: "#projects .grid", start: "top 80%" },
      onComplete: function() { this.targets().forEach(t => t.style.willChange = 'auto'); }
    });

    gsap.fromTo(".skill-tag", { opacity: 0, scale: 0.9 }, {
      opacity: 1, scale: 1,
      stagger: 0.05,
      scrollTrigger: { trigger: ".skill-tags", start: "top 80%" },
      onComplete: function() { this.targets().forEach(t => t.style.willChange = 'auto'); }
    });

    gsap.fromTo(".timeline-entry", { opacity: 0, x: -30 }, {
      opacity: 1, x: 0,
      stagger: 0.15,
      scrollTrigger: { trigger: ".timeline", start: "top 80%" },
      onComplete: function() { this.targets().forEach(t => t.style.willChange = 'auto'); }
    });
  }

  const customCursor = !window.matchMedia('(hover: none)').matches;
  if(customCursor && !reduceMotion) {
    const cursor = document.createElement("div");
    cursor.id = "cursor";
    cursor.setAttribute("aria-hidden", "true");

    const follower = document.createElement("div");
    follower.id = "cursor-follower";
    follower.setAttribute("aria-hidden", "true");

    document.body.appendChild(cursor);
    document.body.appendChild(follower);

    cursor.style.cssText = "position:fixed;top:0;left:0;width:12px;height:12px;background:var(--accent);border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%, -50%);";
    follower.style.cssText = "position:fixed;top:0;left:0;width:40px;height:40px;border:1px solid var(--accent);border-radius:50%;pointer-events:none;z-index:9998;transform:translate(-50%, -50%);will-change:transform;";

    let mouseX = 0, mouseY = 0;
    window.addEventListener("mousemove", e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.set(cursor, { x: mouseX, y: mouseY });
      gsap.to(follower, { x: mouseX, y: mouseY, duration: 0.12, ease: "power2.out" });
    });

    document.querySelectorAll("a, button").forEach(el => {
      el.addEventListener("mouseenter", () => {
        gsap.to(follower, { scale: 2.5, duration: 0.2 });
        gsap.to(cursor, { opacity: 0, duration: 0.2 });
      });
      el.addEventListener("mouseleave", () => {
        gsap.to(follower, { scale: 1, duration: 0.2 });
        gsap.to(cursor, { opacity: 1, duration: 0.2 });
      });
    });
  }

  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 80);
  });

  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-links a:not(.btn-outline)');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting && entry.intersectionRatio > 0.5) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if(link.getAttribute('href').substring(1) === entry.target.id) {
            link.classList.add('active');
            link.style.color = "var(--accent)";
          } else {
            link.style.color = "";
          }
        });
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(sec => observer.observe(sec));

  const backToTop = document.createElement("button");
  backToTop.innerHTML = "&uarr;";
  backToTop.setAttribute("aria-label", "Back to top");
  backToTop.style.cssText = "position:fixed;bottom:2rem;right:2rem;width:44px;height:44px;border:1px solid var(--border);background:transparent;color:var(--text-muted);cursor:pointer;opacity:0;pointer-events:none;transition:opacity 0.3s;z-index:90;border-radius:0;";
  document.body.appendChild(backToTop);

  window.addEventListener('scroll', () => {
    if(window.scrollY > 400 && window.innerWidth > 768) {
      backToTop.style.opacity = '1';
      backToTop.style.pointerEvents = 'auto';
    } else {
      backToTop.style.opacity = '0';
      backToTop.style.pointerEvents = 'none';
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navLinksContainer = document.querySelector('.nav-links');
  if(mobileBtn) {
    mobileBtn.addEventListener('click', () => {
      const active = navLinksContainer.classList.toggle('active');
      mobileBtn.setAttribute('aria-expanded', active);
    });
  }
});
