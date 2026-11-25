(() => {
'use strict';
const P4 = '#d9ccf5';

// ── PART 1：在上面
(() => {
  const P = plot('#g1', {x: [-.4, 8], y: [0, 7.4], h: 224, pad: [18, 20, 30, 22]}), s = P.s, full = el('path', {d: P.fill(A, B, f), fill: C.bl}, s), g = el('g', {}, s);
  P.axes(); P.curve(A, B, f); P.vline(A, f(A)); P.vline(B, f(B)); mt(s, P.X(A), P.Y(0) + 21, 'a'); mt(s, P.X(B), P.Y(0) + 21, 'b'); mt(s, P.X(5.2), P.Y(5.6), 'y=f(x)', {style: `fill:${C.b}`});
  let run = 0;
  $('#p1').onclick = () => {
    const my = ++run, n = 40, w = (B - A) / n; g.textContent = ''; full.setAttribute('opacity', 0);
    for (let i = 0; i < n; i++) { const x = A + w * i, v = f(x + w / 2), r = el('rect', {x: P.X(x), width: P.X(w) - P.X(0) + .3, y: P.Y(0), height: 0, fill: C.bl, stroke: C.b, 'stroke-width': .4}, g); tween(t => { if (my === run) set(r, {y: P.Y(v * t), height: Math.max(0, P.Y(0) - P.Y(v * t))}); }, {delay: i * .05, duration: .5, bounce: .2, onComplete: () => { if (my === run && i === n - 1) { g.textContent = ''; full.setAttribute('opacity', 1); } }}); }
  };
})();

// ── PART 2：翻上來
(() => {
  const P = plot('#g2', {x: [-.4, 8], y: [-7.2, 7.4], h: 268, pad: [14, 20, 12, 22]}), s = P.s, I = $('#k2'), m = x => -f(x);
  const gh = el('path', {d: P.fill(A, B, m), fill: '#fbeaec'}, s), ar = el('path', {}, s);
  P.axes(); P.curve(A, B, m, {'stroke-width': 2, 'stroke-dasharray': '5 4', stroke: '#8fb1c6'}); const cv = P.curve(A, B, m);
  mt(s, P.X(A) - 10, P.Y(0) - 8, 'a'); mt(s, P.X(B) + 10, P.Y(0) - 8, 'b');
  const r1 = mt(s, P.X(3.6), P.Y(-2.8), 'R_{1}', {style: `fill:${C.r};font-size:22px`}), r2 = mt(s, P.X(3.6), P.Y(2.6), 'R_{2}', {style: `fill:${C.g};font-size:22px`}), l1 = mt(s, P.X(4.2), P.Y(-6.8), 'y=f(x)', {style: `fill:${C.b}`}), l2 = mt(s, P.X(4.6), P.Y(6.4), 'y=−f(x)', {style: `fill:${C.g}`});
  let k = 0, an, run = 0;
  const draw = () => {
    const c = -Math.cos(Math.PI * k), g = x => f(x) * c; // c：−1 在下面，1 在上面
    ar.setAttribute('d', P.fill(A, B, g)); set(ar, {fill: c < 0 ? C.rl : C.gl, 'fill-opacity': .85}); cv.setAttribute('d', P.path(A, B, g)); cv.setAttribute('stroke', c < 0 ? C.b : C.g);
    r1.setAttribute('opacity', k < .1 || k > .9 ? 1 : 0); r2.setAttribute('opacity', k > .9 ? 1 : 0); l2.setAttribute('opacity', k > .9 ? 1 : 0); gh.setAttribute('opacity', k > .05 ? 1 : 0);
    I.value = Math.round(k * 100); $('#k2-o').textContent = `翻 ${Math.round(k * 100)}%`;
    onOnly('#b2', k < .02 ? $('#b2 [data-m="0"]') : k > .98 ? $('#b2 [data-m="1"]') : null);
    $('#s2').innerHTML = k < .02 ? `${ks('R_1')} 在下面。定積分是<b class="cr">負的</b>。` : k > .98 ? `翻上來變成 ${ks('R_2')}，<b>大小跟 ${ks('R_1')} 一樣</b>，定積分變成正的。` : '翻的時候，每個點的高度都換到另一邊…';
  };
  $$('#b2 button').forEach(b => b.onclick = () => { const to = +b.dataset.m, from = k, my = ++run; if (an) an.stop(); an = tween(t => { if (my === run) { k = lerp(from, to, t); draw(); } }, {ease: 'easeInOut', duration: 1.5}); });
  I.oninput = () => { run++; if (an) an.stop(); k = +I.value / 100; draw(); };
  draw();
})();
stepper('#st2', [
  {h: '看正負', t: 'x^2-2x=x(x-2)\\le0', s: '0 到 2 之間，一個因式正、一個負，乘起來是負的。<b class="cr">圖形在 x 軸下方。</b>'},
  {h: '前面加負號', t: `\\text{面積}=${KR('-')}\\int_0^2(x^2-2x)\\,dx`, s: '翻上來，所以加負號。'},
  {h: '找反導函數、代進去', t: `=${KR('-')}\\left(\\frac{x^3}{3}-x^2\\right)\\Big|_0^2=${KR('-')}\\left(\\frac83-4\\right)`, s: '上限 2 代進去，下限 0 代進去是 0。'},
  {h: '算出來', t: `=${KR('-')}\\left(-\\frac43\\right)=\\frac43`, s: '面積是正的 ✓　如果算出負的，就是忘了加負號。'}]);

// ── PART 3：三塊
const q = x => x * x - 4 * x + 3, Q = x => x ** 3 / 3 - 2 * x * x + 3 * x;
const SEG = [[0, 1], [1, 3], [3, 4]];
const base = (sel, h = 250) => { const P = plot(sel, {x: [-.5, 4.7], y: [-1.5, 3.4], h, pad: [18, 20, 14, 24]}); return P; };
const ticks = P => { [[0, 'a=0', -22], [1, 'c=1', -20], [3, 'd=3', 20], [4, 'b=4', 16]].forEach(([v, t, d]) => { el('circle', {cx: P.X(v), cy: P.Y(0), r: 3.5, fill: C.ink}, P.g); mt(P.g, P.X(v) + d, P.Y(0) + 20, t, {style: 'font-size:15px'}); }); };
(() => {
  const P = base('#g3'), s = P.s, ps = SEG.map(([a, b], i) => el('path', {d: P.fill(a, b, q), fill: i === 1 ? C.rl : C.bl, opacity: .35}, s)), hi = el('g', {}, s);
  P.axes({o: false}); P.curve(0, 4, q); P.vline(0, 3); P.vline(4, 3); ticks(P);
  [[.36, .5], [2, -.6], [3.64, .5]].forEach(([x, y], i) => mt(s, P.X(x), P.Y(y) + 6, `R_{${i + 1}}`, {style: HALO.replace('5px', '4px') + 'font-weight:700'}));
  let run = 0; const seen = new Set();
  $$('#b3 button').forEach((b, i) => b.onclick = () => {
    const my = ++run, [x0, x1] = SEG[i], up = i !== 1; onOnly('#b3', b); hi.textContent = ''; ps.forEach((p, j) => p.setAttribute('opacity', j === i ? 1 : .25)); seen.add(i);
    const n = 24, w = (x1 - x0) / n;
    for (let j = 0; j < n; j++) { const x = x0 + w * j, v = q(x + w / 2), r = el('rect', {x: P.X(x), width: P.X(w) - P.X(0), y: P.Y(0), height: 0, fill: up ? C.b : C.r, 'fill-opacity': .5}, hi); tween(t => { if (my === run) set(r, {y: Math.min(P.Y(0), P.Y(v * t)), height: Math.abs(P.Y(v * t) - P.Y(0))}); }, {delay: j * .03, duration: .4, bounce: .2}); }
    K(up ? '\\tfrac43' : '-\\tfrac43', $('#i3')); $('#i3').className = up ? 'cb' : 'cr'; K('\\tfrac43', $('#a3')); $('#a3').className = 'ch';
    $('#s3').innerHTML = (up ? `${ks(`R_${i + 1}`)} 在<b class="cb">上面</b>：定積分是正的，<b>就是面積</b>。` : `${ks('R_2')} 在<b class="cr">下面</b>：定積分是負的，面積要<b>加負號</b>變正的。`) + `<br>${ks(`\\int_${x0}^${x1}(x^2-4x+3)\\,dx=${up ? '' : '-'}\\tfrac43`)}` + (seen.size === 3 ? '<br>三塊剛好一樣大，都是 4/3。' : '');
  });
})();

// ── 同一張圖，兩個問題
(() => {
  const P = base('#g4', 262), s = P.s, defs = el('defs', {}, s), cp = el('clipPath', {id: 'hole'}, defs), cr = el('rect', {x: 0, width: 360, y: P.Y(0), height: 0}, cp);
  const r1 = el('path', {fill: C.bl}, s), r2 = el('path', {fill: C.rl}, s), dirt = el('path', {d: P.fill(1, 3, q), fill: C.bl, 'clip-path': 'url(#hole)'}, s), r3 = el('path', {d: P.fill(3, 4, q), fill: C.bl}, s), up = el('path', {fill: P4, stroke: C.h, 'stroke-width': 1.5}, s);
  P.axes({o: false}); P.curve(0, 4, q); P.vline(0, 3); P.vline(4, 3); ticks(P);
  const gr = el('g', {}, s), out = el('g', {}, s); let run = 0;
  const reset = () => { run++; gr.textContent = out.textContent = ''; r1.setAttribute('d', P.fill(0, 1, q)); r1.setAttribute('opacity', 1); r2.setAttribute('d', P.fill(1, 3, q)); r2.setAttribute('opacity', 1); up.setAttribute('d', ''); set(cr, {y: P.Y(-1), height: 0}); };
  const num3 = (x, y, t, c) => { const e = mt(out, P.X(x), P.Y(y) + 6, t, {style: HALO + `fill:${c};font-weight:700;font-size:20px`}); tween(t => e.setAttribute('opacity', Math.min(1, Math.max(0, t))), {ease: 'easeOut', duration: .4}); };
  $$('#b4 button').forEach(b => b.onclick = async () => {
    reset(); const my = run, ok = () => my === run, go = (cb, o) => play(t => { if (ok()) cb(t); }, o); onOnly('#b4', b);
    if (b.dataset.m === 'i') {
      $('#s4').textContent = '把左邊的土堆，推進坑裡…'; K('\\int_0^4f(x)\\,dx=\\,?', $('#f4'), true); await wait(.5); if (!ok()) return;
      for (let i = 0; i < 26; i++) { const x = .08 + (i % 13) / 13 * .6, y = q(x) * .8 * Math.random(), X2 = 1.3 + Math.random() * 1.4, c = el('circle', {r: 4.5, fill: '#5d9cc4', opacity: 0}, gr); tween(t => { if (ok()) set(c, {cx: P.X(lerp(x, X2, t)), cy: lerp(P.Y(y), P.Y(q(X2) * .5), t) - Math.sin(t * 3.14) * 46, opacity: t > 0 && t < 1 ? 1 : 0}); }, {ease: 'easeInOut', duration: 1, delay: i * .055}); }
      await go(t => { const k = Math.max(0, Math.min(1, t)); r1.setAttribute('d', P.fill(0, 1, x => q(x) * (1 - k))); set(cr, {y: P.Y(-1 + k), height: Math.max(0, P.Y(-1) - P.Y(-1 + k) + 1)}); }, {ease: 'easeInOut', duration: 2.4}); if (!ok()) return;
      r2.setAttribute('opacity', 0); dirt.setAttribute('opacity', 1); gr.textContent = ''; await go(t => { r3.setAttribute('transform', `translate(${P.X(4)} ${P.Y(0)}) scale(${1 + .08 * Math.sin(t * 3.14)}) translate(${-P.X(4)} ${-P.Y(0)})`); }, {ease: 'linear', duration: .6}); if (!ok()) return;
      r3.setAttribute('transform', ''); num3(2, -.45, '填平', C.b); num3(3.62, .6, '4/3', C.b);
      K('\\int_0^4f(x)\\,dx=\\tfrac43-\\tfrac43+\\tfrac43=\\tfrac43', $('#f4'), true); $('#s4').innerHTML = `土堆剛好把坑<b>填平</b>，只剩右邊那堆。<b class="cb">定積分 ＝ 剩下的 4/3。</b>`;
    } else {
      $('#s4').textContent = '把坑洞翻上來…'; K('\\text{面積}=\\,?', $('#f4'), true); r2.setAttribute('opacity', .35);
      await go(t => up.setAttribute('d', P.fill(1, 3, x => q(x) * Math.cos(Math.PI * t))), {ease: 'easeInOut', duration: 1.6}); if (!ok()) return;
      for (const [x, y] of [[.34, .62], [2, .45], [3.66, .62]]) { num3(x, y, '4/3', C.h); await wait(.45); if (!ok()) return; }
      K('\\text{面積}=\\tfrac43+\\tfrac43+\\tfrac43=4', $('#f4'), true); $('#s4').innerHTML = `三塊都是正的，全部加起來。<b class="ch">面積 ＝ 4。</b>`;
    }
  });
  reset();
})();

// ── PART 4：四步驟
(() => {
  const g = x => x * x - 1, P = plot('#g5', {x: [-.4, 2.5], y: [-1.5, 3.4], h: 240, pad: [18, 20, 14, 26]}), s = P.s, n = el('path', {fill: C.rl}, s), p = el('path', {fill: C.bl}, s), fl = el('path', {fill: P4, stroke: C.h, 'stroke-width': 1.5}, s);
  P.axes({o: false}); const cv = P.curve(0, 2.05, g); const sd = P.vline(2, 3); mt(s, P.X(0) - 11, P.Y(0) + 18, '0'); mt(s, P.X(2) + 10, P.Y(0) + 20, '2', {style: HALO});
  const d1 = el('g', {}, s); el('circle', {cx: P.X(1), cy: P.Y(0), r: 7, fill: C.w, stroke: '#fff', 'stroke-width': 2}, d1); mt(d1, P.X(1) + 12, P.Y(0) + 22, '1', {style: HALO + `fill:${C.w};font-weight:700`});
  const lb = el('g', {}, s); let run = 0;
  stepper('#st5', [
    {h: '畫圖', s: `先畫出 ${ks('y=x^2-1')}，標出 0 和 2。<b>畫圖最重要。</b>`},
    {h: '找和 x 軸的交點', t: 'x^2-1=0\\ \\Rightarrow\\ x=1', s: `${ks('x=-1')} 不在 0 到 2 裡面，不用管。`},
    {h: '分段，看正負', t: `[0,1]\\text{ 在}${KR('\\text{下面}')},\\quad[1,2]\\text{ 在}${KB('\\text{上面}')}`, s: '交點就是切開的地方。'},
    {h: '下面的加負號，再相加', t: `\\begin{aligned}\\text{面積}&=${KR('-')}\\int_0^1(x^2-1)\\,dx\\\\&\\quad+\\int_1^2(x^2-1)\\,dx\\\\&=${KR('-')}\\left(-\\tfrac23\\right)+\\tfrac43=2\\end{aligned}`, s: `下面那塊翻上來是 ${ks('\\frac23')}，上面那塊是 ${ks('\\frac43')}，總共 <b>2</b>。`}
  ], (k, first) => {
    const my = ++run, go = (cb, o) => tween(t => { if (my === run) cb(t); }, o); lb.textContent = ''; fl.setAttribute('d', ''); n.setAttribute('opacity', 1);
    d1.setAttribute('opacity', k >= 1 ? 1 : 0); n.setAttribute('d', k >= 2 ? P.fill(0, 1, g) : ''); p.setAttribute('d', k >= 2 ? P.fill(1, 2, g) : '');
    if (k === 0) { const L = cv.getTotalLength(); cv.setAttribute('stroke-dasharray', L); sd.setAttribute('opacity', 0); if (first) { cv.setAttribute('stroke-dashoffset', 0); sd.setAttribute('opacity', 1); } else go(t => { cv.setAttribute('stroke-dashoffset', L * (1 - t)); sd.setAttribute('opacity', t); }, {ease: 'easeInOut', duration: 1.2}); } else { cv.setAttribute('stroke-dasharray', 'none'); sd.setAttribute('opacity', 1); }
    if (k === 1) go(t => d1.setAttribute('transform', `translate(0 ${-50 * (1 - t)})`), {duration: .8, bounce: .5}); else d1.setAttribute('transform', '');
    if (k === 2) { mt(lb, P.X(.42), P.Y(-.5) + 6, '−', {style: `fill:${C.r};font-size:26px`}); mt(lb, P.X(1.75), P.Y(.7) + 6, '+', {style: `fill:${C.b};font-size:26px`}); }
    if (k === 3) { n.setAttribute('opacity', .35); go(t => fl.setAttribute('d', P.fill(0, 1, x => g(x) * Math.cos(Math.PI * t))), {ease: 'easeInOut', duration: 1.4, onComplete: () => { if (my === run) { mt(lb, P.X(.36), P.Y(.4) + 6, '2/3', {style: `fill:${C.h};font-weight:700`}); mt(lb, P.X(1.74), P.Y(.7) + 6, '4/3', {style: `fill:${C.b};font-weight:700`}); } }}); }
  });
})();

// ── PART 5、6：奇函數、偶函數
const sym = (id, btn, sayId, fn, odd) => {
  const P = plot(id, {x: [-2.4, 2.4], y: odd ? [-2.6, 2.6] : [-.3, 2.6], h: odd ? 310 : 270, pad: [14, 18, 50, 18]}), s = P.s, R = el('path', {fill: C.bl}, s), L = el('path', {fill: odd ? C.rl : C.bl}, s), mv = el('path', {fill: C.gl, 'fill-opacity': .8, stroke: C.g, 'stroke-width': 1.5, opacity: 0}, s);
  P.axes({o: false}); P.curve(-2.15, 2.15, fn); mt(s, P.X(0) + 9, P.Y(0) + 18, 'O');
  const v = el('path', {stroke: C.ink, 'stroke-width': 1.8}, s), ta = mt(s, 0, 0, 'a', {style: HALO + 'font-weight:700'}), tb = mt(s, 0, 0, '−a', {style: HALO + 'font-weight:700'}), m1 = mt(s, 0, 0, '+', {style: `fill:${C.b};font-size:26px`}), m2 = mt(s, 0, 0, odd ? '−' : '+', {style: `fill:${odd ? C.r : C.b};font-size:26px`});
  let a = odd ? 1.9 : 1.7, run = 0;
  const draw = () => {
    run++; mv.setAttribute('opacity', 0); R.setAttribute('d', P.fill(0, a, fn)); L.setAttribute('d', P.fill(-a, 0, fn)); v.setAttribute('d', `M${P.X(a)} ${P.Y(0)}V${P.Y(fn(a))}M${P.X(-a)} ${P.Y(0)}V${P.Y(fn(-a))}`);
    set(ta, {x: P.X(a), y: P.Y(0) + 21}); set(tb, {x: P.X(-a), y: odd ? P.Y(0) - 9 : P.Y(0) + 21});
    const o = a > 1.35 ? 1 : 0; set(m1, {x: P.X(a * .78), y: P.Y(fn(a * .78) * .45) + 7, opacity: o}); set(m2, {x: P.X(-a * .78), y: P.Y(fn(-a * .78) * .45) + 7, opacity: o});
  };
  const H = handle(P, {v: a, min: .6, max: 2, step: .1, y: P.h - 22, color: C.h, label: 'a 的位置', gap: 26, on: x => { a = x; draw(); }, demo: -.5});
  $(btn).onclick = () => {
    H.stop(); draw(); const my = run, x0 = P.X(0), y0 = P.Y(0); mv.setAttribute('d', P.fill(0, a, fn)); mv.setAttribute('opacity', 1); $(sayId).innerHTML = odd ? '把右邊那塊，繞著原點轉半圈…' : '把右邊那塊，沿著 y 軸摺過去…';
    tween(t => { if (my === run) mv.setAttribute('transform', odd ? `rotate(${-180 * t} ${x0} ${y0})` : `translate(${x0} 0) scale(${Math.cos(Math.PI * t)} 1) translate(${-x0} 0)`); }, {ease: 'easeInOut', duration: 1.9, onComplete: () => { if (my === run) $(sayId).innerHTML = odd ? '<b>完全重疊</b>，所以兩塊一樣大。<br>可是一塊在上面（正）、一塊在下面（負），<b class="cr">加起來是 0</b>。' : '<b>完全重疊</b>，兩塊一樣大，而且<b>都是正的</b>。<br>算右邊一半，<b class="cg">再乘 2</b> 就好。'; }});
  };
  draw();
};
sym('#g6', '#p6', '#s6', x => x ** 3 / 3.6, true);
sym('#g7', '#p7', '#s7', x => x * x / 2, false);
(() => {
  const o = ['奇函數', '偶函數', '都不是'];
  mini('#try7', [
    {q: ks('x^3-2x'), o, a: 0, w: '次方是 3 和 1，都是奇數。', h: '看每一項的次方：3 和 1。'},
    {q: ks('x^4-3x^2+5'), o, a: 1, w: '次方是 4、2、0，都是偶數。常數 5 的次方是 0。', h: `5 可以看成 ${ks('5x^0')}，0 是偶數。`},
    {q: ks('x^2+x'), o, a: 2, w: '次方是 2 和 1，一偶一奇，所以都不是。', h: '次方是 2 和 1，是同一種嗎？'}]);
})();

// ── 奇偶拆開
(() => {
  const s = $('#g8'), T = [['x³', 52, 1], ['+3x²', 138, 0], ['−5x', 224, 1], ['+1', 308, 0]].map(([t, x, odd]) => { const g = el('g', {}, s), r = el('rect', {x: x - 38, y: 34, width: 76, height: 50, rx: 12, fill: '#eef2f5'}, g); mt(g, x, 67, t, {style: 'font-size:24px'}); const l = el('text', {x, y: 106, 'text-anchor': 'middle', style: `font-size:14px;font-weight:700;fill:${odd ? C.r : C.g}`, opacity: 0}, g); l.textContent = odd ? '奇' : '偶'; return {g, r, l, odd}; });
  let run = 0;
  stepper('#st8', [
    {h: '分兩堆', t: `${KR('x^3-5x')}\\quad\\big|\\quad${KG('3x^2+1')}`, s: `<b class="cr">奇數次方</b>一堆，<b class="cg">偶數次方</b>一堆。`},
    {h: '奇的那堆是 0', t: `\\int_{-2}^{2}${KR('(x^3-5x)')}\\,dx=0`, s: '上下限對稱，奇函數一正一負抵消。<b>完全不用算。</b>'},
    {h: '偶的那堆算一半', t: `2\\int_0^2${KG('(3x^2+1)')}\\,dx`, s: '從 0 積到 2，再乘 2。下限變成 0，代進去很輕鬆。'},
    {h: '算出來', t: `2(x^3+x)\\,\\Big|_0^2=2\\times10=20`, s: `${ks('8+2=10')}，再乘 2。答案是 <b>20</b>。`}
  ], k => {
    const my = ++run; T.forEach(({g, r, l, odd}, i) => {
      r.setAttribute('fill', odd ? '#fbe3e5' : '#d9f1e6'); tween(t => { if (my === run) l.setAttribute('opacity', Math.min(1, t)); }, {ease: 'easeOut', duration: .4, delay: i * .12});
      if (odd) { if (k === 1) tween(t => { if (my === run) set(g, {transform: `translate(0 ${60 * t}) `, opacity: 1 - t}); }, {ease: 'easeIn', duration: .9, delay: .2 + i * .15}); else set(g, {transform: '', opacity: k ? 0 : 1}); }
      else if (k === 2) tween(t => { if (my === run) g.setAttribute('transform', `translate(0 ${-10 * Math.sin(Math.max(0, Math.min(1, t)) * 3.14)})`); }, {ease: 'easeOut', duration: .6, delay: i * .1});
    });
  });
})();

quiz({key: 'gsat-math-integral-page6_7', title: '積分page6_7教學', items: [
  {t: 'f≤0、定積分 −5 的面積', q: `${ks('f(x)\\le0')}，而且 ${ks('\\displaystyle\\int_a^bf(x)\\,dx=-5')}。圖形和 x 軸圍成的面積是？`, o: ['5', ks('-5'), '0'], plain: ['5', '−5', '0'], a: 0, w: `整塊在下面，面積是 ${ks('-(-5)=5')}。`, h: '面積不會是負的。翻上來會變怎樣？'},
  {t: '上方 7、下方 3 的定積分', q: 'x 軸上方的面積和是 7，下方的面積和是 3。<b>定積分</b>是多少？', o: ['10', '4', ks('-4')], plain: ['10', '4', '−4'], a: 1, w: `上方減下方：${ks('7-3=4')}。`, h: '定積分是「結餘」，下面的要減。'},
  {t: '同上的總面積', q: '承上題，<b>總面積</b>是多少？', o: ['10', '4', '21'], a: 0, w: `每一塊都是正的：${ks('7+3=10')}。`, h: '這次問面積，下面的要翻上來，一起加。'},
  {t: 'x²−1 在 [−1,1] 與 x 軸的面積', q: `${ks('y=x^2-1')} 和 x 軸在 ${ks('-1')} 到 ${ks('1')} 之間圍成的面積是？`, o: [ks('\\frac43'), ks('-\\frac43'), '0'], plain: ['4/3', '−4/3', '0'], a: 0, w: `圖形在 x 軸下面，前面加負號。${ks('\\int_{-1}^1(x^2-1)\\,dx=-\\frac43')}，所以面積是 ${ks('\\frac43')}。`, h: '先畫圖：這一段在 x 軸上面還是下面？'},
  {t: '∫₋₃³(x⁵−4x³+2x)dx', q: `${ks('\\displaystyle\\int_{-3}^{3}(x^5-4x^3+2x)\\,dx=')}？`, o: ['0', '2', '算了才知道'], a: 0, w: '次方 5、3、1 都是奇數，是奇函數，上下限又對稱，所以是 0。', h: '看每一項的次方，是奇數還是偶數？'},
  {t: '∫₋₁¹(6x²+7x³)dx', q: `${ks('\\displaystyle\\int_{-1}^{1}(6x^2+7x^3)\\,dx=')}？`, o: ['0', '2', '4'], a: 2, w: `${ks('7x^3')} 那項是 0；${ks('2\\int_0^16x^2\\,dx=2\\times2=4')}。`, h: `${ks('7x^3')} 是奇函數，會變 0。${ks('6x^2')} 是偶函數，算一半再乘 2。`}]});
})();
