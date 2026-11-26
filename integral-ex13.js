(() => {
'use strict';
// 曲線超出圖框的部分裁掉
const clip = (P, id, x, y) => { const c = el('clipPath', {id}, el('defs', {}, P.s)); el('rect', {x: P.X(x[0]), y: P.Y(y[1]), width: P.X(x[1]) - P.X(x[0]), height: P.Y(y[0]) - P.Y(y[1])}, c); return `url(#${id})`; };
const cub = a => x => a * x ** 3 - x;

// ── 第 (1) 小題：三個條件
(() => {
  const X0 = [-2.3, 2.3], Y0 = [-1.9, 1.9], P = plot('#g1', {x: X0, y: Y0, h: 290, pad: [14, 18, 14, 18]}), s = P.s, cp = clip(P, 'c1', X0, Y0), f = cub(.5);
  const tan = el('path', {stroke: C.w, 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round'}, s), tri = el('g', {opacity: 0}, s);
  P.axes({o: false});
  const cv = P.curve(X0[0], X0[1], f, {'clip-path': cp});
  const Lc = el('path', {fill: 'none', stroke: C.r, 'stroke-width': 6, 'stroke-linecap': 'round', 'clip-path': cp, opacity: .75}, s), Rc = el('path', {fill: 'none', stroke: C.g, 'stroke-width': 6, 'stroke-linecap': 'round', 'clip-path': cp, opacity: .75}, s);
  const sl = el('path', {stroke: C.h, 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0}, s), sd = el('circle', {r: 5, fill: C.h, opacity: 0}, s);
  const lb = el('g', {}, s), dot = el('circle', {cx: P.X(0), cy: P.Y(0), r: 6, fill: C.ink}, s);
  mt(s, P.X(0) + 12, P.Y(0) + 20, 'O'); mt(s, P.X(1.75), P.Y(1.45), 'y=f(x)', {style: `fill:${C.b};${HALO}`});
  el('path', {d: `M${P.X(.05)} ${P.Y(0)}H${P.X(1)}V${P.Y(-1)}`, fill: 'none', stroke: C.w, 'stroke-width': 1.8, 'stroke-dasharray': '4 3'}, tri);
  mt(tri, P.X(.55), P.Y(0) - 7, '1', {style: `fill:${C.w};font-weight:700;${HALO}`}); mt(tri, P.X(1) + 12, P.Y(-.5) + 6, '1', {style: `fill:${C.w};font-weight:700;${HALO}`});
  mt(tri, P.X(-1.55), P.Y(1.3) + 26, 'y=−x', {style: `fill:${C.w};font-weight:700;${HALO}`});
  const tanLine = t => `M${P.X(-1.7 * t)} ${P.Y(1.7 * t)}L${P.X(1.7 * t)} ${P.Y(-1.7 * t)}`;
  const df = x => 1.5 * x * x - 1; // f'(x)
  let run = 0;
  const reset = () => { run++; tan.setAttribute('d', ''); tri.setAttribute('opacity', 0); Lc.setAttribute('d', ''); Rc.setAttribute('d', ''); sl.setAttribute('opacity', 0); sd.setAttribute('opacity', 0); lb.textContent = ''; dot.setAttribute('r', 6); return run; };
  const go = (my, cb, o) => tween(t => { if (my === run) cb(t); }, o);
  const M = {
    d() {
      const my = reset(); K('f(0)=a\\cdot0+b\\cdot0+c\\cdot0+d=d=0', $('#f1'), true);
      $('#s1').innerHTML = `原點 ${ks('(0,0)')} <b>在圖形上</b>，把 ${ks('x=0')} 代進去會得到 ${ks('0')}。<br>前三項都乘到 0，只剩 ${ks('d')}，所以 <b>${ks('d=0')}</b>。`;
      go(my, t => dot.setAttribute('r', 6 + 10 * Math.sin(Math.PI * t)), {ease: 'easeInOut', duration: 1.2});
    },
    c() {
      const my = reset(); K("f'(0)=3a\\cdot0+2b\\cdot0+c=c=-1", $('#f1'), true);
      $('#s1').innerHTML = `切線 ${ks('y=-x')}：往右 1、往下 1，<b>斜率是 ${ks('-1')}</b>。<br>切線斜率 = 導數，所以 ${ks("f'(0)=-1")}，得 <b>${ks('c=-1')}</b>。`;
      go(my, t => tan.setAttribute('d', tanLine(t)), {ease: 'easeOut', duration: 1, onComplete: () => { if (my === run) go(my, t => tri.setAttribute('opacity', t), {ease: 'easeOut', duration: .5}); }});
    },
    b() {
      const my = reset(); K("f''(0)=6a\\cdot0+2b=2b=0", $('#f1'), true);
      $('#s1').innerHTML = '看紫色的切線一路滑過去…';
      const x0 = -1.75, x1 = 1.75;
      go(my, t => {
        const x = lerp(x0, x1, t), m = df(x), u = .55 / Math.hypot(1, m), y = f(x);
        set(sl, {d: `M${P.X(x - u)} ${P.Y(y - m * u)}L${P.X(x + u)} ${P.Y(y + m * u)}`, opacity: 1, stroke: x < 0 ? C.r : C.g}); set(sd, {cx: P.X(x), cy: P.Y(y), opacity: 1, fill: x < 0 ? C.r : C.g});
        Lc.setAttribute('d', P.path(x0, Math.min(x, 0), f)); Rc.setAttribute('d', x > 0 ? P.path(0, x, f) : '');
      }, {ease: 'linear', duration: 3.2, onComplete: () => {
        if (my !== run) return;
        sl.setAttribute('opacity', 0); sd.setAttribute('opacity', 0);
        mt(lb, P.X(-1.05), P.Y(.7) - 18, '向下彎 ∩', {style: `fill:${C.r};font-weight:700;${HALO}`}); mt(lb, P.X(1.05), P.Y(-.7) + 34, '向上彎 ∪', {style: `fill:${C.g};font-weight:700;${HALO}`});
        $('#s1').innerHTML = `左邊<b class="cr">向下彎</b>，右邊<b class="cg">向上彎</b>，在原點<b>換方向</b>：這就是反曲點。<br>反曲點的地方 ${ks("f''=0")}，所以 <b>${ks('b=0')}</b>。`;
      }});
    }};
  $$('#b1 button').forEach(b => b.onclick = () => { onOnly('#b1', b); M[b.dataset.m](); });
})();

// ── a 還沒決定
(() => {
  const X0 = [-2.3, 2.3], Y0 = [-1.7, 1.7], P = plot('#g0', {x: X0, y: Y0, h: 250, pad: [14, 18, 14, 18]}), s = P.s, cp = clip(P, 'c0', X0, Y0), I = $('#a0');
  el('path', {d: `M${P.X(-1.7)} ${P.Y(1.7)}L${P.X(1.7)} ${P.Y(-1.7)}`, stroke: C.w, 'stroke-width': 2.5, 'stroke-dasharray': '7 5', 'clip-path': cp}, s);
  P.axes({o: false});
  const cv = P.curve(X0[0], X0[1], cub(.5), {'clip-path': cp}), lab = mt(s, P.X(1.5), P.Y(1.4), '', {style: `fill:${C.b};font-weight:700;${HALO}`});
  el('circle', {cx: P.X(0), cy: P.Y(0), r: 6, fill: C.ink}, s); mt(s, P.X(-1.45), P.Y(1.55) + 24, 'y=−x', {style: `fill:${C.w};font-weight:700;${HALO}`});
  const draw = () => { const a = +I.value; cv.setAttribute('d', P.path(X0[0], X0[1], cub(a), 200)); $('#a0-o').textContent = `a = ${fx(a)}`; lab.textContent = `a = ${fx(a)}`; };
  I.oninput = draw; draw();
  if (!reduce) { let used = false; I.addEventListener('pointerdown', () => { used = true; }, {once: true}); Motion.inView(s, () => { if (used) return; const v0 = +I.value; const an = Motion.animate(0, 1, {duration: 2.4, ease: 'easeInOut', delay: .4, onUpdate: q => { if (!used) { I.value = v0 + .45 * Math.sin(q * 6.283); draw(); } }, onComplete: () => { if (!used) { I.value = v0; draw(); } }}); return () => an.stop(); }, {amount: .6}); }
})();

// ── 第 (2) 小題：面積與 a
(() => {
  const X0 = [-3.5, 3.5], Y0 = [-1.75, 1.75], P = plot('#g2', {x: X0, y: Y0, h: 270, pad: [14, 16, 14, 16]}), s = P.s, cp = clip(P, 'c2', X0, Y0), I = $('#a2');
  const Lp = el('path', {fill: C.bl}, s), Rp = el('path', {fill: C.rl}, s), mv = el('path', {fill: C.gl, 'fill-opacity': .8, stroke: C.g, 'stroke-width': 1.5, opacity: 0}, s);
  P.axes({o: false});
  const cv = P.curve(X0[0], X0[1], cub(.6), {'clip-path': cp}), dots = [-1, 0, 1].map(() => el('circle', {r: 5, fill: C.ink}, s));
  const tk = [mt(s, 0, 0, '', {style: HALO + 'font-size:15px'}), mt(s, 0, 0, '', {style: HALO + 'font-size:15px'})], sL = mt(s, 0, 0, '+', {style: `fill:${C.b};font-size:24px;font-weight:700`}), sR = mt(s, 0, 0, '−', {style: `fill:${C.r};font-size:26px;font-weight:700`});
  mt(s, P.X(0) + 12, P.Y(0) + 20, 'O');
  let a = +I.value, run = 0, an;
  const draw = () => {
    const f = cub(a), k = 1 / Math.sqrt(a), A2 = 1 / (2 * a), y0 = P.Y(0);
    mv.setAttribute('opacity', 0); mv.removeAttribute('transform');
    cv.setAttribute('d', P.path(X0[0], X0[1], f, 200)); Lp.setAttribute('d', P.fill(-k, 0, f)); Rp.setAttribute('d', P.fill(0, k, f));
    [-k, 0, k].forEach((v, i) => set(dots[i], {cx: P.X(v), cy: y0}));
    set(tk[0], {x: P.X(-k), y: y0 + 22}); tk[0].textContent = sgn(-k); set(tk[1], {x: P.X(k), y: y0 - 10}); tk[1].textContent = sgn(k);
    const h = 2 / (3 * Math.sqrt(3 * a)); set(sL, {x: P.X(-k / 1.9), y: P.Y(h * .45) + 8}); set(sR, {x: P.X(k / 1.9), y: P.Y(-h * .45) + 9});
    I.value = a; $('#a2-o').textContent = `a = ${fx(a)}`; $('#v2a').textContent = fx(a); $('#v2k').textContent = '±' + fx(k); $('#v2s').textContent = fx(A2);
    const ok = Math.abs(A2 - 2) < .02; $('#v2s').className = ok ? 'cg' : '';
    $('#s2').innerHTML = ok ? `面積<b class="cg">剛好是 2</b>！這時 ${ks('a=\\frac14')}，交點在 ${ks('\\pm2')}。` : `左邊一塊在<b class="cb">上面</b>，右邊一塊在<b class="cr">下面</b>。面積 ${fx(A2)}，比 2 ${A2 < 2 ? '<b>小</b>，<span class="ch">a</span> 要再<b>小</b>一點' : '<b>大</b>，<span class="ch">a</span> 要再<b>大</b>一點'}。`;
  };
  I.oninput = () => { run++; if (an) an.stop(); a = +I.value; draw(); };
  $('#p2f').onclick = () => { const my = ++run, from = a; if (an) an.stop(); an = tween(t => { if (my === run) { a = lerp(from, .25, t); draw(); } }, {ease: 'easeInOut', duration: 1.6}); };
  $('#p2r').onclick = () => {
    const my = ++run; if (an) an.stop(); draw(); const k = 1 / Math.sqrt(a);
    mv.setAttribute('d', P.fill(0, k, cub(a))); mv.setAttribute('opacity', 1); $('#s2').innerHTML = '把右邊下面那塊，繞著原點轉半圈…';
    an = tween(t => { if (my === run) mv.setAttribute('transform', `rotate(${-180 * t} ${P.X(0)} ${P.Y(0)})`); }, {ease: 'easeInOut', duration: 1.9, onComplete: () => { if (my === run) $('#s2').innerHTML = '<b>完全重疊</b>，兩塊一樣大！<br>所以面積 = <b>右邊那塊 × 2</b>。'; }});
  };
  draw();
})();

stepper('#st2', [
  {h: '找和 x 軸的交點', t: `ax^3-x=x(ax^2-1)=0\\ \\Rightarrow\\ x=0,\\ \\pm\\frac1{\\sqrt a}`, s: `${ks('a>0')}，才開得了根號，才有三個交點、圍出兩塊。`},
  {h: '看正負、用對稱', t: `0<x<\\tfrac1{\\sqrt a}\\text{ 時 }f(x)${KR('<0')}`, s: `右邊那塊在<b class="cr">下面</b>。奇函數左右兩塊一樣大（上面轉半圈看過了），<b>算右邊、再乘 2</b>。`},
  {h: '列式：下面的加負號', t: `\\begin{aligned}\\text{面積}&=2\\left(${KR('-')}\\int_0^{\\frac1{\\sqrt a}}(ax^3-x)\\,dx\\right)\\\\&=2\\int_0^{\\frac1{\\sqrt a}}(x-ax^3)\\,dx\\end{aligned}`, s: '負號乘進去，括號裡變成 x − ax³，在這一段是正的。'},
  {h: '找反導函數、代進去', t: `=2\\left[\\frac{x^2}2-\\frac{ax^4}4\\right]_0^{\\frac1{\\sqrt a}}=2\\left(\\frac1{2a}-\\frac{a}{4a^2}\\right)`, s: `${ks('x^2=\\frac1a')}，${ks('x^4=\\frac1{a^2}')}。下限 0 代進去是 0。`},
  {h: '化簡', t: `=2\\left(\\frac1{2a}-\\frac1{4a}\\right)=2\\cdot\\frac1{4a}=\\frac1{2a}`, s: `面積 = ${ks('\\frac1{2a}')}：${ks('a')} 越小，面積越大，跟上面拖的結果一樣。`},
  {h: '令它等於 2', t: `\\frac1{2a}=2\\ \\Rightarrow\\ ${KG('a=\\frac14')}`, s: `${ks('a=\\frac14')} 符合 ${ks('a>0')} ✓`}]);

mini('#try', [
  {q: `如果面積改成 8，${ks('a')} 是多少？`, o: [ks('\\frac1{16}'), ks('\\frac14'), ks('4'), ks('\\frac18')], a: 0, w: `${ks('\\frac1{2a}=8')}，${ks('2a=\\frac18')}，${ks('a=\\frac1{16}')}。`, h: `用上面算好的 ${ks('\\text{面積}=\\frac1{2a}')}。`},
  {q: `${ks('a=\\frac14')} 時，${ks('\\int_{-2}^{2}f(x)\\,dx')} 是多少？`, o: [ks('0'), ks('2'), ks('1'), ks('4')], a: 0, w: '奇函數對稱積分，一正一負抵消，結餘是 0。面積才是 2。', h: `${ks('f(x)=\\frac14x^3-x')} 是奇函數，上下兩塊會怎樣？`},
  {q: `如果 ${ks('a<0')}，圖形和 ${ks('x')} 軸會圍出有界區域嗎？`, o: ['會', '不會'], a: 1, w: `${ks('ax^2-1')} 永遠是負的，只交在原點一次，圍不起來。`, h: `${ks('a<0')} 時，${ks('ax^2-1=0')} 有解嗎？`}]);
})();
