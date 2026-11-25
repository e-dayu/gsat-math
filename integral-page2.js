(() => {
'use strict';

K(`\\sum_{i=1}^{n}${KH('f(t_i)')}\\cdot${KW('\\Delta x')}`, $('#f1'), true);
const total = hs => hs.reduce((a, b) => a + b, 0) * (B - A) / hs.length;
const exts = n => Array.from({length: n}, (_, i) => ext(A + (B - A) * i / n, A + (B - A) * (i + 1) / n));
const ab = s => { mt(s, X(A), Y(0) + 21, 'a'); mt(s, X(B), Y(0) + 21, 'b'); };

// ── PART 2：越切越細
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

// ── PART 3：每段的 M_i、m_i
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

// ── PART 4：下和、上和
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

// ── PART 5：夾擠
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

// ── PART 6：四步推理
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
    w: `每段都有 ${ks('m_i\\le f(t_i)\\le M_i')}，加起來就夾在中間。`, h: '回 PART 5 丟黎曼和，看它們都落在哪裡。'},
  {t: 'lim L_n = lim U_n = 8 時', q: `如果 ${ks('\\displaystyle\\lim_{n\\to\\infty}L_n=\\lim_{n\\to\\infty}U_n=8')}，那麼 ${ks('R')} 的面積是？`, o: ['8', '16', '無法確定'], a: 0,
    w: '夾擠定理：左右都跑到 8，面積只能是 8。黎曼和的極限也是 8。', h: '面積一直夾在下和、上和中間。兩邊都跑到 8 時，中間還能站在哪裡？'}]});
})();
