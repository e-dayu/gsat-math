(() => {
'use strict';

K(`\\sum_{i=1}^{n}${KH('f(t_i)')}\\cdot${KW('\\Delta x')}`, $('#f1'), true);
const total = hs => hs.reduce((a, b) => a + b, 0) * (B - A) / hs.length;
const exts = n => Array.from({length: n}, (_, i) => ext(A + (B - A) * i / n, A + (B - A) * (i + 1) / n));
const ab = s => { mt(s, X(A), Y(0) + 21, 'a'); mt(s, X(B), Y(0) + 21, 'b'); };

// ── PART 3：座號 → 機器 f → 身高；同學變成函數圖
const CT = '#0e7490', KT = s => `\\textcolor{${CT}}{${s}}`;
const sub = i => `t_${i}`;
(() => {
  const s = $('#gh'), HX = v => 42 + (v - 1) * 46, G = 176, HY = h => G - h * 23, MY = 262;
  el('path', {d: `M14 ${G}H346`, stroke: C.ink, 'stroke-width': 1.6}, s);
  const gAxis = el('g', {opacity: 0}, s);
  el('path', {d: `M14 ${G + 8}V20`, stroke: C.ink, 'stroke-width': 1.6}, gAxis); el('path', {d: `M9 22l5 -9l5 9zM344 ${G - 5}l9 5l-9 5z`, fill: C.ink}, gAxis);
  mt(gAxis, 26, 20, 'y'); mt(gAxis, 350, G + 20, 'x');
  const cv = el('path', {d: poly(xs(A, B, 100).map(x => [HX(x), HY(f(x))])), fill: 'none', stroke: C.b, 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0}, s);
  const mc = mt(s, HX(5), HY(5.6), 'y=f(x)', {opacity: 0});
  const kids = [], seats = [];
  for (let v = 1; v <= 7; v++) {
    const h = HY(f(v)), g = el('g', {}, s), x = HX(v);
    el('rect', {x: x - 11, y: h + 19, width: 22, height: Math.max(4, G - h - 19), rx: 8, class: 'bd', fill: '#9cc7e0'}, g);
    el('circle', {cx: x, cy: h + 10, r: 10, fill: '#f6d7b0', stroke: '#b98a4e'}, g);
    el('path', {d: `M${x - 4} ${h + 9}v1M${x + 4} ${h + 9}v1M${x - 3} ${h + 14}q3 3 6 0`, stroke: C.ink, 'stroke-width': 1.6, 'stroke-linecap': 'round', fill: 'none'}, g);
    kids.push(g);
    el('circle', {cx: x, cy: G + 21, r: 13, fill: '#06505f'}, s);
    const c = el('circle', {cx: x, cy: G + 18, r: 13, fill: '#e2f4f8', stroke: CT, 'stroke-width': 2}, s);
    mt(s, x, G + 24, String(v), {style: `fill:${CT};font-weight:700`, 'pointer-events': 'none'}); seats.push(c);
  }
  // 身高尺
  const ruler = el('path', {stroke: C.h, 'stroke-width': 4, 'stroke-linecap': 'round', fill: 'none'}, s);
  const ball = el('circle', {r: 6, fill: C.h, stroke: '#fff', 'stroke-width': 2, opacity: 0}, s);
  const rl = mt(s, 0, 0, '', {style: `fill:${C.h};font-weight:700;paint-order:stroke;stroke:#fff;stroke-width:4px`});
  // 機器
  el('path', {d: `M96 ${MY}H132M228 ${MY}H262`, stroke: C.mu, 'stroke-width': 3}, s);
  el('path', {d: `M130 ${MY - 5}l9 5l-9 5zM260 ${MY - 5}l9 5l-9 5z`, fill: C.mu}, s);
  const slot = (x, w) => el('rect', {x: x - w / 2, y: MY - 18, width: w, height: 36, rx: 9, fill: 'none', stroke: '#c9d1d8', 'stroke-width': 1.5, 'stroke-dasharray': '4 3'}, s);
  slot(62, 60); slot(302, 66);
  const inT = el('text', {x: 62, y: MY + 37, 'text-anchor': 'middle', style: `font-size:14px;fill:${CT};font-weight:700`}, s), outT = el('text', {x: 302, y: MY + 37, 'text-anchor': 'middle', style: `font-size:14px;fill:${C.h};font-weight:700`}, s);
  const mac = el('g', {}, s);
  el('rect', {x: 140, y: MY - 28, width: 86, height: 56, rx: 12, fill: '#3b4754'}, mac); el('rect', {x: 147, y: MY - 21, width: 72, height: 42, rx: 7, fill: '#fff6df'}, mac);
  mt(mac, 183, MY + 9, 'f', {style: 'font-size:30px'});
  const chip = color => { const g = el('g', {opacity: 0}, s); el('rect', {x: -25, y: -14, width: 50, height: 28, rx: 8, fill: color}, g); const t = el('text', {y: 6, 'text-anchor': 'middle', style: 'fill:#fff;font-weight:700;font-size:16px'}, g); return {g, at: (x, y, o = 1) => set(g, {transform: `translate(${x} ${y})`, opacity: Math.max(0, Math.min(1, o))}), txt: v => { t.textContent = v; }}; };
  const ci = chip(CT), co = chip(C.h);
  const hand = el('text', {'text-anchor': 'middle', style: 'font-size:30px', opacity: 0, 'pointer-events': 'none'}, s); hand.textContent = '👆';
  let mode = 0, k = 0, run = 0, mo, touched = false, hd, now = 0;
  const lab = () => { inT.textContent = mode ? '位置' : '座號'; outT.textContent = mode ? '高度' : '身高'; };
  const step = n => $$('#walk li').forEach((e, i) => e.classList.toggle('on', i === n));
  const say = v => { $('#sh').innerHTML = mode ? `位置 ${ks(`${KT('t_i')}=${v}`)}，走到曲線的高度是 ${ks(`${KH('f(t_i)')}${f(v) === +fx(f(v)) ? '=' : '\\approx'}${num(f(v))}`)}。` : `座號是 ${ks(`${KT('t_i')}=${v}`)}，身高是 ${ks(`${KH('f(t_i)')}${f(v) === +fx(f(v)) ? '=' : '\\approx'}${num(f(v))}`)}。<b>${v} 是誰，${num(f(v))} 是多高，不一樣！</b>`; };
  const clear = () => { ruler.setAttribute('d', ''); ball.setAttribute('opacity', 0); rl.textContent = ''; ci.at(0, 0, 0); co.at(0, 0, 0); mac.setAttribute('transform', ''); kids.forEach(g => g.querySelector('.bd').setAttribute('fill', '#9cc7e0')); seats.forEach(c => c.setAttribute('fill', '#e2f4f8')); step(-1); };
  const pick = async v => {
    const my = ++run, x = HX(v), top = HY(f(v)), ok = () => my === run, go = (cb, o) => play(t => { if (ok()) cb(t); }, o);
    clear(); now = v; step(0); $('#sh').textContent = mode ? '先在 x 軸上找到位置…' : '先看座號…';
    seats[v - 1].setAttribute('fill', '#8fdbea'); kids[v - 1].querySelector('.bd').setAttribute('fill', '#4f9fc9'); ci.txt(v);
    await go(t => ci.at(lerp(x, 62, t), lerp(G + 18, MY, t)), {duration: .9, bounce: .15}); if (!ok()) return;
    await wait(.25); if (!ok()) return;
    step(1); ball.setAttribute('opacity', 1); $('#sh').textContent = mode ? '直直往上，碰到曲線停下來…' : '機器往上量，量到頭頂…';
    const up = go(t => { const y = lerp(G, top, t); ruler.setAttribute('d', `M${x} ${G}V${y}`); set(ball, {cx: x, cy: y}); }, {ease: 'easeInOut', duration: 1.2});
    go(t => { ci.at(lerp(62, 150, t), MY, 1 - t); mac.setAttribute('transform', `translate(${Math.sin(t * 40) * 2.5 * (1 - t)} 0)`); }, {ease: 'linear', duration: 1.1});
    await up; if (!ok()) return;
    step(2); ruler.setAttribute('d', `M${x - 8} ${top}h16M${x} ${top}V${G}M${x - 8} ${G}h16`); ball.setAttribute('opacity', 0);
    set(rl, {x: Math.min(330, Math.max(36, x + (v === 7 ? -30 : 28))), y: (top + G) / 2 + 5}); rl.textContent = num(f(v)); co.txt(num(f(v)));
    await go(t => co.at(lerp(200, 302, t), MY, t * 1.5), {duration: .8, bounce: .35}); if (!ok()) return;
    co.at(302, MY, 1); ci.at(62, MY, 1); say(v);
  };
  for (let v = 1; v <= 7; v++) {
    const h = el('rect', {x: HX(v) - 23, y: 8, width: 46, height: G + 30, fill: 'transparent', tabindex: 0, role: 'button', class: 'tap', 'aria-label': `第 ${v} 位`}, s);
    const go = () => { touched = true; if (hd) hd.stop(); hand.setAttribute('opacity', 0); pick(v); };
    h.addEventListener('click', go); h.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
  }
  $$('#mh button').forEach(b => b.onclick = () => {
    mode = +b.dataset.m; $$('#mh button').forEach(e => e.classList.toggle('on', e === b)); run++; clear(); lab();
    if (mo) mo.stop();
    const from = k, len = cv.getTotalLength();
    mo = tween(t => {
      k = lerp(from, mode, t); gAxis.setAttribute('opacity', k); mc.setAttribute('opacity', k);
      set(cv, {opacity: k > .02 ? 1 : 0, 'stroke-dasharray': len, 'stroke-dashoffset': len * (1 - k)}); kids.forEach(g => g.setAttribute('opacity', 1 - k * .82));
    }, {ease: 'easeInOut', duration: 1.4, onComplete: () => { if (now) pick(now); }});
    $('#sh').innerHTML = mode ? '把每個人的頭頂連起來，就是函數圖形。<b>座號變成 x 軸上的位置，身高變成曲線的高度。</b>' : '變回同學。';
  });
  lab(); $('#sh').textContent = '點任何一位同學。';
  if (!reduce) Motion.inView(s, () => {
    if (!now) pick(3);
    if (!touched) hd = Motion.animate(0, 1, {duration: 1.1, repeat: Infinity, ease: 'linear', onUpdate: q => set(hand, {x: HX(5) + 6, y: G + 52 + Math.sin(q * 6.283) * 5, opacity: touched ? 0 : 1})});
    return () => { if (hd) hd.stop(); hand.setAttribute('opacity', 0); };
  }, {amount: .5});
})();

// 派代表：點落在 x 軸 → 往上走 → 往兩側長成矩形
function repDraw(s, PX, PY, fn) {
  const rect = el('rect', {fill: '#d9ccf5', 'fill-opacity': .75, stroke: C.h, 'stroke-width': 1.5, 'pointer-events': 'none'}, s);
  const top = el('g', {}, s), line = el('path', {stroke: C.h, 'stroke-width': 4, 'stroke-linecap': 'round'}, top), dot = el('circle', {r: 7, fill: CT, stroke: '#fff', 'stroke-width': 2}, top), ball = el('circle', {r: 6, fill: C.h, stroke: '#fff', 'stroke-width': 2}, top), lt = el('g', {}, top);
  let run = 0;
  const hide = () => { run++; set(rect, {width: 0, height: 0}); line.setAttribute('d', ''); dot.setAttribute('opacity', 0); ball.setAttribute('opacity', 0); lt.textContent = ''; };
  hide();
  return {hide, async show(a, b, t, name) {
    hide(); const my = ++run, ok = () => my === run, go = (cb, o) => play(q => { if (ok()) cb(q); }, o), x = PX(t), y = PY(fn(t)), g = PY(0);
    dot.setAttribute('opacity', 1);
    await go(q => set(dot, {cx: x, cy: lerp(g - 60, g, q)}), {duration: .7, bounce: .5}); if (!ok()) return false;
    mt(lt, x, g + 44, `${name}=${num(t)}`, {style: `fill:${CT};font-weight:700;paint-order:stroke;stroke:#fff;stroke-width:5px`});
    ball.setAttribute('opacity', 1);
    await go(q => { const v = lerp(g, y, q); line.setAttribute('d', `M${x} ${g}V${v}`); set(ball, {cx: x, cy: v}); }, {ease: 'easeInOut', duration: .9}); if (!ok()) return false;
    await go(q => { const l = lerp(x, PX(a), q), r = lerp(x, PX(b), q); set(rect, {x: l, width: Math.max(0, r - l), y, height: g - y}); }, {duration: .6, bounce: 0});
    return ok();
  }};
}
const onOnly = (sel, b) => $$(sel + ' button').forEach(e => e.classList.toggle('on', e === b));
const NAME = {lo: '最矮的', any: '任意一位', hi: '最高的'};

// ── x² 在 [2,4]
(() => {
  const s = $('#ga'), PX = v => 34 + v * 62, PY = v => 204 - v * 10.6, sq = x => x * x;
  el('path', {d: poly([[PX(2), PY(0)], ...xs(2, 4, 40).map(x => [PX(x), PY(sq(x))]), [PX(4), PY(0)]], true), fill: '#eef5fa'}, s);
  el('path', {d: `M8 ${PY(0)}H346M${PX(0)} ${PY(0) + 8}V14`, stroke: C.ink, 'stroke-width': 1.6}, s);
  el('path', {d: `M346 ${PY(0) - 5}l9 5l-9 5zM${PX(0) - 5} 16l5 -9l5 9z`, fill: C.ink}, s);
  mt(s, 350, PY(0) + 20, 'x'); mt(s, PX(0) + 14, 18, 'y');
  [4, 9, 16].forEach(v => { el('path', {d: `M${PX(0) - 4} ${PY(v)}h8`, stroke: C.ink}, s); mt(s, PX(0) - 16, PY(v) + 6, String(v)); });
  [2, 4].forEach(v => { el('path', {d: `M${PX(v)} ${PY(0)}V${PY(sq(v))}`, stroke: C.mu, 'stroke-dasharray': '4 3'}, s); });
  [1, 2, 3, 4].forEach(v => mt(s, PX(v), PY(0) + 21, String(v)));
  const r = repDraw(s, PX, PY, sq);
  el('path', {d: poly(xs(0, 4.15, 80).map(x => [PX(x), PY(sq(x))])), fill: 'none', stroke: C.b, 'stroke-width': 3, 'pointer-events': 'none'}, s);
  mt(s, PX(1.25), PY(6), 'y=f(x)');
  let first = true;
  $$('#wa button').forEach(b => b.onclick = async () => {
    const w = b.dataset.w, t = w === 'lo' ? 2 : w === 'hi' ? 4 : first ? 3 : Math.round((2.1 + Math.random() * 1.8) * 10) / 10; if (w === 'any') first = false;
    onOnly('#wa', b); $('#ta').textContent = num(t); $('#fa').textContent = '…'; $('#ra').textContent = '…'; $('#sa').textContent = `派${NAME[w]}：先站到位置 ${num(t)}，再往上走。`;
    if (!await r.show(2, 4, t, 't_{i}')) return;
    $('#fa').textContent = num(sq(t)); $('#ra').textContent = num(sq(t) * 2);
    $('#sa').innerHTML = `派${NAME[w]}：${ks(`${KT('t_i')}=${num(t)}`)}，${ks(`${KH('f(t_i)')}=${num(t)}^2=${num(sq(t))}`)}。<br>矩形面積是 <b>${num(sq(t))} × 2 ＝ ${num(sq(t) * 2)}</b>，不是 ${num(t)} × 2。`;
  });
})();

// ── 我們的圖，3 段各派一位
(() => {
  const s = $('#gb'), n = 3, w = (B - A) / n, reps = [null, null, null]; let i = 2; const used = [0, 0, 0];
  el('path', {d: areaPath(A, B), fill: '#eef5fa'}, s);
  const band = el('rect', {y: 14, height: Y(0) - 14, width: w * SX, fill: '#fff2cc'}, s), done = el('g', {}, s);
  for (let k = 1; k < n; k++) el('path', {d: `M${X(A + w * k)} ${Y(0)}V${Y(f(A + w * k))}`, stroke: C.mu}, s);
  axis(s); sides(s);
  for (let k = 0; k <= n; k++) mt(s, X(A + w * k), Y(0) + 21, String(A + w * k), {style: 'fill:#566473'});
  const r = repDraw(s, X, Y, f); curve(s);
  const ghosts = () => { done.textContent = ''; reps.forEach((t, k) => { if (t !== null && k !== i) el('rect', {x: X(A + w * k), width: w * SX, y: Y(f(t)), height: Y(0) - Y(f(t)), fill: '#d9ccf5', 'fill-opacity': .4, stroke: C.h, 'stroke-opacity': .5}, done); }); };
  const eq = v => Math.abs(v - +fx(v)) < 1e-9 ? '=' : '\\approx';
  const stat = v => {
    $('#tbl').innerHTML = `${ks(sub(i + 1))}（位置）<b class="ct">${reps[i] === null ? '?' : num(reps[i])}</b>`; $('#fbl').innerHTML = `${ks(`f(t_${i + 1})`)}（高度）<b class="ch">${reps[i] === null ? '?' : v ? num(f(reps[i])) : '…'}</b>`;
    const all = reps.every(t => t !== null); $('#rb').textContent = all && v ? fx(reps.reduce((a, t) => a + f(t), 0) * w) : `${reps.filter(t => t !== null).length}/3 段`;
  };
  const seg = (k, b) => {
    const x = X(A + w * i), z = X(A + w * k); i = k; onOnly('#ib', b); onOnly('#wb', null); r.hide(); ghosts(); stat(true);
    tween(t => band.setAttribute('x', lerp(x, z, t)), {duration: .5, bounce: .2});
    $('#sb').innerHTML = `第 ${k + 1} 段是 ${A + w * k} 到 ${A + w * (k + 1)}。派誰當 ${ks(sub(k + 1))}？`;
  };
  $$('#ib button').forEach((b, k) => b.onclick = () => seg(k, b));
  $$('#wb button').forEach(b => b.onclick = async () => {
    const a = A + w * i, c = a + w, e = ext(a, c), m = b.dataset.w, k = i;
    const t = m === 'lo' ? e.xm : m === 'hi' ? e.xM : !used[k]++ ? a + w / 2 : Math.round((a + .1 + Math.random() * (w - .2)) * 10) / 10;
    reps[k] = t; onOnly('#wb', b); ghosts(); stat(false); $('#sb').textContent = `派${NAME[m]}：站到位置 ${num(t)}，往上走到曲線。`;
    if (!await r.show(a, c, t, sub(k + 1).replace(/_(\d)/, '_{$1}'))) return;
    stat(true);
    const mid = m !== 'any' && t > a && t < c, all = reps.every(q => q !== null);
    $('#sb').innerHTML = `派${NAME[m]}：${ks(`${KT(sub(k + 1))}=${num(t)}`)}，${ks(`${KH(`f(t_${k + 1})`)}${eq(f(t))}${num(f(t))}`)}。` + (mid ? `${m === 'lo' ? '最矮' : '最高'}的<b>不在端點</b>，所以不能只看左右兩端。` : '') + (all ? '<br>三段都派好了。<b>換一位代表，黎曼和就跟著變。</b>' : `<br>再點其他段，把三段都派完。`);
  });
  band.setAttribute('x', X(A + w * i)); stat(true);
})();

// ── 換你試試
(() => {
  const items = [
    {q: `${ks('t_i')} 是多少？`, a: 1, w: `${ks('x^2')} 在 1 到 3 越走越高，最高的位置在 ${ks('t_i=3')}。`, h: ['1 這個位置是最矮的，這次要派最高的。', '', '9 是高度。這題問的是<b>位置</b>。']},
    {q: `${ks('f(t_i)')} 是多少？`, a: 2, w: `把 ${ks('t_i=3')} 代進去：${ks('f(3)=3^2=9')}。`, h: ['1 是最矮的高度。這次派的是最高的。', '3 是<b>位置</b>。把它代進 ' + ks('x^2') + '，才是高度。', '']}];
  items.forEach(q => {
    const d = document.createElement('div'); d.className = 'q'; d.innerHTML = `<div>${q.q}</div><div class="seg">${[1, 3, 9].map(v => `<button>${v}</button>`).join('')}</div><div class="ans" aria-live="polite"></div>`; $('#try').appendChild(d);
    const bs = [...d.querySelectorAll('button')], an = d.querySelector('.ans');
    bs.forEach((b, i) => b.onclick = () => { const ok = i === q.a; bs.forEach(e => { e.className = ''; }); b.className = ok ? 'hit' : 'miss'; an.className = 'ans ' + (ok ? 'ok' : 'no'); an.innerHTML = ok ? '對！' + q.w : q.h[i]; });
  });
})();

// ── PART 4：越切越細
(() => {
  const s = $('#g2'), g = el('g', {}, s); curve(s); axis(s); sides(s); ab(s);
  const h = $('#h2'), HX = n => 48 + Math.log2(n) / Math.log2(100) * 280, HY = v => 80 - (v - 30) * 3.9;
  el('path', {d: 'M40 6V160H345', stroke: C.mu, fill: 'none'}, h);
  el('path', {d: `M40 ${HY(30)}H345`, stroke: C.g, 'stroke-width': 2, 'stroke-dasharray': '5 4'}, h);
  mt(h, 22, HY(30) + 6, '30', {style: `fill:${C.g}`});
  [1, 4, 16, 64].forEach(n => { el('path', {d: `M${HX(n)} 160v5`, stroke: C.mu}, h); mt(h, HX(n), 181, String(n)); });
  mt(h, 350, 181, 'n');
  const dots = el('g', {}, h), I = $('#n2');
  const rnd = (i, n) => { const v = Math.sin(i * 127.1 + n * 311.7 + 7.3) * 43758.5453; return v - Math.floor(v); };
  let mode = 'x', cur = [], an, run = 0, auto = 0;
  const heights = n => { const d = (B - A) / n; return Array.from({length: n}, (_, i) => f(A + d * (i + ({l: 0, m: .5, r: 1}[mode] ?? rnd(i, n))))); };
  const draw = hs => bars(g, hs, {fill: C.bl, stroke: C.b});
  const upd = () => {
    const n = +I.value, to = heights(n), from = regrid(cur, n), S = total(to);
    $('#n2-o').textContent = `n = ${n}`; $('#s2').textContent = fx(S); $('#e2').textContent = fx(Math.abs(S - AREA));
    if (an) an.stop();
    const my = ++run; cur = from; draw(cur);
    an = tween(t => { if (my === run) { cur = to.map((v, j) => lerp(from[j], v, t)); draw(cur); } }, {duration: .6, bounce: .2});
    [...dots.children].forEach(e => set(e, {fill: C.b, 'fill-opacity': .5}));
    const c = el('circle', {cx: HX(n), cy: HY(S), r: 7, fill: C.w}, dots);
    tween(t => c.setAttribute('r', Math.max(0, 7 * t)), {bounce: .5});
    while (dots.childNodes.length > 150) dots.firstChild.remove();
  };
  I.oninput = () => { auto++; upd(); };
  $$('#t2 button').forEach(b => b.onclick = () => { auto++; mode = b.dataset.m; $$('#t2 button').forEach(e => e.classList.toggle('on', e === b)); upd(); });
  $('#p2').onclick = async () => {
    const my = ++auto;
    for (const n of [1, 2, 4, 8, 16, 32, 64]) { if (my !== auto) return; I.value = n; upd(); await wait(1); }
  };
  upd();
})();

// ── PART 5：每段的 M_i、m_i
(() => {
  const s = $('#g3'), N = 5, D = (B - A) / N, seen = new Set();
  el('path', {d: areaPath(A, B), fill: '#eef5fa'}, s);
  const band = el('path', {fill: '#dcebf5'}, s);
  const lo = el('rect', {fill: C.gl, 'fill-opacity': .75, stroke: C.g, 'stroke-width': 1.5}, s);
  for (let i = 1; i < N; i++) el('path', {d: `M${X(A + D * i)} ${Y(0)}V${Y(f(A + D * i))}`, stroke: C.mu, 'stroke-width': 1}, s);
  axis(s); curve(s); sides(s);
  for (let i = 0; i <= N; i++) mt(s, X(A + D * i), Y(0) + 20, `x_{${i}}`);
  const hi = el('rect', {fill: C.rl, 'fill-opacity': .3, stroke: C.r, 'stroke-width': 1.5}, s);
  const marks = el('g', {}, s), ball = el('circle', {r: 7, fill: C.w, stroke: '#fff', 'stroke-width': 2, opacity: 0}, s);
  let an, run = 0;
  const where = (x, a, b) => Math.abs(x - a) < 1e-9 ? '左端' : Math.abs(x - b) < 1e-9 ? '右端' : '<b>段的中間</b>';
  const pick = i => {
    const a = A + D * i, b = a + D, my = ++run; if (an) an.stop();
    $$('#b3 button').forEach((e, j) => e.classList.toggle('on', j === i));
    band.setAttribute('d', areaPath(a, b, f, 30));
    const draw = q => {
      const x = lerp(a, b, q), e = ext(a, Math.max(a + 1e-9, x));
      set(ball, {cx: X(x), cy: Y(f(x)), opacity: 1});
      set(lo, {x: X(a), width: X(b) - X(a), y: Y(e.m), height: Y(0) - Y(e.m)});
      set(hi, {x: X(a), width: X(b) - X(a), y: Y(e.M), height: Y(0) - Y(e.M)});
    };
    marks.textContent = ''; $('#s3').textContent = `小球走第 ${i + 1} 段，紅線記錄最高、綠線記錄最低…`;
    an = tween(q => { if (my === run) draw(q); }, {ease: 'easeInOut', duration: 1.8, onComplete: () => {
      if (my !== run) return;
      const e = ext(a, b); seen.add(i); ball.setAttribute('opacity', 0);
      el('circle', {cx: X(e.xM), cy: Y(e.M), r: 6, fill: C.r, stroke: '#fff', 'stroke-width': 1.5}, marks);
      el('circle', {cx: X(e.xm), cy: Y(e.m), r: 6, fill: C.g, stroke: '#fff', 'stroke-width': 1.5}, marks);
      mt(marks, X(a + D / 2), Y(e.M) - 12, `M_{${i + 1}}`, {style: `fill:${C.r}`});
      mt(marks, X(a + D / 2), Y(e.m) + 22, `m_{${i + 1}}`, {style: `fill:${C.g}`});
      $('#s3').innerHTML = `第 ${i + 1} 段：${ks(`${KR(`M_${i + 1}`)}\\approx${fx(e.M)}`)}，在${where(e.xM, a, b)}；${ks(`${KG(`m_${i + 1}`)}\\approx${fx(e.m)}`)}，在${where(e.xm, a, b)}。` + (seen.size === N ? '<br>五段都看過了：最高、最低點<b>不一定在端點</b>。' : '');
    }});
  };
  for (let i = 0; i < N; i++) { const b = document.createElement('button'); b.textContent = `第${i + 1}段`; b.onclick = () => pick(i); $('#b3').appendChild(b); }
})();

// ── PART 6：下和、上和
(() => {
  const s = $('#g4'), gU = el('g', {}, s), gL = el('g', {}, s); curve(s); axis(s); sides(s); ab(s);
  const I = $('#n4'); let mode = 'B', cl = [], cu = [], an, run = 0;
  const draw = () => { bars(gU, cu, {fill: C.rl, stroke: C.r}); bars(gL, cl, {fill: C.gl, stroke: C.g}); };
  const op = () => { gU.setAttribute('opacity', mode === 'L' ? 0 : 1); gL.setAttribute('opacity', mode === 'U' ? 0 : 1); };
  const text = () => {
    const n = +I.value, r = `\\frac{b-a}{n}`;
    $('#s4').innerHTML = mode === 'L' ? '<b class="cg">下和</b>：每個矩形都躲在曲線<b>下面</b>，所以只會少算，不會超過真正面積。' : mode === 'U' ? '<b class="cr">上和</b>：每個矩形都把曲線<b>蓋住</b>，所以只會多算，不會少於真正面積。' : `露出來的<span class="cr">紅色</span>就是上和比下和多的部分。${n >= 40 ? '切很細，紅色快不見了！' : `把 ${ks('n')} 拉大，看紅色變多還是變少。`}`;
    const l = `${KG('L_n')}&=${r}(m_1+m_2+\\cdots+m_n)`, u = `${KR('U_n')}&=${r}(M_1+M_2+\\cdots+M_n)`;
    K(`\\begin{aligned}${mode === 'L' ? l : mode === 'U' ? u : l + '\\\\[4pt]' + u}\\end{aligned}`, $('#f4'), true);
  };
  const upd = () => {
    const n = +I.value, e = exts(n), tl = e.map(v => v.m), tu = e.map(v => v.M), fl = regrid(cl, n), fu = regrid(cu, n);
    $('#n4-o').textContent = `n = ${n}`; $('#l4').textContent = fx(total(tl)); $('#u4').textContent = fx(total(tu)); text();
    if (an) an.stop();
    const my = ++run; cl = fl; cu = fu; draw();
    an = tween(t => { if (my === run) { cl = tl.map((v, j) => lerp(fl[j], v, t)); cu = tu.map((v, j) => lerp(fu[j], v, t)); draw(); } }, {duration: .6, bounce: 0});
  };
  I.oninput = upd;
  $$('#m4 button').forEach(b => b.onclick = () => { mode = b.dataset.m; $$('#m4 button').forEach(e => e.classList.toggle('on', e === b)); op(); text(); });
  op(); upd();
})();

// ── PART 7：夾擠
(() => {
  const s = $('#g5'), PX = v => 20 + (v - 11) * 11, ly = 118, I = $('#n5');
  const zone = el('rect', {y: 34, height: ly - 34, fill: '#fff6df'}, s);
  el('path', {d: `M10 ${ly}H350`, stroke: C.ink, 'stroke-width': 1.6}, s);
  [15, 20, 25, 35, 40].forEach(v => { el('path', {d: `M${PX(v)} ${ly}v6`, stroke: C.ink}, s); mt(s, PX(v), ly + 24, String(v), {style: 'font-size:14px'}); });
  const wl = el('rect', {y: 34, height: ly - 34, x: 0, fill: C.g}, s), wr = el('rect', {y: 34, height: ly - 34, fill: C.r}, s);
  const tl = mt(s, 0, 24, 'L_{n}', {style: `fill:${C.g}`}), tr = mt(s, 0, 24, 'U_{n}', {style: `fill:${C.r}`});
  el('path', {d: `M${PX(30)} 34V${ly + 8}`, stroke: C.ink, 'stroke-width': 2, 'stroke-dasharray': '4 3'}, s);
  el('text', {x: PX(30), y: ly + 43, 'text-anchor': 'middle', style: 'font-weight:700'}, s).textContent = '真正面積 30';
  const balls = el('g', {}, s);
  let L = 11, U = 41, an, run = 0, auto = 0, cnt = 0;
  const draw = () => {
    const a = PX(L), b = PX(U); set(wl, {x: Math.max(0, a - 12), width: Math.min(12, a)}); set(wr, {x: b, width: 12}); set(zone, {x: a, width: Math.max(0, b - a)});
    const gap = Math.max(0, 34 - (b - a)) / 2; tl.setAttribute('x', a - 4 - gap); tr.setAttribute('x', b + 4 + gap);
  };
  const upd = () => {
    const n = +I.value, e = exts(n), l = total(e.map(v => v.m)), u = total(e.map(v => v.M)), l0 = L, u0 = U;
    balls.textContent = ''; cnt = 0;
    $('#n5-o').textContent = `n = ${n}`; $('#l5').textContent = fx(l); $('#u5').textContent = fx(u); $('#w5').textContent = fx(u - l);
    $('#s5').innerHTML = n < 10 ? `${ks('n')} 還小，兩道牆隔很開，只知道面積在 ${fx(l)} 到 ${fx(u)} 之間。` : n < 60 ? '兩道牆越靠越近，中間能站的位置越來越小。' : '快貼在一起了！夾在中間的數，只剩 30 附近可以站。';
    if (an) an.stop();
    const my = ++run;
    an = tween(t => { if (my === run) { L = lerp(l0, l, t); U = lerp(u0, u, t); draw(); } }, {duration: .6, bounce: 0});
  };
  const drop = () => {
    const n = +I.value, d = (B - A) / n, S = total(Array.from({length: n}, (_, i) => f(A + d * (i + Math.random()))));
    const k = cnt++, c = el('circle', {cx: PX(S), cy: -10, r: 6, fill: C.b, 'fill-opacity': .75, stroke: '#fff', 'stroke-width': 1}, balls);
    tween(t => c.setAttribute('cy', lerp(-10, ly - 7 - (k % 5) * 3, t)), {duration: .9, bounce: .45, delay: (k % 5) * .12});
    return S;
  };
  $('#p5').onclick = () => {
    auto++; const v = Array.from({length: 5}, drop);
    $('#s5').innerHTML = `這 5 個黎曼和：${v.map(x => fx(x, 1)).join('、')}。<b>全都在兩道牆裡面</b>，因為每個 ${ks('f(t_i)')} 都介於 ${ks('m_i')} 和 ${ks('M_i')} 之間。`;
    while (balls.childNodes.length > 60) balls.firstChild.remove();
  };
  I.oninput = () => { auto++; upd(); };
  $('#q5').onclick = async () => { const my = ++auto; for (const n of [1, 2, 4, 8, 16, 32, 64, 100]) { if (my !== auto) return; I.value = n; upd(); await wait(1); } };
  upd();
})();

// ── PART 8：四步推理
(() => {
  const ST = [
    [`${KG('L_n')}\\le R\\text{ 的面積}\\le ${KR('U_n')}`, '下和只會少算、上和只會多算，所以面積永遠夾在中間。'],
    [`\\lim_{n\\to\\infty}${KG('L_n')}=\\lim_{n\\to\\infty}${KR('U_n')}`, `當 ${ks('n')} 趨近無限大，兩道牆夾到同一個數。`],
    [`R\\text{ 的面積}=\\lim_{n\\to\\infty}${KG('L_n')}=\\lim_{n\\to\\infty}${KR('U_n')}`, '<b>夾擠定理</b>：左右兩邊都跑到同一個數，夾在中間的只能也是那個數。'],
    [`\\begin{gathered}${KG('L_n')}\\le\\sum_{i=1}^{n}f(t_i)\\cdot\\Delta x\\le ${KR('U_n')}\\\\[4pt]R\\text{ 的面積}=\\lim_{n\\to\\infty}\\sum_{i=1}^{n}f(t_i)\\cdot\\Delta x\\end{gathered}`, `黎曼和也夾在兩道牆中間。再用一次夾擠定理：不管 ${ks('t_i')} 怎麼取，黎曼和的極限都是面積。`]];
  let k = 0;
  $('#nx').onclick = () => {
    const [t, w] = ST[k++], li = document.createElement('li');
    li.innerHTML = `<b class="cb">第 ${k} 步</b><div class="fm"></div><div>${w}</div>`; $('#proof').appendChild(li);
    K(t, li.querySelector('.fm'), true);
    if (!reduce) Motion.animate(li, {opacity: [0, 1], y: [18, 0]}, {type: 'spring', bounce: .25, duration: .7});
    if (k < ST.length) $('#nx').textContent = `看第 ${k + 1} 步`; else { $('#nx').parentNode.hidden = true; $('#end').hidden = false; }
  };
})();

quiz({key: 'gsat-math-integral-page2', title: '積分page2教學', items: [
  {t: 'x² 在 [0,2]、n=2 的下和', q: `${ks('f(x)=x^2')}，把 ${ks('[0,2]')} 等分 2 段，下和 ${ks('L_2')} 是多少？`, o: ['1', '2.5', '5'], a: 0,
    w: `兩段的最小值是 ${ks('m_1=0,\\ m_2=1')}，${ks('L_2=1\\times(0+1)=1')}。`, h: `兩段是 ${ks('[0,1]')} 和 ${ks('[1,2]')}，各找最小值，再乘 ${ks('\\Delta x=1')}。`},
  {t: '同上的上和', q: `承上題，上和 ${ks('U_2')} 是多少？`, o: ['1', '2.5', '5'], a: 2,
    w: `兩段的最大值是 ${ks('M_1=1,\\ M_2=4')}，${ks('U_2=1\\times(1+4)=5')}。`, h: '這次換成每段的最大值。'},
  {t: '4−x² 在 [−1,2] 的最大值', q: `${ks('f(x)=4-x^2')} 在 ${ks('[-1,2]')} 上的最大值是多少？`, o: ['0', '3', '4'], a: 2,
    w: `最高點在 ${ks('x=0')}，${ks('f(0)=4')}。它在段的中間，不在端點。`, h: `端點是 ${ks('f(-1)=3')}、${ks('f(2)=0')}。中間有沒有更高的？畫個圖看看。`},
  {t: '黎曼和 S 與上下和的關係', col: 1, q: `同一個 ${ks('n')}，隨便取 ${ks('t_i')} 得到黎曼和 ${ks('S')}，哪個一定對？`, o: [ks('S') + ' 等於真正面積', ks('L_n\\le S\\le U_n'), ks('S>U_n')], plain: ['S 等於真正面積', 'L_n≤S≤U_n', 'S>U_n'], a: 1,
    w: `每段都有 ${ks('m_i\\le f(t_i)\\le M_i')}，加起來就夾在中間。`, h: '回 PART 7 丟黎曼和，看它們都落在哪裡。'},
  {t: 'lim L_n = lim U_n = 8 時', q: `如果 ${ks('\\displaystyle\\lim_{n\\to\\infty}L_n=\\lim_{n\\to\\infty}U_n=8')}，那麼 ${ks('R')} 的面積是？`, o: ['8', '16', '無法確定'], a: 0,
    w: '夾擠定理：左右都跑到 8，面積只能是 8。黎曼和的極限也是 8。', h: '面積一直夾在下和、上和中間。兩邊都跑到 8 時，中間還能站在哪裡？'}]});
})();
