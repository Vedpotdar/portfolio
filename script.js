/* Vedant Potdar · portfolio interactions. Plain JS, no dependencies. */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- Profile links: fill these in once ---------- */
  const LINKS = {
    github: 'https://github.com/Vedpotdar',  // your GitHub profile
    linkedin: 'https://www.linkedin.com/in/vedant-potdar-860760289/', // your LinkedIn profile
    playstore: 'https://play.google.com/store/apps/details?id=com.infocloudic.visitormanagement', // Enterlyze on Google Play
    appstore: 'https://apps.apple.com/us/app/enterlyze/id6751401008',                            // Enterlyze on the App Store
    'dsv-github': 'https://github.com/Vedpotdar/ds-visualizer',   // Data Structures Visualizer repo
    'dsv-demo': 'https://ds-visualizer-pink.vercel.app',          // Data Structures Visualizer live demo
  };
  $$('[data-link]').forEach((a) => {
    const url = LINKS[a.dataset.link];
    if (url && url !== '#') a.href = url;
    else if (url === '#') a.removeAttribute('target');
  });

  /* ---------- Theme (remembered per browser) ---------- */
  const root = document.documentElement;
  try {
    const saved = localStorage.getItem('theme');
    if (saved) root.dataset.theme = saved;
    else if (window.matchMedia('(prefers-color-scheme: light)').matches) root.dataset.theme = 'light';
  } catch (_) { /* storage blocked: keep default */ }
  $('#themeToggle').addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (_) {}
  });

  /* ---------- Loader ---------- */
  // ?preview skips the intro (handy for screenshots and quick checks).
  const skipIntro = reduceMotion || new URLSearchParams(location.search).has('preview');
  document.body.classList.add('loading');
  const finishLoading = () => {
    $('#loader').classList.add('done');
    document.body.classList.remove('loading');
    startTyping();
    revealHero();
    // The page could not scroll while the loader was up, so honour a #section link now.
    if (location.hash) $(location.hash)?.scrollIntoView();
  };
  window.addEventListener('load', () => setTimeout(finishLoading, skipIntro ? 0 : 1300));

  /* ---------- Typed roles ---------- */
  const roles = ['web apps with React.', 'mobile apps with React Native.', 'APIs with Node.js.', 'multi-tenant SaaS products.', 'things that ship.'];
  function startTyping() {
    const el = $('#typed');
    if (reduceMotion) { el.textContent = roles[0]; return; }
    let r = 0, i = 0, deleting = false;
    const tick = () => {
      const word = roles[r];
      el.textContent = word.slice(0, i);
      if (!deleting && i < word.length) { i++; setTimeout(tick, 70); }
      else if (!deleting) { deleting = true; setTimeout(tick, 1600); }
      else if (i > 0) { i--; setTimeout(tick, 35); }
      else { deleting = false; r = (r + 1) % roles.length; setTimeout(tick, 300); }
    };
    tick();
  }

  /* ---------- Reveal on scroll ---------- */
  function revealHero() { $$('.hero .reveal').forEach((el, i) => setTimeout(() => el.classList.add('visible'), i * 120)); }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const siblings = $$('.reveal', e.target.parentElement);
      const delay = Math.max(0, siblings.indexOf(e.target)) * 80;
      setTimeout(() => e.target.classList.add('visible'), Math.min(delay, 400));
      io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach((el) => { if (!el.closest('.hero')) io.observe(el); });

  /* ---------- Counters ---------- */
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target, end = +el.dataset.count, suffix = el.dataset.suffix || '';
      const start = performance.now(), dur = reduceMotion ? 0 : 1400;
      const step = (t) => {
        const p = dur ? Math.min((t - start) / dur, 1) : 1;
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + (p === 1 ? suffix : '');
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      countIO.unobserve(el);
    });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach((el) => countIO.observe(el));

  /* ---------- Terminal ---------- */
  const script = [
    { cmd: 'whoami', out: ['<span class="hl">Vedant Potdar</span> · Full Stack Developer'] },
    { cmd: 'cat focus.txt', out: ['React.js · React Native · Node.js · PostgreSQL', 'multi-tenant SaaS · web + mobile'] },
    { cmd: 'ls shipped/', out: ['vms/  hrms-app/  conference/  hot-desk/  car-parking/'] },
    { cmd: 'echo $LOCATION', out: ['Mumbai, India'] },
    { cmd: 'status', out: ['<span class="hl">●</span> open to new opportunities'] },
  ];
  const term = $('#terminal');
  let termStarted = false;
  const termIO = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !termStarted) { termStarted = true; runTerminal(); termIO.disconnect(); }
  }, { threshold: 0.4 });
  termIO.observe(term);

  async function runTerminal() {
    const sleep = (ms) => new Promise((r) => setTimeout(r, reduceMotion ? 0 : ms));
    for (const step of script) {
      const line = document.createElement('div');
      line.innerHTML = '<span class="prompt">➜</span> <span class="cmd"></span>';
      term.appendChild(line);
      const cmdEl = $('.cmd', line);
      for (const ch of step.cmd) { cmdEl.textContent += ch; await sleep(55); }
      await sleep(250);
      step.out.forEach((o) => {
        const out = document.createElement('span');
        out.className = 'out';
        out.innerHTML = o;
        term.appendChild(out);
      });
      await sleep(450);
    }
    // features.js turns the terminal into a live prompt from here.
    document.dispatchEvent(new Event('terminal:ready'));
  }

  /* ---------- Particle network (hero) ---------- */
  const canvas = $('#particles');
  const ctx = canvas.getContext('2d');
  let W, H, dots = [], mouse = { x: -9999, y: -9999 }, raf;
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  function sizeCanvas() {
    W = canvas.offsetWidth; H = canvas.offsetHeight;
    canvas.width = W * DPR; canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    const count = Math.min(90, Math.floor((W * H) / 16000));
    dots = Array.from({ length: count }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35, r: Math.random() * 1.6 + 0.6,
    }));
  }
  function accentRGB() {
    return root.dataset.theme === 'light' ? '8,145,178' : '34,211,238';
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    const rgb = accentRGB();
    for (const d of dots) {
      d.x += d.vx; d.y += d.vy;
      if (d.x < 0 || d.x > W) d.vx *= -1;
      if (d.y < 0 || d.y > H) d.vy *= -1;
      const dx = d.x - mouse.x, dy = d.y - mouse.y, dist = Math.hypot(dx, dy);
      if (dist < 120) { d.x += dx / dist * 1.2; d.y += dy / dist * 1.2; }
      ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb},0.7)`; ctx.fill();
    }
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const a = dots[i], b = dots[j], dd = Math.hypot(a.x - b.x, a.y - b.y);
        if (dd < 130) {
          ctx.strokeStyle = `rgba(${rgb},${0.16 * (1 - dd / 130)})`;
          ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    raf = requestAnimationFrame(draw);
  }
  sizeCanvas();
  if (!reduceMotion) draw(); else { draw(); cancelAnimationFrame(raf); }
  let resizeTimer;
  window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(sizeCanvas, 150); });
  $('.hero').addEventListener('mousemove', (e) => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
  $('.hero').addEventListener('mouseleave', () => { mouse.x = mouse.y = -9999; });
  // Pause the animation while the hero is off screen.
  new IntersectionObserver(([e]) => {
    if (reduceMotion) return;
    if (e.isIntersecting) { cancelAnimationFrame(raf); draw(); } else cancelAnimationFrame(raf);
  }).observe($('.hero'));

  /* ---------- 3D tilt + spotlight ---------- */
  if (finePointer && !reduceMotion) {
    $$('.tilt').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        card.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 8}deg) rotateY(${(px - 0.5) * 10}deg) translateY(-4px)`;
        card.style.setProperty('--mx', `${px * 100}%`);
        card.style.setProperty('--my', `${py * 100}%`);
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });

    /* Magnetic buttons */
    $$('.magnetic').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });

    /* Custom cursor */
    document.body.classList.add('has-cursor');
    const dot = $('.cursor-dot'), ring = $('.cursor-ring');
    let mx = 0, my = 0, rx = 0, ry = 0;
    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      document.body.classList.add('cursor-moved'); // show the cursor only once the mouse is on the page
    });
    document.addEventListener('mouseleave', () => document.body.classList.remove('cursor-moved'));
    (function follow() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(follow);
    })();
    $$('a, button, .tilt').forEach((el) => {
      el.addEventListener('mouseenter', () => ring.classList.add('hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
  }

  /* ---------- Nav: scroll state, hide on scroll down, active link ---------- */
  const nav = $('#nav'), progress = $('.scroll-progress'), timeline = $('.timeline');
  let lastY = 0;
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 30);
    nav.classList.toggle('hidden', y > lastY && y > 400 && !$('#navLinks').classList.contains('open'));
    lastY = y;
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    // Timeline line fills as you scroll through it.
    const tr = timeline.getBoundingClientRect();
    const fill = Math.min(Math.max((innerHeight * 0.6 - tr.top) / tr.height, 0), 1);
    timeline.style.setProperty('--tl-progress', `${fill * 100}%`);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const links = $$('.nav-links a');
  const sectionIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) links.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === `#${e.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach((s) => sectionIO.observe(s));

  /* Mobile menu */
  const menuBtn = $('#menuBtn'), navLinks = $('#navLinks');
  menuBtn.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open);
  });
  links.forEach((l) => l.addEventListener('click', () => { navLinks.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }));

  /* ---------- Work filters ---------- */
  $$('.filter').forEach((btn) => {
    btn.addEventListener('click', () => {
      $$('.filter').forEach((b) => { b.classList.toggle('active', b === btn); b.setAttribute('aria-selected', b === btn); });
      const f = btn.dataset.filter;
      $$('.work-card').forEach((card) => {
        const show = f === 'all' || card.dataset.tags.split(' ').includes(f);
        card.classList.toggle('hide', !show);
        card.classList.toggle('featured', show && f === 'all' && card.dataset.tags.includes('mobile') && card.querySelector('.art-vms'));
      });
    });
  });

  /* ---------- Copy email ---------- */
  const toast = $('#toast');
  const showToast = (msg) => { toast.textContent = msg; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2200); };
  $('#copyEmail').addEventListener('click', async (e) => {
    const email = e.currentTarget.dataset.email;
    try { await navigator.clipboard.writeText(email); showToast('Email copied to clipboard'); }
    catch (_) { showToast(email); }
  });

  $('#year').textContent = new Date().getFullYear();
})();
