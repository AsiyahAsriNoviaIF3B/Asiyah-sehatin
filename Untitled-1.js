/* Sehatin.id — script.js (Blue Harmony + Drawer + Mobile Ready) */

/* Preloader + reveal on load */
window.addEventListener('load', () => {
  const pre = document.getElementById('preloader');
  if (pre) {
    pre.classList.add('hidden');
    setTimeout(() => pre.style.display = 'none', 500);
  }
  document.querySelectorAll('main section').forEach((s, i) => {
    setTimeout(() => s.classList.add('active'), 160 + i * 90);
  });
  observeStats();
});

/* Typing effect in hero */
const typingText = "Konsultasi & Panduan Kesehatan — Sehatin.id";
let ti = 0;
function typingEffect() {
  const el = document.getElementById("typed-text");
  if (!el) return;
  if (ti < typingText.length) {
    el.textContent += typingText.charAt(ti);
    ti++;
    setTimeout(typingEffect, 32);
  } else {
    el.innerHTML = typingText + '<span class="caret">|</span>';
    setInterval(() => {
      const s = el.querySelector('.caret'); if (s) s.style.opacity = s.style.opacity === '0' ? '1' : '0';
    }, 600);
  }
}
document.addEventListener('DOMContentLoaded', typingEffect);

/* Daily tips + speak */
const tips = [
  "Minumlah segelas air saat bangun tidur untuk memulai metabolisme.",
  "Istirahat sejenak setiap 50 menit kerja untuk menjaga fokus.",
  "Tidur 7-8 jam malam membantu proses pemulihan tubuh.",
  "Jalan kaki 20 menit sehari baik untuk mood dan jantung.",
  "Makan sayur setiap hari untuk dukung sistem imunmu."
];
function pickTip() {
  const idx = Math.floor(Math.random() * tips.length);
  const tipEl = document.getElementById('dailyTip');
  tipEl.textContent = "Tips sehat: " + tips[idx];
  tipEl.dataset.tip = tips[idx];
}
document.addEventListener('DOMContentLoaded', pickTip);
const speakTipBtn = document.getElementById('speakTip');
if (speakTipBtn) speakTipBtn.addEventListener('click', () => {
  const tip = document.getElementById('dailyTip').dataset.tip || tips[0];
  if ('speechSynthesis' in window) {
    const u = new SpeechSynthesisUtterance(tip);
    u.lang = 'id-ID'; u.rate = 0.95;
    window.speechSynthesis.cancel(); window.speechSynthesis.speak(u);
  } else alert('Fitur suara tidak tersedia di browser ini.');
});

/* Scroll progress + top button */
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const percent = docHeight ? (scrollTop / docHeight) * 100 : 0;
  const bar = document.getElementById('scrollBar'); if (bar) bar.style.width = percent + '%';
  const topBtn = document.getElementById('topBtn'); if (topBtn) topBtn.style.display = scrollTop > 320 ? 'block' : 'none';
});
const topBtn = document.getElementById('topBtn');
if (topBtn) topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* Drawer (slide from left) */
const openDrawer = document.getElementById('openDrawer');
const closeDrawer = document.getElementById('closeDrawer');
const drawer = document.getElementById('drawer');
const backdrop = document.getElementById('drawerBackdrop');

function openSide() {
  drawer.classList.add('drawer-open'); backdrop.classList.add('show');
  drawer.setAttribute('aria-hidden', 'false');
  backdrop.setAttribute('aria-hidden', 'false');
}
function closeSide() {
  drawer.classList.remove('drawer-open'); backdrop.classList.remove('show');
  drawer.setAttribute('aria-hidden', 'true');
  backdrop.setAttribute('aria-hidden', 'true');
}
if (openDrawer) openDrawer.addEventListener('click', openSide);
if (closeDrawer) closeDrawer.addEventListener('click', closeSide);
if (backdrop) backdrop.addEventListener('click', closeSide);
/* close on escape */
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSide(); });

/* Drawer links scroll and close */
document.querySelectorAll('.drawer-link').forEach(a => {
  a.addEventListener('click', (e) => {
    closeSide();
    const href = a.getAttribute('href');
    if (href && href.startsWith('#')) {
      const t = document.querySelector(href);
      if (t) t.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* Section reveal with IntersectionObserver */
const sections = document.querySelectorAll('main section');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); });
}, { threshold: 0.22 });
sections.forEach(s => sectionObserver.observe(s));

/* Photo in view */
const photoWrap = document.getElementById('photoWrap');
if (photoWrap) {
  const pop = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) en.target.classList.add('inview'); });
  }, { threshold: 0.35 });
  pop.observe(photoWrap);
}

/* Card tilt effect (desktop only) */
function isTouchDevice() {
  return ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
}
if (!isTouchDevice()) {
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; const y = e.clientY - rect.top;
      const rx = -(y - rect.height / 2) / 18; const ry = (x - rect.width / 2) / 18;
      card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    card.addEventListener('mouseleave', () => card.style.transform = 'rotateX(0) rotateY(0)');
  });
}

