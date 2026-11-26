(() => {
'use strict';
const LN2 = Math.log(2), BLUE = 3 / LN2; // 藍色面積 3/ln2 ≈ 4.33
// SVG 標籤：parts = [[文字, 'i' 斜體 | 'u' 上標 | 's' 下標 | '']]
function lab(p, x, y, parts, style = '') {
  const t = el('text', {x, y, class: 'm', 'text-anchor': 'middle', style: HALO + style}, p); let back = 0;
  for (const [s, k] of parts) {
    const a = {}, dy = k === 'u' ? -8 : k === 's' ? 5 : 0;
    if (dy - back) a.dy = dy - back; back = dy;
    if (k === 'i') a.class = 'i'; if (k === 'u' || k === 's') a.class = 's' + (k === 'u' ? ' i' : '');
    el('tspan', a, t).textContent = s;
  }
  return t;
}

// ── 第 9 題：藍色沿 y=x 翻過去
(() => {
  const P = plot('#g9', {x: [-.5, 4.7], y: [-.5, 4.7], h: 352, pad: [16, 18, 30, 26]}), s = P.s;
  const E = x => 2 ** x, L = x => Math.log2(x);
  const ptsB = [[0, 0], ...xs(0, 2, 80).map(x => [x, E(x)]), [2, 0]];
  const ptsG = [[1, 0], ...xs(1, 4, 80).map(x => [x, L(x)]), [4, 0]];
  const rect = el('path', {d: `M${P.X(0)} ${P.Y(0)}H${P.X(4)}V${P.Y(2)}H${P.X(0)}Z`, fill: 'none', stroke: C.h, 'stroke-width': 2.5, 'stroke-dasharray': '7 5', opacity: 0}, s);
  const gr = el('path', {d: poly(ptsG.map(([x, y]) => [P.X(x), P.Y(y)]), true), fill: C.gl, 'fill-opacity': .8}, s);
  const bl = el('path', {fill: C.bl, 'fill-opacity': .85, stroke: C.b, 'stroke-width': 1.5}, s);
  el('path', {d: `M${P.X(-.4)} ${P.Y(-.4)}L${P.X(4.6)} ${P.Y(4.6)}`, stroke: C.mu, 'stroke-width': 1.5, 'stroke-dasharray': '4 5'}, s);
  P.axes();
  P.curve(-.5, 2.2, E); P.curve(.36, 4.6, L, {stroke: C.g});
  [1, 2, 4].forEach(v => { P.tx(v); P.ty(v); });
  lab(s, P.X(4.25), P.Y(4.5), [['y=', 'i'], ['x', 'i']], `fill:${C.mu}`);
  lab(s, P.X(1.05), P.Y(3.6), [['y', 'i'], ['=2'], ['x', 'u']], `fill:${C.b}`);
  lab(s, P.X(3.6), P.Y(2.45), [['y', 'i'], ['=log'], ['2', 's'], ['x', 'i']], `fill:${C.g}`);
  const w4 = mt(s, P.X(2), P.Y(2) - 10, '寬 4', {style: HALO + `fill:${C.h};font-weight:700`, opacity: 0}), h2 = mt(s, P.X(4) + 4, P.Y(1) + 6, '高 2', {style: HALO + `fill:${C.h};font-weight:700`, 'text-anchor': 'start', opacity: 0});
  // 沿 y=x 對摺：c=1 原位，c=−1 x、y 對調
  const fold = c => ([x, y]) => [P.X((x + y) / 2 + c * (x - y) / 2), P.Y((x + y) / 2 - c * (x - y) / 2)];
  let k = 0, an, run = 0;
  const draw = () => {
    bl.setAttribute('d', poly(ptsB.map(fold(Math.cos(Math.PI * k))), true));
    const done = k > .98; [rect, w4, h2].forEach(e => e.setAttribute('opacity', done ? 1 : 0));
    onOnly('#b9', k < .02 ? $('#b9 [data-m="0"]') : done ? $('#b9 [data-m="1"]') : null);
    K('\\tfrac{3}{\\ln2}\\approx4.33', $('#a9b')); K(done ? '8-\\tfrac{3}{\\ln2}' : '?', $('#a9g')); K(done ? '8' : '?', $('#a9s'));
    $('#s9').innerHTML = k < .02 ? '藍色是第一個積分，綠色是第二個。綠色不會算，按「翻過去」看看。'
      : done ? '翻過去後大小不變，跟綠色<b>剛好拼成一個長方形</b>：寬 4、高 2。<br>藍 ＋ 綠 ＝ <b>8</b>。綠色是多少，根本不用算！' : '沿著斜線 y=x 翻過去，像翻書…';
  };
  $$('#b9 button').forEach(b => b.onclick = () => { const to = +b.dataset.m, from = k, my = ++run; if (an) an.stop(); an = tween(t => { if (my === run) { k = lerp(from, to, t); draw(); } }, {ease: 'easeInOut', duration: 1.6}); });
  draw();
})();
stepper('#st9', [
  {h: '第一個：直接積', t: `\\int_0^2${KB('2^x')}\\,dx=\\frac{2^x}{\\ln2}\\Big|_0^2=\\frac{4-1}{\\ln2}=${KB('\\frac{3}{\\ln2}')}`, s: `${ks('2^x')} 微分是 ${ks('2^x\\ln2')}，所以它的反導函數是 ${ks('\\frac{2^x}{\\ln2}')}。這是<b class="cb">藍色</b>的面積。`},
  {h: '第二個：看圖，不用積', t: `\\int_1^4${KG('\\log_2x')}\\,dx=\\underbrace{4\\times2}_{\\text{長方形}}-${KB('\\frac{3}{\\ln2}')}`, s: '<b class="cg">綠色</b> ＝ 長方形 − 翻過去的<b class="cb">藍色</b>。翻過去大小不變。'},
  {h: '相加', t: `${KB('\\frac{3}{\\ln2}')}+\\left(8-${KB('\\frac{3}{\\ln2}')}\\right)=8`, s: `${ks('\\frac{3}{\\ln2}')} 這個怪數字一加一減，<b>消掉了</b>。答案就是長方形的面積 <b>8</b>。`}]);

// ── 第 10 題：f(x)=x³−a²x
(() => {
  const H = 300, P = plot('#g10', {x: [-3.1, 3.1], y: [-7.4, 7.4], h: H, pad: [14, 20, 50, 20]}), s = P.s;
  const defs = el('defs', {}, s), cp = el('clipPath', {id: 'c10'}, defs); el('rect', {x: 0, y: 6, width: 360, height: P.Y(-7.4) - 6}, cp);
  const L = el('path', {fill: C.bl}, s), R = el('path', {fill: C.rl}, s), spin = el('path', {fill: C.r, 'fill-opacity': .45, stroke: C.r, 'stroke-width': 1.5, opacity: 0}, s);
  P.axes();
  const cv = P.curve(-3.1, 3.1, x => x, {'clip-path': 'url(#c10)'});
  const tl = mt(s, 0, 0, '−a', {style: HALO}), tr = mt(s, 0, 0, 'a', {style: HALO});
  const dl = el('circle', {r: 3.5, fill: C.ink}, s), dr = el('circle', {r: 3.5, fill: C.ink}, s);
  let a = 2, an, run = 0, last;
  const f = x => x ** 3 - a * a * x;
  const draw = () => {
    if (a !== last) { last = a; run++; if (an) an.stop(); spin.setAttribute('opacity', 0); spin.removeAttribute('transform'); }
    L.setAttribute('d', P.fill(-a, 0, f)); R.setAttribute('d', P.fill(0, a, f)); spin.setAttribute('d', P.fill(0, a, f));
    cv.setAttribute('d', P.path(-3.1, 3.1, f, 200));
    set(tl, {x: P.X(-a), y: P.Y(0) + 21}); set(tr, {x: P.X(a), y: P.Y(0) - 9}); set(dl, {cx: P.X(-a), cy: P.Y(0)}); set(dr, {cx: P.X(a), cy: P.Y(0)});
    const half = a ** 4 / 4, tot = a ** 4 / 2, hit = Math.abs(a - 2) < 1e-9;
    $('#v10a').textContent = num(a); $('#v10h').textContent = num(half); $('#v10s').textContent = num(tot); $('#v10s').className = hit ? 'cg' : 'ch';
    if (spin.getAttribute('opacity') === '0') $('#s10').innerHTML = hit ? `${ks('a=2')}：總面積剛好 <b class="cg">8</b> ✓　這就是答案。`
      : `${ks('a=' + num(a))}：總面積是 ${num(tot)}，${tot < 8 ? '不到 8，<b>a 要再大一點</b>。' : '超過 8，<b>a 要再小一點</b>。'}`;
  };
  const hd = handle(P, {v: 2, y: H - 22, color: C.h, min: .8, max: 2.6, step: .1, demo: .5, label: 'a 的大小', on: v => { a = +v.toFixed(1); draw(); }});
  $('#p10').onclick = () => {
    if (hd.v !== a) hd.put(hd.v); else hd.stop();
    run++; if (an) an.stop(); const my = run, cx = P.X(0), cy = P.Y(0); spin.setAttribute('opacity', 1);
    $('#s10').innerHTML = '右邊那塊繞原點轉半圈…';
    an = tween(t => { if (my === run) spin.setAttribute('transform', `rotate(${180 * t} ${cx} ${cy})`); }, {ease: 'easeInOut', duration: 1.6, onComplete: () => { if (my === run) $('#s10').innerHTML = '<b>剛好蓋住左邊那塊！</b>兩塊一樣大，所以總面積 ＝ 左邊那塊 × 2。'; }});
  };
  draw();
})();
stepper('#st10', [
  {h: '面積 ＝ 左邊那塊的 2 倍', t: `\\text{面積}=2\\int_{-a}^{0}(x^3-a^2x)\\,dx`, s: '左邊那塊在 x 軸上面，定積分就是正的面積，不用加負號。'},
  {h: '找反導函數', t: `x^3-a^2x\\ \\longrightarrow\\ \\frac{x^4}{4}-\\frac{a^2x^2}{2}`, s: `${ks('a')} 是固定的數，跟常數一樣看待：${ks('a^2x')} 的反導函數是 ${ks('\\frac{a^2x^2}{2}')}。`},
  {h: '上下限代進去', t: `\\begin{aligned}&\\left(\\frac{x^4}{4}-\\frac{a^2x^2}{2}\\right)\\Big|_{-a}^{0}\\\\&=0-\\left(\\frac{a^4}{4}-\\frac{a^4}{2}\\right)=\\frac{a^4}{4}\\end{aligned}`, s: `上限 0 代進去是 0。下限 ${ks('-a')}：${ks('(-a)^4=a^4')}，${ks('(-a)^2=a^2')}。`},
  {h: '乘 2，等於 8', t: `\\text{面積}=2\\times\\frac{a^4}{4}=\\frac{a^4}{2}=8`, s: '回圖上拖圓點，「總面積」那格就是 a⁴/2。'},
  {h: '解出 a', t: `a^4=16\\ \\Rightarrow\\ a=2\\quad(a>0)`, s: `${ks('2^4=16')}。${ks('-2')} 也滿足 ${ks('a^4=16')}，但題目說 ${ks('a>0')}，所以<b>答案 a = 2</b>。`}]);

quiz({key: 'ex9_10', title: '積分習題9_10詳解', items: [
  {t: '對稱線', q: `${ks('y=2^x')} 和 ${ks('y=\\log_2x')} 的圖形，對哪一條線對稱？`, o: [ks('x') + ' 軸', ks('y') + ' 軸', ks('y=x')], plain: ['x 軸', 'y 軸', 'y=x'], a: 2, w: 'x、y 對調，就是沿 y=x 翻過去。', h: '2 的 1 次方是 2，log₂2 是 1，數字對調了。'},
  {t: '長方形', q: '第 9 題，藍色翻過去後跟綠色拼成的長方形，寬和高是？', o: ['寬 2、高 4', '寬 4、高 2', '寬 4、高 4'], a: 1, w: '綠色從 x=1 到 4，右上角高度是 log₂4 = 2。', h: '看綠色的右邊界 x=4，那裡的高度是 log₂4。'},
  {t: '奇函數積分', q: `第 10 題，${ks('\\int_{-a}^{a}(x^3-a^2x)\\,dx')} 等於多少？`, o: [ks('0'), ks('8'), ks('\\frac{a^4}{2}')], plain: ['0', '8', 'a⁴/2'], a: 0, w: '奇函數上下抵消，結餘是 0，不是面積。', h: '一塊在上、一塊在下，而且一樣大，定積分會怎樣？'},
  {t: '換數字', q: '如果第 10 題的面積改成 2，a 是多少？', o: [ks('1'), ks('\\sqrt2'), ks('2')], plain: ['1', '√2', '2'], a: 1, w: 'a⁴/2 = 2，a⁴ = 4，a = √2。', h: '面積公式是 a⁴/2，讓它等於 2。'}]});
})();
