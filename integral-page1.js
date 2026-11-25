(() => {
'use strict';
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const NS = 'http://www.w3.org/2000/svg';
const C = {ink: '#1b2733', mu: '#8a97a4', b: '#0f5f8c', bl: '#cfe5f2', w: '#b45309', h: '#6d28d9', g: '#0e7a55', r: '#c81e2d'};
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const el = (tag, at, p) => { const e = document.createElementNS(NS, tag); for (const k in at) e.setAttribute(k, at[k]); if (p) p.appendChild(e); return e; };
const set = (e, at) => { for (const k in at) e.setAttribute(k, at[k]); };
const K = (tex, node, display) => katex.render(tex, node, {displayMode: !!display, throwOnError: false});
const ks = tex => katex.renderToString(tex, {throwOnError: false});
const lerp = (a, b, t) => a + (b - a) * t;
const fx = (v, d = 2) => v.toFixed(d);
const num = v => String(+v.toFixed(2));
const KW = s => `\\textcolor{#b45309}{${s}}`, KH = s => `\\textcolor{#6d28d9}{${s}}`;

// 動畫一律走 Motion：預設 spring，給 ease 時改用 tween；完成時保證停在 1
function tween(cb, opt = {}) {
  const done = () => { cb(1); if (opt.onComplete) opt.onComplete(); };
  if (reduce) { done(); return {stop() {}}; }
  return Motion.animate(0, 1, {
    ...(opt.ease ? {duration: opt.duration || .7, ease: opt.ease} : {type: 'spring', duration: opt.duration || .8, bounce: opt.bounce ?? .25}),
    delay: opt.delay || 0, onUpdate: cb, onComplete: done});
}
const wait = s => new Promise(r => setTimeout(r, reduce ? 0 : s * 1000));
const play = (cb, opt) => new Promise(r => tween(cb, {...opt, onComplete: r}));

// SVG 數學文字：字母斜體，x_{1} 為下標
function mt(p, x, y, s, at = {}) {
  const t = el('text', {x, y, class: 'm', 'text-anchor': 'middle', ...at}, p);
  let back = 0;
  for (const m of s.matchAll(/_\{([^}]*)\}|([A-Za-z]+)|([^A-Za-z_]+)/g)) {
    const a = {class: m[1] !== undefined ? 's' : m[2] ? 'i' : ''};
    const dy = m[1] !== undefined ? 4 : back; back = m[1] !== undefined ? -4 : 0;
    if (dy) a.dy = dy;
    el('tspan', a, t).textContent = m[1] ?? m[2] ?? m[3];
  }
  return t;
}

// 共用函數：f 在 [1,7] 上，面積恰為 30
const A = 1, B = 7, AREA = 30;
const f = x => { const u = x - A; return u ** 3 / 6 - 1.625 * u * u + 4.5 * u + 2; };
const inAB = x => Math.min(B, Math.max(A, x));
const X = v => 14 + v * 40.5, Y = v => 205 - v * 25;
const xs = (a, b, k) => Array.from({length: k + 1}, (_, i) => a + (b - a) * i / k);
const poly = (pts, close) => pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(2) + ' ' + p[1].toFixed(2)).join('') + (close ? 'Z' : '');
const curvePath = (a, b, g = f, k = 120) => poly(xs(a, b, k).map(x => [X(x), Y(g(x))]));
const areaPath = (a, b, g = f, k = 120) => poly([[X(a), Y(0)], ...xs(a, b, k).map(x => [X(x), Y(g(x))]), [X(b), Y(0)]], true);
function axis(s) {
  el('path', {d: `M6 ${Y(0)}H346`, stroke: C.ink, 'stroke-width': 1.6}, s);
  el('path', {d: `M346 ${Y(0) - 5}l9 5l-9 5z`, fill: C.ink}, s);
  mt(s, 350, Y(0) + 20, 'x');
}
function sides(s) {
  for (const v of [A, B]) el('path', {d: `M${X(v)} ${Y(0)}V${Y(f(v))}`, stroke: C.ink, 'stroke-width': 1.6, 'pointer-events': 'none'}, s);
}
const curve = s => el('path', {d: curvePath(A, B), fill: 'none', stroke: C.b, 'stroke-width': 3, 'stroke-linecap': 'round', 'pointer-events': 'none'}, s);

$$('[data-k]').forEach(e => K(e.dataset.k, e));
Motion.scroll(p => { $('#bar').style.transform = `scaleX(${p})`; });

