'use strict';
// page3 以後共用：座標圖、可拖的點、逐步推導、小試
const CT = '#0e7490', KT = s => `\\textcolor{${CT}}{${s}}`, KB = s => `\\textcolor{#0f5f8c}{${s}}`;
const onOnly = (sel, b) => $$(sel + ' button').forEach(e => e.classList.toggle('on', e === b));
const HALO = 'paint-order:stroke;stroke:#fff;stroke-width:5px;';
const sgn = v => { const t = num(v); return t === '-0' ? '0' : t.replace('-', '−'); };
// 示範函數從 1 累積到 x 的面積
const GF = x => { const u = x - A; return u ** 4 / 24 - 1.625 * u ** 3 / 3 + 2.25 * u * u + 2 * u; };

function plot(sel, {x, y, w = 360, h = 236, pad = [20, 24, 28, 24], left = 0, top = 0}) { // pad：上右下左
  const s = typeof sel === 'string' ? $(sel) : sel, [pt, pr, pb, pl] = pad;
  if (!s.getAttribute('viewBox')) s.setAttribute('viewBox', `0 0 ${w} ${h}`);
  const PX = v => left + pl + (v - x[0]) / (x[1] - x[0]) * (w - pl - pr), PY = v => top + h - pb - (v - y[0]) / (y[1] - y[0]) * (h - pt - pb);
  const P = {s, h, g: s, X: PX, Y: PY,
    inv: px => x[0] + (px - left - pl) / (w - pl - pr) * (x[1] - x[0]),
    path: (a, b, fn, k = 120) => poly(xs(a, b, k).map(v => [PX(v), PY(fn(v))])),
    fill: (a, b, fn, lo = () => 0, k = 160) => poly([...xs(a, b, k).map(v => [PX(v), PY(fn(v))]), ...xs(b, a, k).map(v => [PX(v), PY(lo(v))])], true),
    pos: (a, b, fn) => P.fill(a, b, v => Math.max(0, fn(v))),
    neg: (a, b, fn) => P.fill(a, b, v => Math.min(0, fn(v))),
    curve: (a, b, fn, at = {}) => el('path', {d: P.path(a, b, fn), fill: 'none', stroke: C.b, 'stroke-width': 3, 'stroke-linecap': 'round', 'pointer-events': 'none', ...at}, P.g),
    axes({ox = 0, xn = 'x', yn = 'y', o = true} = {}) {
      const r = left + w - 12, t = top + 12, l = left + 8;
      el('path', {d: `M${l} ${PY(0)}H${r - 6}M${PX(ox)} ${PY(Math.min(0, y[0])) + 4}V${t + 6}`, stroke: C.ink, 'stroke-width': 1.6, fill: 'none'}, P.g);
      el('path', {d: `M${r - 7} ${PY(0) - 5}l9 5l-9 5zM${PX(ox) - 5} ${t + 7}l5 -9l5 9z`, fill: C.ink}, P.g);
      mt(P.g, r, PY(0) + 20, xn); mt(P.g, PX(ox) + 15 + (yn.length - 1) * 8, t + 8, yn); if (o) mt(P.g, PX(ox) - 10, PY(0) + 17, 'O');
    },
    tx: (v, t, at = {}) => { el('path', {d: `M${PX(v)} ${PY(0) - 4}v8`, stroke: C.ink, 'stroke-width': 1.4}, P.g); return mt(P.g, PX(v), PY(0) + 21, t ?? sgn(v), {style: HALO, ...at}); },
    ty: (v, t, ox = 0) => { el('path', {d: `M${PX(ox) - 4} ${PY(v)}h8`, stroke: C.ink, 'stroke-width': 1.4}, P.g); return mt(P.g, PX(ox) - 8, PY(v) + 6, t ?? sgn(v), {'text-anchor': 'end'}); },
    vline: (v, y1, at = {}) => el('path', {d: `M${PX(v)} ${PY(0)}V${PY(y1)}`, stroke: C.ink, 'stroke-width': 1.6, 'pointer-events': 'none', ...at}, P.g),
    put: (tag, at) => el(tag, at, P.g)};
  return P;
}

