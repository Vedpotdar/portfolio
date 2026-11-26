/* Portfolio extras: "Ask Vedant" assistant, live terminal, project case studies,
   command palette (Ctrl/Cmd + K) and a couple of easter eggs.
   Plain JS, no dependencies, no network calls. Loaded after script.js. */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const body = document.body;
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const isMac = /Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent);
  const sleep = (ms) => new Promise((r) => setTimeout(r, reduceMotion ? 0 : ms));

  const EMAIL = 'vedantpotdar170@gmail.com';
  const RESUME = 'assets/Vedant_Potdar_Resume.pdf';
  const URLS = {
    github: 'https://github.com/Vedpotdar',
    linkedin: 'https://www.linkedin.com/in/vedant-potdar-860760289/',
    play: 'https://play.google.com/store/apps/details?id=com.infocloudic.visitormanagement',
    appstore: 'https://apps.apple.com/us/app/enterlyze/id6751401008',
    dsv: 'https://github.com/Vedpotdar/ds-visualizer',
    dsvDemo: 'https://ds-visualizer-pink.vercel.app',
    bookingDemo: 'https://trial.enterlyze.com/conference-employee',
  };

  /* ---------- Small helpers ---------- */
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const toastEl = $('#toast');
  let toastTimer;
  const toast = (msg) => {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2600);
  };
  const goTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  const openUrl = (url) => window.open(url, '_blank', 'noopener');
  const mailMe = () => { location.href = `mailto:${EMAIL}`; };
  const copyEmail = async () => {
    try { await navigator.clipboard.writeText(EMAIL); toast('Email copied to clipboard'); } catch (_) { toast(EMAIL); }
  };
  const toggleTheme = () => $('#themeToggle').click();
  const isTyping = (el) => el && el.matches && el.matches('input, textarea, select, [contenteditable="true"]');
  $$('.mod-key').forEach((k) => { k.textContent = isMac ? '⌘' : 'Ctrl'; });

  /* ---------- Case studies ---------- */
  const CASES = {
    vms: {
      title: 'Visitor Management System', kicker: 'Enterlyze · Featured', art: 'art-vms', label: 'VMS',
      problem: 'Front desks that log visitors on paper are slow at peak hours, can’t verify who is walking in, and hosts rarely know their guest has arrived.',
      flow: [['📱', 'Visitor app'], ['💬', 'WhatsApp OTP'], ['⚙️', 'Node.js API'], ['🗄️', 'PostgreSQL + Blob'], ['🔔', 'Host notified']],
      built: [
        'Self check-in on the web and in a React Native app for kiosks and phones',
        'WhatsApp OTP verification through Twilio',
        'Visitor photo capture stored in Azure Blob Storage',
        'Pre-booking, host notifications and an admin dashboard',
        'Multi-tenant: one platform serving many companies with their data kept apart',
      ],
      outcome: [
        'Live on Google Play and the App Store',
        'Check-in in a few taps instead of a paper register',
        'Release builds optimised and shrunk for the Play Store',
      ],
      stack: ['React.js', 'React Native', 'Expo', 'Node.js', 'PostgreSQL', 'Twilio', 'Azure Blob'],
      links: [['Google Play ↗', URLS.play], ['App Store ↗', URLS.appstore]],
    },
    hrms: {
      title: 'HRMS Mobile App', kicker: 'Enterlyze · Sole developer', art: 'art-hrms', label: 'HRMS',
      problem: 'Employees wanted HR in their pocket: mark attendance, apply for leave and check their details without opening a laptop.',
      flow: [['📱', 'HRMS app'], ['🔐', 'JWT auth'], ['⚙️', 'Node.js API'], ['🗄️', 'PostgreSQL']],
      built: [
        'The complete React Native app, built solo from navigation to release builds',
        'Attendance with location and face check-in',
        'Leave requests, approvals and balances',
        'Employee self-service and a personalised home screen',
      ],
      outcome: [
        'One codebase for Android and iOS',
        'Owned end to end: screens, API integration and builds',
      ],
      stack: ['React Native', 'Expo', 'JWT', 'Node.js', 'PostgreSQL'],
      links: [],
    },
    booking: {
      title: 'Conference & Hot Desk Booking', kicker: 'Enterlyze', art: 'art-booking', label: 'BOOK',
      problem: 'Hybrid teams kept double-booking rooms and desks, and meeting links were being created by hand.',
      flow: [['🖥️', 'React app'], ['⚙️', 'Node.js API'], ['🗄️', 'PostgreSQL'], ['📅', 'Graph API → Teams']],
      built: [
        'Room and hot-desk booking with floor plans and live availability',
        'Conflict checks so a slot can never be booked twice',
        'Microsoft Teams meetings created automatically through OAuth 2.0 and the Graph API',
        'Admin tools for cities, branches, floors and desks',
      ],
      outcome: [
        'Clashes are caught before a booking is saved',
        'Booking and the Teams invite happen in one step',
      ],
      stack: ['React.js', 'Node.js', 'PostgreSQL', 'Microsoft Graph', 'OAuth 2.0'],
      links: [['Live demo ↗', URLS.bookingDemo]],
    },
    parking: {
      title: 'Car Parking', kicker: 'Enterlyze', art: 'art-park', label: 'P',
      problem: 'Office parking was first come, first served, with no way to reserve a spot or see what was free.',
      flow: [['🖥️', 'Employee app'], ['⚙️', 'Node.js API'], ['🗄️', 'PostgreSQL'], ['🛠️', 'Admin console']],
      built: [
        'Parking spot inventory and bookings',
        'Employee access rules',
        'An admin console to manage spots and bookings',
      ],
      outcome: ['Employees reserve a spot ahead instead of hunting for one'],
      stack: ['React.js', 'Node.js', 'PostgreSQL'],
      links: [],
    },
    security: {
      title: 'Security Hardening', kicker: 'Enterlyze · Platform', art: 'art-shield', label: 'SEC',
      problem: 'An external security assessment raised findings across several modules of a live product. They had to be fixed without breaking public flows like visitor check-in and OTP.',
      flow: [['🌐', 'Request'], ['🧱', 'Origin allowlist'], ['✅', 'Input validation'], ['⚙️', 'API'], ['🛡️', 'Safe response']],
      built: [
        'Server-side validation on write endpoints, mirrored in the UI',
        'HTML-escaped email templates so user input can’t inject markup',
        'Origin allowlists in place of open CORS',
        'Error responses that no longer expose internal details',
        'Outdated dependencies upgraded and re-tested',
      ],
      outcome: [
        'Findings closed and re-verified on production',
        'Public visitor and OTP flows kept working throughout',
      ],
      stack: ['Node.js', 'Express', 'React', 'OWASP'],
      links: [],
    },
    dsv: {
      title: 'Data Structures Visualizer', kicker: 'Personal project', art: 'art-dsv', label: 'DSV',
      problem: 'Data structures are hard to picture from code alone. Watching an algorithm move step by step makes it click.',
      flow: [['⌨️', 'Pick algorithm'], ['🧮', 'Step engine'], ['📊', 'D3 animation'], ['🎓', 'It clicks']],
      built: [
        'Animated sorting and searching algorithms',
        'Stacks, queues, linked lists and trees',
        'Every step animated so you can follow the logic',
      ],
      outcome: ['Open source on GitHub, with a live demo'],
      stack: ['React.js', 'D3.js', 'TailwindCSS'],
      links: [['GitHub ↗', URLS.dsv], ['Live demo ↗', URLS.dsvDemo]],
    },
  };

  /* ---------- Overlay layers (case study + palette) ---------- */
  const layers = [];
  const isOpen = (layer) => layer.classList.contains('open');
  function openLayer(layer, focusEl) {
    clearTimeout(layer._hideTimer);
    layer._returnFocus = document.activeElement;
    layer.hidden = false;
    void layer.offsetWidth; // let the fade-in transition run
    layer.classList.add('open');
    body.classList.add('modal-open');
    focusEl?.focus({ preventScroll: true });
  }
  function closeLayer(layer) {
    if (!isOpen(layer)) return;
    layer.classList.remove('open');
    if (!layers.some(isOpen)) body.classList.remove('modal-open');
    layer._hideTimer = setTimeout(() => { layer.hidden = true; }, reduceMotion ? 0 : 280);
    layer._returnFocus?.focus?.({ preventScroll: true });
  }
  function trapFocus(layer) {
    layer.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const f = $$('button, a[href], input', layer).filter((el) => el.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  const caseLayer = document.createElement('div');
  caseLayer.className = 'cs-overlay';
  caseLayer.hidden = true;
  caseLayer.innerHTML = '<div class="cs-dialog" role="dialog" aria-modal="true" aria-labelledby="csTitle"><button type="button" class="cs-close" aria-label="Close case study">&times;</button><div class="cs-body"></div></div>';
  body.appendChild(caseLayer);
  layers.push(caseLayer);
  trapFocus(caseLayer);
  caseLayer.addEventListener('click', (e) => { if (e.target === caseLayer) closeLayer(caseLayer); });
  $('.cs-close', caseLayer).addEventListener('click', () => closeLayer(caseLayer));

  function openCase(key) {
    const c = CASES[key];
    if (!c) return;
    const flow = c.flow.map(([icon, label], i) =>
      `${i ? `<span class="flow-link" style="--i:${i}" aria-hidden="true"></span>` : ''}<div class="flow-node" style="--i:${i}"><span class="flow-icon" aria-hidden="true">${icon}</span><span>${esc(label)}</span></div>`).join('');
    const list = (items) => items.map((t) => `<li>${esc(t)}</li>`).join('');
    $('.cs-body', caseLayer).innerHTML = `
      <div class="work-art cs-hero ${c.art}" aria-hidden="true"><span>${esc(c.label)}</span></div>
      <div class="cs-content">
        <p class="work-kicker">${esc(c.kicker)}</p>
        <h3 id="csTitle">${esc(c.title)}</h3>
        <div class="cs-section"><h4>The problem</h4><p>${esc(c.problem)}</p></div>
        <div class="cs-section"><h4>How it flows</h4><div class="flow">${flow}</div></div>
        <div class="cs-grid">
          <div><h4>What I built</h4><ul class="tl-points">${list(c.built)}</ul></div>
          <div><h4>Outcome</h4><ul class="tl-points">${list(c.outcome)}</ul></div>
        </div>
        <h4>Stack</h4>
        <ul class="chips small">${list(c.stack)}</ul>
        ${c.links.length ? `<div class="work-links">${c.links.map(([l, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(l)}</a>`).join('')}</div>` : ''}
      </div>`;
    $('.cs-dialog', caseLayer).scrollTop = 0;
    openLayer(caseLayer, $('.cs-close', caseLayer));
  }

  // "Case study →" on every project card (and the card art opens it too).
  $$('.work-card[data-case]').forEach((card) => {
    const key = card.dataset.case;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'case-btn';
    btn.innerHTML = 'Case study <span class="arr" aria-hidden="true">→</span>';
    btn.setAttribute('aria-label', `Open case study: ${CASES[key]?.title || key}`);
    btn.addEventListener('click', () => openCase(key));
    let links = $('.work-links', card);
    if (!links) {
      links = document.createElement('div');
      links.className = 'work-links';
      $('.work-body', card).appendChild(links);
    }
    links.prepend(btn);
    const art = $('.work-art', card);
    art.classList.add('clickable');
    art.addEventListener('click', () => openCase(key));
  });

  /* ---------- Effects: confetti + matrix ---------- */
  function confetti() {
    if (reduceMotion) { toast('🎉 Great choice!'); return; }
    const c = document.createElement('canvas');
    c.className = 'fx-canvas';
    body.appendChild(c);
    const ctx = c.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = innerWidth, H = innerHeight;
    c.width = W * dpr; c.height = H * dpr; ctx.scale(dpr, dpr);
    const colors = ['#22d3ee', '#a78bfa', '#f472b6', '#facc15', '#34d399'];
    const parts = Array.from({ length: 200 }, (_, i) => {
      const left = i % 2 === 0;
      return {
        x: left ? -10 : W + 10, y: H * 0.85,
        vx: (left ? 1 : -1) * (Math.random() * 11 + 5), vy: -(Math.random() * 16 + 10),
        s: Math.random() * 8 + 5, r: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.35,
        c: colors[(Math.random() * colors.length) | 0],
      };
    });
    const start = performance.now(), DUR = 3400;
    (function frame(t) {
      const el = t - start;
      ctx.clearRect(0, 0, W, H);
      ctx.globalAlpha = Math.max(0, 1 - Math.max(0, el - DUR * 0.6) / (DUR * 0.4));
      for (const p of parts) {
        p.vy += 0.38; p.vx *= 0.985; p.x += p.vx; p.y += p.vy; p.r += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
        ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
        ctx.restore();
      }
      if (el < DUR) requestAnimationFrame(frame); else c.remove();
    })(start);
  }

  let matrixOn = false;
  async function matrix() {
    if (matrixOn) return;
    if (reduceMotion) { toast('Wake up, recruiter… Vedant is open to work. 🐇'); return; }
    matrixOn = true;
    const c = document.createElement('canvas');
    c.className = 'fx-canvas matrix';
    const msg = document.createElement('div');
    msg.className = 'matrix-msg';
    msg.innerHTML = '<p></p><small>click or press any key to exit</small>';
    body.append(c, msg);
    const ctx = c.getContext('2d');
    const W = (c.width = innerWidth), H = (c.height = innerHeight);
    const fs = 16, drops = Array.from({ length: Math.ceil(W / fs) }, () => Math.random() * -40);
    const chars = 'アカサタナハマヤラワ0123456789{}<>/=;VEDANTPOTDAR';
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
    requestAnimationFrame(() => c.classList.add('on'));
    let last = 0, raf;
    const tick = (t) => {
      raf = requestAnimationFrame(tick);
      if (t - last < 45) return;
      last = t;
      ctx.fillStyle = 'rgba(0,0,0,0.08)'; ctx.fillRect(0, 0, W, H);
      ctx.font = `${fs}px "JetBrains Mono", monospace`;
      drops.forEach((y, i) => {
        ctx.fillStyle = Math.random() > 0.96 ? '#d1fae5' : '#22c55e';
        ctx.fillText(chars[(Math.random() * chars.length) | 0], i * fs, y * fs);
        drops[i] = y * fs > H && Math.random() > 0.975 ? 0 : y + 1;
      });
    };
    raf = requestAnimationFrame(tick);

    const stop = () => {
      if (!matrixOn) return;
      matrixOn = false;
      cancelAnimationFrame(raf);
      clearTimeout(autoStop);
      removeEventListener('keydown', stop);
      c.classList.remove('on'); msg.classList.add('out');
      setTimeout(() => { c.remove(); msg.remove(); }, 600);
    };
    const autoStop = setTimeout(stop, 10000);
    setTimeout(() => { if (matrixOn) { addEventListener('keydown', stop); c.addEventListener('click', stop); } }, 500);

    const p = $('p', msg);
    for (const line of ['Wake up, recruiter…', 'The portfolio has you.', 'Follow the white rabbit: Vedant is open to work. 🐇']) {
      await sleep(900);
      if (!matrixOn) return;
      p.textContent = '';
      for (const ch of line) { if (!matrixOn) return; p.textContent += ch; await sleep(55); }
      await sleep(1100);
    }
  }

  function hireVedant() {
    confetti();
    toast('🎉 Excellent decision! Taking you to contact…');
    setTimeout(() => goTo('contact'), 700);
  }

  // Konami code: ↑ ↑ ↓ ↓ ← → ← → B A
  const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let kPos = 0;
  document.addEventListener('keydown', (e) => {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (k === KONAMI[kPos]) { kPos++; if (kPos === KONAMI.length) { kPos = 0; matrix(); } }
    else kPos = k === KONAMI[0] ? 1 : 0;
  });

  /* ---------- Live terminal ---------- */
  const term = $('#terminal');
  const termHistory = [];
  let hIdx = 0, termInput = null;
  const SECTIONS = ['home', 'about', 'skills', 'experience', 'work', 'education', 'contact'];
  const JOKES = [
    'Why do programmers prefer dark mode? Because light attracts bugs. 🐛',
    'There are 10 kinds of people: those who understand binary and those who don’t.',
    'A SQL query walks into a bar, walks up to two tables and asks: “Can I join you?”',
    'I’d tell you a UDP joke, but you might not get it.',
    '“It works on my machine.” “Great, then we’ll ship your machine.” 📦',
  ];
  const joke = () => JOKES[(Math.random() * JOKES.length) | 0];

  const tOut = (html, cls = 'out') => {
    const s = document.createElement('span');
    s.className = cls;
    s.innerHTML = html;
    term.appendChild(s);
    return s;
  };
  const row = (cmd, desc) => `<span class="t-cmd">${cmd}</span><span class="dim">${desc}</span>`;
  const link = (label, url) => `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(label)}</a>`;

  const TERM = {
    help: () => {
      [
        row('about', 'who I am'), row('skills', 'my tech stack'), row('projects', 'things I’ve built'),
        row('open &lt;name&gt;', 'open a case study, e.g. open vms'), row('experience', 'where I’ve worked'),
        row('education', 'degrees'), row('contact', 'how to reach me'), row('resume', 'open my resume'),
        row('cd &lt;section&gt;', 'scroll to a section'), row('theme', 'toggle light / dark'),
        row('chat', 'open my assistant'), row('clear', 'clear the screen'),
      ].forEach((r) => tOut(r, 'out t-row'));
      tOut('<span class="dim">psst… a few commands are hidden 👀</span>');
    },
    about: () => {
      tOut('<span class="hl">Vedant Potdar</span> · Full Stack Developer · Mumbai, India');
      tOut('I build multi-tenant SaaS products for web and mobile, and I like owning a feature end to end: schema, API, screen and release.');
    },
    whoami: () => tOut('<span class="hl">Vedant Potdar</span> · Full Stack Developer'),
    skills: () => {
      [
        ['frontend', 'React.js · React Native · JavaScript · TailwindCSS'],
        ['backend', 'Node.js · Express · REST APIs · cron jobs'],
        ['data', 'PostgreSQL · MySQL · Prisma · Redis'],
        ['cloud', 'AWS (EC2, S3, IAM) · Azure Blob'],
        ['auth/apis', 'JWT · OAuth 2.0 · Microsoft Graph · Twilio'],
      ].forEach(([k, v]) => tOut(row(k, v), 'out t-row'));
    },
    projects: () => {
      Object.entries(CASES).forEach(([k, c]) => tOut(row(k, esc(c.title)), 'out t-row'));
      tOut('<span class="dim">run</span> <span class="hl">open vms</span> <span class="dim">(or any name above) for the case study</span>');
    },
    open: (args) => {
      const k = (args[0] || '').toLowerCase();
      if (CASES[k]) { tOut(`opening <span class="hl">${esc(CASES[k].title)}</span>…`); openCase(k); }
      else tOut(`usage: open &lt;${Object.keys(CASES).join(' | ')}&gt;`, 'out err');
    },
    experience: () => {
      tOut(row('2026 → now', 'Associate Software Developer · Enterlyze Pvt. Ltd.'), 'out t-row');
      tOut(row('2025 – 2026', 'Associate Developer &amp; intern · Infocloud IT Services'), 'out t-row');
      tOut(row('2024', 'Software Developer Intern · P-Webcraft Technology'), 'out t-row');
    },
    education: () => {
      tOut(row('2022 – 2025', 'B.E. Computer Engineering · University of Mumbai'), 'out t-row');
      tOut(row('2019 – 2022', 'Diploma in Computer Engineering · MSBTE · 77.03%'), 'out t-row');
    },
    contact: () => {
      tOut(row('email', link(EMAIL, `mailto:${EMAIL}`)), 'out t-row');
      tOut(row('linkedin', link('vedant-potdar', URLS.linkedin)), 'out t-row');
      tOut(row('github', link('Vedpotdar', URLS.github)), 'out t-row');
    },
    resume: () => { tOut('opening resume.pdf…'); openUrl(RESUME); },
    github: () => { tOut(`opening ${link('github.com/Vedpotdar', URLS.github)}…`); openUrl(URLS.github); },
    linkedin: () => { tOut('opening LinkedIn…'); openUrl(URLS.linkedin); },
    theme: () => { toggleTheme(); tOut(`theme switched to <span class="hl">${root.dataset.theme}</span>`); },
    cd: (args) => {
      const s = (args[0] || '').replace(/^[~./]+/, '').replace(/\/$/, '').toLowerCase();
      if (!s) { goTo('home'); tOut('→ ~'); }
      else if (SECTIONS.includes(s)) { goTo(s); tOut(`→ ~/${esc(s)}`); }
      else if (s === '..') tOut('you’re already at the top level 🙂');
      else tOut(`cd: no such section: ${esc(s)}`, 'out err');
    },
    ls: () => tOut(`${SECTIONS.slice(1).map((s) => `<span class="t-dir">${s}/</span>`).join('  ')}  resume.pdf  focus.txt  secrets.txt`),
    cat: (args) => {
      const f = (args[0] || '').toLowerCase();
      if (f === 'focus.txt') tOut('React.js · React Native · Node.js · PostgreSQL');
      else if (f === 'resume.pdf') TERM.resume();
      else if (f === 'secrets.txt') tOut('🔒 permission denied. Some secrets stay secret.', 'out err');
      else tOut(`cat: ${esc(f || '?')}: no such file`, 'out err');
    },
    pwd: () => tOut('/home/vedant/portfolio'),
    date: () => tOut(esc(new Date().toString())),
    echo: (_, raw) => tOut(esc(raw.replace(/^echo\s?/i, ''))),
    history: () => termHistory.forEach((h, i) => tOut(`${String(i + 1).padStart(3)}  ${esc(h)}`)),
    clear: () => { term.innerHTML = ''; },
    sudo: (args) => {
      const a = args.join(' ').toLowerCase();
      if (/^hire[-\s]?vedant/.test(a)) {
        tOut('[sudo] password for recruiter: ********');
        tOut('<span class="ok">✔ permission granted.</span> Excellent decision! 🎉');
        hireVedant();
      } else if (a.startsWith('rm')) tOut('nice try 🙂', 'out err');
      else tOut('recruiter is not in the sudoers file. This incident will be reported 😄<br><span class="dim">hint: try</span> <span class="hl">sudo hire-vedant</span>');
    },
    'hire-vedant': () => tOut('permission denied. Try: <span class="hl">sudo hire-vedant</span>', 'out err'),
    rm: () => tOut('rm: refusing to delete a perfectly good portfolio 🙂', 'out err'),
    coffee: () => {
      tOut(esc(['    ( (', '     ) )', '  ........', '  |      |]', '  \\      /', "   `----'"].join('\n')), 'out ascii');
      tOut('brewing… coffee level: <span class="hl">Infinity</span> ☕');
    },
    joke: () => tOut(esc(joke())),
    matrix: () => { tOut('follow the white rabbit… 🐇'); matrix(); },
    chat: () => { tOut('opening assistant…'); openChat(); },
    exit: () => tOut('logout… just kidding, you can’t leave that easily 😄'),
    vim: () => tOut('you are now stuck in vim forever. Just kidding: this terminal has no vim. 😅'),
  };
  const TERM_NAMES = Object.keys(TERM).filter((n) => n !== 'hire-vedant');

  function newPrompt() {
    const line = document.createElement('div');
    line.className = 'term-line';
    line.innerHTML = '<span class="prompt">➜</span> <input class="term-input" type="text" aria-label="Type a terminal command, then press Enter" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="send">';
    term.appendChild(line);
    termInput = $('input', line);
    termInput.addEventListener('keydown', onTermKey);
    term.scrollTop = term.scrollHeight;
  }
  function runTerm(raw) {
    if (!raw) return;
    const [name, ...args] = raw.split(/\s+/);
    const fn = TERM[name.toLowerCase()];
    if (fn) fn(args, raw);
    else tOut(`command not found: ${esc(name)}. Type <span class="hl">help</span>`, 'out err');
  }
  function onTermKey(e) {
    const input = e.currentTarget;
    if (e.key === 'Enter') {
      e.preventDefault();
      const raw = input.value.trim();
      const line = input.parentElement;
      line.innerHTML = '<span class="prompt">➜</span> <span class="cmd"></span>';
      $('.cmd', line).textContent = raw;
      if (raw) termHistory.push(raw);
      hIdx = termHistory.length;
      runTerm(raw);
      newPrompt();
      termInput.focus({ preventScroll: true });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (hIdx > 0) { hIdx--; input.value = termHistory[hIdx]; }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (hIdx < termHistory.length) { hIdx++; input.value = termHistory[hIdx] || ''; }
    } else if (e.key === 'Tab' && input.value.trim()) {
      // Autocomplete commands, case names (open …) and sections (cd …).
      e.preventDefault();
      const parts = input.value.replace(/^\s+/, '').split(/\s+/);
      const pool = parts.length === 1 ? TERM_NAMES
        : parts[0] === 'open' ? Object.keys(CASES)
        : parts[0] === 'cd' ? SECTIONS
        : [];
      const cur = parts[parts.length - 1].toLowerCase();
      const hits = pool.filter((n) => n.startsWith(cur));
      if (hits.length === 1) { parts[parts.length - 1] = hits[0]; input.value = `${parts.join(' ')} `; }
      else if (hits.length > 1) {
        const s = document.createElement('span');
        s.className = 'out dim';
        s.textContent = hits.join('  ');
        term.insertBefore(s, input.parentElement);
        term.scrollTop = term.scrollHeight;
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      term.innerHTML = '';
      newPrompt();
      termInput.focus({ preventScroll: true });
    }
  }
  // script.js fires this once the intro script has finished typing.
  document.addEventListener('terminal:ready', () => {
    tOut('<span class="dim">this terminal is live. Type</span> <span class="hl">help</span> <span class="dim">and press Enter.</span>');
    newPrompt();
    term.classList.add('live');
  });
  term.addEventListener('click', () => {
    if (termInput && !String(window.getSelection())) termInput.focus({ preventScroll: true });
  });
  function focusTerminal() {
    goTo('about');
    setTimeout(() => termInput?.focus({ preventScroll: true }), reduceMotion ? 0 : 700);
  }

  /* ---------- Command palette ---------- */
  const SEARCH_SVG = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>';
  const COMMANDS = [
    ...[['home', '🏠', 'Home'], ['about', '👋', 'About'], ['skills', '🧰', 'Skills'], ['experience', '💼', 'Experience'],
      ['work', '🚀', 'Work'], ['education', '🎓', 'Education'], ['contact', '✉️', 'Contact']]
      .map(([id, icon, label]) => ({ g: 'Go to', icon, label, run: () => goTo(id) })),
    { g: 'Actions', icon: '📄', label: 'Open resume', hint: 'PDF', run: () => openUrl(RESUME) },
    { g: 'Actions', icon: '📋', label: 'Copy email', hint: EMAIL, run: copyEmail },
    { g: 'Actions', icon: '💬', label: 'Ask my assistant', hint: 'chatbot', run: () => openChat() },
    { g: 'Actions', icon: '⌨️', label: 'Use the terminal', hint: 'type help', run: focusTerminal },
    { g: 'Actions', icon: '🌓', label: 'Toggle light / dark theme', run: toggleTheme },
    ...Object.entries(CASES).map(([k, c]) => ({ g: 'Case studies', icon: '📂', label: c.title, run: () => openCase(k) })),
    { g: 'Links', icon: '🐙', label: 'GitHub', hint: 'Vedpotdar', run: () => openUrl(URLS.github) },
    { g: 'Links', icon: '💼', label: 'LinkedIn', run: () => openUrl(URLS.linkedin) },
    { g: 'Links', icon: '▶️', label: 'App on Google Play', run: () => openUrl(URLS.play) },
    { g: 'Links', icon: '🍎', label: 'App on the App Store', run: () => openUrl(URLS.appstore) },
    { g: 'Fun', icon: '🎉', label: 'Hire Vedant', run: hireVedant },
    { g: 'Fun', icon: '🟩', label: 'Enter the Matrix', run: matrix },
    { g: 'Fun', icon: '😄', label: 'Tell me a dev joke', run: () => toast(joke()) },
  ];

  const pal = document.createElement('div');
  pal.className = 'cmdk-overlay';
  pal.hidden = true;
  pal.innerHTML = `<div class="cmdk" role="dialog" aria-modal="true" aria-label="Command palette">
      <div class="cmdk-input-row">${SEARCH_SVG}<input class="cmdk-input" type="text" placeholder="Search sections, projects, actions…" autocomplete="off" spellcheck="false" role="combobox" aria-expanded="true" aria-controls="cmdkList" aria-autocomplete="list"><kbd>Esc</kbd></div>
      <div class="cmdk-list" id="cmdkList" role="listbox" aria-label="Commands"></div>
      <div class="cmdk-foot"><span><kbd>↑</kbd> <kbd>↓</kbd> move</span><span><kbd>↵</kbd> run</span><span><kbd>${isMac ? '⌘' : 'Ctrl'}</kbd> <kbd>K</kbd> toggle</span></div>
    </div>`;
  body.appendChild(pal);
  layers.push(pal);
  const palInput = $('.cmdk-input', pal), palList = $('.cmdk-list', pal);
  let palItems = [], palSel = 0;

  const fuzzy = (q, s) => {
    q = q.toLowerCase(); s = s.toLowerCase();
    if (!q) return 1;
    const at = s.indexOf(q);
    if (at >= 0) return 1000 - at;
    let last = -1, score = 0;
    for (const ch of q) {
      const j = s.indexOf(ch, last + 1);
      if (j < 0) return 0;
      score += j === last + 1 ? 3 : 1;
      last = j;
    }
    return score;
  };
  function renderPalette() {
    const q = palInput.value.trim();
    palItems = COMMANDS.map((c) => ({ c, s: fuzzy(q, `${c.label} ${c.g} ${c.hint || ''}`) })).filter((x) => x.s > 0);
    if (q) palItems.sort((a, b) => b.s - a.s);
    palList.innerHTML = '';
    if (!palItems.length) {
      palList.innerHTML = '<div class="cmdk-empty">No results. Try “resume”, “vms” or “contact”.</div>';
      palInput.removeAttribute('aria-activedescendant');
      return;
    }
    let lastGroup = null;
    palItems.forEach(({ c }, i) => {
      if (!q && c.g !== lastGroup) {
        lastGroup = c.g;
        const g = document.createElement('div');
        g.className = 'cmdk-group';
        g.textContent = c.g;
        palList.appendChild(g);
      }
      const el = document.createElement('div');
      el.className = 'cmdk-item';
      el.id = `cmdk-${i}`;
      el.setAttribute('role', 'option');
      el.innerHTML = `<span class="ci" aria-hidden="true">${c.icon}</span><span class="cl">${esc(c.label)}</span>${c.hint ? `<span class="ch">${esc(c.hint)}</span>` : ''}`;
      el.addEventListener('click', () => runPalette(i));
      el.addEventListener('mousemove', () => { if (palSel !== i) selectPalette(i); });
      palList.appendChild(el);
    });
    selectPalette(0);
  }
  function selectPalette(i) {
    palSel = i;
    $$('.cmdk-item', palList).forEach((el, j) => el.setAttribute('aria-selected', String(j === i)));
    const el = document.getElementById(`cmdk-${i}`);
    if (el) { el.scrollIntoView({ block: 'nearest' }); palInput.setAttribute('aria-activedescendant', el.id); }
  }
  function runPalette(i) {
    const item = palItems[i];
    if (!item) return;
    closeLayer(pal);
    setTimeout(() => item.c.run(), 80);
  }
  function openPalette() {
    palInput.value = '';
    renderPalette();
    openLayer(pal, palInput);
  }
  palInput.addEventListener('input', renderPalette);
  palInput.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); if (palItems.length) selectPalette((palSel + 1) % palItems.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (palItems.length) selectPalette((palSel - 1 + palItems.length) % palItems.length); }
    else if (e.key === 'Enter') { e.preventDefault(); runPalette(palSel); }
    else if (e.key === 'Tab') e.preventDefault(); // keep focus in the palette
  });
  pal.addEventListener('click', (e) => { if (e.target === pal) closeLayer(pal); });
  $('#cmdkBtn')?.addEventListener('click', openPalette);

  /* ---------- "Ask Vedant" assistant ---------- */
  const fab = document.createElement('button');
  fab.type = 'button';
  fab.className = 'chat-fab';
  fab.setAttribute('aria-label', 'Chat with Vedant’s assistant');
  fab.setAttribute('aria-expanded', 'false');
  fab.setAttribute('aria-controls', 'chatPanel');
  fab.innerHTML = '<svg class="ic-chat" viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/><path d="M8.5 12h.01M12 12h.01M15.5 12h.01"/></svg><svg class="ic-close" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';

  const nudge = document.createElement('button');
  nudge.type = 'button';
  nudge.className = 'chat-nudge';
  nudge.tabIndex = -1;
  nudge.innerHTML = '👋 Hi! Ask me anything about Vedant.';

  const chat = document.createElement('section');
  chat.className = 'chat';
  chat.id = 'chatPanel';
  chat.setAttribute('role', 'dialog');
  chat.setAttribute('aria-label', 'Chat with Vedant’s assistant');
  chat.inert = true;
  chat.innerHTML = `
    <header class="chat-head">
      <div class="chat-avatar" aria-hidden="true">VP</div>
      <div class="chat-id"><strong>Vedant’s assistant</strong><span><i></i> Online · replies instantly</span></div>
      <button type="button" class="chat-x" aria-label="Close chat">&times;</button>
    </header>
    <div class="chat-log" role="log" aria-live="polite"></div>
    <div class="chat-chips" aria-label="Suggested questions"></div>
    <form class="chat-form" autocomplete="off">
      <input class="chat-input" type="text" placeholder="Ask about skills, projects, experience…" aria-label="Your question" maxlength="200" enterkeyhint="send">
      <button type="submit" class="chat-send" aria-label="Send"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>
    </form>`;
  body.append(chat, nudge, fab);

  const log = $('.chat-log', chat), chipsEl = $('.chat-chips', chat), chatInput = $('.chat-input', chat);
  const DEFAULT_CHIPS = ['💼 Experience', '🧰 Skills', '🚀 Projects', '📱 Mobile apps', '📄 Resume', '✉️ Contact', '😄 Tell me a joke'];
  let greeted = false, queue = Promise.resolve();

  const greeting = () => {
    const h = new Date().getHours();
    return h < 5 ? 'Hey there, night owl' : h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  };
  const scrollLog = () => { log.scrollTop = log.scrollHeight; };

  function addUser(text) {
    const m = document.createElement('div');
    m.className = 'msg user';
    m.textContent = text;
    log.appendChild(m);
    scrollLog();
  }
  function addBot(reply) {
    const m = document.createElement('div');
    m.className = 'msg bot';
    m.innerHTML = reply.html;
    if (reply.actions?.length) {
      const a = document.createElement('div');
      a.className = 'msg-actions';
      reply.actions.forEach(([label, fn]) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.textContent = label;
        b.addEventListener('click', fn);
        a.appendChild(b);
      });
      m.appendChild(a);
    }
    log.appendChild(m);
    scrollLog();
  }
  function renderChips(list = DEFAULT_CHIPS) {
    chipsEl.innerHTML = '';
    list.forEach((t) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = t;
      b.addEventListener('click', () => send(t));
      chipsEl.appendChild(b);
    });
  }
  function botSay(reply) {
    queue = queue.then(async () => {
      const t = document.createElement('div');
      t.className = 'msg bot typing';
      t.setAttribute('aria-label', 'Assistant is typing');
      t.innerHTML = '<span></span><span></span><span></span>';
      log.appendChild(t);
      scrollLog();
      await sleep(Math.min(450 + reply.html.length * 2.5, 1300));
      t.remove();
      addBot(reply);
      reply.after?.();
      renderChips(reply.chips);
    });
  }
  function send(text) {
    text = String(text).trim();
    if (!text) return;
    addUser(text);
    botSay(answer(text));
  }

  // Intent matching: keyword + light fuzzy match, no AI and no network.
  const caseActions = (k) => [['Open case study', () => openCase(k)], ...CASES[k].links.map(([l, u]) => [l, () => openUrl(u)])];
  const R = {
    hire: () => ({ html: '<p>🎉 <strong>Permission granted.</strong> Excellent decision!</p><p>Next step: drop Vedant a line and let’s make it official.</p>', actions: [['Email him', mailMe], ['Copy email', copyEmail]], after: confetti }),
    vms: () => ({ html: '<p><strong>Visitor Management System</strong>: visitor self check-in on web and mobile with WhatsApp OTP, photo capture, host notifications and an admin dashboard.</p><p>The check-in app is live on Google Play and the App Store.</p>', actions: caseActions('vms') }),
    hrms: () => ({ html: '<p>Vedant is the <strong>sole developer of the HRMS mobile app</strong> (React Native): attendance with location and face check-in, leave, and employee self-service.</p>', actions: caseActions('hrms') }),
    booking: () => ({ html: '<p><strong>Conference &amp; Hot Desk Booking</strong>: floor plans, live availability, conflict checks, and Microsoft Teams meetings created automatically through the Graph API.</p>', actions: caseActions('booking') }),
    parking: () => ({ html: '<p><strong>Car Parking</strong>: spots, bookings, employee access rules and an admin console.</p>', actions: caseActions('parking') }),
    security: () => ({ html: '<p>He closed findings from an external security assessment across several modules: <strong>server-side validation, HTML-safe emails, origin allowlists and clean error responses</strong>, all re-verified on production.</p>', actions: caseActions('security') }),
    dsv: () => ({ html: '<p><strong>Data Structures Visualizer</strong> is his personal project: sorting, searching, stacks, queues, linked lists and trees, animated step by step with React and D3.</p>', actions: caseActions('dsv') }),
    resume: () => ({ html: '<p>📄 Here’s his latest resume (PDF).</p>', actions: [['Open resume', () => openUrl(RESUME)]] }),
    contact: () => ({ html: `<p>📧 <strong>${EMAIL}</strong><br>📞 +91 95450 99800<br>💼 LinkedIn: vedant-potdar</p>`, actions: [['Email him', mailMe], ['Copy email', copyEmail], ['LinkedIn', () => openUrl(URLS.linkedin)]] }),
    available: () => ({ html: '<p>Yes! Vedant is <strong>open to new opportunities</strong>: full-time roles, freelance work and interesting products.</p><p>Email is the fastest way to reach him.</p>', actions: [['Email him', mailMe], ['Open resume', () => openUrl(RESUME)], ['LinkedIn', () => openUrl(URLS.linkedin)]] }),
    salary: () => ({ html: '<p>Compensation and notice period are best discussed with Vedant directly.</p>', actions: [['Email him', mailMe], ['LinkedIn', () => openUrl(URLS.linkedin)]] }),
    mobile: () => ({ html: '<p>Yes, he ships <strong>React Native</strong> apps:</p><ul><li>The Enterlyze visitor check-in app, live on Google Play and the App Store</li><li>The HRMS mobile app, which he built as sole developer</li></ul>', actions: [['Google Play', () => openUrl(URLS.play)], ['App Store', () => openUrl(URLS.appstore)], ['HRMS case study', () => openCase('hrms')]] }),
    skills: () => ({ html: '<p>His everyday stack:</p><ul><li><strong>Frontend:</strong> React.js, React Native, JavaScript, TailwindCSS</li><li><strong>Backend:</strong> Node.js, Express, REST APIs, cron jobs</li><li><strong>Data:</strong> PostgreSQL, MySQL, Prisma, Redis</li><li><strong>Cloud:</strong> AWS (EC2, S3, IAM), Azure Blob</li><li><strong>Auth &amp; APIs:</strong> JWT, OAuth 2.0, Microsoft Graph, Twilio</li></ul>', actions: [['See skills', () => goTo('skills')]] }),
    experience: () => ({ html: '<p><strong>Associate Software Developer, Enterlyze Pvt. Ltd.</strong> (Sep 2026 – now): building a live workplace platform on web, Android and iOS.</p><ul><li>Infocloud IT Services: Associate Developer (Dec 2025 – Aug 2026), intern before that</li><li>P-Webcraft Technology: frontend intern (Jul – Dec 2024)</li></ul>', actions: [['View timeline', () => goTo('experience')]] }),
    projects: () => ({ html: '<p>Here’s what he has built. Tap one for the full case study 👇</p>', actions: Object.entries(CASES).map(([k, c]) => [c.title, () => openCase(k)]) }),
    education: () => ({ html: '<ul><li><strong>B.E. Computer Engineering</strong>, YTCEM, University of Mumbai (2022 – 2025)</li><li><strong>Diploma in Computer Engineering</strong>, ICARE, MSBTE (2019 – 2022), 77.03%</li></ul>' }),
    location: () => ({ html: '<p>📍 Based in <strong>Mumbai, India</strong>.</p><p>For remote or relocation questions, best to ask him directly.</p>', actions: [['Email him', mailMe]] }),
    github: () => ({ html: '<p>🐙 His GitHub is <strong>Vedpotdar</strong>. The Data Structures Visualizer is open source there.</p>', actions: [['GitHub profile', () => openUrl(URLS.github)], ['DSV repo', () => openUrl(URLS.dsv)]] }),
    linkedin: () => ({ html: '<p>💼 Connect with him on LinkedIn.</p>', actions: [['Open LinkedIn', () => openUrl(URLS.linkedin)]] }),
    about: () => ({ html: '<p><strong>Vedant Potdar</strong> is a Full Stack Developer from Mumbai who builds multi-tenant SaaS products for web and mobile.</p><p>He likes owning a feature end to end: the database schema, the API, the screen and the release.</p>', actions: [['About section', () => goTo('about')], ['Open resume', () => openUrl(RESUME)]] }),
    bot: () => ({ html: `<p>🤖 I’m a small scripted assistant Vedant built into this site. No external AI and no tracking: my answers come straight from his portfolio.</p><p>Psst… there’s a live terminal in the About section, and a command palette on <kbd>${isMac ? '⌘' : 'Ctrl'}</kbd> <kbd>K</kbd>.</p>`, actions: [['Try the terminal', () => { closeChat(); focusTerminal(); }], ['Command palette', () => { closeChat(); openPalette(); }]] }),
    joke: () => ({ html: `<p>${esc(joke())}</p>`, actions: [['Another one 😄', () => send('Another joke')]] }),
    coffee: () => ({ html: '<p>☕ Coffee level: <strong>Infinity</strong>. It’s in developer.js, so it must be true.</p>' }),
    matrix: () => ({ html: '<p>🟩 Follow the white rabbit…</p>', after: () => setTimeout(matrix, 400) }),
    thanks: () => ({ html: '<p>Anytime! 🙌 Anything else you’d like to know?</p>' }),
    bye: () => ({ html: '<p>Thanks for stopping by! 👋 Grab the resume on your way out.</p>', actions: [['Open resume', () => openUrl(RESUME)]] }),
    greet: () => ({ html: `<p>${greeting()}! 👋 What would you like to know about Vedant?</p>` }),
  };
  // Order matters: on a tie, the earlier (more specific) intent wins.
  const INTENTS = [
    ['hire', ['sudo hire', 'hire vedant', 'hire him', 'you are hired', 'youre hired']],
    ['vms', ['vms', 'visitor', 'visitors', 'check in', 'checkin', 'kiosk', 'otp', 'twilio', 'whatsapp']],
    ['hrms', ['hrms', 'payroll', 'attendance', 'leave', 'hr app', 'face']],
    ['booking', ['conference', 'hot desk', 'hotdesk', 'desk', 'room', 'meeting', 'teams', 'graph', 'booking']],
    ['parking', ['parking', 'car', 'spot']],
    ['security', ['security', 'vapt', 'secure', 'owasp', 'cors', 'xss', 'injection', 'hardening', 'pentest']],
    ['dsv', ['dsv', 'data structure', 'data structures', 'visualizer', 'visualiser', 'algorithm', 'algorithms', 'd3', 'sorting']],
    ['resume', ['resume', 'cv', 'biodata']],
    ['salary', ['salary', 'ctc', 'package', 'notice', 'notice period', 'compensation', 'expected']],
    ['available', ['hire', 'hiring', 'available', 'availability', 'open to work', 'job', 'opportunity', 'opportunities', 'freelance', 'position', 'vacancy', 'join']],
    ['contact', ['contact', 'email', 'mail', 'phone', 'call', 'reach', 'connect', 'number', 'talk']],
    ['mobile', ['mobile', 'android', 'ios', 'app store', 'play store', 'react native', 'apps', 'app']],
    ['experience', ['experience', 'work', 'worked', 'company', 'companies', 'career', 'enterlyze', 'infocloud', 'webcraft', 'intern', 'internship', 'years']],
    ['skills', ['skill', 'skills', 'stack', 'tech', 'technology', 'technologies', 'languages', 'tools', 'frontend', 'backend', 'database', 'cloud', 'aws', 'azure', 'react', 'node', 'postgres', 'postgresql', 'javascript']],
    ['projects', ['project', 'projects', 'built', 'build', 'portfolio', 'showcase', 'case study', 'case studies']],
    ['education', ['education', 'degree', 'college', 'university', 'studied', 'diploma', 'qualification', 'bachelor', 'engineering']],
    ['location', ['location', 'where', 'based', 'city', 'live', 'mumbai', 'relocate', 'relocation', 'remote']],
    ['github', ['github', 'repo', 'repos', 'code', 'open source']],
    ['linkedin', ['linkedin']],
    ['bot', ['bot', 'ai', 'gpt', 'chatgpt', 'claude', 'robot', 'human', 'who made', 'who built', 'how does this work']],
    ['joke', ['joke', 'jokes', 'funny', 'laugh', 'bored']],
    ['coffee', ['coffee', 'chai', 'tea']],
    ['matrix', ['matrix', 'neo', 'red pill', 'white rabbit']],
    ['about', ['who', 'yourself', 'himself', 'summary', 'intro', 'introduce', 'vedant', 'background']],
    ['thanks', ['thanks', 'thank', 'thx', 'great', 'awesome', 'nice', 'cool', 'ok', 'okay']],
    ['bye', ['bye', 'goodbye', 'see you', 'cya']],
    ['greet', ['hi', 'hello', 'hey', 'hii', 'hiii', 'namaste', 'yo', 'sup', 'hola', 'good morning', 'good evening', 'good afternoon']],
  ];
  const lev = (a, b) => {
    if (Math.abs(a.length - b.length) > 1) return 2;
    const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 1; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
    }
    return d[a.length][b.length];
  };
  function answer(text) {
    const norm = ` ${text.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9.+#\s]/g, ' ').replace(/\s+/g, ' ').trim()} `;
    const words = norm.trim().split(' ').map((w) => w.replace(/\.$/, ''));
    let best = null, bestScore = 0;
    for (const [id, keys] of INTENTS) {
      let score = 0;
      for (const k of keys) {
        if (k.includes(' ')) { if (norm.includes(` ${k} `)) score += 2; continue; }
        if (words.includes(k)) score += 2;
        else if (k.length >= 4 && words.some((w) => w !== k && w.startsWith(k))) score += 1.5;
        else if (k.length >= 5 && words.some((w) => w.length >= 4 && lev(w, k) <= 1)) score += 1;
      }
      if (score > bestScore) { best = id; bestScore = score; }
    }
    if (best) return R[best]();
    return {
      html: '<p>Hmm, I don’t have an answer for that one yet 🤔</p><p>I can tell you about his <strong>skills</strong>, <strong>projects</strong>, <strong>experience</strong> or how to <strong>reach him</strong>. Or just email him directly.</p>',
      actions: [['Email him', mailMe]],
    };
  }

  function openChat() {
    hideNudge();
    body.classList.add('chat-open');
    chat.inert = false;
    fab.setAttribute('aria-expanded', 'true');
    fab.setAttribute('aria-label', 'Close chat');
    if (!greeted) {
      greeted = true;
      botSay({ html: `<p>${greeting()}! 👋 I’m Vedant’s portfolio assistant.</p><p>Ask me about his skills, projects, experience, or how to get in touch.</p>` });
    }
    if (finePointer) setTimeout(() => chatInput.focus({ preventScroll: true }), 50);
  }
  function closeChat() {
    if (!body.classList.contains('chat-open')) return;
    body.classList.remove('chat-open');
    chat.inert = true;
    fab.setAttribute('aria-expanded', 'false');
    fab.setAttribute('aria-label', 'Chat with Vedant’s assistant');
    if (chat.contains(document.activeElement)) fab.focus({ preventScroll: true });
  }
  fab.addEventListener('click', () => (body.classList.contains('chat-open') ? closeChat() : openChat()));
  $('.chat-x', chat).addEventListener('click', closeChat);
  $('.chat-form', chat).addEventListener('submit', (e) => {
    e.preventDefault();
    send(chatInput.value);
    chatInput.value = '';
  });
  $$('[data-open-chat]').forEach((b) => b.addEventListener('click', openChat));

  // A one-time nudge per visit, a few seconds after the page settles.
  function hideNudge() { nudge.classList.remove('show'); }
  nudge.addEventListener('click', openChat);
  let nudged = false;
  try { nudged = sessionStorage.getItem('chatNudged') === '1'; } catch (_) {}
  if (!nudged) {
    setTimeout(() => {
      if (body.classList.contains('chat-open') || greeted) return;
      nudge.classList.add('show');
      try { sessionStorage.setItem('chatNudged', '1'); } catch (_) {}
      setTimeout(hideNudge, 7000);
    }, 6000);
  }

  /* ---------- Global keys ---------- */
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      isOpen(pal) ? closeLayer(pal) : openPalette();
      return;
    }
    if (e.key === 'Escape') {
      if (isOpen(pal)) closeLayer(pal);
      else if (isOpen(caseLayer)) closeLayer(caseLayer);
      else if (body.classList.contains('chat-open')) closeChat();
      return;
    }
    if (e.key === '/' && !isTyping(e.target) && !layers.some(isOpen)) {
      e.preventDefault();
      openPalette();
    }
  });

  // The custom cursor grows over anything clickable, including elements added here.
  const ring = $('.cursor-ring');
  if (ring) {
    document.addEventListener('mouseover', (e) => {
      ring.classList.toggle('hover', !!e.target.closest('a, button, .tilt, .clickable, .cmdk-item'));
    });
  }
})();