// ── 暖身：割圓術
(() => {
  const s = $('#g0'), cx = 145, cy = 145, r = 125, Z = 12, fa = -Math.PI / 9, ix = 308, iy = 62, ir = 46;
  el('circle', {cx: ix, cy: iy, r: ir}, el('clipPath', {id: 'lens'}, el('defs', {}, s)));
  el('circle', {cx, cy, r, fill: '#f3b4ba'}, s);
  const p1 = el('path', {fill: C.bl, stroke: C.b, 'stroke-width': 1.5}, s);
  el('circle', {cx, cy, r, fill: 'none', stroke: C.ink, 'stroke-width': 1.6}, s);
  const px = cx + r * Math.cos(fa), py = cy + r * Math.sin(fa);
  el('path', {d: `M${px} ${py}L${ix - 20} ${iy + ir - 5}`, stroke: C.mu, 'stroke-dasharray': '3 3'}, s);
  el('circle', {cx: px, cy: py, r: 5, fill: 'none', stroke: C.mu}, s);
  const lens = el('g', {'clip-path': 'url(#lens)'}, s);
  el('circle', {cx: ix, cy: iy, r: ir, fill: '#fff'}, lens);
  const g = el('g', {transform: `translate(${ix - px * Z} ${iy - py * Z}) scale(${Z})`}, lens);
  el('circle', {cx, cy, r, fill: '#f3b4ba'}, g);
  const p2 = el('path', {fill: C.bl, stroke: C.b, 'stroke-width': .12}, g);
  el('circle', {cx, cy, r, fill: 'none', stroke: C.ink, 'stroke-width': .12}, g);
  el('circle', {cx: ix, cy: iy, r: ir, fill: 'none', stroke: C.mu, 'stroke-width': 2}, s);
  el('text', {x: ix, y: iy + ir + 19, 'text-anchor': 'middle'}, s).textContent = '放大 12 倍';
  let n = 6, an, run = 0;
  const draw = (m, t) => { // 奇數頂點由弦中點長到圓上
    const q = Math.cos(Math.PI * 2 / m);
    const d = poly(Array.from({length: m}, (_, i) => { const k = i % 2 ? lerp(q, 1, t) : 1, a = Math.PI * 2 * i / m; return [cx + r * k * Math.cos(a), cy + r * k * Math.sin(a)]; }), true);
    p1.setAttribute('d', d); p2.setAttribute('d', d);
  };
  const area = m => m / 2 * Math.sin(Math.PI * 2 / m);
  const say = {6: '半徑 1 的圓，面積是 π ≈ 3.1416。再切一次，紅色會變多還是變少？', 12: '每條邊的中點往外推到圓上，紅色一下少了很多。', 24: '用眼睛已經快看不到紅色，看放大鏡。', 48: '放大 12 倍，也只剩一條細線。', 96: '繼續割。', 192: '劉徽割到 192 邊，得到圓周率約 3.14。可是還差一點點：有限次永遠差一點，要割「無限」次才會完全相等。這就是<b>逼近</b>與<b>極限</b>的想法。'};
  const info = t => {
    const v = t < 1 ? lerp(area(n / 2), area(n), t) : area(n);
    $('#c-n').textContent = n; $('#c-a').textContent = fx(v, 4); $('#c-d').textContent = fx(Math.PI - v, 4);
  };
  const text = () => {
    $('#c-say').innerHTML = say[n];
    $$('#quote span').forEach((e, i) => e.classList.toggle('on', i === (n === 6 ? -1 : n < 48 ? 0 : n < 192 ? 1 : 2)));
    $('#c-cut').disabled = n >= 192;
  };
  $('#c-cut').onclick = () => {
    if (n >= 192) return;
    if (an) an.stop();
    const my = ++run; n *= 2; text();
    an = tween(t => { if (my === run) { draw(n, t); info(t); } }, {ease: 'easeOut', duration: .9});
  };
  $('#c-re').onclick = () => { if (an) an.stop(); run++; n = 6; draw(6, 1); info(1); text(); };
  draw(6, 1); info(1); text();
})();

