// Holiday decoration for the header, ported from the design (SiteHeader.dc.html).
// Everything is generated as SVG path data, so one renderer draws every holiday.
// Plain JS on purpose: it is a numeric generator and is only run in the browser.

// b = the menu pill measured in header pixels { W: header width, x0, x1, y, h }.
// The design artboard (1440 / 390 wide) is rebuilt around the pill with the design's side margin,
// so a 1920px screen keeps every ornament where the design put it relative to the bar.
export function decor(season, mobile, b) {
const m = mobile ? 10 : 120, ox = b.x0 - m, SW = b.W;
const W = b.x1 - b.x0 + 2 * m, k = mobile ? 0.6 : 1, Hh = mobile ? 470 : 640;
const px0 = m, px1 = W - m, py = b.y, ph = b.h, pb = py + ph, oy = py - (mobile ? 10 : 14);
let seed = 11;
const r = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const f = (n) => Math.round(n * 10) / 10;
const circ = (x, y, rx, ry) => { ry = ry ?? rx; return 'M' + f(x - rx) + ' ' + f(y) + 'a' + f(rx) + ' ' + f(ry) + ' 0 1 0 ' + f(2 * rx) + ' 0a' + f(rx) + ' ' + f(ry) + ' 0 1 0 ' + f(-2 * rx) + ' 0z'; };
const rect = (x, y, w, h) => 'M' + f(x) + ' ' + f(y) + 'h' + f(w) + 'v' + f(h) + 'h' + f(-w) + 'z';
const star = (x, y, R, q, n) => { let d = ''; for (let i = 0; i < n * 2; i++) { const t = -Math.PI / 2 + i * Math.PI / n, rr = i % 2 ? R * q : R; d += (i ? 'L' : 'M') + f(x + Math.cos(t) * rr) + ' ' + f(y + Math.sin(t) * rr); } return d + 'z'; };
// o.dv: 'd1; d2; …' morphs the path (same commands in every frame), e.g. a waving flag or a flapping wing.
const S = (d, fill, o) => { o = o || {}; return { d, fill, stroke: o.stroke || 'none', sw: o.sw || 0, op: o.op ?? 1, tf: o.tf || 'translate(0 0)', dv: o.dv, dDur: o.dDur || '2s' }; };
const L = (d, stroke, sw, op) => S(d, 'none', { stroke, sw, op });
const G = (shapes, o) => { o = o || {}; return { shapes, sway: o.sway || '0 0 0; 0 0 0; 0 0 0', dur: o.dur || '8s', tw: o.tw || '1; 1', twDur: o.twDur || '4s', begin: o.begin || '0s', filter: o.filter || 'none' }; };
const swing = (deg, x, y) => (-deg) + ' ' + f(x) + ' ' + f(y) + '; ' + deg + ' ' + f(x) + ' ' + f(y) + '; ' + (-deg) + ' ' + f(x) + ' ' + f(y);
const back = [], front = [], fallers = [];

const petalD = (R) => 'M0 0C' + f(R * 0.8) + ' ' + f(-R * 0.1) + ' ' + f(R * 0.86) + ' ' + f(-R * 0.95) + ' 0 ' + f(-R) + 'C' + f(-R * 0.86) + ' ' + f(-R * 0.95) + ' ' + f(-R * 0.8) + ' ' + f(-R * 0.1) + ' 0 0z';
const leafD = (R) => 'M0 0C' + f(R * 0.5) + ' ' + f(-R * 0.3) + ' ' + f(R * 0.45) + ' ' + f(-R * 0.8) + ' 0 ' + f(-R) + 'C' + f(-R * 0.45) + ' ' + f(-R * 0.8) + ' ' + f(-R * 0.5) + ' ' + f(-R * 0.3) + ' 0 0z';
const flower = (x, y, R, fill, out) => {
const rot = r() * 72;
for (let i = 0; i < 5; i++) out.push(S(petalD(R), fill, { tf: 'translate(' + f(x) + ' ' + f(y) + ') rotate(' + f(rot + i * 72) + ')', op: 0.97 }));
out.push(S(circ(x, y, R * 0.2), '#E26A12'));
for (let i = 0; i < 7; i++) { const t = i * 0.9 + rot, q = R * (0.3 + (i % 2) * 0.12); out.push(S(circ(x + Math.cos(t) * q, y + Math.sin(t) * q, Math.max(0.8, R * 0.06)), '#8E2A0F')); }
};
const limb = (x, y, a, len, w0, w1, bend, out) => {
const n = 9, A = [], B = [], pts = [];
for (let i = 0; i <= n; i++) {
const w = (w0 + (w1 - w0) * i / n) / 2, nx = -Math.sin(a), ny = Math.cos(a);
A.push(f(x + nx * w) + ' ' + f(y + ny * w)); B.unshift(f(x - nx * w) + ' ' + f(y - ny * w));
pts.push([x, y, a, w * 2]);
a += bend / n + (r() - 0.5) * 0.46;
x += Math.cos(a) * len / n; y += Math.sin(a) * len / n;
}
out.push(S('M' + A.concat(B).join('L') + 'z', 'url(#sdBark)'));
return pts;
};
const tree = (x, y, a, len, w, depth, out, tips) => {
const pts = limb(x, y, a, len, w, Math.max(1.2, w * 0.3), (r() - 0.5) * 0.5, out);
pts.forEach((p, i) => { if (i > 2 && (i % 2 === 1 || i === pts.length - 1)) tips.push(p); });
if (depth > 0) [3, 5, 7].forEach((i, j) => {
const p = pts[i], side = ((j + depth) % 2 ? 1 : -1) * (0.5 + r() * 0.5);
tree(p[0], p[1], p[2] + side, len * (0.4 + r() * 0.18), p[3] * 0.72, depth - 1, out, tips);
});
};
const bloom = (tips, fill, out, size) => tips.forEach((p) => {
const q = r(), x = p[0] + (r() - 0.5) * 10, y = p[1] + (r() - 0.5) * 10;
if (q < 0.62) flower(x, y, (size + r() * size * 0.6), fill, out);
else if (q < 0.86) { out.push(S(circ(x, y, 3.4 * k + 1), fill === 'url(#sdDao)' ? '#F0588A' : '#F4B400')); out.push(S(circ(x - 1.6, y + 2.4, 1.8), '#6E9B3A')); }
else out.push(S(leafD(11 * k + 3), 'url(#sdLeaf)', { tf: 'translate(' + f(x) + ' ' + f(y) + ') rotate(' + f(r() * 360) + ')', op: 0.9 }));
});
const lantern = (x, y, len, s) => {
const cy = y + len + 15 * s, sh = [];
sh.push(L('M' + f(x) + ' ' + f(y) + 'V' + f(cy - 15 * s), '#F2B01E', 1.2));
sh.push(S(circ(x, cy, 12.5 * s, 15 * s), 'url(#sdRed)'));
sh.push(L('M' + f(x - 5 * s) + ' ' + f(cy - 13 * s) + 'q' + f(-5 * s) + ' ' + f(13 * s) + ' 0 ' + f(26 * s) + 'M' + f(x + 5 * s) + ' ' + f(cy - 13 * s) + 'q' + f(5 * s) + ' ' + f(13 * s) + ' 0 ' + f(26 * s) + 'M' + f(x) + ' ' + f(cy - 14 * s) + 'v' + f(28 * s), '#F2B01E', 0.9, 0.7));
sh.push(S(rect(x - 7 * s, cy - 17 * s, 14 * s, 4 * s), 'url(#sdGold)'));
sh.push(S(rect(x - 7 * s, cy + 13 * s, 14 * s, 4 * s), 'url(#sdGold)'));
sh.push(L('M' + f(x) + ' ' + f(cy + 17 * s) + 'v' + f(16 * s) + 'M' + f(x - 3.5 * s) + ' ' + f(cy + 17 * s) + 'v' + f(11 * s) + 'M' + f(x + 3.5 * s) + ' ' + f(cy + 17 * s) + 'v' + f(11 * s), '#F2B01E', 1.3));
return G(sh, { sway: swing(4, x, y), dur: (3.6 + r() * 1.6).toFixed(1) + 's', filter: 'url(#sdShade)' });
};
const fall = (n, d, fills, o) => {
o = o || {};
for (let i = 0; i < n; i++) {
const x = r() * (SW + 120) - 40 - ox, sc = (o.min ?? 0.5) + r() * (o.span ?? 0.9), dur = (o.dur ?? 9) + r() * 7;
const drift = (o.drift ?? -70) * (0.4 + r()), a = (o.sway ?? 16) * (0.5 + r()), op = Math.min(1, 0.45 + sc * 0.4), dir = r() < 0.5 ? -1 : 1;
fallers.push({
path: f(x) + ' ' + f(pb - 20) + '; ' + f(x + drift) + ' ' + f(Hh),
fade: '0; ' + f(op) + '; ' + f(op) + '; 0',
swayX: f(-a) + ' 0; ' + f(a) + ' 0; ' + f(-a) + ' 0', swayDur: (2.6 + r() * 2.4).toFixed(1) + 's',
spin: o.spin === false ? '0; 0' : '0; ' + dir * 360, spinDur: (5 + r() * 7).toFixed(1) + 's',
flip: o.flip ? '1 1; 1 0.2; 1 1' : '1 1; 1 1; 1 1', flipDur: (1.6 + r() * 2).toFixed(1) + 's',
d, fill: o.stroke ? 'none' : fills[i % fills.length], stroke: o.stroke ? fills[i % fills.length] : 'none', sw: o.stroke ? 1.4 : 0,
tf: 'scale(' + f(sc) + ')', dur: dur.toFixed(1) + 's', begin: '-' + (r() * 16).toFixed(1) + 's',
filter: sc > (o.min ?? 0.5) + (o.span ?? 0.9) * 0.8 ? 'url(#sdBlur)' : 'none'
});
}
};
const burst = (cx, cy, R, colors, begin) => {
const sh = [], n = 16;
for (let i = 0; i < n; i++) {
const t = i * 2 * Math.PI / n, c = colors[i % colors.length], q = i % 2 ? 0.78 : 1;
sh.push(L('M' + f(cx + Math.cos(t) * R * 0.28) + ' ' + f(cy + Math.sin(t) * R * 0.28) + 'L' + f(cx + Math.cos(t) * R * q) + ' ' + f(cy + Math.sin(t) * R * q), c, 1.8, 0.9));
sh.push(S(circ(cx + Math.cos(t) * R * (q + 0.08), cy + Math.sin(t) * R * (q + 0.08), 2), c));
}
sh.push(S(circ(cx, cy, R * 0.09), '#FFFFFF'));
return G(sh, { tw: '0; 1; 0.85; 0; 0', twDur: '4.2s', begin, filter: 'url(#sdGlow)' });
};
const bunting = (colorsA, withStar, x0b, x1b) => {
const sh = [], span = mobile ? 74 : 104, sag = mobile ? 12 : 16;
let x = x0b ?? px0 + 28, d = 'M' + f(x) + ' ' + f(pb + 3), i = 0;
while (x + span <= (x1b ?? px1 - 28)) {
d += 'q' + f(span / 2) + ' ' + f(sag * 2) + ' ' + f(span) + ' 0';
[0.25, 0.5, 0.75].forEach((t) => {
const fx = x + span * t, fy = pb + 3 + 4 * sag * t * (1 - t), w = mobile ? 15 : 20, c = colorsA[i++ % colorsA.length];
sh.push(S('M' + f(fx - w / 2) + ' ' + f(fy) + 'h' + f(w) + 'l' + f(-w / 2) + ' ' + f(w * 1.25) + 'z', c));
if (withStar) sh.push(S(star(fx, fy + w * 0.42, w * 0.24, 0.4, 5), '#FFDA2A'));
});
x += span;
}
sh.unshift(L(d, 'rgba(255,255,255,0.7)', 1.3));
return G(sh, { filter: 'url(#sdShade)' });
};
// Vietnamese flag on a gold pole, waving: red cloth + yellow star morph through 4 wave frames.
// dir = -1 flies to the left of the pole, 1 to the right.
const flag = (px, top, len, w, h, dir, dur) => {
const y0 = top + 10 * k + 4, frames = [0, 1.57, 3.14, 4.71], A = h * 0.13;
const off = (u, t) => A * u * Math.sin(u * 5.2 - t);
const cloth = (t) => {
const X = (u) => f(px + dir * w * u), Y = (u, base) => f(base + off(u, t));
return 'M' + X(0) + ' ' + Y(0, y0) + 'C' + X(0.33) + ' ' + Y(0.33, y0) + ' ' + X(0.66) + ' ' + Y(0.66, y0) + ' ' + X(1) + ' ' + Y(1, y0) +
'L' + X(1) + ' ' + Y(1, y0 + h) + 'C' + X(0.66) + ' ' + Y(0.66, y0 + h) + ' ' + X(0.33) + ' ' + Y(0.33, y0 + h) + ' ' + X(0) + ' ' + Y(0, y0 + h) + 'z';
};
const starAt = (t) => star(px + dir * w * 0.5, y0 + h / 2 + off(0.5, t), h * 0.3, 0.382, 5);
const shine = (t) => 'M' + f(px + dir * w * 0.18) + ' ' + f(y0 + off(0.18, t)) + 'L' + f(px + dir * w * 0.3) + ' ' + f(y0 + off(0.3, t)) + 'L' + f(px + dir * w * 0.3) + ' ' + f(y0 + h + off(0.3, t)) + 'L' + f(px + dir * w * 0.18) + ' ' + f(y0 + h + off(0.18, t)) + 'z';
const vals = (fn) => frames.concat(frames[0]).map(fn).join('; ');
const sh = [
S(rect(px - 2.2 * k - 0.6, top, 4.4 * k + 1.2, len), 'url(#sdGold)'),
S(circ(px, top - 2, 4.2 * k + 1.5), 'url(#sdGold)'),
S(cloth(0), 'url(#sdFlag)', { dv: vals(cloth), dDur: dur }),
S(shine(0), '#FFFFFF', { op: 0.12, dv: vals(shine), dDur: dur }),
S(starAt(0), '#FFDA2A', { dv: vals(starAt), dDur: dur }),
];
return G(sh, { filter: 'url(#sdShade)' });
};
// White dove gliding, wings flapping.
const dove = (x, y, s, flip) => {
const tf = 'translate(' + f(x) + ' ' + f(y) + ') scale(' + f(flip ? -s : s) + ' ' + f(s) + ')';
const up = 'M14 -2C18 -22 30 -30 42 -33C34 -20 30 -8 24 0z', down = 'M14 -2C20 8 30 15 40 19C32 10 28 4 24 0z';
const sh = [
S('M14 -2C24 -9 34 -6 40 -14C34 -2 28 4 24 0z', '#D6E2F2', { tf, dv: 'M14 -2C24 -9 34 -6 40 -14C34 -2 28 4 24 0z; M14 -2C24 3 34 6 40 10C34 4 28 2 24 0z; M14 -2C24 -9 34 -6 40 -14C34 -2 28 4 24 0z', dDur: '1.1s' }),
S('M0 0C6 -6 18 -7 28 -2C34 1 40 1 50 -3C44 5 36 8 26 7C16 8 6 6 0 0z', '#FFFFFF', { tf }),
S(circ(-1, -3, 5.6), '#FFFFFF', { tf }),
S('M-6 -3.6l-6 2.2l6 1.2z', '#F2A33A', { tf }),
S(circ(-2.6, -4.2, 0.9), '#1B2440', { tf }),
S(up, '#FFFFFF', { tf, dv: up + '; ' + down + '; ' + up, dDur: '1.1s' }),
];
return G(sh, { sway: swing(2.5, x + 260, y), dur: (6 + r() * 2).toFixed(1) + 's', filter: 'url(#sdShade)' });
};
// Lạc bird from the Đông Sơn drum: long beak, crest, forked tail, gold.
const lacBird = (x, y, s, dur) => {
const tf = 'translate(' + f(x) + ' ' + f(y) + ') scale(' + f(s) + ')';
const up = 'M6 -2C12 -20 26 -30 44 -34C32 -18 22 -6 16 0z', down = 'M6 -2C14 6 26 12 40 14C30 8 22 3 16 0z';
const sh = [
S('M0 0C10 -5 22 -5 30 -1L58 -3L31 3C24 8 12 8 0 4L-22 12L-8 2L-26 1L-8 -1L-20 -10z', 'url(#sdGold)', { tf }),
S('M25 -3L18 -15L28 -5z', 'url(#sdGold)', { tf }),
S(circ(26, -1, 1.2), '#5A1E08', { tf }),
S(up, 'url(#sdGold)', { tf, op: 0.95, dv: up + '; ' + down + '; ' + up, dDur: dur }),
];
return G(sh, { sway: swing(3, x - 220, y), dur: (7 + r() * 3).toFixed(1) + 's', filter: 'url(#sdShade)' });
};
const petal = 'M0 -7C5 -6 6 2 0 7C-6 2 -5 -6 0 -7z';
const confetti = 'M-4 -2.4h8v4.8h-8z';

if (season === 'tet') {
const sides = mobile ? [[W + 8, oy - 6, Math.PI - 0.06, 170, 8]] : [[W + 12, oy - 2, Math.PI - 0.1, 400, 13], [-12, oy + 2, 0.04, 210, 9]];
sides.forEach(([x, y, a, len, w], i) => {
const bark = [], tips = [], fl = [];
tree(x, y, a, len, w, mobile ? 1 : 2, bark, tips);
bloom(tips, 'url(#sdMai)', fl, mobile ? 6.5 : 9.5);
back.push(G(bark.concat(fl), { sway: swing(0.8, x, y), dur: (8 + i * 2) + 's', filter: 'url(#sdShade)' }));
});
if (!mobile) { front.push(lantern(W - 190, pb - 4, 26, 1)); front.push(lantern(W - 96, pb - 6, 52, 0.82)); front.push(lantern(70, pb - 6, 34, 0.82)); }
else front.push(lantern(W - 34, pb - 4, 18, 0.7));
fall(mobile ? 9 : 22, petal, ['#FFD23F', '#FFC21A', '#FFE680'], { flip: true });
}

if (season === 'nhagiao') {
const sides = mobile ? [[W + 6, oy - 6, Math.PI - 0.06, 160, 6]] : [[W + 10, oy, Math.PI - 0.12, 340, 9], [-10, oy + 2, 0.04, 200, 7]];
sides.forEach(([x, y, a, len, w], i) => {
const bark = [], tips = [], fl = [];
tree(x, y, a, len, w, mobile ? 1 : 2, bark, tips);
bloom(tips, 'url(#sdDao)', fl, mobile ? 6.5 : 9);
back.push(G(bark.concat(fl), { sway: swing(0.8, x, y), dur: (8 + i * 2) + 's', filter: 'url(#sdShade)' }));
});
fall(mobile ? 9 : 20, petal, ['#FF9DBB', '#FFC2D4', '#FFFFFF'], { flip: true });
}

if (season === 'noel') {
// snow lying on the menu bar, with a few drips
// a thin cap on the pill's top edge: drips stay under ~6px so they never reach the menu text
let x = px0 + 34, d = 'M' + f(x) + ' ' + f(py + 1);
while (x < px1 - 60) { const w = 24 + r() * 46, h = 3 + r() * 5; d += 'q' + f(w / 2) + ' ' + f(-h * 2) + ' ' + f(w) + ' 0'; x += w; }
d += 'v2';
while (x > px0 + 60) { const w = 16 + r() * 34, dp = r() < 0.25 ? 2.5 + r() * 1.5 : 0.6 + r() * 0.8; d += 'q' + f(-w / 2) + ' ' + f(dp * 2) + ' ' + f(-w) + ' 0'; x -= w; }
front.push(G([S(d + 'z', 'url(#sdSnow)')], { filter: 'url(#sdShade)' }));
// string lights under the bar
const span = mobile ? 72 : 100, sag = mobile ? 11 : 15, cols = ['#FF4D5E', '#FFD23F', '#5EE6A8', '#6FB6FF'], sets = [[], [], [], []];
let lx = px0 + 30, wire = 'M' + f(lx) + ' ' + f(pb + 2), bi = 0;
while (lx + span <= px1 - 30) {
wire += 'q' + f(span / 2) + ' ' + f(sag * 2) + ' ' + f(span) + ' 0';
[0.2, 0.5, 0.8].forEach((t) => { const bx = lx + span * t, by = pb + 2 + 4 * sag * t * (1 - t), c = bi++ % 4; sets[c].push(S(rect(bx - 2, by, 4, 3.5), '#123B2B')); sets[c].push(S(circ(bx, by + 8.5, 4, 5.4), cols[c])); sets[c].push(S(circ(bx - 1.2, by + 6.6, 1.1, 1.6), '#FFFFFF', { op: 0.7 })); });
lx += span;
}
front.push(G([L(wire, '#0C3324', 1.6)]));
sets.forEach((sh, i) => front.push(G(sh, { tw: '1; 0.35; 1', twDur: '2.4s', begin: (i * 0.6).toFixed(1) + 's', filter: 'url(#sdGlow)' })));
// snowman and reindeer standing on the bar
const s = mobile ? 0.74 : 1, by = py + 2;
const man = (x) => {
const sh = [], B = 13 * s, Hd = 9 * s, cy = by - B + 2, hy = cy - B - Hd + 5 * s;
sh.push(L('M' + f(x - B + 2) + ' ' + f(cy - 4 * s) + 'l' + f(-12 * s) + ' ' + f(-9 * s) + 'M' + f(x + B - 2) + ' ' + f(cy - 4 * s) + 'l' + f(12 * s) + ' ' + f(-10 * s), '#6B4423', 1.6));
sh.push(S(circ(x, cy, B), 'url(#sdBall)')); sh.push(S(circ(x, hy, Hd), 'url(#sdBall)'));
sh.push(S('M' + f(x - Hd) + ' ' + f(hy + Hd * 0.62) + 'q' + f(Hd) + ' ' + f(5 * s) + ' ' + f(Hd * 2) + ' 0v' + f(4 * s) + 'q' + f(-Hd) + ' ' + f(5 * s) + ' ' + f(-Hd * 2) + ' 0z', '#D8232A'));
sh.push(S(rect(x + Hd * 0.35, hy + Hd * 0.9, 4 * s, 11 * s), '#B3131B'));
sh.push(S(rect(x - Hd * 0.72, hy - Hd - 8 * s, Hd * 1.44, 9 * s), '#1B2440')); sh.push(S(rect(x - Hd * 1.1, hy - Hd + 0.5 * s, Hd * 2.2, 2.6 * s), '#1B2440')); sh.push(S(rect(x - Hd * 0.72, hy - Hd - 2 * s, Hd * 1.44, 2.4 * s), '#D8232A'));
sh.push(S(circ(x - 3 * s, hy - 1.5 * s, 1.1 * s), '#1B2440')); sh.push(S(circ(x + 3 * s, hy - 1.5 * s, 1.1 * s), '#1B2440'));
sh.push(S('M' + f(x) + ' ' + f(hy + 0.5 * s) + 'l' + f(9 * s) + ' ' + f(2 * s) + 'l' + f(-9 * s) + ' ' + f(1.6 * s) + 'z', '#F28C28'));
sh.push(S(circ(x, cy - 3 * s, 1.2 * s), '#1B2440')); sh.push(S(circ(x, cy + 3 * s, 1.2 * s), '#1B2440'));
return G(sh, { filter: 'url(#sdShade)' });
};
const deer = (x) => {
const sh = [], yb = by - 13 * s;
[-9, -4, 5, 9].forEach((dx, i) => sh.push(L('M' + f(x + dx * s) + ' ' + f(yb + 2 * s) + 'v' + f(11 * s), i % 2 ? '#8B5A2B' : '#5E3A1A', 3 * s)));
sh.push(S(circ(x, yb - 2 * s, 14 * s, 8.5 * s), 'url(#sdFur)'));
sh.push(S(circ(x - 3 * s, yb + 1 * s, 8 * s, 4 * s), '#F3E3CC', { op: 0.75 }));
sh.push(S(circ(x - 14 * s, yb - 5 * s, 2.6 * s), '#F3E9DC'));
sh.push(S('M' + f(x + 7 * s) + ' ' + f(yb - 6 * s) + 'l' + f(7 * s) + ' ' + f(-13 * s) + 'l' + f(7 * s) + ' ' + f(3 * s) + 'l' + f(-7 * s) + ' ' + f(15 * s) + 'z', 'url(#sdFur)'));
sh.push(S(circ(x + 19 * s, yb - 19 * s, 7 * s, 5.4 * s), 'url(#sdFur)'));
sh.push(S(circ(x + 12.5 * s, yb - 23 * s, 2.2 * s, 3.4 * s), '#7A4A22'));
sh.push(L('M' + f(x + 16 * s) + ' ' + f(yb - 24 * s) + 'q' + f(-3 * s) + ' ' + f(-7 * s) + ' ' + f(-1 * s) + ' ' + f(-12 * s) + 'M' + f(x + 14.6 * s) + ' ' + f(yb - 30 * s) + 'l' + f(-4.5 * s) + ' ' + f(-2.5 * s) + 'M' + f(x + 20 * s) + ' ' + f(yb - 24.5 * s) + 'q' + f(4 * s) + ' ' + f(-6 * s) + ' ' + f(3 * s) + ' ' + f(-12 * s) + 'M' + f(x + 22.6 * s) + ' ' + f(yb - 31 * s) + 'l' + f(4.5 * s) + ' ' + f(-2 * s), '#F0DDBE', 1.7 * s));
sh.push(S(circ(x + 20.5 * s, yb - 20.5 * s, 1.1 * s), '#1B1B1B'));
sh.push(L('M' + f(x + 9 * s) + ' ' + f(yb - 9 * s) + 'l' + f(8 * s) + ' ' + f(3 * s), '#D8232A', 3 * s));
const g = G(sh, { filter: 'url(#sdShade)' });
const nose = G([S(circ(x + 26 * s, yb - 18.5 * s, 2.6 * s), '#FF2B3F')], { tw: '1; 0.55; 1', twDur: '1.8s', filter: 'url(#sdGlow)' });
return [g, nose];
};
front.push(man(px0 + (mobile ? 150 : 250)));
deer(px1 - (mobile ? 150 : 330)).forEach((g) => front.push(g));
let flake = '';
for (let i = 0; i < 6; i++) { const t = i * Math.PI / 3, c = Math.cos(t), sn = Math.sin(t); flake += 'M0 0L' + f(c * 7) + ' ' + f(sn * 7) + 'M' + f(c * 4.2) + ' ' + f(sn * 4.2) + 'l' + f(Math.cos(t + 0.9) * 2.4) + ' ' + f(Math.sin(t + 0.9) * 2.4) + 'M' + f(c * 4.2) + ' ' + f(sn * 4.2) + 'l' + f(Math.cos(t - 0.9) * 2.4) + ' ' + f(Math.sin(t - 0.9) * 2.4); }
fall(mobile ? 14 : 30, circ(0, 0, 2.6), ['#FFFFFF', '#EAF3FF'], { drift: 30, spin: false, min: 0.4, span: 1.4, dur: 10 });
fall(mobile ? 5 : 12, flake, ['#FFFFFF'], { drift: 30, stroke: true, min: 0.7, span: 0.8, dur: 12 });
}

if (season === 'newyear') {
const gold = ['#FFE08A', '#FFFFFF', '#FFC21A'], mix = ['#FF7A90', '#5EE6FF', '#FFE08A'];
const spots = mobile ? [[W - 34, pb + 52, 16], [W - 110, py * 0.5, 13], [W - 190, py * 0.5, 10]] : [[W * 0.93, pb + 70, 66], [W * 0.795, pb + 44, 36], [W * 0.055, pb + 62, 46], [W * 0.43, pb + 34, 26]];
spots.forEach(([x, y, R], i) => back.push(burst(x, y, R, i % 2 ? mix : gold, (i * 1.1).toFixed(1) + 's')));
fall(mobile ? 12 : 26, confetti, ['#FFD23F', '#FF7A90', '#5EE6FF', '#FFFFFF', '#B892FF'], { flip: true, drift: -30 });
}

// On mobile the hero text fills the width, so extras stay in the greeting strip (y < py) or right of the hero badge.
// National days (2/9, 30/4–1/5): waving national flags at both ends of the bar, red-and-star bunting
// between them, gold-and-red fireworks and falling stars; 30/4 adds white doves of peace.
if (season === 'quockhanh' || season === 'thongnhat') {
const gold = ['#FFE08A', '#FFFFFF', '#FFC21A'], fire = ['#FFDA2A', '#FF5A4A', '#FFFFFF'];
const fw = mobile ? 58 : 112, fh = mobile ? 38 : 74, len = mobile ? 96 : 170, fx1 = px1 - (mobile ? 18 : 34), fx0 = px0 + 34;
back.push(flag(fx1, pb - 6, len, fw, fh, -1, '3.2s'));
if (!mobile) back.push(flag(fx0, pb - 6, len - 30, fw * 0.82, fh * 0.82, 1, '3.6s'));
front.push(bunting(['#DA251D', '#DA251D', '#FFC21A'], true, mobile ? px0 + 20 : fx0 + fw * 0.82 + 24, fx1 - fw - (mobile ? 10 : 24)));
const spots = mobile ? [[W - 110, py * 0.5, 13], [W - 190, py * 0.5, 10]] : [[W * 0.36, pb + 72, 44], [W * 0.6, pb + 52, 34], [W * 0.48, pb + 130, 24], [W - 46, pb + 40, 30], [36, pb + 150, 28]];
spots.forEach(([x, y, R], i) => back.push(burst(x, y, R, i % 2 ? fire : gold, (i * 0.9).toFixed(1) + 's')));
if (season === 'thongnhat') {
(mobile ? [[W - 52, py * 0.5, 0.36, false]] : [[W * 0.7, pb + 92, 0.85, false], [W * 0.78, pb + 54, 0.62, false], [W * 0.24, pb + 110, 0.7, true]]).forEach(([x, y, s, fl]) => back.push(dove(x, y, s, fl)));
}
fall(mobile ? 8 : 18, star(0, 0, 6, 0.42, 5), ['#FFDA2A', '#FFE98A', '#FFFFFF'], { drift: -20, flip: true, dur: 11 });
}

if (season === 'hungvuong') {
const drum = (cx, cy, R, op) => {
const sh = [];
[1, 0.86, 0.8, 0.62, 0.56, 0.4].forEach((q, i) => sh.push(L(circ(cx, cy, R * q), '#F2C46A', i % 2 ? 0.9 : 1.8, 0.85)));
sh.push(S(star(cx, cy, R * 0.38, 0.36, 14), 'url(#sdGold)'));
sh.push(S(circ(cx, cy, R * 0.07), '#7A3A08'));
for (let i = 0; i < 36; i++) { const t = i * Math.PI / 18; sh.push(S(circ(cx + Math.cos(t) * R * 0.71, cy + Math.sin(t) * R * 0.71, R * 0.022), '#F2C46A')); }
for (let i = 0; i < 18; i++) { const t = i * Math.PI / 9; sh.push(S(star(cx + Math.cos(t) * R * 0.93, cy + Math.sin(t) * R * 0.93, R * 0.045, 0.45, 4), '#F2C46A')); }
for (let i = 0; i < 12; i++) { const t = i * Math.PI / 6; sh.push(L('M' + f(cx + Math.cos(t) * R * 0.44) + ' ' + f(cy + Math.sin(t) * R * 0.44) + 'L' + f(cx + Math.cos(t + 0.2) * R * 0.54) + ' ' + f(cy + Math.sin(t + 0.2) * R * 0.54), '#F2C46A', 1.4, 0.8)); }
return G(sh, { sway: swing(8, cx, cy), dur: '26s', tw: op + '; ' + op, filter: 'none' });
};
back.push(drum(W - 150 * k, pb + 70 * k, 170 * k, 0.55));
if (!mobile) back.push(drum(60, pb + 150, 96, 0.28));
// five-colour festival flags (cờ ngũ sắc) along the bar and Lạc birds circling the drum
front.push(bunting(['#DA251D', '#FFC21A', '#2E9E4F', '#1F6FD1', '#FFFFFF'], false));
(mobile ? [[W - 120, py * 0.5, 0.4]] : [[W - 420, pb + 70, 0.85], [W - 330, pb + 190, 0.65], [W * 0.3, pb + 60, 0.6]]).forEach(([x, y, s], i) => back.push(lacBird(x, y, s, (1.3 + i * 0.2).toFixed(1) + 's')));
fall(mobile ? 8 : 18, circ(0, 0, 2), ['#FFE08A', '#F2C46A'], { drift: -20, spin: false, dur: 13 });
}

if (season === 'thieunhi') {
const cols = ['#FF5D73', '#FFC857', '#5EE6FF', '#7BE495', '#B892FF', '#FF9F5A'];
const balloon = (x, y, R, c, len) => {
const sh = [];
sh.push(L('M' + f(x) + ' ' + f(y + R * 1.2) + 'q' + f(6) + ' ' + f(len * 0.5) + ' ' + f(-2) + ' ' + f(len), 'rgba(255,255,255,0.65)', 1.1));
sh.push(S(circ(x, y, R, R * 1.18), c));
sh.push(S(circ(x + R * 0.18, y + R * 0.2, R * 0.86, R * 1), '#000030', { op: 0.1 }));
sh.push(S(circ(x - R * 0.34, y - R * 0.42, R * 0.2, R * 0.34), '#FFFFFF', { op: 0.55, tf: 'rotate(-24 ' + f(x - R * 0.34) + ' ' + f(y - R * 0.42) + ')' }));
sh.push(S('M' + f(x) + ' ' + f(y + R * 1.16) + 'l' + f(-3.2) + ' ' + f(5) + 'h6.4z', c));
return G(sh, { sway: swing(3.5, x, y + R * 1.2 + len), dur: (4 + r() * 2.5).toFixed(1) + 's', filter: 'url(#sdShade)' });
};
const set = mobile ? [[W - 30, pb + 44, 15], [W - 62, pb + 16, 11]] : [[W - 70, pb + 74, 30], [W - 132, pb + 46, 24], [W - 186, pb + 92, 19], [W - 28, pb + 30, 20], [56, pb + 70, 26], [112, pb + 40, 19], [22, pb + 28, 17]];
set.forEach(([x, y, R], i) => back.push(balloon(x, y, R, cols[i % cols.length], 60 + R)));
fall(mobile ? 12 : 26, confetti, cols, { flip: true, drift: -30 });
}

if (season === 'trungthu') {
const mx = W - 150 * k, my = pb + 92 * k, mr = 62 * k;
back.push(G([S(circ(mx, my, mr * 1.9), '#FFD86B', { op: 0.3 })], { filter: 'url(#sdSoft)', tw: '1; 0.7; 1', twDur: '6s' }));
back.push(G([S(circ(mx, my, mr), 'url(#sdMoon)'), S(circ(mx - mr * 0.3, my - mr * 0.2, mr * 0.16), '#C98A12', { op: 0.18 }), S(circ(mx + mr * 0.25, my + mr * 0.3, mr * 0.22), '#C98A12', { op: 0.14 }), S(circ(mx + mr * 0.32, my - mr * 0.42, mr * 0.1), '#C98A12', { op: 0.16 })]));
const cloud = (x, y, s2, op) => S(circ(x, y, 34 * s2, 13 * s2) + circ(x + 30 * s2, y - 7 * s2, 26 * s2, 15 * s2) + circ(x + 62 * s2, y + 1, 30 * s2, 11 * s2), '#FFFFFF', { op });
back.push(G([cloud(mx - mr * 1.9, my + mr * 0.62, k, 0.2), cloud(mx - mr * 0.2, my + mr * 0.95, k * 0.8, 0.14)], { filter: 'url(#sdBlur)' }));
const sparkle = 'M0 -7Q0.8 -0.8 7 0Q0.8 0.8 0 7Q-0.8 0.8 -7 0Q-0.8 -0.8 0 -7z';
for (let i = 0; i < (mobile ? 8 : 18); i++) back.push(G([S(sparkle, '#FFF3C4', { tf: 'translate(' + f(r() * W) + ' ' + f(pb + 16 + r() * 150) + ') scale(' + f(0.4 + r() * 0.8) + ')' })], { tw: '0.2; 1; 0.2', twDur: (2 + r() * 3).toFixed(1) + 's', begin: (r() * 3).toFixed(1) + 's' }));
const starLamp = (x, len, R) => {
const cy = pb + len + R, sh = [];
sh.push(L('M' + f(x) + ' ' + f(pb - 2) + 'V' + f(cy - R), '#F2C46A', 1.2));
sh.push(L(circ(x, cy, R), '#F2B01E', 2.2));
sh.push(S(star(x, cy, R * 0.98, 0.4, 5), 'url(#sdRed)', { stroke: '#FFD23F', sw: 1.4 }));
sh.push(S(circ(x, cy, R * 0.2), '#FFE98A'));
sh.push(L('M' + f(x) + ' ' + f(cy + R) + 'v' + f(R * 0.9) + 'M' + f(x - 3) + ' ' + f(cy + R) + 'v' + f(R * 0.6) + 'M' + f(x + 3) + ' ' + f(cy + R) + 'v' + f(R * 0.6), '#F2B01E', 1.3));
return G(sh, { sway: swing(6, x, pb - 2), dur: (3.4 + r() * 1.8).toFixed(1) + 's', filter: 'url(#sdGlow)' });
};
(mobile ? [[W - 150, 16, 15], [36, 10, 12]] : [[W - 360, 22, 22], [W - 470, 10, 16], [64, 26, 19]]).forEach(([x, len, R]) => front.push(starLamp(x, len, R)));
}

return { back, front, fallers, ox, vb: '0 0 ' + f(SW) + ' ' + Hh, decorH: Hh + 'px' };
}


