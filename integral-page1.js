(() => {
'use strict';

// ── 先聊聊 1：像素圓
(() => {
  const s = $('#gp'), cx = 180, cy = 118, R = 104, I = $('#px');
  const p = el('path', {fill: C.b, stroke: '#fff'}, s);
  const ring = el('circle', {cx, cy, r: R, fill: 'none', stroke: '#f5a524', 'stroke-width': 2, 'stroke-dasharray': '5 4'}, s);
  let an, run = 0, auto = 0;
  const draw = (n, t) => { // 中心點落在圓內的格子才塗色；t 讓格子由小彈到滿
    const w = 2 * R / n, k = w * Math.max(0, t), o = (w - k) / 2; let d = '';
    if (n >= 48) for (let j = 0; j < n; j++) { // 格子很細時整列合併畫，省效能
      const y = cy - R + w * j, m = Math.floor(Math.sqrt(R * R - (y + w / 2 - cy) ** 2) / w + .5) * w; d += `M${fx(cx - m)} ${fx(y)}h${fx(2 * m)}v${fx(w + .05)}h${fx(-2 * m)}z`;
    } else for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const x = cx - R + w * i, y = cy - R + w * j;
      if (Math.hypot(x + w / 2 - cx, y + w / 2 - cy) <= R) d += `M${fx(x + o)} ${fx(y + o)}h${fx(k)}v${fx(k)}h${fx(-k)}z`;
    }
    p.setAttribute('d', d); p.setAttribute('stroke-width', n >= 48 ? 0 : Math.min(1.5, w / 14)); ring.setAttribute('opacity', n >= 36 ? 0 : 1);
  };
  const upd = () => {
    const n = +I.value; $('#px-o').textContent = `一排 ${n} 格`;
    $('#px-say').textContent = n < 14 ? '格子很大，邊緣一階一階的，像馬賽克。' : n < 60 ? '格子變小，越來越像圓了。' : '每一格還是方的，遠看卻已經是平滑的圓。';
    if (an) an.stop();
    const my = ++run; an = tween(t => { if (my === run) draw(n, lerp(.55, 1, t)); }, {duration: .5, bounce: .3});
  };
  I.oninput = () => { auto++; upd(); };
  $('#px-go').onclick = async () => { const my = ++auto; for (const n of [4, 8, 12, 20, 32, 48, 80, 120]) { if (my !== auto) return; I.value = n; upd(); await wait(.75); } };
  upd();
})();

// ── 先聊聊 2：河邊的地（每條用左邊的高度）
(() => {
  const s = $('#gi'), I = $('#ln');
  const bank = xs(A, B, 120).map(x => [X(x), Y(f(x))]);
  s.setAttribute('viewBox', '4 8 360 222');
  el('path', {d: areaPath(A, B), fill: '#f3e6c4'}, s);
  el('path', {d: poly([[X(A), 14], ...bank, [X(B), 14]], true), fill: '#bfe0f5'}, s);
  const flow = [0, 1, 2].map(k => el('path', {d: poly(xs(A, B, 60).map(x => [X(x), Math.max(20 + k * 4, Y(f(x)) - 14 - k * 15)])), fill: 'none', stroke: '#fff', 'stroke-width': 2, 'stroke-dasharray': '18 26', 'stroke-opacity': .9}, s));
  const g = el('g', {}, s), over = el('path', {fill: '#e8828c', 'fill-opacity': .75}, s), under = el('path', {fill: '#5cc29a', 'fill-opacity': .75}, s);
  el('path', {d: poly(bank), fill: 'none', stroke: C.b, 'stroke-width': 3.5, 'stroke-linecap': 'round'}, s);
  el('path', {d: `M${X(A)} ${Y(f(A))}V${Y(0)}H${X(B)}V${Y(f(B))}`, fill: 'none', stroke: '#8a6d2f', 'stroke-width': 3}, s);
  const tag = (x, y, t, at) => { el('text', {x, y, 'text-anchor': 'middle', style: 'font-size:15px;font-weight:700;paint-order:stroke;stroke:#fff;stroke-width:4px', ...at}, s).textContent = t; };
  tag(X(5.3), 46, '河'); tag(X(4), Y(0) - 12, '地');
  if (!reduce) Motion.inView(s, () => { const a = flow.map((p, k) => Motion.animate(0, -44, {duration: 1.6 + k * .4, ease: 'linear', repeat: Infinity, onUpdate: v => p.setAttribute('stroke-dashoffset', v)})); return () => a.forEach(q => q.stop()); });
  let cur = [], an, run = 0, auto = 0;
  const draw = hs => {
    bars(g, hs, {fill: '#fff', 'fill-opacity': .35, stroke: '#8a6d2f'}); g.setAttribute('stroke-opacity', hs.length > 40 ? .45 : 1);
    const n = hs.length, w = (B - A) / n, k = Math.max(3, Math.ceil(80 / n)); let o = '', u = '';
    hs.forEach((h, i) => {
      const q = xs(A + w * i, A + w * (i + 1), k), P = fn => q.map(x => [X(x), Y(fn(x))]), back = P(f).reverse();
      o += poly([...P(x => Math.max(h, f(x))), ...back], true); u += poly([...P(x => Math.min(h, f(x))), ...back], true);
    });
    over.setAttribute('d', o); under.setAttribute('d', u);
  };
  const upd = () => {
    const n = +I.value, w = (B - A) / n, to = Array.from({length: n}, (_, i) => f(A + w * i)), from = regrid(cur, n), S = to.reduce((a, b) => a + b, 0) * w;
    $('#ln-o').textContent = `切 ${n} 條`; $('#l-s').textContent = fx(S); $('#l-e').textContent = fx(Math.abs(S - AREA));
    $('#l-say').textContent = n < 8 ? '每條用左邊的高度當長方形的高。河岸邊有的多算、有的少算，誤差很明顯。' : n < 40 ? '切細一點，紅色和綠色都變小了。' : '切很多條，紅色和綠色快看不見了，答案很靠近 30。';
    if (an) an.stop();
    const my = ++run; cur = from; draw(cur);
    an = tween(t => { if (my === run) { cur = to.map((v, j) => lerp(from[j], v, t)); draw(cur); } }, {duration: .6, bounce: .2});
  };
  I.oninput = () => { auto++; upd(); };
  $('#l-go').onclick = async () => { const my = ++auto; for (const n of [2, 4, 8, 16, 32, 64, 100]) { if (my !== auto) return; I.value = n; upd(); await wait(1.1); } };
  upd();
})();

// ── 暖身：割圓術
(() => {
  const s = $('#g0'), cx = 145, cy = 145, r = 125, Z = 12, fa = -Math.PI / 9, ix = 308, iy = 62, ir = 46;
  el('circle', {cx: ix, cy: iy, r: ir}, el('clipPath', {id: 'lens'}, el('defs', {}, s)));
  el('circle', {cx, cy, r, fill: C.rl}, s);
  const p1 = el('path', {fill: C.bl, stroke: C.b, 'stroke-width': 1.5}, s);
  el('circle', {cx, cy, r, fill: 'none', stroke: C.ink, 'stroke-width': 1.6}, s);
  const px = cx + r * Math.cos(fa), py = cy + r * Math.sin(fa);
  el('path', {d: `M${px} ${py}L${ix - 20} ${iy + ir - 5}`, stroke: C.mu, 'stroke-dasharray': '3 3'}, s);
  el('circle', {cx: px, cy: py, r: 5, fill: 'none', stroke: C.mu}, s);
  const lens = el('g', {'clip-path': 'url(#lens)'}, s);
  el('circle', {cx: ix, cy: iy, r: ir, fill: '#fff'}, lens);
  const g = el('g', {transform: `translate(${ix - px * Z} ${iy - py * Z}) scale(${Z})`}, lens);
  el('circle', {cx, cy, r, fill: C.rl}, g);
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
  const pos = el('path', {fill: C.bl}, gA), neg = el('path', {fill: C.rl}, gA);
  const R = mt(s, X(3.2), Y(2), 'R', {style: 'font-size:24px', opacity: 0});
  axis(s, 80);
  const on = [0, 0, 0, 0], wide = {'stroke-width': 4, 'stroke-linecap': 'round', fill: 'none', opacity: 0};
  const L = [C.b, C.w, C.h, C.g].map(c => el('path', {stroke: c, ...wide}, s));
  L[1].setAttribute('d', `M${X(A)} ${Y(0)}H${X(B)}`);
  const LB = [mt(s, X(5.4), Y(6.2), 'y=f(x)', {opacity: 0}), mt(s, X(4), Y(0) + 22, 'y=0', {opacity: 0}), mt(s, X(A) - 20, Y(1), 'x=a', {opacity: 0}), mt(s, X(B) + 26, Y(1), 'x=b', {opacity: 0})];
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
    const d = +D.value, open = !$('#neg').hidden; shape(d);
    LB[0].setAttribute('y', Y(6.2 - d));
    if (open) { R.setAttribute('opacity', d > 1.5 ? 0 : 1); LB[1].setAttribute('opacity', d > 1.9 ? 0 : 1); }
    $('#d-o').textContent = `下移 ${fx(d, 1)}`;
    $('#d-say').innerHTML = d <= 2 ? `${ks('f(x)\\ge 0')}：整塊都在 ${ks('x')} 軸上方，高就是 ${ks('f(x)')}。` : `<span class="cr">紅色部分在 ${ks('x')} 軸下方</span>，${ks('f(x)<0')}，「高 × 寬」會變成負的，不能當面積。所以課本先規定 ${ks('f(x)')} 非負。`;
  };
  D.oninput = upd; upd();
})();

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
    const p0 = X(pts[0]), p1 = Math.max(p0 + 2, X(pts[1])), y = Y(0) - 12;
    band.setAttribute('d', areaPath(pts[0], Math.max(pts[0] + .01, pts[1]), x => f(inAB(x)), 30));
    el('path', {d: `M${p0 + 2} ${y}H${p1 - 2}M${p0 + 2} ${y - 5}v10M${p1 - 2} ${y - 5}v10`, stroke: C.w, 'stroke-width': 2, fill: 'none'}, dx);
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
})();

