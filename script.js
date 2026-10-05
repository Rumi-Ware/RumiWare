/* Rumiware — script.js (shared by every page). Vanilla JS, no libraries. */
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  root.classList.add('js');
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Dark / light mode (the tiny script in <head> sets the first value to avoid a flash) */
  var themeBtn = $('#theme');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next); store.set('rw-theme', next);
  });

  /* Mobile menu */
  var menuBtn = $('#menu'), nav = $('#nav');
  function closeMenu() { if (nav) { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); } }
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      var open = nav.classList.toggle('open'); menuBtn.setAttribute('aria-expanded', open);
    });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeMenu(); menuBtn.focus(); } });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', closeMenu); });
  }

  /* Highlight the current page in the menu */
  var here = location.pathname.split('/').pop() || 'index.html';
  $$('#nav ul a').forEach(function (a) {
    if (a.getAttribute('href') === here) a.setAttribute('aria-current', 'page');
  });

  /* Header shadow + back-to-top button */
  var header = $('.site-header'), top = $('.back-top');
  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 8);
    if (top) top.classList.toggle('show', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  if (top) top.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });

  /* Scroll reveal: add class "reveal" to anything that should fade in */
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (items) {
      items.forEach(function (i) { if (i.isIntersecting) { i.target.classList.add('in'); io.unobserve(i.target); } });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else reveals.forEach(function (el) { el.classList.add('in'); });

  /* Animated counters: <span data-count="120" data-suffix="+">0</span> */
  function runCount(el) {
    var end = parseFloat(el.dataset.count), suf = el.dataset.suffix || '', t0 = null;
    if (reduce) { el.textContent = end + suf; return; }
    (function step(t) {
      t0 = t0 || t; var p = Math.min((t - t0) / 1400, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suf;
      if (p < 1) requestAnimationFrame(step);
    })(performance.now());
  }
  var counters = $$('[data-count]');
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (items) {
      items.forEach(function (i) { if (i.isIntersecting) { runCount(i.target); co.unobserve(i.target); } });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { co.observe(el); });
  } else counters.forEach(runCount);

  /* Cookie / consent banner */
  var cookie = $('#cookie');
  if (cookie && !store.get('rw-consent')) cookie.hidden = false;
  $$('[data-consent]', cookie || d).forEach(function (b) {
    b.addEventListener('click', function () { store.set('rw-consent', b.dataset.consent); cookie.hidden = true; });
  });

  /* Footer year */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
