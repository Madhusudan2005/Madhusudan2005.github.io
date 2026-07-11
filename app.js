'use strict';
/* ═══════════════════════════════════════════════════════════
   SCROLL PORTFOLIO v4.0 — G. Madhusudan
   Particle Background · Intersection Observer Reveals
   Typed Text · Scroll Progress · Active Nav · Chatbot
═══════════════════════════════════════════════════════════ */

/* ══════════════════════════════════
   LOADER
══════════════════════════════════ */
const loaderEl = document.getElementById('loader');
const ldBar    = document.getElementById('ldBar');
const ldPct    = document.getElementById('ldPct');
let loadVal = 0;

function setLoad(to, cb) {
  const step = () => {
    loadVal = Math.min(loadVal + 1.5, to);
    ldBar.style.width = loadVal + '%';
    ldPct.textContent = Math.round(loadVal) + '%';
    if (loadVal < to) requestAnimationFrame(step);
    else if (cb) cb();
  };
  step();
}

function hideLoader() {
  loaderEl.classList.add('gone');
  setTimeout(() => loaderEl.remove(), 1100);
}

/* ══════════════════════════════════
   PARTICLE CANVAS BACKGROUND
══════════════════════════════════ */
const pCanvas = document.getElementById('particleCanvas');
const pCtx    = pCanvas.getContext('2d');
let particles = [];
let pW, pH;

function resizeParticles() {
  pW = pCanvas.width  = window.innerWidth;
  pH = pCanvas.height = window.innerHeight;
}

function createParticles() {
  particles = [];
  const count = Math.floor((pW * pH) / 8000);
  for (let i = 0; i < count; i++) {
    const palette = [
      [0, 200, 255], [168, 85, 247], [255, 255, 255],
      [0, 200, 255], [255, 255, 255]
    ];
    const c = palette[Math.floor(Math.random() * palette.length)];
    particles.push({
      x: Math.random() * pW,
      y: Math.random() * pH,
      r: Math.random() * 1.4 + 0.3,
      alpha: Math.random() * 0.6 + 0.1,
      speed: Math.random() * 0.12 + 0.02,
      dir: Math.random() * Math.PI * 2,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.02 + 0.008,
      color: c,
    });
  }
}

function animateParticles() {
  pCtx.clearRect(0, 0, pW, pH);
  const t = performance.now() * 0.001;

  particles.forEach(p => {
    p.twinkle += p.twinkleSpeed;
    const a = p.alpha * (0.5 + 0.5 * Math.sin(p.twinkle));
    pCtx.beginPath();
    pCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    pCtx.fillStyle = `rgba(${p.color[0]},${p.color[1]},${p.color[2]},${a})`;
    pCtx.fill();

    p.x += Math.cos(p.dir) * p.speed;
    p.y += Math.sin(p.dir) * p.speed;

    if (p.x < -2) p.x = pW + 2;
    if (p.x > pW + 2) p.x = -2;
    if (p.y < -2) p.y = pH + 2;
    if (p.y > pH + 2) p.y = -2;
  });

  // Subtle gradient nebula overlays
  const nCtx = pCtx;
  const g1 = nCtx.createRadialGradient(pW * .15, pH * .25, 0, pW * .15, pH * .25, pW * .35);
  g1.addColorStop(0, `rgba(0,100,200,${0.04 + 0.01 * Math.sin(t * .3)})`);
  g1.addColorStop(1, 'rgba(0,0,0,0)');
  nCtx.fillStyle = g1; nCtx.fillRect(0, 0, pW, pH);

  const g2 = nCtx.createRadialGradient(pW * .85, pH * .6, 0, pW * .85, pH * .6, pW * .3);
  g2.addColorStop(0, `rgba(100,40,180,${0.035 + 0.01 * Math.sin(t * .2 + 1)})`);
  g2.addColorStop(1, 'rgba(0,0,0,0)');
  nCtx.fillStyle = g2; nCtx.fillRect(0, 0, pW, pH);

  const g3 = nCtx.createRadialGradient(pW * .5, pH * .85, 0, pW * .5, pH * .85, pW * .25);
  g3.addColorStop(0, `rgba(0,180,100,${0.02 + 0.01 * Math.sin(t * .15 + 2)})`);
  g3.addColorStop(1, 'rgba(0,0,0,0)');
  nCtx.fillStyle = g3; nCtx.fillRect(0, 0, pW, pH);

  requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', () => {
  resizeParticles();
  createParticles();
  resizeNeural();
  createNodes();
});

