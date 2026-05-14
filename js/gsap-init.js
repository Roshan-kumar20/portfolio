/**
 * gsap-init.js — GSAP ScrollTrigger + reliable counters
 * Roshan Kumar Portfolio
 */
(function () {
  'use strict';

  /* ─ RELIABLE COUNTER (pure RAF, no GSAP dependency) ─ */
  function animateCounter(el) {
    if (el.dataset.done) return;
    el.dataset.done = '1';
    const target = parseInt(el.dataset.target, 10);
    const duration = 1600;
    const startTime = performance.now();
    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + '+';
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // Use IntersectionObserver — works even when elements start in viewport
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) animateCounter(e.target); });
  }, { threshold: 0.3 });

  // Run immediately after DOM is ready
  function initCounters() {
    document.querySelectorAll('[data-target]').forEach(el => {
      // If already visible on page load, start immediately
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        setTimeout(() => animateCounter(el), 400);
      } else {
        counterObs.observe(el);
      }
    });
  }

  /* ─ AVATAR ENTRANCE ─ */
  function initAvatar() {
    const av = document.getElementById('rkAvatar');
    if (!av) return;
    av.style.opacity = '0';
    av.style.transform = 'translate(-50%, -50%) scale(0.6)';
    av.style.transition = 'opacity 1s 1.8s ease, transform 1s 1.8s cubic-bezier(.16,1,.3,1)';
    setTimeout(() => {
      av.style.opacity = '1';
      av.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 100);
  }

  /* ─ GSAP SETUP ─ */
  function initGSAP() {
    if (typeof gsap === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    /* HERO TIMELINE */
    const heroTL = gsap.timeline({ delay: 0.1 });
    heroTL
      .to('.hero-sys',              { opacity:1, y:0, duration:.55, ease:'power2.out' })
      .to('.hero-name-row:first-child', { opacity:1, y:0, rotateX:0, duration:.85, ease:'power3.out' }, '-=0.1')
      .to('.hero-name-row.accent',  { opacity:1, y:0, rotateX:0, duration:.85, ease:'power3.out' }, '-=0.55')
      .to('.hero-divider',          { width:'100%', duration:.9, ease:'power2.inOut' }, '-=0.4')
      .to('.hero-meta',             { opacity:1, y:0, duration:.55, ease:'power2.out' }, '-=0.3')
      .to('.hero-desc',             { opacity:1, y:0, duration:.55, ease:'power2.out' }, '-=0.25')
      .to('.hero-btns',             { opacity:1, y:0, duration:.55, ease:'power2.out' }, '-=0.2');

    gsap.to('.hs-card', { opacity:1, x:0, duration:.55, ease:'power2.out', stagger:.12, delay:1.5 });

    /* NAV SCROLL */
    const nav = document.getElementById('mainNav');
    if (nav) {
      ScrollTrigger.create({
        start: 'top -60px', end: 99999,
        toggleClass: { targets: nav, className: 'sc' },
      });
    }

    /* ACTIVE NAV */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.n-links a');
    sections.forEach(sec => {
      ScrollTrigger.create({
        trigger: sec, start: 'top center', end: 'bottom center',
        onEnter:     () => updateNav(sec.id),
        onEnterBack: () => updateNav(sec.id),
      });
    });
    function updateNav(id) {
      navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
    }

    /* GENERIC REVEALS */
    document.querySelectorAll('.gsap-fade').forEach(el => {
      const delay = parseFloat(getComputedStyle(el).getPropertyValue('--delay')) || 0;
      gsap.fromTo(el,
        { opacity:0, y:28 },
        { opacity:1, y:0, duration:.8, ease:'power3.out', delay,
          scrollTrigger:{ trigger:el, start:'top 90%', toggleActions:'play none none none' } }
      );
    });

    document.querySelectorAll('.gsap-left').forEach(el => {
      const delay = parseFloat(getComputedStyle(el).getPropertyValue('--delay')) || 0;
      gsap.fromTo(el,
        { opacity:0, x:-35 },
        { opacity:1, x:0, duration:.9, ease:'power3.out', delay,
          scrollTrigger:{ trigger:el, start:'top 90%', toggleActions:'play none none none' } }
      );
    });

    document.querySelectorAll('.gsap-line').forEach(el => {
      gsap.fromTo(el, { width:0 },
        { width:'100%', duration:1.1, ease:'power2.inOut',
          scrollTrigger:{ trigger:el, start:'top 90%', toggleActions:'play none none none' } }
      );
    });

    /* SKILLS STAGGER */
    ScrollTrigger.create({
      trigger:'.skills-grid', start:'top 88%', once:true,
      onEnter() {
        gsap.fromTo('.sk-card', { opacity:0, y:30 },
          { opacity:1, y:0, duration:.7, ease:'power3.out', stagger:.08 });
      },
    });

    /* CERT STAGGER */
    ScrollTrigger.create({
      trigger:'.cert-grid', start:'top 88%', once:true,
      onEnter() {
        gsap.fromTo('.cert-card', { opacity:0, y:24 },
          { opacity:1, y:0, duration:.65, ease:'power3.out', stagger:.1 });
      },
    });

    /* HERO PARALLAX */
    gsap.to('.hero-name-block', {
      y: -50, ease:'none',
      scrollTrigger:{ trigger:'#hero', start:'top top', end:'bottom top', scrub:true },
    });

    /* STATUS PANEL FLOAT */
    gsap.to('.hs-card', {
      y:-6, duration:2.8, ease:'sine.inOut', yoyo:true, repeat:-1, stagger:.4, delay:2,
    });

    /* MARQUEE PAUSE ON HOVER */
    document.querySelectorAll('.sk-marquee-track').forEach(track => {
      track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
      track.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
    });
  }

  /* ─ INIT SEQUENCE ─ */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { initCounters(); initAvatar(); });
  } else {
    initCounters(); initAvatar();
  }

  // GSAP may load after DOMContentLoaded due to defer
  window.addEventListener('load', initGSAP);

})();
