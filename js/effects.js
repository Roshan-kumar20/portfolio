/**
 * effects.js — Cursor, photo tilt, card tilt, project glow
 * Roshan Kumar Portfolio
 */
(function () {
  'use strict';

  /* ─ CUSTOM CURSOR ─ */
  const dot  = document.getElementById('curDot');
  const ring = document.getElementById('curRing');
  let cx = 0, cy = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => { cx = e.clientX; cy = e.clientY; });

  const hoverEls = 'a, button, .pr-card, .sk-card, .cert-card, .stat-card, .hs-card';
  document.querySelectorAll(hoverEls).forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hov'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hov'));
  });

  (function cursorLoop() {
    rx += (cx - rx) * 0.1;
    ry += (cy - ry) * 0.1;
    dot.style.left  = cx + 'px';
    dot.style.top   = cy + 'px';
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(cursorLoop);
  })();

  /* ─ PHOTO CARD 3D TILT ─ */
  const photo = document.getElementById('photoCard');
  if (photo) {
    photo.addEventListener('mousemove', function (e) {
      const r = this.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      this.style.transform    = `rotateY(${x * 22}deg) rotateX(${-y * 22}deg) translateZ(12px)`;
      this.style.boxShadow    = `${-x * 28}px ${-y * 18}px 60px rgba(0,0,0,.7),${-x*8}px ${-y*8}px 28px rgba(0,212,255,.14)`;
      this.style.transition   = 'none';
    });
    photo.addEventListener('mouseleave', function () {
      this.style.transform  = 'rotateY(-10deg) rotateX(5deg)';
      this.style.boxShadow  = '20px 20px 60px rgba(0,0,0,.6),0 0 40px rgba(0,212,255,.07)';
      this.style.transition = 'transform .6s cubic-bezier(.16,1,.3,1), box-shadow .6s';
    });
  }

  /* ─ SKILL CARD 3D TILT ─ */
  function addTilt(selector, maxAngle) {
    document.querySelectorAll(selector).forEach(card => {
      card.addEventListener('mousemove', function (e) {
        const r = this.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - 0.5;
        const y = (e.clientY - r.top)  / r.height - 0.5;
        this.style.transform  = `rotateY(${x * maxAngle}deg) rotateX(${-y * maxAngle}deg) translateZ(10px)`;
        this.style.transition = 'none';
      });
      card.addEventListener('mouseleave', function () {
        this.style.transform  = '';
        this.style.transition = 'all .5s cubic-bezier(.16,1,.3,1)';
      });
    });
  }
  addTilt('.sk-card', 12);

  /* ─ PROJECT CARD TILT + RADIAL GLOW ─ */
  function initProjectCards() {
    document.querySelectorAll('.pr-card').forEach(card => {
      card.addEventListener('mousemove', function (e) {
        const r = this.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - 0.5;
        const y = (e.clientY - r.top)  / r.height - 0.5;
        this.style.transform  = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(8px) translateY(-4px)`;
        this.style.transition = 'none';
        this.style.setProperty('--mx', ((e.clientX - r.left) / r.width  * 100) + '%');
        this.style.setProperty('--my', ((e.clientY - r.top)  / r.height * 100) + '%');
      });
      card.addEventListener('mouseleave', function () {
        this.style.transform  = '';
        this.style.transition = 'all .5s cubic-bezier(.16,1,.3,1)';
      });
      card.addEventListener('mouseenter', function () {
        this.style.transition = 'none';
      });
    });
  }

  // React renders project cards asynchronously; re-init after mount
  window.initProjectTilt = initProjectCards;
  document.addEventListener('projectsRendered', initProjectCards);

})();
