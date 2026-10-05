/* davide.zip — generato dal design. Modelli 3D wireframe + film a scorrimento. */
"use strict";
class DCLogic { constructor(p) { this.props = p || {}; this.state = {}; } setState(s) { Object.assign(this.state, s); this.forceUpdate(); } forceUpdate() {} }
var TAU = Math.PI * 2;
function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
function ease(t) { t = clamp(t, 0, 1); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
function lerp(a, b, t) { return a + (b - a) * t; }
function rotY(q, r) { var c = Math.cos(r), s = Math.sin(r); return [q[0] * c + q[2] * s, q[1], -q[0] * s + q[2] * c]; }
function add(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
function hash(i) { var x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
function seg(o, a, b, k) { o.push([a, b, k || 'n']); }
function poly(o, pts, k, closed) { for (var i = 0; i < pts.length - (closed ? 0 : 1); i++) seg(o, pts[i], pts[(i + 1) % pts.length], k); }
function box(o, cx, cy, cz, w, h, d, k, ry) {
  var x = w / 2, y = h / 2, z = d / 2, c = [cx, cy, cz];
  var p = [[-x,-y,-z],[x,-y,-z],[x,y,-z],[-x,y,-z],[-x,-y,z],[x,-y,z],[x,y,z],[-x,y,z]].map(function (q) { return add(c, rotY(q, ry || 0)); });
  [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]].forEach(function (e) { seg(o, p[e[0]], p[e[1]], k); });
}
function ring(o, cx, cy, cz, r, n, k) {
  for (var i = 0; i < n; i++) { var a = i / n * TAU, b = (i + 1) / n * TAU; seg(o, [cx + Math.cos(a) * r, cy, cz + Math.sin(a) * r], [cx + Math.cos(b) * r, cy, cz + Math.sin(b) * r], k); }
}
function prism(o, cx, cy, cz, r, h, n, k, rot) {
  rot = rot || 0;
  for (var i = 0; i < n; i++) {
    var a = rot + i / n * TAU, b = rot + (i + 1) / n * TAU;
    var p0 = [cx + Math.cos(a) * r, cy, cz + Math.sin(a) * r], p1 = [cx + Math.cos(b) * r, cy, cz + Math.sin(b) * r];
    seg(o, p0, p1, k); seg(o, [p0[0], cy + h, p0[2]], [p1[0], cy + h, p1[2]], k); seg(o, p0, [p0[0], cy + h, p0[2]], k);
  }
}
function octa(o, c, s, k) {
  var v = [[s,0,0],[-s,0,0],[0,s,0],[0,-s,0],[0,0,s],[0,0,-s]].map(function (q) { return add(c, q); });
  [[0,2],[0,3],[0,4],[0,5],[1,2],[1,3],[1,4],[1,5],[2,4],[4,3],[3,5],[5,2]].forEach(function (e) { seg(o, v[e[0]], v[e[1]], k); });
}
function grid(o, y, half, step) { for (var g = -half; g <= half; g += step) { seg(o, [g, y, -half], [g, y, half], 'g'); seg(o, [-half, y, g], [half, y, g], 'g'); } }
function lathe(o, prof, n, k, rot) {
  for (var i = 0; i < prof.length; i++) for (var j = 0; j < n; j++) {
    var a = rot + j / n * TAU, b = rot + (j + 1) / n * TAU, r = prof[i][0], y = prof[i][1];
    if (r > 0.5) seg(o, [Math.cos(a) * r, y, Math.sin(a) * r], [Math.cos(b) * r, y, Math.sin(b) * r], k);
    if (i < prof.length - 1) { var r2 = prof[i + 1][0], y2 = prof[i + 1][1]; seg(o, [Math.cos(a) * r, y, Math.sin(a) * r], [Math.cos(a) * r2, y2, Math.sin(a) * r2], k); }
  }
}
var ICO = (function () {
  var t = (1 + Math.sqrt(5)) / 2;
  var V = [[-1,t,0],[1,t,0],[-1,-t,0],[1,-t,0],[0,-1,t],[0,1,t],[0,-1,-t],[0,1,-t],[t,0,-1],[t,0,1],[-t,0,-1],[-t,0,1]];
  var F = [[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]];
  function norm(p) { var l = Math.hypot(p[0], p[1], p[2]); return [p[0] / l, p[1] / l, p[2] / l]; }
  V = V.map(norm);
  var cache = {};
  function mid(a, b) { var key = a < b ? a + '_' + b : b + '_' + a; if (cache[key] == null) { V.push(norm([(V[a][0] + V[b][0]) / 2, (V[a][1] + V[b][1]) / 2, (V[a][2] + V[b][2]) / 2])); cache[key] = V.length - 1; } return cache[key]; }
  var F2 = [];
  F.forEach(function (f) { var a = mid(f[0], f[1]), b = mid(f[1], f[2]), c = mid(f[2], f[0]); F2.push([f[0], a, c], [f[1], b, a], [f[2], c, b], [a, b, c]); });
  var E = {}, out = [];
  F2.forEach(function (f) { for (var i = 0; i < 3; i++) { var a = f[i], b = f[(i + 1) % 3], key = a < b ? a + '_' + b : b + '_' + a; if (!E[key]) { E[key] = 1; out.push([a, b]); } } });
  return { V: V, E: out };
})();
function ico(o, c, R, sp, k) { ICO.E.forEach(function (e) { seg(o, add(c, rotY(ICO.V[e[0]].map(function (x) { return x * R; }), sp)), add(c, rotY(ICO.V[e[1]].map(function (x) { return x * R; }), sp)), k); }); }

function cam(yaw, pitch, D, S, cx, cy, oy) { return { cy_: Math.cos(yaw), sy_: Math.sin(yaw), cp: Math.cos(pitch), sp: Math.sin(pitch), D: D, S: S, cx: cx, cyy: cy, oy: oy || 0 }; }
function proj(p, c) {
  var x1 = p[0] * c.cy_ + p[2] * c.sy_, z1 = -p[0] * c.sy_ + p[2] * c.cy_;
  var y = p[1] - c.oy, y2 = y * c.cp - z1 * c.sp, z2 = y * c.sp + z1 * c.cp, f = c.D / (c.D + z2);
  return [c.cx + x1 * f * c.S, c.cyy - y2 * f * c.S, z2, f];
}
function draw(segs, c) {
  var o = { n0: '', n1: '', a0: '', a1: '', g: '', l: '', p: '' }, PA = [], PB = [], sum = 0, cnt = 0;
  for (var j = 0; j < segs.length; j++) { PA.push(proj(segs[j][0], c)); PB.push(proj(segs[j][1], c)); if (segs[j][2] !== 'g' && segs[j][2] !== 'p') { sum += PA[j][2] + PB[j][2]; cnt += 2; } }
  var mid = cnt ? sum / cnt : 0;
  for (var i = 0; i < segs.length; i++) {
    var s = segs[i], a = PA[i], b = PB[i];
    var d = 'M' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + 'L' + b[0].toFixed(1) + ' ' + b[1].toFixed(1);
    if (s[2] === 'g') { o.g += d; continue; }
    if (s[2] === 'l') { o.l += d; continue; }
    if (s[2] === 'p') { o.p += d; continue; }
    o[(s[2] === 'a' ? 'a' : 'n') + ((a[2] + b[2]) / 2 > mid + 20 ? '1' : '0')] += d;
  }
  return o;
}
function morph(A, B, b) {
  var n = Math.max(A.length, B.length), o = [];
  for (var i = 0; i < n; i++) {
    var a = A[i % A.length], c = B[i % B.length], r = hash(i);
    var e = ease((b - r * 0.45) / 0.55), sw = Math.sin(Math.PI * e) * 170;
    var d = [(hash(i + 7) - 0.5) * 2 * sw, (hash(i + 13) - 0.5) * 2 * sw, (hash(i + 29) - 0.5) * 2 * sw];
    var k = e < 0.5 ? a[2] : c[2];
    if (e > 0.08 && e < 0.92 && k !== 'g') k = hash(i + 3) < 0.18 ? 'a' : 'n';
    o.push([[lerp(a[0][0], c[0][0], e) + d[0], lerp(a[0][1], c[0][1], e) + d[1], lerp(a[0][2], c[0][2], e) + d[2]],
            [lerp(a[1][0], c[1][0], e) + d[0], lerp(a[1][1], c[1][1], e) + d[1], lerp(a[1][2], c[1][2], e) + d[2]], k]);
  }
  return o;
}

/* ---------- models ---------- */
var CODE = [[0,120],[1,180],[1,90],[2,150],[2,64],[1,110],[0,40],[0,150],[1,130],[2,96],[1,70],[0,50]];
function laptop(t) {
  var o = [], a = 0.28, ca = Math.cos(a), sa = Math.sin(a);
  grid(o, -75, 400, 100);
  box(o, 0, -67, 0, 320, 14, 210, 'n');
  for (var r = 0; r < 4; r++) for (var c = 0; c < 12; c++) {
    var x = -143 + c * 26, z = 12 + r * 22;
    poly(o, [[x - 10, -59.5, z - 9], [x + 10, -59.5, z - 9], [x + 10, -59.5, z + 9], [x - 10, -59.5, z + 9]], 'n', true);
  }
  poly(o, [[-55, -59.5, -85], [55, -59.5, -85], [55, -59.5, -30], [-55, -59.5, -30]], 'n', true);
  function P(u, v, off) { return [u, -60 + v * ca - (off || 0) * sa, 105 + v * sa + (off || 0) * ca]; }
  poly(o, [P(-160, 0), P(160, 0), P(160, 215), P(-160, 215)], 'n', true);
  poly(o, [P(-160, 0, 7), P(160, 0, 7), P(160, 215, 7), P(-160, 215, 7)], 'n', true);
  [[-160, 0], [160, 0], [160, 215], [-160, 215]].forEach(function (q) { seg(o, P(q[0], q[1]), P(q[0], q[1], 7), 'n'); });
  poly(o, [P(-148, 12, -1), P(148, 12, -1), P(148, 203, -1), P(-148, 203, -1)], 'n', true);
  var total = 0; CODE.forEach(function (c) { total += c[1]; });
  var s = (t * 160) % (total + 400), acc = 0;
  for (var i = 0; i < CODE.length; i++) {
    var len = clamp(s - acc, 0, CODE[i][1]); acc += CODE[i][1];
    if (len <= 0) break;
    var u0 = -134 + CODE[i][0] * 18, v = 188 - i * 14;
    seg(o, P(u0, v, -2), P(u0 + len, v, -2), i % 3 === 1 ? 'a' : 'n');
  }
  return { segs: o, pins: [] };
}
function shoe(t) {
  var o = [], N = 16, M = 9, S = [];
  grid(o, -72, 400, 100);
  for (var i = 0; i < N; i++) {
    var x = -125 + i * 260 / (N - 1);
    var w = 52 * Math.sqrt(clamp(1 - Math.pow((x - 8) / 136, 2), 0, 1)) + 6;
    var h = (40 + 82 * ease((25 - x) / 150)) * (x > 70 ? 1 - (x - 70) / 130 * 0.5 : 1);
    var collar = x < -35, row = [];
    for (var j = 0; j < M; j++) {
      var th = Math.PI - j / (M - 1) * Math.PI;
      row.push(collar && j >= 3 && j <= 5 ? null : [x, -60 + Math.sin(th) * h, -Math.cos(th) * w]);
    }
    S.push({ x: x, w: w, row: row });
  }
  S.forEach(function (sec, i) {
    for (var j = 0; j < M - 1; j++) if (sec.row[j] && sec.row[j + 1]) seg(o, sec.row[j], sec.row[j + 1], 'n');
    if (i < N - 1) for (var m = 0; m < M; m++) if (sec.row[m] && S[i + 1].row[m]) seg(o, sec.row[m], S[i + 1].row[m], 'n');
  });
  var top = [], bot = [];
  S.forEach(function (sec) { top.push([sec.x, -60, sec.w + 5]); bot.push([sec.x, -72, sec.w + 5]); });
  for (var q = N - 1; q >= 0; q--) { top.push([S[q].x, -60, -S[q].w - 5]); bot.push([S[q].x, -72, -S[q].w - 5]); }
  poly(o, top, 'n', true); poly(o, bot, 'n', true);
  for (var v = 0; v < top.length; v += 3) seg(o, top[v], bot[v], 'n');
  for (var li = 6; li < 12; li++) { var A = S[li].row, B = S[li + 1].row; seg(o, A[3], B[5], 'a'); seg(o, A[5], B[3], 'a'); }
  box(o, -128, 40, 0, 6, 34, 16, 'a');
  return { segs: o, pins: [] };
}
function sheets(t) {
  var o = [];
  grid(o, -110, 400, 100);
  for (var i = 0; i < 9; i++) {
    box(o, -190 + (hash(i) - 0.5) * 24, -104 + i * 8, (hash(i + 9) - 0.5) * 20, 70, 2, 92, 'n', (hash(i + 3) - 0.5) * 0.9);
    box(o, 190, -104 + i * 8, 0, 70, 2, 92, 'n');
  }
  var arc = [];
  for (var s = 0; s <= 16; s++) { var f = s / 16; arc.push([lerp(-190, 190, f), -30 + Math.sin(Math.PI * f) * 180, 0]); }
  for (var a = 0; a < 16; a++) seg(o, arc[a], arc[a + 1], 'l');
  for (var j = 0; j < 3; j++) {
    var ph = (t * 0.32 + j / 3) % 1;
    box(o, lerp(-190, 190, ph), -30 + Math.sin(Math.PI * ph) * 180, 0, 70, 2, 92, 'a', ph * Math.PI);
  }
  var g = t * 1.4;
  ring(o, 0, 230, 0, 34, 20, 'a'); ring(o, 0, 230, 0, 18, 12, 'a');
  for (var k = 0; k < 8; k++) { var an = g + k * TAU / 8; seg(o, [Math.cos(an) * 34, 230, Math.sin(an) * 34], [Math.cos(an) * 46, 230, Math.sin(an) * 46], 'a'); }
  return { segs: o, pins: [] };
}
function bubble(o, cx, cy, w, h, d, k, side) {
  var r = Math.min(16, h / 2), pts = [], cs = [[w / 2 - r, h / 2 - r, 0], [-w / 2 + r, h / 2 - r, Math.PI / 2], [-w / 2 + r, -h / 2 + r, Math.PI], [w / 2 - r, -h / 2 + r, 1.5 * Math.PI]];
  cs.forEach(function (c, ci) {
    for (var s = 0; s <= 3; s++) { var a = c[2] + s / 3 * Math.PI / 2; pts.push([cx + c[0] + Math.cos(a) * r, cy + c[1] + Math.sin(a) * r]); }
    if (ci === (side > 0 ? 3 : 2)) { var tx = cx + side * (w / 2 - 22); pts.push([tx + side * 6, cy - h / 2], [tx + side * 22, cy - h / 2 - 18], [tx - side * 6, cy - h / 2]); }
  });
  var F = pts.map(function (q) { return [q[0], q[1], -d / 2]; }), B = pts.map(function (q) { return [q[0], q[1], d / 2]; });
  poly(o, F, k, true); poly(o, B, k, true);
  for (var i = 0; i < F.length; i += 3) seg(o, F[i], B[i], k);
  [0.3, 0, -0.3].forEach(function (f, j) { seg(o, [cx - w / 2 + 18, cy + f * h, -d / 2 - 1], [cx - w / 2 + 18 + (w - 50) * [0.9, 0.7, 0.5][j], cy + f * h, -d / 2 - 1], k); });
}
function chat(t) {
  var o = [];
  grid(o, -230, 400, 100);
  for (var i = 0; i < 5; i++) {
    var ph = (t * 0.11 + i / 5) % 1, sc = Math.pow(Math.sin(Math.PI * ph), 0.6);
    if (sc < 0.05) continue;
    var side = i % 2 ? 1 : -1;
    bubble(o, side * 70, -190 + ph * 420, 210 * sc, 60 * sc, 12 * sc, side > 0 ? 'a' : 'n', side);
  }
  return { segs: o, pins: [] };
}
function dashboard(t) {
  var o = [];
  grid(o, -152, 400, 100);
  box(o, 0, 40, 0, 400, 240, 14, 'n');
  poly(o, [[-188, -68, -8], [188, -68, -8], [188, 148, -8], [-188, 148, -8]], 'n', true);
  box(o, 0, -116, 6, 22, 70, 18, 'n'); box(o, 0, -150, 6, 170, 5, 90, 'n');
  var tops = [];
  for (var i = 0; i < 9; i++) {
    var h = 30 + 110 * (0.5 + 0.5 * Math.sin(t * 0.8 + i * 0.75)) * (0.55 + i * 0.06), x = -160 + i * 40;
    box(o, x, -60 + h / 2, -22, 24, h, 16, h > 115 ? 'a' : 'n');
    tops.push([x, -60 + h + 22, -30]);
  }
  poly(o, tops, 'a', false);
  return { segs: o, pins: [] };
}
var APPS = ['Excel', 'Email', 'Gestionale', 'E-commerce', 'Banca'];
function hub(t) {
  var o = [], pins = [];
  grid(o, -120, 400, 100);
  ring(o, 0, -40, 0, 260, 60, 'g');
  ico(o, [0, 0, 0], 62, t * 0.4, 'a');
  APPS.forEach(function (name, i) {
    var a = i * TAU / 5 + 0.3, c = [Math.cos(a) * 260, (i % 2 ? 40 : -40), Math.sin(a) * 260];
    if (i === 0) box(o, c[0], c[1], c[2], 56, 56, 56, 'n');
    else if (i === 1) octa(o, c, 34, 'n');
    else if (i === 2) prism(o, c[0], c[1] - 28, c[2], 30, 56, 10, 'n');
    else if (i === 3) box(o, c[0], c[1], c[2], 70, 40, 50, 'n');
    else prism(o, c[0], c[1] - 24, c[2], 34, 48, 4, 'n', Math.PI / 4);
    seg(o, c, [Math.cos(a) * 64, c[1] * 0.2, Math.sin(a) * 64], 'g');
    for (var k = 0; k < 2; k++) {
      var ph = (t * 0.45 + k / 2 + i * 0.13) % 1, inward = k === 0, f = inward ? ph : 1 - ph;
      box(o, lerp(c[0], Math.cos(a) * 64, f), lerp(c[1], c[1] * 0.2, f), lerp(c[2], Math.sin(a) * 64, f), 9, 9, 9, 'a');
    }
    pins.push({ p: [c[0] + 40, c[1] + 40, c[2]], txt: name });
  });
  return { segs: o, pins: pins };
}
var BULB = [[0, 160], [44, 150], [76, 124], [92, 86], [90, 48], [74, 14], [52, -16], [44, -46], [44, -56], [46, -64], [44, -72], [46, -80], [44, -88], [46, -96], [44, -104], [30, -116], [10, -122]];
function bulb(t) {
  var o = [];
  grid(o, -140, 400, 100);
  lathe(o, BULB, 18, 'n', t * 0.2);
  seg(o, [-16, -46, 0], [-16, 40, 0], 'n'); seg(o, [16, -46, 0], [16, 40, 0], 'n');
  var zz = []; for (var i = 0; i <= 8; i++) zz.push([-16 + i * 4, 40 + (i % 2 ? 12 : 0), 0]);
  poly(o, zz, 'a', false);
  var pulse = 0.5 + 0.5 * Math.sin(t * 2.4);
  for (var k = 0; k < 12; k++) { var a = k * TAU / 12, r0 = 130, r1 = 130 + 26 * pulse; seg(o, [Math.cos(a) * r0, 60 + Math.sin(a) * r0, 0], [Math.cos(a) * r1, 60 + Math.sin(a) * r1, 0], 'a'); }
  return { segs: o, pins: [] };
}
function stack(t) {
  var o = [];
  grid(o, -250, 400, 100);
  prism(o, 0, -245, 0, 80, 70, 20, 'n'); ring(o, 0, -222, 0, 80, 20, 'n'); ring(o, 0, -198, 0, 80, 20, 'n');
  box(o, 0, -125, 0, 280, 60, 170, 'n');
  for (var i = 0; i < 3; i++) seg(o, [-120, -140 + i * 15, -86], [60, -140 + i * 15, -86], 'n');
  for (var k = 0; k < 3; k++) box(o, 95 + k * 14, -125, -86, 5, 5, 2, 'a');
  box(o, -40, 30, 0, 260, 160, 8, 'n');
  seg(o, [-170, 88, -5], [90, 88, -5], 'n');
  [[-150, 60, 110], [-150, 40, 160], [-150, 20, 80]].forEach(function (l) { seg(o, [l[0], l[1], -5], [l[0] + l[2], l[1], -5], 'n'); });
  box(o, -60, 0, -5, 120, 50, 2, 'a');
  box(o, 175, 20, -10, 70, 140, 10, 'n');
  seg(o, [160, 82, -16], [190, 82, -16], 'n');
  for (var r = 0; r < 4; r++) box(o, 175, 50 - r * 22, -16, 46, 14, 1, r === 0 ? 'a' : 'n');
  ico(o, [0, 205, 0], 42, t * 0.6, 'a');
  [[0, -175, 0, 0, -155], [0, -95, 0, -40, -50], [60, -95, 0, 175, -50], [0, 110, 0, 0, 163]].forEach(function (l) { seg(o, [l[0], l[1], 0], [l[3], l[4], 0], 'l'); });
  return { segs: o, pins: [
    { p: [90, -215, 0], txt: 'Database' }, { p: [150, -110, 0], txt: 'Backend' }, { p: [95, 120, 0], txt: 'Web' },
    { p: [215, 90, 0], txt: 'Mobile' }, { p: [50, 230, 0], txt: 'AI' }
  ] };
}
function why(t) {
  var o = [], pins = [], sp = t * 0.25;
  grid(o, -230, 450, 100);
  ico(o, [0, 0, 0], 90, sp, 'a');
  ring(o, 0, 0, 0, 380, 72, 'g');
  var you = [Math.cos(-0.7 + Math.sin(t * 0.3) * 0.1) * 250, 70, Math.sin(-0.7) * 250];
  octa(o, you, 26, 'a');
  seg(o, you, [you[0] * 0.36, you[1] * 0.36, you[2] * 0.36], 'a');
  seg(o, add(you, [0, 4, 0]), [you[0] * 0.36, you[1] * 0.36 + 4, you[2] * 0.36], 'a');
  for (var i = 0; i < 6; i++) {
    var a = i * TAU / 6 - t * 0.06 + 1.2, c = [Math.cos(a) * 380, (i % 2 ? -30 : 30), Math.sin(a) * 380];
    octa(o, c, 15, 'n');
    seg(o, c, [Math.cos(a) * 95, c[1] * 0.2, Math.sin(a) * 95], 'g');
    if (i === 2) pins.push({ p: [c[0] + 24, c[1] + 24, c[2]], txt: 'Team We Are People' });
  }
  pins.push({ p: [you[0] + 34, you[1] + 30, you[2]], txt: 'Tu' });
  pins.push({ p: [0, 118, 0], txt: 'Io' });
  return { segs: o, pins: pins };
}
function plane(t) {
  var o = [];
  grid(o, -160, 400, 100);
  var ph = t * 0.45;
  function at(f) { return [Math.cos(f) * 210, 30 + Math.sin(2 * f) * 45, Math.sin(f) * 210]; }
  for (var s = 0; s < 22; s++) seg(o, at(ph - 0.12 - s * 0.1), at(ph - 0.12 - (s + 1) * 0.1), 'l');
  var pos = at(ph), ry = -ph - Math.PI / 2, bank = 0.4;
  var L = [[110, 0, 0], [-80, 0, -72], [-80, 0, 72], [-80, -32, 0], [-80, 0, 0]].map(function (q) {
    var y = q[1] * Math.cos(bank) - q[2] * Math.sin(bank), z = q[1] * Math.sin(bank) + q[2] * Math.cos(bank);
    return add(pos, rotY([q[0], y, z], ry));
  });
  [[0, 1], [0, 2], [0, 3], [3, 4], [1, 4], [2, 4]].forEach(function (e) { seg(o, L[e[0]], L[e[1]], 'a'); });
  seg(o, L[0], L[4], 'n');
  box(o, 0, -120, 0, 120, 70, 80, 'n');
  seg(o, [-60, -85, -40], [0, -115, -40], 'n'); seg(o, [0, -115, -40], [60, -85, -40], 'n');
  return { segs: o, pins: [] };
}

var PORTRAIT = {"cols":93,"rows":["                           aa","                           a0abaa      aaabbcba","                           a10100aaaaab10102411b","                            b0100000001000122231bb","                            a111100111000112233212b","                            a0011211011001222223321ba","                            a001000001111221221112222a","                           a00000000012111123211054111a","                          a1100000000100001223420221110a","                         a100000000011100012331002111110a","                       ab10000000012210012233222111111011a","                       b0000000000111012333431132111100101a","                      a00000000011111011122324321112210000a","                     a0000000001112001212222023221122111100b","                     a0000001001122224555423223432121111000b","                    a011000010122344566666544455553211111000b","                    a110000001223356666667766666656532100000b","                   a11000100002334667777778777766666431011000b","                   a10001101013345677788888888887766532002100b","                   a100111010133566778888889998888876430011001a","                   a011110110144566678888889998888887641001101c","                   a111110000144566778888889999999987753001100b","                   a0101000101444677788888999999999987650001010a","                   a0001000010344677888999999999999999761001110a","                    a000000010233577899999999999999877665001100a","                     a00000010233578899999999998643331258100000a","                     a00010000333688899999999871013456116400003f","                      a0000001324776543369898711444334534300232f","                     a00000002322211111222442113200231371211552g","                     a00000001310245433341003211201234681732466h","                     a0000000010263100042305812458998589185235j","                     a0000110053451243245619982556788998285426j","                     a0022340030553567766919992987799995685348j","                     a0031663142465666667719996399999983875297j","                      aa22635235177766788348999228999628775589j","                        a3533425538888896178999811121367775399i","                         c55042475279984067999999366678776449j","                          g531136775333559799997876888876655h","                          e43712567888776767885237777776665b","                           g5631556777765525663148988777776b","                            i760466677665356666678888777776b","                             gi236666766656656788987678777f","                               a36675656667778888876678767e","                                b6666556777666752103678666c","                                 f666662012322366688777665b","                                 d65667554577888789987656d","                                 b54568867777877888887646b","                                  b5557777787778888876432a","                                  a255567777667788888641c","                                  c124367776777789987410g","                                  c502257787878998886105g","                                  c6410267888998987520356d","                                  c5640046788888776212556e","                                  c4664113677877663023556f","                                  c4665320244654211135556f","                                  d4566644310000122336655g","                                 b34566665565555634556655g","                                 d355666766566556555566556e","                                b4355667776677766666676556e","                               c253556677777777766777765664i","                              c52535566777777777777787666638h","                            bc5633455667777777777777776667378id","                          bc12665256666777777777778887666747799ee","                       ccc121136625666667777787888887766765778923ee","                    bcc21112211363566676777778888888776774778872334fe","                 dcc2222222222114536666667777888888877777387893233344fff","              cdd3222222222222112426666667777788888887777388862344334345ff","           ede322222222222222222221566666777777888888777759982344443443454fff","         ee332222222222222222222222156644777777887988888679512444443444455434fff","       de33332232232232222322222222024643877777888989889683234444443445445533445ff","      f442233313333333333333333333321226888887788999999823345334445444444453445535gd","     d422422432233333333333333333333132123689989999864331444544444544454455443533445e","     d3532322431433333333333333333332243211111211112234245455344445544444454445253444fc","    d4333433134143333333333333333333414433322222334445415445545444554444455434525444555e","   c453333434152443334333333333333334233444444455444452554455444445544544554354355455236d","   e254333443344253333333333444433344414444444444544452554555544555544554554453454463252f","  c3224344353425254333333333444444444423444444444444524554454444444544454454453454632523g","  d33234255443252543344444444444444334515444444444455255545555554445545544544534555153155d"," b333413412543333443254444444444344444423555545455553455455554555445554454444534551351454f"," 233344134214432434425444444444444444445144445555454355544555455544555455444453452251354452"]};
function portrait(t) {
  var o = [], R = PORTRAIT.rows, N = R.length, C = PORTRAIT.cols, cell = 600 / N, H = N * cell, W = C * cell;
  var scanRow = (((t * 0.32) % 1.4) - 0.2) * N;
  for (var r = 0; r < N; r++) {
    var row = R[r];
    if (r > N * 0.8 && hash(r * 131) > (N - r) / (N * 0.2) + 0.15) continue;
    for (var c = 0; c < row.length; c++) {
      var ch = row.charAt(c);
      if (ch === ' ') continue;
      var rim = ch >= 'a', lv = rim ? ch.charCodeAt(0) - 97 : +ch;
      if (r > N * 0.8 && hash(r * 61 + c * 7) > (N - r) / (N * 0.2)) continue;
      var L = lv / 9, x = (c - C / 2) * cell, y = H / 2 - r * cell;
      var bulge = Math.max(0, 1 - Math.pow(x / (W * 0.55), 2));
      var z = -L * 26 - 46 * bulge;
      var near = Math.abs(r - scanRow) < 1.6;
      var len = (0.06 + 0.94 * Math.pow(L, 1.35)) * cell * 0.47 * (near ? 1.4 : 1);
      seg(o, [x - len, y, z - (near ? 14 : 0)], [x + len, y, z - (near ? 14 : 0)], rim || near ? 'a' : 'p');
    }
  }
  return { segs: o, pins: [] };
}
var MODELS = [portrait, shoe, sheets, chat, dashboard, hub, bulb, stack, why, plane];

var SCENES = [
  { name: 'Ciao', kicker: 'Davide Lanotte · Sviluppatore · Roma', t1: 'Ciao, sono Davide.', t2: 'Scrivo il software che lavora per te.', sub: 'Siti, app, gestionali, bot e automazioni. In pratica faccio fare ai computer il lavoro che oggi fai a mano.', big: true },
  { name: 'Il problema', kicker: 'Il problema', t1: 'Un calzolaio ha la vetrina.', t2: 'Il mio lavoro non si vede.', sub: 'Gira dentro computer e server, anche di notte. Per questo è difficile capire quando ti serve. Ecco cinque segnali.' },
  { name: 'Dati a mano', kicker: 'Segnale 01 / 05', t1: 'Copi dati a mano da un file all’altro?', t2: 'Un’automazione lo fa in un secondo.', done: 'Fatture e chiusure di cassa lette in automatico per il controllo costi di un gruppo di ristoranti.' },
  { name: 'Stesse domande', kicker: 'Segnale 02 / 05', t1: 'Rispondi sempre alle stesse domande?', t2: 'Un bot risponde al posto tuo.', done: 'Un assistente AI che risponde ai dipendenti usando i documenti interni dell’azienda.' },
  { name: 'Numeri', kicker: 'Segnale 03 / 05', t1: 'I numeri li vedi solo a fine anno?', t2: 'Una dashboard te li mostra ogni mattina.', done: 'Conto economico, cassa e margini per commessa ricostruiti dai documenti, sempre aggiornati.' },
  { name: 'Programmi', kicker: 'Segnale 04 / 05', t1: 'Usi cinque programmi che non si parlano?', t2: 'Li collego, o ne faccio uno solo.', done: 'Turni, contratti e comunicazioni obbligatorie in un unico gestionale per la ristorazione.' },
  { name: 'Idea', kicker: 'Segnale 05 / 05', t1: 'Hai un’idea ma non sai da dove partire?', t2: 'La smontiamo insieme, poi la costruisco.', done: 'Un’app per prenotare gli spettacoli del teatro amatoriale, dall’idea al modello di business.' },
  { name: 'Come lavoro', kicker: 'Come lavoro', t1: 'Dall’idea al software', t2: 'che usi davvero.', process: true },
  { name: 'Perché io', kicker: 'Perché io', t1: 'Ho fondato un’azienda.', t2: 'So cosa c’è oltre il codice.', sub: 'Ho provato le startup e costruito un’azienda: budget, scadenze e clienti li conosco. Parli direttamente con chi scrive il codice. Se il progetto cresce, dietro c’è il team di We Are People.' },
  { name: 'Scrivimi', kicker: 'Scrivimi', t1: 'Raccontami il problema,', t2: 'anche se non sai come si chiama.', sub: 'Una mail o un messaggio bastano. Ti rispondo io.', end: true }
];
var STEPS = [
  { n: '01', t: 'Ne parliamo', d: 'Brainstorming sul problema, non sulla tecnologia.' },
  { n: '02', t: 'Progetto i dati', d: 'Database e architettura, la parte che regge tutto.' },
  { n: '03', t: 'Costruisco', d: 'Backend, web, mobile e AI dove serve.' },
  { n: '04', t: 'Lo metto online', d: 'E lo seguo anche dopo.' }
];
var CAMS = [
  { pitch: -0.04, S: 1.32, oy: 0, cx: 0.69, cy: 0.47, yaw: 0, amp: 0.14 },
  { pitch: -0.26, S: 1.45, oy: 0, cx: 0.66, cy: 0.5 },
  { pitch: -0.32, S: 1.1, oy: 30, cx: 0.66, cy: 0.5 },
  { pitch: -0.12, S: 1.15, oy: 0, cx: 0.66, cy: 0.5 },
  { pitch: -0.14, S: 1.2, oy: 0, cx: 0.66, cy: 0.5 },
  { pitch: -0.48, S: 1.05, oy: 0, cx: 0.66, cy: 0.5 },
  { pitch: -0.14, S: 1.3, oy: 20, cx: 0.66, cy: 0.5 },
  { pitch: -0.24, S: 1.12, oy: 0, cx: 0.68, cy: 0.5 },
  { pitch: -0.42, S: 0.9, oy: 0, cx: 0.66, cy: 0.5 },
  { pitch: -0.34, S: 1.2, oy: 0, cx: 0.68, cy: 0.5 }
];
var LAST = 9;
var PHOTO_SRC = (typeof window !== 'undefined' && window.DZ_PHOTO) || '/_blob/7d099ae354eba582ba888292a32211e2';
var ACC = 'var(--acc)';
var T_TYPE = 0.75, T_STREAM = 3.3, Z_PULL = 3.95, Z_SLIDE = 4.75, Z_OFF = 5.4, ZEND = 3.95;
var CMD = 'unzip -v davide.zip';
var PATHS = ['src/backend/django/settings.py', 'src/backend/django/models.py', 'src/backend/api/views.py', 'src/backend/api/serializers.py', 'src/backend/auth/permessi.py',
  'db/postgres/schema.sql', 'db/migrations/0042_auto.py', 'db/indici.sql', 'src/web/next/app/page.tsx', 'src/web/next/components/Dashboard.tsx', 'src/web/react/hooks/useData.ts',
  'src/mobile/react-native/App.tsx', 'src/mobile/dart/main.dart', 'ai/llm/prompt.py', 'ai/llm/agente.py', 'ai/ocr/docparse.py', 'ai/bot/risposte.py',
  'data/etl/fatture_xml.py', 'data/etl/chiusure_cassa.py', 'data/report/conto_economico.py', 'data/dashboard/kpi.ts', 'infra/docker/Dockerfile', 'infra/docker/compose.yml',
  'infra/k8s/deploy.yaml', 'infra/aws/beanstalk.config', 'infra/ci/pipeline.yml', '3d/unity/Scena.unity', '3d/web/wireframe.js', 'brainstorming/idee.md', 'brainstorming/lavagna.png',
  'startup/tentativi.log', 'startup/lezioni_imparate.md', 'azienda/we-are-people/', 'scuola/42-roma-luiss/', 'linguaggi/c.c', 'linguaggi/python.py', 'linguaggi/typescript.ts',
  'linguaggi/java.java', 'linguaggi/php.php', 'clienti/problemi_risolti.txt', 'sito/index.html'];
var SYS = {
  0: ['[boot]', 'davide-os 26.10 · roma · it_IT.UTF-8', '#9298A2'],
  1: ['[ ok ]', 'firma archivio verificata', ACC],
  2: ['[ ok ]', 'moduli: backend frontend mobile ai data infra', ACC],
  9: ['[info]', 'deflate · livello 9 · nessuna perdita', '#9298A2'],
  19: ['[ ok ]', 'schema database coerente · 0 conflitti', ACC],
  27: ['[warn]', 'caffè sotto la soglia minima · continuo comunque', '#FF8A5B'],
  36: ['[ ok ]', 'dipendenze risolte', ACC]
};
var TERM_LINES = [], TOTAL_KB = 0, FILE_COUNT = PATHS.length;
(function () {
  function hx(n, len) { var s = Math.floor(n * 4294967295).toString(16); while (s.length < len) s = '0' + s; return s.slice(0, len); }
  TERM_LINES.push({ a: ' Length', b: '  Method   Size  Cmpr   CRC-32    Name', c: '', ca: '#6B717B', cb: '#6B717B', cc: '#6B717B' });
  TERM_LINES.push({ a: '-------', b: '  ------  -----  ----  --------  ----', c: '', ca: '#6B717B', cb: '#6B717B', cc: '#6B717B' });
  PATHS.forEach(function (path, i) {
    if (SYS[i]) TERM_LINES.push({ a: SYS[i][0], b: SYS[i][1], c: '', ca: SYS[i][2], cb: '#C2C5CB', cc: '#6B717B' });
    var kb = (hash(i + 101) * 88 + 0.4); TOTAL_KB += kb * 40;
    TERM_LINES.push({ file: true, a: '  inflating:', b: path, c: kb.toFixed(1) + 'K  ' + Math.round(55 + hash(i + 7) * 35) + '%  ' + hx(hash(i + 51), 8) + '  OK', ca: '#6B717B', cb: '#ECEAE4', cc: '#6B717B' });
    if (i % 4 === 3) {
      var bytes = []; for (var b = 0; b < 12; b++) bytes.push(hx(hash(i * 13 + b), 2));
      TERM_LINES.push({ a: '  0x' + hx(hash(i + 900), 6), b: bytes.join(' '), c: '', ca: '#4A4F57', cb: '#4A4F57', cc: '#4A4F57' });
    }
  });
})();
var END_LINES = [
  { a: '[ ok ]', b: 'integrità CRC-32 · 0 errori', c: '', ca: ACC, cb: '#C2C5CB', cc: '#6B717B' },
  { a: '[ ok ]', b: FILE_COUNT + ' file estratti in davide/', c: '', ca: ACC, cb: '#C2C5CB', cc: '#6B717B' },
  { a: '[ ok ]', b: 'avvio interfaccia', c: '', ca: ACC, cb: '#C2C5CB', cc: '#6B717B' },
  { a: '>', b: 'pronto.', c: '', ca: ACC, cb: '#ECEAE4', cc: '#6B717B' }
];

var FONTS = {
  Bricolage: { family: "'Bricolage Grotesque', ui-sans-serif, system-ui, sans-serif", weight: 500, weight2: 300, italic: 'normal', scale: 0.9, lh: 1, ls: '-.035em' },
  'Space Grotesk': { family: "'Space Grotesk', ui-sans-serif, system-ui, sans-serif", weight: 500, weight2: 300, italic: 'normal', scale: 0.88, lh: 1.02, ls: '-.04em' },
  Unbounded: { family: "'Unbounded', ui-sans-serif, system-ui, sans-serif", weight: 400, weight2: 300, italic: 'normal', scale: 0.66, lh: 1.08, ls: '-.02em' },
  'Geist Mono': { family: "'Geist Mono', ui-monospace, monospace", weight: 500, weight2: 400, italic: 'normal', scale: 0.7, lh: 1.08, ls: '-.04em' },
  'Instrument Serif': { family: "'Instrument Serif', Georgia, serif", weight: 400, weight2: 400, italic: 'italic', scale: 1, lh: 0.98, ls: '-.012em' }
};

class Component extends DCLogic {
  constructor(p) {
    super(p);
    this.time = 0; this.p = 0; this.pT = 0; this.zt = 0; this.zSpeed = 1;
    this.yawOff = 0; this.pitchOff = 0; this.drag = null;
    this.W = 1440; this.H = 900;
  }
  componentDidMount() {
    var self = this, last = performance.now(), acc = 0;
    var loop = function (now) {
      var dt = Math.min(0.05, (now - last) / 1000); last = now;
      self.time += dt; self.zt += dt * self.zSpeed;
      self.p += (self.pT - self.p) * Math.min(1, dt * 3.2);
      var el = document.getElementById('dz-scroll');
      if (el && el.clientWidth) { self.W = el.clientWidth; self.H = el.clientHeight; }
      acc += dt;
      if (acc > 0.033) { acc = 0; self.forceUpdate(); }
      self.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }
  componentWillUnmount() { cancelAnimationFrame(this.raf); }

  splash(VW) {
    var self = this, zt = this.zt, VH = 1000, cx = VW / 2;
    if (zt > Z_OFF) return { on: false };
    var typed = Math.floor(clamp(zt / T_TYPE, 0, 1) * CMD.length);
    var sp = clamp((zt - T_TYPE) / (T_STREAM - T_TYPE), 0, 1), shown = Math.floor(Math.pow(sp, 1.6) * TERM_LINES.length);
    var out = [{ a: 'davide@zip:~$', b: CMD.slice(0, typed) + (zt < T_TYPE + 0.2 ? (Math.floor(zt * 4) % 2 ? ' ' : '▍') : ''), c: '', ca: ACC, cb: '#ECEAE4', cc: '#6B717B' }];
    out = out.concat(TERM_LINES.slice(0, shown));
    if (zt > T_STREAM + 0.15) out = out.concat(END_LINES.slice(0, Math.min(END_LINES.length, 1 + Math.floor((zt - T_STREAM - 0.15) / 0.14))));
    var maxL = Math.max(8, Math.floor((this.H - 170) / 20));
    var lines = out.slice(-maxL);
    var nf = 0; for (var i = 0; i < shown; i++) if (TERM_LINES[i].file) nf++;
    var prog = zt > T_STREAM ? 1 : sp * 0.97, cells = 28, fill = Math.round(prog * cells);
    var pullY = lerp(-60, 1080, ease((zt - Z_PULL) / 1.0));
    var slideF = ease((zt - Z_SLIDE) / 0.6), slide = slideF * (VW / 2 + 40);
    function open(y) { return y < pullY ? Math.min(VW / 2 + 40, Math.pow((pullY - y) / 1000, 1.25) * VW * 0.62) : 0; }
    var lp = [], rp = [], eL = '', eR = '';
    for (var y = 0; y <= VH; y += 25) {
      var xo = open(y), xl = (cx - xo) / VW * 100, xr = (cx + xo) / VW * 100, yy = y / 10;
      lp.push(xl.toFixed(2) + '% ' + yy + '%'); rp.push(xr.toFixed(2) + '% ' + yy + '%');
      eL += (y ? 'L' : 'M') + (cx - xo - slide).toFixed(1) + ' ' + y; eR += (y ? 'L' : 'M') + (cx + xo + slide).toFixed(1) + ' ' + y;
    }
    var LC = 'polygon(0% 0%, ' + lp.join(', ') + ', 0% 100%)';
    var RC = 'polygon(100% 0%, ' + rp.join(', ') + ', 100% 100%)';
    var tL = '', tR = '';
    for (var ty = 4; ty < VH; ty += 16) {
      tL += 'M' + (cx - open(ty) - slide - 7).toFixed(1) + ' ' + ty + 'h9v7h-9z';
      tR += 'M' + (cx + open(ty + 8) + slide - 2).toFixed(1) + ' ' + (ty + 8) + 'h9v7h-9z';
    }
    var py = clamp(pullY, -40, VH + 40);
    var pull = slide > 1 ? '' : 'M' + (cx - 11) + ' ' + (py - 10) + 'h22v34h-22z M' + (cx - 6) + ' ' + (py + 30) + 'h12v18h-12z';
    var mbps = (2.4 + Math.sin(zt * 9) * 0.6 + sp * 1.4).toFixed(1);
    return {
      on: true, vb: '0 0 ' + VW.toFixed(0) + ' ' + VH, LC: LC, RC: RC, LX: (-slideF * 55).toFixed(2), RX: (slideF * 55).toFixed(2),
      edgeL: eL, edgeR: eR, teethL: tL, teethR: tR, pull: pull, lines: lines,
      nf: zt > T_STREAM ? FILE_COUNT : nf, tf: FILE_COUNT, mb: (TOTAL_KB * prog / 1024).toFixed(1), el: Math.min(zt, T_STREAM + 0.4).toFixed(2),
      bar: '[' + '█'.repeat(fill) + '░'.repeat(cells - fill) + ']', pct: Math.round(prog * 100), speed: zt > T_STREAM ? 'completato' : mbps + ' MB/s',
      skip: function () { self.zSpeed = 5; }
    };
  }

  renderVals() {
    var self = this, t = this.time, p = this.p;
    var accent = this.props.accent ?? '#F5B83D';
    var font = FONTS[this.props.font ?? 'Bricolage'] || FONTS.Bricolage;
    var aspect = clamp(this.W / Math.max(1, this.H), 0.4, 3), VH = 1000, VW = VH * aspect, mobile = aspect < 0.95;

    var intro = ease((this.zt - ZEND - 0.25) / 1.6);
    var k = Math.min(LAST, Math.floor(p)), b = k >= LAST ? 0 : ease((p - k - 0.25) / 0.6);
    var A = MODELS[k](t), B = k < LAST ? MODELS[k + 1](t) : A;
    var M = b <= 0 ? A.segs : b >= 1 ? B.segs : morph(A.segs, B.segs, b);
    if (intro < 1) M = morph([[[0, 0, 0], [0, 0, 0], 'a']], M, intro);
    var near = b < 0.5 ? A : B, kk = b < 0.5 ? k : k + 1;
    var pinO = clamp((p - kk + 0.12) / 0.12, 0, 1) * (kk >= LAST ? 1 : clamp((kk + 0.27 - p) / 0.1, 0, 1));

    var c0 = CAMS[k], c1 = CAMS[Math.min(LAST, k + 1)];
    function mix(key) { return lerp(c0[key], c1[key], b); }
    var S = mix('S') * (mobile ? clamp(aspect * 1.2, 0.5, 1) : 1) * lerp(0.75, 1, intro);
    var cxF = mobile ? 0.5 : mix('cx'), cyF = mobile ? 0.3 : mix('cy');
    function gv(c, key, d) { return c[key] == null ? d : c[key]; }
    var yaw = lerp(gv(c0, 'yaw', -0.5), gv(c1, 'yaw', -0.5), b) + Math.sin(t * 0.22) * lerp(gv(c0, 'amp', 0.45), gv(c1, 'amp', 0.45), b) + this.yawOff;
    var cm = cam(yaw, clamp(mix('pitch') + this.pitchOff, -1.1, 0.3), 1500, S, VW * cxF, VH * cyF, mix('oy'));
    var w = draw(M, cm);
    var pinList = pinO > 0.01 ? near.pins.map(function (q) { var s = proj(q.p, cm); return { x: (s[0] / VW * 100).toFixed(2), y: (s[1] / VH * 100).toFixed(2), o: pinO.toFixed(2), txt: q.txt }; }) : [];

    var show = clamp((this.zt - ZEND - 1.0) / 0.8, 0, 1);
    var scenes = SCENES.map(function (s, i) {
      var dist = p - i, o;
      if (i === 0) o = show * clamp(1 - (dist - 0.14) / 0.3, 0, 1);
      else if (i === LAST) o = clamp((dist + 0.44) / 0.3, 0, 1);
      else o = clamp(1 - (Math.abs(dist) - 0.14) / 0.3, 0, 1);
      return { kicker: s.kicker, t1: s.t1, t2: s.t2, sub: s.sub || '', hasSub: !!s.sub, done: s.done || '', hasDone: !!s.done, isProcess: !!s.process, isEnd: !!s.end, isIntro: i === 0,
        fs: s.big ? 'clamp(44px, 5.6vw, 92px)' : 'clamp(36px, 4.4vw, 72px)',
        o: o.toFixed(3), dy: (-dist * 60 + (i === 0 ? (1 - show) * 30 : 0)).toFixed(1), pe: o > 0.6 ? 'auto' : 'none' };
    });
    var sc = Math.min(LAST, Math.round(p)) + 1;
    var scroller = function () { return document.getElementById('dz-scroll'); };
    var hud = clamp((this.zt - ZEND - 0.9) / 0.8, 0, 1);

    return {
      accent: accent, font: font, vb: '0 0 ' + VW.toFixed(0) + ' ' + VH, w: w, pins: pinList, scenes: scenes, steps: STEPS, photo: { src: PHOTO_SRC, has: !!PHOTO_SRC, none: !PHOTO_SRC, scan: ((t * 22) % 120 - 10).toFixed(1) },
      z: this.splash(VW), hud: hud.toFixed(2), hint: (clamp((this.zt - ZEND - 1.9) / 0.6, 0, 1) * clamp(1 - p / 0.3, 0, 1)).toFixed(2),
      prog: (p / LAST * 100).toFixed(2), sc: (sc < 10 ? '0' : '') + sc, sceneName: SCENES[Math.min(LAST, Math.round(p))].name,
      mail: 'mailto:info@davidelanotte.com?subject=' + encodeURIComponent('Ho un problema da risolvere') + '&body=' + encodeURIComponent('Ciao Davide,\n\nil problema è questo:\n\n'),
      onScroll: function (e) { var el = e.currentTarget, max = el.scrollHeight - el.clientHeight; self.pT = max > 0 ? el.scrollTop / max * LAST : 0; },
      toEnd: function () { var el = scroller(); if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' }); },
      toTop: function () { var el = scroller(); if (el) el.scrollTo({ top: 0, behavior: 'smooth' }); },
      down: function (e) { self.drag = { x: e.clientX, y: e.clientY, yo: self.yawOff, po: self.pitchOff }; try { e.currentTarget.setPointerCapture(e.pointerId); } catch (_) {} },
      move: function (e) { if (!self.drag) return; self.yawOff = self.drag.yo + (e.clientX - self.drag.x) * 0.008; self.pitchOff = clamp(self.drag.po - (e.clientY - self.drag.y) * 0.004, -0.6, 0.5); },
      up: function () { self.drag = null; }
    };
  }
}

/* ---------- runtime statico (GitHub Pages) ---------- */
(function () {
  var PROPS = { accent: '#F5B83D', font: 'Bricolage' };
  var $ = function (id) { return document.getElementById(id); };
  function h(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  var comp = new Component(PROPS), cur = null, built = false;
  var root = $('dz-scroll'), svg = $('scene-svg'), pinsBox = $('pins'), scenesBox = $('scenes'), splash = $('splash');
  var P = { g: $('p-g'), l: $('p-l'), n1: $('p-n1'), a1: $('p-a1'), n0: $('p-n0'), p: $('p-p'), a0: $('p-a0') };
  var sceneEls = [], pinPool = [], scanEls = [], halves = [], lineRows = [[], []], heads = [], foots = [], zsvg = null, zp = {};
  var photoOK = !!PHOTO_SRC;

  function photoHTML() {
    return '<div class="portrait"><div class="photo">' +
      (photoOK ? '<img src="' + esc(PHOTO_SRC) + '" alt="Davide Lanotte" onerror="this.remove()">' : '') +
      '<div class="ph"' + (photoOK ? ' style="z-index:-1"' : '') + '>[ FOTO ]</div><div class="tint"></div><div class="lines"></div><div class="scan"></div></div>' +
      '<div class="photo-meta">davide.jpg<br><span class="acc">● online</span><br>Roma, IT</div></div>';
  }
  function build(v) {
    v.scenes.forEach(function (s, i) {
      var el = h(i === 0 ? 'section' : 'section', 'scene'), html = '';
            html += '<div class="kicker">' + esc(s.kicker) + '</div>';
      html += (i === 0 ? '<h1>' : '<h2>') + esc(s.t1) + '<br><em>' + esc(s.t2) + '</em>' + (i === 0 ? '</h1>' : '</h2>');
      if (s.hasSub) html += '<p>' + esc(s.sub) + '</p>';
      if (s.hasDone) html += '<div class="done"><b>Già fatto</b><span>' + esc(s.done) + '</span></div>';
      if (s.isProcess) html += '<div class="steps">' + v.steps.map(function (st) { return '<div><span class="n">' + st.n + '</span><span class="t">' + esc(st.t) + '</span><span class="d">' + esc(st.d) + '</span></div>'; }).join('') + '</div>';
      if (s.isEnd) html += '<div class="me"><div class="avatar">' + (photoOK ? '<img src="' + esc(PHOTO_SRC) + '" alt="" onerror="this.remove()">' : '') + '</div><div style="display:flex;flex-direction:column;gap:2px"><span class="name">Davide Lanotte</span><span class="role">SVILUPPATORE · ROMA</span></div></div>' +
        '<div class="row"><a class="cta" href="' + esc(v.mail) + '">Scrivimi una mail →</a><a class="cta ghost" href="https://wa.me/393285945281" target="_blank" rel="noopener">WhatsApp →</a></div>' +
        '<div class="links"><a class="lnk" href="https://wearepeople.it" target="_blank" rel="noopener">We Are People ↗</a><a class="lnk" href="https://www.linkedin.com/in/davide-lanotte/" target="_blank" rel="noopener">LinkedIn ↗</a><a class="lnk" href="https://github.com/zxcvbinz" target="_blank" rel="noopener">GitHub ↗</a></div>';
      el.innerHTML = html;
      scenesBox.appendChild(el); sceneEls.push(el);
      var sc = el.querySelector('.scan'); if (sc) scanEls.push(sc);
    });
    // splash
    for (var k = 0; k < 2; k++) {
      var half = h('div', 'half');
      half.innerHTML = '<div class="term"><div class="term-head"><span>davide@zip — zsh — 120×40</span><span>file <b class="nf">0</b>/<span class="tf">0</span> · <b class="mb">0</b> MB · errori <span class="acc">0</span> · <span class="el">0</span>s</span></div>' +
        '<div class="term-body"></div><div class="term-foot"><span class="acc bar"></span><b class="pct" style="font-weight:400;color:var(--tx)"></b><span class="speed"></span><span class="skip">clic per saltare</span></div></div>';
      splash.appendChild(half); halves.push(half);
      heads.push({ nf: half.querySelector('.nf'), tf: half.querySelector('.tf'), mb: half.querySelector('.mb'), el: half.querySelector('.el') });
      foots.push({ bar: half.querySelector('.bar'), pct: half.querySelector('.pct'), speed: half.querySelector('.speed'), body: half.querySelector('.term-body') });
    }
    var NS = 'http://www.w3.org/2000/svg';
    zsvg = document.createElementNS(NS, 'svg'); zsvg.setAttribute('class', 'zip-svg'); zsvg.setAttribute('preserveAspectRatio', 'none');
    [['edgeL', 'none', 'rgba(236,234,228,.22)'], ['edgeR', 'none', 'rgba(236,234,228,.22)'], ['teethL', 'var(--acc)'], ['teethR', 'var(--acc)'], ['pull', 'var(--acc)']].forEach(function (d) {
      var p = document.createElementNS(NS, 'path'); p.setAttribute('fill', d[1]); if (d[2]) { p.setAttribute('stroke', d[2]); p.setAttribute('stroke-width', '1'); }
      if (d[0] === 'teethR') p.setAttribute('fill-opacity', '.72');
      zsvg.appendChild(p); zp[d[0]] = p;
    });
    splash.appendChild(zsvg);
    built = true;
  }
  function setRows(body, rows, store) {
    while (store.length < rows.length) { var d = h('div'); d.appendChild(h('span')); d.appendChild(h('span')); d.appendChild(h('span')); body.appendChild(d); store.push({ d: d, k: '' }); }
    for (var i = 0; i < store.length; i++) {
      var r = rows[i], s = store[i];
      if (!r) { if (s.k !== '-') { s.d.style.display = 'none'; s.k = '-'; } continue; }
      var key = r.a + '|' + r.b + '|' + r.c;
      if (s.k === key) continue;
      s.k = key; s.d.style.display = '';
      var sp = s.d.childNodes;
      sp[0].textContent = r.a; sp[0].style.color = r.ca;
      sp[1].textContent = r.b; sp[1].style.color = r.cb;
      sp[2].textContent = r.c; sp[2].style.color = r.cc;
    }
  }
  function render() {
    var v = comp.renderVals(); cur = v;
    if (!built) build(v);
    root.style.setProperty('--acc', v.accent);
    svg.setAttribute('viewBox', v.vb);
    for (var k in P) P[k].setAttribute('d', v.w[k] || '');
    while (pinPool.length < v.pins.length) { var pe = h('div', 'pin', '<i></i><span></span>'); pinsBox.appendChild(pe); pinPool.push(pe); }
    pinPool.forEach(function (pe, i) {
      var q = v.pins[i];
      if (!q) { pe.style.display = 'none'; return; }
      pe.style.display = ''; pe.style.left = q.x + '%'; pe.style.top = q.y + '%'; pe.style.opacity = q.o;
      var sp = pe.lastChild; if (sp.textContent !== q.txt) sp.textContent = q.txt;
    });
    v.scenes.forEach(function (s, i) {
      var el = sceneEls[i];
      el.style.opacity = s.o; el.style.transform = 'translateY(' + s.dy + 'px)'; el.style.pointerEvents = s.pe;
      el.setAttribute('aria-hidden', +s.o < 0.5 ? 'true' : 'false');
    });
    scanEls.forEach(function (e) { e.style.top = v.photo.scan + '%'; });
    $('hud-top').style.opacity = v.hud; $('hud-bottom').style.opacity = v.hud;
    $('prog').style.width = v.prog + '%'; $('sc').textContent = v.sc; $('hint').style.opacity = v.hint;
    var z = v.z;
    if (!z.on) { if (splash.parentNode) splash.parentNode.removeChild(splash); return; }
    halves[0].style.transform = 'translateX(' + z.LX + '%)'; halves[0].style.clipPath = z.LC;
    halves[1].style.transform = 'translateX(' + z.RX + '%)'; halves[1].style.clipPath = z.RC;
    for (var j = 0; j < 2; j++) {
      heads[j].nf.textContent = z.nf; heads[j].tf.textContent = z.tf; heads[j].mb.textContent = z.mb; heads[j].el.textContent = z.el;
      foots[j].bar.textContent = z.bar; foots[j].pct.textContent = z.pct + '%'; foots[j].speed.textContent = z.speed;
      setRows(foots[j].body, z.lines, lineRows[j]);
    }
    zsvg.setAttribute('viewBox', z.vb);
    ['edgeL', 'edgeR', 'teethL', 'teethR', 'pull'].forEach(function (k) { zp[k].setAttribute('d', z[k] || ''); });
  }
  comp.forceUpdate = render;

  root.addEventListener('scroll', function (e) { if (cur) cur.onScroll(e); }, { passive: true });
  var stage = $('stage');
  stage.addEventListener('pointerdown', function (e) { if (cur) cur.down(e); });
  stage.addEventListener('pointermove', function (e) { if (cur) cur.move(e); });
  stage.addEventListener('pointerup', function (e) { if (cur) cur.up(e); });
  stage.addEventListener('pointercancel', function (e) { if (cur) cur.up(e); });
  $('to-top').addEventListener('click', function () { if (cur) cur.toTop(); });
  $('to-end').addEventListener('click', function () { if (cur) cur.toEnd(); });
  function skip() { if (cur && cur.z && cur.z.skip) cur.z.skip(); }
  splash.addEventListener('click', skip);
  splash.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') { e.preventDefault(); skip(); } });
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) comp.zSpeed = 6;

  render();
  comp.componentDidMount();
})();