// ── PART 1：四條邊與非負
(() => {
  const s = $('#g1'), clip = el('rect', {x: X(A), y: -80, width: 0, height: 480}, el('clipPath', {id: 'r1'}, el('defs', {}, s)));
  const gA = el('g', {'clip-path': 'url(#r1)'}, s);
  const pos = el('path', {fill: C.bl}, gA), neg = el('path', {fill: '#f3b4ba'}, gA);
  const R = mt(s, X(3.2), Y(2), 'R', {style: 'font-size:24px', opacity: 0});
  axis(s);
  const on = [0, 0, 0, 0], wide = {'stroke-width': 4, 'stroke-linecap': 'round', fill: 'none', opacity: 0};
  const L = [C.b, C.w, C.h, C.g].map(c => el('path', {stroke: c, ...wide}, s));
  L[1].setAttribute('d', `M${X(A)} ${Y(0)}H${X(B)}`);
  const LB = [mt(s, X(5.4), Y(6.2), 'y=f(x)', {opacity: 0}), mt(s, X(4), Y(0) + 22, 'y=0', {opacity: 0}), mt(s, X(A) - 25, Y(1), 'x=a', {opacity: 0}), mt(s, X(B) + 26, Y(1), 'x=b', {opacity: 0})];
  const shape = d => {
    const g = x => f(x) - d;
    L[0].setAttribute('d', curvePath(A, B, g));
    L[2].setAttribute('d', `M${X(A)} ${Y(0)}V${Y(g(A))}`); L[3].setAttribute('d', `M${X(B)} ${Y(0)}V${Y(g(B))}`);
    pos.setAttribute('d', areaPath(A, B, x => Math.max(0, g(x)))); neg.setAttribute('d', areaPath(A, B, x => Math.min(0, g(x))));
  };
  shape(0);
  const txt = ['上邊：函數圖形 y = f(x)。', '下邊：y = 0 就是 x 軸。', '左邊：鉛直線 x = a。', '右邊：鉛直線 x = b。'];
  $$('#edges button').forEach(b => b.onclick = () => {
    const k = +b.dataset.e; if (on[k]) return; on[k] = 1; b.classList.add('on');
    const p = L[k], len = p.getTotalLength(); set(p, {opacity: 1, 'stroke-dasharray': len, 'stroke-dashoffset': len});
    tween(t => { p.setAttribute('stroke-dashoffset', len * (1 - t)); LB[k].setAttribute('opacity', t); }, {ease: 'easeInOut', duration: .8, onComplete: () => { p.removeAttribute('stroke-dasharray'); p.removeAttribute('stroke-dashoffset'); }});
    $('#e-say').textContent = txt[k];
    if (on.every(Boolean)) wait(.9).then(() => {
      tween(t => { clip.setAttribute('width', (X(B) - X(A)) * t); R.setAttribute('opacity', t); }, {ease: 'easeInOut', duration: 1});
      $('#e-say').innerHTML = `圍出來了！這塊就是 ${ks('R')}。<b>上邊是彎的</b>，沒有公式可以直接套，所以要切。`;
      $('#neg').hidden = false;
    });
  });
  const D = $('#d');
  const upd = () => {
    const d = +D.value; shape(d);
    LB[0].setAttribute('y', Y(6.2 - d));
    if (d > 0) { R.setAttribute('opacity', d > 1.5 ? 0 : 1); } else if (on.every(Boolean) && !$('#neg').hidden) R.setAttribute('opacity', 1);
    if (!$('#neg').hidden) LB[1].setAttribute('opacity', d > 1.9 ? 0 : 1);
    $('#d-o').textContent = `下移 ${fx(d, 1)}`;
    $('#d-say').innerHTML = d <= 2 ? `${ks('f(x)\\ge 0')}：整塊都在 ${ks('x')} 軸上方，高就是 ${ks('f(x)')}。` : `<span class="cr">紅色部分在 ${ks('x')} 軸下方</span>，${ks('f(x)<0')}，「高 × 寬」會變成負的，不能當面積。所以課本先規定 ${ks('f(x)')} 非負。`;
  };
  D.oninput = upd; upd();
})();

// ＋／− 按鈕
$$('[data-for]').forEach(b => b.onclick = () => { const i = $('#' + b.dataset.for); i.value = +i.value + +b.dataset.d; i.dispatchEvent(new Event('input')); });