const DEFS = '<defs><linearGradient id="sdBark" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8A5A2E"/><stop offset="1" stop-color="#3A2110"/></linearGradient><radialGradient id="sdMai" cx="50%" cy="100%" r="105%"><stop offset="0" stop-color="#F08A1C"/><stop offset="0.4" stop-color="#FFCF33"/><stop offset="1" stop-color="#FFF3B0"/></radialGradient><radialGradient id="sdDao" cx="50%" cy="100%" r="105%"><stop offset="0" stop-color="#E0336B"/><stop offset="0.45" stop-color="#FF8FB1"/><stop offset="1" stop-color="#FFE3EC"/></radialGradient><radialGradient id="sdRed" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="#FF8A70"/><stop offset="0.45" stop-color="#DE2A2A"/><stop offset="1" stop-color="#8E0F15"/></radialGradient><linearGradient id="sdGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF0B0"/><stop offset="0.5" stop-color="#F2B01E"/><stop offset="1" stop-color="#B97A0A"/></linearGradient><linearGradient id="sdSnow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#CFE3F7"/></linearGradient><radialGradient id="sdBall" cx="35%" cy="28%" r="80%"><stop offset="0" stop-color="#FFFFFF"/><stop offset="0.6" stop-color="#EAF3FC"/><stop offset="1" stop-color="#B4CDE8"/></radialGradient><radialGradient id="sdFur" cx="40%" cy="30%" r="80%"><stop offset="0" stop-color="#C98B4E"/><stop offset="1" stop-color="#7A4A22"/></radialGradient><radialGradient id="sdMoon" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="#FFFBE0"/><stop offset="0.55" stop-color="#FFD96B"/><stop offset="1" stop-color="#EFA21A"/></radialGradient><linearGradient id="sdFlag" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F0342A"/><stop offset="0.55" stop-color="#DA251D"/><stop offset="1" stop-color="#A8140F"/></linearGradient><linearGradient id="sdLeaf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8FCB5A"/><stop offset="1" stop-color="#2F7A3A"/></linearGradient><filter id="sdBlur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.8"/></filter><filter id="sdSoft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter><filter id="sdGlow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="2.6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><filter id="sdShade" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000018" flood-opacity="0.35"/></filter></defs>';
const SPL = 'calcMode="spline" keyTimes="0; 0.5; 1" keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"';

