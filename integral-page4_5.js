(() => {
'use strict';
const VB = C.h, P5 = '#d9ccf5', txt = (p, x, y, s, st = '') => { const t = el('text', {x, y, 'text-anchor': 'middle', style: st}, p); t.textContent = s; return t; };
const chipAt = (s, w, h, fill, size = 20) => { // 會移動的卡片
  const g = el('g', {opacity: 0}, s); el('rect', {x: -w / 2, y: -h / 2, width: w, height: h, rx: 9, fill}, g);
  let t = null;
  return {g, at: (x, y, o = 1) => set(g, {transform: `translate(${x} ${y})`, opacity: Math.max(0, Math.min(1, o))}), txt: v => { if (t) t.remove(); t = mt(g, 0, size * .34, v, {style: `fill:#fff;font-size:${size}px`}); }};
};

// ── PART 1：微分機
(() => {
  const s = $('#g1'), MY = 84;
  el('path', {d: `M28 ${MY + 34}H126M234 ${MY + 34}H332`, stroke: C.mu, 'stroke-width': 4, 'stroke-linecap': 'round'}, s);
  const mac = el('g', {}, s);
  el('rect', {x: 124, y: MY - 46, width: 112, height: 92, rx: 16, fill: '#3b4754'}, mac); el('rect', {x: 133, y: MY - 37, width: 94, height: 74, rx: 10, fill: '#fff6df'}, mac);
  const mn = txt(mac, 180, MY - 4, '微分機', 'font-size:20px;font-weight:700'), arr = txt(mac, 180, MY + 24, '▶ ▶ ▶', `font-size:15px;fill:${C.w}`);
  txt(s, 62, 22, '放進去', `font-size:14px;fill:${CT};font-weight:700`); txt(s, 298, 22, '出來', `font-size:14px;fill:${VB};font-weight:700`);
  const ci = chipAt(s, 84, 44, CT), co = chipAt(s, 84, 44, VB);
  el('text', {x: 14, y: 168, style: `font-size:14px;fill:${CT};font-weight:700`}, s).textContent = '2x 的反導函數：';
  const tray = el('g', {}, s); for (let i = 0; i < 3; i++) el('rect', {x: 14 + i * 112, y: 176, width: 104, height: 32, rx: 8, fill: 'none', stroke: '#c9d1d8', 'stroke-width': 1.5, 'stroke-dasharray': '4 3'}, s);
  s.appendChild(tray);
  const L = [['x^2', 'x²', '2x', '2x'], ['x^3', 'x³', '3x^2', '3x²'], ['x^2+3', 'x²+3', '2x', '2x'], ['5x', '5x', '5', '5'], ['x^2-1', 'x²−1', '2x', '2x']];
  const found = []; let run = 0;
  const shake = (ok, d) => play(t => { if (ok()) mac.setAttribute('transform', `translate(${Math.sin(t * 45) * 2.5 * (1 - t)} 0)`); }, {ease: 'linear', duration: d});
  L.forEach(([tx, show, dt, dshow], i) => {
    const b = document.createElement('button'); K(tx, b); $('#b1').appendChild(b);
    b.onclick = async () => {
      const my = ++run, ok = () => my === run, go = (cb, o) => play(t => { if (ok()) cb(t); }, o);
      onOnly('#b1', b); arr.textContent = '▶ ▶ ▶'; mn.textContent = '微分機'; co.at(0, 0, 0); ci.txt(show); co.txt(dshow); $('#s1').innerHTML = `放進 ${ks(tx)}…`;
      await go(t => ci.at(lerp(20, 66, t), MY, t), {duration: .5, bounce: .2}); if (!ok()) return; await wait(.25); if (!ok()) return;
      go(t => ci.at(lerp(66, 150, t), MY, 1 - t), {ease: 'easeIn', duration: .5}); await shake(ok, .9); if (!ok()) return;
      await go(t => co.at(lerp(210, 294, t), MY, t * 1.4), {duration: .8, bounce: .35}); if (!ok()) return; ci.at(66, MY, .35);
      const hit = dt === '2x';
      if (hit && !found.includes(i)) {
        const k = found.push(i) - 1, c = chipAt(tray, 104, 32, CT, 18); c.txt(show);
        await go(t => c.at(lerp(66, 66 + k * 112, t), lerp(MY, 192, t), t * 2), {duration: .7, bounce: .25}); c.at(66 + k * 112, 192);
      }
      if (!ok()) return;
      $('#s1').innerHTML = hit ? `出來 ${ks('2x')} ✓　${ks(tx)} 是 ${ks('2x')} 的<b>一個</b>反導函數。` + (found.length === 3 ? '<br><b>找到三個了！</b>它們只差一個常數，因為常數微分後都是 0。' : '<br>還有別的嗎？') : `出來 ${ks(dt)}，不是 ${ks('2x')}。換一個。`;
    };
  });
  $('#rev').onclick = async () => {
    const my = ++run, ok = () => my === run, go = (cb, o) => play(t => { if (ok()) cb(t); }, o);
    onOnly('#b1', null); arr.textContent = '◀ ◀ ◀'; mn.textContent = '倒著跑'; ci.at(0, 0, 0); co.txt('2x'); $('#s1').innerHTML = `把 ${ks('2x')} 從出口倒著放進去…`;
    await go(t => co.at(lerp(345, 294, t), MY, t), {duration: .6, bounce: .2}); if (!ok()) return; await wait(.25); if (!ok()) return;
    go(t => co.at(lerp(294, 210, t), MY, 1 - t), {ease: 'easeIn', duration: .5}); await shake(ok, .9); if (!ok()) return;
    ci.txt('x²+?'); await go(t => ci.at(lerp(150, 66, t), MY, t * 1.4), {duration: .8, bounce: .3});
    for (const v of ['x²', 'x²+3', 'x²−1', 'x²+50', 'x²+c']) { if (!ok()) return; ci.txt(v); await wait(.55); }
    if (!ok()) return; ci.txt('x²+c');
    $('#s1').innerHTML = `出來的是 ${ks('x^2')} <b>加上一個不知道的數</b>。這個數寫成 ${ks('c')}，叫<b>常數</b>：${ks('x^2+c')}。`;
  };
})();

// ── PART 2：上下搬，斜度不變
(() => {
  const P = plot('#g2', {x: [-2.7, 2.7], y: [-4.6, 8.4], h: 306, pad: [14, 20, 46, 20]}), s = P.s, I = $('#c2');
  P.axes();
  const gh = [-3, 0, 3].map(() => P.put('path', {fill: 'none', stroke: '#9cc7e0', 'stroke-width': 2}));
  [-3, 0, 3].forEach((c, i) => gh[i].setAttribute('d', P.path(-2.3, 2.3, x => x * x + c)));
  const gt = [-3, 0, 3].map(() => P.put('path', {stroke: C.h, 'stroke-width': 2, opacity: .35})), v = P.put('path', {stroke: CT, 'stroke-width': 1.5, 'stroke-dasharray': '4 3'});
  const cv = P.put('path', {fill: 'none', stroke: C.b, 'stroke-width': 3.5}), tg = P.put('path', {stroke: C.h, 'stroke-width': 4, 'stroke-linecap': 'round'}), dot = P.put('circle', {r: 7, fill: C.h, stroke: '#fff', 'stroke-width': 2});
  let c = 0, x = 1, an, run = 0;
  const seg = (cc, w) => { const y = x * x + cc, d = w / Math.hypot(1, 2 * x * .45); return `M${P.X(x - d)} ${P.Y(y - 2 * x * d)}L${P.X(x + d)} ${P.Y(y + 2 * x * d)}`; };
  const draw = () => {
    cv.setAttribute('d', P.path(-2.3, 2.3, t => t * t + c)); tg.setAttribute('d', seg(c, .95)); gt.forEach((e, i) => e.setAttribute('d', seg([-3, 0, 3][i], .7)));
    set(dot, {cx: P.X(x), cy: P.Y(x * x + c)}); v.setAttribute('d', `M${P.X(x)} ${P.Y(Math.max(8, x * x + c))}V${P.Y(0)}`);
  };
  const text = () => {
    const cc = +I.value; $('#x2').textContent = sgn(x); $('#y2').textContent = sgn(x * x + cc); $('#m2').textContent = sgn(2 * x); $('#c2-o').textContent = `c = ${sgn(cc)}`;
    $('#s2').innerHTML = `${ks(`F(x)=x^2${cc ? (cc > 0 ? '+' : '') + num(cc) : ''}`)}。在 ${ks(`x=${num(x)}`)}，<b class="ch">斜率都是 ${ks(`2x=${num(2 * x)}`)}</b>，跟 ${ks('c')} 無關。淡紫色的切線也都<b>平行</b>。`;
  };
  I.oninput = () => { const to = +I.value, from = c, my = ++run; if (an) an.stop(); an = tween(t => { if (my === run) { c = lerp(from, to, t); draw(); } }, {duration: .6, bounce: .3}); text(); };
  handle(P, {v: 1, min: -1.6, max: 1.6, step: .1, y: P.h - 22, color: C.h, label: '位置 x', on: q => { x = +q.toFixed(1); draw(); text(); }, demo: .8});
  draw(); text();
})();

// ── PART 4：次方 +1，除以新次方
(() => {
  const s = $('#g4'), I = $('#n4'), big = z => ({style: `font-size:${z}px`}); let run = 0;
  const g = el('g', {}, s);
  mt(g, 160, 92, 'x', big(58)); const ex = mt(g, 187, 60, '2', {style: `font-size:32px;fill:${C.h}`}), bar = el('path', {stroke: C.ink, 'stroke-width': 3, 'stroke-linecap': 'round'}, g), den = mt(g, 172, 156, '', {style: `font-size:32px;fill:${C.w}`});
  const plus = el('g', {opacity: 0}, s); el('circle', {r: 20, fill: C.h}, plus); txt(plus, 0, 7, '+1', 'fill:#fff;font-weight:700;font-size:19px');
  const fly = mt(s, 0, 0, '', {style: `font-size:32px;fill:${C.w}`, opacity: 0});
  const setEx = v => { ex.lastChild.textContent = v; };
  const reset = () => { run++; const n = +I.value; $('#n4-o').textContent = `n = ${n}`; setEx(n); bar.setAttribute('d', ''); den.textContent = ''; set(plus, {opacity: 0}); fly.setAttribute('opacity', 0); ex.setAttribute('transform', ''); $('#s4').innerHTML = `要積的是 ${ks(`x^{${n}}`)}${n === 0 ? `，也就是 ${ks('1')}` : ''}。按「積一次」。`; };
  I.oninput = reset;
  $('#p4').onclick = async () => {
    reset(); const my = run, n = +I.value, m = n + 1, ok = () => my === run, go = (cb, o) => play(t => { if (ok()) cb(t); }, o);
    $('#s4').innerHTML = `<b class="ch">① 次方加 1</b>：${n} 變成 ${m}`;
    await go(t => set(plus, {transform: `translate(${lerp(318, 190, t)} ${lerp(30, 48, t) - Math.sin(t * 3.14) * 18})`, opacity: t < .85 ? 1 : (1 - t) / .15}), {ease: 'easeInOut', duration: .9}); if (!ok()) return;
    setEx(m); await go(t => ex.setAttribute('transform', `translate(187 60) scale(${1.7 - .7 * t}) translate(-187 -60)`), {duration: .6, bounce: .4}); if (!ok()) return;
    $('#s4').innerHTML = `<b style="color:var(--w)">② 除以新次方</b>：除以 ${m}`; fly.textContent = m;
    go(t => bar.setAttribute('d', `M${172 - 46 * t} 110h${92 * t}`), {ease: 'easeOut', duration: .5});
    await go(t => set(fly, {x: lerp(187, 172, t) + Math.sin(t * 3.14) * 40, y: lerp(60, 156, t), opacity: 1}), {ease: 'easeInOut', duration: 1}); if (!ok()) return;
    const F = m === 1 ? 'x' : `\\frac{x^{${m}}}{${m}}`;
    $('#s4').innerHTML = `${ks(`\\int ${n === 0 ? '1' : n === 1 ? 'x' : `x^{${n}}`}\\,dx=${F}+c`)}<br>微分回去檢查：${ks(`\\left(${F}\\right)'=${m === 1 ? '1' : m === 2 ? 'x' : `x^{${n}}`}`)} ✓`;
  };
  reset();
})();
(() => {
  const T = [['4x^3', 'x^4', '\\frac{4x^4}{4}'], ['-6x^2', '-2x^3', '\\frac{-6x^3}{3}'], ['+2x', '+x^2', '\\frac{2x^2}{2}'], ['+5', '+5x', '5x^1']], done = [0, 0, 0, 0];
  const f4 = () => K('\\int(4x^3-6x^2+2x+5)\\,dx=', $('#f4'), true);
  T.forEach(([a, r, mid], i) => {
    const b = document.createElement('button'); K(a, b); $('#t4').appendChild(b); const d = document.createElement('div'); d.className = 'r'; d.textContent = '↓'; $('#r4').appendChild(d);
    b.onclick = async () => {
      b.classList.add('on'); done[i] = 1; K(mid, d); if (!reduce) Motion.animate(d, {opacity: [0, 1], y: [-26, 0]}, {type: 'spring', bounce: .35, duration: .6});
      $('#s4b').innerHTML = `${ks(a.replace('+', ''))}：次方加 1，再除以新次方。`;
      await wait(.9); K(r, d); if (!reduce) Motion.animate(d, {scale: [1.35, 1]}, {type: 'spring', bounce: .4, duration: .5});
      if (done.every(Boolean)) { K('\\begin{gathered}\\int(4x^3-6x^2+2x+5)\\,dx\\\\=x^4-2x^3+x^2+5x+c\\end{gathered}', $('#f4'), true); $('#s4b').innerHTML = '四項都積好了，<b>最後補一個 +c</b>。'; }
    };
  });
  f4();
})();
mini('#try4', [
  {q: `${ks('\\displaystyle\\int 6x\\,dx=')}？`, o: [ks('6x^2+c'), ks('3x^2+c'), ks('6+c')], a: 1, w: `${ks('\\frac{6x^2}{2}=3x^2')}，再加 ${ks('c')}。`, h: ['次方加 1 之後，還要<b>除以新次方</b> 2。', '', '6 是微分的結果。這裡要倒著做。']},
  {col: 1, q: `${ks('\\displaystyle\\int(3x^2+1)\\,dx=')}？`, o: [ks('x^3+x'), ks('x^3+x+c'), ks('6x+c')], a: 1, w: `${ks('3x^2\\to x^3')}，${ks('1\\to x')}，最後加 ${ks('c')}。`, h: ['算對了，但是漏了 +c。', '', `${ks('6x')} 是微分的結果。這裡要倒著做。`]}]);

// ── PART 5 ①：存錢，加起來再減回去
(() => {
  const s = $('#g5a'), D = [1, 3, 5, 7], U = 8, W = 46, T0 = 90, B0 = 274, cx = i => 62 + i * 80, SUM = [1, 4, 9, 16];
  const tt = (x, y, t, c, z = 15, a = 'middle') => { const e = el('text', {x, y, 'text-anchor': a, style: `font-size:${z}px;font-weight:700;fill:${c}`}, s); e.textContent = t; return e; };
  tt(6, 20, '每天存', C.h, 15, 'start'); tt(6, 142, '存摺總共', C.b, 15, 'start');
  el('path', {d: `M14 ${T0}H346M14 ${B0}H346`, stroke: C.ink, 'stroke-width': 1.5}, s);
  D.forEach((d, i) => { tt(cx(i), T0 + 19, `第${i + 1}天`, '#566473', 14); tt(cx(i), B0 + 19, `第${i + 1}天`, '#566473', 14); el('rect', {x: cx(i) - W / 2, y: T0 - d * U, width: W, height: d * U, fill: 'none', stroke: '#b9a3e3', 'stroke-dasharray': '4 3'}, s); });
  const prev = D.map(() => el('rect', {width: W, fill: C.bl, stroke: C.b, 'stroke-width': 1.2}, s)), tile = D.map(() => el('rect', {width: W, fill: P5, stroke: C.h, 'stroke-width': 1.5}, s)), tot = D.map((_, i) => tt(cx(i), 0, '', C.b, 19)), dl = D.map((_, i) => tt(cx(i), 0, '', C.h, 17));
  let run = 0;
  const at = (r, i, base, n, o = 1) => set(r, {x: cx(i) - W / 2, y: base - n * U, height: n * U, opacity: o});
  const top = i => { at(tile[i], i, T0, D[i]); dl[i].textContent = D[i]; set(dl[i], {y: T0 - D[i] * U - 6, opacity: 1}); };
  const lab = (i, n) => { tot[i].textContent = n; tot[i].setAttribute('y', B0 - n * U - 7); };
  const start = () => D.forEach((_, i) => { top(i); at(prev[i], i, B0, 0, 0); tot[i].textContent = ''; });
  const full = () => D.forEach((d, i) => { const p = SUM[i] - d; at(prev[i], i, B0, p, p ? 1 : 0); set(tile[i], {x: cx(i) - W / 2, y: B0 - SUM[i] * U, height: d * U, opacity: 1}); lab(i, SUM[i]); dl[i].textContent = ''; });
  $('#add5').onclick = async () => {
    const my = ++run, ok = () => my === run, go = (cb, o) => play(t => { if (ok()) cb(t); }, o); start();
    for (let i = 0; i < 4; i++) {
      const p = SUM[i] - D[i];
      if (i) { $('#s5a').innerHTML = `把昨天的 <b class="cb">${p}</b> 搬過來…`; await go(t => set(prev[i], {x: lerp(cx(i - 1), cx(i), t) - W / 2, y: B0 - p * U, height: p * U, opacity: Math.min(1, t * 2)}), {ease: 'easeInOut', duration: .7}); if (!ok()) return; }
      const y0 = T0 - D[i] * U, y1 = B0 - SUM[i] * U;
      await go(t => { tile[i].setAttribute('y', lerp(y0, y1, t)); set(dl[i], {y: lerp(y0, y1, t) - 6, opacity: 1 - t}); }, {duration: .8, bounce: .25}); if (!ok()) return;
      lab(i, SUM[i]); $('#s5a').innerHTML = `疊上今天的 <b class="ch">${D[i]}</b>：${i ? `${p} ＋ ${D[i]} ＝ ` : '總共 '}<b class="cb">${SUM[i]}</b>`; await wait(.9); if (!ok()) return;
    }
    full(); $('#s5a').innerHTML = '<b>一直加，就是累積。</b>總共是 1、4、9、16。再按「減回去」。';
  };
  $('#sub5').onclick = async () => {
    const my = ++run, ok = () => my === run, go = (cb, o) => play(t => { if (ok()) cb(t); }, o); full();
    for (let i = 3; i >= 0; i--) {
      const p = SUM[i] - D[i], y0 = B0 - SUM[i] * U, y1 = T0 - D[i] * U;
      $('#s5a').innerHTML = i ? `第 ${i + 1} 天 − 第 ${i} 天：<b class="cb">${SUM[i]} − ${p}</b> ＝ ？` : '第 1 天，前一天是 0：<b class="cb">1 − 0</b> ＝ ？'; await wait(.8); if (!ok()) return;
      await go(t => prev[i].setAttribute('opacity', p ? 1 - t * .85 : 0), {ease: 'easeOut', duration: .6}); if (!ok()) return;
      tot[i].textContent = ''; dl[i].textContent = D[i];
      await go(t => { tile[i].setAttribute('y', lerp(y0, y1, t)); set(dl[i], {y: lerp(y0, y1, t) - 6, opacity: t}); }, {duration: .9, bounce: .2}); if (!ok()) return;
      top(i); $('#s5a').innerHTML = `${SUM[i]} − ${p} ＝ <b class="ch">${D[i]}</b>，就是第 ${i + 1} 天存的錢！`; await wait(.8); if (!ok()) return;
    }
    start(); $('#s5a').innerHTML = '<b class="ch">1、3、5、7，全部變回來了！</b><br>加起來，再相減，就回到原本的數。';
  };
  start();
})();

// ── PART 5 ②：y=2x 與累積面積 x²，上下同一把尺
(() => {
  const s = $('#g5'), U = 11.6, fn = x => 2 * x, sq = x => x * x;
  const T = plot(s, {x: [-.5, 4.6], y: [0, 9.3], w: 360, h: 9.3 * U + 24, pad: [10, 22, 14, 24]}), D = plot(s, {x: [-.5, 4.6], y: [-1.4, 17.4], w: 360, top: 196, h: 18.8 * U + 22, pad: [14, 22, 8, 24]});
  const ar = el('path', {fill: C.bl}, s), cut = el('g', {}, s); T.axes({o: false}); T.curve(0, 4.2, fn); mt(s, T.X(3.1), T.Y(8.2), 'y=2x', {style: `fill:${C.b}`});
  const hi = el('path', {stroke: C.h, 'stroke-width': 5, 'stroke-linecap': 'round'}, s), hl = mt(s, 0, 0, '', {'text-anchor': 'start', style: HALO + `fill:${C.h};font-weight:700`});
  D.axes({o: false}); mt(s, D.X(2.15), D.Y(10), '累積 x²', {style: `fill:${CT}`}); el('path', {d: D.path(0, 4.1, sq), fill: 'none', stroke: '#c9d8de', 'stroke-width': 2, 'stroke-dasharray': '3 4'}, s);
  const gc = el('path', {fill: 'none', stroke: CT, 'stroke-width': 3.5, 'stroke-linecap': 'round'}, s), tri = el('path', {fill: P5, 'fill-opacity': .6, stroke: 'none'}, s), run1 = el('path', {stroke: C.w, 'stroke-width': 3}, s), rise = el('path', {stroke: C.h, 'stroke-width': 5, 'stroke-linecap': 'round'}, s), tg = el('path', {stroke: C.ink, 'stroke-width': 2.5, 'stroke-linecap': 'round'}, s), dot = el('circle', {r: 6, fill: CT, stroke: '#fff', 'stroke-width': 2}, s), rl = mt(s, 0, 0, '', {'text-anchor': 'start', style: HALO + `fill:${C.h};font-weight:700`}), ol = mt(s, 0, 0, '1', {style: HALO + `fill:${C.w};font-weight:700`});
  const STRIP = [1, 3, 5, 7], labs = STRIP.map((v, i) => { el('path', {d: `M${T.X(i + 1)} ${T.Y(0)}V${T.Y(fn(i + 1))}`, stroke: C.b, 'stroke-width': 1.2, opacity: 0}, cut); return mt(cut, T.X(i + .5) - (i ? 0 : 5), T.Y(i ? Math.max(.6, i * .9) : 2), String(v), {style: 'font-weight:700', opacity: 0}); });
  let x = 1, an;
  const draw = () => {
    const h = fn(x), y = sq(x); ar.setAttribute('d', x > 0 ? T.fill(0, x, fn, undefined, 2) : ''); [...cut.children].forEach((e, i) => e.setAttribute('opacity', x >= Math.floor(i / 2) + .999 ? 1 : 0));
    hi.setAttribute('d', h > .05 ? `M${T.X(x)} ${T.Y(0)}V${T.Y(h)}` : ''); hl.textContent = h > .6 ? num(h) : ''; set(hl, {x: T.X(x) + 8, y: T.Y(h / 2) + 6});
    gc.setAttribute('d', x > 0 ? D.path(0, x, sq, 60) : ''); set(dot, {cx: D.X(x), cy: D.Y(y)});
    const X0 = D.X(x - 1), X1 = D.X(x), Y0 = D.Y(y - h), Y1 = D.Y(y); tri.setAttribute('d', `M${X0} ${Y0}H${X1}V${Y1}Z`); run1.setAttribute('d', `M${X0} ${Y0}H${X1}`); rise.setAttribute('d', h > .05 ? `M${X1} ${Y0}V${Y1}` : '');
    const e = x > 3.9 ? .12 : .3; tg.setAttribute('d', `M${D.X(x - 1.15)} ${D.Y(y - h * 1.15)}L${D.X(x + e)} ${D.Y(y + h * e)}`);
    rl.textContent = h > .6 ? num(h) : ''; set(rl, {x: X1 + 8, y: (Y0 + Y1) / 2 + 6}); set(ol, {x: (X0 + X1) / 2, y: Y0 + 17, opacity: x > .6 ? 1 : 0});
    $('#x5').textContent = num(x); $('#f5').textContent = num(h); $('#v5').textContent = num(y); $('#d5').textContent = num(h);
    $('#s5').innerHTML = x < .05 ? '從 0 出發，還沒累積。下面的切線是<b>平的</b>，斜率 0。' : `上面的<b class="ch">高度 ${num(h)}</b>，和下面切線「走 1、升 ${num(h)}」的<b class="ch">紫色線段一樣長</b>。${x > 3 ? '<b>切線變得很陡了！</b>' : '切線越來越陡。'}`;
  };
  const H = handle(T, {v: 1, min: 0, max: 4, step: .1, y: 9.3 * U + 48, color: CT, label: '累積到 x', on: v => { x = Math.round(v * 20) / 20; draw(); }, grab: () => { if (an) an.stop(); }, demo: .8});
  $('#p5').onclick = () => { H.stop(); if (an) an.stop(); if (reduce) return H.put(4); H.put(0); an = Motion.animate(0, 4, {duration: 7, ease: 'linear', onUpdate: v => H.put(v), onComplete: () => H.put(4)}); };
  draw();
})();

// ── PART 5 ③：剛加上去的那一條
(() => {
  const s = $('#g6'), h0 = 244, I = $$('#b6 button'), fn = x => 2 * x; set(s, {viewBox: `0 0 360 ${h0}`});
  const g = el('g', {}, s); let h = 1, an, run = 0;
  const draw = () => {
    g.textContent = ''; const P = plot(g, {x: [3 - .9 * h, 3 + 1.9 * h], y: [0, 10], h: h0, pad: [16, 16, 34, 16]}), a = 3 - .9 * h, b = 3 + 1.9 * h;
    el('path', {d: P.fill(a, 3, fn), fill: '#e8f2f8'}, g); el('path', {d: P.fill(3, 3 + h, fn), fill: P5}, g);
    el('rect', {x: P.X(3), width: P.X(3 + h) - P.X(3), y: P.Y(6), height: P.Y(0) - P.Y(6), fill: 'none', stroke: C.w, 'stroke-width': 2, 'stroke-dasharray': '6 4'}, g);
    el('path', {d: `M8 ${P.Y(0)}H352`, stroke: C.ink, 'stroke-width': 1.6}, g); P.curve(a, b, fn);
    el('path', {d: `M${P.X(3)} ${P.Y(0)}V${P.Y(6)}`, stroke: C.h, 'stroke-width': 5}, g);
    mt(g, P.X(3), P.Y(0) + 22, '3'); mt(g, P.X(3 + h), P.Y(0) + 22, '3+h'); mt(g, P.X(3 + h / 2), P.Y(0) - 8, 'h', {style: `fill:${C.w};font-weight:700`}); mt(g, P.X(3) - 30, P.Y(2.6), '高 6', {style: `fill:${C.h};font-weight:700`});
  };
  const upd = (b, first) => {
    const to = +b.dataset.h, from = h, my = ++run; onOnly('#b6', b); if (an) an.stop();
    if (first) draw(); else an = tween(t => { if (my === run) { h = Math.exp(lerp(Math.log(from), Math.log(to), t)); draw(); } }, {ease: 'easeInOut', duration: 1});
    const d = 6 * to + to * to; $('#a6').textContent = +d.toFixed(4); $('#q6').textContent = +(6 + to).toFixed(2); $('#f6').textContent = '6';
    $('#s6').innerHTML = to === 1 ? `多出的面積是 ${ks('4^2-3^2=7')}。上緣還斜斜的，比虛線長方形多一小塊。` : to === .1 ? `${ks('3.1^2-3^2=0.61')}，除以 0.1 是 6.1。<b>放大看，已經很像長方形了。</b>` : `${ks('3.01^2-3^2=0.0601')}，除以 0.01 是 6.01。<b>幾乎就是長方形</b>，除以 ${ks('h')} 就剩下<b class="ch">高 6</b>。`;
  };
  I.forEach(b => b.onclick = () => upd(b)); upd(I[0], true);
})();
mini('#try5', [
  {q: `${ks('\\displaystyle g(x)=\\int_1^x(t^2+3)\\,dt')}，${ks("g'(x)=")}？`, o: [ks('x^2+3'), ks('\\frac{x^3}{3}+3x'), ks('2x')], a: 0, w: `把裡面的 ${ks('t')} 換成 ${ks('x')} 就好。`, h: ['', '這是在積分。題目問的是「積分完再微分」。', '多微分了一次。積分再微分，會剛好變回原來的。']},
  {q: `${ks('\\displaystyle g(x)=\\int_2^x(t^2+1)^{10}\\,dt')}，${ks("g'(x)=")}？`, o: [ks('(x^2+1)^{10}'), ks('10(x^2+1)^9'), '太難，算不出來'], a: 0, col: 1, w: '10 次方看起來很可怕，<b>但是根本不用乘開</b>。', h: ['', '不用對裡面微分。積分再微分，會變回原來的。', '不用真的積分。想想 PART 5：剛加上去的那條，有多高？']}]);

// ── PART 6：存摺
(() => {
  const P = plot('#g7', {x: [-.3, 5.3], y: [0, 11], h: 340, pad: [14, 20, 148, 22]}), s = P.s, I = $('#c7');
  const ar = el('path', {fill: C.bl}, s); P.axes(); P.curve(0, 5.1, x => 2 * x); mt(s, P.X(3.6), P.Y(9.2), 'y=2x', {style: `fill:${C.b}`});
  for (let i = 1; i <= 5; i++) mt(s, P.X(i), P.Y(0) + 20, String(i), {style: 'fill:#566473;font-size:15px'});
  const meter = (x, name, col) => {
    el('rect', {x, y: 272, width: 150, height: 62, rx: 12, fill: col}, s); el('rect', {x: x + 8, y: 297, width: 134, height: 31, rx: 5, fill: '#fff8e6'}, s);
    txt(s, x + 75, 291, name, 'fill:#fff;font-size:14px'); const t = txt(s, x + 75, 321, '', `font-size:22px;font-weight:700;font-variant-numeric:tabular-nums;fill:${col}`); return t;
  };
  const ma = meter(18, '期初餘額 F(a)', CT), mb = meter(192, '期末餘額 F(b)', C.r);
  let a = 1, b = 3, c = 0, an, run = 0;
  const draw = () => { ar.setAttribute('d', P.fill(a, b, x => 2 * x)); ma.textContent = fx(a * a + c, 2); mb.textContent = fx(b * b + c, 2); };
  const text = () => {
    const cc = +I.value, t = num; $('#c7-o').textContent = `c = ${cc}`;
    K(`\\int_{${t(a)}}^{${t(b)}}2x\\,dx=${KR(t(b * b + cc))}-${KT(t(a * a + cc))}=${t(b * b - a * a)}`, $('#f7'), true);
    $('#s7').innerHTML = cc ? `原本就有 ${cc} 元，<b>期初、期末都多 ${cc}，一減就消掉</b>。` : `藍色面積就是這段時間存的錢。拖拖看，再動動 ${ks('c')}，答案會變嗎？`;
  };
  I.oninput = () => { const to = +I.value, from = c, my = ++run; if (an) an.stop(); an = tween(t => { if (my === run) { c = lerp(from, to, t); draw(); } }, {duration: .6, bounce: 0}); text(); };
  handle(P, {v: a, min: 0, max: () => b - .5, step: .5, y: 238, color: CT, label: '期初 a', gap: 26, on: v => { a = v; draw(); text(); }, demo: .7});
  handle(P, {v: b, min: () => a + .5, max: 5, step: .5, y: 238, color: C.r, label: '期末 b', gap: 26, on: v => { b = v; draw(); text(); }, demo: 1});
  draw(); text();
})();

// ── PART 7
stepper('#st7', [
  {h: '找反導函數', t: 'F(x)=x^3-x^2', s: `${ks('3x^2\\to x^3')}，${ks('-2x\\to-x^2')}。微分回去檢查：${ks("F'(x)=3x^2-2x")} ✓`},
  {h: '寫上代入的記號', t: '\\int_1^3(3x^2-2x)\\,dx=(x^3-x^2)\\,\\Big|_1^3', s: '右邊那條線的意思：等一下要用 3 和 1 代進去。'},
  {h: '上限代進去', t: KR('F(3)=3^3-3^2=27-9=18'), s: '先代上面的 3。'},
  {h: '下限代進去', t: KT('F(1)=1^3-1^2=1-1=0'), s: '再代下面的 1。'},
  {h: '上減下', t: `\\int_1^3(3x^2-2x)\\,dx=${KR('18')}-${KT('0')}=18`, s: '<b>上限的減掉下限的</b>，順序不能反。'}]);
mini('#try7', [{q: '', o: [ks('-3'), '3', '5'], a: 0, w: `${ks('F(x)=x^3-4x')}，${ks('F(2)=8-8=0')}，${ks('F(-1)=-1+4=3')}，${ks('0-(3)=-3')}。定積分是負的也沒關係。`, h: ['', '順序反了，要用<b>上限 2</b> 的減掉<b>下限 −1</b> 的。', `${ks('F(-1)=(-1)^3-4\\times(-1)')}，再小心算一次正負號。`]}]);

// ── PART 8：六個性質
(() => {
  const P = plot('#g8', {x: [-.4, 7.9], y: [0, 8], h: 250, pad: [18, 20, 30, 26]}), s = P.s, g = el('g', {}, s), top = el('g', {}, s); P.g = top; P.axes(); P.g = g;
  let run = 0;
  const lab = (v, t, at) => mt(g, P.X(v), P.Y(0) + 21, t, {style: HALO, ...at});
  const fl = (a, b, fn, lo, at) => el('path', {d: P.fill(a, b, fn, lo || (() => 0)), ...at}, g);
  const A1 = x => f(x) * .5, p = x => 2 + .5 * Math.sin(x), q = x => 1.6 + .5 * Math.cos(x * .9), O = {h: 'm'};
  const PR = [
    ['(1) 常數', `\\int_a^bk\\,dx=k(b-a)`, '高度一直是 k，寬是 b−a。<b>就是一個長方形。</b>', async go => {
      const r = el('rect', {x: P.X(1), y: P.Y(4), height: P.Y(0) - P.Y(4), width: 0, fill: C.bl, stroke: C.b, 'stroke-width': 1.5}, g); P.curve(0, 7.2, () => 4); lab(1, 'a'); lab(6, 'b'); mt(g, P.X(0) - 12, P.Y(4) + 6, 'k', {style: `fill:${C.h}`});
      await go(t => r.setAttribute('width', Math.max(0, (P.X(6) - P.X(1)) * t)), {duration: 1.2, bounce: .1}); mt(g, P.X(3.5), P.Y(2) + 6, 'k(b−a)', {style: 'font-size:22px'});
    }],
    ['(2) 同一點', `\\int_a^af(x)\\,dx=0`, '從 a 走到 a，<b>根本沒走</b>，寬是 0，面積也是 0。', async go => {
      P.curve(A, B, f); const r = fl(2, 6, f, null, {fill: C.bl}), ln = el('path', {stroke: C.b, 'stroke-width': 2}, g); lab(2, 'a'); const bl = lab(6, 'b', {style: HALO + `fill:${C.r}`}); await wait(.5);
      await go(t => { const b = lerp(6, 2.001, t); r.setAttribute('d', P.fill(2, b, f)); bl.setAttribute('x', P.X(b)); ln.setAttribute('d', `M${P.X(2)} ${P.Y(0)}V${P.Y(f(2))}M${P.X(b)} ${P.Y(0)}V${P.Y(f(b))}`); bl.setAttribute('opacity', t > .93 ? 0 : 1); }, {ease: 'easeInOut', duration: 1.8});
    }],
    ['(3) 乘 k 倍', `\\int_a^bk\\cdot f(x)\\,dx=k\\int_a^bf(x)\\,dx`, '每一條都變成 k 倍高，<b>總和也就是 k 倍</b>。圖上 k＝2。', async go => {
      const n = 10, w = .5, rs = Array.from({length: n}, (_, i) => el('rect', {x: P.X(1 + w * i), width: P.X(w) - P.X(0), fill: C.bl, stroke: C.b}, g)); const cv = P.curve(1, 6, A1); lab(1, 'a'); lab(6, 'b'); el('path', {d: P.path(1, 6, A1), fill: 'none', stroke: C.mu, 'stroke-width': 2, 'stroke-dasharray': '4 3'}, g);
      const dr = k => { rs.forEach((r, i) => { const v = A1(1 + w * (i + .5)) * k; set(r, {y: P.Y(v), height: P.Y(0) - P.Y(v)}); }); cv.setAttribute('d', P.path(1, 6, x => A1(x) * k)); }; dr(1); await wait(.6); await go(t => dr(lerp(1, 2, t)), {duration: 1.4, bounce: .3}); mt(g, P.X(6.9), P.Y(5), 'k·f(x)', {style: `fill:${C.b}`}); mt(g, P.X(6.8), P.Y(2.4), 'f(x)', {style: 'fill:#566473'});
    }],
    ['(4) 相加', `\\begin{aligned}&\\int_a^b\\bigl(f(x)+g(x)\\bigr)dx\\\\&=\\int_a^bf(x)\\,dx+\\int_a^bg(x)\\,dx\\end{aligned}`, '把 g 的每一條<b>疊到 f 上面</b>。分開加、合起來加，一樣多。', async go => {
      fl(1, 6, p, null, {fill: C.bl, stroke: C.b}); lab(1, 'a'); lab(6, 'b'); mt(g, P.X(3.5), P.Y(1), 'f(x)', {style: `fill:${C.b}`}); const u = el('g', {}, g); el('path', {d: P.fill(1, 6, x => p(x) + q(x), p), fill: '#d9ccf5', stroke: C.h}, u); mt(u, P.X(2.2), P.Y(2.95), 'g(x)', {style: `fill:${C.h}`});
      u.setAttribute('transform', 'translate(0 -80)'); await wait(.5); await go(t => u.setAttribute('transform', `translate(0 ${-80 * (1 - t)})`), {duration: 1.2, bounce: .35});
    }],
    ['(5) 切兩段', `\\begin{aligned}&\\int_a^bf(x)\\,dx\\\\&=\\int_a^cf(x)\\,dx+\\int_c^bf(x)\\,dx\\end{aligned}`, '先走到 c，再從 c 走到 b。<b>兩段加起來，就是整段。</b>', async go => {
      const a = el('path', {fill: C.bl}, g), b = el('path', {fill: C.gl}, g); P.curve(A, B, f); lab(1.5, 'a'); lab(4, 'c', {style: HALO + `fill:${C.w};font-weight:700`}); lab(6.5, 'b'); el('path', {d: `M${P.X(4)} ${P.Y(0)}V${P.Y(f(4))}`, stroke: C.w, 'stroke-width': 3}, g);
      await go(t => a.setAttribute('d', P.fill(1.5, lerp(1.501, 4, t), f)), {ease: 'easeInOut', duration: 1}); await wait(.2); await go(t => b.setAttribute('d', P.fill(4, lerp(4.001, 6.5, t), f)), {ease: 'easeInOut', duration: 1});
    }],
    ['(6) 反過來走', `\\int_b^af(x)\\,dx=-\\int_a^bf(x)\\,dx`, '倒著走，每一步的寬是<b class="cr">負的</b>，所以整個<b>變號</b>。', async go => {
      const a = el('path', {fill: C.bl}, g), r = el('path', {fill: C.rl}, g); P.curve(A, B, f); lab(2, 'a'); lab(6, 'b'); const ar = el('path', {d: 'M-12 -9L8 0L-12 9z', fill: C.b}, g), m = mt(g, P.X(4), P.Y(2.4), '+', {style: `font-size:40px;fill:${C.b}`, opacity: 0});
      const mv = (x, d) => ar.setAttribute('transform', `translate(${P.X(x)} ${P.Y(.5)}) scale(${d} 1)`); mv(2, 1);
      await go(t => { const x = lerp(2.001, 6, t); a.setAttribute('d', P.fill(2, x, f)); mv(x, 1); m.setAttribute('opacity', t); }, {ease: 'easeInOut', duration: 1.2}); await wait(.7);
      ar.setAttribute('fill', C.r); await go(t => { const x = lerp(5.999, 2, t); r.setAttribute('d', P.fill(x, 6, f)); mv(x, -1); m.setAttribute('opacity', Math.abs(1 - 2 * t)); if (t > .5) { m.lastChild.textContent = '−'; m.style.fill = C.r; } }, {ease: 'easeInOut', duration: 1.4});
    }]];
  const pick = async (i, b) => {
    const my = ++run; onOnly('#b8', b); g.textContent = ''; K(PR[i][1], $('#f8'), true); $('#s8').innerHTML = PR[i][2];
    const guard = (cb, o) => play(t => { if (my === run) cb(t); }, o).then(() => { if (my !== run) throw O; });
    try { await PR[i][3](guard); } catch (e) { if (e !== O) throw e; }
  };
  PR.forEach((r, i) => { const b = document.createElement('button'); b.textContent = r[0]; b.onclick = () => pick(i, b); $('#b8').appendChild(b); });
  P.curve(A, B, f); $('#s8').textContent = '按一個性質，看動畫。';
})();

// ── PART 9
stepper('#st9', [
  {h: '一項一項積', t: '\\left(x^4-2x^3+x^2+5x\\right)\\Big|_0^2', s: '就是 PART 4 積出來的那一串。<b>定積分不用寫 +c。</b>'},
  {h: '上限 2 代進去', t: KR('16-16+4+10=14'), s: `${ks('2^4=16')}，${ks('2\\times2^3=16')}，${ks('2^2=4')}，${ks('5\\times2=10')}`},
  {h: '下限 0 代進去', t: KT('0-0+0+0=0'), s: '每一項都有 x，代 0 全部是 0。'},
  {h: '上減下', t: `\\begin{aligned}&\\int_0^2(4x^3-6x^2+2x+5)\\,dx\\\\&=${KR('14')}-${KT('0')}=14\\end{aligned}`, s: '完成！'}]);

quiz({key: 'gsat-math-integral-page4_5', title: '積分page4_5教學', items: [
  {t: '3x² 的反導函數', q: `哪一個是 ${ks('3x^2')} 的反導函數？`, o: [ks('6x'), ks('x^3+7'), ks('3x^3')], plain: ['6x', 'x³+7', '3x³'], a: 1, w: `${ks("(x^3+7)'=3x^2")}。常數 7 微分後是 0。`, h: '把每個選項拿去微分，看誰會變成 3x²。'},
  {t: '∫(4x+3)dx', col: 1, q: `${ks('\\displaystyle\\int(4x+3)\\,dx=')}？`, o: [ks('2x^2+3x+c'), ks('2x^2+3+c'), ks('4')], plain: ['2x²+3x+c', '2x²+3+c', '4'], a: 0, w: `${ks('4x\\to2x^2')}，${ks('3\\to3x')}，再加 ${ks('c')}。`, h: '常數 3 積分後會變成什麼？回 PART 4 看 5 變成什麼。'},
  {t: 'g(x)=∫₀ˣ(t³−2t)dt 的 g′(2)', q: `${ks('\\displaystyle g(x)=\\int_0^x(t^3-2t)\\,dt')}，${ks("g'(2)=")}？`, o: ['4', '0', '10'], a: 0, w: `${ks("g'(x)=x^3-2x")}，${ks('8-4=4')}。`, h: `${ks("g'(x)")} 就是把裡面的 ${ks('t')} 換成 ${ks('x')}，再代 2。`},
  {t: '∫₁²(2x+3)dx', q: `${ks('\\displaystyle\\int_1^2(2x+3)\\,dx=')}？`, o: ['10', '4', '6'], a: 2, w: `${ks('(x^2+3x)\\Big|_1^2=10-4=6')}。`, h: '上限代進去的，還要減掉下限代進去的。'},
  {t: '∫f=5、∫g=2，求 ∫(2f−3g)', q: `已知 ${ks('\\displaystyle\\int_0^4f(x)\\,dx=5')}，${ks('\\displaystyle\\int_0^4g(x)\\,dx=2')}，求 ${ks('\\displaystyle\\int_0^4\\bigl(2f(x)-3g(x)\\bigr)dx')}`, o: ['3', '4', '16'], a: 1, w: `${ks('2\\times5-3\\times2=4')}。`, h: '用性質 (3) 和 (4)：拆開，倍數提出來。'},
  {t: '∫₁⁵f=8、∫₃⁵f=6，求 ∫₁³f', q: `已知 ${ks('\\displaystyle\\int_1^5f(x)\\,dx=8')}，${ks('\\displaystyle\\int_3^5f(x)\\,dx=6')}，求 ${ks('\\displaystyle\\int_1^3f(x)\\,dx')}`, o: ['2', '14', ks('-2')], plain: ['2', '14', '−2'], a: 0, w: `整段 ＝ 前段 ＋ 後段，所以前段是 ${ks('8-6=2')}。`, h: '用性質 (5)：1 到 5 切成 1 到 3、3 到 5。'}]});
})();
