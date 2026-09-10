// じぶんドリル: 小2 けいさん 1まい（全60回のコース。四谷大塚リーダードリル風）
PACKS.register('e2', 'calc', function (H) {
  var ri = H.ri, ch = H.ch, num = H.num, pair = H.pair;
  function CP(t, s, ans) { return { t: t, s: s, ans: ans, pad: 'calc' }; }
  var CGEN = {
    c_tashi2: function (r) { var a = ri(r, 13, 89), b = ri(r, 13, 89); return CP(a + ' ＋ ' + b + ' ＝', [a + '+' + b + '=' + (a + b)], num(a + b, '')); },
    c_hiki2: function (r) { var a = ri(r, 31, 99), b = ri(r, 13, a - 8); return CP(a + ' − ' + b + ' ＝', [a + '-' + b + '=' + (a - b)], num(a - b, '')); },
    c_mittsu: function (r) { var a = ri(r, 12, 45), b = ri(r, 8, 35), c = ri(r, 5, 28); return CP(a + ' ＋ ' + b + ' ＋ ' + c + ' ＝', [a + '+' + b + '=' + (a + b), (a + b) + '+' + c + '=' + (a + b + c)], num(a + b + c, '')); },
    c_tashi3: function (r) { var a = ri(r, 105, 880), b = ri(r, 15, 99); return CP(a + ' ＋ ' + b + ' ＝', [a + '+' + b + '=' + (a + b)], num(a + b, '')); },
    c_hiki3: function (r) { var a = ri(r, 120, 999), b = ri(r, 15, 99); return CP(a + ' − ' + b + ' ＝', [a + '-' + b + '=' + (a - b)], num(a - b, '')); },
    c_hissan3: function (r) {
      if (r() < 0.5) { var a = ri(r, 105, 500), b = ri(r, 105, 480); return CP(a + ' ＋ ' + b + ' ＝', [a + '+' + b + '=' + (a + b)], num(a + b, '')); }
      var x = ri(r, 320, 999), y = ri(r, 105, x - 100); return CP(x + ' − ' + y + ' ＝', [x + '-' + y + '=' + (x - y)], num(x - y, ''));
    },
    c_kuku_a: function (r) { var a = ch(r, [2, 3, 4, 5]), b = ri(r, 1, 9); return CP(a + ' × ' + b + ' ＝', [a + '×' + b + '=' + (a * b)], num(a * b, '')); },
    c_kuku_b: function (r) { var a = ch(r, [6, 7, 8, 9, 1]), b = ri(r, 1, 9); return CP(a + ' × ' + b + ' ＝', [a + '×' + b + '=' + (a * b)], num(a * b, '')); },
    c_kuku_mix: function (r) { var a = ri(r, 1, 9), b = ri(r, 1, 9); return CP(a + ' × ' + b + ' ＝', [a + '×' + b + '=' + (a * b)], num(a * b, '')); },
    c_bai: function (r) { var a = ri(r, 2, 9), b = ri(r, 2, 9); return CP(a + 'の ' + b + 'ばい ＝', [a + '×' + b + '=' + (a * b)], num(a * b, '')); },
    c_box_tashi: function (r) { var b = ri(r, 12, 49), v = ri(r, 13, 50); return CP('□ ＋ ' + b + ' ＝ ' + (v + b) + '　□は', [(v + b) + '-' + b + '=' + v], num(v, '')); },
    c_box_hiki: function (r) { var b = ri(r, 8, 40), v = ri(r, 12, 55); return CP('□ − ' + b + ' ＝ ' + v + '　□は', [v + '+' + b + '=' + (v + b)], num(v + b, '')); },
    c_box_kake: function (r) { var n = ri(r, 2, 9), v = ri(r, 2, 9); return CP('□ × ' + n + ' ＝ ' + (n * v) + '　□は', [v + '×' + n + '=' + (n * v)], num(v, '')); },
    c_len: function (r) {
      var c1 = ri(r, 6, 40), m1 = ri(r, 1, 9), c2 = ri(r, 2, 20), m2 = ri(r, 1, 9);
      if (r() < 0.5) { var mm = m1 + m2, C = c1 + c2 + (mm >= 10 ? 1 : 0), M = mm % 10; return CP(c1 + 'cm' + m1 + 'mm ＋ ' + c2 + 'cm' + m2 + 'mm ＝', ['mm ' + m1 + '+' + m2 + '=' + mm, 'cm ' + c1 + '+' + c2 + '=' + (c1 + c2)], pair(C, M, 'cm', 'mm')); }
      var big = Math.max(c1, c2) + 5, sm = Math.min(c1, c2), bm = m1, smm = m2, C2 = big, M2 = bm - smm;
      if (M2 < 0) { C2 -= 1; M2 += 10; }
      C2 -= sm;
      return CP(big + 'cm' + bm + 'mm − ' + sm + 'cm' + smm + 'mm ＝', ['mm ' + bm + '-' + smm, 'cm ' + big + '-' + sm], pair(C2, M2, 'cm', 'mm'));
    },
    c_kasa: function (r) {
      var l1 = ri(r, 1, 6), d1 = ri(r, 1, 9), l2 = ri(r, 1, 4), d2 = ri(r, 1, 9);
      if (r() < 0.5) { var dd = d1 + d2, L = l1 + l2 + (dd >= 10 ? 1 : 0), D = dd % 10; return CP(l1 + 'L' + d1 + 'dL ＋ ' + l2 + 'L' + d2 + 'dL ＝', ['dL ' + d1 + '+' + d2 + '=' + dd, 'L ' + l1 + '+' + l2 + '=' + (l1 + l2)], pair(L, D, 'L', 'dL')); }
      var bl = l1 + l2 + 1, L2 = bl - l2, D2 = d1 - d2;
      if (D2 < 0) { L2 -= 1; D2 += 10; }
      return CP(bl + 'L' + d1 + 'dL − ' + l2 + 'L' + d2 + 'dL ＝', ['dL ' + d1 + '-' + d2, 'L ' + bl + '-' + l2], pair(L2, D2, 'L', 'dL'));
    }
  };
  var COURSE = [
    [8, ['c_tashi2', 'c_hiki2'], '2けたの たしざん・ひきざん（ひっさん）'],
    [14, ['c_mittsu', 'c_tashi2', 'c_hiki2'], '3つの 数の 計算'],
    [20, ['c_tashi3', 'c_hiki3'], '100より 大きい 数の たしひき'],
    [26, ['c_kuku_a'], '九九（2・3・4・5の だん）'],
    [32, ['c_kuku_b'], '九九（6・7・8・9・1の だん）'],
    [38, ['c_kuku_mix', 'c_bai'], '九九 ぜんぶ・○ばい'],
    [44, ['c_hissan3'], '3けたの ひっさん'],
    [50, ['c_box_tashi', 'c_box_hiki', 'c_box_kake'], '□を もとめる（先どり）'],
    [56, ['c_len', 'c_kasa'], '長さ・かさの 計算'],
    [60, ['c_tashi2', 'c_hiki2', 'c_kuku_mix', 'c_box_kake', 'c_tashi3'], 'まとめ']
  ];
  var KAI_MAX = 60;
  return { name: 'けいさん 1まい', gen: CGEN, course: COURSE, kaiMax: KAI_MAX };
});