// ── PART 2：分割
(() => {
  const s = $('#g2');
  el('path', {d: areaPath(A, B), fill: C.bl}, s);
  const band = el('path', {fill: '#f7d9b0'}, s);
  const g = el('g', {}, s); axis(s); curve(s); sides(s);
  const lab = el('g', {}, s), dx = el('g', {}, s);
  let cur = [A, B], an, run = 0;
  const I = $('#n2');
  const draw = pts => {
    [g, lab, dx].forEach(e => { e.textContent = ''; });
    const n = pts.length - 1;
    pts.forEach((x, i) => {
      if (i && i < n) el('path', {d: `M${X(x)} ${Y(0)}V${Y(f(inAB(x)))}`, stroke: C.ink, 'stroke-width': 1.3}, g);
      el('circle', {cx: X(x), cy: Y(0), r: 3.5, fill: C.ink}, lab);
      if (n <= 7 || !i || i === n) mt(lab, X(x), Y(0) + 21, `x_{${i}}`);
    });
    mt(lab, X(A), Y(0) + 42, '=a'); mt(lab, X(B), Y(0) + 42, '=b');
    const p0 = X(pts[0]), p1 = X(pts[1]), y = Y(0) - 12;
    band.setAttribute('d', areaPath(pts[0], Math.max(pts[0] + .01, pts[1]), x => f(inAB(x)), 30));
    el('path', {d: `M${p0 + 2} ${y}H${Math.max(p0 + 2, p1 - 2)}M${p0 + 2} ${y - 5}v10M${Math.max(p0 + 2, p1 - 2)} ${y - 5}v10`, stroke: C.w, 'stroke-width': 2, fill: 'none'}, dx);
    mt(dx, (p0 + p1) / 2, y - 9, 'Δx', {style: `fill:${C.w}`});
  };
  const upd = () => {
    const n = +I.value; $('#n2-o').textContent = `n = ${n}`;
    const to = xs(A, B, n), m = cur.length - 1, from = to.map((_, j) => cur[Math.round(j * m / n)]);
    if (an) an.stop();
    const my = ++run; cur = from; draw(cur);
    an = tween(t => { if (my === run) { cur = to.map((v, j) => lerp(from[j], v, t)); draw(cur); } }, {duration: .6, bounce: .2});
    K(`${KW('\\Delta x')}=\\frac{b-a}{n}=\\frac{7-1}{${n}}${600 % n ? '\\approx' : '='}${num(6 / n)}`, $('#f2'), true);
    K(n === 1 ? 'a=x_0<x_1=b' : n <= 3 ? `a=${xs(0, n, n).map(i => `x_${i}`).join('<')}=b` : `a=x_0<x_1<x_2<\\cdots<x_{${n}}=b`, $('#f2b'));
    $('#n2-say').innerHTML = `切成 <b>${n}</b> 段，分割點有 <b>${n + 1}</b> 個（從 ${ks('x_0')} 數到 ${ks(`x_{${n}}`)}），每段一樣寬。`;
  };
  I.oninput = upd; upd();

  const q = $('#g2q'), QX = v => 40 + (v - 1) * 46;
  el('path', {d: 'M20 40H340', stroke: C.ink, 'stroke-width': 1.6}, q);
  for (let v = 1; v <= 7; v++) { el('circle', {cx: QX(v), cy: 40, r: 4, fill: C.ink}, q); mt(q, QX(v), 66, String(v)); }
  mt(q, QX(1) - 12, 26, 'a'); mt(q, QX(7) + 4, 26, 'b');
  const jump = el('path', {fill: 'none', stroke: C.w, 'stroke-width': 3}, q);
  for (let v = 2; v <= 6; v++) {
    const b = document.createElement('button'); b.textContent = v; $('#q2').appendChild(b);
    b.onclick = () => {
      const ok = v === 5, a = $('#q2a');
      $$('#q2 button').forEach(e => { e.className = ''; }); b.className = ok ? 'hit' : 'miss'; a.className = 'ans ' + (ok ? 'ok' : 'no');
      a.innerHTML = ok ? `對！${ks('\\Delta x=\\frac{7-1}{3}=2')}，從 ${ks('a=1')} 走兩步：${ks('x_2=1+2\\times2=5')}。<br>一般寫法：${ks('x_i=a+i\\,\\Delta x')}` : v === 3 ? `3 是 ${ks('x_1')}，只走了一步。${ks('x_2')} 要從 ${ks('a')} 走兩步。` : `先算一步多寬：${ks('\\Delta x=\\frac{7-1}{3}=2')}。再從 ${ks('a=1')} 出發走兩步。`;
      jump.setAttribute('d', '');
      if (ok) { jump.setAttribute('d', `M${QX(1)} 38Q${QX(2)} 6 ${QX(3)} 38Q${QX(4)} 6 ${QX(5)} 38`); const l = jump.getTotalLength(); jump.setAttribute('stroke-dasharray', l); tween(t => jump.setAttribute('stroke-dashoffset', l * (1 - t)), {ease: 'easeInOut', duration: 1.2}); }
    };
  }
})();

