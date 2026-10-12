const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const toggle = document.querySelector('.nav-toggle');
const links = document.getElementById('nav-links');

function setMenu(open) {
  links.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
}
toggle.addEventListener('click', () => setMenu(!links.classList.contains('open')));
links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealEls.forEach(el => revealObs.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('visible'));
}

const navLinks = document.querySelectorAll('.nav-links a');
const sections = [...navLinks]
  .map(a => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);

const spy = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a =>
        a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id)
      );
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => spy.observe(s));

const typedEl = document.getElementById('typed');
const roles = [
  'estudiante de Ingeniería en Sistemas',
  'desarrollador backend',
  'desarrollador móvil',
  'loco por el codigo'
];

if (typedEl) {
  if (reduceMotion) {
    typedEl.textContent = roles[0];
  } else {
    let r = 0, c = 0, deleting = false;
    (function tick() {
      const word = roles[r];
      typedEl.textContent = word.slice(0, c);
      let delay = deleting ? 35 : 75;

      if (!deleting && c === word.length) { deleting = true; delay = 1600; }
      else if (deleting && c === 0) { deleting = false; r = (r + 1) % roles.length; delay = 400; }
      else { c += deleting ? -1 : 1; }

      setTimeout(tick, delay);
    })();
  }
}

const counters = document.querySelectorAll('[data-count]');
function runCounter(el) {const toggle = document.querySelector('.nav-toggle');

  const target = +el.dataset.count;
  if (reduceMotion) { el.textContent = target; return; }
  const duration = 1200;
  const start = performance.now();
  (function step(now) {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  })(start);
}
if ('IntersectionObserver' in window) {
  const countObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) { runCounter(e.target); obs.unobserve(e.target); }
    });
  }, { threshold: 0.6 });
  counters.forEach(c => countObs.observe(c));
} else {
  counters.forEach(runCounter);
}

document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('pointermove', e => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
    card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
  });
});