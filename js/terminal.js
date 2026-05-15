/**
 * terminal.js — Animated typing terminal for About section
 * Roshan Kumar Portfolio
 */
(function () {
  'use strict';

  const body = document.getElementById('termBody');
  if (!body) return;

  /* ── SCRIPT ── each entry: [type, text, delay_after] */
  const SCRIPT = [
    ['prompt', 'whoami',                                    380],
    ['out',    'roshan.kumar  //  ops-engineer',            220],
    ['blank',  '',                                          180],
    ['prompt', 'cat profile.json',                          420],
    ['sep',    '─'.repeat(42),                             80],
    ['kv',     'name',        'Roshan Kumar',               90],
    ['kv',     'role',        'Cloud & Operations Engineer',90],
    ['kv',     'location',    'Bengaluru, India',           90],
    ['kv',     'experience',  '4+ years',                  90],
    ['kv',     'status',      '● open to roles',           120],
    ['sep',    '─'.repeat(42),                             180],
    ['blank',  '',                                          160],
    ['prompt', 'ls ./skills/',                              400],
    ['out',    'cloud/    devops/    monitoring/',          60],
    ['out',    'support/  networking/ automation/',        220],
    ['blank',  '',                                          160],
    ['prompt', 'cat ./skills/cloud',                        380],
    ['ok',     '✓ AWS  ✓ GCP  ✓ EC2  ✓ VPC  ✓ IAM',       60],
    ['ok',     '✓ CloudFormation  ✓ Kafka  ✓ Multi-Region',220],
    ['blank',  '',                                          140],
    ['prompt', 'cat ./skills/monitoring',                   380],
    ['ok',     '✓ Dynatrace  ✓ DQL  ✓ CloudWatch',         60],
    ['ok',     '✓ Grafana  ✓ Prometheus  ✓ ELK Stack',     220],
    ['blank',  '',                                          140],
    ['prompt', 'cat ./skills/devops',                       380],
    ['ok',     '✓ Jenkins  ✓ Docker  ✓ Terraform  ✓ Git',  60],
    ['ok',     '✓ GitLab CI/CD  ✓ SonarQube  ✓ Maven',    220],
    ['blank',  '',                                          140],
    ['prompt', 'cat ./skills/support',                      380],
    ['ok',     '✓ L2/L3 Escalation  ✓ Incident.io',        60],
    ['ok',     '✓ OpsGenie  ✓ RCA  ✓ SLA Management',      60],
    ['ok',     '✓ ServiceNow  ✓ Jira  ✓ On-Call Ops',     220],
    ['blank',  '',                                          140],
    ['prompt', 'cat ./skills/ai',                           380],
    ['ok',     '✓ Claude AI  ✓ MCP Protocol  ✓ LLM Tooling',60],
    ['ok',     '✓ AI Agent Design  ✓ Prompt Engineering',   60],
    ['ok',     '✓ AI Workflow Automation  ✓ DQL + AI',      220],
    ['blank',  '',                                          140],
    ['prompt', 'cat ./projects/ai-agent-shield.txt',        380],
    ['warn',   '▶ F-Secure Hackathon 2025',                 60],
    ['out',    '  Real-time behavioral firewall',           60],
    ['out',    '  for rogue AI agents in production',       60],
    ['out',    '  Status: selected for product eval',       220],
    ['blank',  '',                                          140],
    ['prompt', 'cat ./certifications.txt',                  380],
    ['warn',   '★ CEH v11 — EC-Council',                   80],
    ['warn',   '★ Cloud DevOps — Intellipaat',             80],
    ['warn',   '★ AWS SA Associate — In Progress',        220],
    ['blank',  '',                                          160],
    ['prompt', 'uptime',                                    380],
    ['out',    '4 years 3 months  |  0 critical failures',200],
    ['blank',  '',                                          160],
    ['prompt', 'ping roshan.kumar.contact@gmail.com',       500],
    ['ok',     'PING success — I respond within 24hrs 🚀', 9999],
  ];

  /* ── STATE ── */
  let lineIdx   = 0;
  let charIdx   = 0;
  let cursorEl  = null;
  let cancelled = false;

  /* ── HELPERS ── */
  function makeSpan(cls, text='') {
    const s = document.createElement('span');
    s.className = 'tl ' + cls;
    s.textContent = text;
    return s;
  }

  function appendCursor() {
    removeCursor();
    cursorEl = document.createElement('span');
    cursorEl.className = 'cursor';
    body.appendChild(cursorEl);
    body.scrollTop = body.scrollHeight;
  }

  function removeCursor() {
    if (cursorEl && cursorEl.parentNode) cursorEl.parentNode.removeChild(cursorEl);
    cursorEl = null;
  }

  /* ── TYPE a single character into a span ── */
  function typeInto(span, text, speed, done) {
    if (charIdx >= text.length) { charIdx = 0; done(); return; }
    span.textContent = text.slice(0, charIdx + 1);
    removeCursor();
    body.appendChild(cursorEl = (() => { const c=document.createElement('span'); c.className='cursor'; return c; })());
    body.scrollTop = body.scrollHeight;
    charIdx++;
    setTimeout(() => typeInto(span, text, speed, done), speed + (Math.random() * 18 - 9));
  }

  /* ── RENDER a line instantly ── */
  function instantLine(entry) {
    const [type, text] = entry;
    if (type === 'blank') { body.appendChild(makeSpan('tl-blank')); return; }
    if (type === 'sep')   { body.appendChild(makeSpan('tl tl-sep', text)); return; }
    if (type === 'kv') {
      const s = makeSpan('tl tl-out');
      s.innerHTML = `<span class="tl-key">${text}</span><span class="tl-dim">: </span><span class="tl-val">${entry[2]}</span>`;
      body.appendChild(s);
      return;
    }
    const map = { prompt:'tl-prompt', out:'tl-out', ok:'tl-ok', warn:'tl-warn' };
    body.appendChild(makeSpan('tl ' + (map[type]||'tl-out'), text));
  }

  /* ── NEXT LINE ── */
  function next() {
    if (cancelled || lineIdx >= SCRIPT.length) { appendCursor(); return; }

    const entry = SCRIPT[lineIdx];
    const [type, text, delay] = entry;
    lineIdx++;

    if (type === 'blank') {
      body.appendChild(makeSpan('tl-blank'));
      body.scrollTop = body.scrollHeight;
      setTimeout(next, delay || 80);
      return;
    }
    if (type === 'sep') {
      body.appendChild(makeSpan('tl tl-sep', text));
      body.scrollTop = body.scrollHeight;
      setTimeout(next, delay || 80);
      return;
    }
    if (type === 'kv') {
      const s = makeSpan('tl tl-out');
      s.innerHTML = `<span class="tl-key">${text}</span><span class="tl-dim">: </span><span class="tl-val">${entry[2]}</span>`;
      body.appendChild(s);
      body.scrollTop = body.scrollHeight;
      setTimeout(next, entry[3] || delay || 90);
      return;
    }

    const classMap = { prompt:'tl tl-prompt', out:'tl tl-out', ok:'tl tl-ok', warn:'tl tl-warn' };
    const span = makeSpan(classMap[type] || 'tl tl-out');
    body.appendChild(span);
    charIdx = 0;

    const speed = type === 'prompt' ? 55 : 12;
    typeInto(span, text, speed, () => {
      removeCursor();
      body.scrollTop = body.scrollHeight;
      setTimeout(next, delay || 200);
    });
  }

  /* ── RESTART loop ── */
  function restart() {
    body.innerHTML = '';
    lineIdx = 0; charIdx = 0; cursorEl = null;
    setTimeout(next, 800);
  }

  /* ── START when section visible ── */
  let started = false;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !started) {
        started = true;
        setTimeout(next, 600);
      }
    });
  }, { threshold: 0.3 });

  const wrap = document.querySelector('.terminal-wrap');
  if (wrap) obs.observe(wrap);

  /* ── CLICK to replay ── */
  document.querySelector('.terminal')?.addEventListener('click', () => {
    cancelled = false;
    restart();
  });

  /* ── PAUSE on hover ── */
  document.querySelector('.terminal')?.addEventListener('mouseenter', () => { cancelled = true; });
  document.querySelector('.terminal')?.addEventListener('mouseleave', () => {
    if (lineIdx < SCRIPT.length) { cancelled = false; next(); }
  });

})();