// ── PART 3：拖 t_i（PART 4 共用 T）
const N = 4, DX = (B - A) / N, T = [.2, .75, .5, .85];
const x0 = i => A + DX * i, tv = i => x0(i) + DX * T[i];
const PAL = ['#0f5f8c', '#2f86b5', '#5fa8cf', '#8cc4e2'];
let reset4 = () => {};
(() => {
  const s = $('#g3');
  el('path', {d: areaPath(A, B), fill: '#eef5fa'}, s);
  const it = Array.from({length: N}, () => ({
    rect: el('rect', {fill: C.bl, 'fill-opacity': .75, stroke: C.b}, s),
    over: el('path', {fill: '#e8828c', 'fill-opacity': .6}, s), under: el('path', {fill: '#5cc29a', 'fill-opacity': .6}, s)}));
  curve(s); axis(s); sides(s);
  for (let i = 0; i <= N; i++) { el('path', {d: `M${X(x0(i))} ${Y(0)}v6`, stroke: C.ink, 'stroke-width': 1.6}, s); mt(s, X(x0(i)), Y(0) + 50, `x_{${i}}`); }
  it.forEach((o, i) => {
    o.line = el('path', {stroke: C.h, 'stroke-width': 2, 'stroke-dasharray': '4 3'}, s);
    o.dot = el('circle', {r: 4.5, fill: C.h}, s);
    o.hd = el('g', {class: 'hd', tabindex: 0, role: 'slider', 'aria-label': `t${i + 1}`, 'aria-valuemin': x0(i), 'aria-valuemax': x0(i + 1)}, s);
    el('circle', {r: 24, fill: 'transparent', cy: 6}, o.hd);
    el('circle', {class: 'ring', r: 9, fill: C.h, stroke: '#fff', 'stroke-width': 2}, o.hd);
    mt(o.hd, 0, 28, `t_{${i + 1}}`, {style: `fill:${C.h}`});
  });
  let act = 1; const an = [];
  const draw = () => {
    it.forEach((o, i) => {
      const a = x0(i), b = x0(i + 1), t = tv(i), h = f(t), p = xs(a, b, 40), P = fn => p.map(x => [X(x), Y(fn(x))]);
      set(o.rect, {x: X(a), y: Y(h), width: X(b) - X(a), height: Y(0) - Y(h), 'stroke-width': i === act ? 2.6 : 1.2});
      o.over.setAttribute('d', poly([...P(x => Math.max(h, f(x))), ...P(f).reverse()], true));
      o.under.setAttribute('d', poly([...P(x => Math.min(h, f(x))), ...P(f).reverse()], true));
      o.line.setAttribute('d', `M${X(t)} ${Y(0)}V${Y(h)}`); set(o.dot, {cx: X(t), cy: Y(h)});
      o.hd.setAttribute('transform', `translate(${X(t)} ${Y(0)})`); o.hd.setAttribute('aria-valuenow', fx(t));
    });
    const h = f(tv(act));
    K(`${KH(`f(t_${act + 1})`)}\\cdot${KW('\\Delta x')}\\approx${KH(fx(h))}\\times${KW(num(DX))}\\approx${fx(h * DX)}`, $('#f3'), true);
  };
  const mark = m => $$('#t3 button').forEach(b => b.classList.toggle('on', b.dataset.m === m));
  const local = e => (new DOMPoint(e.clientX, e.clientY).matrixTransform(s.getScreenCTM().inverse()).x - 14) / 40.5;
  const stopAll = () => an.forEach(a => a && a.stop());
  const put = (i, v) => { T[i] = Math.min(1, Math.max(0, v)); act = i; mark(''); reset4(); draw(); };
  it.forEach((o, i) => {
    let drag = false, off = 0;
    o.hd.addEventListener('pointerdown', e => { stopAll(); drag = true; off = tv(i) - local(e); o.hd.setPointerCapture(e.pointerId); act = i; draw(); });
    o.hd.addEventListener('pointermove', e => { if (drag) put(i, (local(e) + off - x0(i)) / DX); });
    const end = () => { drag = false; }; o.hd.addEventListener('pointerup', end); o.hd.addEventListener('pointercancel', end);
    o.hd.addEventListener('keydown', e => { const d = {ArrowLeft: -.05, ArrowRight: .05}[e.key]; if (d) { e.preventDefault(); stopAll(); put(i, T[i] + d); } });
  });
  $$('#t3 button').forEach(b => b.onclick = () => {
    const m = b.dataset.m; mark(m); stopAll(); reset4();
    it.forEach((_, i) => {
      const a = T[i], z = {l: 0, m: .5, r: 1}[m] ?? Math.random();
      an[i] = tween(t => { T[i] = Math.min(1, Math.max(0, lerp(a, z, t))); draw(); }, {delay: i * .08, duration: .7, bounce: .3, onComplete: () => reset4()});
    });
  });
  draw();
})();

