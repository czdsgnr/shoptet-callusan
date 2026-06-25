/* ==========================================================================
   Callusan – Shoptet custom JS
   Hostováno na GitHub Pages: https://czdsgnr.github.io/shoptet-callusan/shoptet.js
   Edituj tady → commit → push (Pages build ~1–2 min) → refresh na webu.
   ========================================================================== */
(function () {
  'use strict';

  /* --------------------------------------------------------------------------
     Lišta důvěry – tenký pruh nad #header (styl v shoptet.css → .cal-trustbar)
     -------------------------------------------------------------------------- */
  function injectTrustbar() {
    if (document.querySelector('.cal-trustbar')) return;        // idempotentní
    var header = document.getElementById('header');
    if (!header || !header.parentNode) return;
    var items = [
      'Německá péče o nohy od roku 1925',
      'Doporučují podologové',
      'Nemastná pěna, vstřebá se ihned'
    ];
    var bar = document.createElement('div');
    bar.className = 'cal-trustbar';
    bar.setAttribute('role', 'complementary');
    bar.setAttribute('aria-label', 'Proč Callusan');
    var html = '<div class="cal-trustbar-in">';
    for (var i = 0; i < items.length; i++) {
      html += '<span class="cal-trustbar-item">' + items[i] + '</span>';
    }
    bar.innerHTML = html + '</div>';
    header.parentNode.insertBefore(bar, header);
    setupTrustbarRotation(bar);
  }

  /* Mobil: prostřídá všechny 3 claimy (fallback v CSS = jen 1. claim) */
  function setupTrustbarRotation(bar) {
    var items = bar.querySelectorAll('.cal-trustbar-item');
    if (items.length < 2) return;
    var mq = window.matchMedia('(max-width: 767px)');
    var idx = 0, timer = null;
    function show(i) {
      for (var j = 0; j < items.length; j++) {
        items[j].classList.toggle('is-active', j === i);
      }
    }
    function start() {
      if (timer) return;
      idx = 0; show(0);
      bar.classList.add('cal-trustbar--rotating');
      timer = setInterval(function () {
        idx = (idx + 1) % items.length; show(idx);
      }, 3500);
    }
    function stop() {
      if (timer) { clearInterval(timer); timer = null; }
      bar.classList.remove('cal-trustbar--rotating');
      for (var j = 0; j < items.length; j++) items[j].classList.remove('is-active');
    }
    function apply() { mq.matches ? start() : stop(); }
    apply();
    if (mq.addEventListener) mq.addEventListener('change', apply);
    else if (mq.addListener) mq.addListener(apply);
  }

  /* --------------------------------------------------------------------------
     Sticky header – jemný stín, jakmile odscrollujeme od vršku (styl v CSS)
     -------------------------------------------------------------------------- */
  function setupStickyHeader() {
    var root = document.documentElement;
    function onScroll() {
      root.classList.toggle('cal-header-stuck', window.pageYOffset > 8);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* --------------------------------------------------------------------------
     Login popup – vpravo panel výhod „Ještě nemáte účet?" (styl v CSS)
     Formulář (vč. CSRF) se nemění, jen se přesune do levého sloupce.
     -------------------------------------------------------------------------- */
  function setupLoginBenefits() {
    var inner = document.querySelector('.login-widget .popup-widget-inner');
    if (!inner || inner.querySelector('.cal-login-benefits')) return;
    var widget = inner.closest('.login-widget');
    var main = document.createElement('div');
    main.className = 'cal-login-main';
    while (inner.firstChild) main.appendChild(inner.firstChild);
    var aside = document.createElement('aside');
    aside.className = 'cal-login-benefits';
    aside.innerHTML =
      '<h3 class="cal-lb-title">Ještě nemáte účet?</h3>' +
      '<p class="cal-lb-sub">Zaregistrujte se zdarma a získejte:</p>' +
      '<ul class="cal-lb-list">' +
        '<li>Historie objednávek na jednom místě</li>' +
        '<li>Rychlejší nákup bez vyplňování údajů</li>' +
        '<li>Přehled o stavu objednávek</li>' +
        '<li>Speciální nabídky pro registrované</li>' +
      '</ul>' +
      '<a class="cal-lb-btn" href="/registrace/" rel="nofollow">Vytvořit účet zdarma</a>';
    inner.appendChild(main);
    inner.appendChild(aside);
    inner.classList.add('cal-login-2col');
    if (widget) widget.classList.add('cal-login-wide');
  }

  function init() {
    injectTrustbar();
    setupStickyHeader();
    setupLoginBenefits();
  }
  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);

  /* záloha: kdyby se popup dorenderoval až na kliknutí na účet */
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('[data-target="login"]')) {
      setTimeout(setupLoginBenefits, 60);
    }
  }, true);

})();