const shape = (s) => '<path d="' + s.d + '" fill="' + s.fill + '" stroke="' + s.stroke + '" stroke-width="' + s.sw + '" opacity="' + s.op + '" transform="' + s.tf + '">' + (s.dv ? '<animate attributeName="d" values="' + s.dv + '" dur="' + s.dDur + '" repeatCount="indefinite"/>' : '') + '</path>';
const group = (g) => '<g filter="' + g.filter + '"><animateTransform attributeName="transform" type="rotate" values="' + g.sway + '" dur="' + g.dur + '" begin="' + g.begin + '" repeatCount="indefinite" ' + SPL + '/><animate attributeName="opacity" values="' + g.tw + '" dur="' + g.twDur + '" begin="' + g.begin + '" repeatCount="indefinite"/>' + g.shapes.map(shape).join('') + '</g>';
const faller = (p) => '<g filter="' + p.filter + '"><animateTransform attributeName="transform" type="translate" values="' + p.path + '" dur="' + p.dur + '" begin="' + p.begin + '" repeatCount="indefinite"/><animate attributeName="opacity" values="' + p.fade + '" keyTimes="0; 0.12; 0.78; 1" dur="' + p.dur + '" begin="' + p.begin + '" repeatCount="indefinite"/><g><animateTransform attributeName="transform" type="translate" values="' + p.swayX + '" dur="' + p.swayDur + '" repeatCount="indefinite" ' + SPL + '/><g><animateTransform attributeName="transform" type="rotate" values="' + p.spin + '" dur="' + p.spinDur + '" repeatCount="indefinite"/><g><animateTransform attributeName="transform" type="scale" values="' + p.flip + '" dur="' + p.flipDur + '" repeatCount="indefinite" ' + SPL + '/><path d="' + p.d + '" fill="' + p.fill + '" stroke="' + p.stroke + '" stroke-width="' + p.sw + '" transform="' + p.tf + '"/></g></g></g></g>';

// Returns { back, front, height }: two SVG documents (behind and in front of the menu bar) and their pixel height.
export function decorSvg(season, mobile, box) {
  const d = decor(season, mobile, box);
  // viewBox = the element's own pixel size, so nothing is scaled.
  const open = (defs) => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + d.vb + '" preserveAspectRatio="xMinYMin meet" aria-hidden="true" focusable="false" style="stroke-linecap:round;stroke-linejoin:round;overflow:visible">' + defs + '<g transform="translate(' + Math.round(d.ox * 10) / 10 + ' 0)">';
  return {
    back: open(DEFS) + d.back.map(group).join('') + '</g></svg>',
    front: open('') + d.front.map(group).join('') + d.fallers.map(faller).join('') + '</g></svg>',
    height: d.decorH,
  };
}
