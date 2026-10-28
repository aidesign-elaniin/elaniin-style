/*
  Elaniin nav theme (vanilla). The sticky bar (`nav-bar`) adopts the color of the section under it:
  - whole SECTIONS with a dark background of their own declare data-nav-theme="blue" (Excellence Blue) or "black" (Elaniin Black);
    the closing CTA and the footer are blue. The color of the SECTION decides, never the color of the resources inside it.
  - this script (rAF-throttled, also on resize) finds the section that crosses the middle of the bar and sets
    data-theme="light|dark" and data-tone="blue|black" on the header.
  Markup:  <header class="nav-bar" data-nav-bar> … <section data-nav-theme="blue"> …
  While a menu or the mobile drawer is open keep the bar light: set data-nav-lock on the header.
*/
(function () {
  var bar = document.querySelector('[data-nav-bar]');
  if (!bar) return;
  var raf = null;
  function update() {
    raf = null;
    if (bar.hasAttribute('data-nav-lock')) { bar.dataset.theme = 'light'; return; }
    var mid = bar.offsetHeight / 2, theme = 'light', tone = 'blue';
    document.querySelectorAll('[data-nav-theme]').forEach(function (s) {
      var r = s.getBoundingClientRect();
      if (r.top <= mid && r.bottom > mid) { theme = 'dark'; tone = s.dataset.navTheme === 'black' ? 'black' : 'blue'; }
    });
    bar.dataset.theme = theme;
    bar.dataset.tone = tone;
  }
  function schedule() { if (raf === null) raf = requestAnimationFrame(update); }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  update();
})();
