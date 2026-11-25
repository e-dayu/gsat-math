'use strict';
// 各頁共用：SVG 小工具、Motion 動畫、示範函數、按鈕特效、小測
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const NS = 'http://www.w3.org/2000/svg';
const C = {ink: '#1b2733', mu: '#8a97a4', b: '#0f5f8c', bl: '#cfe5f2', w: '#b45309', h: '#6d28d9', g: '#0e7a55', gl: '#8fd3b6', r: '#c81e2d', rl: '#f3b4ba'};
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const el = (tag, at, p) => { const e = document.createElementNS(NS, tag); for (const k in at) e.setAttribute(k, at[k]); if (p) p.appendChild(e); return e; };
const set = (e, at) => { for (const k in at) e.setAttribute(k, at[k]); };
const K = (tex, node, display) => katex.render(tex, node, {displayMode: !!display, throwOnError: false});
const ks = tex => katex.renderToString(tex, {throwOnError: false});
const lerp = (a, b, t) => a + (b - a) * t;
const fx = (v, d = 2) => v.toFixed(d);
const num = v => String(+v.toFixed(2));
const KW = s => `\\textcolor{#b45309}{${s}}`, KH = s => `\\textcolor{#6d28d9}{${s}}`, KG = s => `\\textcolor{#0e7a55}{${s}}`, KR = s => `\\textcolor{#c81e2d}{${s}}`;

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

// 示範函數：f 在 [1,7] 上，面積恰為 30；極值在 x=3（高）、x=5.5（低）
const A = 1, B = 7, AREA = 30, CRIT = [3, 5.5];
const f = x => { const u = x - A; return u ** 3 / 6 - 1.625 * u * u + 4.5 * u + 2; };
const inAB = x => Math.min(B, Math.max(A, x));
const ext = (a, b) => { // [a,b] 上的最大、最小值與位置
  const p = [a, b, ...CRIT.filter(c => c > a && c < b)].map(x => [x, f(x)]);
  const hi = p.reduce((m, q) => q[1] > m[1] ? q : m), lo = p.reduce((m, q) => q[1] < m[1] ? q : m);
  return {M: hi[1], xM: hi[0], m: lo[1], xm: lo[0]};
};
const OX = 24, SX = 40;
const X = v => OX + v * SX, Y = v => 205 - v * 25;
const xs = (a, b, k) => Array.from({length: k + 1}, (_, i) => a + (b - a) * i / k);
const poly = (pts, close) => pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(2) + ' ' + p[1].toFixed(2)).join('') + (close ? 'Z' : '');
const curvePath = (a, b, g = f, k = 120) => poly(xs(a, b, k).map(x => [X(x), Y(g(x))]));
const areaPath = (a, b, g = f, k = 120) => poly([[X(a), Y(0)], ...xs(a, b, k).map(x => [X(x), Y(g(x))]), [X(b), Y(0)]], true);
function axis(s, down = 10) { // x 軸、y 軸、原點
  el('path', {d: `M8 ${Y(0)}H346M${X(0)} ${Y(0) + down}V16`, stroke: C.ink, 'stroke-width': 1.6, fill: 'none'}, s);
  el('path', {d: `M346 ${Y(0) - 5}l9 5l-9 5zM${X(0) - 5} 16l5 -9l5 9z`, fill: C.ink}, s);
  mt(s, 350, Y(0) + 20, 'x'); mt(s, X(0) + 15, 20, 'y'); mt(s, X(0) - 10, Y(0) + 17, 'O');
}
function sides(s) {
  for (const v of [A, B]) el('path', {d: `M${X(v)} ${Y(0)}V${Y(f(v))}`, stroke: C.ink, 'stroke-width': 1.6, 'pointer-events': 'none'}, s);
}
const curve = s => el('path', {d: curvePath(A, B), fill: 'none', stroke: C.b, 'stroke-width': 3, 'stroke-linecap': 'round', 'pointer-events': 'none'}, s);
// n 變動時，新矩形從舊階梯的高度長出來
const regrid = (cur, n) => Array.from({length: n}, (_, j) => cur.length ? cur[Math.min(cur.length - 1, Math.floor((j + .5) * cur.length / n))] : 0);
function bars(g, hs, at) {
  const n = hs.length, w = (X(B) - X(A)) / n;
  while (g.childNodes.length > n) g.lastChild.remove();
  while (g.childNodes.length < n) el('rect', at, g);
  hs.forEach((v, i) => set(g.childNodes[i], {x: X(A) + w * i, y: Y(v), width: w, height: Math.max(0, Y(0) - Y(v)), 'stroke-width': n > 40 ? .5 : 1.2}));
}