/* Stats counter */
function observeStats() {
  const statEls = document.querySelectorAll('.stat-num'); if (!statEls.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target; if (!el.dataset.animated) {
          animateCount(el, +el.getAttribute('data-target'));
          el.dataset.animated = '1';
        }
      }
    });
  }, { threshold: 0.6 });
  statEls.forEach(s => obs.observe(s));
}
function animateCount(el, target) {
  const duration = 1200; const startTime = performance.now();
  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const value = Math.floor(progress * target);
    el.textContent = value + (target >= 1000 ? '+' : '');
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target + (target >= 1000 ? '+' : '');
  }
  requestAnimationFrame(step);
}

/* Dark mode persisted */
const darkBtn = document.getElementById('darkModeBtn');
function applyDark(enabled) {
  document.documentElement.classList.toggle('dark-mode', enabled);
  if (darkBtn) { darkBtn.textContent = enabled ? '☀️' : '🌙'; darkBtn.setAttribute('aria-pressed', enabled ? 'true' : 'false'); }
}
const stored = localStorage.getItem('sehatin_dark'); applyDark(stored === '1');
if (darkBtn) darkBtn.addEventListener('click', () => {
  const isDark = !document.documentElement.classList.contains('dark-mode'); applyDark(isDark); localStorage.setItem('sehatin_dark', isDark ? '1' : '0');
});

/* Contact form (demo) */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const clearBtn = document.getElementById('clearBtn'); if (clearBtn) clearBtn.addEventListener('click', () => contactForm.reset());
}
function validateForm() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  if (!name || !email || !message) { alert('Mohon isi semua kolom formulir.'); return false; }
  alert(`Terima kasih ${name}! Tim Sehatin.id akan menghubungi melalui ${email}.`);
  contactForm.reset(); return false; // prevent actual submit in demo
}

/* Sticky CTA */
const startConsult = document.getElementById('startConsult');
if (startConsult) startConsult.addEventListener('click', () => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' }));

/* CHATBOT MINI (simulasi) */
const chatBtn = document.getElementById('chatBtn');
const chatWindow = document.getElementById('chatWindow');
const chatBody = document.getElementById('chatBody');
const chatInput = document.getElementById('chatInput');
const sendChat = document.getElementById('sendChat');
const closeChat = document.getElementById('closeChat');

if (chatBtn) chatBtn.addEventListener('click', () => {
  chatWindow.style.display = 'flex'; chatWindow.setAttribute('aria-hidden', 'false'); chatBtn.style.display = 'none';
  botMessage("Halo! 👋 Saya Asya, asisten virtual Sehatin.id. Mau tanya apa hari ini? (coba: 'saya batuk')");
});
if (closeChat) closeChat.addEventListener('click', () => { chatWindow.style.display = 'none'; chatWindow.setAttribute('aria-hidden', 'true'); chatBtn.style.display = 'block'; });

function appendChat(who, text) {
  const div = document.createElement('div'); div.className = 'chatMsg ' + (who === 'user' ? 'user' : 'bot'); div.textContent = text;
  chatBody.appendChild(div); chatBody.scrollTop = chatBody.scrollHeight;
}
function botMessage(text, delay = 700) {
  const typing = document.createElement('div'); typing.className = 'chatMsg bot'; typing.textContent = '…';
  chatBody.appendChild(typing); chatBody.scrollTop = chatBody.scrollHeight;
  setTimeout(() => { typing.remove(); appendChat('bot', text); }, delay);
}

function handleUserInput(text) {
  appendChat('user', text);
  const t = text.toLowerCase();
  if (t.includes('pusing') || t.includes('sakit kepala')) botMessage('Maaf mendengar itu. Apakah frekuensinya baru-baru ini? Jika parah, segera konsultasi ke fasilitas medis.');
  else if (t.includes('batuk')) botMessage('Batuk bisa disebabkan banyak hal. Istirahat, minum hangat, dan periksa jika berlangsung 1 minggu atau disertai demam.');
  else if (t.includes('stres') || t.includes('depres')) botMessage('Tarik napas dalam 3x, coba lakukan jalan 10 menit. Kalau perlu, buat janji konsultasi.');
  else if (t.includes('halo') || t.includes('hai')) botMessage('Halo! 😊 Ada yang bisa saya bantu seputar kesehatan?');
  else botMessage('Terima kasih sudah berbagi. Untuk diagnosis riil, silakan hubungi layanan konsultasi kami karena ini simulasi.');
}

if (sendChat) sendChat.addEventListener('click', () => {
  const val = chatInput.value.trim(); if (!val) return; handleUserInput(val); chatInput.value = '';
});
if (chatInput) chatInput.addEventListener('keypress', e => { if (e.key === 'Enter') { e.preventDefault(); sendChat.click(); } });

/* Accessibility: close chat with escape */
document.addEventListener('keydown', e => { if (e.key === 'Escape') { if (chatWindow && chatWindow.style.display === 'flex') closeChat.click(); } });
