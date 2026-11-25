(() => {
'use strict';
const VB = C.h, txt = (p, x, y, s, st = '') => { const t = el('text', {x, y, 'text-anchor': 'middle', style: st}, p); t.textContent = s; return t; };
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

// ── PART 5：水桶
(() => {
  const s = $('#g5');
  const T = plot(s, {x: [0, 7.6], y: [0, 7.4], w: 252, h: 150, pad: [20, 16, 12, 26]}), D = plot(s, {x: [0, 7.6], y: [0, 33], w: 252, h: 178, top: 214, pad: [22, 16, 24, 26]});
  const ar = el('path', {fill: C.bl}, s); T.axes({xn: 't', yn: 'y'}); T.curve(A, B, f); mt(s, T.X(4.3), T.Y(6.5), 'f(t)', {style: `fill:${C.b}`});
  const st = el('path', {stroke: C.b, 'stroke-width': 4, 'stroke-linecap': 'round'}, s);
  D.axes({xn: 'x', yn: 'y'}); mt(s, D.X(2.6), D.Y(17), 'g(x)', {style: `fill:${CT}`});
  el('path', {d: D.path(A, B, GF), fill: 'none', stroke: '#c9d8de', 'stroke-width': 2, 'stroke-dasharray': '3 4'}, s);
  const gc = el('path', {fill: 'none', stroke: CT, 'stroke-width': 3.5, 'stroke-linecap': 'round'}, s), tg = el('path', {stroke: C.h, 'stroke-width': 3.5, 'stroke-linecap': 'round'}, s), vl = el('path', {stroke: C.mu, 'stroke-dasharray': '3 3'}, s), dot = el('circle', {r: 6, fill: CT, stroke: '#fff', 'stroke-width': 2}, s);
  // 水龍頭與水桶
  const bx = 262, bw = 84, bt = 92, bb = 250;
  el('path', {d: `M${bx + 4} 44h30v-14h22v14q0 0 0 0v12h-18v-2h-34z`, fill: '#8a97a4'}, s); el('rect', {x: bx + 38, y: 20, width: 14, height: 12, rx: 3, fill: C.r}, s);
  const jet = el('rect', {y: 56, fill: '#5bb4de'}, s), water = el('rect', {x: bx + 3, width: bw - 6, fill: '#8fd0ec'}, s), wave = el('path', {fill: '#8fd0ec'}, s);
  el('path', {d: `M${bx} ${bt}V${bb}H${bx + bw}V${bt}`, fill: 'none', stroke: C.ink, 'stroke-width': 3, 'stroke-linejoin': 'round'}, s);
  const wt = txt(s, bx + bw / 2, bb + 24, '', `font-size:17px;font-weight:700;fill:${CT}`);
  let x = 1, auto, ph = 0;
  const draw = () => {
    const G = GF(x), w = f(x) * 2.6, top = bb - 2 - G / 30 * (bb - bt - 12);
    ar.setAttribute('d', x > A ? T.fill(A, x, f) : ''); st.setAttribute('d', `M${T.X(x)} ${T.Y(0)}V${T.Y(f(x))}`);
    gc.setAttribute('d', D.path(A, Math.max(A + .001, x), GF)); set(dot, {cx: D.X(x), cy: D.Y(G)});
    const d = .9, p = [x - d, x + d].map(v => [D.X(v), D.Y(G + f(x) * (v - x))]); tg.setAttribute('d', poly(p)); vl.setAttribute('d', `M${D.X(x)} ${D.Y(0)}V${D.Y(G)}`);
    set(jet, {x: bx + 47 - w / 2, width: w, height: Math.max(0, top - 56), opacity: auto || x > A ? 1 : 0}); set(water, {y: top, height: Math.max(0, bb - 1 - top)});
    wave.setAttribute('d', G > .3 ? `M${bx + 3} ${top + 1}q${(bw - 6) / 4} ${-5 * Math.sin(ph)} ${(bw - 6) / 2} 0t${(bw - 6) / 2} 0z` : ''); wt.textContent = `水量 ${fx(G, 1)}`;
    $('#f5').textContent = fx(f(x)); $('#v5').textContent = fx(G); $('#d5').textContent = fx(f(x));
  };
  const say = () => { $('#s5').innerHTML = x < 1.05 ? '水桶還是空的。' : `<span class="cb">水流 ${fx(f(x))}</span>，下面那條<span class="ch">切線的斜率也是 ${fx(f(x))}</span>。${x < 3 ? '水流正在變大，水位越漲越快。' : x < 5.5 ? '水流正在變小，水位還在漲，但是漲得比較慢。' : '水流又變大，水位又漲得更快了。'}`; };
  const H = handle(T, {v: 1, min: 1, max: 7, y: 178, color: CT, label: '終點 x', on: v => { x = v; ph += .5; draw(); say(); }, grab: () => { if (auto) auto.stop(); auto = null; }, demo: .9});
  H.draw();
  $('#p5').onclick = () => { H.stop(); if (auto) auto.stop(); if (reduce) { H.put(7); return; } H.put(1); auto = Motion.animate(1, 7, {duration: 7, ease: 'linear', onUpdate: v => H.put(v), onComplete: () => { auto = null; }}); };
  draw(); say();
})();

// ── PART 5 下半：多一小條
(() => {
  const s = $('#g6'), h0 = 236, I = $$('#b6 button'); set(s, {viewBox: `0 0 360 ${h0}`});
  const g = el('g', {}, s); let h = 1.5, an, run = 0;
  const draw = () => {
    g.textContent = ''; const P = plot(g, {x: [4 - .9 * h, 4 + 1.9 * h], y: [0, 7], h: h0, pad: [18, 16, 34, 16]});
    el('path', {d: P.fill(4, 4 + h, f), fill: '#a5dbe6'}, g);
    el('rect', {x: P.X(4), width: P.X(4 + h) - P.X(4), y: P.Y(f(4)), height: P.Y(0) - P.Y(f(4)), fill: 'none', stroke: C.w, 'stroke-width': 2, 'stroke-dasharray': '6 4'}, g);
    el('path', {d: `M8 ${P.Y(0)}H352`, stroke: C.ink, 'stroke-width': 1.6}, g); P.curve(Math.max(A, 4 - .9 * h), 4 + 1.9 * h, f);
    el('path', {d: `M${P.X(4)} ${P.Y(0)}V${P.Y(f(4))}`, stroke: C.b, 'stroke-width': 4}, g);
    mt(g, P.X(4), P.Y(0) + 22, '4'); mt(g, P.X(4 + h), P.Y(0) + 22, '4+h'); mt(g, P.X(4 + h / 2), P.Y(0) - 8, 'h', {style: `fill:${C.w};font-weight:700`}); mt(g, P.X(4) - 24, P.Y(2.6), 'f(4)', {style: `fill:${C.b}`});
  };
  const upd = (b, first) => {
    const to = +b.dataset.h, from = h, my = ++run, d = GF(4 + to) - GF(4); onOnly('#b6', b); if (an) an.stop();
    if (first) draw(); else an = tween(t => { if (my === run) { h = Math.exp(lerp(Math.log(from), Math.log(to), t)); draw(); } }, {ease: 'easeInOut', duration: 1});
    $('#a6').textContent = fx(d, to < .1 ? 4 : 3); $('#q6').textContent = fx(d / to, 3); $('#f6').textContent = fx(f(4), 3);
    $('#s6').innerHTML = to > 1 ? '上緣還有點彎，跟虛線長方形差一些。' : to > .2 ? `放大來看，細條更像長方形了。多的水量 ÷ ${ks('h')}，越來越靠近 ${ks('f(4)')}。` : to > .05 ? '幾乎就是長方形：<b>高 f(4) × 寬 h</b>。' : `多的水量 ÷ ${ks('h')} 就是 ${ks("g'(4)")}，而它跑到 ${ks('f(4)')}。<b>所以 ${ks("g'(4)=f(4)")}。</b>`;
  };
  I.forEach(b => b.onclick = () => upd(b)); upd(I[0], true);
})();
mini('#try5', [
  {q: `${ks('\\displaystyle g(x)=\\int_1^x(t^2+3)\\,dt')}，${ks("g'(x)=")}？`, o: [ks('x^2+3'), ks('\\frac{x^3}{3}+3x'), ks('2x')], a: 0, w: `把裡面的 ${ks('t')} 換成 ${ks('x')} 就好。`, h: ['', '這是在積分。題目問的是「積分完再微分」。', '多微分了一次。積分再微分，會剛好變回原來的。']},
  {q: `${ks('\\displaystyle g(x)=\\int_2^x(t^2+1)^{10}\\,dt')}，${ks("g'(x)=")}？`, o: [ks('(x^2+1)^{10}'), ks('10(x^2+1)^9'), '太難，算不出來'], a: 0, col: 1, w: '10 次方看起來很可怕，<b>但是根本不用乘開</b>。', h: ['', '不用對裡面微分。積分再微分，會變回原來的。', '不用真的積分。想想水桶：水量的變化速度就是什麼？']}]);

// ── PART 6：水表
(() => {
  const P = plot('#g7', {x: [-.3, 5.3], y: [0, 11], h: 340, pad: [14, 20, 148, 22]}), s = P.s, I = $('#c7');
  const ar = el('path', {fill: C.bl}, s); P.axes(); P.curve(0, 5.1, x => 2 * x); mt(s, P.X(3.6), P.Y(9.2), 'y=2x', {style: `fill:${C.b}`});
  for (let i = 1; i <= 5; i++) mt(s, P.X(i), P.Y(0) + 20, String(i), {style: 'fill:#566473;font-size:15px'});
  const meter = (x, name, col) => {
    el('rect', {x, y: 272, width: 150, height: 62, rx: 12, fill: '#26313c'}, s); el('rect', {x: x + 10, y: 298, width: 130, height: 30, rx: 5, fill: '#d9f2d9'}, s);
    txt(s, x + 75, 291, name, 'fill:#fff;font-size:14px'); const t = txt(s, x + 75, 321, '', `font-size:22px;font-weight:700;font-variant-numeric:tabular-nums;fill:${col}`); return t;
  };
  const ma = meter(18, '月初讀數 F(a)', CT), mb = meter(192, '月底讀數 F(b)', C.r);
  let a = 1, b = 3, c = 0, an, run = 0;
  const draw = () => { ar.setAttribute('d', P.fill(a, b, x => 2 * x)); ma.textContent = fx(a * a + c, 2); mb.textContent = fx(b * b + c, 2); };
  const text = () => {
    const cc = +I.value, t = num; $('#c7-o').textContent = `c = ${cc}`;
    K(`\\int_{${t(a)}}^{${t(b)}}2x\\,dx=${KR(t(b * b + cc))}-${KT(t(a * a + cc))}=${t(b * b - a * a)}`, $('#f7'), true);
    $('#s7').innerHTML = cc ? `水表原本就有 ${cc} 度，<b>月初、月底都多 ${cc}，一減就消掉</b>。` : `藍色面積就是用水量。拖拖看，再動動 ${ks('c')}，答案會變嗎？`;
  };
  I.oninput = () => { const to = +I.value, from = c, my = ++run; if (an) an.stop(); an = tween(t => { if (my === run) { c = lerp(from, to, t); draw(); } }, {duration: .6, bounce: 0}); text(); };
  handle(P, {v: a, min: 0, max: () => b - .5, step: .5, y: 238, color: CT, label: '月初 a', gap: 26, on: v => { a = v; draw(); text(); }, demo: .7});
  handle(P, {v: b, min: () => a + .5, max: 5, step: .5, y: 238, color: C.r, label: '月底 b', gap: 26, on: v => { b = v; draw(); text(); }, demo: 1});
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