$$('[data-k]').forEach(e => K(e.dataset.k, e));
Motion.scroll(p => { $('#bar').style.transform = `scaleX(${p})`; });

// ＋／− 按鈕
$$('[data-for]').forEach(b => b.onclick = () => { const i = $('#' + b.dataset.for); i.value = +i.value + +b.dataset.d; i.dispatchEvent(new Event('input')); });

// 按鈕特效：data-hint 群組進入畫面時發光＋手指示範，按過就停；每次按下有水波
document.addEventListener('pointerdown', e => {
  const b = e.target.closest && e.target.closest('button'); if (!b || b.disabled) return;
  const r = b.getBoundingClientRect(), s = document.createElement('i'); s.className = 'rip';
  s.style.left = e.clientX - r.left + 'px'; s.style.top = e.clientY - r.top + 'px'; b.appendChild(s);
  setTimeout(() => s.remove(), 600);
});
$$('[data-hint]').forEach(g => {
  let used = false;
  Motion.inView(g, () => { if (!used) g.classList.add('hint'); return () => g.classList.remove('hint'); });
  g.addEventListener('click', () => { used = true; g.classList.remove('hint'); });
});

// 小測＋複製作答
function quiz({key, title, items}) {
  let st = {};
  try { st = JSON.parse(localStorage.getItem(key)) || {}; } catch (e) { /* 無痕模式 */ }
  const pk = st.pick || {}; // 每題依序記錄點過的選項
  const save = () => { try { localStorage.setItem(key, JSON.stringify({pick: pk, own: $('#own').value})); } catch (e) { /* 無痕模式 */ } };
  items.forEach((q, k) => {
    const d = document.createElement('div'); d.className = 'q';
    d.innerHTML = `<div><b>${k + 1}.</b> ${q.q}</div><div class="seg${q.col ? ' col' : ''}">${q.o.map(o => `<button>${o}</button>`).join('')}</div><div class="ans" aria-live="polite"></div>`;
    $('#quiz').appendChild(d);
    const bs = [...d.querySelectorAll('button')], an = d.querySelector('.ans');
    const show = i => { const ok = i === q.a; bs.forEach((b, j) => { b.className = j === i ? (ok ? 'hit' : 'miss') : ''; }); an.className = 'ans ' + (ok ? 'ok' : 'no'); an.innerHTML = ok ? '對！' + q.w : '再想想：' + q.h; };
    bs.forEach((b, i) => b.onclick = () => { const L = pk[k] || (pk[k] = []); if (L[L.length - 1] !== i) L.push(i); save(); show(i); if (!reduce) Motion.animate(an, {opacity: [0, 1], y: [-6, 0]}, {duration: .3}); });
    if (pk[k] && pk[k].length) show(pk[k][pk[k].length - 1]);
  });
  $('#own').value = st.own || ''; $('#own').oninput = save;
  $('#copy').onclick = async () => {
    const lines = items.map((q, k) => { const L = pk[k] || []; return `${k + 1}. ${q.t}：${L.length ? L.map(i => (q.plain || q.o)[i] + (i === q.a ? ' ✓' : ' ✗')).join(' → ') : '未作答'}`; });
    const text = `【${title}】\n${lines.join('\n')}\n我的說明：${$('#own').value.trim() || '（未寫）'}`;
    let ok = false;
    try { await navigator.clipboard.writeText(text); ok = true; } catch (e) {
      const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); try { ok = document.execCommand('copy'); } catch (e2) { ok = false; } t.remove();
    }
    $('#msg').textContent = ok ? '已複製，貼到 LINE 就可以傳回。' : '這個瀏覽器不能自動複製，請改用截圖傳回。';
  };
}
