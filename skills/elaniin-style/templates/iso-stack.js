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

  /* the three OFFICIAL Elaniin icons (DESIGN.md v1.87, assets/icons/*.svg): each drawn at 90% around the center of the 24 cell with the
     stroke divided by 0.9, so the line keeps the weight of the system. Lucide stays for every other icon. */
  var ICONS = {
    cloud: '<g transform="translate(1.2 1.2) scale(0.9)"><path d="M5.94772,17.50207c-1.83403,0-4.95187-.82531-4.95187-4.12655,0-3.85145,3.85145-4.67676,4.95187-4.67676.55021-1.92573,1.65062-4.95187,6.05228-4.95187,3.85145,0,5.50207,2.20083,6.05228,4.12655,0,0,4.95187.55021,4.95187,5.22697,0,3.30124-2.75104,4.40166-4.95187,4.40166h-7.15269"/><path d="M13.65062,14.75104l-2.75104,2.75104,2.75104,2.75104"/></g>',
    software: '<g transform="translate(1.2 1.2) scale(0.9)"><path d="M11.45565,20.43749H2.74597c-.90191,0-1.63306-.73112-1.63306-1.63306V4.65122c0-.90191.73115-1.63306,1.63306-1.63306h18.50805c.90194,0,1.63306.73115,1.63306,1.63306v8.1013"/><path d="M1.11291,4.65122c0-.90191.73115-1.63306,1.63306-1.63306h18.50805c.90194,0,1.63306.73115,1.63306,1.63306v4.89919H1.11291v-4.89919Z"/><path d="M17.44354,16.62701l-2.17742,2.17742,2.17742,2.17742"/><path d="M20.70967,16.62701l2.17742,2.17742-2.17742,2.17742"/><circle cx="4.37904" cy="6.28428" r="1.08871" fill="currentColor" stroke="none"/><circle cx="7.64516" cy="6.28428" r="1.08871" fill="currentColor" stroke="none"/></g>',
    ai: '<g transform="translate(1.2 1.2) scale(0.9)"><path d="M22.05207,6.61549c.11928-.63552.78663-.99076,1.06599-1.54763.3386-.61124-.20197-1.30246-.79918-1.48163-.53031-.17595-1.14858-.10411-1.6439-.38782-.82549-.42769-1.96398-2.06035-3.14283-1.5593-.61947.3517-.40187,1.16133-.50372,1.75181-.08313.75068-.851,1.17083-1.31618,1.63272-.29529.28627-.45413.74932-.27283,1.14037.21626.47694.77672.78047,1.28493.81026.57101.02465,1.19599.09605,1.71245.37413,1.03315.51011,1.59878,1.6886,2.77097,1.77957,1.15536.05338.72515-1.58531.84232-2.50213l.00198-.01034Z"/><path d="M14.75014,17.20484c.24914-1.32745,1.64308-2.06947,2.22659-3.23262.70726-1.27673-.42187-2.72053-1.6693-3.09478-1.10768-.36751-2.39911-.21746-3.43371-.81007-1.72425-.89335-4.10229-4.30359-6.56462-3.25701-1.29393.73461-.8394,2.42574-1.05215,3.65911-.17364,1.568-1.77753,2.44558-2.74919,3.41037-.61679.59795-.94858,1.56515-.56988,2.38195.45171.99622,1.62238,1.63021,2.68392,1.69244,1.1927.05149,2.49814.20063,3.57691.78147,2.15801,1.0655,3.33947,3.52708,5.78789,3.7171,2.41327.1115,1.51466-3.31133,1.75941-5.22635l.00413-.02161Z"/></g>'
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
        '<svg x="12" y="' + (PILL_H - 20) / 2 + '" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6667" stroke-linecap="round" stroke-linejoin="round" style="color:var(--color-elevate-blue)">' + ICONS[st.look] + '</svg>' +
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
