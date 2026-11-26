(() => {
'use strict';
const g = x => x - x * x + x ** 3 - x ** 4, G = x => x * x / 2 - x ** 3 / 3 + x ** 4 / 4 - x ** 5 / 5;
const sg = v => (v < 0 ? '−' : '') + Math.abs(v).toFixed(4);

// ── (1)：拖 a、b；下圖是存摺 F
(() => {
  const s = $('#g1'), L = -.5, R = 1.25;
  const T = plot(s, {x: [L - .08, R + .1], y: [-1.02, .5], h: 196, pad: [12, 22, 12, 22]}), D = plot(s, {x: [L - .08, R + .1], y: [-.035, .245], top: 254, h: 192, pad: [18, 22, 20, 22]});
  const pos = el('path', {fill: C.bl}, s), neg = el('path', {fill: C.rl}, s); T.axes({o: false}); T.curve(L, R, g);
  mt(s, T.X(0) + 10, T.Y(0) + 19, '0'); mt(s, T.X(1) + 8, T.Y(0) - 8, '1', {style: HALO}); mt(s, T.X(.55), T.Y(.4), '+', {style: `fill:${C.b};font-size:22px`}); mt(s, T.X(-.32), T.Y(-.62), '−', {style: `fill:${C.r};font-size:24px`}); mt(s, T.X(1.12), T.Y(-.3), '−', {style: `fill:${C.r};font-size:24px`});
  const sa = T.put('path', {stroke: C.ink, 'stroke-width': 1.6}), ta = mt(s, 0, 0, 'a', {style: HALO + `fill:${CT};font-weight:700`}), tb = mt(s, 0, 0, 'b', {style: HALO + `fill:${C.r};font-weight:700`});
  D.axes({o: false, yn: 'y'}); el('path', {d: D.path(L, R, G), fill: 'none', stroke: CT, 'stroke-width': 3}, s); mt(s, D.X(-.28), D.Y(.215), '存摺 F(x)', {style: `fill:${CT}`});
  const dh = el('path', {stroke: '#8a97a4', 'stroke-dasharray': '4 3'}, s), bar = el('path', {'stroke-width': 6, 'stroke-linecap': 'round'}, s), da = el('circle', {r: 6, fill: CT, stroke: '#fff', 'stroke-width': 2}, s), db = el('circle', {r: 6, fill: C.r, stroke: '#fff', 'stroke-width': 2}, s), bl = mt(s, 0, 0, '', {'text-anchor': 'start', style: HALO + 'font-weight:700'});
  let a = -.3, b = .7, an;
  const draw = () => {
    pos.setAttribute('d', T.pos(a, b, g)); neg.setAttribute('d', T.neg(a, b, g)); sa.setAttribute('d', `M${T.X(a)} ${T.Y(0)}V${T.Y(g(a))}M${T.X(b)} ${T.Y(0)}V${T.Y(g(b))}`);
    set(ta, {x: T.X(a), y: a < 0 ? T.Y(0) - 8 : T.Y(0) + 20}); set(tb, {x: T.X(b), y: b < 1 ? T.Y(0) + 20 : T.Y(0) - 8});
    const v = G(b) - G(a), c = v >= 0 ? C.b : C.r;
    set(da, {cx: D.X(a), cy: D.Y(G(a))}); set(db, {cx: D.X(b), cy: D.Y(G(b))}); dh.setAttribute('d', `M${D.X(a)} ${D.Y(G(a))}H${D.X(b)}`); set(bar, {d: `M${D.X(b)} ${D.Y(G(a))}V${D.Y(G(b))}`, stroke: c});
    set(bl, {x: D.X(b) + 8, y: D.Y((G(a) + G(b)) / 2) + 6, style: HALO + `font-weight:700;fill:${c}`}); bl.textContent = sg(v);
    $('#a1').textContent = num(a); $('#b1').textContent = num(b); $('#v1').textContent = sg(v); $('#v1').className = v >= 0 ? 'cb' : 'cr';
    const best = Math.abs(a) < 1e-6 && Math.abs(b - 1) < 1e-6;
    $('#s1').innerHTML = best ? `<b class="cg">a＝0、b＝1：藍色全拿，紅色一點都沒拿，最大！</b><br>下圖：期末 ${ks('F(1)')} 在最高點，期初 ${ks('F(0)')} 在最低點，差距最大。` : a < 0 && b > 1 ? '兩邊都拿到<b class="cr">紅色</b>，被減掉了。' : a < 0 ? '左邊拿到<b class="cr">紅色</b>（負的），把 a 往右移到 0。' : b > 1 ? '右邊拿到<b class="cr">紅色</b>（負的），把 b 往左移到 1。' : '都在藍色裡面，可是<b class="cb">藍色還沒拿完</b>，把區間撐大到 0 和 1。';
  };
  const ha = handle(T, {v: a, min: L, max: () => b - .05, step: .05, y: 226, color: CT, label: '下限 a', on: v => { a = +v.toFixed(2); draw(); }, grab: () => an && an.stop(), demo: .15});
  const hb = handle(T, {v: b, min: () => a + .05, max: R, step: .05, y: 226, color: C.r, label: '上限 b', on: v => { b = +v.toFixed(2); draw(); }, grab: () => an && an.stop(), demo: -.15});
  $('#p1').onclick = () => {
    ha.stop(); hb.stop(); if (an) an.stop(); const a0 = a, b0 = b;
    if (reduce) { hb.put(1); ha.put(0); return; }
    an = Motion.animate(0, 1, {duration: 1.6, ease: 'easeInOut', onUpdate: t => { a = lerp(a0, 0, t); b = lerp(b0, 1, t); draw(); ha.draw(); hb.draw(); }, onComplete: () => { hb.put(1); ha.put(0); }});
  };
  draw();
})();

stepper('#st1', [
  {h: '想法', t: `\\begin{aligned}&\\int_a^bf(x)\\,dx\\\\&=${KB('\\text{上方面積}')}-${KR('\\text{下方面積}')}\\end{aligned}`, s: '要讓它最大：<b class="cb">上方的全部拿</b>，<b class="cr">下方的一點都不要</b>。'},
  {h: '找上方的範圍', t: `f(x)>0\\iff 0<x<1`, s: `剛才找過：只有 0 到 1 在 ${ks('x')} 軸上方。`},
  {h: '決定區間', t: `a=0,\\quad b=1`, s: `<b>往外多拿</b>（${ks('a<0')} 或 ${ks('b>1')}）：多拿到下方，<b class="cr">變小</b>。<br><b>往內少拿</b>（${ks('a>0')} 或 ${ks('b<1')}）：少拿到上方，<b class="cr">也變小</b>。<br>所以 ${ks('[0,1]')} 剛剛好。`},
  {h: '找反導函數', t: `F(x)=\\frac{x^2}{2}-\\frac{x^3}{3}+\\frac{x^4}{4}-\\frac{x^5}{5}`, s: `${ks('f(x)=x-x^2+x^3-x^4')}，每一項次方加 1，再除以新次方。`},
  {h: '算出最大值', t: `\\begin{aligned}&\\int_0^1f(x)\\,dx\\\\&=F(1)-F(0)\\\\&=\\frac12-\\frac13+\\frac14-\\frac15\\\\&=\\frac{30-20+15-12}{60}=\\frac{13}{60}\\end{aligned}`, s: `<b>答：取 ${ks('a=0,\\ b=1')}，最大值為 ${ks('\\frac{13}{60}')}。</b>（約 0.2167，和上面圖上的一樣）`},
  {h: '用存摺再看一次', t: `\\int_a^bf(x)\\,dx=F(b)-F(a)`, s: `page4_5 的存摺：<b>期末餘額 − 期初餘額</b>。要差最多，就要<b>期末最高、期初最低</b>。下圖的存摺在 0 最低、在 1 最高，答案一樣。`}]);

// ── (2)：拆奇偶
(() => {
  const s = $('#g2'), P = plot(s, {x: [-.95, .95], y: [-2.45, 1.4], h: 300, pad: [12, 20, 14, 20]}), I = $('#c2');
  const odd = x => x + x ** 3, even = x => -x * x - x ** 4, F = {f: g, o: odd, e: even};
  const pos = el('path', {fill: C.bl}, s), neg = el('path', {fill: C.rl}, s), rot = el('path', {fill: C.gl, 'fill-opacity': .8, stroke: C.g, opacity: 0}, s);
  P.axes({o: false}); el('clipPath', {id: 'cp2'}, el('defs', {}, s)).appendChild(el('rect', {x: 0, y: 8, width: 360, height: 292})); const cv = P.put('path', {fill: 'none', stroke: C.b, 'stroke-width': 3, 'clip-path': 'url(#cp2)'}), sd = P.put('path', {stroke: C.ink, 'stroke-width': 1.6});
  mt(s, P.X(0) + 9, P.Y(0) + 18, 'O'); const tc = mt(s, 0, 0, 'c', {style: HALO + 'font-weight:700'}), tm = mt(s, 0, 0, '−c', {style: HALO + 'font-weight:700'});
  let m = 'f', c = .6, run = 0;
  const val = {f: c => -2 * (c ** 3 / 3 + c ** 5 / 5), o: () => 0, e: c => -2 * (c ** 3 / 3 + c ** 5 / 5)};
  const draw = () => {
    const fn = F[m]; run++; rot.setAttribute('opacity', 0); rot.setAttribute('transform', '');
    pos.setAttribute('d', P.pos(-c, c, fn)); neg.setAttribute('d', P.neg(-c, c, fn)); cv.setAttribute('d', P.path(-.92, .92, fn));
    sd.setAttribute('d', `M${P.X(-c)} ${P.Y(0)}V${P.Y(fn(-c))}M${P.X(c)} ${P.Y(0)}V${P.Y(fn(c))}`);
    set(tc, {x: P.X(c), y: fn(c) < 0 ? P.Y(0) - 8 : P.Y(0) + 20}); set(tm, {x: P.X(-c), y: fn(-c) < 0 ? P.Y(0) - 8 : P.Y(0) + 20});
    $('#c2-o').textContent = `c = ${num(c)}`;
    const v = val[m](c), name = {f: 'f(x)', o: '(x+x^3)', e: '(-x^2-x^4)'}[m];
    K(`\\int_{-${num(c)}}^{${num(c)}}${name}\\,dx${m === 'o' ? '=0' : '\\approx' + fx(v, 4)}`, $('#f2'), true);
    $('#s2').innerHTML = m === 'f' ? `右邊有一小塊<b class="cb">藍色</b>，可是左邊的<b class="cr">紅色</b>大得多。<b>拉拉看 ${ks('c')}，結果都是負的。</b>` : m === 'o' ? '奇數次方：對原點對稱，<b>一正一負剛好抵消</b>，是 0。按一次看它轉半圈。' : '偶數次方：每一項前面都是負號，<b class="cr">整條都在 x 軸下面</b>，一定是負的。';
  };
  const spin = () => {
    const my = run, x0 = P.X(0), y0 = P.Y(0); rot.setAttribute('d', P.fill(0, c, odd)); rot.setAttribute('opacity', 1);
    tween(t => { if (my === run) rot.setAttribute('transform', `rotate(${-180 * t} ${x0} ${y0})`); }, {ease: 'easeInOut', duration: 1.8, delay: .3});
  };
  $$('#b2 button').forEach(b => b.onclick = () => { m = b.dataset.m; onOnly('#b2', b); draw(); if (m === 'o') spin(); });
  I.oninput = () => { c = +I.value; draw(); };
  draw();
})();

stepper('#st2', [
  {h: '展開，分兩堆', t: `f(x)=${KR('(x+x^3)')}+${KG('(-x^2-x^4)')}`, s: `<b class="cr">奇數次方</b>一堆、<b class="cg">偶數次方</b>一堆。`},
  {h: '奇數次方那堆是 0', t: `\\int_{-c}^{c}${KR('(x+x^3)')}\\,dx=0`, s: '奇函數，上下限又對稱，一正一負抵消。'},
  {h: '偶數次方那堆算一半再乘 2', t: `\\begin{aligned}&\\int_{-c}^{c}${KG('(-x^2-x^4)')}\\,dx\\\\&=2\\int_0^c(-x^2-x^4)\\,dx\\\\&=2\\left(-\\frac{x^3}{3}-\\frac{x^5}{5}\\right)\\Big|_0^c\\\\&=-2\\left(\\frac{c^3}{3}+\\frac{c^5}{5}\\right)\\end{aligned}`, s: '偶函數，左右一樣，算右邊再乘 2。下限 0 代進去是 0。'},
  {h: '說明一定是負的', t: `\\begin{aligned}&\\int_{-c}^{c}f(x)\\,dx\\\\&=-2\\left(\\frac{c^3}{3}+\\frac{c^5}{5}\\right)<0\\end{aligned}`, s: `因為 ${ks('c>0')}，所以 ${ks('c^3>0')}、${ks('c^5>0')}，括號裡是正的；前面乘上 ${ks('-2')}，就是負的。<b>不管 ${ks('c')} 是多少都成立，故得證。</b>`}]);

mini('#try', [
  {q: `${ks('f(x)=x(2-x)')}，選 ${ks('a\\le b')} 讓 ${ks('\\int_a^bf(x)\\,dx')} 最大，最大值是？`, o: [ks('\\frac23'), ks('\\frac43'), ks('\\frac83')], a: 1, w: `${ks('0<x<2')} 時是正的，取 ${ks('[0,2]')}：${ks('\\left(x^2-\\frac{x^3}{3}\\right)\\Big|_0^2=4-\\frac83=\\frac43')}。`, h: '先找 f(x) 什麼時候是正的，正的全拿，負的不要。'},
  {q: `${ks('\\displaystyle\\int_{-2}^{2}(x^3-3x^2+2)\\,dx=')}？`, o: ['0', ks('-8'), '8'], a: 1, w: `${ks('x^3')} 是奇的，變 0；${ks('2\\int_0^2(-3x^2+2)\\,dx=2(-8+4)=-8')}。`, h: ['不是奇函數，不能整個寫 0。', '', '偶數次方那堆：−3x² 積出來是負的，小心正負號。']}]);
})();