// ── PART 3：拖 t_i（PART 4、5 共用 T）
const N = 4, DX = (B - A) / N, T = [.2, .75, .5, .85];
const x0 = i => A + DX * i, tv = i => x0(i) + DX * T[i];
const PAL = ['#0f5f8c', '#2f86b5', '#5fa8cf', '#8cc4e2'];
let reset4 = () => {}, reset5 = () => {}, stopWiggle = () => {};
const changed = () => { reset4(); reset5(); };
(() => {
  const s = $('#g3');
  el('path', {d: areaPath(A, B), fill: '#eef5fa'}, s);
  const it = Array.from({length: N}, () => ({
    rect: el('rect', {fill: C.bl, 'fill-opacity': .75, stroke: C.b}, s),
    over: el('path', {fill: '#e8828c', 'fill-opacity': .6}, s), under: el('path', {fill: '#5cc29a', 'fill-opacity': .6}, s)}));
  curve(s); axis(s); sides(s);
  for (let i = 0; i <= N; i++) { el('path', {d: `M${X(x0(i))} ${Y(0)}v6`, stroke: C.ink, 'stroke-width': 1.6}, s); mt(s, X(x0(i)), Y(0) + 56, `x_{${i}}`); }
  it.forEach((o, i) => {
    o.line = el('path', {stroke: C.h, 'stroke-width': 2, 'stroke-dasharray': '4 3'}, s);
    o.dot = el('circle', {r: 4.5, fill: C.h}, s);
    o.hd = el('g', {class: 'hd', tabindex: 0, role: 'slider', 'aria-label': `t${i + 1}`, 'aria-valuemin': x0(i), 'aria-valuemax': x0(i + 1)}, s);
    el('circle', {r: 26, fill: 'transparent', cy: 4}, o.hd);
    el('circle', {class: 'ring', r: 14, fill: C.h, stroke: '#fff', 'stroke-width': 2.5}, o.hd);
    el('path', {d: 'M-4 -5l-5 5l5 5M4 -5l5 5l-5 5', fill: 'none', stroke: '#fff', 'stroke-width': 2.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round'}, o.hd);
    mt(o.hd, 0, 33, `t_{${i + 1}}`, {style: `fill:${C.h}`});
  });
  const halo = el('circle', {r: 14, fill: 'none', stroke: '#f5a524', 'stroke-width': 3, opacity: 0, 'pointer-events': 'none'}, s);
  const hand = el('text', {'text-anchor': 'middle', style: 'font-size:34px', opacity: 0, 'pointer-events': 'none'}, s); hand.textContent = '👆';
  let act = 1, touched = false, seen = false; const an = [];
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
  const local = e => (new DOMPoint(e.clientX, e.clientY).matrixTransform(s.getScreenCTM().inverse()).x - OX) / SX;
  const stopAll = () => an.forEach(a => a && a.stop());
  const put = (i, v) => { T[i] = Math.min(1, Math.max(0, v)); act = i; mark(''); changed(); draw(); };

  // 進入畫面：t2 自己左右移，示範可以拖；拖過就不再示範
  let wig = null, home = 0;
  const WI = 1;
  const wiggle = async () => {
    if (touched || wig) return;
    const me = wig = {}; home = T[WI]; act = WI;
    for (let r = 0; r < 60 && wig === me; r++) {
      const a = Motion.animate(0, 1, {duration: 2.6, ease: 'linear', onUpdate: q => {
        if (wig !== me) return;
        T[WI] = Math.min(1, Math.max(0, home + (.5 - home) * Math.min(1, r ? 1 : q * 4) + .42 * Math.sin(q * Math.PI * 2)));
        draw();
        set(halo, {cx: X(tv(WI)), cy: Y(0), r: 14 + 12 * ((q * 2) % 1), opacity: 1 - ((q * 2) % 1)});
        set(hand, {x: X(tv(WI)) + 8, y: Y(0) + 40, opacity: 1});
      }});
      me.a = a; await wait(2.7);
      if (wig === me) await wait(.5);
    }
  };
  stopWiggle = () => {
    if (!wig) return;
    if (wig.a) wig.a.stop();
    wig = null; T[WI] = home; halo.setAttribute('opacity', 0); hand.setAttribute('opacity', 0); draw();
  };
  const grab = keep => { const now = T[WI], was = wig; stopWiggle(); if (was && keep) { T[WI] = now; draw(); } touched = true; };
  if (!reduce) Motion.inView(s, () => { seen = true; wiggle(); return () => stopWiggle(); }, {amount: .6});

  it.forEach((o, i) => {
    let drag = false, off = 0;
    o.hd.addEventListener('pointerdown', e => { grab(i === WI); stopAll(); drag = true; off = tv(i) - local(e); o.hd.setPointerCapture(e.pointerId); act = i; draw(); });
    o.hd.addEventListener('pointermove', e => { if (drag) put(i, (local(e) + off - x0(i)) / DX); });
    const end = () => { drag = false; }; o.hd.addEventListener('pointerup', end); o.hd.addEventListener('pointercancel', end);
    o.hd.addEventListener('keydown', e => { const d = {ArrowLeft: -.05, ArrowRight: .05}[e.key]; if (d) { e.preventDefault(); grab(); stopAll(); put(i, T[i] + d); } });
  });
  $$('#t3 button').forEach(b => b.onclick = () => {
    const m = b.dataset.m; grab(); mark(m); stopAll(); changed();
    it.forEach((_, i) => {
      const a = T[i], z = {l: 0, m: .5, r: 1}[m] ?? Math.random();
      an[i] = tween(t => { T[i] = Math.min(1, Math.max(0, lerp(a, z, t))); draw(); }, {delay: i * .08, duration: .7, bounce: .3, onComplete: changed});
    });
  });
  draw();
})();

const geo = i => ({x: X(x0(i)), y: Y(f(tv(i))), w: X(x0(i + 1)) - X(x0(i)), h: Y(0) - Y(f(tv(i)))});
const ghosts = (g, op) => { g.textContent = ''; for (let i = 0; i < N; i++) { const q = geo(i); el('rect', {x: q.x, y: q.y, width: q.w, height: q.h, fill: PAL[i], 'fill-opacity': op, stroke: C.b, 'stroke-width': 1.2}, g); } };

// ── PART 4：加總
(() => {
  const s = $('#g4'), BX = v => 14 + v * 8, by = 236, bh = 26;
  el('path', {d: areaPath(A, B), fill: '#eef5fa'}, s);
  const ghost = el('g', {}, s); curve(s); axis(s); sides(s);
  el('rect', {x: BX(0), y: by, width: 328, height: bh, fill: '#f3f1ea', rx: 4}, s);
  const fly = el('g', {}, s);
  el('path', {d: `M${BX(AREA)} ${by - 6}V${by + bh + 6}`, stroke: C.g, 'stroke-width': 2.5, 'stroke-dasharray': '4 3'}, s);
  el('text', {x: BX(AREA), y: by + bh + 24, 'text-anchor': 'middle', style: `fill:${C.g};font-weight:700`}, s).textContent = '真正面積 30';
  let run = 0;
  reset4 = () => { run++; ghosts(ghost, .3); fly.textContent = ''; $('#terms').textContent = ''; const b = $('#p4'); b.disabled = false; b.textContent = '▶ 開始加'; };
  $('#p4').onclick = async () => {
    stopWiggle(); reset4(); const my = run, b = $('#p4'); b.disabled = true; let sum = 0;
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
    b.disabled = false; b.textContent = '↻ 再看一次';
  };
  reset4();
})();

// ── PART 5：Σ 的零件（圖、按鈕、說明同一個畫面）
(() => {
  const s = $('#g5');
  el('path', {d: areaPath(A, B), fill: '#eef5fa'}, s);
  const ghost = el('g', {}, s); curve(s); axis(s); sides(s);
  const hi = el('g', {}, s);
  const formula = k => {
    const o = (id, t) => k === id ? `\\boxed{${t}}` : t;
    K(`\\begin{aligned}&f(t_1)\\Delta x+f(t_2)\\Delta x\\\\&\\ +f(t_3)\\Delta x+f(t_4)\\Delta x\\\\[8pt]=\\ &${k === 'S' ? KG('\\sum') : '\\sum'}_{${o('i', 'i=1')}}^{${o('n', '4')}}${o('f', KH('f(t_i)'))}\\cdot${o('d', KW('\\Delta x'))}\\end{aligned}`, $('#f4'), true);
  };
  const box = (i, at) => { const g = geo(i); return el('rect', {x: g.x, y: g.y, width: g.w, height: g.h, fill: 'none', stroke: C.r, 'stroke-width': 4, ...at}, hi); };
  const each = fn => { for (let i = 0; i < N; i++) fn(i, geo(i)); };
  const tag = (i, t) => { const g = geo(i); mt(hi, g.x + g.w / 2, Y(0) + 20, t, {style: `fill:${C.r}`}); };
  const PARTS = [
    {k: 'S', t: '\\Sigma', s: `${ks('\\Sigma')}：把後面那一項，<b>一個一個全部加起來</b>。`, d: () => each(i => { const b = box(i, {stroke: C.g, opacity: 0}); tween(t => b.setAttribute('opacity', t), {ease: 'easeOut', duration: .3, delay: i * .25}); })},
    {k: 'i', t: 'i=1', s: `${ks('i=1')}：從<b>第 1 個</b>矩形開始加。`, d: () => { box(0); tag(0, 'i=1'); }},
    {k: 'n', t: 'n', s: `上面的 ${ks('n')}：加到<b>第 ${ks('n')} 個</b>為止，這裡 ${ks('n=4')}。`, d: () => { box(N - 1); tag(N - 1, 'i=4'); }},
    {k: 'f', t: 'f(t_i)', s: `${ks('f(t_i)')}：第 ${ks('i')} 個矩形的<b class="ch">高</b>，每個可能不同。`, d: () => each((i, g) => { const p = el('path', {stroke: C.h, 'stroke-width': 5, 'stroke-linecap': 'round'}, hi), x = X(tv(i)); mt(hi, x, Y(0) + 19, `t_{${i + 1}}`, {style: `fill:${C.h}`}); tween(t => p.setAttribute('d', `M${x} ${Y(0)}V${Y(0) - g.h * t}`), {delay: i * .12}); })},
    {k: 'd', t: '\\Delta x', s: `${ks('\\Delta x')}：每個矩形的<b class="cw">寬</b>。因為等分，所以全都一樣。`, d: () => each((i, g) => { const p = el('path', {stroke: C.w, 'stroke-width': 7}, hi); tween(t => p.setAttribute('d', `M${g.x + 3} ${Y(0)}h${Math.max(0, (g.w - 6) * t)}`), {delay: i * .12}); })}];
  let now = PARTS[0];
  const pick = p => { now = p; hi.textContent = ''; formula(p.k); p.d(); $('#p-say').innerHTML = p.s; $$('#parts button').forEach(b => b.classList.toggle('on', b.dataset.p === p.k)); };
  PARTS.forEach(p => { const b = document.createElement('button'); b.dataset.p = p.k; K(p.t, b); b.onclick = () => pick(p); $('#parts').appendChild(b); });
  reset5 = () => { ghosts(ghost, .3); hi.textContent = ''; now.d(); };
  ghosts(ghost, .3); pick(now);
})();

quiz({key: 'gsat-math-integral-page1', title: '積分page1教學', items: [
  {t: '[2,10] 等分 4 段的 Δx', q: `把 ${ks('[2,10]')} 等分成 4 段，${ks('\\Delta x')} 是多少？`, o: ['2', '2.5', '8'], a: 0,
    w: `${ks('\\Delta x=\\frac{b-a}{n}=\\frac{10-2}{4}=2')}`, h: `${ks('b-a')} 是全長，還要除以段數 ${ks('n')}。`},
  {t: '分割點個數', q: '承上題，分割點一共有幾個？', o: ['3', '4', '5'], a: 2,
    w: `2、4、6、8、10，共 5 個。${ks('n')} 段有 ${ks('n+1')} 個分割點，因為從 ${ks('x_0')} 開始數。`, h: '把 2 到 10 的分割點一個一個寫出來數，頭尾都要算。'},
  {t: '矩形的高', q: `第 ${ks('i')} 個矩形的「高」是哪一個？`, o: [ks('t_i'), ks('f(t_i)'), ks('\\Delta x')], plain: ['t_i', 'f(t_i)', 'Δx'], a: 1,
    w: `${ks('t_i')} 是 ${ks('x')} 軸上的位置，代進 ${ks('f')} 才是高。${ks('\\Delta x')} 是寬。`, h: `回 PART 3 看：紫色虛線從 ${ks('t_i')} 往上，碰到曲線才停。那個高度怎麼寫？`},
  {t: 't_i 一定取中點嗎', q: `${ks('t_i')} 一定要取中點嗎？`, o: ['一定要', '不用，段內任取'], a: 1,
    w: `課本寫「任取 ${ks('t_i')}」，只要在 ${ks('[x_{i-1},x_i]')} 裡面就可以。`, h: '回 PART 3 拖拖看，圓點可以停在哪些地方？'},
  {t: 'x² 在 [0,2]、n=2、右端的矩形面積和', q: `${ks('f(x)=x^2')}，把 ${ks('[0,2]')} 等分 2 段，${ks('t_i')} 都取<b>右端</b>，兩個矩形的面積和是多少？`, o: ['1', '2.5', '5'], a: 2,
    w: `${ks('\\Delta x=1')}，${ks('t_1=1,\\ t_2=2')}，<br>所以 ${ks('1^2\\times1+2^2\\times1=5')}。<br>取左端會得到 1，取中點會得到 2.5。三個都是合格的近似值，只是 ${ks('t_i')} 不同。`, h: `先算 ${ks('\\Delta x')}，再找兩段的右端點，分別代進 ${ks('x^2')}。`}]});
})();