/* ══════════════════════════════════
   NEURAL NETWORK CANVAS
══════════════════════════════════ */
const nCanvas = document.getElementById('neuralCanvas');
const nCtx2   = nCanvas.getContext('2d');
let nodes = [];
let nW, nH;

function resizeNeural() {
  nW = nCanvas.width  = window.innerWidth;
  nH = nCanvas.height = window.innerHeight;
}

function createNodes() {
  nodes = [];
  const count = Math.min(Math.floor((nW * nH) / 22000), 55);
  for (let i = 0; i < count; i++) {
    nodes.push({
      x: Math.random() * nW,
      y: Math.random() * nH,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      r: Math.random() * 2.2 + 1.2,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.008 + 0.004,
      color: Math.random() < 0.6 ? [0,200,255] : Math.random() < 0.5 ? [168,85,247] : [0,255,136],
    });
  }
}

const MAX_DIST = 200;

function animateNeural() {
  nCtx2.clearRect(0, 0, nW, nH);
  const t = performance.now() * 0.001;

  // Move nodes
  nodes.forEach(n => {
    n.phase += n.speed;
    n.x += n.vx + Math.sin(n.phase * 0.7) * 0.12;
    n.y += n.vy + Math.cos(n.phase * 0.5) * 0.12;
    if (n.x < 0)  n.x = nW;
    if (n.x > nW) n.x = 0;
    if (n.y < 0)  n.y = nH;
    if (n.y > nH) n.y = 0;
  });

  // Draw connections
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j];
      const dx = a.x - b.x, dy = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MAX_DIST) {
        const alpha = (1 - dist / MAX_DIST) * 0.22;
        const pulse = 0.5 + 0.5 * Math.sin(t * 1.4 + i * 0.3 + j * 0.2);
        nCtx2.beginPath();
        nCtx2.moveTo(a.x, a.y);
        nCtx2.lineTo(b.x, b.y);
        nCtx2.strokeStyle = `rgba(${a.color[0]},${a.color[1]},${a.color[2]},${alpha * pulse})`;
        nCtx2.lineWidth = 0.7;
        nCtx2.stroke();
      }
    }
  }

  // Draw nodes
  nodes.forEach((n, i) => {
    const pulse = 0.6 + 0.4 * Math.sin(t * 1.2 + n.phase);
    const glow = nCtx2.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 5);
    glow.addColorStop(0, `rgba(${n.color[0]},${n.color[1]},${n.color[2]},${0.7 * pulse})`);
    glow.addColorStop(1, `rgba(${n.color[0]},${n.color[1]},${n.color[2]},0)`);
    nCtx2.beginPath();
    nCtx2.arc(n.x, n.y, n.r * 3.5, 0, Math.PI * 2);
    nCtx2.fillStyle = glow;
    nCtx2.fill();

    nCtx2.beginPath();
    nCtx2.arc(n.x, n.y, n.r * pulse, 0, Math.PI * 2);
    nCtx2.fillStyle = `rgba(${n.color[0]},${n.color[1]},${n.color[2]},${0.9 * pulse})`;
    nCtx2.fill();
  });

  requestAnimationFrame(animateNeural);
}

resizeNeural();
createNodes();
animateNeural();


/* ══════════════════════════════════
   CUSTOM CURSOR
══════════════════════════════════ */
const cursorRing = document.getElementById('cursorRing');
const cursorDot  = document.getElementById('cursorDot');
let cx = 0, cy = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  cx = e.clientX; cy = e.clientY;
  cursorDot.style.left = cx + 'px';
  cursorDot.style.top  = cy + 'px';
});

