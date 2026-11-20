/* Personal portfolio — interactions. No third-party scripts; all content is static text in this file. */
window.__siteReady = true;
(function () {
  'use strict';
  var root = document.documentElement;
  var REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FINE = matchMedia('(pointer: fine)').matches;
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var ICONS = window.ICONS || {};
  function onView(el, fn, opts) {
    if (!el) return;
    new IntersectionObserver(function (es) { es.forEach(function (e) { fn(e.isIntersecting, e); }); }, opts || { threshold: 0.2 }).observe(el);
  }
  function svgIcon(slug) {
    var ic = ICONS[slug]; if (!ic) return '';
    var stroke = slug === 'etl' || slug === 'cicd';
    return '<svg viewBox="0 0 24 24" aria-hidden="true"' + (stroke ? ' class="stroke"' : '') + '><path d="' + ic.d + '"/></svg>';
  }
  function brand(slug) { var ic = ICONS[slug]; if (!ic) return 'var(--em)'; return ic.c === '#ffffff' ? 'var(--ink)' : ic.c; }

  // Start entrance animations on the next frame; the timer covers background tabs where frames are paused.
  var markReady = function () { root.classList.add('ready'); };
  requestAnimationFrame(markReady); setTimeout(markReady, 120);

  /* ---------- Theme ---------- */
  var themeBtn = $('#themeBtn');
  function currentTheme() { return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark'; }
  function syncThemeBtn() { themeBtn.setAttribute('aria-label', currentTheme() === 'light' ? 'Switch to dark theme' : 'Switch to light theme'); }
  themeBtn.addEventListener('click', function () {
    var next = currentTheme() === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    syncThemeBtn();
  });
  syncThemeBtn();

  /* ---------- Toast ---------- */
  var toast = $('#toast'), toastT;
  function showToast(msg) { toast.textContent = msg; toast.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(function () { toast.classList.remove('show'); }, 2200); }

  /* ---------- Nav, progress, scroll-spy, menu ---------- */
  var nav = $('#nav'), progress = $('#progress');
  function onScroll() {
    nav.classList.toggle('scrolled', scrollY > 30);
    var h = root.scrollHeight - innerHeight;
    progress.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, scrollY / h) : 0) + ')';
    updateTimeline();
  }
  var links = $$('.nav-links a[href^="#"]:not(.nav-cta)');
  var spy = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id); }); });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['about', 'services', 'projects', 'journey', 'skills'].forEach(function (id) { var s = document.getElementById(id); if (s) spy.observe(s); });
  var menuBtn = $('#menuBtn'), navLinks = $('#navLinks');
  function setMenu(open) { navLinks.classList.toggle('open', open); menuBtn.setAttribute('aria-expanded', String(open)); menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); }
  menuBtn.addEventListener('click', function () { setMenu(!navLinks.classList.contains('open')); });
  navLinks.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Hero network canvas (reacts to the cursor) ---------- */
  (function () {
    var cv = $('#net'); if (!cv || !cv.getContext) return;
    var ctx = cv.getContext('2d'), W = 0, H = 0, dpr = Math.min(devicePixelRatio || 1, 2), pts = [], mouse = { x: -9999, y: -9999 }, running = false, raf = 0;
    function color(v, a) { return 'rgba(' + getComputedStyle(root).getPropertyValue(v).trim() + ',' + a + ')'; }
    function size() {
      var r = cv.getBoundingClientRect(); W = r.width; H = r.height;
      cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(Math.min(90, Math.max(32, W * H / 16000)));
      pts = []; for (var i = 0; i < n; i++) pts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35 });
    }
    function draw(move) {
      ctx.clearRect(0, 0, W, H);
      var base = color('--net', 1).replace(',1)', ''), hi = color('--net-hi', 1).replace(',1)', '');
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        if (move) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > W) p.vx *= -1;
          if (p.y < 0 || p.y > H) p.vy *= -1;
          var mdx = p.x - mouse.x, mdy = p.y - mouse.y, md = Math.sqrt(mdx * mdx + mdy * mdy);
          if (md < 120 && md > 0) { p.x += mdx / md * 0.9; p.y += mdy / md * 0.9; }
        }
        for (var j = i + 1; j < pts.length; j++) {
          var q = pts[j], dx = p.x - q.x, dy = p.y - q.y, d = dx * dx + dy * dy;
          if (d < 15000) { ctx.strokeStyle = base + ',' + (0.16 * (1 - d / 15000)) + ')'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
        }
        var cdx = p.x - mouse.x, cdy = p.y - mouse.y, cd = cdx * cdx + cdy * cdy;
        if (cd < 32000) { ctx.strokeStyle = hi + ',' + (0.55 * (1 - cd / 32000)) + ')'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke(); }
        ctx.fillStyle = cd < 32000 ? hi + ',.9)' : base + ',.45)';
        ctx.beginPath(); ctx.arc(p.x, p.y, cd < 32000 ? 2.4 : 1.6, 0, Math.PI * 2); ctx.fill();
      }
    }
    function loop() { if (!running) { raf = 0; return; } draw(true); raf = requestAnimationFrame(loop); }
    size(); draw(false);
    addEventListener('resize', function () { size(); draw(false); });
    new MutationObserver(function () { if (!running) draw(false); }).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    if (REDUCE) return;
    var hero = $('.hero');
    hero.addEventListener('pointermove', function (e) { var r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
    hero.addEventListener('pointerleave', function () { mouse.x = mouse.y = -9999; });
    onView(hero, function (v) { running = v && !document.hidden; if (running && !raf) raf = requestAnimationFrame(loop); }, { threshold: 0 });
    document.addEventListener('visibilitychange', function () { running = !document.hidden && hero.getBoundingClientRect().bottom > 0; if (running && !raf) raf = requestAnimationFrame(loop); });
  })();

  /* ---------- Rotating role ---------- */
  (function () {
    var el = $('#roleText'), roles = ['Software Engineer', 'Fintech Builder', 'Applied AI Engineer', 'Full-Stack Developer', 'Data & Automation Nerd'];
    if (REDUCE) return;
    var i = 0, ch = roles[0].length, del = true;
    setTimeout(function tick() {
      var w = roles[i];
      if (del) { ch--; if (ch <= 0) { del = false; i = (i + 1) % roles.length; } }
      else { ch++; if (ch >= roles[i].length) { del = true; el.textContent = roles[i]; return setTimeout(tick, 2200); } }
      el.textContent = roles[i].slice(0, Math.max(0, ch)) || ' ';
      setTimeout(tick, del ? 35 : 70);
    }, 2400);
  })();

  /* ---------- Terminal ---------- */
  (function () {
    var body = $('#termBody'), form = $('#termForm'), input = $('#termIn');
    var CMDS = {
      help: 'Commands: <b>about</b> · <b>skills</b> · <b>projects</b> · <b>experience</b> · <b>education</b> · <b>contact</b> · <b>resume</b> · <b>theme</b> · <b>clear</b>',
      about: 'Software engineer in New York with 5+ years in fintech.\nI build secure platforms, AI assistants and automation for finance teams.',
      skills: 'frontend → React, TypeScript\nbackend  → C#, ASP.NET Core, REST APIs\ndata     → SQL Server, Python, PySpark\nai       → Claude Code, Claude Skills, MCP, OpenAI, RAG\ncloud    → Azure, Docker, CI/CD',
      projects: 'investment-platform/   data-hub/   mcp-assistant/\ndocument-to-data/   ci-cd/   teams-bots/\nxray-cnn/   resume-matcher/\n→ scroll to <a href="#projects">Projects</a> for details',
      experience: '2025–now  Software Engineer, Investment Technology\n2021–2023 Senior Software Engineer, Odessa\n2020–2021 Business Analyst, Odessa',
      education: 'M.P.S. Data Science — UMBC (GPA 3.97)\nB.Tech Computer Science — LPU',
      contact: 'email    → <a href="mailto:sunkara.jagadeesh11@gmail.com">sunkara.jagadeesh11@gmail.com</a>\nlinkedin → <a href="https://www.linkedin.com/in/jagadeesh-sunkara/" target="_blank" rel="noopener noreferrer">jagadeesh-sunkara</a>\ngithub   → <a href="https://github.com/Jagadeesh-Sunkara" target="_blank" rel="noopener noreferrer">Jagadeesh-Sunkara</a>',
      resume: 'Downloading résumé… <a href="Jagadeesh_Sunkara_Resume.pdf" download>click here if it doesn’t start</a>',
      sudo: 'Nice try. Permission denied — but you can hire me instead.',
      hello: 'Hey! Thanks for stopping by. Type <b>help</b> to look around.'
    };
    CMDS.hi = CMDS.hello; CMDS.ls = CMDS.projects; CMDS.whoami = 'Jagadeesh Sunkara — software engineer, New York';
    function line(html, cls) { var p = document.createElement('p'); if (cls) p.className = cls; p.innerHTML = html; body.appendChild(p); body.scrollTop = body.scrollHeight; return p; }
    function run(raw) {
      var cmd = raw.trim().toLowerCase(); if (!cmd) return;
      line('<span class="pr">$</span>' + cmd.replace(/[<>&]/g, ''));
      if (cmd === 'clear') { body.innerHTML = ''; return; }
      if (cmd === 'theme') { themeBtn.click(); line('Switched to ' + currentTheme() + ' theme.', 'out'); return; }
      if (cmd === 'resume') { var a = document.createElement('a'); a.href = 'Jagadeesh_Sunkara_Resume.pdf'; a.download = ''; document.body.appendChild(a); a.click(); a.remove(); }
      line(CMDS[cmd] || 'command not found: ' + cmd.replace(/[<>&]/g, '') + ' — try <b>help</b>', 'out');
    }
    form.addEventListener('submit', function (e) { e.preventDefault(); run(input.value); input.value = ''; });
    $$('.term-chips button').forEach(function (b) { b.addEventListener('click', function () { run(b.dataset.cmd); }); });
    $('#term').addEventListener('click', function (e) { if (!e.target.closest('a,button') && FINE) input.focus({ preventScroll: true }); });
    if (REDUCE) { line('<span class="pr">$</span>help'); line(CMDS.help, 'out'); return; }
    // Autoplay a short intro once the hero has settled.
    setTimeout(function () {
      var text = 'help', i = 0, p = line('<span class="pr">$</span>');
      (function type() { if (i < text.length) { p.innerHTML = '<span class="pr">$</span>' + text.slice(0, ++i); setTimeout(type, 110); } else { setTimeout(function () { line(CMDS.help, 'out'); }, 250); } })();
    }, 1800);
  })();

  /* ---------- Marquee ---------- */
  (function () {
    var list = ['react|React', 'typescript|TypeScript', 'sharp|C#', 'dotnet|.NET', 'sqlserver|SQL Server', 'python|Python', 'apachespark|PySpark', 'openai|OpenAI', 'azure|Azure', 'docker|Docker', 'github|GitHub', 'tensorflow|TensorFlow', 'pandas|pandas', 'powerbi|Power BI', 'tableau|Tableau', 'javascript|JavaScript'];
    var html = list.map(function (it) { var p = it.split('|'); return '<span style="--c:' + brand(p[0]) + '">' + svgIcon(p[0]) + p[1] + '</span>'; }).join('');
    $('#marquee').innerHTML = html + (REDUCE ? '' : html.replace(/<span /g, '<span aria-hidden="true" '));
  })();

  /* ---------- Projects ---------- */
  var I = {
    chart: '<path d="M4 19V9M10 19V5M16 19v-7M22 19H2"/>',
    spark: '<path d="M12 3l1.8 4.6L18 9.4l-4.2 1.8L12 16l-1.8-4.8L6 9.4l4.2-1.8z"/>',
    doc: '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/>',
    bot: '<rect x="4" y="7" width="16" height="12" rx="3"/><path d="M12 3v4M9 12h.01M15 12h.01M9 16h6"/>',
    bank: '<path d="M3 10l9-6 9 6M5 10v8M19 10v8M9 10v8M15 10v8M3 20h18"/>',
    scan: '<path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M7 12h10"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
    bike: '<circle cx="6" cy="17" r="3.5"/><circle cx="18" cy="17" r="3.5"/><path d="M6 17l4-8h5l3 8M10 9l2 8"/>',
    lease: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h4"/>',
    hub: '<circle cx="12" cy="12" r="3"/><circle cx="4" cy="5" r="2"/><circle cx="20" cy="5" r="2"/><circle cx="4" cy="19" r="2"/><circle cx="20" cy="19" r="2"/><path d="M5.5 6.5l4.3 3.5M18.5 6.5l-4.3 3.5M5.5 17.5l4.3-3.5M18.5 17.5l-4.3-3.5"/>',
    ship: '<path d="M4 17l5-5-5-5M12 19h8"/>',
    vote: '<rect x="4" y="10" width="16" height="10" rx="2"/><path d="M9 10V5h6v5M9 15h6"/>'
  };
  var PROJECTS = [
    { cat: ['fintech'], kind: 'Professional · Fintech', ic: 'chart', featured: true, title: 'Investment Operations Platform',
      text: 'Led the rebuild of a legacy console application into a modern React web platform that gives investment and operations teams one source of truth — with live dashboards and charts, role-based permissions, approval workflows and real-time notifications.',
      stat: '50+ users ·60+ screens · 1,000+ automated tests', tags: ['React', 'TypeScript', 'ASP.NET Core', 'SQL Server', 'SSO'] },
    { cat: ['data', 'fintech'], kind: 'Professional · Architecture', ic: 'hub', title: 'Shared Services & Central Data Hub',
      text: 'Designed a set of reusable microservices that every internal app plugs into: an email service, a report-distribution service, a file-ingestion service for SFTP and API feeds, and a central data hub that unifies records from multiple source systems — all driven by a cron-based job scheduler.',
      stat: '4+ source systems · 4+ apps on shared services · 50+ scheduled jobs', tags: ['Microservices', 'ASP.NET Core', 'SFTP', 'ETL', 'SQL Server', 'Scheduling'] },
    { cat: ['ai', 'fintech'], kind: 'Professional · AI', ic: 'spark', title: 'Conversational Data Assistant (MCP)',
      text: 'Built a Model Context Protocol server so users can ask plain-English questions inside the application and get answers drawn from the central data hub — with permission checks and SQL-backed tools instead of free-form queries.',
      stat: 'Ad-hoc data requests to engineering eliminated', tags: ['Claude', 'MCP', 'Tool-use agents', 'SQL Server', '.NET'] },
    { cat: ['ai'], kind: 'Professional · AI', ic: 'doc', title: 'Document-to-Data Automation',
      text: 'Built Claude Skills that read investment memos, extract the key terms into structured records and hand them to a reviewer for sign-off, with reports generated automatically after approval.',
      stat: 'Couple of days → ~30 minutes per memo', tags: ['Claude Skills', 'Document extraction', 'Human-in-the-loop', 'Reporting'] },
    { cat: ['ai', 'data'], kind: 'Professional · DevOps', ic: 'ship', title: 'AI-Assisted CI/CD & Release Checks',
      text: 'Used Claude Code to build CI/CD pipelines with automated deployments, plus pre-release validations that catch code and configuration mismatches before they reach production.',
      stat: 'Manual releases → fully automated deployments', tags: ['Claude Code', 'CI/CD', 'Azure DevOps', 'Automated testing'] },
    { cat: ['data'], kind: 'Professional · Automation', ic: 'bot', title: 'Employee Onboarding Bot',
      text: 'A Microsoft Teams bot that runs onboarding end to end — collecting details, sending real-time requests to each team for account creation and permission approvals, and tracking every step until the new hire is ready.',
      stat: 'Coordinates 6+ teams per new hire', tags: ['.NET', 'Microsoft Teams', 'Workflow automation', 'Notifications'] },
    { cat: ['data', 'fintech'], kind: 'Professional · Automation', ic: 'vote', title: 'Anonymous Decision-Voting Bot',
      text: 'A Teams bot that collects anonymous votes on whether to advance investment opportunities, then tallies the results and emails a summary when voting closes — candid input without bias.',
      tags: ['.NET', 'Microsoft Teams', 'Email service'] },
    { cat: ['ai'], kind: 'Professional · Enablement', ic: 'user', title: 'AI Adoption for Business Teams',
      text: 'Trained non-technical colleagues to build their own dashboards and tools with Claude artifacts, so each team could automate its daily work without waiting on engineering.',
      stat: '~25 colleagues trained · 4+ teams self-serving', tags: ['Claude', 'Training', 'Dashboards', 'Self-service'] },
    { cat: ['ai'], kind: 'Graduate · Deep learning', ic: 'scan', title: 'Chest X-ray Classifier',
      text: 'A CNN that classifies normal, pneumonia and COVID-19 X-rays, trained on 20K images with Spark pipelines.',
      stat: '90.4% accuracy', tags: ['TensorFlow', 'Keras', 'PySpark'], link: 'https://github.com/Jagadeesh-Sunkara/Chest-X-Ray-Detection' },
    { cat: ['ai'], kind: 'Graduate · NLP', ic: 'user', title: 'Résumé-to-Job Matcher',
      text: 'NLP that extracts skills and experience from résumés and scores them against job descriptions.',
      tags: ['spaCy', 'LDA', 'Flask'], link: 'https://github.com/Jagadeesh-Sunkara/Resume_Analysis_Capstone' },
    { cat: ['fintech'], kind: 'Professional · Fintech', ic: 'lease', wide: true, title: 'Lease Accounting Suite',
      text: 'Tax, invoicing, payments and collections modules for an enterprise leasing platform used by global banks and lessors.',
      tags: ['C#', '.NET', 'React', 'SQL Server'] }
  ];
  // Animated mini-dashboard for the featured card: bars grow, the trend line draws, then the data keeps "breathing".
  var VIZ = (function () {
    var hs = [38, 56, 44, 70, 62, 84, 76], bars = hs.map(function (h, i) {
      return '<rect class="vz-bar" style="--k:' + i + '" x="' + (22 + i * 34) + '" y="' + (150 - h) + '" width="20" height="' + h + '" rx="5"/>';
    }).join('');
    return '<div class="proj-viz" aria-hidden="true"><div class="vz-frame">' +
      '<div class="vz-head"><i></i><i></i><i></i><span class="mono">portfolio · live</span></div>' +
      '<div class="vz-kpis"><div><b class="mono">50+</b><span>users</span></div><div><b class="mono">60+</b><span>screens</span></div><div><b class="mono">1K+</b><span>tests</span></div></div>' +
      '<svg viewBox="0 0 260 160" class="vz-chart"><defs><linearGradient id="vzg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--em)"/><stop offset="1" stop-color="var(--in)" stop-opacity=".35"/></linearGradient></defs>' +
      '<path class="vz-grid" d="M10 40H250M10 80H250M10 120H250"/>' + bars +
      '<polyline class="vz-line" points="32,104 66,86 100,98 134,70 168,78 202,56 236,62"/>' +
      '<circle class="vz-dot" cx="236" cy="62" r="4.5"/></svg></div></div>';
  })();
  // The problem each project solved, and who it helped.
  var IMPACT = {
    'Investment Operations Platform': ['Teams were juggling spreadsheets and an aging console app: slow, error-prone and hard to control.', '50+ portfolio, finance and operations users now work from one live source of truth.'],
    'Shared Services & Central Data Hub': ['Every app rebuilt its own email, reports and file handling, and data sat in silos across systems.', 'Developers reuse one set of services, and every team sees consistent data from 4+ systems.'],
    'Conversational Data Assistant (MCP)': ['Simple data questions meant messaging other teams or developers, then waiting for an answer.', 'Business users get answers in seconds on their own, and developers stopped fielding ad-hoc requests.'],
    'Document-to-Data Automation': ['Keying the terms of each investment memo into systems by hand took a couple of days.', 'Reviewers now just check and sign off in about 30 minutes, and reports generate themselves.'],
    'AI-Assisted CI/CD & Release Checks': ['Releases were manual and slow, and mismatched code or config could slip into production.', 'The engineering team ships through automated, checked deployments instead of manual release steps.'],
    'Employee Onboarding Bot': ['Setting up a new hire meant chasing 6+ teams over email for accounts and permissions.', 'HR, IT and managers see every step tracked in Teams, with no more email chains.'],
    'Anonymous Decision-Voting Bot': ['Group decisions can lean toward whoever speaks first or most senior.', 'Everyone gives candid input anonymously, and results reach the team by email automatically.'],
    'AI Adoption for Business Teams': ['Business teams waited on engineering for every small dashboard or tool.', '~25 colleagues across 4+ teams now build their own tools with Claude.'],
    'Lease Accounting Suite': ['Banks and lessors needed tax, invoicing, payments and collections handled accurately at enterprise scale.', 'Finance teams at global banks and lessors ran billing and collections on one platform.'],
    'Chest X-ray Classifier': ['Reading X-rays for pneumonia and COVID-19 is slow when clinicians are overloaded.', 'A research prototype showing AI-assisted triage at 90.4% accuracy.'],
    'Résumé-to-Job Matcher': ['Recruiters spend hours on first-pass résumé screening.', 'A prototype that scores candidates against a job description automatically.']
  };
  var grid = $('#projGrid');
  grid.innerHTML = PROJECTS.map(function (p) {
    var art = !p.featured && window.PROJECT_ART && window.PROJECT_ART[p.title];
    var im = IMPACT[p.title];
    var body = '<div class="proj-top"><span class="proj-ic" aria-hidden="true"><svg viewBox="0 0 24 24">' + I[p.ic] + '</svg></span><span class="proj-kind">' + p.kind + '</span></div>' +
      (art ? '<div class="mg" aria-hidden="true">' + art + '</div>' : '') +
      '<h3>' + p.title + '</h3>' +
      (im ? '<p class="pi-problem"><span class="pi-k">The problem</span>' + im[0] + '</p>' : '') +
      '<p>' + p.text + '</p>' +
      (im ? '<p class="pi-helped"><span class="pi-k"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>Who it helped</span>' + im[1] + '</p>' : '') +
      (p.stat ? '<span class="proj-stat"><i aria-hidden="true">▲</i> ' + p.stat + '</span>' : '') +
      '<ul class="proj-tags">' + p.tags.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul>' +
      (p.link ? '<a class="proj-link" href="' + p.link + '" target="_blank" rel="noopener noreferrer">View on GitHub <span aria-hidden="true">↗</span></a>' : '');
    return '<article class="proj tilt spot reveal' + (p.featured ? ' featured' : '') + (p.wide ? ' wide' : '') + '" data-cat="' + p.cat.join(' ') + '" data-title="' + p.title + '">' +
      '<span class="proj-ring" aria-hidden="true"></span>' +
      (p.featured ? '<div class="proj-body">' + body + '</div>' + VIZ : body) + '</article>';
  }).join('');
  // System map: clicking "See the project card" shows all cards, scrolls to the right one and flashes it.
  if (window.buildSysmap) window.buildSysmap($('#sysmap'), function (title) {
    var all = $('.filters button[data-filter="all"]'); if (all && all.getAttribute('aria-selected') !== 'true') all.click();
    var card = $$('.proj', grid).filter(function (c) { return c.dataset.title === title; })[0]; if (!card) return;
    card.scrollIntoView({ behavior: REDUCE ? 'auto' : 'smooth', block: 'center' });
    card.classList.remove('flash'); void card.offsetWidth; card.classList.add('flash');
  });
  // Filters: a pill slides to the chosen tab, and matching cards pop back in one after another.
  var filters = $('.filters'), ind = $('.filter-ind');
  function activeTab() { return $('.filters button[aria-selected="true"]'); }
  function moveInd(b) { if (!ind || !b) return; ind.style.width = b.offsetWidth + 'px'; ind.style.transform = 'translateX(' + (b.offsetLeft - 6) + 'px)'; }
  $$('.filters button').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('.filters button').forEach(function (x) { x.setAttribute('aria-selected', String(x === b)); });
      moveInd(b);
      var f = b.dataset.filter, k = 0;
      $$('.proj', grid).forEach(function (card) {
        var show = f === 'all' || card.dataset.cat.split(' ').indexOf(f) > -1;
        card.classList.toggle('hide', !show);
        card.classList.toggle('enter', false);
        if (show && !REDUCE) { card.style.animationDelay = (k++ * 60) + 'ms'; void card.offsetWidth; card.classList.add('enter'); }
      });
    });
  });
  if (filters) {
    moveInd(activeTab());
    addEventListener('resize', function () { moveInd(activeTab()); });
    if (document.fonts) document.fonts.ready.then(function () { moveInd(activeTab()); });
  }

  /* ---------- Skills tabs ---------- */
  var SKILLS = {
    'Frontend': ['react|React', 'typescript|TypeScript', 'javascript|JavaScript', '|Vite', '|HTML & CSS', '|Responsive UI'],
    'Backend': ['sharp|C#', 'dotnet|ASP.NET Core', '|REST APIs', '|Dapper', '|Microservices', '|Microsoft Teams bots', '|Job scheduling', 'postman|Postman'],
    'Data': ['sqlserver|SQL Server', 'python|Python', 'apachespark|PySpark', 'pandas|pandas', 'numpy|NumPy', 'etl|ETL & integrations', 'oracle|Oracle', 'mongodb|MongoDB'],
    'AI & ML': ['|Claude', '|Claude Code', '|Claude Skills', '|Model Context Protocol', 'openai|OpenAI', '|RAG', 'tensorflow|TensorFlow', 'scikitlearn|scikit-learn', 'spacy|spaCy'],
    'Cloud & DevOps': ['azure|Azure', '|Azure DevOps', 'docker|Docker', 'git|Git', 'github|GitHub', 'cicd|CI/CD', 'jira|Jira', '|Single sign-on'],
    'Analytics & Finance': ['powerbi|Power BI', 'tableau|Tableau', 'r|R', '|Private credit', '|Portfolio management', '|Investor reporting', '|Lease accounting']
  };
  var tabs = $('#skillTabs'), panel = $('#skillPanel');
  var names = Object.keys(SKILLS);
  tabs.innerHTML = names.map(function (n, i) { return '<button role="tab" aria-selected="' + (i === 0) + '" id="st' + i + '" aria-controls="skillPanel">' + n + '</button>'; }).join('');
  function showSkills(i) {
    $$('button', tabs).forEach(function (b, j) { b.setAttribute('aria-selected', String(j === i)); });
    panel.setAttribute('aria-labelledby', 'st' + i);
    panel.innerHTML = SKILLS[names[i]].map(function (it, k) {
      var p = it.split('|'), slug = p[0], ic = slug && ICONS[slug];
      return '<div class="sk' + (REDUCE ? '' : ' enter') + '" style="--c:' + brand(slug) + ';animation-delay:' + (k * 45) + 'ms"><span class="sk-ic">' + (ic ? svgIcon(slug) : '<i></i>') + '</span>' + p[1] + '</div>';
    }).join('');
  }
  $$('button', tabs).forEach(function (b, i) {
    b.addEventListener('click', function () { showSkills(i); });
    b.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!d) return;
      var n = (i + d + names.length) % names.length; $$('button', tabs)[n].focus(); showSkills(n);
    });
  });
  showSkills(0);

  /* ---------- Reveal on scroll ---------- */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach(function (el) {
    var sibs = $$(':scope > .reveal', el.parentElement), i = sibs.indexOf(el);
    if (i > 0 && !REDUCE) el.style.transitionDelay = Math.min(i, 6) * 80 + 'ms';
    io.observe(el);
  });

  /* ---------- Timeline progress ---------- */
  var tl = $('#timeline'), tlItems = $$('.tl', tl);
  function updateTimeline() {
    if (!tl) return;
    var r = tl.getBoundingClientRect(), mid = innerHeight * 0.62;
    var pct = Math.max(0, Math.min(1, (mid - r.top) / r.height));
    tl.style.setProperty('--tl', (REDUCE ? 100 : pct * 100) + '%');
    tlItems.forEach(function (li) { li.classList.toggle('lit', REDUCE || li.getBoundingClientRect().top < mid); });
  }
  addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', updateTimeline); onScroll();

  /* ---------- Counters ---------- */
  function fmt(n, el) { var dec = +(el.dataset.dec || 0); return (dec ? (n / Math.pow(10, dec)).toFixed(dec) : String(n)) + (el.dataset.suffix || ''); }
  $$('[data-count]').forEach(function (el) {
    var done = false;
    onView(el, function (v) {
      if (!v || done) return; done = true;
      var target = +el.dataset.count; if (REDUCE) { el.textContent = fmt(target, el); return; }
      var t0 = performance.now();
      (function tick(t) { var p = Math.min(1, (t - t0) / 1500), e = 1 - Math.pow(1 - p, 3); el.textContent = fmt(Math.round(target * e), el); if (p < 1) requestAnimationFrame(tick); })(t0);
    }, { threshold: 0.6 });
  });

  /* ---------- Tilt + spotlight cards ---------- */
  if (FINE && !REDUCE) document.addEventListener('pointermove', function (e) {
    var card = e.target.closest && e.target.closest('.tilt'); if (!card) return;
    var r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    var max = card.id === 'term' ? 4 : card.classList.contains('proj') ? 4.5 : 7;
    card.style.transform = 'perspective(900px) rotateX(' + ((0.5 - y) * max) + 'deg) rotateY(' + ((x - 0.5) * max) + 'deg) translateY(-4px)';
    card.style.setProperty('--mx', x * 100 + '%'); card.style.setProperty('--my', y * 100 + '%');
  }, { passive: true });
  $$('.tilt').forEach(function (c) { c.addEventListener('pointerleave', function () { c.style.transform = ''; }); });

  /* ---------- Recommendations carousel ---------- */
  (function () {
    var RECS = [
      ['Single-handedly led major customizations, including tax and audit compliance. Extremely reliable, delivers quality with minimal support, and inspires everyone around him.', 'Solution Architect', 'managed Jagadeesh directly'],
      ['Exceptional responsiveness and stellar communication. Goes above and beyond on client needs — an invaluable asset to any team.', 'Client Success Lead', 'worked together across teams'],
      ['Goal-oriented, hardworking, and a true professional. His depth of knowledge lets him deliver sharp, consultative analysis for every client.', 'Senior Business Analyst & Consultant', 'same delivery team'],
      ['Excels at customer satisfaction with quick turnarounds. Handles clients independently and is always reachable — a real asset.', 'Senior Lead Business Architect', 'senior colleague'],
      ['Highly skilled and dedicated. His domain expertise helped the company immensely — and he’s a great person to work with.', 'Senior Product Owner', 'same project team'],
      ['Relentless commitment and resilience under pressure — always gets things done on time. An optimist who lifts the whole team’s spirits.', 'Business Architect', 'close collaborator'],
      ['A dedicated team player and strong problem solver with deep product knowledge. Helpful to everyone and a clear asset to the org.', 'Senior Business Analyst', 'same project team']
    ];
    var box = $('#rec'), q = $('#recQuote'), who = $('#recWho'), dots = $('#recDots'), idx = 0, timer = 0, paused = false, visible = false;
    dots.innerHTML = RECS.map(function (_, i) { return '<button aria-label="Recommendation ' + (i + 1) + '"' + (i ? '' : ' aria-current="true"') + '></button>'; }).join('');
    function go(n) {
      idx = (n + RECS.length) % RECS.length;
      var apply = function () { q.textContent = RECS[idx][0]; who.innerHTML = '<b>' + RECS[idx][1] + '</b> · ' + RECS[idx][2]; box.classList.remove('swap'); };
      $$('button', dots).forEach(function (d, i) { d.setAttribute('aria-current', String(i === idx)); });
      if (REDUCE) apply(); else { box.classList.add('swap'); setTimeout(apply, 300); }
      schedule();
    }
    function schedule() { clearTimeout(timer); if (!REDUCE && !paused && visible) timer = setTimeout(function () { go(idx + 1); }, 6500); }
    $('#recPrev').addEventListener('click', function () { go(idx - 1); });
    $('#recNext').addEventListener('click', function () { go(idx + 1); });
    $$('button', dots).forEach(function (d, i) { d.addEventListener('click', function () { go(i); }); });
    box.addEventListener('pointerenter', function () { paused = true; clearTimeout(timer); });
    box.addEventListener('pointerleave', function () { paused = false; schedule(); });
    box.addEventListener('focusin', function () { paused = true; clearTimeout(timer); });
    box.addEventListener('focusout', function () { paused = false; schedule(); });
    onView(box, function (v) { visible = v; v ? schedule() : clearTimeout(timer); }, { threshold: 0.4 });
  })();

  /* ---------- Copy email ---------- */
  $('#copyEmail').addEventListener('click', function () {
    var email = this.dataset.email;
    function done() { showToast('Email copied — talk soon!'); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(email).then(done, fallback); else fallback();
    function fallback() {
      var t = document.createElement('textarea'); t.value = email; t.setAttribute('readonly', ''); t.style.position = 'absolute'; t.style.left = '-9999px';
      document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); done(); } catch (e) { showToast(email); }
      t.remove();
    }
  });
})();
