(() => {
'use strict';
// 在 [0,1] 上，x 軸上方（藍）與下方（紅）的面積
const areas = (fn, a = 0, b = 1, n = 600) => { let u = 0, d = 0; const w = (b - a) / n; for (let i = 0; i < n; i++) { const v = fn(a + w * (i + .5)) * w; if (v > 0) u += v; else d -= v; } return [u, d]; };
const sayBal = (u, d, done) => done ? '<b>藍、紅一樣大</b>，存進的剛好花光，<b>結餘 0</b> ✓' : u > d ? '藍比紅大：存進的比較多，結餘是<b class="cb">正的</b>。' : '紅比藍大：花掉的比較多，結餘是<b class="cr">負的</b>。';
const slide = (id, fmt, on) => { const I = $('#' + id); const go = () => { $('#' + id + '-o').innerHTML = fmt(+I.value); on(+I.value); }; I.oninput = go; return {I, go}; };
const animTo = (S, to) => { const from = +S.I.value; if (S.an) S.an.stop(); S.an = tween(t => { S.I.value = lerp(from, to, t); S.go(); }, {ease: 'easeInOut', duration: 1.2, onComplete: () => { S.I.value = to; S.go(); }}); };

// ── 11 (1)：拉 a
(() => {
  const P = plot('#g11a', {x: [-.35, 1.5], y: [-2.3, 2.3], h: 250, pad: [14, 20, 14, 24]}), s = P.s;
  const up = el('path', {fill: C.bl}, s), dn = el('path', {fill: C.rl}, s);
  el('path', {d: `M${P.X(1)} ${P.Y(-2.2)}V${P.Y(2.2)}`, stroke: C.mu, 'stroke-width': 1.4, 'stroke-dasharray': '4 4'}, s);
  P.axes(); mt(s, P.X(1) + 12, P.Y(0) + 21, '1', {style: HALO});
  const cv = P.curve(-.3, 1.45, x => x), dot = el('circle', {r: 6, fill: C.ink}, s), rt = mt(s, 0, 0, '', {style: HALO + 'font-size:15px'});
  mt(s, P.X(.62), P.Y(2) + 4, 'y=2x−a', {style: HALO + `fill:${C.b}`});
  const S = slide('ka', a => `${ks('a=')} ${num(a)}`, a => {
    const fn = x => 2 * x - a, U = (2 - a) ** 2 / 4, D = a * a / 4, ok = Math.abs(a - 1) < .001;
    up.setAttribute('d', P.pos(0, 1, fn)); dn.setAttribute('d', P.neg(0, 1, fn)); cv.setAttribute('d', P.path(-.3, 1.45, fn));
    set(dot, {cx: P.X(a / 2), cy: P.Y(0)}); set(rt, {x: P.X(a / 2) - 4, y: P.Y(0) - 12}); rt.textContent = `x=${num(a / 2)}`;
    $('#u11a').textContent = num(U); $('#d11a').textContent = num(D); $('#i11a').textContent = sgn(1 - a); $('#i11a').className = ok ? 'cg' : a < 1 ? 'cb' : 'cr';
    $('#s11a').innerHTML = sayBal(U, D, ok) + (ok ? `<br>這時 ${ks('a=1')}，兩個三角形一模一樣。` : '');
  });
  $('#go11a').onclick = () => animTo(S, 1);
  S.go();
})();
stepper('#st11a', [
  {h: '代進去', t: '\\int_0^1(2x-a)\\,dx=\\left(x^2-ax\\right)\\Big|_0^1', s: `反導函數：${ks('2x')} 變 ${ks('x^2')}，常數 ${ks('a')} 變 ${ks('ax')}。`},
  {h: '上限減下限', t: '=(1-a)-0=1-a', s: '代 1 減掉代 0。'},
  {h: '題目說它是 0', t: `1-a=0\\ \\Rightarrow\\ ${KG('a=1')}`, s: `所以 ${ks('f(x)=2x-1')}。跟上面的圖一樣。`}]);

// ── 11 (2)：拉 C
stepper('#st11b', [
  {h: '先寫出 g′', t: `g'(x)=3f(x)=3(2x-1)=6x-3`, s: `(1) 已經算出 ${ks('a=1')}。`},
  {h: '倒回去找 g', t: `g(x)=3x^2-3x+${KR('C')}`, s: `檢查：${ks('3x^2-3x+C')} 微分是 ${ks('6x-3')} ✓<br>不管 ${ks('C')} 是多少，微分都一樣，所以現在還不知道 ${ks('C')}。`}]);
(() => {
  const P = plot('#g11b', {x: [-.35, 1.5], y: [-1.1, 2.1], h: 250, pad: [14, 20, 14, 24]}), s = P.s;
  for (const c of [-.5, 0, .5, 1, 1.5]) el('path', {d: P.path(-.2, 1.2, x => 3 * x * x - 3 * x + c), fill: 'none', stroke: '#c9d6df', 'stroke-width': 1.5}, s);
  const up = el('path', {fill: C.bl, 'fill-opacity': .9}, s), dn = el('path', {fill: C.rl, 'fill-opacity': .9}, s);
  el('path', {d: `M${P.X(1)} ${P.Y(-1)}V${P.Y(2)}`, stroke: C.mu, 'stroke-width': 1.4, 'stroke-dasharray': '4 4'}, s);
  P.axes(); mt(s, P.X(1) + 12, P.Y(0) + 21, '1', {style: HALO});
  const cv = P.curve(-.2, 1.2, x => x), lb = mt(s, 0, 0, 'y=g(x)', {style: HALO + `fill:${C.b}`});
  const S = slide('kc', c => `${ks('C=')} ${sgn(c)}`, c => {
    const fn = x => 3 * x * x - 3 * x + c, [U, D] = areas(fn), ok = Math.abs(c - .5) < .001;
    up.setAttribute('d', P.pos(0, 1, fn)); dn.setAttribute('d', P.neg(0, 1, fn)); cv.setAttribute('d', P.path(-.2, 1.2, fn)); set(lb, {x: P.X(1.32), y: P.Y(fn(1.2)) - 6});
    $('#u11b').textContent = num(U); $('#d11b').textContent = num(D); $('#i11b').textContent = sgn(c - .5); $('#i11b').className = ok ? 'cg' : c > .5 ? 'cb' : 'cr';
    $('#s11b').innerHTML = sayBal(U, D, ok) + (ok ? `<br>這時 ${ks('C=\\frac12')}。` : `<br>灰色的線：其他 ${ks('C')} 的樣子，形狀都一樣。`);
  });
  $('#go11b').onclick = () => animTo(S, .5);
  S.go();
})();
stepper('#st11c', [
  {h: '代進去', t: '\\int_0^1(3x^2-3x+C)\\,dx=\\left(x^3-\\tfrac32x^2+Cx\\right)\\Big|_0^1', s: '每一項各自找反導函數。'},
  {h: '上限減下限', t: '=1-\\tfrac32+C=C-\\tfrac12', s: '下限 0 代進去是 0。'},
  {h: '題目說它是 0', t: `C-\\tfrac12=0\\ \\Rightarrow\\ ${KG('C=\\tfrac12')}`, s: '跟上面的圖找到的一樣。'},
  {h: '寫出答案', t: `g(x)=3x^2-3x+${KG('\\tfrac12')}`, s: `最後檢查：${ks("g'(x)=6x-3=3f(x)")} ✓，${ks('\\int_0^1g(x)\\,dx=0')} ✓`}]);

// ── 12
const F = x => 12 * x * (x - 1) * (x - 2) + 25;

// 往下移 25
(() => {
  const P = plot('#g12a', {x: [-.6, 2.8], y: [-7.5, 32], h: 290, pad: [14, 20, 14, 30]}), s = P.s;
  const ghost = el('path', {d: P.path(-.18, 2.18, F), fill: 'none', stroke: '#c9d6df', 'stroke-width': 2, 'stroke-dasharray': '5 4', opacity: 0}, s);
  P.axes({o: false});
  const ln = el('path', {stroke: C.r, 'stroke-width': 2, 'stroke-dasharray': '6 5'}, s), lnT = mt(s, P.X(2.58), 0, 'y=25', {style: HALO + `fill:${C.r}`});
  const cv = P.curve(-.18, 2.18, F), cT = mt(s, P.X(.9), 0, '', {style: HALO + `fill:${C.b}`});
  const dots = [0, 1, 2].map(v => el('circle', {r: 7, fill: C.r, stroke: '#fff', 'stroke-width': 2.5}, s));
  const pT = [0, 1, 2].map(v => mt(s, P.X(v) + (v === 1 ? 26 : v ? 34 : -30), 0, `(${v},25)`, {style: HALO + 'font-size:15px'}));
  const rT = [0, 1, 2].map(v => mt(s, P.X(v) + (v === 2 ? 12 : -10), P.Y(0) + 22, String(v), {style: HALO + `fill:${C.r};font-weight:700`, opacity: 0}));
  let k = 0, an, run = 0;
  const draw = () => {
    const d = 25 * k, y0 = 25 - d;
    cv.setAttribute('d', P.path(-.18, 2.18, x => F(x) - d)); ln.setAttribute('d', `M${P.X(-.5)} ${P.Y(y0)}H${P.X(2.7)}`); set(lnT, {y: P.Y(y0) - 8, opacity: 1 - k});
    dots.forEach((c, i) => set(c, {cx: P.X(i), cy: P.Y(y0)})); pT.forEach((t, i) => set(t, {y: P.Y(y0) + (i === 2 ? 24 : -12), opacity: k < .1 ? 1 : 0}));
    rT.forEach(t => t.setAttribute('opacity', k > .95 ? 1 : 0)); ghost.setAttribute('opacity', k > .02 ? 1 : 0); ln.setAttribute('opacity', k > .98 ? 0 : 1);
    cT.textContent = k > .95 ? 'y=f(x)−25' : 'y=f(x)'; set(cT, {x: P.X(k > .95 ? 1.75 : 2.45), y: P.Y(k > .95 ? 8 : 30)});
    onOnly('#b12a', k < .02 ? $('#b12a [data-m="0"]') : k > .98 ? $('#b12a [data-m="1"]') : null);
    $('#s12a').innerHTML = k < .02 ? `曲線和紅色虛線 ${ks('y=25')} 交在三點，高度都是 25。` : k > .98 ? `三點掉到 ${ks('x')} 軸上了！${ks('f(x)-25')} 在 ${ks('x=0,1,2')} 都是 0，這三個就是它的根。` : '整個往下移…';
  };
  $$('#b12a button').forEach(b => b.onclick = () => { const to = +b.dataset.m, from = k, my = ++run; if (an) an.stop(); an = tween(t => { if (my === run) { k = lerp(from, to, t); draw(); } }, {ease: 'easeInOut', duration: 1.4}); });
  draw();
})();

stepper('#st12a', [
  {h: '展開', t: '\\begin{gathered}f(x)=12(x^3-3x^2+2x)+25\\\\=12x^3-36x^2+24x+25\\end{gathered}', s: `先把 ${ks('x(x-1)(x-2)')} 乘開，再乘 12。`},
  {h: '微分一次', t: "f'(x)=36x^2-72x+24", s: '每一項：次方拿下來乘，次方減 1。常數 25 微分是 0。'},
  {h: '再微分一次', t: `f''(x)=72x-72=72(x-1)`, s: `${ks("f''")} 告訴我們曲線往哪邊彎。`},
  {h: '看正負', t: `\\begin{gathered}x<1:\\ f''<0\\ (\\text{向下彎 }\\cap)\\\\x>1:\\ f''>0\\ (\\text{向上彎 }\\cup)\\end{gathered}`, s: `在 ${ks('x=1')} 換方向，所以反曲點的 ${ks('x')} 坐標是 1。`},
  {h: '求 y 坐標', t: `f(1)=12\\cdot1\\cdot${KR('0')}\\cdot(-1)+25=25`, s: `用還沒展開的式子代比較快：中間的 ${ks('(x-1)')} 是 0。反曲點 ${ks('(1,25)')}。`}]);

// 繞 (1,25) 轉半圈
(() => {
  const P = plot('#g12b', {x: [-.45, 2.6], y: [18.5, 32], h: 250, pad: [14, 20, 14, 30]}), s = P.s, cx = P.X(1), cy = P.Y(25);
  el('path', {d: `M${P.X(-.4)} ${cy}H${P.X(2.5)}`, stroke: C.mu, 'stroke-width': 1.4, 'stroke-dasharray': '4 4'}, s); mt(s, P.X(2.42), cy - 8, 'y=25', {style: HALO + `fill:${C.mu}`});
  P.curve(-.15, 1, F); P.curve(1, 2.15, F, {stroke: C.g});
  mt(s, P.X(.18), P.Y(30.6), '向下彎 ∩', {style: HALO + `fill:${C.b};font-weight:700`}); mt(s, P.X(1.85), P.Y(19.6), '向上彎 ∪', {style: HALO + `fill:${C.g};font-weight:700`});
  const mv = el('path', {d: P.path(-.15, 1, F), fill: 'none', stroke: C.h, 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0}, s);
  [0, 2].forEach(v => el('circle', {cx: P.X(v), cy, r: 5, fill: C.ink}, s));
  el('circle', {cx, cy, r: 8, fill: C.r, stroke: '#fff', 'stroke-width': 3}, s); mt(s, cx + 6, cy + 26, '(1,25)', {style: HALO + `fill:${C.r};font-weight:700`});
  let run = 0;
  $('#p12b').onclick = async () => {
    const my = ++run; mv.setAttribute('opacity', .75); mv.setAttribute('transform', ''); $('#s12b').innerHTML = '把<b class="ch">左半邊</b>繞紅點轉…';
    await play(t => { if (my === run) mv.setAttribute('transform', `rotate(${180 * t} ${cx} ${cy})`); }, {ease: 'easeInOut', duration: 1.8});
    if (my === run) $('#s12b').innerHTML = `轉半圈後<b>剛好疊在右半邊上</b>！向下彎 ∩ 轉過去變成向上彎 ∪，紅點 ${ks('(1,25)')} 就是換方向的地方：反曲點。`;
  };
})();

// 轉半圈補洞
(() => {
  const P = plot('#g12c', {x: [-.45, 2.7], y: [-2, 32], h: 280, pad: [14, 20, 14, 30]}), s = P.s, cx = P.X(1), cy = P.Y(25);
  const base = el('path', {d: P.fill(0, 2, x => Math.min(F(x), 25)), fill: C.bl}, s);
  const hole = el('path', {d: P.fill(1, 2, () => 25, F), fill: '#fff', stroke: C.r, 'stroke-width': 1.8, 'stroke-dasharray': '4 3'}, s);
  const hump = el('path', {d: P.fill(0, 1, F, () => 25), fill: C.gl, stroke: C.g, 'stroke-width': 1.2}, s);
  P.axes(); P.ty(25, '25'); P.vline(0, 25); P.vline(2, 25); P.tx(2, '2');
  P.curve(-.1, 2.1, F, {'stroke-width': 2.4});
  el('circle', {cx, cy, r: 6, fill: C.r, stroke: '#fff', 'stroke-width': 2.5}, s);
  const out = mt(s, P.X(1), P.Y(11), '2 × 25 = 50', {style: HALO + `fill:${C.b};font-weight:700;font-size:22px`, opacity: 0});
  const tag = [mt(s, P.X(.43), P.Y(25.6), '凸起', {style: HALO.replace('5px', '3px') + `fill:${C.g};font-weight:700;font-size:14px`}), mt(s, P.X(1.72), P.Y(16.6), '凹洞', {style: HALO + `fill:${C.r};font-weight:700`})];
  let run = 0;
  $('#p12c').onclick = async () => {
    const my = ++run, ok = () => my === run;
    set(hump, {transform: '', fill: C.gl, stroke: C.g}); set(hole, {opacity: 1}); out.setAttribute('opacity', 0); tag.forEach(t => t.setAttribute('opacity', 1));
    $('#s12c').innerHTML = '<b class="cg">凸起</b>繞紅點 (1, 25) 轉半圈…'; await wait(.4); if (!ok()) return;
    tag.forEach(t => t.setAttribute('opacity', 0));
    await play(t => { if (ok()) hump.setAttribute('transform', `rotate(${180 * t} ${cx} ${cy})`); }, {ease: 'easeInOut', duration: 2}); if (!ok()) return;
    hole.setAttribute('opacity', 0); set(hump, {fill: C.bl, stroke: 'none'});
    await play(t => { if (ok()) out.setAttribute('opacity', t); }, {ease: 'easeOut', duration: .5}); if (!ok()) return;
    $('#s12c').innerHTML = `凸起<b>剛好補滿凹洞</b>，變成一個長方形：寬 2、高 25。<br>所以 ${ks('\\int_0^2f(x)\\,dx=2\\times25=50')}`;
  };
})();

stepper('#st12b', [
  {h: '拆成兩部分', t: `\\begin{aligned}\\int_0^2f(x)\\,dx&=${KG('\\int_0^2 12x(x-1)(x-2)\\,dx')}\\\\&\\quad+${KB('\\int_0^2 25\\,dx')}\\end{aligned}`, s: '綠色是「凸起和凹洞」，藍色是長方形。'},
  {h: '綠色那部分', t: '\\int_0^2(12x^3-36x^2+24x)\\,dx=\\left(3x^4-12x^3+12x^2\\right)\\Big|_0^2', s: '展開後逐項找反導函數。'},
  {h: '代進去', t: `=48-96+48=${KG('0')}`, s: '凸起（存進）和凹洞（花掉）一樣大，結餘 0。就是圖上「剛好補滿」。'},
  {h: '藍色那部分', t: `\\int_0^2 25\\,dx=25\\times2=${KB('50')}`, s: '高 25、寬 2 的長方形。'},
  {h: '加起來', t: `\\int_0^2f(x)\\,dx=0+50=50`, s: '跟圖一樣 ✓'}]);

quiz({key: 'gsat-math-integral-ex11_12', title: '積分習題11_12詳解', items: [
  {t: '∫₀¹(2x−a)dx=2 的 a', q: `如果第 11 題改成 ${ks('\\int_0^1(2x-a)\\,dx=2')}，${ks('a')} 是多少？`, o: [ks('-1'), '1', '3'], plain: ['−1', '1', '3'], a: 0, w: `${ks('1-a=2')}，所以 ${ks('a=-1')}。`, h: `定積分還是 ${ks('1-a')}，這次要等於 2。`},
  {t: 'g′ 一樣的兩個函數', q: `兩個函數的導函數一樣（${ks("g_1'=g_2'")}），它們差在哪裡？`, o: ['形狀不一樣', '只差一個常數（上下平移）', '一定完全一樣'], a: 1, col: true, w: `所以找反導函數要加 ${ks('C')}，再用別的條件定出它。`, h: '微分會把常數吃掉。想想 11 (2) 那些灰色的線。'},
  {t: 'y=25 改 y=10 的定積分', q: `如果第 12 題的 ${ks('y=25')} 改成 ${ks('y=10')}（三點變成 ${ks('(0,10),(1,10),(2,10)')}），${ks('\\int_0^2f(x)\\,dx')} 是多少？`, o: ['20', '50', '0'], a: 0, w: `凸起補凹洞後是寬 2、高 10 的長方形：${ks('2\\times10=20')}。`, h: '轉半圈補洞後，長方形的高變成多少？'}]});
})();