function animateCursor() {
  rx += (cx - rx) * 0.12;
  ry += (cy - ry) * 0.12;
  cursorRing.style.left = rx + 'px';
  cursorRing.style.top  = ry + 'px';
  requestAnimationFrame(animateCursor);
}

/* Disable custom cursor on touch devices */
if (window.matchMedia('(hover: none)').matches) {
  if (cursorRing) cursorRing.style.display = 'none';
  if (cursorDot)  cursorDot.style.display  = 'none';
  document.body.style.cursor = 'auto';
}

document.querySelectorAll('a, button, .chip, .hl-row, .proj-card, .sp-node, .edu-card, .tl-card, .contact-item, .about-stat').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-on-link'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-on-link'));
});

/* ══════════════════════════════════
   CLICK RIPPLE
══════════════════════════════════ */
const rippleContainer = document.getElementById('rippleContainer');
document.addEventListener('click', e => {
  const r = document.createElement('div');
  r.className = 'ripple-wave';
  r.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;width:40px;height:40px`;
  rippleContainer.appendChild(r);
  setTimeout(() => r.remove(), 1000);
});

/* ══════════════════════════════════
   SCROLL PROGRESS BAR
══════════════════════════════════ */
const scrollProgress = document.getElementById('scrollProgress');
function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  const pct  = docH > 0 ? (scrollTop / docH) * 100 : 0;
  scrollProgress.style.width = pct + '%';
}

/* ══════════════════════════════════
   NAVBAR — scroll hide/show + active
══════════════════════════════════ */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');
let lastScrollY = 0;
let navHideTimer = null;

function updateNavbar() {
  const sy = window.scrollY;

  // Scrolled style
  if (sy > 20) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');

  // Hide on scroll down, show on scroll up
  if (sy > lastScrollY && sy > 150) {
    navbar.classList.add('hidden');
  } else {
    navbar.classList.remove('hidden');
  }
  lastScrollY = sy;

  // Active nav link based on section in view
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 100;
    if (sy >= top) current = sec.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.section === current);
  });

  updateScrollProgress();
}

window.addEventListener('scroll', updateNavbar, { passive: true });

/* Mobile hamburger */
const hamburger = document.getElementById('navHamburger');
const navLinksEl = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinksEl.classList.toggle('open');
});
navLinksEl.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksEl.classList.remove('open');
  });
});

/* ══════════════════════════════════
   INTERSECTION OBSERVER — SCROLL REVEALS
══════════════════════════════════ */
function initRevealObserver() {
  const opts = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, opts);

  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-item').forEach(el => {
    observer.observe(el);
  });
}

/* ══════════════════════════════════
   ANIMATED STAT COUNTERS
══════════════════════════════════ */
function animateCounter(el, target, suffix, duration) {
  const isDecimal = String(target).includes('.');
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      start = target;
      clearInterval(timer);
    }
    el.textContent = (isDecimal ? start.toFixed(1) : Math.floor(start)) + suffix;
  }, 16);
}

function initCounters() {
  const counters = [
    { selector: '.about-stat:nth-child(1) .as-n', target: 9, suffix: '+' },
    { selector: '.about-stat:nth-child(2) .as-n', target: 5, suffix: '' },
    { selector: '.about-stat:nth-child(3) .as-n', target: 2, suffix: '' },
    { selector: '.about-stat:nth-child(4) .as-n', target: 2027, suffix: '' },
  ];
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        counters.forEach(c => {
          const el = document.querySelector(c.selector);
          if (el) animateCounter(el, c.target, c.suffix, 1200);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });
  const aboutStats = document.querySelector('.about-stats');
  if (aboutStats) observer.observe(aboutStats);
}

/* ══════════════════════════════════
   TYPED TEXT EFFECT
══════════════════════════════════ */
const TYPED_WORDS = [
  'Edge AI Engineer',
  'ML Researcher',
  'Computer Vision',
  'NLP Developer',
  'Open Source Builder',
  'IEEE CIS Member',
];

let typedIndex = 0;
let typedCharIndex = 0;
let typedDeleting = false;
const typedEl = document.getElementById('typedDisplay');

function runTyped() {
  if (!typedEl) return;
  const word = TYPED_WORDS[typedIndex % TYPED_WORDS.length];

  if (!typedDeleting) {
    typedCharIndex++;
    typedEl.textContent = word.slice(0, typedCharIndex);
    if (typedCharIndex === word.length) {
      typedDeleting = true;
      setTimeout(runTyped, 1800);
      return;
    }
    setTimeout(runTyped, 70);
  } else {
    typedCharIndex--;
    typedEl.textContent = word.slice(0, typedCharIndex);
    if (typedCharIndex === 0) {
      typedDeleting = false;
      typedIndex++;
      setTimeout(runTyped, 350);
      return;
    }
    setTimeout(runTyped, 40);
  }
}

/* ══════════════════════════════════
   HERO — ANIMATE IN ON LOAD
══════════════════════════════════ */
function animateHeroIn() {
  const heroItems = document.querySelectorAll('.hero-section .reveal-item');
  heroItems.forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 200 + i * 120);
  });
}

/* ══════════════════════════════════
   CHATBOT
══════════════════════════════════ */
const chatFab    = document.getElementById('chatFab');
const chatWindow = document.getElementById('chatWindow');
const chatClose  = document.getElementById('chatClose');
const chatBody   = document.getElementById('chatBody');
const chatInput  = document.getElementById('chatInput');
const chatSend   = document.getElementById('chatSend');

chatFab.addEventListener('click', () => chatWindow.classList.toggle('open'));
chatClose.addEventListener('click', () => chatWindow.classList.remove('open'));

const KB = {
  blindsight: `<strong>BlindSight</strong> is Madhu's flagship project — an offline wearable navigation assistant for visually impaired users. It uses <strong>YOLOv8</strong> for real-time object detection, depth estimation, and voice guidance, all running on-device (Raspberry Pi 5) without internet connectivity. 👁️`,
  skills: `Madhu's tech stack:<br>🐍 <strong>Python, Java, C, C++, SQL, JS</strong><br>🧠 <strong>TensorFlow, Keras, OpenCV, SpaCy</strong><br>🛠 <strong>Flask, Git, Power BI, Postman</strong><br>⚙️ Data Structures, Graph Algorithms`,
  hire: `Absolutely! Madhu is:<br>✅ An AI & DS undergrad at MSRIT<br>✅ Ex-intern at Elevate Labs<br>✅ Co-author on a GeoAI research paper<br>✅ IEEE CIS Lead & Aspire Leaders alum<br>✅ Available for internships & research! 🚀`,
  contact: `📧 <strong>madhu.g.sudan0@gmail.com</strong><br>📱 <strong>+91-9448440117</strong><br>🔗 github.com/Madhusudan2005<br>📍 MSRIT, Bengaluru, India`,
  projects: `Madhu has 5 featured projects:<br>1. 👁️ <strong>BlindSight</strong> — Edge-AI navigation (YOLOv8)<br>2. 📜 <strong>Kannada OCR Genesis</strong> — Ancient manuscript digitization<br>3. 🎵 <strong>Music Genre Classification</strong> — CNN + MFCC audio<br>4. 🚗 <strong>Autonomous Driving System</strong> — ADAS with YOLOv8 + MiDaS depth<br>5. 🚨 <strong>Smart Crowd Panic Detection</strong> — Real-time crowd safety AI`,
  autonomous: `<strong>Autonomous Driving System</strong> 🚗 — A real-time ADAS Perception Pipeline that combines <strong>YOLOv8</strong> object detection, <strong>MiDaS</strong> monocular depth estimation, lane detection, and multi-factor collision risk assessment into a unified driving perception system. <a href="https://github.com/Madhusudan2005/Autonomous-Driving-System" target="_blank">View on GitHub →</a>`,
  crowd: `<strong>Smart Crowd Panic Detection</strong> 🚨 — A real-time crowd safety &amp; behavior analysis system powered by <strong>YOLOv8</strong> and computer vision. It detects panic behavior, analyzes crowd density, and generates real-time safety alerts for public spaces and event management. <a href="https://github.com/Madhusudan2005/SmartCrowdPanicDetection" target="_blank">View on GitHub →</a>`,
  education: `🎓 <strong>B.E. AI &amp; Data Science</strong> — MSRIT (Expected 2027)<br>🌍 <strong>Aspire Leaders Program</strong> — Harvard-affiliated, top 36,000+<br>⚡ <strong>IEEE CIS Research Lead</strong><br>🏅 5 Certifications: Infosys GenAI, IBM Data Science, AWS, Postman, SnowPro`,
  experience: `💼 <strong>AI &amp; ML Intern @ Elevate Labs</strong> (Sep–Nov 2025)<br>Built ML pipelines with TensorFlow, Keras &amp; Scikit-learn.<br><br>📝 <strong>Co-Author @ NCRIE (2025)</strong><br>Research: "Women Safety Heatmap &amp; Secure Routing using GeoAI"`,
};

function getBotReply(msg) {
  const m = msg.toLowerCase();
  if (m.includes('blindsight') || m.includes('blind'))        return KB.blindsight;
  if (m.includes('autonomous') || m.includes('driving') || m.includes('adas')) return KB.autonomous;
  if (m.includes('crowd') || m.includes('panic') || m.includes('safety'))      return KB.crowd;
  if (m.includes('skill') || m.includes('tech') || m.includes('stack')) return KB.skills;
  if (m.includes('hire') || m.includes('recruit') || m.includes('job')) return KB.hire;
  if (m.includes('contact') || m.includes('email') || m.includes('phone')) return KB.contact;
  if (m.includes('project'))                                  return KB.projects;
  if (m.includes('educ') || m.includes('cert') || m.includes('degree')) return KB.education;
  if (m.includes('experience') || m.includes('intern') || m.includes('work')) return KB.experience;
  if (m.includes('hello') || m.includes('hi') || m.includes('hey')) return `Hi there! 👋 I'm Madhu's AI assistant. Ask me about his projects, skills, or experience!`;
  return `Great question! Madhu is an AI &amp; Data Science engineer specializing in Edge AI, NLP, and computer vision. Try asking about his <em>projects</em>, <em>skills</em>, or how to <em>contact</em> him!`;
}

function addMessage(text, type) {
  const div = document.createElement('div');
  div.className = `cw-msg ${type}`;
  const bubble = document.createElement('div');
  bubble.className = 'cw-bubble';
  bubble.innerHTML = text;
  div.appendChild(bubble);
  chatBody.appendChild(div);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function addTyping() {
  const div = document.createElement('div');
  div.className = 'cw-msg bot';
  div.id = 'cwTyping';
  div.innerHTML = `<div class="cw-typing"><span></span><span></span><span></span></div>`;
  chatBody.appendChild(div);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function sendMessage(text) {
  if (!text.trim()) return;
  addMessage(text, 'user');
  addTyping();
  setTimeout(() => {
    const t = document.getElementById('cwTyping');
    if (t) t.remove();
    addMessage(getBotReply(text), 'bot');
  }, 900 + Math.random() * 500);
}

chatSend.addEventListener('click', () => {
  sendMessage(chatInput.value);
  chatInput.value = '';
});
chatInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') { sendMessage(chatInput.value); chatInput.value = ''; }
});

function suggest(text) {
  chatWindow.classList.add('open');
  sendMessage(text);
}

/* ══════════════════════════════════
   CONTACT FORM
══════════════════════════════════ */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    const orig = btn.innerHTML;
    btn.innerHTML = '✓ MESSAGE SENT!';
    btn.style.background = 'linear-gradient(135deg, var(--green), #00aa55)';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.style.background = '';
      btn.disabled = false;
      contactForm.reset();
    }, 3000);
  });
}

