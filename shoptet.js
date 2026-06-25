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
  }

  if (document.readyState !== 'loading') injectTrustbar();
  else document.addEventListener('DOMContentLoaded', injectTrustbar);

})();
