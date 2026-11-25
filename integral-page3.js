(() => {
'use strict';
const ab = s => { mt(s, X(A), Y(0) + 21, 'a'); mt(s, X(B), Y(0) + 21, 'b'); };

// ── PART 1：Σ 變成 ∫
(() => {
  const s = $('#g1'), full = el('path', {d: areaPath(A, B), fill: C.bl, opacity: 0}, s), g = el('g', {}, s);
  curve(s); axis(s); sides(s); ab(s);
  const big = ch => { const t = el('text', {'text-anchor': 'middle', y: 0, style: 'font-family:KaTeX_Size2,"Times New Roman",serif;font-size:40px'}, el('g', {}, s)); t.textContent = ch; return t.parentNode; };
  const S = big('∑'), I = big('∫');
  const st = (c, z = 24) => ({style: `fill:${c};font-size:${z}px`});
  const old = [mt(s, 112, 327, 'i=1', st(C.ink, 15)), mt(s, 112, 256, 'n', st(C.ink, 16)), mt(s, 178, 298, 'f(t_{i})', st(C.h)), mt(s, 250, 298, '· Δx', st(C.w))];
  const nw = [mt(s, 118, 333, 'a', st(C.ink, 17)), mt(s, 140, 264, 'b', st(C.ink, 17)), mt(s, 180, 298, 'f(x)', st(C.h)), mt(s, 234, 298, 'dx', st(C.w))];
  const draw = k => {
    old.forEach(e => e.setAttribute('opacity', Math.max(0, 1 - k * 1.6))); nw.forEach(e => e.setAttribute('opacity', Math.max(0, k * 1.6 - .6)));
    set(S, {transform: `translate(112 292) scale(${1 - .55 * k} ${1 + .35 * k})`, opacity: Math.max(0, 1 - k * 1.3)});
    set(I, {transform: `translate(112 292) scale(${1.5 - .65 * k} ${.5 + .35 * k})`, opacity: Math.max(0, k * 1.4 - .4)});
  };
  const N = [4, 16, 64, 0], SAY = ['4 條長方形，先加起來。', '16 條，跟曲線更貼了。', '64 條，快看不出是長方形了。', '切到無限細：<b>Σ 拉長變成 ∫</b>，<span class="ch">f(tᵢ) 變成 f(x)</span>，<span class="cw">Δx 變成 dx</span>。'];
  let k = 0, cur = [], run = 0, auto = 0, a1, a2;
  const go = i => {
    const my = ++run, n = N[i] || 64, d = (B - A) / n, to = Array.from({length: n}, (_, j) => f(A + d * (j + .7))), from = regrid(cur, n), k0 = k, k1 = i === 3 ? 1 : 0, o0 = +full.getAttribute('opacity');
    if (a1) a1.stop(); if (a2) a2.stop();
    $$('#b1 button').forEach((e, j) => e.classList.toggle('on', j === i));
    a1 = tween(t => { if (my !== run) return; cur = to.map((v, j) => lerp(from[j], v, t)); bars(g, cur, {fill: C.bl, stroke: C.b}); }, {duration: .7, bounce: .15});
    a2 = tween(t => { if (my !== run) return; k = lerp(k0, k1, t); draw(k); full.setAttribute('opacity', lerp(o0, k1, t)); g.setAttribute('opacity', 1 - lerp(o0, k1, t)); }, {ease: 'easeInOut', duration: 1.2});
    $('#v1').textContent = i === 3 ? '30' : fx(to.reduce((p, q) => p + q, 0) * d); $('#n1').textContent = i === 3 ? '∞' : n; $('#s1').innerHTML = SAY[i];
  };
  $$('#b1 button').forEach((b, i) => b.onclick = () => { auto++; go(i); });
  $('#p1').onclick = async () => { const my = ++auto; for (const i of [0, 1, 2, 3]) { if (my !== auto) return; go(i); await wait(1.5); } };
  draw(0); go(0);
})();

// ── PART 2：拆開符號；a、b 可拖
(() => {
  const P = plot('#g2', {x: [-.4, 8], y: [0, 7.6], h: 292, pad: [18, 20, 82, 22]}), s = P.s;
  const area = el('path', {fill: '#dcebf5'}, s); P.curve(A, B, f); P.axes();
  const hi = el('g', {'pointer-events': 'none'}, s), la = P.put('path', {stroke: C.ink, 'stroke-width': 1.8}), lb = P.put('path', {stroke: C.ink, 'stroke-width': 1.8});
  const ta = mt(s, 0, P.Y(0) + 22, 'a', {style: HALO + 'font-weight:700'}), tb = mt(s, 0, P.Y(0) + 22, 'b', {style: HALO + 'font-weight:700'});
  let a = 1.5, b = 5.5, now = '', an = [];
  const kill = () => { an.forEach(e => e.stop()); an = []; };
  const strip = (x, w, at) => el('rect', {x: P.X(x), y: P.Y(f(x + w / 2)), width: P.X(x + w) - P.X(x), height: P.Y(0) - P.Y(f(x + w / 2)), ...at}, hi);
  const SAY = {
    S: `${ks('\\int')}：長得像拉長的 S（Sum，總和）。意思是<b>全部加起來</b>。`,
    a: `${ks('a')} 叫<b>下限</b>：<b>從哪裡開始加</b>。寫在下面。`,
    b: `${ks('b')} 叫<b>上限</b>：<b>加到哪裡結束</b>。寫在上面。`,
    f: `${ks('f(x)')}：每一條的<b class="ch">高</b>。`,
    d: `${ks('dx')}：每一條的<b class="cw">寬</b>，很薄很薄。`};
  const formula = () => { const o = (k, t) => now === k ? `\\boxed{${t}}` : t; K(`${now === 'S' ? KG('\\int') : '\\int'}_{${o('a', 'a')}}^{${o('b', 'b')}}${o('f', KH('f(x)'))}\\,${o('d', KW('dx'))}`, $('#f2'), true); };
  const mark = anim => {
    kill(); hi.textContent = '';
    const go = (cb, o) => { if (!anim) return cb(1); an.push(tween(cb, o)); };
    if (now === 'S') { const n = 26, w = (b - a) / n; for (let i = 0; i < n; i++) { const r = strip(a + w * i, w, {fill: C.gl, stroke: C.g, 'stroke-width': .6, opacity: 0}); go(t => r.setAttribute('opacity', .8 * t), {ease: 'easeOut', duration: .2, delay: i * .05}); } }
    if (now === 'a' || now === 'b') { const v = now === 'a' ? a : b, p = el('path', {stroke: C.r, 'stroke-width': 5, 'stroke-linecap': 'round'}, hi); go(t => p.setAttribute('d', `M${P.X(v)} ${P.Y(0)}V${P.Y(f(v) * t)}`)); }
    if (now === 'f' || now === 'd') {
      const c = (a + b) / 2, w = .22; strip(c, w, {fill: '#f7dfc2', stroke: C.w});
      const p = el('path', {stroke: now === 'f' ? C.h : C.w, 'stroke-width': now === 'f' ? 5 : 8}, hi);
      if (now === 'f') go(t => p.setAttribute('d', `M${P.X(c + w / 2)} ${P.Y(0)}V${P.Y(f(c + w / 2) * t)}`));
      else { go(t => p.setAttribute('d', `M${P.X(c)} ${P.Y(0)}h${Math.max(0, (P.X(c + w) - P.X(c)) * t)}`)); mt(hi, P.X(c + w / 2), P.Y(0) + 24, 'dx', {style: HALO + `fill:${C.w};font-weight:700`}); }
    }
  };
  const draw = () => {
    area.setAttribute('d', P.fill(a, b, f)); la.setAttribute('d', `M${P.X(a)} ${P.Y(0)}V${P.Y(f(a))}`); lb.setAttribute('d', `M${P.X(b)} ${P.Y(0)}V${P.Y(f(b))}`);
    ta.setAttribute('x', P.X(a)); tb.setAttribute('x', P.X(b)); mark(false);
    K(`\\int_{${num(a)}}^{${num(b)}}f(x)\\,dx\\approx ${fx(GF(b) - GF(a))}`, $('#v2'), true);
  };
  handle(P, {v: a, min: 1, max: () => b - .8, step: .1, y: P.h - 24, color: CT, label: '下限 a', gap: 28, on: v => { a = v; draw(); }, demo: .5});
  handle(P, {v: b, min: () => a + .8, max: 7, step: .1, y: P.h - 24, color: C.r, label: '上限 b', gap: 28, on: v => { b = v; draw(); }, demo: -.6});
  ['S', 'a', 'b', 'f', 'd'].forEach(k => { const e = document.createElement('button'); K({S: '\\int', a: 'a', b: 'b', f: 'f(x)', d: 'dx'}[k], e); e.onclick = () => { now = k; onOnly('#b2', e); formula(); mark(true); $('#s2').innerHTML = SAY[k]; }; $('#b2').appendChild(e); });
  formula(); draw(); $('#s2').innerHTML = '五個零件都點點看。';
})();

// ── PART 3：收支
(() => {
  const P = plot('#g3', {x: [0, 7.6], y: [-5, 5], h: 226, pad: [14, 16, 14, 30]}), s = P.s;
  const rs = Array.from({length: 7}, () => el('rect', {'stroke-width': 1.5}, s));
  el('path', {d: `M${P.X(0)} ${P.Y(0)}H346M${P.X(0)} ${P.Y(-4.8)}V${P.Y(4.8)}`, stroke: C.ink, 'stroke-width': 1.8}, s);
  mt(s, P.X(0) - 14, P.Y(3) + 5, '+', {style: `fill:${C.b};font-size:22px`}); mt(s, P.X(0) - 14, P.Y(-3) + 5, '−', {style: `fill:${C.r};font-size:22px`});
  const ls = rs.map((_, i) => mt(s, P.X(i + .65), 0, '', {style: 'font-weight:700'}));
  const ptr = el('path', {d: 'M-7 -10h14l-7 9z', fill: C.w, opacity: 0}, s);
  const D = {p: [3, 2, -1, 4, -2, 1, 2], z: [3, -2, 1, -3, 2, -2, 1], n: [1, -3, 2, -4, -1, 1, -2]};
  let cur = [0, 0, 0, 0, 0, 0, 0], run = 0;
  const draw = () => cur.forEach((v, i) => { set(rs[i], {x: P.X(i + .3), width: P.X(.7) - P.X(0), y: Math.min(P.Y(0), P.Y(v)), height: Math.abs(P.Y(v) - P.Y(0)), fill: v >= 0 ? C.bl : C.rl, stroke: v >= 0 ? C.b : C.r}); set(ls[i], {y: v >= 0 ? P.Y(v) - 6 : P.Y(v) + 18}); });
  const lab = to => ls.forEach((e, i) => { e.textContent = (to[i] > 0 ? '+' : '−') + Math.abs(to[i]); e.style.fill = to[i] > 0 ? C.b : C.r; });
  const go = async k => {
    const my = ++run, to = D[k], from = cur.slice(); lab(to);
    $('#v3').textContent = '0'; $('#v3').className = ''; $('#s3').textContent = '一天一天加…'; ptr.setAttribute('opacity', 0);
    await play(t => { if (my === run) { cur = to.map((v, i) => lerp(from[i], v, t)); draw(); } }, {duration: .7, bounce: .25}); if (my !== run) return;
    let sum = 0; ptr.setAttribute('opacity', 1);
    for (let i = 0; i < 7; i++) { ptr.setAttribute('transform', `translate(${P.X(i + .65)} ${Math.min(P.Y(0), P.Y(to[i])) - (to[i] > 0 ? 22 : 4)})`); sum += to[i]; $('#v3').textContent = sgn(sum); $('#v3').className = sum > 0 ? 'cb' : sum < 0 ? 'cr' : ''; await wait(.45); if (my !== run) return; }
    ptr.setAttribute('opacity', 0);
    $('#s3').innerHTML = {p: '進來的比較多，結餘是<b class="cb">正的</b>。', z: '進來和花掉剛好一樣多，結餘是 <b>0</b>。<b>但是錢明明有進有出！</b>', n: '花掉的比較多，結餘是<b class="cr">負的</b>。'}[k];
  };
  $$('#b3 button').forEach(b => b.onclick = () => { onOnly('#b3', b); go(b.dataset.m); });
  cur = D.p.slice(); lab(D.p); draw();
})();

// ── PART 3 下半：上下搬動曲線
(() => {
  const P = plot('#g4', {x: [-.5, 3.6], y: [-6.6, 9.8], h: 262, pad: [16, 20, 14, 20]}), s = P.s;
  const pos = el('path', {fill: C.bl}, s), neg = el('path', {fill: C.rl}, s), sd = el('path', {stroke: C.ink, 'stroke-width': 1.5, 'stroke-dasharray': '4 3'}, s);
  P.axes(); const cv = P.curve(0, 3, x => x * x); mt(s, P.X(3) + 12, P.Y(0) + 20, '3', {style: HALO});
  const I = $('#c4'); let c = 0, an, run = 0, auto = 0;
  const draw = () => { const g = x => x * x - c; pos.setAttribute('d', P.pos(0, 3, g)); neg.setAttribute('d', P.neg(0, 3, g)); cv.setAttribute('d', P.path(0, 3, g)); sd.setAttribute('d', `M${P.X(3)} ${P.Y(0)}V${P.Y(g(3))}`); };
  const upd = () => {
    const to = +I.value, from = c, my = ++run, v = 9 - 3 * to; if (an) an.stop();
    an = tween(t => { if (my === run) { c = lerp(from, to, t); draw(); } }, {duration: .6, bounce: .15});
    $('#c4-o').textContent = `往下 ${num(to)}`; K(to ? `\\int_0^3\\left(x^2-${num(to)}\\right)dx=${num(v)}` : '\\int_0^3x^2\\,dx=9', $('#f4'), true);
    $('#s4').innerHTML = to === 0 ? '整條都在 x 軸<b>上方</b>（碰到也可以）。<b class="cg">定積分就是面積。</b>' : v > 0 ? '有一塊掉到 x 軸下面，變成負的，把上面抵消掉一些。<b class="cr">已經不是面積了。</b>' : v === 0 ? '上面和下面<b>剛好抵消</b>，定積分是 0。<b class="cr">可是圖上明明還有面積！</b>' : '下面比上面多，定積分是<b class="cr">負數</b>。面積不可能是負的，所以它不是面積。';
  };
  I.oninput = () => { auto++; upd(); };
  $('#p4').onclick = async () => { const my = ++auto; for (const v of [0, 1, 2, 3, 4, 5, 6]) { if (my !== auto) return; I.value = v; upd(); await wait(1.4); } };
  draw(); upd();
})();

// ── PART 4：是不是面積
(() => {
  const th = (fn, a, b, y) => {
    const s = document.createElementNS(NS, 'svg'); set(s, {class: 'thumb', viewBox: '0 0 240 120', role: 'img', 'aria-label': '函數圖形'});
    const P = plot(s, {x: [a - .4, b + .4], y, w: 240, h: 120, pad: [8, 8, 8, 8]});
    el('path', {d: P.pos(a, b, fn), fill: C.bl}, s); el('path', {d: P.neg(a, b, fn), fill: C.rl}, s);
    el('path', {d: `M6 ${P.Y(0)}H232`, stroke: C.ink, 'stroke-width': 1.5}, s); P.curve(a, b, fn);
    for (const v of [a, b]) P.vline(v, fn(v));
    return s.outerHTML;
  };
  const o = ['是面積', '不是面積'];
  mini('#try', [
    {q: th(x => 2 + Math.sin(x * 1.6), 0, 4, [-.6, 3.4]), o, a: 0, w: '整條都在 x 軸上方。', h: '曲線有沒有掉到 x 軸下面？'},
    {q: th(x => 1.6 - x * .9, 0, 4, [-2.4, 2]), o, a: 1, w: '右邊那塊在 x 軸下面，是負的，會抵消掉左邊。', h: '看紅色那塊，它算進去是正的還是負的？'},
    {q: th(x => (x - 2) * (x - 2) * .6, 0, 4, [-.5, 2.8]), o, a: 0, w: `只是<b>碰到</b> x 軸，沒有掉下去，${ks('f(x)\\ge0')} 還是成立。`, h: `條件是 ${ks('f(x)\\ge0')}，等於 0 可以嗎？`},
    {q: th(x => -1.6 - Math.cos(x * 1.5) * .7, 0, 4, [-3, .6]), o, a: 1, w: '整塊都在下面，定積分是負數，面積不會是負的。', h: '這塊算出來是正的還是負的？面積可以是負的嗎？'}]);
})();

// ── PART 5：x² 在 [0,1]，n=4
(() => {
  const sq = x => x * x, P = plot('#g5', {x: [-.06, 1.12], y: [0, 1.1], h: 268, pad: [16, 18, 32, 34]}), s = P.s;
  const reg = el('path', {d: P.fill(0, 1, sq), fill: C.bl}, s), gU = el('g', {}, s), gL = el('g', {}, s);
  P.axes({o: false}); P.curve(0, 1.04, sq); P.vline(1, 1); P.ty(1);
  mt(s, P.X(.6), P.Y(.68), 'y=x²', {style: HALO + `fill:${C.b}`});
  const marks = el('g', {}, s), tk = el('g', {}, s);
  ['0', '¼', '½', '¾', '1'].forEach((t, i) => mt(tk, P.X(i / 4), P.Y(0) + 23, t, {style: 'font-size:19px'}));
  let run = 0;
  const bar = (g, i, hgt, fill, st) => { const my = run, r = el('rect', {x: P.X(i / 4), width: P.X(.25) - P.X(0), y: P.Y(0), height: 0, fill, 'fill-opacity': .7, stroke: st, 'stroke-width': 1.5}, g); tween(t => { if (my === run) set(r, {y: P.Y(hgt * t), height: Math.max(0, P.Y(0) - P.Y(hgt * t))}); }, {delay: i * .25, duration: .7, bounce: .3}); };
  const F4 = ['\\tfrac{1}{16}', '\\tfrac{4}{16}', '\\tfrac{9}{16}', '\\tfrac{16}{16}'];
  stepper('#st5', [
    {h: '看圖', s: `要算 ${ks('y=x^2')} 下面、0 到 1 之間的區域 ${ks('R')}。<br>整條都不在 x 軸下面，所以<b>面積就是 ${ks('\\int_0^1x^2\\,dx')}</b>。`},
    {h: '切', t: KW('\\Delta x=\\frac{1-0}{4}=\\frac14'), s: '先用 4 段練習。每一段的寬都是 ¼。'},
    {h: '找最高和最低', t: `${KR('M_i')}\\text{ 在右端},\\quad ${KG('m_i')}\\text{ 在左端}`, s: `${ks('x^2')} 在 0 到 1 一路往上爬。<br>所以每段<b class="cr">最高在右端</b>，<b class="cg">最低在左端</b>。`},
    {h: '上和', t: `\\begin{aligned}${KR('U_4')}&=${KW('\\tfrac14')}\\left(${F4.join('+')}\\right)\\\\[4pt]&=\\tfrac{15}{32}\\approx0.469\\end{aligned}`, s: '每段都用右端的高度。四條都<b class="cr">蓋過曲線</b>，多算了。'},
    {h: '下和', t: `\\begin{aligned}${KG('L_4')}&=${KW('\\tfrac14')}\\left(0+${F4.slice(0, 3).join('+')}\\right)\\\\[4pt]&=\\tfrac{7}{32}\\approx0.219\\end{aligned}`, s: '每段都用左端的高度。第 1 段高度是 0，所以看不到。<b class="cg">都躲在曲線下</b>，少算了。'},
    {h: '先夾一次', t: `${KG('0.219')}\\le R\\text{ 的面積}\\le${KR('0.469')}`, s: '只切 4 段，範圍還很大。要切得更細：<b>把 4 換成 n。</b>'}
  ], k => {
    const my = ++run; gU.textContent = gL.textContent = marks.textContent = '';
    reg.setAttribute('opacity', k < 3 ? 1 : .4); tk.setAttribute('opacity', k ? 1 : 0);
    const go = (cb, o) => tween(t => { if (my === run) cb(t); }, o);
    if (k === 1 || k === 2) for (let i = 1; i < 4; i++) { const p = el('path', {stroke: C.w, 'stroke-width': 2}, marks); go(t => p.setAttribute('d', `M${P.X(i / 4)} ${P.Y(0)}V${P.Y(sq(i / 4) * t)}`), {delay: i * .12}); }
    if (k === 2) for (let i = 0; i < 4; i++) { const a = el('circle', {cx: P.X((i + 1) / 4), cy: P.Y(sq((i + 1) / 4)), fill: C.r, stroke: '#fff', 'stroke-width': 1.5, r: 0}, marks), b = el('circle', {cx: P.X(i / 4), cy: P.Y(sq(i / 4)), fill: C.g, stroke: '#fff', 'stroke-width': 1.5, r: 0}, marks); go(t => { a.setAttribute('r', Math.max(0, 9 * t)); b.setAttribute('r', Math.max(0, 5 * t)); }, {delay: i * .25, bounce: .5}); }
    if (k === 3 || k === 5) for (let i = 0; i < 4; i++) bar(gU, i, sq((i + 1) / 4), C.rl, C.r);
    if (k === 4 || k === 5) for (let i = 0; i < 4; i++) bar(gL, i, sq(i / 4), C.gl, C.g);
  });
})();

// ── PART 6：換成 n
stepper('#st6', [
  {h: '切成 n 段', t: `${KW('\\Delta x=\\frac1n')},\\qquad x_i=\\frac{i}{n}`, s: `分割點是 ${ks('\\frac1n')}、${ks('\\frac2n')}、${ks('\\frac3n')}……一路到 ${ks('\\frac nn=1')}。`},
  {h: '每段的最高', t: KR('M_i=\\left(\\frac{i}{n}\\right)^2=\\frac{i^2}{n^2}'), s: `最高在右端 ${ks('x_i=\\frac in')}，代進 ${ks('x^2')}。`},
  {h: '寫出上和', t: `\\begin{aligned}${KR('U_n')}&=${KW('\\frac1n')}\\left(\\frac{1^2}{n^2}+\\frac{2^2}{n^2}+\\cdots+\\frac{n^2}{n^2}\\right)\\\\[4pt]&=\\frac{1^2+2^2+\\cdots+n^2}{n^3}\\end{aligned}`, s: '高 × 寬，全部加起來。分母都一樣，可以合併。'},
  {h: '平方和公式', t: `\\begin{gathered}1^2+2^2+\\cdots+n^2\\\\[2pt]=\\frac{n(n+1)(2n+1)}{6}\\end{gathered}`, s: `學過的公式。用 ${ks('n=4')} 檢查：${ks('1+4+9+16=30')}，${ks('\\frac{4\\cdot5\\cdot9}{6}=30')} ✓`},
  {h: '(1) 上和', t: `\\begin{aligned}${KR('U_n')}&=\\frac{(n+1)(2n+1)}{6n^2}\\\\[4pt]&=${KR('\\frac{2n^2+3n+1}{6n^2}')}\\end{aligned}`, s: `代進去，約掉一個 ${ks('n')}。用 ${ks('n=4')} 檢查：${ks('\\frac{32+12+1}{96}=\\frac{15}{32}')}，和剛才一樣 ✓`},
  {h: '(2) 下和', t: `\\begin{aligned}${KG('L_n')}&=\\frac{0^2+1^2+\\cdots+(n-1)^2}{n^3}\\\\[4pt]&=${KG('\\frac{2n^2-3n+1}{6n^2}')}\\end{aligned}`, s: `最低在左端，所以從 ${ks('0^2')} 加到 ${ks('(n-1)^2')}。把平方和公式裡的 ${ks('n')} 換成 ${ks('n-1')}，再約分。`}]);

// ── PART 6：取極限，小塊越來越小
(() => {
  const s = $('#g6'), U = 46, x0 = 24, I = $('#n6');
  el('text', {x: x0, y: 24, style: `fill:${C.r};font-weight:700`}, s).textContent = '上和的分子';
  const mk = (fill, st) => el('rect', {y: 38, height: 42, fill, stroke: st, 'stroke-width': 1.5}, s), r1 = mk(C.bl, C.b), r2 = mk('#d9ccf5', C.h), r3 = mk('#f7dfc2', C.w);
  mt(s, x0 + U, 65, '2'); const t2 = mt(s, 0, 65, '3/n', {style: `fill:${C.h}`}), t3 = mt(s, 0, 65, '1/n²', {style: `fill:${C.w}`});
  el('path', {d: `M${x0 + 2 * U} 32V94`, stroke: C.ink, 'stroke-width': 2, 'stroke-dasharray': '4 3'}, s); mt(s, x0 + 2 * U, 112, '2');
  let n = 1, an, run = 0, auto = 0;
  const draw = () => {
    const a = 3 / n * U, b = U / n / n; set(r1, {x: x0, width: 2 * U}); set(r2, {x: x0 + 2 * U, width: a}); set(r3, {x: x0 + 2 * U + a, width: b});
    set(t2, {x: x0 + 2 * U + a / 2, opacity: a > 34 ? 1 : 0}); set(t3, {x: x0 + 2 * U + a + b / 2, opacity: b > 38 ? 1 : 0});
  };
  const upd = () => {
    const to = +I.value, from = n, my = ++run; if (an) an.stop();
    an = tween(t => { if (my === run) { n = Math.exp(lerp(Math.log(from), Math.log(to), t)); draw(); } }, {duration: .7, bounce: 0});
    $('#n6-o').textContent = `n = ${to}`; $('#a6').textContent = +(3 / to).toFixed(3); $('#d6').textContent = +(1 / to / to).toFixed(4);
    $('#l6').textContent = fx((2 * to * to - 3 * to + 1) / 6 / to / to, 4); $('#u6').textContent = fx((2 * to * to + 3 * to + 1) / 6 / to / to, 4);
    $('#s6').innerHTML = to < 8 ? `${ks('\\frac3n')} 和 ${ks('\\frac1{n^2}')} 還很大塊。把 ${ks('n')} 拉大。` : to < 60 ? `${ks('\\frac1{n^2}')} 幾乎看不見了，${ks('\\frac3n')} 也快了。` : `只剩下 2。所以 ${ks(`${KR('U_n')}\\to\\frac26=\\frac13`)}，${ks(`${KG('L_n')}\\to\\frac26=\\frac13`)}。`;
  };
  I.oninput = () => { auto++; upd(); };
  $('#p6').onclick = async () => { const my = ++auto; for (const v of [1, 2, 4, 8, 16, 32, 64, 100]) { if (my !== auto) return; I.value = v; upd(); await wait(1); } };
  draw(); upd();
})();

quiz({key: 'gsat-math-integral-page3', title: '積分page3教學', items: [
  {t: '∫₂⁵ f(x)dx 的上限', q: `${ks('\\displaystyle\\int_2^5f(x)\\,dx')} 的<b>上限</b>是哪一個？`, o: ['2', '5', ks('f(5)')], plain: ['2', '5', 'f(5)'], a: 1,
    w: '上限寫在上面，是加到哪裡結束：5。2 是下限。', h: '上限、下限都是 x 軸上的位置，不是高度。看寫在上面的那個。'},
  {t: '定積分算出來是什麼', q: '定積分算出來是什麼？', o: ['一個數', '一個函數', '一個圖形'], a: 0,
    w: `它是 ${ks('L_n')} 和 ${ks('U_n')} 共同的極限，是一個數，例如 30 或 ${ks('\\frac13')}。`, h: 'page2 的兩道牆最後夾到什麼？'},
  {t: '高 −2、從 1 到 4 的定積分', q: `${ks('\\displaystyle\\int_1^4(-2)\\,dx')} 是多少？`, o: ['6', ks('-6'), '0'], plain: ['6', '−6', '0'], a: 1,
    w: `高是 ${ks('-2')}，寬是 ${ks('4-1=3')}，${ks('(-2)\\times3=-6')}。圖在 x 軸下面，所以是負的。`, h: '高 × 寬。高是 −2，不要把負號丟掉。'},
  {t: '定積分是 0 就沒有面積？', col: 1, q: `如果 ${ks('\\displaystyle\\int_a^bf(x)\\,dx=0')}（${ks('a<b')}），哪個對？`, o: ['圖形和 x 軸之間一定沒有面積', '可能是上面和下面剛好抵消', ks('f(x)') + ' 一定整條是 0'], plain: ['一定沒有面積', '可能上下抵消', 'f(x) 一定整條是 0'], a: 1,
    w: '就像有進有出，結餘剛好是 0。', h: '回 PART 3，把曲線往下搬 3，看看圖上還有沒有面積。'},
  {t: '(n²+2n+1)/(4n²) 的極限', q: `某個上和 ${ks('U_n=\\dfrac{n^2+2n+1}{4n^2}')}，${ks('n\\to\\infty')} 時會跑到哪裡？`, o: ['0', ks('\\frac14'), '1'], plain: ['0', '1/4', '1'], a: 1,
    w: `上下都除以 ${ks('n^2')}：${ks('\\frac{1+\\frac2n+\\frac1{n^2}}{4}')}，後面兩塊都變成 0，剩 ${ks('\\frac14')}。`, h: `上下都除以 ${ks('n^2')}，再看哪幾塊會消失。`}]});
})();
