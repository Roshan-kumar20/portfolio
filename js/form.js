/**
 * form.js — EmailJS contact form handler
 * Roshan Kumar Portfolio
 *
 * ─── SETUP INSTRUCTIONS ────────────────────────────────────
 * 1. Go to https://emailjs.com and create a FREE account
 * 2. Add a Gmail service  →  copy the Service ID
 * 3. Create an Email Template with these variables:
 *      {{from_name}}   {{from_email}}   {{message}}
 *    Set "To Email" as: roshan.kumar.contact@gmail.com
 * 4. Copy your Template ID and Public Key
 * 5. Replace the three placeholders below with your real values
 * ───────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   // ← replace
  const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // ← replace
  const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // ← replace

  const form       = document.getElementById('contactForm');
  const statusEl   = document.getElementById('formStatus');
  const btnText    = document.getElementById('btnText');
  const submitBtn  = form ? form.querySelector('button[type="submit"]') : null;

  if (!form) return;

  /* ─ INIT EmailJS ─ */
  if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }

  /* ─ HELPER ─ */
  function setStatus(msg, type) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.className   = 'form-status ' + type;
  }

  function setLoading(on) {
    if (!submitBtn || !btnText) return;
    submitBtn.disabled   = on;
    btnText.textContent  = on ? 'Transmitting…' : 'Transmit Message';
  }

  /* ─ SUBMIT HANDLER ─ */
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const name    = form.querySelector('[name="from_name"]').value.trim();
    const email   = form.querySelector('[name="from_email"]').value.trim();
    const message = form.querySelector('[name="message"]').value.trim();

    // Client-side validation
    if (!name || !email || !message) {
      setStatus('Please fill in all fields.', 'err');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('Please enter a valid email address.', 'err');
      return;
    }

    setLoading(true);
    setStatus('', '');

    // EmailJS not yet configured — fallback to mailto
    if (typeof emailjs === 'undefined' || EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
      const subject = encodeURIComponent('Portfolio Contact from ' + name);
      const body    = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      window.location.href = `mailto:roshan.kumar.contact@gmail.com?subject=${subject}&body=${body}`;
      setStatus('Opening your email client…', 'ok');
      setLoading(false);
      return;
    }

    try {
      await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form);
      setStatus('✓ Message transmitted successfully!', 'ok');
      form.reset();
    } catch (err) {
      console.error('EmailJS error:', err);
      setStatus('Transmission failed. Please email directly: roshan.kumar.contact@gmail.com', 'err');
    } finally {
      setLoading(false);
    }
  });

})();