// ── PART 4：加總
(() => {
  const s = $('#g4'), BX = v => 14 + v * 8, by = 242, bh = 26;
  el('path', {d: areaPath(A, B), fill: '#eef5fa'}, s);
  const ghost = el('g', {}, s); curve(s); axis(s); sides(s);
  const hi = el('g', {}, s);
  el('rect', {x: BX(0), y: by, width: 328, height: bh, fill: '#f3f1ea', rx: 4}, s);
  const fly = el('g', {}, s);
  el('path', {d: `M${BX(AREA)} ${by - 8}V${by + bh + 6}`, stroke: C.g, 'stroke-width': 2.5, 'stroke-dasharray': '4 3'}, s);
  el('text', {x: BX(AREA), y: by + bh + 24, 'text-anchor': 'middle', style: `fill:${C.g};font-weight:700`}, s).textContent = '真正面積 30';
  let run = 0;
  const geo = i => ({x: X(x0(i)), y: Y(f(tv(i))), w: X(x0(i + 1)) - X(x0(i)), h: Y(0) - Y(f(tv(i)))});
  const base = () => {
    [ghost, hi, fly].forEach(g => { g.textContent = ''; });
    for (let i = 0; i < N; i++) { const g = geo(i); el('rect', {x: g.x, y: g.y, width: g.w, height: g.h, fill: PAL[i], 'fill-opacity': .3, stroke: C.b, 'stroke-width': 1.2}, ghost); }
  };
  reset4 = () => { run++; base(); $('#terms').textContent = ''; $('#sig').hidden = true; const b = $('#p4'); b.disabled = false; b.textContent = '▶ 開始加'; };
  $('#p4').onclick = async () => {
    reset4(); const my = run, b = $('#p4'); b.disabled = true; let sum = 0;
    for (let i = 0; i < N; i++) {
      const g = geo(i), v = f(tv(i)) * DX, z = {x: BX(sum), y: by, w: v * 8, h: bh};
      const r = el('rect', {fill: PAL[i], stroke: '#fff', 'stroke-width': 1}, fly);
      const row = document.createElement('div'); row.style.setProperty('--c', PAL[i]); $('#terms').appendChild(row);
      K(`${KH(`f(t_${i + 1})`)}\\cdot${KW('\\Delta x')}\\approx${KH(fx(f(tv(i))))}\\times${KW(num(DX))}\\approx${fx(v)}`, row);
      if (!reduce) Motion.animate(row, {opacity: [0, 1], x: [-14, 0]}, {duration: .35});
      const at = t => set(r, {x: lerp(g.x, z.x, t), y: lerp(g.y, z.y, t), width: Math.max(0, lerp(g.w, z.w, t)), height: Math.max(0, lerp(g.h, z.h, t))});
      at(0); await wait(.35); if (my !== run) return;
      await play(at, {duration: .9, bounce: .12}); if (my !== run) return;
      sum += v;
    }
    const tot = document.createElement('div'), e = Math.abs(sum - AREA); tot.style.setProperty('--c', C.g);
    tot.innerHTML = `<b>全部加起來 ≈ ${fx(sum)}</b>，真正面積 30，${e < .05 ? '非常接近。' : `${sum > AREA ? '多' : '少'}了約 ${fx(e)}。`}`; $('#terms').appendChild(tot);
    await wait(.4); if (my !== run) return;
    b.disabled = false; b.textContent = '↻ 再看一次';
    $('#sig').hidden = false;
    if (!reduce) Motion.animate($('#f4'), {opacity: [0, 1], scale: [.85, 1]}, {type: 'spring', bounce: .35, duration: .8});
    pick(PARTS[0]);
  };
  const formula = k => {
    const o = (id, t) => k === id ? `\\boxed{${t}}` : t;
    K(`\\begin{aligned}&f(t_1)\\Delta x+f(t_2)\\Delta x\\\\&\\ +f(t_3)\\Delta x+f(t_4)\\Delta x\\\\[8pt]=\\ &${k === 'S' ? '\\textcolor{#0e7a55}{\\sum}' : '\\sum'}_{${o('i', 'i=1')}}^{${o('n', '4')}}${o('f', KH('f(t_i)'))}\\cdot${o('d', KW('\\Delta x'))}\\end{aligned}`, $('#f4'), true);
  };
  const box = (i, at) => { const g = geo(i); return el('rect', {x: g.x, y: g.y, width: g.w, height: g.h, fill: 'none', stroke: C.r, 'stroke-width': 4, ...at}, hi); };
  const each = fn => { for (let i = 0; i < N; i++) fn(i, geo(i)); };
  const PARTS = [
    {k: 'S', t: '\\Sigma', s: `${ks('\\Sigma')}：把後面那一項，<b>一個一個全部加起來</b>。`, d: () => each(i => { const b = box(i, {stroke: C.g, opacity: 0}); tween(t => b.setAttribute('opacity', t), {ease: 'easeOut', duration: .3, delay: i * .25}); })},
    {k: 'i', t: 'i=1', s: `${ks('i=1')}：從<b>第 1 個</b>矩形開始加。`, d: () => box(0)},
    {k: 'n', t: 'n', s: `上面的 ${ks('n')}：加到<b>第 ${ks('n')} 個</b>為止，這裡 ${ks('n=4')}。`, d: () => box(N - 1)},
    {k: 'f', t: 'f(t_i)', s: `${ks('f(t_i)')}：第 ${ks('i')} 個矩形的<b class="ch">高</b>，每個可能不同。`, d: () => each((i, g) => { const p = el('path', {stroke: C.h, 'stroke-width': 4, 'stroke-linecap': 'round'}, hi), x = X(tv(i)); tween(t => p.setAttribute('d', `M${x} ${Y(0)}V${Y(0) - g.h * t}`), {delay: i * .12}); })},
    {k: 'd', t: '\\Delta x', s: `${ks('\\Delta x')}：每個矩形的<b class="cw">寬</b>。因為等分，所以全都一樣。`, d: () => each((i, g) => { const p = el('path', {stroke: C.w, 'stroke-width': 6}, hi); tween(t => p.setAttribute('d', `M${g.x + 3} ${Y(0)}h${Math.max(0, (g.w - 6) * t)}`), {delay: i * .12}); })}];
  const pick = p => { hi.textContent = ''; formula(p.k); p.d(); $('#p-say').innerHTML = p.s; $$('#parts button').forEach(b => b.classList.toggle('on', b.dataset.p === p.k)); };
  PARTS.forEach(p => { const b = document.createElement('button'); b.dataset.p = p.k; K(p.t, b); b.onclick = () => pick(p); $('#parts').appendChild(b); });
  base();
})();