// 可拖的點：大圓＋左右箭頭，進畫面先自己動一下
function handle(P, o) {
  let v = o.v, used = false, an, on = false;
  const val = k => typeof o[k] === 'function' ? o[k]() : o[k];
  const g = el('g', {class: 'hd', tabindex: 0, role: 'slider', 'aria-label': o.label}, P.s);
  const stem = el('path', {stroke: o.color, 'stroke-width': 2, 'stroke-dasharray': '3 3'}, g), kn = el('g', {}, g);
  el('circle', {r: 26, fill: 'transparent'}, kn);
  el('circle', {r: 17, fill: o.color, stroke: '#fff', 'stroke-width': 3, class: 'ring', style: 'filter:drop-shadow(0 2px 4px rgba(8,63,94,.5))'}, kn);
  el('path', {d: 'M-5 -5l-5 5l5 5M5 -5l5 5l-5 5', fill: 'none', stroke: '#fff', 'stroke-width': 2.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round'}, kn);
  const draw = () => { const x = P.X(v); kn.setAttribute('transform', `translate(${x} ${o.y})`); stem.setAttribute('d', `M${x} ${o.y - 17}V${P.Y(0) + (o.gap || 0)}`); set(g, {'aria-valuenow': num(v), 'aria-valuemin': num(val('min')), 'aria-valuemax': num(val('max'))}); };
  const put = n => { v = Math.min(val('max'), Math.max(val('min'), n)); draw(); o.on(v); };
  const snap = n => o.step ? Math.round(n / o.step) * o.step : n;
  const stop = () => { used = true; if (an) an.stop(); };
  const move = e => { const m = P.s.getScreenCTM(); put(snap(P.inv((e.clientX - m.e) / m.a))); };
  g.addEventListener('pointerdown', e => { stop(); on = true; try { g.setPointerCapture(e.pointerId); } catch (x) { /* 舊瀏覽器 */ } if (o.grab) o.grab(); move(e); });
  g.addEventListener('pointermove', e => { if (on) move(e); });
  ['pointerup', 'pointercancel'].forEach(k => g.addEventListener(k, () => { on = false; }));
  g.addEventListener('keydown', e => { const d = {ArrowLeft: -1, ArrowDown: -1, ArrowRight: 1, ArrowUp: 1}[e.key]; if (d) { stop(); if (o.grab) o.grab(); e.preventDefault(); put(snap(v + d * (o.step || (val('max') - val('min')) / 40))); } });
  if (!reduce && o.demo) Motion.inView(P.s, () => {
    if (!used) { const v0 = v; an = Motion.animate(0, 1, {duration: 2, ease: 'linear', delay: .5, onUpdate: q => { if (!used) put(snap(v0 + o.demo * Math.sin(q * 6.283) * (1 - q))); }, onComplete: () => { if (!used) put(v0); }}); return () => { an.stop(); if (!used) put(v0); }; }
  }, {amount: .6});
  draw();
  return {get v() { return v; }, put: n => { stop(); put(n); }, draw, stop};
}

// 一次看一步：items = [{h, t: 公式, s: 說明}]，onStep(k) 讓圖跟著走
function stepper(sel, items, onStep) {
  const box = $(sel); let k = 0;
  box.innerHTML = '<p class="no-of"></p><div class="fm"></div><div class="say"></div><div class="btns"><button class="btn ghost">← 上一步</button><button class="btn">下一步 →</button></div>';
  const [p, n] = box.querySelectorAll('button'), fm = box.querySelector('.fm'), sy = box.querySelector('.say');
  const show = first => {
    const it = items[k]; box.querySelector('.no-of').innerHTML = `<span class="small">${k + 1}／${items.length}</span>　<b class="cb">${it.h}</b>`;
    fm.hidden = !it.t; if (it.t) K(it.t, fm, true);
    sy.innerHTML = it.s; p.disabled = !k; n.disabled = k === items.length - 1;
    if (!reduce && !first) Motion.animate([fm, sy], {opacity: [0, 1], x: [18, 0]}, {type: 'spring', bounce: .2, duration: .6});
    if (onStep) onStep(k, first);
  };
  p.onclick = () => { k--; show(); }; n.onclick = () => { k++; show(); };
  show(true);
}

function mini(sel, items) {
  items.forEach(q => {
    const d = document.createElement('div'); d.className = 'q'; d.innerHTML = `<div>${q.q}</div><div class="seg${q.col ? ' col' : ''}">${q.o.map(v => `<button>${v}</button>`).join('')}</div><div class="ans" aria-live="polite"></div>`; $(sel).appendChild(d);
    const bs = [...d.querySelectorAll('button')], an = d.querySelector('.ans');
    bs.forEach((b, i) => b.onclick = () => { const ok = i === q.a; bs.forEach(e => { e.className = ''; }); b.className = ok ? 'hit' : 'miss'; an.className = 'ans ' + (ok ? 'ok' : 'no'); an.innerHTML = ok ? '對！' + q.w : '再想想：' + (Array.isArray(q.h) ? q.h[i] : q.h); if (!reduce) Motion.animate(an, {opacity: [0, 1], y: [-6, 0]}, {duration: .3}); });
  });
}
