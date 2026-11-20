/* Project graphics: a small animated diagram for each project card, and the interactive end-to-end system map.
   Everything is inline SVG coloured by CSS variables, so it follows the light/dark theme. Descriptions are generic on purpose. */
(function () {
  'use strict';

  /* ---------- Mini diagrams (viewBox 300 x 100) ---------- */
  function N(x, y, t, hot) {
    var w = Math.max(30, t.length * 6.2 + 14);
    return '<g class="n' + (hot ? ' hot' : '') + '"><rect x="' + (x - w / 2) + '" y="' + (y - 11) + '" width="' + w + '" height="22" rx="6"/><text x="' + x + '" y="' + (y + 3.5) + '">' + t + '</text></g>';
  }
  function L(d) { return '<path class="ln" d="' + d + '"/><path class="fl" d="' + d + '"/>'; }
  function D(d, delay, dur) {
    return '<circle class="dt" r="3" style="offset-path:path(\'' + d + '\');animation-delay:' + delay + 's' + (dur ? ';animation-duration:' + dur + 's' : '') + '"/>';
  }
  function T(x, y, t, cls) { return '<text class="lbl' + (cls ? ' ' + cls : '') + '" x="' + x + '" y="' + y + '">' + t + '</text>'; }
  function svg(inner) { return '<svg viewBox="0 0 300 100" preserveAspectRatio="xMidYMid meet">' + inner + '</svg>'; }

  var ART = {};

  ART['Shared Services & Central Data Hub'] = (function () {
    var src = ['deal', 'pm', 'sftp', 'api'], out = ['mail', 'report', 'files'], s = '';
    src.forEach(function (t, i) { var y = 17 + i * 22, d = 'M56 ' + y + ' C100 ' + y + ',100 50,132 50'; s += L(d) + D(d, i * 0.45); });
    out.forEach(function (t, i) { var y = 22 + i * 28, d = 'M168 50 C206 50,206 ' + y + ',236 ' + y; s += L(d) + D(d, 1 + i * 0.4); });
    src.forEach(function (t, i) { s += N(36, 17 + i * 22, t); });
    out.forEach(function (t, i) { s += N(264, 22 + i * 28, t); });
    s += '<circle class="ring" cx="150" cy="50" r="18"/><circle class="core" cx="150" cy="50" r="17"/>' + T(150, 53.5, 'HUB', 'in');
    return svg(s);
  })();

  ART['Conversational Data Assistant (MCP)'] = (function () {
    var a = 'M114 26 H146', b = 'M192 26 H238', c = 'M258 46 C258 76,206 74,136 74';
    var s = L(a) + L(b) + L(c) + D(a, 0, 3) + D(b, 0.7, 3) + D(c, 1.4, 3);
    s += '<rect class="bub" x="10" y="13" width="104" height="26" rx="9"/>' + T(62, 29.5, 'ask in English');
    s += N(169, 26, 'MCP', true);
    s += '<g class="db"><path d="M242 18v18c0 3 7 5 16 5s16-2 16-5V18"/><ellipse cx="258" cy="18" rx="16" ry="5"/></g>' + T(258, 34, 'SQL');
    s += '<rect class="bub ans" x="10" y="61" width="126" height="26" rx="9"/>' + T(56, 77.5, 'answer');
    s += '<circle class="typ" cx="96" cy="74" r="2.6"/><circle class="typ" style="animation-delay:.2s" cx="105" cy="74" r="2.6"/><circle class="typ" style="animation-delay:.4s" cx="114" cy="74" r="2.6"/>';
    return svg(s);
  })();

  ART['Document-to-Data Automation'] = (function () {
    var s = '<rect class="doc" x="18" y="12" width="52" height="76" rx="6"/>';
    [24, 34, 44, 54, 64, 74].forEach(function (y, i) { s += '<path class="dl" d="M27 ' + y + ' H' + (i % 3 === 2 ? 50 : 61) + '"/>'; });
    s += '<rect class="scan" x="20" y="16" width="48" height="3" rx="1.5"/>';
    s += L('M76 50 H124') + D('M76 50 H124', 0, 2.4);
    s += '<path class="spark" d="M100 30l2.2 5.4 5.4 2.2-5.4 2.2-2.2 5.4-2.2-5.4-5.4-2.2 5.4-2.2z"/>' + T(100, 66, 'Claude');
    for (var r = 0; r < 3; r++) for (var c = 0; c < 3; c++)
      s += '<rect class="cell" style="animation-delay:' + ((r * 3 + c) * 0.18) + 's" x="' + (132 + c * 33) + '" y="' + (26 + r * 17) + '" width="29" height="12" rx="3"/>';
    s += L('M234 50 H248');
    s += '<circle class="ok" cx="264" cy="50" r="14"/><path class="tick" d="M257 50l5 5 9-10"/>' + T(264, 80, 'sign-off');
    return svg(s);
  })();

  ART['AI-Assisted CI/CD & Release Checks'] = (function () {
    var xs = [40, 113, 186, 259], lb = ['commit', 'build', 'test', 'deploy'], s = '<path class="ln" d="M40 44 H259"/><path class="prog" d="M40 44 H259"/>';
    xs.forEach(function (x, i) {
      s += '<circle class="stage" style="animation-delay:' + (i * 0.55) + 's" cx="' + x + '" cy="44" r="10"/><path class="stk" style="animation-delay:' + (i * 0.55) + 's" d="M' + (x - 4.5) + ' 44l3 3 6-6"/>' + T(x, 72, lb[i]);
    });
    s += T(150, 92, 'checks pass → auto-deploy', 'em');
    return svg(s);
  })();

  ART['Employee Onboarding Bot'] = (function () {
    var t = ['IT', 'HR', 'Sec', 'Fin', 'Ops', 'Mgr'], s = '';
    t.forEach(function (n, i) {
      var x = i < 3 ? 196 : 262, y = 20 + (i % 3) * 30, d = 'M74 50 C130 50,140 ' + y + ',' + (x - 17) + ' ' + y;
      s += L(d) + D(d, i * 0.35, 2.6);
    });
    s += '<circle class="ring" cx="52" cy="50" r="22"/><circle class="core" cx="52" cy="50" r="21"/>' + T(52, 53.5, 'bot', 'in');
    t.forEach(function (n, i) { s += N(i < 3 ? 196 : 262, 20 + (i % 3) * 30, n); });
    return svg(s);
  })();

  ART['Anonymous Decision-Voting Bot'] = (function () {
    var s = '<rect class="doc" x="22" y="46" width="60" height="40" rx="6"/><path class="slot" d="M38 46 H66"/>';
    [0, 1, 2].forEach(function (i) { s += '<rect class="vote" style="animation-delay:' + (i * 0.6) + 's" x="' + (40 + i * 6) + '" y="14" width="16" height="20" rx="3"/>'; });
    s += T(52, 98, 'anonymous');
    s += '<rect class="track" x="108" y="30" width="120" height="12" rx="6"/><rect class="bar b1" x="108" y="30" width="84" height="12" rx="6"/>' + T(108, 24, 'advance', 'l');
    s += '<rect class="track" x="108" y="66" width="120" height="12" rx="6"/><rect class="bar b2" x="108" y="66" width="36" height="12" rx="6"/>' + T(108, 60, 'pass', 'l');
    s += '<g class="mail"><rect x="246" y="38" width="38" height="26" rx="4"/><path d="M246 40l19 13 19-13"/></g>' + T(265, 80, 'results');
    return svg(s);
  })();

  ART['AI Adoption for Business Teams'] = (function () {
    var s = '';
    [50, 100, 150, 200, 250].forEach(function (x, i) {
      s += '<g class="person" style="animation-delay:' + (i * 0.4) + 's"><circle cx="' + x + '" cy="44" r="8"/><path d="M' + (x - 13) + ' 70c0-9 6-14 13-14s13 5 13 14"/></g>';
      s += '<path class="spark sm" style="animation-delay:' + (i * 0.4) + 's" d="M' + (x + 12) + ' 22l1.6 3.8 3.8 1.6-3.8 1.6-1.6 3.8-1.6-3.8-3.8-1.6 3.8-1.6z"/>';
    });
    s += T(150, 92, 'teams building their own tools');
    return svg(s);
  })();

  ART['Lease Accounting Suite'] = (function () {
    var d = 'M66 24 H234 V76 H66 Z', s = '<path class="ln" d="' + d + '"/><path class="fl" d="' + d + '"/>' + D(d, 0, 5) + D(d, 2.5, 5);
    s += N(66, 24, 'invoice') + N(234, 24, 'payment') + N(234, 76, 'collect') + N(66, 76, 'ledger');
    s += T(150, 53, 'lease lifecycle', 'em');
    return svg(s);
  })();

  ART['Chest X-ray Classifier'] = (function () {
    var s = '<defs><radialGradient id="xr" cx=".5" cy=".45" r=".6"><stop offset="0" stop-color="var(--ink-2)" stop-opacity=".55"/><stop offset="1" stop-color="var(--ink-2)" stop-opacity=".05"/></radialGradient></defs>';
    [20, 70, 120].forEach(function (x) { s += '<rect class="img" x="' + x + '" y="22" width="44" height="56" rx="6"/><ellipse cx="' + (x + 14) + '" cy="50" rx="8" ry="16" fill="url(#xr)"/><ellipse cx="' + (x + 30) + '" cy="50" rx="8" ry="16" fill="url(#xr)"/>'; });
    s += '<rect class="sweep" x="18" y="20" width="2.5" height="60" rx="1"/>';
    ['normal', 'pneumonia', 'covid'].forEach(function (t, i) { s += '<g class="cls" style="animation-delay:' + (i * 1.2) + 's">' + N(238, 26 + i * 24, t) + '</g>'; });
    s += T(150, 95, 'CNN · 90.4% accuracy', 'em');
    return svg(s);
  })();

  ART['Résumé-to-Job Matcher'] = (function () {
    var s = '';
    [[20, 'résumé'], [92, 'job']].forEach(function (p) {
      s += '<rect class="doc" x="' + p[0] + '" y="16" width="50" height="62" rx="6"/>';
      [28, 38, 48, 58].forEach(function (y, i) { s += '<path class="dl" d="M' + (p[0] + 9) + ' ' + y + ' H' + (p[0] + (i % 2 ? 32 : 41)) + '"/>'; });
      s += T(p[0] + 25, 92, p[1]);
    });
    s += L('M146 47 H196') + D('M146 47 H196', 0, 2);
    s += '<circle class="gtrack" cx="240" cy="47" r="26"/><circle class="gauge" cx="240" cy="47" r="26"/>' + T(240, 51, 'match', 'in');
    return svg(s);
  })();

  window.PROJECT_ART = ART;

  /* ---------- Interactive system map: a generic pattern for data + AI systems (viewBox 1000 x 440) ---------- */
  var NODES = [
    { id: 'biz', c: 0, x: 100, y: 60, t: 'Business systems', s: 'CRM · ERP · SaaS', d: 'The platforms a business already runs on, connected rather than replaced.' },
    { id: 'files', c: 0, x: 100, y: 150, t: 'Files & feeds', s: 'SFTP · CSV · Excel', d: 'Recurring files from partners, vendors and internal teams, picked up automatically.' },
    { id: 'apis', c: 0, x: 100, y: 240, t: 'External APIs', s: 'third-party data', d: 'Market, reference and partner data pulled in through API integrations.' },
    { id: 'docs', c: 0, x: 100, y: 330, t: 'Documents', s: 'PDFs · contracts · reports', d: 'Unstructured documents that hold critical data but no structure.' },
    { id: 'integ', c: 1, x: 300, y: 150, t: 'Integration layer', s: 'connect · validate · load', d: 'Pull data in from every system the business already uses, validate it on the way in, and load only clean records.', p: 'Shared Services & Central Data Hub', tags: ['ETL', 'REST APIs', 'SFTP'] },
    { id: 'sched', c: 1, x: 300, y: 300, t: 'Scheduler', s: 'timed jobs & triggers', d: 'Run ingestion, syncs and reports on time, every time, without anyone pressing a button.', p: 'Shared Services & Central Data Hub', tags: ['Cron', 'Job scheduling'] },
    { id: 'core', c: 2, x: 500, y: 205, t: 'Trusted data layer', s: 'one source of truth', d: 'One governed model everything reads from, so apps, reports and AI all give the same answer.', p: 'Shared Services & Central Data Hub', tags: ['SQL Server', 'Data modeling', 'Permissions'], big: true },
    { id: 'ai', c: 3, x: 705, y: 60, t: 'AI assistant', s: 'MCP · tool use', d: 'Give the model safe, permission-checked tools over real data instead of free-form queries, so answers are fast and auditable.', p: 'Conversational Data Assistant (MCP)', tags: ['Claude', 'MCP', 'Tool-use agents'] },
    { id: 'docai', c: 3, x: 705, y: 155, t: 'Document AI', s: 'extract → human review', d: 'Turn unstructured documents into structured data, keeping a human sign-off before anything is final.', p: 'Document-to-Data Automation', tags: ['Claude Skills', 'Human-in-the-loop'] },
    { id: 'bots', c: 3, x: 705, y: 250, t: 'Workflow bots', s: 'approvals in chat', d: 'Put requests and approvals where people already chat, and route each step to the right team automatically.', p: 'Employee Onboarding Bot', tags: ['Microsoft Teams', '.NET'] },
    { id: 'svc', c: 3, x: 705, y: 345, t: 'Shared services', s: 'email · reports · alerts', d: 'Build email, reporting and notifications once, as services every app reuses.', p: 'Shared Services & Central Data Hub', tags: ['Microservices', 'ASP.NET Core'] },
    { id: 'apps', c: 4, x: 888, y: 120, t: 'Web applications', s: 'dashboards · workflows', d: 'Fast, secure apps with role-based access, live dashboards and real-time notifications.', p: 'Investment Operations Platform', tags: ['React', 'TypeScript', 'SSO'] },
    { id: 'people', c: 4, x: 888, y: 290, t: 'Business teams', s: 'answers, not tickets', d: 'The goal: people get answers, reports and approvals without waiting on engineering.', p: 'AI Adoption for Business Teams', tags: ['Self-service', 'Training'] },
    { id: 'cicd', c: 5, x: 500, y: 395, t: 'CI/CD & quality gates', s: 'AI-assisted · automated tests', d: 'Every change ships through automated pipelines and pre-release checks, so releases are routine instead of risky.', p: 'AI-Assisted CI/CD & Release Checks', tags: ['Claude Code', 'Azure DevOps', 'Automated testing'], dev: true }
  ];
  var COLS = ['Data sources', 'Ingestion', 'Trusted data', 'AI & automation', 'People & apps', 'Delivery'];
  var EDGES = [['biz', 'integ'], ['files', 'integ'], ['apis', 'integ'], ['docs', 'integ'], ['sched', 'integ'], ['sched', 'svc'],
    ['integ', 'core'], ['core', 'ai'], ['docai', 'core'], ['core', 'bots'], ['core', 'svc'], ['ai', 'apps'],
    ['bots', 'people'], ['svc', 'people'], ['apps', 'people'], ['cicd', 'core', 1], ['cicd', 'apps', 1]];
  var byId = {};
  NODES.forEach(function (n) {
    // Size each box to whichever line is longer, so text never spills out.
    n.w = Math.max(n.big ? 176 : 132, n.t.length * (n.big ? 8.6 : 7.6) + 30, n.s.length * 6.5 + 26);
    n.h = n.big ? 62 : 46; byId[n.id] = n;
  });

  function edgePath(a, b) {
    if (Math.abs(a.x - b.x) < 10) {
      var up = b.y < a.y, y1 = a.y + (up ? -a.h / 2 : a.h / 2), y2 = b.y + (up ? b.h / 2 : -b.h / 2);
      return 'M' + a.x + ' ' + y1 + ' L' + b.x + ' ' + y2;
    }
    var dir = b.x > a.x ? 1 : -1, x1 = a.x + dir * a.w / 2, x2 = b.x - dir * b.w / 2, mx = (x1 + x2) / 2;
    return 'M' + x1 + ' ' + a.y + ' C' + mx + ' ' + a.y + ',' + mx + ' ' + b.y + ',' + x2 + ' ' + b.y;
  }

  window.buildSysmap = function (el, onProject) {
    if (!el) return;
    var s = '<svg viewBox="0 0 1000 440" class="sm-svg" role="group" aria-label="Diagram: how data moves from source systems, through a trusted data layer and AI tools, to the people who use it">';
    [100, 300, 500, 705, 888].forEach(function (x, i) { s += '<text class="sm-col" x="' + x + '" y="16">' + COLS[i].toUpperCase() + '</text>'; });
    EDGES.forEach(function (e, i) {
      var d = edgePath(byId[e[0]], byId[e[1]]);
      s += '<g class="sm-edge' + (e[2] ? ' dev' : '') + '" data-a="' + e[0] + '" data-b="' + e[1] + '"><path class="sm-ln" d="' + d + '"/><path class="sm-fl" d="' + d + '"/>' +
        '<circle class="sm-dt" r="3.5" style="offset-path:path(\'' + d + '\');animation-delay:' + ((i * 0.37) % 2.4).toFixed(2) + 's"/></g>';
    });
    NODES.forEach(function (n) {
      s += '<g class="sm-node' + (n.big ? ' big' : '') + (n.dev ? ' dev' : '') + '" data-id="' + n.id + '" tabindex="0" role="button" aria-label="' + n.t + ': ' + n.s + '">' +
        '<rect x="' + (n.x - n.w / 2) + '" y="' + (n.y - n.h / 2) + '" width="' + n.w + '" height="' + n.h + '" rx="' + (n.big ? 16 : 12) + '"/>' +
        '<text class="t" x="' + n.x + '" y="' + (n.y - 2) + '">' + n.t + '</text><text class="s" x="' + n.x + '" y="' + (n.y + 13) + '">' + n.s + '</text></g>';
    });
    s += '</svg>';
    // Phone layout: the same stages as a vertical, tappable flow.
    var steps = '<ol class="sm-steps">' + COLS.map(function (c, ci) {
      return '<li class="sm-stage' + (ci === 5 ? ' dev' : '') + '"><p class="sm-stage-h mono">' + c + '</p><div class="sm-chips">' +
        NODES.filter(function (n) { return n.c === ci; }).map(function (n) {
          return '<button type="button" class="sm-chip' + (n.big ? ' big' : '') + '" data-id="' + n.id + '"><b>' + n.t + '</b><span>' + n.s + '</span></button>';
        }).join('') + '</div></li>';
    }).join('') + '</ol>';
    el.innerHTML = '<div class="sm-head"><div><p class="sm-kicker mono">How I build</p><h3>How I design data + AI systems</h3></div>' +
      '<p class="sm-hint">A pattern I&#39;ve applied across fintech platforms. Click any stage to see what it does and where I&#39;ve used it.</p></div>' +
      '<div class="sm-scroll">' + s + '</div>' + steps + '<div class="sm-panel" aria-live="polite"></div>';
    var panel = el.querySelector('.sm-panel'), nodes = el.querySelectorAll('.sm-node'), edges = el.querySelectorAll('.sm-edge'), chips = el.querySelectorAll('.sm-chip');
    function select(id) {
      var n = byId[id], linked = {}; linked[id] = 1;
      edges.forEach(function (g) {
        var on = g.dataset.a === id || g.dataset.b === id;
        g.classList.toggle('on', on); if (on) { linked[g.dataset.a] = 1; linked[g.dataset.b] = 1; }
      });
      nodes.forEach(function (g) { g.classList.toggle('sel', g.dataset.id === id); g.classList.toggle('near', !!linked[g.dataset.id] && g.dataset.id !== id); });
      chips.forEach(function (c) { c.classList.toggle('sel', c.dataset.id === id); c.setAttribute('aria-pressed', String(c.dataset.id === id)); });
      el.classList.add('focus');
      panel.innerHTML = '<div class="sm-pt"><span class="sm-dot"></span><b>' + n.t + '</b><span class="mono">' + n.s + '</span></div><p>' + n.d + '</p>' +
        (n.tags ? '<ul class="proj-tags">' + n.tags.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul>' : '') +
        (n.p ? '<button type="button" class="sm-go" data-p="' + n.p + '">Where I&#39;ve done this ↑</button>' : '');
      var go = panel.querySelector('.sm-go'); if (go && onProject) go.addEventListener('click', function () { onProject(go.dataset.p); });
    }
    nodes.forEach(function (g) {
      g.addEventListener('click', function () { select(g.dataset.id); });
      g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(g.dataset.id); } });
      g.addEventListener('pointerenter', function () { g.classList.add('hov'); });
      g.addEventListener('pointerleave', function () { g.classList.remove('hov'); });
    });
    // On phones the panel opens right under the stage you tapped; on desktop it sits under the diagram.
    chips.forEach(function (c) { c.addEventListener('click', function () { c.closest('.sm-stage').appendChild(panel); select(c.dataset.id); }); });
    nodes.forEach(function (g) { g.addEventListener('click', function () { if (panel.parentNode !== el) el.appendChild(panel); }); });
    select('core');
  };
})();
