/*
  Elaniin drawer — off-canvas mobile navigation (vanilla, no dependencies).

  Pairs with the `drawer` + `scrim` utilities in tokens.css. Works for a dashboard sidebar
  (persistent from lg) and for a landing's mobile menu (add `md:hidden` to drawer + scrim and
  data-drawer-from="md").

  Markup:
    <button data-menu-button aria-controls="app-drawer" aria-expanded="false" aria-label="Open menu" class="lg:hidden">…</button>
    <div class="scrim" data-scrim aria-hidden="true"></div>
    <aside id="app-drawer" data-drawer class="drawer" aria-label="Main">
      <button data-menu-close aria-label="Close menu">…</button>
      <nav>…links…</nav>
    </aside>

  Behavior: focus moves into the drawer; Esc, scrim, close button or any link closes it and
  returns focus to the menu button; Tab is trapped inside while open; page scroll is locked;
  it closes by itself when the viewport grows to the persistent layout.
*/
(function () {
  var drawer = document.querySelector('[data-drawer]');
  var btn = document.querySelector('[data-menu-button]');
  var scrim = document.querySelector('[data-scrim]');
  if (!drawer || !btn || !scrim) return;

  var desktop = matchMedia('(min-width: ' + (drawer.dataset.drawerFrom === 'md' ? '48rem' : '64rem') + ')');
  var FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
  var isOpen = false;

  function setOpen(open, restoreFocus) {
    if (open === isOpen) return;
    isOpen = open;
    drawer.dataset.open = String(open);
    scrim.dataset.open = String(open);
    btn.setAttribute('aria-expanded', String(open));
    document.documentElement.classList.toggle('overflow-hidden', open);
    if (open) {
      var first = drawer.querySelector(FOCUSABLE);
      if (first) first.focus();
    } else if (restoreFocus) {
      btn.focus();
    }
  }

  btn.addEventListener('click', function () { setOpen(!isOpen, true); });
  scrim.addEventListener('click', function () { setOpen(false, true); });
  drawer.addEventListener('click', function (e) {
    if (e.target.closest('[data-menu-close], a[href]')) setOpen(false, true);
  });

  document.addEventListener('keydown', function (e) {
    if (!isOpen) return;
    if (e.key === 'Escape') { setOpen(false, true); return; }
    if (e.key !== 'Tab') return;
    var items = drawer.querySelectorAll(FOCUSABLE);
    if (!items.length) return;
    var first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  var onResize = function () { if (desktop.matches) setOpen(false, false); };
  if (desktop.addEventListener) desktop.addEventListener('change', onResize);
  else desktop.addListener(onResize);
})();
