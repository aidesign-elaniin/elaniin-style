/*
  Elaniin isometric resource — vanilla build (no dependencies). Ported from the Elaniin 2027 site:
  src/components/ui/iso/* and src/components/sections/hero/hero-stack.tsx (DESIGN.md motifs.isometric).
  React/Next build of the same scene: templates/iso/.  Rules and recipe: references/isometric.md.

  WHAT IS CSS AND WHAT IS NOT
  - CSS (tokens.css): colors via var(--color-*) written inline on SVG shapes, the `rise` entrance, the
    `iso-levitate` / `iso-float` loops, the frost (backdrop-filter + clip-path) and reduced motion.
  - NOT CSS (this file): the isometric projection and every SVG matrix / polygon, and the 12s clock that
    derives pulse position, arm length, slab slide and opacity. JS writes those as SVG attributes and inline
    transform / opacity on every tick: there are no CSS transitions in the main motion.

  Markup (needs the `<symbol id="elaniin-logo-blue">` of the page sprite, tokens.css, and this script):
    <div data-iso-stack data-software="Software" data-ai="AI" data-cloud="Cloud"></div>
  Decorative: it sets aria-hidden. Under prefers-reduced-motion it renders the assembled state once.
*/
(function () {
  var COS30 = Math.cos(Math.PI / 6);
  var NS = 'http://www.w3.org/2000/svg';

  /* ---------------------------------------------------------------- kit (iso.ts) */
  function project(p, o) { return { x: o.x + (p.x - p.y) * COS30, y: o.y + (p.x + p.y) / 2 - p.z }; }
  function pointsAttr(list, o) {
    return list.map(function (p) { var q = project(p, o); return q.x.toFixed(1) + ',' + q.y.toFixed(1); }).join(' ');
  }
  function planeTransform(o, z) { return 'translate(0 ' + (-z) + ') matrix(' + COS30 + ' 0.5 ' + (-COS30) + ' 0.5 ' + o.x + ' ' + o.y + ')'; }
  function pointAt(line, progress) {
    var lengths = [], total = 0, i;
    for (i = 1; i < line.length; i++) { var l = Math.hypot(line[i].x - line[i - 1].x, line[i].y - line[i - 1].y); lengths.push(l); total += l; }
    var left = Math.min(1, Math.max(0, progress)) * total;
    for (i = 0; i < lengths.length; i++) {
      if (left <= lengths[i] || i === lengths.length - 1) {
        var k = lengths[i] === 0 ? 0 : left / lengths[i];
        return { x: line[i].x + (line[i + 1].x - line[i].x) * k, y: line[i].y + (line[i + 1].y - line[i].y) * k };
      }
      left -= lengths[i];
    }
    return line[0];
  }
  var clamp01 = function (v) { return Math.min(1, Math.max(0, v)); };
  var easeInOut = function (v) { return v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2; };

  /* ---------------------------------------------------------------- glass slab (slab.tsx) */
  var FACES = {
    software: { top: 'var(--color-blue-tint-50)', left: 'var(--color-blue-100)', right: 'var(--color-blue-200)' },
    ai: { top: 'var(--color-blue-800)', left: 'var(--color-excellence-blue)', right: 'var(--color-blue-active-dark)' },
    cloud: { top: 'var(--color-surface-subtle)', left: 'var(--color-border-default)', right: 'var(--color-border-strong)' },
    plate: { top: 'var(--color-white)', left: 'var(--color-blue-tint-50)', right: 'var(--color-blue-100)' }
  };
  var GLASS = { opacity: 0.78, aiOpacity: 0.82, edge: 'var(--color-excellence-blue)' };

  function topFace(b) {
    return [
      { x: b.x, y: b.y, z: b.z + b.h }, { x: b.x + b.w, y: b.y, z: b.z + b.h },
      { x: b.x + b.w, y: b.y + b.d, z: b.z + b.h }, { x: b.x, y: b.y + b.d, z: b.z + b.h }
    ];
  }
  function topTexture(look, b, o) {
    var plane = planeTransform(o, b.z + b.h), items = '', i, j;
    if (look === 'software') {
      for (i = 12; i <= b.w - 12; i += 12) for (j = 12; j <= b.d - 12; j += 12)
        items += '<rect x="' + (b.x + i - 1.5) + '" y="' + (b.y + j - 1.5) + '" width="3" height="3" rx="0.5"/>';
      return '<g transform="' + plane + '" style="fill:var(--color-blue-400);opacity:.6">' + items + '</g>';
    }
    if (look === 'ai') {
      for (i = 12; i < b.w; i += 12) items += '<line x1="' + (b.x + i) + '" y1="' + b.y + '" x2="' + (b.x + i) + '" y2="' + (b.y + b.d) + '"/>';
      for (j = 12; j < b.d; j += 12) items += '<line x1="' + b.x + '" y1="' + (b.y + j) + '" x2="' + (b.x + b.w) + '" y2="' + (b.y + j) + '"/>';
      return '<g transform="' + plane + '" style="stroke:var(--color-white);stroke-width:1;opacity:.14">' + items + '</g>';
    }
    for (j = 10; j < b.d; j += 10) items += '<line x1="' + b.x + '" y1="' + (b.y + j) + '" x2="' + (b.x + b.w) + '" y2="' + (b.y + j) + '"/>';
    return '<g transform="' + plane + '" style="stroke:var(--color-border-input);stroke-width:1;opacity:.5">' + items + '</g>';
  }
  /** SVG markup of a glass slab: left, right and top faces + the fine texture of its look. */
  function slabSvg(look, b, o) {
    var dark = look === 'ai', faces = FACES[look];
    var edge = 'stroke:' + (dark ? 'var(--color-border-on-dark-strong)' : GLASS.edge) + ';stroke-width:1;stroke-linejoin:round;stroke-opacity:' + (dark ? 1 : 0.9);
    var fo = dark ? GLASS.aiOpacity : GLASS.opacity;
    var face = function (fill) { return 'style="fill:' + fill + ';fill-opacity:' + fo + ';' + edge + '"'; };
    var left = [{ x: b.x, y: b.y + b.d, z: b.z }, { x: b.x + b.w, y: b.y + b.d, z: b.z }, { x: b.x + b.w, y: b.y + b.d, z: b.z + b.h }, { x: b.x, y: b.y + b.d, z: b.z + b.h }];
    var right = [{ x: b.x + b.w, y: b.y, z: b.z }, { x: b.x + b.w, y: b.y + b.d, z: b.z }, { x: b.x + b.w, y: b.y + b.d, z: b.z + b.h }, { x: b.x + b.w, y: b.y, z: b.z + b.h }];
    return '<g><polygon points="' + pointsAttr(left, o) + '" ' + face(faces.left) + '/>' +
      '<polygon points="' + pointsAttr(right, o) + '" ' + face(faces.right) + '/>' +
      '<polygon points="' + pointsAttr(topFace(b), o) + '" ' + face(faces.top) + '/>' +
      (look !== 'plate' ? topTexture(look, b, o) : '') + '</g>';
  }
  /** Flat grey diamond with the footprint of a piece, drawn at depth z (shadow). */
  function floorSvg(o, x, y, w, d, z) {
    var pts = pointsAttr([{ x: x, y: y, z: z }, { x: x + w, y: y, z: z }, { x: x + w, y: y + d, z: z }, { x: x, y: y + d, z: z }], o);
    return '<polygon points="' + pts + '" style="fill:var(--color-surface-subtle)"/>';
  }

  /* ---------------------------------------------------------------- the hero scene (hero-stack.tsx) */
  var VB = { x: 67, y: 30, w: 640, h: 500 };
  var VIEWBOX = VB.x + ' ' + VB.y + ' ' + VB.w + ' ' + VB.h;
  var O = { x: 400, y: 246 };
  var LIFT = 36, D = 200, PERIOD = 12000, TICK = 50;
  var PLATE = { x: -90, y: -30, z: 0, w: 350, d: 260, h: 12 };
  var RISER = { x: -68, y: 192, z: 12, w: 16, d: 16, h: 200 };
  var RISER_X = RISER.x + RISER.w, RISER_Y = RISER.y + RISER.d / 2;
  var SLIDE = 28, DIM = 0.4;
  var T = { trace: 1000, traceDur: 1000, rise: 900, branch: 1000, up: 700, hold: 900, down: 700 };
  var PILL_H = 38;

  /* lucide icons (ISC): generic, never a third-party brand logo */
  var ICONS = {
    cloud: '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
    software: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
    ai: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>'
  };
  /* bottom to top, each slab narrower than the one below so a strip of its top face stays visible */
  var STATIONS = [
    { look: 'cloud', box: { x: 0, y: 0, z: 12, w: 230, d: D, h: 40 }, tile: { x: 195, y: 100 } },
    { look: 'software', box: { x: 0, y: 0, z: 72, w: 160, d: D, h: 80 }, tile: { x: 125, y: 100 } },
    { look: 'ai', box: { x: 0, y: 0, z: 172, w: 90, d: D, h: 40 }, tile: { x: 45, y: 100 } }
  ];
  var levelOf = function (s) { return s.box.z + s.box.h / 2; };
  var TIMES = (function () {
    var r = T.trace + T.traceDur;
    return STATIONS.map(function () { var row = { R: r, B: r + T.rise, A: r + T.rise + T.branch }; r = row.B; return row; });
  })();
  var TRACE_SCREEN = [
    { x: PLATE.x + PLATE.w, y: PLATE.y + PLATE.d - 12, z: PLATE.h },
    { x: RISER_X, y: PLATE.y + PLATE.d - 12, z: PLATE.h },
    { x: RISER_X, y: RISER_Y, z: PLATE.h }
  ].map(function (p) { return project(p, O); });

  function envelope(t, a) {
    var s = t - a;
    if (s <= 0) return 0;
    if (s < T.up) return easeInOut(s / T.up);
    if (s < T.up + T.hold) return 1;
    if (s < T.up + T.hold + T.down) return 1 - easeInOut((s - T.up - T.hold) / T.down);
    return 0;
  }
  var pct = function (p) { return (((p.x - VB.x) / VB.w) * 100).toFixed(2) + '% ' + (((p.y - VB.y) / VB.h) * 100).toFixed(2) + '%'; };

  function el(tag, attrs, html) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (html) n.innerHTML = html;
    return n;
  }
  function div(cls, style) { var d = document.createElement('div'); d.className = cls; if (style) d.style.cssText = style; return d; }
  function svgLayer(cls) {
    var s = el('svg', { viewBox: VIEWBOX, focusable: 'false' });
    s.setAttribute('class', cls);
    return s;
  }
  function rise(i) { return 'rise" style="--i:' + i; }

  var uid = 0;
  function mountStack(host, labels) {
    var id = 'iso-halo-' + (++uid);
    var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    host.setAttribute('aria-hidden', 'true');
    host.classList.add('relative', 'w-full');
    host.innerHTML = '';

    /* ground: the shadow stays on the ground while the piece above it levitates */
    var ground = svgLayer('block h-auto w-full');
    ground.innerHTML = '<g class="' + rise(0) + '">' + floorSvg(O, PLATE.x + 10, PLATE.y + 10, PLATE.w - 20, PLATE.d - 20, -LIFT) + '</g>';
    host.appendChild(ground);

    var lev = div('iso-levitate absolute inset-0');
    host.appendChild(lev);

    /* base svg: plate, riser, trace, arms, pulses */
    var layer = 'absolute inset-0 block h-full w-full';
    var base = svgLayer(layer);
    var trace = TRACE_SCREEN.map(function (p) { return p.x.toFixed(1) + ',' + p.y.toFixed(1); }).join(' ');
    base.innerHTML =
      '<defs><filter id="' + id + '" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="3"/></filter></defs>' +
      '<g class="' + rise(0) + '">' + slabSvg('plate', PLATE, O) + slabSvg('plate', RISER, O) + '</g>' +
      '<g class="' + rise(2) + '"><polyline points="' + trace + '" style="fill:none;stroke:var(--color-excellence-blue);stroke-opacity:.4;stroke-width:1;stroke-linejoin:round"/>' +
      '<g data-arms></g><g data-pulses></g></g>';
    lev.appendChild(base);
    var armsG = base.querySelector('[data-arms]'), pulsesG = base.querySelector('[data-pulses]');

    /* per slab: a frost (backdrop blur clipped to its silhouette) and the slab svg */
    var parts = STATIONS.map(function (st, i) {
      var b = st.box;
      var sil = [
        { x: b.x, y: b.y, z: b.z + b.h }, { x: b.x + b.w, y: b.y, z: b.z + b.h }, { x: b.x + b.w, y: b.y, z: b.z },
        { x: b.x + b.w, y: b.y + b.d, z: b.z }, { x: b.x, y: b.y + b.d, z: b.z }, { x: b.x, y: b.y + b.d, z: b.z + b.h }
      ].map(function (p) { return pct(project(p, O)); });
      var frostWrap = div('rise pointer-events-none absolute inset-0', '--i:' + (2 + i * 2));
      var frost = div('absolute inset-0', 'clip-path:polygon(' + sil.join(', ') + ');backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)');
      frostWrap.appendChild(frost);
      lev.appendChild(frostWrap);

      var name = labels[st.look];
      var length = 56 + name.length * 9;
      var plane = planeTransform(O, b.z + b.h) + ' matrix(0 -1 1 0 ' + (st.tile.x - PILL_H / 2) + ' ' + (st.tile.y + length / 2) + ')';
      var tile =
        '<g><g transform="' + plane + '" style="fill:var(--color-blue-300);opacity:.35"><rect x="0" y="0" width="' + length + '" height="' + PILL_H + '" rx="8"/></g>' +
        '<g class="iso-float" style="--d:' + i + '"><g transform="' + plane + '">' +
        '<rect x="0" y="0" width="' + length + '" height="' + PILL_H + '" rx="8" style="fill:var(--color-white);stroke:var(--color-excellence-blue);stroke-width:1;stroke-opacity:.9"/>' +
        '<svg x="12" y="' + (PILL_H - 20) / 2 + '" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--color-elevate-blue)">' + ICONS[st.look] + '</svg>' +
        '<text x="42" y="' + (PILL_H / 2 + 5) + '" style="fill:var(--color-text-primary);font-family:var(--font-display);font-size:15px;font-weight:500">' + name + '</text>' +
        '</g></g></g>';
      var logo = '';
      if (st.look === 'software') {
        var width = 88, height = width * (75.91 / 281.45), u = (b.d - width) / 2;
        var zTop = b.z + b.h - (b.h - height) / 2;
        var e = O.x + (b.w - b.d) * COS30, f = O.y + (b.w + b.d) / 2 - zTop;
        logo = '<g transform="matrix(' + COS30 + ' -0.5 0 1 ' + e + ' ' + f + ')"><use href="#elaniin-logo-blue" x="' + u + '" y="0" width="' + width + '" height="' + height + '"/></g>';
      }
      var lit = st.look === 'ai' ? 'var(--color-text-on-dark-accent)' : 'var(--color-elevate-blue)';
      var svg = svgLayer(layer);
      svg.innerHTML = '<g class="' + rise(2 + i * 2) + '"><g data-move>' + slabSvg(st.look, b, O) + logo + tile +
        '<polygon data-lit points="' + pointsAttr(topFace(b), O) + '" style="fill:none;stroke:' + lit + ';stroke-width:2;stroke-linejoin:round;opacity:0"/></g></g>';
      lev.appendChild(svg);
      return { frost: frost, move: svg.querySelector('[data-move]'), lit: svg.querySelector('[data-lit]') };
    });

    function render(t) {
      var envs = TIMES.map(function (row) { return envelope(t, row.A); });
      var emphasis = Math.max.apply(null, envs);

      parts.forEach(function (p, i) {
        var off = SLIDE * envs[i], opacity = 1 - DIM * emphasis * (1 - envs[i]);
        p.move.setAttribute('transform', 'translate(' + (off * COS30).toFixed(2) + ' ' + (off * 0.5).toFixed(2) + ')');
        p.move.style.opacity = opacity;
        p.frost.style.transform = 'translate(' + (((off * COS30) / VB.w) * 100).toFixed(3) + '%, ' + (((off * 0.5) / VB.h) * 100).toFixed(3) + '%)';
        p.frost.style.opacity = opacity;
        p.lit.style.opacity = envs[i];
      });

      /* arms: one per slab, from the riser to the slab's left corner; it telescopes with the slab as it slides */
      var arms = '';
      STATIONS.forEach(function (st, i) {
        var level = levelOf(st), row = TIMES[i];
        var from = project({ x: RISER_X, y: RISER_Y, z: level }, O);
        var to = project({ x: SLIDE * envs[i], y: RISER_Y, z: level }, O);
        var travelling = t >= row.B && t < row.A;
        var progress = easeInOut(clamp01((t - row.B) / T.branch));
        var head = project({ x: RISER_X + (SLIDE * envs[i] - RISER_X) * progress, y: RISER_Y, z: level }, O);
        var trail = travelling ? 1 : t >= row.A ? clamp01(1 - (t - row.A) / 700) : 0;
        arms += '<line x1="' + from.x + '" y1="' + from.y + '" x2="' + to.x + '" y2="' + to.y + '" style="stroke:var(--color-excellence-blue);stroke-opacity:.5;stroke-width:1"/>';
        if (trail > 0) arms += '<line x1="' + from.x + '" y1="' + from.y + '" x2="' + (travelling ? head.x : to.x) + '" y2="' + (travelling ? head.y : to.y) + '" style="stroke:var(--color-elevate-blue);stroke-width:2;stroke-linecap:round;opacity:' + trail + '"/>';
        arms += '<circle cx="' + to.x + '" cy="' + to.y + '" r="3" style="fill:var(--color-white);stroke:var(--color-elevate-blue);stroke-width:1.5"/>';
      });
      armsG.innerHTML = arms;

      /* the light: along the trace, up the riser, and along each arm */
      var pulses = [];
      var traceEnd = T.trace + T.traceDur;
      if (t >= T.trace && t < traceEnd) {
        var p0 = pointAt(TRACE_SCREEN, easeInOut((t - T.trace) / T.traceDur));
        pulses.push({ x: p0.x, y: p0.y, opacity: clamp01((t - T.trace) / 150) });
      }
      var last = TIMES[TIMES.length - 1];
      if (t >= traceEnd && t < last.B + 200) {
        var z = PLATE.h, from0 = z;
        TIMES.forEach(function (row, i) {
          var level = levelOf(STATIONS[i]);
          if (t >= row.R && t < row.B) z = from0 + (level - from0) * easeInOut((t - row.R) / T.rise);
          else if (t >= row.B) z = level;
          from0 = level;
        });
        var pr = project({ x: RISER_X, y: RISER_Y, z: z }, O);
        pulses.push({ x: pr.x, y: pr.y, opacity: t < last.B ? 1 : clamp01(1 - (t - last.B) / 200) });
      }
      TIMES.forEach(function (row, i) {
        if (t >= row.B && t < row.A) {
          var level = levelOf(STATIONS[i]), k = easeInOut((t - row.B) / T.branch);
          var pa = project({ x: RISER_X + (0 - RISER_X) * k, y: RISER_Y, z: level }, O);
          pulses.push({ x: pa.x, y: pa.y, opacity: 1 });
        }
      });
      pulsesG.innerHTML = pulses.map(function (p) {
        return '<g style="opacity:' + p.opacity + '"><circle cx="' + p.x + '" cy="' + p.y + '" r="11" filter="url(#' + id + ')" style="fill:var(--color-blue-400);opacity:.5"/>' +
          '<circle cx="' + p.x + '" cy="' + p.y + '" r="4" style="fill:var(--color-elevate-blue)"/><circle cx="' + p.x + '" cy="' + p.y + '" r="1.5" style="fill:var(--color-white)"/></g>';
      }).join('');
    }

    /* one clock per scene: runs only while on screen; reduced motion rests on the assembled state */
    var t = 0, timer = null;
    if (reduce) { render(PERIOD - 1); return; }
    render(0);
    new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting && timer === null) timer = setInterval(function () { t = (t + TICK) % PERIOD; render(t); }, TICK);
        else if (!en.isIntersecting && timer !== null) { clearInterval(timer); timer = null; }
      });
    }, { threshold: 0.3 }).observe(host);
  }

  /* kit exposed so a new resource can be built from the same projection, glass and shadow */
  window.ElaniinIso = {
    COS30: COS30, project: project, pointsAttr: pointsAttr, planeTransform: planeTransform, pointAt: pointAt,
    clamp01: clamp01, easeInOut: easeInOut, slabSvg: slabSvg, floorSvg: floorSvg, topFace: topFace, mountStack: mountStack
  };

  Array.prototype.forEach.call(document.querySelectorAll('[data-iso-stack]'), function (host) {
    mountStack(host, {
      software: host.dataset.software || 'Software',
      ai: host.dataset.ai || 'AI',
      cloud: host.dataset.cloud || 'Cloud'
    });
  });
})();
