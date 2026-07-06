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

  /* --------------------------------------------------------------------------
     Rozcestník podle symptomů – dlaždice s foto produktu za USP (jen homepage)
     -------------------------------------------------------------------------- */
  function injectRozcestnik() {
    if (!document.body || document.body.className.indexOf('in-index') === -1) return;
    if (document.querySelector('.cal-rozcestnik')) return;
    var anchor = document.querySelector('.benefit-banners-full-width');
    if (!anchor || !anchor.parentNode) return;
    var IMG = 'https://czdsgnr.github.io/shoptet-callusan/img/';
    var tiles = [
      { t: 'Suchá kůže', u: '/sucha-pokozka/', img: IMG + 'rz-sucha-kuze.jpg' },
      { t: 'Popraskané paty', u: '/popraskane-paty/', img: IMG + 'rz-popraskane-paty.jpg' },
      { t: 'Tvrdé paty a mozoly', u: '/tvrde-paty/', img: IMG + 'rz-tvrde-paty.jpg' },
      { t: 'Pocení nohou', u: '/nadmerne-poceni/', img: IMG + 'rz-poceni.jpg' },
      { t: 'Těžké a unavené nohy', u: '/tezke-unavene-nohy/', img: IMG + 'rz-tezke-nohy.jpg' },
      { t: 'Plíseň', u: '/plisnova-onemocneni/', img: IMG + 'rz-plisen.jpg' },
      { t: 'Bezpečně pro diabetiky', u: '/diabetes/', img: IMG + 'rz-diabetici.jpg' },
      { t: 'Ekzém a citlivá pokožka', u: '/atopicky-ekzem/', img: IMG + 'rz-ekzem.jpg' }
    ];
    var html = '<div class="cal-rz-in"><h2 class="cal-rz-title">Najděte řešení podle svého problému</h2><div class="cal-rz-grid">';
    for (var k = 0; k < tiles.length; k++) {
      html += '<a class="cal-rz-tile" href="' + tiles[k].u + '">' +
        '<span class="cal-rz-img"><img src="' + tiles[k].img + '" alt="' + tiles[k].t + '" loading="lazy"></span>' +
        '<span class="cal-rz-body">' +
          '<span class="cal-rz-nm">' + tiles[k].t + '</span>' +
          '<span class="cal-rz-cta">Přejít na řešení <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>' +
        '</span></a>';
    }
    html += '</div></div>';
    var sec = document.createElement('section');
    sec.className = 'cal-rozcestnik';
    sec.setAttribute('aria-label', 'Rozcestník podle problému');
    sec.innerHTML = html;
    anchor.parentNode.insertBefore(sec, anchor.nextSibling);
  }

  /* --------------------------------------------------------------------------
     Checkout (kroky Doprava&platba + Informace o vás = /objednavka/):
     minimální hlavička – logo vlevo, infolinka vpravo. Styl v CSS.
     -------------------------------------------------------------------------- */
  function setupCheckoutHeader() {
    if (location.pathname.indexOf('/objednavka/') !== 0) return;
    document.documentElement.classList.add('cal-checkout-min');
    var wrap = document.querySelector('#header .header-top-wrapper');
    if (!wrap || wrap.querySelector('.cal-checkout-info')) return;
    var info = document.createElement('div');
    info.className = 'cal-checkout-info';
    info.innerHTML =
      '<a class="cal-ci-phone" href="tel:+420777317387">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L16 13l5 2v4a1.6 1.6 0 0 1-1.7 1.6A16 16 0 0 1 3.4 5.7 1.6 1.6 0 0 1 5 4z"/></svg>' +
        '<span>+420 777 317 387</span>' +
      '</a>' +
      '<span class="cal-ci-hours">Po–Pá 8:00–16:00</span>';
    wrap.appendChild(info);
  }

  /* --------------------------------------------------------------------------
     Textové labely k ikonám v hlavičce: Můj účet / Košík
     -------------------------------------------------------------------------- */
  function addIconLabels() {
    var nb = document.querySelector('.navigation-buttons');
    if (!nb) return;
    function add(el, txt) {
      if (el && !el.querySelector('.cal-iclabel')) {
        var s = document.createElement('span');
        s.className = 'cal-iclabel';
        s.textContent = txt;
        el.appendChild(s);
      }
    }
    add(nb.querySelector('[data-target="login"]'), 'Můj účet');
    add(nb.querySelector('a[href="/kosik/"]'), 'Košík');
  }

  /* --------------------------------------------------------------------------
     Detail produktu: badge (BESTSELLER / PRODÁNO … kusů) z krátkého popisu
     přesunout nad titulek (na začátek .p-detail-inner)
     -------------------------------------------------------------------------- */
  function moveProductBadges() {
    var inner = document.querySelector('.p-detail-inner');
    var short = document.querySelector('.p-short-description');
    if (!inner || !short) return;
    var badgeP = null, ps = short.querySelectorAll('p');
    for (var i = 0; i < ps.length; i++) {
      if (ps[i].querySelector('img')) { badgeP = ps[i]; break; }
    }
    if (!badgeP || badgeP.classList.contains('cal-badges-top')) return;
    inner.insertBefore(badgeP, inner.firstElementChild);   // úplně nahoru, robustně
    badgeP.classList.add('cal-badges-top');
  }

  function init() {
    injectTrustbar();
    setupStickyHeader();
    setupLoginBenefits();
    injectRozcestnik();
    setupCheckoutHeader();
    addIconLabels();
    moveProductBadges();
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