// ── PART 5：越切越細
(() => {
  const s = $('#g5'), g = el('g', {}, s); curve(s); axis(s); sides(s);
  mt(s, X(A), Y(0) + 22, 'a'); mt(s, X(B), Y(0) + 22, 'b');
  const h = $('#h5'), HX = n => 46 + Math.log2(n) / Math.log2(100) * 285, HY = v => 70 - (v - 30) * 3.5;
  el('path', {d: 'M40 6V142H345', stroke: C.mu, fill: 'none'}, h);
  el('path', {d: `M40 ${HY(30)}H345`, stroke: C.g, 'stroke-width': 2, 'stroke-dasharray': '5 4'}, h);
  mt(h, 22, HY(30) + 6, '30', {style: `fill:${C.g}`});
  [1, 4, 16, 64].forEach(n => { el('path', {d: `M${HX(n)} 142v5`, stroke: C.mu}, h); mt(h, HX(n), 163, String(n)); });
  mt(h, 350, 163, 'n');
  const dots = el('g', {}, h), I = $('#n5');
  const rnd = (i, n) => { const v = Math.sin(i * 127.1 + n * 311.7 + 7.3) * 43758.5453; return v - Math.floor(v); };
  let mode = 'x', cur = [], an, run = 0, auto = 0;
  const heights = n => { const d = (B - A) / n; return Array.from({length: n}, (_, i) => f(A + d * (i + ({l: 0, m: .5, r: 1}[mode] ?? rnd(i, n))))); };
  const draw = hs => {
    const n = hs.length, w = (X(B) - X(A)) / n;
    while (g.childNodes.length > n) g.lastChild.remove();
    while (g.childNodes.length < n) el('rect', {fill: C.bl, stroke: C.b}, g);
    hs.forEach((v, i) => set(g.childNodes[i], {x: X(A) + w * i, y: Y(v), width: w, height: Math.max(0, Y(0) - Y(v)), 'stroke-width': n > 40 ? .5 : 1.2}));
  };
  const upd = () => {
    const n = +I.value, to = heights(n), m = cur.length, from = to.map((v, j) => m ? cur[Math.min(m - 1, Math.floor((j + .5) * m / n))] : 0);
    const S = to.reduce((a, b) => a + b, 0) * (B - A) / n;
    $('#n5-o').textContent = `n = ${n}`; $('#s5').textContent = fx(S); $('#e5').textContent = fx(Math.abs(S - AREA));
    if (an) an.stop();
    const my = ++run; cur = from; draw(cur);
    an = tween(t => { if (my === run) { cur = to.map((v, j) => lerp(from[j], v, t)); draw(cur); } }, {duration: .6, bounce: .2});
    const c = el('circle', {cx: HX(n), cy: HY(S), r: 4.5, fill: C.b, 'fill-opacity': .75}, dots);
    tween(t => c.setAttribute('r', Math.max(0, 4.5 * t)), {bounce: .5});
    while (dots.childNodes.length > 150) dots.firstChild.remove();
  };
  I.oninput = () => { auto++; upd(); };
  $$('#t5 button').forEach(b => b.onclick = () => { auto++; mode = b.dataset.m; $$('#t5 button').forEach(e => e.classList.toggle('on', e === b)); upd(); });
  $('#p5').onclick = async () => {
    const my = ++auto;
    for (const n of [1, 2, 4, 8, 16, 32, 64]) { if (my !== auto) return; I.value = n; upd(); await wait(1); }
  };
  upd();
})();

// ── 定義
K(`\\sum_{i=1}^{n}${KH('f(t_i)')}\\cdot${KW('\\Delta x')}`, $('#f6'), true);

