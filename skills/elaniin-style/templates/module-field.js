/*
  Elaniin module field — pointer trail (vanilla, no dependencies).
  Ported from elaniin-2027-website-main: src/components/sections/hero/module-field.tsx

  The resting grid is pure CSS (the `module-field` utility in tokens.css). This script only
  adds the lit layer: a canvas where squares within 6 cells of the pointer light up cell by
  cell, stepping up the blue ramp (blue-300 -> blue-400 -> blue-500) and fading out in ~260ms.
  Off for touch screens and prefers-reduced-motion (the resting grid stays as texture).

  Markup (host must be position:relative + overflow-hidden; the field listens on its parent):
    <section class="relative isolate overflow-hidden section-y">
      <div class="module-field" data-module-field aria-hidden="true"></div>
      <div class="container-site relative">…content…</div>
    </section>

  Paste inside a <script> at the end of <body>, or load it as a file. Safe to run twice.
*/
(function () {
  var fields = document.querySelectorAll('[data-module-field]');
  if (!fields.length) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || matchMedia('(pointer: coarse)').matches) return;

  var RADIUS = 6;     // cells of influence around the pointer
  var DECAY_MS = 260; // time constant of the fade-out
  var SIZES = [3, 3, 2];                  // px, brightest step first
  var MIN = [0.66, 0.33, 0.04];           // intensity thresholds per step
  var FALLBACK = ['#1054ff', '#4d75fd', '#6a9aff'];

  Array.prototype.forEach.call(fields, function (field) {
    if (field.dataset.moduleReady) return;
    field.dataset.moduleReady = '1';

    var host = field.parentElement;
    var cs = getComputedStyle(field);
    var pitch = parseFloat(cs.getPropertyValue('--module-pitch')) || 16;
    var colors = [1, 2, 3].map(function (n, i) {
      return cs.getPropertyValue('--module-lit-' + n).trim() || FALLBACK[i];
    });

    var canvas = document.createElement('canvas');
    field.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    if (!host || !ctx) return;

    var cols = 0, dpr = 1;
    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      var r = host.getBoundingClientRect();
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      canvas.style.width = r.width + 'px';
      canvas.style.height = r.height + 'px';
      cols = Math.ceil(r.width / pitch);
    }
    resize();
    new ResizeObserver(resize).observe(host);

    var lit = new Map(); // cell index -> intensity 0..1
    var raf = 0, last = 0;

    function draw(now) {
      var dt = last ? now - last : 16;
      last = now;
      var k = Math.exp(-dt / DECAY_MS);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      lit.forEach(function (v, key) {
        var next = v * k;
        if (next < 0.04) { lit.delete(key); return; }
        lit.set(key, next);
        var step = next >= MIN[0] ? 0 : next >= MIN[1] ? 1 : 2;
        var size = SIZES[step];
        ctx.fillStyle = colors[step];
        ctx.fillRect((key % cols) * pitch + pitch / 2 - size / 2,
                     Math.floor(key / cols) * pitch + pitch / 2 - size / 2, size, size);
      });
      if (lit.size > 0) raf = requestAnimationFrame(draw);
      else { raf = 0; last = 0; }
    }

    host.addEventListener('pointermove', function (e) {
      var rect = host.getBoundingClientRect();
      var cx = (e.clientX - rect.left) / pitch, cy = (e.clientY - rect.top) / pitch;
      var c0 = Math.floor(cx), r0 = Math.floor(cy);
      for (var dy = -RADIUS; dy <= RADIUS; dy++) {
        for (var dx = -RADIUS; dx <= RADIUS; dx++) {
          var col = c0 + dx, row = r0 + dy;
          if (col < 0 || col >= cols || row < 0) continue;
          var d = Math.hypot(col + 0.5 - cx, row + 0.5 - cy);
          if (d > RADIUS) continue;
          var v = Math.pow(1 - d / RADIUS, 1.4), key = row * cols + col;
          if (v > (lit.get(key) || 0)) lit.set(key, v);
        }
      }
      if (!raf) raf = requestAnimationFrame(draw);
    });
  });
})();