/* ══════════════════════════════════
   SMOOTH SCROLL FOR NAV LINKS
══════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ══════════════════════════════════
   BACK TO TOP BUTTON
══════════════════════════════════ */
const backToTopBtn = document.getElementById('backToTop');
if (backToTopBtn) {
  window.addEventListener('scroll', () => {
    backToTopBtn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  backToTopBtn.addEventListener('mouseenter', () => document.body.classList.add('cursor-on-link'));
  backToTopBtn.addEventListener('mouseleave', () => document.body.classList.remove('cursor-on-link'));
}

/* ══════════════════════════════════
   CARD 3D TILT + MOUSE SPOTLIGHT
══════════════════════════════════ */
function initTiltCards() {
  document.querySelectorAll('.proj-card, .edu-card, .sp-node').forEach(card => {
    card.classList.add('tilt-card');

    card.addEventListener('mousemove', e => {
      const rect  = card.getBoundingClientRect();
      const xPct  = (e.clientX - rect.left)  / rect.width;
      const yPct  = (e.clientY - rect.top)   / rect.height;
      const rotX  = -(yPct - 0.5) * 10;
      const rotY  =  (xPct - 0.5) * 10;

      card.style.transform =
        `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px) scale(1.015)`;
      card.style.transition = 'transform .1s ease, box-shadow .3s ease';

      // Dynamic spotlight follow
      const spotX = xPct * 100;
      const spotY = yPct * 100;
      card.style.background = card.style.background || '';
      card.style.setProperty('--spot-x', spotX + '%');
      card.style.setProperty('--spot-y', spotY + '%');

      const glow = card.querySelector('.proj-card-glow');
      if (glow) {
        glow.style.opacity = '1';
        glow.style.left = spotX + '%';
        glow.style.top  = spotY + '%';
        glow.style.transform = 'translate(-50%, -50%)';
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform .5s var(--ease), box-shadow .5s ease';
      const glow = card.querySelector('.proj-card-glow');
      if (glow) glow.style.opacity = '0';
    });
  });
}

/* ══════════════════════════════════
   MAGNETIC BUTTON PULL EFFECT
══════════════════════════════════ */
function initMagneticButtons() {
  document.querySelectorAll('.btn-primary, .btn-secondary, .nav-resume-btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect   = btn.getBoundingClientRect();
      const dx     = e.clientX - (rect.left + rect.width / 2);
      const dy     = e.clientY - (rect.top  + rect.height / 2);
      const dist   = Math.sqrt(dx * dx + dy * dy);
      const maxR   = Math.max(rect.width, rect.height) * 0.7;
      if (dist < maxR) {
        const pull = (1 - dist / maxR) * 8;
        btn.style.transform = `translateX(${dx * pull / maxR}px) translateY(${(dy * pull / maxR) - 3}px)`;
      }
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform .5s var(--ease-back)';
    });
  });
}