// ── 小測
(() => {
  const Q = [
    {t: '1. [2,10] 等分 4 段的 Δx', q: `把 ${ks('[2,10]')} 等分成 4 段，${ks('\\Delta x')} 是多少？`, o: ['2', '2.5', '8'], a: 0,
      w: `${ks('\\Delta x=\\frac{b-a}{n}=\\frac{10-2}{4}=2')}`, h: `${ks('b-a')} 是全長，還要除以段數 ${ks('n')}。`},
    {t: '2. 分割點個數', q: '承上題，分割點一共有幾個？', o: ['3', '4', '5'], a: 2,
      w: `2、4、6、8、10，共 5 個。${ks('n')} 段有 ${ks('n+1')} 個分割點，因為從 ${ks('x_0')} 開始數。`, h: '把 2 到 10 的分割點一個一個寫出來數，頭尾都要算。'},
    {t: '3. 矩形的高', q: `第 ${ks('i')} 個矩形的「高」是哪一個？`, o: [ks('t_i'), ks('f(t_i)'), ks('\\Delta x')], plain: ['t_i', 'f(t_i)', 'Δx'], a: 1,
      w: `${ks('t_i')} 是 ${ks('x')} 軸上的位置，代進 ${ks('f')} 才是高。${ks('\\Delta x')} 是寬。`, h: `回 PART 3 看：紫色虛線從 ${ks('t_i')} 往上，碰到曲線才停。那個高度怎麼寫？`},
    {t: '4. t_i 一定取中點嗎', q: `${ks('t_i')} 一定要取中點嗎？`, o: ['一定要', '不用，段內任取'], a: 1,
      w: `課本寫「任取 ${ks('t_i')}」，只要在 ${ks('[x_{i-1},x_i]')} 裡面就可以。`, h: '回 PART 3 拖拖看，圓點可以停在哪些地方？'},
    {t: '5. x² 在 [0,2]、n=2、右端的黎曼和', q: `${ks('f(x)=x^2')}，把 ${ks('[0,2]')} 等分 2 段，${ks('t_i')} 都取<b>右端</b>，黎曼和是多少？`, o: ['1', '2.5', '5'], a: 2,
      w: `${ks('\\Delta x=1')}，${ks('t_1=1,\\ t_2=2')}，<br>所以 ${ks('1^2\\times1+2^2\\times1=5')}。<br>取左端會得到 1，取中點會得到 2.5。三個都是黎曼和，只是 ${ks('t_i')} 不同。`, h: `先算 ${ks('\\Delta x')}，再找兩段的右端點，分別代進 ${ks('x^2')}。`}];
  const KEY = 'gsat-math-integral-page1'; let st = {};
  try { st = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { /* 無痕模式 */ }
  const pk = st.pick || {}; // 每題依序記錄點過的選項
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify({pick: pk, own: $('#own').value})); } catch (e) { /* 無痕模式 */ } };
  Q.forEach((q, k) => {
    const d = document.createElement('div'); d.className = 'q';
    d.innerHTML = `<div><b>${k + 1}.</b> ${q.q}</div><div class="seg">${q.o.map(o => `<button>${o}</button>`).join('')}</div><div class="ans" aria-live="polite"></div>`;
    $('#quiz').appendChild(d);
    const bs = [...d.querySelectorAll('button')], an = d.querySelector('.ans');
    const show = i => { const ok = i === q.a; bs.forEach((b, j) => { b.className = j === i ? (ok ? 'hit' : 'miss') : ''; }); an.className = 'ans ' + (ok ? 'ok' : 'no'); an.innerHTML = ok ? '對！' + q.w : '再想想：' + q.h; };
    bs.forEach((b, i) => b.onclick = () => { const L = pk[k] || (pk[k] = []); if (L[L.length - 1] !== i) L.push(i); save(); show(i); if (!reduce) Motion.animate(an, {opacity: [0, 1], y: [-6, 0]}, {duration: .3}); });
    if (pk[k] && pk[k].length) show(pk[k][pk[k].length - 1]);
  });
  $('#own').value = st.own || ''; $('#own').oninput = save;
  $('#copy').onclick = async () => {
    const lines = Q.map((q, k) => { const L = pk[k] || []; return `${q.t}：${L.length ? L.map(i => (q.plain || q.o)[i] + (i === q.a ? ' ✓' : ' ✗')).join(' → ') : '未作答'}`; });
    const text = `【積分page1教學】\n${lines.join('\n')}\n我的說明：${$('#own').value.trim() || '（未寫）'}`;
    let ok = false;
    try { await navigator.clipboard.writeText(text); ok = true; } catch (e) {
      const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); try { ok = document.execCommand('copy'); } catch (e2) { ok = false; } t.remove();
    }
    $('#msg').textContent = ok ? '已複製，貼到 LINE 就可以傳回。' : '這個瀏覽器不能自動複製，請改用截圖傳回。';
  };
})();
})();
