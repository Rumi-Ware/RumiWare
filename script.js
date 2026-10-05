/* Rumiware shared script.js - theme, menu, reveal, counters, slider, cookie, back-to-top */
(function () {
  var d = document, root = d.documentElement;
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {} }

  // Theme (dark is default; choice is remembered)
  function setTheme(t) {
    root.setAttribute('data-theme', t);
    var b = d.getElementById('themeBtn');
    if (b) { b.textContent = t === 'dark' ? '\u2600' : '\u263E'; b.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'); }
  }
  setTheme(store('rw-theme') === 'light' ? 'light' : 'dark');
  var tb = d.getElementById('themeBtn');
  if (tb) tb.onclick = function () { var n = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'; setTheme(n); store('rw-theme', n); };

  // Mobile menu
  var mb = d.getElementById('menuBtn'), nav = d.getElementById('nav');
  if (mb) mb.onclick = function () { var o = nav.classList.toggle('open'); mb.setAttribute('aria-expanded', o); };
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav) { nav.classList.remove('open'); mb.setAttribute('aria-expanded', false); } });

  // Scroll reveal
  var rv = d.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: .12 });
    rv.forEach(function (el) { io.observe(el); });
  } else rv.forEach(function (el) { el.classList.add('in'); });

  // Animated counters
  var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function count(el) {
    var end = +el.dataset.count, suf = el.dataset.suffix || '', t0 = null;
    if (calm) { el.textContent = end + suf; return; }
    (function step(t) { t0 = t0 || t; var p = Math.min((t - t0) / 1600, 1); el.textContent = Math.round(end * p) + suf; if (p < 1) requestAnimationFrame(step); })(performance.now());
  }
  var cs = d.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { count(e.target); co.unobserve(e.target); } }); });
    cs.forEach(function (el) { co.observe(el); });
  } else cs.forEach(count);

  // Testimonial slider
  var slides = d.querySelectorAll('.slide'), dots = d.querySelectorAll('.dots button'), i = 0, timer;
  function show(n) { i = (n + slides.length) % slides.length; slides.forEach(function (s, k) { s.classList.toggle('on', k === i); }); dots.forEach(function (b, k) { b.setAttribute('aria-current', k === i); }); }
  dots.forEach(function (b, k) { b.onclick = function () { show(k); }; });
  if (slides.length) { show(0); if (!calm) timer = setInterval(function () { show(i + 1); }, 6000); }

  // Back to top
  var top = d.getElementById('top');
  if (top) { addEventListener('scroll', function () { top.classList.toggle('show', scrollY > 600); }, { passive: true }); top.onclick = function () { scrollTo({ top: 0, behavior: calm ? 'auto' : 'smooth' }); }; }

  // Cookie banner
  var ck = d.getElementById('cookie');
  if (ck && !store('rw-cookie')) ck.classList.add('show');
  d.querySelectorAll('[data-cookie]').forEach(function (b) { b.onclick = function () { store('rw-cookie', b.dataset.cookie); ck.classList.remove('show'); }; });

  // Footer year
  var y = d.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
})();