/* ══════════════════════════════════
   FLOATING GEOMETRIC SHAPES
══════════════════════════════════ */
function injectGeoShapes() {
  const defs = [
    { el: 'div', section: '#about',   style: 'width:160px;height:160px;border:1px solid rgba(0,200,255,.08);border-radius:4px;top:10%;right:5%;--gr:15deg;--gr2:45deg;--gtx:30px;--gty:-20px;--gs:18s;--go:0.06;--gd:0.3s' },
    { el: 'div', section: '#about',   style: 'width:80px;height:80px;border:1px solid rgba(168,85,247,.1);border-radius:50%;top:70%;left:3%;--gr:0deg;--gr2:180deg;--gtx:-20px;--gty:30px;--gs:12s;--go:0.07;--gd:0.6s' },
    { el: 'div', section: '#projects',style: 'width:120px;height:120px;border:1px solid rgba(0,255,136,.06);border-radius:4px;top:5%;left:2%;--gr:20deg;--gr2:60deg;--gtx:25px;--gty:-35px;--gs:15s;--go:0.05;--gd:0.2s' },
    { el: 'div', section: '#skills',  style: 'width:200px;height:200px;border:1px solid rgba(251,191,36,.06);border-radius:50%;bottom:5%;right:3%;--gr:0deg;--gr2:90deg;--gtx:-40px;--gty:20px;--gs:20s;--go:0.04;--gd:0.4s' },
    { el: 'div', section: '#experience',style:'width:100px;height:100px;border:1px solid rgba(0,200,255,.07);border-radius:4px;top:15%;right:8%;--gr:30deg;--gr2:75deg;--gtx:20px;--gty:-25px;--gs:14s;--go:0.06;--gd:0.5s' },
    { el: 'div', section: '#education',style: 'width:140px;height:140px;border:1px solid rgba(168,85,247,.06);border-radius:50%;top:60%;left:5%;--gr:0deg;--gr2:120deg;--gtx:-30px;--gty:15px;--gs:16s;--go:0.05;--gd:0.3s' },
  ];
  defs.forEach(d => {
    const parent = document.querySelector(d.section);
    if (!parent) return;
    const el = document.createElement(d.el);
    el.className = 'geo-shape';
    el.style.cssText = d.style;
    parent.style.position = parent.style.position || 'relative';
    parent.appendChild(el);
  });
}

