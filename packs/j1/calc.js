// じぶんドリル: 中1 計算1枚（全60回。正負の数 → 文字式 → 方程式 → まとめ）。生成器は packs/j1/math.js のものを使う
PACKS.register('j1', 'calc', function (H) {
  var G = PACKS.get('j1', 'math', H).gen, CGEN = {};
  ['neg_add', 'neg_sub', 'neg_addsub', 'neg_mul', 'neg_div', 'neg_pow', 'neg_mix', 'dourui', 'moji_addsub', 'moji_mul', 'eq_basic', 'eq_both', 'eq_paren', 'eq_frac', 'dainyu'].forEach(function (k) {
    CGEN['c_' + k] = function (r) { var p = G[k](r); return { t: p.t, s: p.s, ans: p.ans, pad: 'calc' }; };
  });
  var COURSE = [
    [6, ['c_neg_add', 'c_neg_sub'], '正負の数の加法・減法'],
    [12, ['c_neg_addsub', 'c_neg_add', 'c_neg_sub'], '加法と減法の混じった計算'],
    [18, ['c_neg_mul', 'c_neg_div'], '正負の数の乗法・除法'],
    [24, ['c_neg_pow', 'c_neg_mix'], '累乗と四則の混じった計算'],
    [30, ['c_neg_mix', 'c_neg_addsub', 'c_neg_mul'], '正負の数のまとめ'],
    [36, ['c_dourui', 'c_dainyu'], '文字式：同類項・式の値'],
    [42, ['c_moji_addsub', 'c_moji_mul'], '文字式：加減・乗除'],
    [48, ['c_eq_basic', 'c_eq_both'], '方程式：基本・両辺に x'],
    [54, ['c_eq_paren', 'c_eq_frac', 'c_eq_both'], '方程式：かっこ・分数'],
    [60, ['c_neg_mix', 'c_moji_addsub', 'c_moji_mul', 'c_eq_both', 'c_eq_paren'], 'まとめ']
  ];
  return { name: '計算1枚', gen: CGEN, course: COURSE, kaiMax: 60 };
});
