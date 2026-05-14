/**
 * projects.js — React component for the projects grid
 * No build step required — uses React.createElement directly
 * Roshan Kumar Portfolio
 */
(function () {
  'use strict';
  if (typeof React === 'undefined' || typeof ReactDOM === 'undefined') return;

  const { createElement: h, Fragment } = React;

  /* ─ PROJECT DATA ─ */
  const PROJECTS = [
    {
      badge: { label: 'AI · Hackathon', type: 'ai' },
      name: 'AI Agent Shield',
      desc: 'Real-time behavioral firewall for rogue AI agents — built at an internal hackathon. Detects and neutralises anomalous agent behaviour in automated workflows using pattern analysis and real-time rule evaluation.',
      tags: ['AI Security', 'Behavioral Analysis', 'Firewall', 'Python'],
    },
    {
      badge: { label: 'Production', type: 'new' },
      name: 'Verizon Unicorn Rollout Monitoring',
      desc: 'End-to-end observability for a major Android/iOS partner launch — tracking 502 error waves, API latency spikes, and activation failures across US regions via Dynatrace DQL with real-time Slack status updates.',
      tags: ['Dynatrace', 'DQL', 'API Monitoring', 'Verizon'],
    },
    {
      badge: { label: 'P1 Incident', type: 'p1' },
      name: 'Kafka Storage — P1 Recovery',
      desc: 'Incident command for a critical Kafka cluster disk-full event that took down all dependent services in US West. Coordinated partner notifications, root cause isolation, storage remediation, and postmortem documentation.',
      tags: ['Kafka', 'Incident Management', 'Aiven', 'RCA'],
    },
    {
      badge: { label: 'Production', type: 'new' },
      name: 'SAC Observability Dashboard Suite',
      desc: 'Built and maintained a comprehensive Dynatrace dashboard suite spanning Doorman, Avenue, Platform, Identity, Deepfake Detection, and Scam Scanner services — covering four production regions with DQL entity queries.',
      tags: ['Dynatrace', 'DQL', 'Multi-Region', 'Dashboards'],
    },
    {
      badge: { label: 'Automation', type: 'auto' },
      name: 'Operations Automation Suite',
      desc: 'Built a suite of operational automations: Power Automate flows reading live shift rosters from SharePoint and posting tagged handover messages to Slack; Jira onboarding ticket automation; incident timeline cross-referencing between Slack and Jira custom fields; FSMI–Power Automate webhook integration creating auto war-room channels on incident creation.',
      tags: ['Power Automate', 'Jira', 'SharePoint', 'Slack API', 'Webhooks'],
    },
    {
      badge: { label: 'Production', type: 'new' },
      name: 'API Health Monitoring & Failure Analysis',
      desc: 'Investigated API health degradation patterns across production microservices — analysed token exhaustion cascades, retry loop failures, and legacy data validation issues. Built monitoring queries and dashboards to provide early warning signals and prevent future recurrence.',
      tags: ['API Monitoring', 'Root Cause Analysis', 'CloudWatch', 'Dynatrace'],
    },
    {
      badge: { label: 'Security', type: 'ai' },
      name: 'VAPT — Honda & Haldi Ram UK',
      desc: 'Vulnerability Assessment and Penetration Testing for two enterprise applications — identified critical security vulnerabilities with documented remediation roadmaps using Burp Suite, Nmap, and manual analysis.',
      tags: ['Pen Testing', 'Burp Suite', 'Nmap', 'CVE Analysis'],
    },
    {
      badge: { label: 'Production', type: 'new' },
      name: 'Server Monitoring — Zabbix',
      desc: 'Full production monitoring infrastructure with custom alert thresholds, client dashboards, and automated reporting for enterprise environments. Integrated with Grafana for visual trend analysis.',
      tags: ['Zabbix', 'Grafana', 'Linux', 'Alerting'],
    },
    {
      badge: { label: 'Enterprise', type: 'new' },
      name: 'SSO & Identity Management — Multi-App',
      desc: 'Designed and implemented enterprise Single Sign-On across multiple portals using SAML 2.0 — reducing authentication friction for thousands of enterprise users and improving cross-application security posture.',
      tags: ['SAML 2.0', 'SSO', 'AWS', 'IAM', 'Enterprise'],
    },
    {
      badge: { label: 'Tooling', type: 'auto' },
      name: 'Dynatrace MCP Server Integration',
      desc: 'Configured and debugged the Dynatrace MCP server on a restricted corporate Mac (no sudo) using npm mirror registry. Enabled live Claude-to-Dynatrace DQL query workflows for real-time production observability through AI-assisted tooling.',
      tags: ['MCP', 'Dynatrace', 'Node.js', 'AI Tooling'],
    },
    {
      badge: { label: 'CVE', type: 'p1' },
      name: 'Log4j Vulnerability — Fleet Remediation',
      desc: 'Identified Log4j CVE exposure across the entire production server fleet and implemented targeted security patches — ensuring full compliance and preventing exploitation at scale with zero downtime.',
      tags: ['CVE Patching', 'Security', 'Linux', 'Compliance'],
    },
    {
      badge: { label: 'Infrastructure', type: 'new' },
      name: 'Disaster Recovery Architecture',
      desc: 'Designed DR setup for production applications — RTO/RPO targets established, failover procedures documented, and tested in staging with full sign-off before production deployment.',
      tags: ['DR', 'AWS', 'High Availability', 'Failover'],
    },
  ];

  /* ─ PROJECT CARD COMPONENT ─ */
  function ProjectCard({ project, index }) {
    const { badge, name, desc, tags } = project;
    const num = String(index + 1).padStart(2, '0');

    const handleMouseMove = (e) => {
      const r = e.currentTarget.getBoundingClientRect();
      const px = ((e.clientX - r.left) / r.width  * 100).toFixed(1) + '%';
      const py = ((e.clientY - r.top)  / r.height * 100).toFixed(1) + '%';
      e.currentTarget.style.setProperty('--mx', px);
      e.currentTarget.style.setProperty('--my', py);
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      e.currentTarget.style.transform  = `rotateY(${x*10}deg) rotateX(${-y*10}deg) translateZ(8px) translateY(-4px)`;
      e.currentTarget.style.transition = 'none';
    };

    const handleMouseLeave = (e) => {
      e.currentTarget.style.transform  = '';
      e.currentTarget.style.transition = 'all .5s cubic-bezier(.16,1,.3,1)';
    };

    const handleMouseEnter = (e) => {
      e.currentTarget.style.transition = 'none';
    };

    return h('div', {
        className: 'pr-card gsap-project',
        onMouseMove:  handleMouseMove,
        onMouseLeave: handleMouseLeave,
        onMouseEnter: handleMouseEnter,
      },
      h('div', { className: 'pr-glow' }),
      badge && h('span', { className: `pr-badge ${badge.type}` }, badge.label),
      h('div', { className: 'pr-num' }, `// ${num}`),
      h('div', { className: 'pr-name' }, name),
      h('div', { className: 'pr-desc' }, desc),
      h('div', { className: 'pr-tags' },
        tags.map(t => h('span', { className: 'pr-tag', key: t }, t))
      )
    );
  }

  /* ─ PROJECTS GRID COMPONENT ─ */
  function ProjectsGrid() {
    return h('div', { className: 'pr-grid' },
      PROJECTS.map((p, i) => h(ProjectCard, { project: p, index: i, key: i }))
    );
  }

  /* ─ MOUNT ─ */
  const root = document.getElementById('projects-root');
  if (root) {
    ReactDOM.createRoot(root).render(h(ProjectsGrid));

    // Notify effects.js that cards are ready
    setTimeout(() => {
      document.dispatchEvent(new CustomEvent('projectsRendered'));

      // GSAP animate project cards if available
      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        const cards = root.querySelectorAll('.gsap-project');
        cards.forEach((card, i) => {
          gsap.fromTo(card,
            { opacity: 0, y: 36, rotateX: -8 },
            {
              opacity: 1, y: 0, rotateX: 0, duration: 0.75,
              ease: 'power3.out',
              delay: (i % 3) * 0.1,
              scrollTrigger: {
                trigger: card,
                start: 'top 88%',
                toggleActions: 'play none none none',
              },
            }
          );
        });
      }
    }, 80);
  }

})();