/* ══════════════════════════════════
   SECTION PARALLAX ON SCROLL
══════════════════════════════════ */
function initParallax() {
  const layers = [
    { el: document.querySelector('.hero-glow-1'), speed: 0.15 },
    { el: document.querySelector('.hero-glow-2'), speed: 0.22 },
    { el: document.querySelector('.hero-glow-3'), speed: 0.10 },
  ].filter(l => l.el);

  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    layers.forEach(l => {
      l.el.style.transform = `translateY(${sy * l.speed}px)`;
    });
  }, { passive: true });
}

/* ══════════════════════════════════
   NEURAL CANVAS MOUSE INTERACTION
══════════════════════════════════ */
let mouseNX = -9999, mouseNY = -9999;
document.addEventListener('mousemove', e => {
  mouseNX = e.clientX;
  mouseNY = e.clientY;
});

// Patch animateNeural to avoid mouseNX/Y undefined issues
// (nodes already repel if mouse is near — add repulsion in existing loop)

/* ══════════════════════════════════
   HERO STAGGER INDEX WIRING
══════════════════════════════════ */
function wireHeroStagger() {
  const heroContent = document.querySelector('.hero-content');
  if (!heroContent) return;
  Array.from(heroContent.children).forEach((child, i) => {
    child.style.setProperty('--hi', i);
  });
}

