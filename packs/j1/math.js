// じぶんドリル 型ライブラリ: 中1 数学（学習指導要領の 6領域・36型）
// 正負の数 → 文字と式 → 一次方程式 → 比例・反比例 → 平面図形・空間図形 → データの活用
// 検証: node tools/verify.js j1 math 400
PACKS.register('j1', 'math', function (H) {
  var ri = H.ri, ch = H.ch, gd = H.gd, num = H.num;
  function I(v, pre, u) { var a = { k: 'int', v: v, u: u || '' }; if (pre) a.pre = pre; return a; }
  function X(v, pre, u) { var a = { k: 'expr', v: v }; if (pre) a.pre = pre; if (u) a.u = u; return a; }
  function D(v, u) { return { k: 'dec', v: Math.round(v * 100) / 100, u: u || '' }; }
  function N(v, u) { return num(v, u || ''); }
  function C(t, s, ans) { return { t: t, s: s, ans: ans, pad: 'calc' }; }     // 計算問題（小さめの 手書き枠）
  function W(t, s, ans) { return { t: t, s: s, ans: ans }; }                 // 文章題（式・答え・計算の枠）
  function m(n) { return n < 0 ? '−' + (-n) : String(n); }                  // 表示用の −
  function pm(n) { return n < 0 ? '(−' + (-n) + ')' : '(＋' + n + ')'; }     // (−7)・(＋3)
  function nz(r, a, b) { var v = 0; while (v === 0) v = ri(r, a, b); return v; }
  function nz1(r, a, b) { var v = 0; while (v === 0 || v === 1 || v === -1) v = ri(r, a, b); return v; }
  function term(c, v, first) { if (c === 0) return ''; return (c < 0 ? '-' : (first ? '' : '+')) + (Math.abs(c) === 1 && v ? '' : Math.abs(c)) + v; }
  function poly(pairs) { var s = ''; pairs.forEach(function (p) { s += term(p[0], p[1], s === ''); }); return s || '0'; }   // [[3,'x'],[5,'']] → 3x+5（答え用・半角）
  function show(s) { return s.replace(/-/g, '−').replace(/\+/g, '＋'); }     // 問題文用の 全角記号
  function pw(base, e) { return base + ({ 2: '²', 3: '³', 4: '⁴' })[e]; }
  function pi(k) { return k === 1 ? 'π' : k === -1 ? '-π' : k + 'π'; }

  var UNITS = [
    { id: 'seifu', name: '正負の数', keys: ['abs', 'neg_add', 'neg_sub', 'neg_addsub', 'neg_mul', 'neg_div', 'neg_pow', 'neg_mix', 'neg_word'] },
    { id: 'moji', name: '文字と式', keys: ['moji_expr', 'moji_word', 'dainyu', 'dourui', 'moji_addsub', 'moji_mul'] },
    { id: 'houtei', name: '一次方程式', keys: ['eq_basic', 'eq_both', 'eq_paren', 'eq_frac', 'eq_ratio', 'eq_kafusoku', 'eq_hayasa', 'eq_age'] },
    { id: 'hirei', name: '比例と反比例', keys: ['hirei_eq', 'hirei_val', 'hanpirei_eq', 'hanpirei_val'] },
    { id: 'zukei', name: '平面図形・空間図形', keys: ['ougi_arc', 'ougi_area', 'taiseki', 'hyoumenseki', 'kyu'] },
    { id: 'data', name: 'データの活用', keys: ['heikin', 'chuou', 'hanni', 'dosuu'] }
  ];
  var TYPES = {
    abs: { name: '絶対値', unit: 'seifu' }, neg_add: { name: '正負の数の加法', unit: 'seifu' }, neg_sub: { name: '正負の数の減法', unit: 'seifu' }, neg_addsub: { name: '加法と減法の混じった計算', unit: 'seifu' },
    neg_mul: { name: '正負の数の乗法', unit: 'seifu' }, neg_div: { name: '正負の数の除法', unit: 'seifu' }, neg_pow: { name: '累乗', unit: 'seifu' }, neg_mix: { name: '四則の混じった計算', unit: 'seifu' }, neg_word: { name: '正負の数の利用', unit: 'seifu' },
    moji_expr: { name: '文字式の表し方', unit: 'moji' }, moji_word: { name: '数量を文字式で表す', unit: 'moji' }, dainyu: { name: '式の値（代入）', unit: 'moji' }, dourui: { name: '同類項をまとめる', unit: 'moji' }, moji_addsub: { name: '一次式の加法・減法', unit: 'moji' }, moji_mul: { name: '一次式と数の乗法・除法', unit: 'moji' },
    eq_basic: { name: '方程式を解く（基本）', unit: 'houtei' }, eq_both: { name: '方程式を解く（両辺に x）', unit: 'houtei' }, eq_paren: { name: '方程式を解く（かっこ）', unit: 'houtei' }, eq_frac: { name: '方程式を解く（分数）', unit: 'houtei' }, eq_ratio: { name: '比例式', unit: 'houtei' },
    eq_kafusoku: { name: '方程式の利用（過不足）', unit: 'houtei' }, eq_hayasa: { name: '方程式の利用（速さ・追いつく）', unit: 'houtei' }, eq_age: { name: '方程式の利用（年齢）', unit: 'houtei' },
    hirei_eq: { name: '比例の式', unit: 'hirei' }, hirei_val: { name: '比例の値', unit: 'hirei' }, hanpirei_eq: { name: '反比例の式', unit: 'hirei' }, hanpirei_val: { name: '反比例の値', unit: 'hirei' },
    ougi_arc: { name: 'おうぎ形の弧の長さ', unit: 'zukei' }, ougi_area: { name: 'おうぎ形の面積', unit: 'zukei' }, taiseki: { name: '立体の体積', unit: 'zukei' }, hyoumenseki: { name: '立体の表面積', unit: 'zukei' }, kyu: { name: '球の体積・表面積', unit: 'zukei' },
    heikin: { name: '平均値', unit: 'data' }, chuou: { name: '中央値・最頻値', unit: 'data' }, hanni: { name: '範囲', unit: 'data' }, dosuu: { name: '相対度数', unit: 'data' }
  };
  var TYPE_ORDER = []; UNITS.forEach(function (u) { u.keys.forEach(function (k) { TYPE_ORDER.push(k); }); });
  var GEN = {};

  // ---------- 正負の数 ----------
  GEN.abs = function (r) {
    var n = nz(r, -gd(9, 30, 99), gd(9, 30, 99));
    if (r() < 0.3) { var a = nz(r, -gd(9, 20, 50), gd(9, 20, 50)), b = nz(r, -gd(9, 20, 50), gd(9, 20, 50)); return C('絶対値が大きいのはどちらか。大きいほうの数を答えなさい。　' + m(a) + '，' + m(b), ['|' + m(a) + '|=' + Math.abs(a) + '，|' + m(b) + '|=' + Math.abs(b)], I(Math.abs(a) >= Math.abs(b) ? a : b)); }
    return C('次の数の絶対値を答えなさい。　' + m(n), ['|' + m(n) + '|=' + Math.abs(n)], N(Math.abs(n)));
  };
  GEN.neg_add = function (r) {
    var L = gd(9, 25, 60), a = nz(r, -L, L), b = nz(r, -L, L);
    return C(pm(a) + '＋' + pm(b), [m(a) + '+' + m(b) + '=' + m(a + b)], I(a + b));
  };
  GEN.neg_sub = function (r) {
    var L = gd(9, 25, 60), a = nz(r, -L, L), b = nz(r, -L, L);
    return C(pm(a) + '−' + pm(b), [m(a) + '−' + pm(b) + '=' + m(a) + '+' + m(-b), '=' + m(a - b)], I(a - b));
  };
  GEN.neg_addsub = function (r) {
    var L = gd(9, 20, 40), a = nz(r, -L, L), b = nz(r, -L, L), c = nz(r, -L, L), d = gd(0, r() < 0.5 ? nz(r, -L, L) : 0, nz(r, -L, L));
    if (a > 0 && b > 0 && c > 0 && d >= 0) b = -b;   // 負の項を かならず 1つは 入れる
    var t = m(a) + (b < 0 ? '−' + (-b) : '＋' + b) + (c < 0 ? '−' + (-c) : '＋' + c) + (d ? (d < 0 ? '−' + (-d) : '＋' + d) : '');
    var pos = [a, b, c, d].filter(function (x) { return x > 0; }).reduce(function (s, x) { return s + x; }, 0), neg = [a, b, c, d].filter(function (x) { return x < 0; }).reduce(function (s, x) { return s + x; }, 0);
    return C(t, ['正の項 ' + pos + '，負の項 ' + m(neg), pos + (neg ? m(neg) : '') + '=' + m(a + b + c + d)], I(a + b + c + d));
  };
  GEN.neg_mul = function (r) {
    var L = gd(9, 12, 15), a = nz1(r, -L, L), b = nz1(r, -L, L);
    if (r() < gd(0, 0.3, 0.5)) { var c = nz1(r, -5, 5); return C(pm(a) + '×' + pm(b) + '×' + pm(c), ['符号は ' + ((a * b * c) < 0 ? '−（負の数が奇数個）' : '＋（負の数が偶数個）'), Math.abs(a) + '×' + Math.abs(b) + '×' + Math.abs(c) + '=' + Math.abs(a * b * c)], I(a * b * c)); }
    return C(pm(a) + '×' + pm(b), ['符号は ' + ((a * b) < 0 ? '−' : '＋'), Math.abs(a) + '×' + Math.abs(b) + '=' + Math.abs(a * b)], I(a * b));
  };
  GEN.neg_div = function (r) {
    var L = gd(9, 12, 15), a = nz1(r, -L, L), b = nz(r, -L, L);
    return C(pm(a * b) + '÷' + pm(a), ['符号は ' + (b < 0 ? '−' : '＋'), Math.abs(a * b) + '÷' + Math.abs(a) + '=' + Math.abs(b)], I(b));
  };
  GEN.neg_pow = function (r) {
    var b = ri(r, 2, gd(5, 7, 9)), e = ch(r, gd([2, 2, 3], [2, 3, 3], [2, 3, 4])), form = ch(r, gd(['p', 'n'], ['p', 'n', 'bare'], ['p', 'n', 'bare', 'bare']));
    if (form === 'p') { var v = Math.pow(-b, e); return C(pw('(−' + b + ')', e), ['(−' + b + ')を ' + e + '個かける', m(v)], I(v)); }
    if (form === 'n') { var v2 = -Math.pow(b, e); return C(pw('−' + b, e), [b + 'の' + e + '乗に −をつける', m(v2)], I(v2)); }
    var v3 = Math.pow(b, e); return C(pw(String(b), e), [b + 'を ' + e + '個かける', String(v3)], I(v3));
  };
  GEN.neg_mix = function (r) {
    var L = gd(6, 9, 12), a = nz1(r, -L, L), b = nz1(r, -L, L), c = nz(r, -L, L), f = ch(r, gd(['ab+c', 'c-ab', 'p'], ['ab+c', 'c-ab', 'p', 'div', 'sq'], ['ab+c', 'c-ab', 'div', 'sq', 'sq2']));
    if (f === 'ab+c') return C(pm(a) + '×' + pm(b) + '＋' + pm(c), ['乗法を先に ' + m(a * b) + '+' + pm(c), m(a * b + c)], I(a * b + c));
    if (f === 'c-ab') return C(m(c) + '−' + pm(a) + '×' + pm(b), ['乗法を先に ' + m(c) + '−' + pm(a * b), m(c - a * b)], I(c - a * b));
    if (f === 'p') return C('(' + m(a) + (b < 0 ? '−' + (-b) : '＋' + b) + ')×' + pm(c), ['かっこの中を先に ' + m(a + b) + '×' + pm(c), m((a + b) * c)], I((a + b) * c));
    if (f === 'div') return C(pm(a * b) + '÷' + pm(a) + '−' + pm(c), ['除法を先に ' + m(b) + '−' + pm(c), m(b - c)], I(b - c));
    if (f === 'sq') { var s = ri(r, 2, 6); return C(pw('(−' + s + ')', 2) + (c < 0 ? '−' + (-c) : '＋' + c), ['累乗を先に ' + (s * s) + (c < 0 ? '−' + (-c) : '+' + c), m(s * s + c)], I(s * s + c)); }
    var s2 = ri(r, 2, 5), k = nz1(r, -4, 4); return C(pw('−' + s2, 2) + '×' + pm(k) + '＋' + pm(c), ['累乗を先に −' + (s2 * s2) + '×' + pm(k) + '+' + pm(c), m(-s2 * s2 * k + c)], I(-s2 * s2 * k + c));
  };
  GEN.neg_word = function (r) {
    if (r() < 0.5) {
      var a = nz(r, -gd(9, 15, 20), 5), b = a + ri(r, 3, gd(12, 20, 30));
      var v = ch(r, [['朝の気温は ' + m(a) + '℃で、昼の気温は ' + m(b) + '℃だった。昼の気温は朝より何℃高いか。', '℃'], ['ある地点の標高は ' + m(a * 10) + 'm、別の地点は ' + m(b * 10) + 'mである。2地点の標高の差は何mか。', 'm']]);
      var d = v[1] === 'm' ? (b - a) * 10 : b - a;
      return W(v[0], [m(v[1] === 'm' ? b * 10 : b) + '−' + pm(v[1] === 'm' ? a * 10 : a) + '=' + d], N(d, v[1]));
    }
    var base = ch(r, [150, 40, 60, 100]), n = gd(4, 5, 6), diffs = [], sum = 0;
    for (var i = 0; i < n; i++) { var dd = nz(r, -8, 8); diffs.push(dd); sum += dd; }
    sum -= sum % n; diffs[n - 1] -= (diffs.reduce(function (s, x) { return s + x; }, 0) - sum);   // 合計を n で割り切れるように 調整
    var avg = base + sum / n, unit = base === 150 ? 'cm' : base === 40 ? 'kg' : '点';
    var names = ['A', 'B', 'C', 'D', 'E', 'F'].slice(0, n), lines = names.map(function (nm, i2) { return nm + '：' + m(diffs[i2]); }).join('　');
    return W(n + '人の' + (unit === 'cm' ? '身長' : unit === 'kg' ? '体重' : 'テストの得点') + 'を、' + base + unit + 'を基準にして、基準より高い分を正の数、低い分を負の数で表した。' + n + '人の平均は何' + unit + 'か。　' + lines,
      ['基準との差の合計 ' + m(sum), m(sum) + '÷' + n + '=' + m(sum / n), base + pm(sum / n) + '=' + avg], N(avg, unit));
  };

  // ---------- 文字と式 ----------
  var LET = ['a', 'b', 'x', 'y'];
  GEN.moji_expr = function (r) {
    var v = ch(r, LET), w = ch(r, LET.filter(function (l) { return l !== v; })), n = ri(r, 2, 9), f = ch(r, gd(['mul', 'div', 'neg', 'sq'], ['mul', 'div', 'neg', 'sq', 'two', 'pdiv'], ['div', 'neg', 'sq', 'two', 'pdiv', 'sq2']));
    var lead = '次の式を、×や÷を使わないで表しなさい。　';
    if (f === 'mul') return C(lead + v + '×' + n, ['数を前に、×を省く'], X(n + v));
    if (f === 'div') return C(lead + v + '÷' + n, ['÷は分数の形に'], X(v + '/' + n));
    if (f === 'neg') return C(lead + v + '×(−' + n + ')', ['−' + n + 'を前に'], X('-' + n + v));
    if (f === 'sq') return C(lead + v + '×' + v + '×' + w, ['同じ文字の積は累乗'], X(v + '²' + w));
    if (f === 'two') return C(lead + v + '×' + w + '×' + n, ['数を前に、文字はアルファベット順'], X(n + (v < w ? v + w : w + v)));
    if (f === 'pdiv') return C(lead + '(' + v + '＋' + w + ')÷' + n, ['(' + v + '+' + w + ')全体を分子に'], X('(' + v + '+' + w + ')/' + n));
    return C(lead + v + '×' + v + '×' + v + '×' + n, ['累乗を使う'], X(n + v + '³'));
  };
  GEN.moji_word = function (r) {
    var f = ch(r, gd(['pen', 'tri', 'time', 'two', 'ten'], ['pen', 'tri', 'time', 'two', 'ten', 'disc', 'rest'], ['tri', 'time', 'two', 'ten', 'disc', 'rest', 'avg']));
    var lead = '次の数量を文字式で表しなさい。　';
    if (f === 'pen') { var n = ri(r, 2, 9); return W(lead + '1本 a 円の鉛筆を ' + n + '本買ったときの代金（円）', ['a×' + n], X(n + 'a', '', '円')); }
    if (f === 'tri') return W(lead + '底辺 a cm、高さ h cm の三角形の面積（cm²）', ['a×h÷2'], X('ah/2', '', 'cm²'));
    if (f === 'time') { var s = ch(r, [3, 4, 5, 6]); return W(lead + 'x km の道のりを時速 ' + s + 'km で歩いたときにかかる時間（時間）', ['x÷' + s], X('x/' + s, '', '時間')); }
    if (f === 'two') { var p = ri(r, 2, 6), q = ri(r, 2, 6); return W(lead + '1個 a 円のりんご ' + p + '個と、1個 b 円のみかん ' + q + '個を買ったときの代金（円）', ['a×' + p + '+b×' + q], X(p + 'a+' + q + 'b', '', '円')); }
    if (f === 'ten') return W(lead + '十の位の数が a、一の位の数が b の 2けたの整数', ['10×a+b'], X('10a+b'));
    if (f === 'disc') { var d = ch(r, [1, 2, 3]); return W(lead + '定価 x 円の品物を ' + d + '割引きで買ったときの値段（円）', ['x×(1−0.' + d + ')'], X((10 - d) / 10 + 'x', '', '円')); }
    if (f === 'rest') { var k = ri(r, 2, 9), c = ch(r, [100, 200, 500]); return W(lead + c + '円持って、1本 a 円のジュースを ' + k + '本買ったときの残金（円）', [c + '−a×' + k], X(c + '-' + k + 'a', '', '円')); }
    return W(lead + '国語 a 点、数学 b 点、英語 c 点の 3教科の平均点（点）', ['(a+b+c)÷3'], X('(a+b+c)/3', '', '点'));
  };
  GEN.dainyu = function (r) {
    var x = nz(r, -gd(5, 9, 9), gd(5, 9, 9)), a = nz1(r, -gd(5, 9, 9), gd(5, 9, 9)), b = nz(r, -9, 9), f = ch(r, gd(['lin', 'lin'], ['lin', 'sq', 'neg'], ['sq', 'neg', 'two']));
    if (f === 'lin') return C('x＝' + m(x) + ' のとき、次の式の値を求めなさい。　' + show(poly([[a, 'x'], [b, '']])), [m(a) + '×' + pm(x) + '+' + pm(b), m(a * x + b)], I(a * x + b));
    if (f === 'sq') return C('x＝' + m(x) + ' のとき、次の式の値を求めなさい。　' + show(poly([[1, 'x²'], [a, 'x']])), [pm(x) + '²+' + m(a) + '×' + pm(x), m(x * x + a * x)], I(x * x + a * x));
    if (f === 'neg') return C('x＝' + m(x) + ' のとき、次の式の値を求めなさい。　−x²' + (b < 0 ? '−' + (-b) : '＋' + b), ['−' + pm(x) + '²' + (b < 0 ? '−' + (-b) : '+' + b), m(-x * x + b)], I(-x * x + b));
    var y = nz(r, -6, 6); return C('x＝' + m(x) + '，y＝' + m(y) + ' のとき、次の式の値を求めなさい。　' + show(poly([[a, 'x'], [b || 1, 'y']])), [m(a) + '×' + pm(x) + '+' + m(b || 1) + '×' + pm(y), m(a * x + (b || 1) * y)], I(a * x + (b || 1) * y));
  };
  GEN.dourui = function (r) {
    var L = gd(7, 9, 12), a = nz(r, -L, L), b = nz(r, -L, L), c = nz(r, -L, L), d = nz(r, -L, L);
    if (a + c === 0) c = c + 1 || 1; if (b + d === 0) d = d + 1 || 1;
    var v = ch(r, ['x', 'a', 'y']);
    var t = gd(false, r() < 0.5, true) ? show(poly([[a, v], [b, ''], [c, v], [d, '']])) : show(poly([[a, v], [c, v], [b, ''], [d, '']]));
    return C('次の計算をしなさい。　' + t, ['文字の項 ' + show(poly([[a + c, v]])) + '，数の項 ' + m(b + d)], X(poly([[a + c, v], [b + d, '']])));
  };
  GEN.moji_addsub = function (r) {
    var L = gd(7, 9, 12), a = nz(r, -L, L), b = nz(r, -L, L), c = nz(r, -L, L), d = nz(r, -L, L), sub = r() < 0.5;
    var ra = sub ? a - c : a + c, rb = sub ? b - d : b + d;
    if (ra === 0) { c = sub ? c - 1 : c + 1; ra = sub ? a - c : a + c; if (ra === 0) { c += sub ? -1 : 1; ra = sub ? a - c : a + c; } }
    var t = '(' + show(poly([[a, 'x'], [b, '']])) + ')' + (sub ? '−' : '＋') + '(' + show(poly([[c, 'x'], [d, '']])) + ')';
    return C('次の計算をしなさい。　' + t, [sub ? 'かっこをはずすと後ろの符号が変わる ' + show(poly([[a, 'x'], [b, ''], [-c, 'x'], [-d, '']])) : 'かっこをはずす ' + show(poly([[a, 'x'], [b, ''], [c, 'x'], [d, '']])), show(poly([[ra, 'x'], [rb, '']]))], X(poly([[ra, 'x'], [rb, '']])));
  };
  GEN.moji_mul = function (r) {
    var k = nz1(r, -gd(5, 7, 9), gd(5, 7, 9)), a = nz(r, -gd(6, 9, 12), gd(6, 9, 12)), b = nz(r, -9, 9);
    if (r() < 0.5) return C('次の計算をしなさい。　' + m(k) + '(' + show(poly([[a, 'x'], [b, '']])) + ')', ['分配法則 ' + m(k) + '×' + m(a) + 'x' + '+' + m(k) + '×' + pm(b), show(poly([[k * a, 'x'], [k * b, '']]))], X(poly([[k * a, 'x'], [k * b, '']])));
    var d = ch(r, [2, 3, 4, 5]), p = nz(r, -gd(4, 6, 9), gd(4, 6, 9)), q = nz(r, -gd(4, 6, 9), gd(4, 6, 9));
    return C('次の計算をしなさい。　(' + show(poly([[p * d, 'x'], [q * d, '']])) + ')÷' + d, ['各項を ' + d + ' でわる', show(poly([[p, 'x'], [q, '']]))], X(poly([[p, 'x'], [q, '']])));
  };

  // ---------- 一次方程式 ----------
  var SOLVE = '次の方程式を解きなさい。　';
  GEN.eq_basic = function (r) {
    var x = nz(r, -gd(6, 9, 12), gd(6, 9, 12)), a = nz1(r, -gd(5, 7, 9), gd(5, 7, 9)), b = nz(r, -gd(9, 15, 20), gd(9, 15, 20)), c = a * x + b;
    return C(SOLVE + show(poly([[a, 'x'], [b, '']])) + '＝' + m(c), [m(b) + ' を移項 ' + m(a) + 'x=' + m(c) + pm(-b), m(a) + 'x=' + m(c - b), 'x=' + m(x)], I(x, 'x='));
  };
  GEN.eq_both = function (r) {
    var x = nz(r, -gd(6, 9, 12), gd(6, 9, 12)), a = nz1(r, -gd(6, 8, 9), gd(6, 8, 9)), c = nz1(r, -gd(6, 8, 9), gd(6, 8, 9)); if (c === a) c = a + 1 || 1;
    var b = nz(r, -gd(9, 15, 20), gd(9, 15, 20)), d = a * x + b - c * x;
    return C(SOLVE + show(poly([[a, 'x'], [b, '']])) + '＝' + show(poly([[c, 'x'], [d, '']])), ['x の項を左辺、数の項を右辺に ' + show(poly([[a - c, 'x']])) + '=' + m(d - b), 'x=' + m(x)], I(x, 'x='));
  };
  GEN.eq_paren = function (r) {
    var x = nz(r, -gd(6, 9, 12), gd(6, 9, 12)), a = nz1(r, -gd(4, 6, 8), gd(4, 6, 8)), b = nz(r, -9, 9), c = nz1(r, -gd(4, 6, 8), gd(4, 6, 8)); if (c === a) c = a + 1 || 1;
    var d = a * (x - b) - c * x;
    return C(SOLVE + m(a) + '(' + show(poly([[1, 'x'], [-b, '']])) + ')＝' + show(poly([[c, 'x'], [d, '']])), ['かっこをはずす ' + show(poly([[a, 'x'], [-a * b, '']])) + '=' + show(poly([[c, 'x'], [d, '']])), show(poly([[a - c, 'x']])) + '=' + m(d + a * b), 'x=' + m(x)], I(x, 'x='));
  };
  GEN.eq_frac = function (r) {
    var d = ch(r, gd([2, 3, 4], [2, 3, 4, 5, 6], [3, 4, 5, 6, 8])), k = nz(r, -gd(5, 8, 10), gd(5, 8, 10)), x = d * k, b = nz(r, -9, 9);
    if (r() < 0.5) return C(SOLVE + 'x/' + d + (b < 0 ? '−' + (-b) : '＋' + b) + '＝' + m(k + b), ['両辺に ' + d + ' をかける x' + (b * d < 0 ? '−' + (-b * d) : '+' + b * d) + '=' + m((k + b) * d), 'x=' + m(x)], I(x, 'x='));
    return C(SOLVE + '(x' + (b < 0 ? '−' + (-b) : '＋' + b) + ')/' + d + '＝' + m(k), ['両辺に ' + d + ' をかける x' + (b < 0 ? '−' + (-b) : '+' + b) + '=' + m(k * d), 'x=' + m(k * d - b)], I(k * d - b, 'x='));
  };
  GEN.eq_ratio = function (r) {
    var a = ri(r, 2, gd(6, 9, 12)), b = ri(r, 2, gd(6, 9, 12)), k = ri(r, 2, gd(4, 6, 9)); if (b === a) b = a + 1; var x = a * k, c = b * k;
    if (r() < 0.5) return C(SOLVE + 'x：' + c + '＝' + a + '：' + b, ['外項の積＝内項の積 x×' + b + '=' + c + '×' + a, 'x=' + x], I(x, 'x='));
    return C(SOLVE + a + '：' + b + '＝' + x + '：x', ['a×x=b×' + x + ' → ' + a + 'x=' + (b * x), 'x=' + c], I(c, 'x='));
  };
  GEN.eq_kafusoku = function (r) {
    var n = ri(r, 5, gd(12, 20, 30)), a = ri(r, 2, gd(4, 6, 8)), c = a + ri(r, 1, 3), b = ri(r, 1, gd(9, 15, 20)), d = n * (c - a) - b;
    if (d <= 0) { b = 1; d = n * (c - a) - b; }
    var th = ch(r, [['生徒', '鉛筆', '本'], ['子ども', 'あめ', '個'], ['クラスの人', '折り紙', '枚']]);
    return W(th[0] + 'に' + th[1] + 'を配るのに、1人に ' + a + th[2] + 'ずつ配ると ' + b + th[2] + '余り、1人に ' + c + th[2] + 'ずつ配ると ' + d + th[2] + '足りない。' + th[0] + 'の人数を求めなさい。',
      [th[0] + 'を x 人とする ' + a + 'x+' + b + '=' + c + 'x−' + d, (c - a) + 'x=' + (b + d), 'x=' + n], N(n, '人'));
  };
  GEN.eq_hayasa = function (r) {
    var v1 = ch(r, gd([60, 80], [50, 60, 70, 80], [40, 50, 60, 70, 80, 90])), t = ch(r, [4, 5, 6, 8, 10]), gap = ch(r, [5, 6, 8, 10, 12, 15]);
    var v2 = v1 + v1 * gap / t; if (v2 !== Math.round(v2)) { gap = t; v2 = 2 * v1; }
    return W('弟が分速 ' + v1 + 'm で家を出発してから ' + gap + '分後に、兄が分速 ' + v2 + 'm で同じ道を追いかけた。兄が弟に追いつくのは、兄が出発してから何分後か。',
      ['x 分後に追いつくとする ' + v1 + '(x+' + gap + ')=' + v2 + 'x', (v2 - v1) + 'x=' + (v1 * gap), 'x=' + t], N(t, '分後'));
  };
  GEN.eq_age = function (r) {
    var k = ch(r, [2, 3, 4]), t = ri(r, 1, gd(6, 10, 15)), c = ri(r, 4, 12), p = k * (c + t) - t;
    return W('現在、父は ' + p + '歳、子は ' + c + '歳である。父の年齢が子の年齢の ' + k + '倍になるのは、今から何年後か。',
      ['x 年後とする ' + p + '+x=' + k + '(' + c + '+x)', (k - 1) + 'x=' + (p - k * c), 'x=' + t], N(t, '年後'));
  };

  // ---------- 比例と反比例 ----------
  GEN.hirei_eq = function (r) {
    var k = nz1(r, -gd(0, 6, 9), gd(6, 9, 12)), x = nz(r, -gd(0, 5, 8), gd(5, 8, 8));
    return W('y は x に比例し、x＝' + m(x) + ' のとき y＝' + m(k * x) + ' である。y を x の式で表しなさい。', ['y=ax に代入 ' + m(k * x) + '=a×' + pm(x), 'a=' + m(k)], X(k === 1 ? 'x' : k === -1 ? '-x' : k + 'x', 'y='));
  };
  GEN.hirei_val = function (r) {
    var k = nz1(r, -gd(0, 6, 9), gd(6, 9, 12)), x = nz(r, -gd(0, 5, 8), gd(5, 8, 8)), x2 = nz(r, -gd(5, 9, 12), gd(5, 9, 12)); if (x2 === x) x2 = x + 1 || 1;
    return W('y は x に比例し、x＝' + m(x) + ' のとき y＝' + m(k * x) + ' である。x＝' + m(x2) + ' のときの y の値を求めなさい。', ['y=' + m(k) + 'x', 'y=' + m(k) + '×' + pm(x2) + '=' + m(k * x2)], I(k * x2, 'y='));
  };
  GEN.hanpirei_eq = function (r) {
    var a = nz1(r, -gd(0, 6, 9), gd(6, 9, 12)), x = nz1(r, -gd(0, 6, 8), gd(6, 8, 9)), k = a * x;
    return W('y は x に反比例し、x＝' + m(x) + ' のとき y＝' + m(a) + ' である。y を x の式で表しなさい。', ['y=a/x に代入 a=xy=' + m(x) + '×' + pm(a) + '=' + m(k)], X(k + '/x', 'y='));
  };
  GEN.hanpirei_val = function (r) {
    var a = nz1(r, -gd(0, 6, 9), gd(6, 9, 12)), x = nz1(r, -gd(0, 6, 8), gd(6, 8, 9)), k = a * x, divs = [];
    for (var d = -12; d <= 12; d++) if (d && k % d === 0 && d !== x) divs.push(d);
    var x2 = ch(r, divs);
    return W('y は x に反比例し、x＝' + m(x) + ' のとき y＝' + m(a) + ' である。x＝' + m(x2) + ' のときの y の値を求めなさい。', ['y=' + m(k) + '/x', 'y=' + m(k) + '÷' + pm(x2) + '=' + m(k / x2)], I(k / x2, 'y='));
  };

  // ---------- 図形 ----------
  var ANG = [30, 45, 60, 90, 120, 135, 150, 180, 240, 270];
  GEN.ougi_arc = function (r) {
    var ang, rad, len; for (var i = 0; i < 50; i++) { ang = ch(r, ANG); rad = ri(r, 2, gd(9, 12, 18)); len = 2 * rad * ang / 360; if (len === Math.round(len)) break; }
    if (len !== Math.round(len)) { ang = 90; rad = 4; len = 2; }
    return W('半径 ' + rad + 'cm、中心角 ' + ang + '° のおうぎ形の弧の長さを求めなさい。', ['2π×' + rad + '×' + ang + '/360'], X(pi(len), '', 'cm'));
  };
  GEN.ougi_area = function (r) {
    var ang, rad, ar; for (var i = 0; i < 50; i++) { ang = ch(r, ANG); rad = ri(r, 2, gd(9, 12, 18)); ar = rad * rad * ang / 360; if (ar === Math.round(ar)) break; }
    if (ar !== Math.round(ar)) { ang = 90; rad = 4; ar = 4; }
    return W('半径 ' + rad + 'cm、中心角 ' + ang + '° のおうぎ形の面積を求めなさい。', ['π×' + rad + '²×' + ang + '/360'], X(pi(ar), '', 'cm²'));
  };
  GEN.taiseki = function (r) {
    var f = ch(r, gd(['tri', 'cyl', 'box'], ['tri', 'cyl', 'cone', 'pyr'], ['cyl', 'cone', 'pyr', 'tri']));
    var h = ri(r, 3, gd(9, 12, 15));
    if (f === 'box') { var a = ri(r, 2, 9), b = ri(r, 2, 9); return W('縦 ' + a + 'cm、横 ' + b + 'cm、高さ ' + h + 'cm の直方体の体積を求めなさい。', [a + '×' + b + '×' + h], N(a * b * h, 'cm³')); }
    if (f === 'tri') { var a2 = ri(r, 2, 9) * 2, b2 = ri(r, 2, 9); return W('底面が底辺 ' + a2 + 'cm、高さ ' + b2 + 'cm の三角形で、高さが ' + h + 'cm の三角柱の体積を求めなさい。', ['底面積 ' + a2 + '×' + b2 + '÷2=' + (a2 * b2 / 2), (a2 * b2 / 2) + '×' + h], N(a2 * b2 / 2 * h, 'cm³')); }
    if (f === 'cyl') { var rr = ri(r, 2, 8); return W('底面の半径が ' + rr + 'cm、高さが ' + h + 'cm の円柱の体積を求めなさい。', ['π×' + rr + '²×' + h], X(pi(rr * rr * h), '', 'cm³')); }
    if (f === 'cone') { var rc = ri(r, 2, 8), hc = ri(r, 1, 5) * 3; return W('底面の半径が ' + rc + 'cm、高さが ' + hc + 'cm の円錐の体積を求めなさい。', ['1/3×π×' + rc + '²×' + hc], X(pi(rc * rc * hc / 3), '', 'cm³')); }
    var s = ri(r, 2, 9), hp = ri(r, 1, 5) * 3; return W('底面が 1辺 ' + s + 'cm の正方形で、高さが ' + hp + 'cm の正四角錐の体積を求めなさい。', ['1/3×' + s + '×' + s + '×' + hp], N(s * s * hp / 3, 'cm³'));
  };
  GEN.hyoumenseki = function (r) {
    if (r() < gd(0.7, 0.5, 0.4)) { var a = ri(r, 2, 9), b = ri(r, 2, 9), c = ri(r, 2, 9); return W('縦 ' + a + 'cm、横 ' + b + 'cm、高さ ' + c + 'cm の直方体の表面積を求めなさい。', ['(' + a + '×' + b + '+' + b + '×' + c + '+' + a + '×' + c + ')×2'], N(2 * (a * b + b * c + a * c), 'cm²')); }
    var rr = ri(r, 2, 8), h = ri(r, 2, 12); return W('底面の半径が ' + rr + 'cm、高さが ' + h + 'cm の円柱の表面積を求めなさい。', ['底面 π×' + rr + '²×2=' + (2 * rr * rr) + 'π', '側面 2π×' + rr + '×' + h + '=' + (2 * rr * h) + 'π'], X(pi(2 * rr * rr + 2 * rr * h), '', 'cm²'));
  };
  GEN.kyu = function (r) {
    var rr = ri(r, 1, gd(3, 4, 5)) * 3;
    if (r() < 0.5) return W('半径 ' + rr + 'cm の球の体積を求めなさい。', ['4/3×π×' + rr + '³'], X(pi(4 * rr * rr * rr / 3), '', 'cm³'));
    var r2 = ri(r, 2, gd(6, 9, 12)); return W('半径 ' + r2 + 'cm の球の表面積を求めなさい。', ['4×π×' + r2 + '²'], X(pi(4 * r2 * r2), '', 'cm²'));
  };

  // ---------- データの活用 ----------
  function dataSet(r, n, lo, hi) { var a = []; for (var i = 0; i < n; i++) a.push(ri(r, lo, hi)); return a; }
  GEN.heikin = function (r) {
    var n = gd(4, 5, 6), a = dataSet(r, n, 2, gd(10, 20, 40)), sum = a.reduce(function (s, x) { return s + x; }, 0);
    if (gd(true, false, false)) { a[n - 1] += (n - sum % n) % n; sum = a.reduce(function (s, x) { return s + x; }, 0); }
    var th = ch(r, [['小テストの得点', '点'], ['読んだ本の冊数', '冊'], ['通学時間', '分']]);
    return W(n + '人の' + th[0] + 'は次の通りである。平均値を求めなさい。　' + a.join('，') + '（' + th[1] + '）', ['合計 ' + sum, sum + '÷' + n + '=' + (Math.round(sum / n * 100) / 100)], sum % n === 0 ? N(sum / n, th[1]) : D(sum / n, th[1]));
  };
  GEN.chuou = function (r) {
    var n = gd(5, 6, 7), a = dataSet(r, n, 1, gd(10, 15, 20)).sort(function (x, y) { return x - y; });
    if (r() < 0.5) { var med = n % 2 ? a[(n - 1) / 2] : (a[n / 2 - 1] + a[n / 2]) / 2; if (med !== Math.round(med)) a[n / 2] = a[n / 2 - 1], med = a[n / 2 - 1]; var sh = a.slice(); for (var i = sh.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = sh[i]; sh[i] = sh[j]; sh[j] = t; } return W('次のデータの中央値を求めなさい。　' + sh.join('，'), ['小さい順に並べる ' + a.join('，'), '真ん中の値'], N(med)); }
    var v = a[ri(r, 0, n - 1)]; a.push(v); a.push(v); a.sort(function (x, y) { return x - y; }); var cnt = {}; a.forEach(function (x) { cnt[x] = (cnt[x] || 0) + 1; }); var best = v; for (var k in cnt) if (cnt[k] > cnt[best]) best = +k;
    var sh2 = a.slice(); for (var i2 = sh2.length - 1; i2 > 0; i2--) { var j2 = Math.floor(r() * (i2 + 1)), t2 = sh2[i2]; sh2[i2] = sh2[j2]; sh2[j2] = t2; }
    return W('次のデータの最頻値を求めなさい。　' + sh2.join('，'), ['いちばん多く出てくる値'], N(best));
  };
  GEN.hanni = function (r) {
    var n = gd(5, 6, 8), a = dataSet(r, n, 1, gd(20, 40, 60)), mx = Math.max.apply(null, a), mn = Math.min.apply(null, a);
    return W('次のデータの範囲（レンジ）を求めなさい。　' + a.join('，'), ['最大値 ' + mx + '−最小値 ' + mn], N(mx - mn));
  };
  GEN.dosuu = function (r) {
    var tot = ch(r, gd([20, 25, 40, 50], [20, 25, 40, 50, 80], [25, 40, 50, 80, 200])), f = ri(r, 1, tot / 5) * (tot >= 50 ? 2 : 1); if (f >= tot) f = tot / 5;
    var rel = f / tot;
    return W('あるクラス ' + tot + '人の通学時間を調べたところ、20分以上30分未満の階級の度数は ' + f + '人だった。この階級の相対度数を求めなさい。', [f + '÷' + tot + '=' + (Math.round(rel * 1000) / 1000)], D(rel));
  };

  var LESSONS = {
    abs: { title: '絶対値', why: '絶対値は「0からの距離」。符号をとった数になる。−7 も +7 も絶対値は 7。', ex: ['|−7|＝<em>7</em>', '|+3|＝<em>3</em>', '絶対値が大きい負の数ほど、数としては小さい'], ng: '絶対値に <b>−</b> をつけない。' },
    neg_add: { title: '正負の数の加法', why: '同符号なら絶対値をたして共通の符号。異符号なら絶対値の大きいほうから小さいほうをひいて、絶対値の大きいほうの符号。', ex: ['(−7)＋(−3) → 同符号 → <em>−10</em>', '(−7)＋(＋3) → 異符号 → 7−3＝4、符号は − → <em>−4</em>'], ng: '(−7)＋(＋3) を <b>−10</b> としない。符号がちがうときは「ひく」。' },
    neg_sub: { title: '正負の数の減法', why: 'ひく数の符号を変えて、加法になおす。「−(−3)」は「+3」。', ex: ['(−4)−(−9)＝(−4)＋(＋9)＝<em>5</em>', '(2)−(＋6)＝2＋(−6)＝<em>−4</em>'], ng: '<b>(−4)−(−9)＝−13</b> としない。ひく数の符号を必ず変える。' },
    neg_addsub: { title: '加法と減法の混じった計算', why: '正の項と負の項に分けて、それぞれ集めてから計算すると速い。', ex: ['−3＋8−5 → 正の項 8、負の項 −3−5＝−8', '8＋(−8)＝<em>0</em>'], ng: '左から順に計算して符号をまちがえやすい。項に分けて集める。' },
    neg_mul: { title: '正負の数の乗法', why: '先に符号を決める。負の数が偶数個なら ＋、奇数個なら −。そのあと絶対値をかける。', ex: ['(−3)×(−4)＝<em>+12</em>', '(−3)×(+4)＝<em>−12</em>', '(−2)×(−3)×(−1)＝負が3個 → <em>−6</em>'], ng: '負×負を <b>−</b> にしない。' },
    neg_div: { title: '正負の数の除法', why: '乗法と同じく、符号を先に決めてから絶対値をわる。', ex: ['(−12)÷(+3)＝<em>−4</em>', '(−12)÷(−3)＝<em>+4</em>'], ng: '符号を決め忘れて絶対値だけ答えない。' },
    neg_pow: { title: '累乗', why: '(−3)² は (−3)×(−3)＝9。−3² は 3² に − をつけて −9。かっこの有無で意味がちがう。', ex: ['(−3)²＝<em>9</em>', '−3²＝<em>−9</em>', '(−2)³＝(−2)×(−2)×(−2)＝<em>−8</em>'], ng: '<b>−3²＝9</b> としない。かっこがなければ 3² だけ計算して − をつける。' },
    neg_mix: { title: '四則の混じった計算', why: '計算の順序：①累乗・かっこの中 ②乗法・除法 ③加法・減法。', ex: ['(−2)×3＋4 → −6＋4＝<em>−2</em>', '5−(−8)÷(−2) → 5−4＝<em>1</em>', '(−3)²＋2 → 9＋2＝<em>11</em>'], ng: '左から順に計算しない。乗除が先。' },
    neg_word: { title: '正負の数の利用', why: '基準を決めて、多い分を +、少ない分を − で表す。差は「(大きいほう)−(小さいほう)」。平均は「基準＋(差の平均)」。', ex: ['朝 −3℃、昼 5℃ → 5−(−3)＝<em>8℃</em>', '基準 150cm、差の合計が +10 で 5人 → 150＋10÷5＝<em>152cm</em>'], ng: '差を求めるとき、負の数をひくのを忘れて 5−3 としない。' },
    moji_expr: { title: '文字式の表し方', why: '×は省く。数は文字の前。同じ文字の積は累乗。÷は分数の形にする。', ex: ['a×3＝<em>3a</em>', 'x÷5＝<em>x/5</em>', 'a×a×b＝<em>a²b</em>', 'x×(−2)＝<em>−2x</em>'], ng: '<b>a3</b> や <b>3×a</b> と書かない。1×a は 1a ではなく a。' },
    moji_word: { title: '数量を文字式で表す', why: 'ことばの式を先に作ってから文字にする。「代金＝1個の値段×個数」「時間＝道のり÷速さ」。', ex: ['1本 a 円を 5本 → a×5＝<em>5a 円</em>', 'x km を時速 4km → x÷4＝<em>x/4 時間</em>', '2割引き → x×(1−0.2)＝<em>0.8x 円</em>'], ng: '単位を混ぜない（km と m、時間と分）。' },
    dainyu: { title: '式の値（代入）', why: '文字に負の数を入れるときは、かっこをつけて代入する。', ex: ['x＝−3 のとき 2x＋5 → 2×(−3)＋5＝<em>−1</em>', 'x＝−3 のとき x² → (−3)²＝<em>9</em>', 'x＝−3 のとき −x² → −(−3)²＝<em>−9</em>'], ng: '2x に x＝−3 を入れて <b>2−3</b> としない。2×(−3)。' },
    dourui: { title: '同類項をまとめる', why: '文字の項どうし、数の項どうしをそれぞれ計算する。3x と 5 はまとめられない。', ex: ['3x＋5−x＋2 → (3−1)x＋(5＋2)＝<em>2x＋7</em>'], ng: '<b>3x＋5＝8x</b> としない。文字の項と数の項は別。' },
    moji_addsub: { title: '一次式の加法・減法', why: 'かっこをはずしてから同類項をまとめる。「−( )」は中の符号が全部変わる。', ex: ['(2x＋3)＋(4x−1)＝2x＋3＋4x−1＝<em>6x＋2</em>', '(2x＋3)−(4x−1)＝2x＋3−4x＋1＝<em>−2x＋4</em>'], ng: '−(4x−1) を <b>−4x−1</b> としない。後ろの項の符号も変わる。' },
    moji_mul: { title: '一次式と数の乗法・除法', why: '分配法則：数をかっこの中の各項にかける。わり算は各項を数でわる。', ex: ['3(2x−5)＝<em>6x−15</em>', '−2(x＋4)＝<em>−2x−8</em>', '(12x−8)÷4＝<em>3x−2</em>'], ng: '3(2x−5) を <b>6x−5</b> としない。両方の項にかける。' },
    eq_basic: { title: '方程式を解く（基本）', why: '数の項を右辺に移項（符号を変える）してから、x の係数でわる。', ex: ['3x＋4＝19 → 3x＝19−4 → 3x＝15 → <em>x＝5</em>'], ng: '移項したとき符号を変え忘れない。' },
    eq_both: { title: '方程式を解く（両辺に x）', why: 'x の項を左辺に、数の項を右辺に集める。', ex: ['5x−7＝2x＋8 → 5x−2x＝8＋7 → 3x＝15 → <em>x＝5</em>'], ng: '2x を左辺に移すとき <b>+2x</b> のままにしない。' },
    eq_paren: { title: '方程式を解く（かっこ）', why: '先に分配法則でかっこをはずしてから、移項する。', ex: ['3(x−2)＝x＋4 → 3x−6＝x＋4 → 2x＝10 → <em>x＝5</em>'], ng: '3(x−2) を <b>3x−2</b> としない。' },
    eq_frac: { title: '方程式を解く（分数）', why: '両辺に分母の数をかけて分数をなくしてから解く。', ex: ['x/2＋3＝5 → 両辺×2 → x＋6＝10 → <em>x＝4</em>', '(x＋1)/3＝2 → x＋1＝6 → <em>x＝5</em>'], ng: '分母をはらうとき、数の項にかけ忘れない。' },
    eq_ratio: { title: '比例式', why: 'a：b＝c：d なら ad＝bc（外項の積＝内項の積）。', ex: ['x：6＝3：2 → 2x＝18 → <em>x＝9</em>'], ng: '外と内を取りちがえない。' },
    eq_kafusoku: { title: '方程式の利用（過不足）', why: '人数を x として「配る総数」を 2通りの式で表し、＝で結ぶ。余り → +、足りない → −。', ex: ['3本ずつで 5本余り、4本ずつで 7本足りない → 3x＋5＝4x−7 → <em>x＝12（人）</em>'], ng: '「足りない」を <b>+</b> にしない。' },
    eq_hayasa: { title: '方程式の利用（速さ・追いつく）', why: '追いついたとき、2人の進んだ道のりは等しい。道のり＝速さ×時間。先に出たほうの時間は「x＋差」。', ex: ['弟 60m/分が 10分先、兄 160m/分 → 60(x＋10)＝160x → <em>x＝6（分後）</em>'], ng: '先に出た人の時間に、先に出ていた分をたし忘れない。' },
    eq_age: { title: '方程式の利用（年齢）', why: 'x 年後は 2人とも x 歳増える。「父＝子×倍」の式を作る。', ex: ['父 38歳、子 10歳、3倍になるのは → 38＋x＝3(10＋x) → <em>x＝4（年後）</em>'], ng: '子どもの年齢だけ増やして、父の年齢を増やし忘れない。' },
    hirei_eq: { title: '比例の式', why: '比例は y＝ax。1組の x, y を代入して比例定数 a を求める。', ex: ['x＝2 のとき y＝6 → 6＝2a → a＝3 → <em>y＝3x</em>'], ng: 'y＝ax の a を「x÷y」で求めない。a＝y÷x。' },
    hirei_val: { title: '比例の値', why: 'まず式 y＝ax を作り、それに新しい x を代入する。', ex: ['y＝3x で x＝−4 → y＝3×(−4)＝<em>−12</em>'], ng: '式を作らずに勘で答えない。' },
    hanpirei_eq: { title: '反比例の式', why: '反比例は y＝a/x。a＝xy（x と y の積）で求める。', ex: ['x＝3 のとき y＝4 → a＝12 → <em>y＝12/x</em>'], ng: '比例と混同して y＝ax としない。' },
    hanpirei_val: { title: '反比例の値', why: '式 y＝a/x を作ってから x を代入。', ex: ['y＝12/x で x＝−4 → y＝12÷(−4)＝<em>−3</em>'], ng: '負の数でわるときの符号に注意。' },
    ougi_arc: { title: 'おうぎ形の弧の長さ', why: '弧の長さ＝2πr×(中心角/360)。円周の「中心角/360」倍。', ex: ['半径 6cm、中心角 60° → 2π×6×60/360＝<em>2π cm</em>'], ng: '面積の公式 πr² と混同しない。' },
    ougi_area: { title: 'おうぎ形の面積', why: '面積＝πr²×(中心角/360)。円の面積の「中心角/360」倍。', ex: ['半径 6cm、中心角 60° → π×36×1/6＝<em>6π cm²</em>'], ng: '半径を 2乗し忘れない。' },
    taiseki: { title: '立体の体積', why: '柱体＝底面積×高さ。錐体＝底面積×高さ×1/3。円の底面積は πr²。', ex: ['円柱 半径 3、高さ 5 → π×9×5＝<em>45π cm³</em>', '円錐 半径 3、高さ 6 → 1/3×π×9×6＝<em>18π cm³</em>'], ng: '錐体の 1/3 を忘れない。' },
    hyoumenseki: { title: '立体の表面積', why: '表面積＝底面積×2＋側面積。円柱の側面は展開すると長方形で、横の長さは底面の円周 2πr。', ex: ['直方体 2×3×4 → (6＋12＋8)×2＝<em>52 cm²</em>', '円柱 半径 2、高さ 5 → 底面 8π＋側面 20π＝<em>28π cm²</em>'], ng: '底面が 2つあることを忘れない。' },
    kyu: { title: '球の体積・表面積', why: '体積＝4/3 πr³、表面積＝4πr²。「身の上に心配あるので参上（3分の4πr³）」で覚える。', ex: ['半径 3 の体積 → 4/3×π×27＝<em>36π cm³</em>', '半径 3 の表面積 → 4×π×9＝<em>36π cm²</em>'], ng: '体積の r³ と表面積の r² を取りちがえない。' },
    heikin: { title: '平均値', why: '平均値＝合計÷個数。', ex: ['6, 8, 7, 9 → 30÷4＝<em>7.5</em>'], ng: '個数を数えまちがえない。' },
    chuou: { title: '中央値・最頻値', why: '中央値：小さい順に並べた真ん中の値（偶数個なら真ん中 2つの平均）。最頻値：いちばん多く出てくる値。', ex: ['3, 9, 5, 7, 1 → 並べて 1, 3, 5, 7, 9 → 中央値 <em>5</em>', '2, 5, 5, 7, 8 → 最頻値 <em>5</em>'], ng: '並べかえずに真ん中を答えない。' },
    hanni: { title: '範囲（レンジ）', why: '範囲＝最大値−最小値。データの散らばりの大きさ。', ex: ['12, 25, 8, 30 → 30−8＝<em>22</em>'], ng: '最大値だけ答えない。' },
    dosuu: { title: '相対度数', why: '相対度数＝その階級の度数÷度数の合計。小数で答える（合計は 1）。', ex: ['40人中 8人 → 8÷40＝<em>0.2</em>'], ng: '合計÷度数にしない。' }
  };
  var SCHOOL = [
    { term: '1学期', ids: ['seifu', 'moji'] },
    { term: '2学期', ids: ['houtei', 'hirei'] },
    { term: '3学期', ids: ['zukei', 'data'] }
  ];
  var DEFAULT_WEAK = ['neg_sub', 'moji_addsub', 'eq_both'];
  return { name: '数学', label: '中1　数学', types: TYPES, units: UNITS, order: TYPE_ORDER, gen: GEN, lessons: LESSONS, school: SCHOOL, defaultWeak: DEFAULT_WEAK, hints: {} };
});
