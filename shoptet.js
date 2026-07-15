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
    // Texty lišty jdou přepsat z administrace: v hlavičce webu stačí nastavit
    // window.CAL_TRUSTBAR = ['text 1','text 2', ...]; jinak se použijí výchozí.
    var items = (Array.isArray(window.CAL_TRUSTBAR) && window.CAL_TRUSTBAR.length)
      ? window.CAL_TRUSTBAR
      : [
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
    var anchor = document.querySelector('.benefit-banners-full-width');
    if (!anchor || !anchor.parentNode) return;
    // Ručně vložený blok z administrace (editor homepage ho vysype až dole)
    // → nevytvářet druhý, jen ho přesunout pod USP pruh, kam patří.
    var existing = document.querySelector('.cal-rozcestnik');
    if (existing) {
      if (existing.previousElementSibling !== anchor) {
        anchor.parentNode.insertBefore(existing, anchor.nextSibling);
      }
      return;
    }
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
      '<span class="cal-ci-hours">Po–Pá 8:00–14:00</span>';
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
     přesunout jako overlay do pravého horního rohu fotky (styl v CSS)
     -------------------------------------------------------------------------- */
  function moveProductBadges() {
    var short = document.querySelector('.p-short-description');
    // .p-image je přesně široké jako fotka (na rozdíl od .p-image-wrapper,
    // které má vpravo prázdný pruh) → badge se pak vejde celý na fotku
    var img = document.querySelector('.p-image') || document.querySelector('.p-image-wrapper');
    if (!short || !img) return;
    var badgeP = null, ps = short.querySelectorAll('p');
    for (var i = 0; i < ps.length; i++) {
      if (ps[i].querySelector('img')) { badgeP = ps[i]; break; }
    }
    if (!badgeP || badgeP.classList.contains('cal-badges-top')) return;
    img.style.position = 'relative';   // kotva pro absolutní badge
    img.appendChild(badgeP);
    badgeP.classList.add('cal-badges-top');
  }

  /* --------------------------------------------------------------------------
     Výpis produktů (kategorie): badge z popisu karty → overlay do pravého
     horního rohu fotky. Styl v CSS → .cal-badges-card
     -------------------------------------------------------------------------- */
  function moveListingBadges() {
    var cards = document.querySelectorAll('.products-block .product');
    for (var c = 0; c < cards.length; c++) {
      var card = cards[c];
      var image = card.querySelector('.image');
      if (!image) continue;
      var badgeP = null, ps = card.querySelectorAll('.p-desc p');
      for (var i = 0; i < ps.length; i++) {
        if (ps[i].querySelector('img')) { badgeP = ps[i]; break; }
      }
      if (!badgeP || badgeP.classList.contains('cal-badges-card')) continue;
      image.style.position = 'relative';   // kotva pro absolutní badge
      image.appendChild(badgeP);
      badgeP.classList.add('cal-badges-card');
    }
  }

  /* --------------------------------------------------------------------------
     Detail produktu: pod každou variantu dopsat objem (ml).
     Hodnota je v tooltipu thumbnailu (data-original-title="ml: 300"). Styl v CSS.
     -------------------------------------------------------------------------- */
  function addVariantMl() {
    var inners = document.querySelectorAll('.variant-list .advanced-parameter-inner');
    for (var i = 0; i < inners.length; i++) {
      var inner = inners[i];
      var cell = inner.closest('.advanced-parameter');
      if (!cell || cell.querySelector('.cal-variant-ml')) continue;
      var t = inner.getAttribute('data-original-title') || inner.getAttribute('title') || '';
      var m = t.match(/(\d+)/);
      if (!m) continue;
      var lab = document.createElement('span');
      lab.className = 'cal-variant-ml';
      lab.textContent = m[1] + ' ml';
      cell.appendChild(lab);
    }
  }

  /* --------------------------------------------------------------------------
     Detail produktu: zvýraznit největší variantu (= nejvýhodnější balení)
     badgem „Nejvýhodnější" nad thumbnailem. Nic automaticky nevybírá.
     -------------------------------------------------------------------------- */
  function highlightBestVariant() {
    var inners = document.querySelectorAll('.variant-list .advanced-parameter-inner');
    if (!inners.length) return;
    var best = null, bestMl = -1;
    for (var i = 0; i < inners.length; i++) {
      var t = inners[i].getAttribute('data-original-title') || inners[i].getAttribute('title') || '';
      if (!/ml/i.test(t)) continue;                          // jen objemové varianty
      var m = t.match(/(\d+)/);
      var ml = m ? parseInt(m[1], 10) : -1;
      if (ml > bestMl) { bestMl = ml; best = inners[i]; }
    }
    if (!best) return;
    var cell = best.closest('.advanced-parameter');
    if (!cell || cell.querySelector('.cal-variant-best')) return;
    cell.classList.add('cal-variant-best-cell');
    var b = document.createElement('span');
    b.className = 'cal-variant-best';
    b.textContent = 'Nejvýhodnější';
    cell.insertBefore(b, cell.firstChild);
  }

  /* --------------------------------------------------------------------------
     Detail produktu: z holých odstavců krátkého popisu udělat USP prvky
     (chip pro diabetiky, dárkový box, „Víte, že" karta, badge nejvýhodnější).
     Rozpoznává podle klíčových slov (bez diakritiky). Styl v CSS → .cal-usp-*
     -------------------------------------------------------------------------- */
  var USP_ICON = {
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6z"/><path d="M9 12l2 2 4-4"/></svg>',
    gift: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11h16v9H4z"/><path d="M3 7h18v4H3z"/><path d="M12 7v13"/><path d="M12 7C11 4 9.5 3 8 3.6 6.3 4 6.5 6.9 8 7z"/><path d="M12 7c1-3 2.5-4 4-3.4 1.7.4 1.5 3.3 0 3.4z"/></svg>',
    bulb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 21h4"/><path d="M8.5 14A5 5 0 1 1 15.5 14c-.7.7-1.4 1.4-1.5 2.5H10c-.1-1.1-.8-1.8-1.5-2.5z"/></svg>',
    award: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="6"/><path d="M9 14l-1 7 4-2.5L16 21l-1-7"/></svg>'
  };
  function decorateUSP() {
    var sd = document.querySelector('.p-short-description');
    if (!sd) return;
    var ps = sd.querySelectorAll('p');
    for (var i = 0; i < ps.length; i++) {
      var p = ps[i];
      if (p.querySelector('img') || /cal-usp/.test(p.className)) continue;
      var norm = (p.textContent || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
      var html = p.innerHTML;
      if (/diabetik/.test(norm)) {
        p.classList.add('cal-usp-chip');
        p.innerHTML = USP_ICON.shield + '<span>' + html + '</span>';
      } else if (/zdarma|darek/.test(norm)) {
        // částku „NN ml … zdarma" zvýraznit teal a nezalomit uprostřed
        html = html.replace(/(\d+\s*ml[^<\d]*?zdarma)/i, '<b class="cal-usp-em">$1</b>');
        p.classList.add('cal-usp-gift');
        p.innerHTML = '<span class="ico">' + USP_ICON.gift + '</span><span>' + html + '</span>';
      } else if (/vite,?\s*ze/.test(norm)) {
        p.classList.add('cal-usp-know');
        p.innerHTML = USP_ICON.bulb + '<span>' + html + '</span>';
      } else if (/nejvyhodnejsi/.test(norm)) {
        p.classList.add('cal-usp-best');
        p.innerHTML = USP_ICON.award + '<span>' + html + '</span>';
      }
    }
  }

  /* --------------------------------------------------------------------------
     Homepage: pod blok „Nové články" přidat tlačítko na výpis všech článků.
     Styl v CSS → .cal-blog-all
     -------------------------------------------------------------------------- */
  function addBlogAllButton() {
    if (!document.body || document.body.className.indexOf('in-index') === -1) return;
    var wrap = document.querySelector('.homepage-blog-wrapper');
    if (!wrap || document.querySelector('.cal-blog-all')) return;
    var first = wrap.querySelector('.news-item > a');
    if (!first) return;
    // odvodit odkaz na výpis z prvního článku: /blog/nazev/ → /blog/
    var href = first.getAttribute('href') || '';
    var base = href.replace(/^(\/[^\/]+\/).*$/, '$1') || '/blog/';
    var box = document.createElement('div');
    box.className = 'cal-blog-all';
    box.innerHTML = '<a href="' + base + '">Zobrazit všechny články' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>';
    wrap.parentNode.insertBefore(box, wrap.nextSibling);
  }

  /* --------------------------------------------------------------------------
     Homepage: pruh recenzí. Data se tahají živě z /hodnoceni-obchodu/, takže
     jsou vždy aktuální (žádné natvrdo psané recenze). Styl v CSS → .cal-rev-*
     -------------------------------------------------------------------------- */
  function revStars(n) {
    var s = '';
    for (var i = 0; i < 5; i++) {
      s += '<svg viewBox="0 0 24 24" width="16" height="16" fill="' + (i < n ? '#FFB400' : '#DCDCDC') + '" aria-hidden="true">' +
        '<path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/></svg>';
    }
    return s;
  }
  function injectReviews() {
    if (!document.body) return;
    var cls = document.body.className;
    var isHome = cls.indexOf('in-index') > -1;
    var isCat = cls.indexOf('type-category') > -1;   // platí pro všechny kategorie
    if (!isHome && !isCat) return;
    if (document.querySelector('.cal-reviews')) return;
    // homepage → pod články; kategorie → pod výpis produktů
    var anchor = isHome
      ? (document.querySelector('.cal-blog-all') || document.querySelector('.homepage-blog-wrapper'))
      : (document.querySelector('.category-content-wrapper') || document.querySelector('.products-block'));
    if (!anchor || !anchor.parentNode) return;
    fetch('/hodnoceni-obchodu/', { credentials: 'same-origin' })
      .then(function (r) { return r.text(); })
      .then(function (txt) {
        var doc = new DOMParser().parseFromString(txt, 'text/html');
        function t(el) { return el ? el.textContent.trim() : ''; }
        var avg = t(doc.querySelector('.rate-average'));
        var label = t(doc.querySelector('.stars-label'));
        var votes = [].slice.call(doc.querySelectorAll('.votes-wrap .vote-wrap'));
        var picked = [];
        for (var i = 0; i < votes.length && picked.length < 4; i++) {
          var txtIn = t(votes[i].querySelector('.vote-content'));
          if (txtIn.length < 8) continue;               // přeskoč holé hvězdičky
          picked.push({
            txt: txtIn,
            name: t(votes[i].querySelector('.vote-name')),
            date: t(votes[i].querySelector('.vote-time')),
            stars: votes[i].querySelectorAll('.star.star-on').length || 5
          });
        }
        if (!picked.length) return;
        var cards = '';
        for (var j = 0; j < picked.length; j++) {
          var p = picked[j];
          cards += '<article class="cal-rev-card">' +
            '<div class="cal-rev-stars">' + revStars(p.stars) + '</div>' +
            '<p class="cal-rev-txt">' + p.txt.replace(/</g, '&lt;') + '</p>' +
            '<div class="cal-rev-meta"><strong>' + p.name.replace(/</g, '&lt;') + '</strong>' + p.date + '</div>' +
            '</article>';
        }
        var sec = document.createElement('section');
        sec.className = 'cal-reviews';
        sec.setAttribute('aria-label', 'Hodnocení zákazníků');
        sec.innerHTML =
          '<div class="cal-rev-head">' +
            (avg ? '<span class="cal-rev-score">' + avg + '</span>' : '') +
            '<div><p class="cal-rev-htitle">Co říkají naši zákazníci</p>' +
            '<span class="cal-rev-count">' + (label || 'hodnocení') + '</span></div>' +
            '<a class="cal-rev-all" href="/hodnoceni-obchodu/">Zobrazit všechny recenze' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="17" height="17"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>' +
          '</div><div class="cal-rev-grid">' + cards + '</div>';
        anchor.parentNode.insertBefore(sec, anchor.nextSibling);
      })
      .catch(function () { /* ticho – pruh se prostě nezobrazí */ });
  }

  function init() {
    injectTrustbar();
    setupStickyHeader();
    setupLoginBenefits();
    injectRozcestnik();
    setupCheckoutHeader();
    addIconLabels();
    moveProductBadges();
    moveListingBadges();
    addVariantMl();
    highlightBestVariant();
    decorateUSP();
    addBlogAllButton();
    injectReviews();
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