/* ══════════════════════════════════
   ENHANCED REVEAL OBSERVER
   (adds reveal-scale + reveal-clip)
══════════════════════════════════ */
function initRevealObserver() {
  const opts = { threshold: 0.10, rootMargin: '0px 0px -30px 0px' };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, opts);

  document.querySelectorAll(
    '.reveal-up, .reveal-left, .reveal-item, .reveal-scale, .reveal-clip'
  ).forEach(el => observer.observe(el));
}

/* ══════════════════════════════════
   SMOOTH HOVER GLOW TRAIL on sections
══════════════════════════════════ */
function initSectionGlowTrail() {
  document.querySelectorAll('.section').forEach(sec => {
    sec.addEventListener('mousemove', e => {
      const rect = sec.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      sec.style.setProperty('--mx', x + 'px');
      sec.style.setProperty('--my', y + 'px');
    });
  });
}

/* ══════════════════════════════════
   BOOT SEQUENCE
══════════════════════════════════ */
window.addEventListener('DOMContentLoaded', () => {
  resizeParticles();
  createParticles();
  animateParticles();
  animateCursor();

  setLoad(40, () => {
    setLoad(75, () => {
      setLoad(100, () => {
        hideLoader();
        wireHeroStagger();
        animateHeroIn();
        initRevealObserver();
        initTiltCards();
        initMagneticButtons();
        injectGeoShapes();
        initParallax();
        initSectionGlowTrail();
        initCounters();
        setTimeout(runTyped, 800);
      });
    });
  });
});
