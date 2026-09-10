// 生成器の 機械検証: node tools/verify.js [学年=e2] [教科=math] [1段階あたりの回数=400]
// 見るもの: 問題文が空でない／答えの形が正しい／しきの計算が合う／負の答えが出ない／答えが最後のしきと一致／pair の 2つめが 桁あふれしない
var fs = require('fs'), path = require('path');
var grade = process.argv[2] || 'e2', subject = process.argv[3] || 'math', N = +(process.argv[4] || 400);
global.window = global;
require(path.join(__dirname, '..', 'packs', 'index.js'));
require(path.join(__dirname, '..', 'packs', grade, subject + '.js'));
var GD = 0;
function rng(seed) { var t = (seed >>> 0) || 1; return function () { t += 0x6D2B79F5; var x = Math.imul(t ^ (t >>> 15), 1 | t); x ^= x + Math.imul(x ^ (x >>> 7), 61 | x); return ((x ^ (x >>> 14)) >>> 0) / 4294967296; }; }
var H = { lv: function () { return GD; }, gd: function (a, b, c) { return GD >= 2 && c !== undefined ? c : GD >= 1 && b !== undefined ? b : a; },
  ri: function (r, a, b) { return a + Math.floor(r() * (b - a + 1)); }, ch: function (r, arr) { return arr[Math.floor(r() * arr.length)]; },
  step5: function (r, a, b) { return 5 * (Math.ceil(a / 5) + Math.floor(r() * (Math.floor(b / 5) - Math.ceil(a / 5) + 1))); },
  num: function (v, u) { return { k: 'n', v: v, u: u }; }, pair: function (a, b, u1, u2) { return { k: 'pair', a: a, b: b, u1: u1, u2: u2 }; },
  pk: function (opts, pick, v, u, tail) { return { k: 'pick', opts: opts, pick: pick, v: v, u: u, tail: tail || '多い' }; },
  P: function (t, s, ans) { return { t: t, s: s, ans: ans }; }, tm: function (h, m) { return h + '時' + (m ? m + '分' : ''); }, rng: rng, esc: function (t) { return String(t); }, shuffle: function (a) { return a; } };
var pack = PACKS.get(grade, subject, H);
var gens = pack.gen, keys = Object.keys(gens), bad = 0, total = 0;
function evalSide(s) {   // "6+6+3" / "2×3+4" → 数（+ - × のみ）。読めなければ null
  if (!/^[\d+\-×*\s]+$/.test(s)) return null;
  var terms = s.replace(/\s+/g, '').replace(/-/g, '+-').split('+').filter(Boolean), sum = 0;
  terms.forEach(function (t) { var neg = t[0] === '-'; if (neg) t = t.slice(1); var prod = 1; t.split(/[×*]/).forEach(function (f) { prod *= +f; }); sum += neg ? -prod : prod; });
  return sum;
}
function checkShiki(s) {   // "a+b=c" の形だけ 検算
  var m = String(s).match(/^([\d+\-×*\s]+)=(\d+)$/); if (!m) return null;
  var l = evalSide(m[1]); if (l === null) return null; return l === +m[2];
}
var PAIR_MAX = { mm: 9, cm: 99, dL: 9, '分': 59 };
keys.forEach(function (k) {
  for (GD = 0; GD < 3; GD++) {
    var r = rng(1234 + GD * 7);
    for (var i = 0; i < N; i++) {
      total++;
      var p, err = null;
      try { p = gens[k](r); } catch (e) { err = 'throw: ' + e.message; }
      if (!err) {
        if (!p || typeof p.t !== 'string' || !p.t.trim()) err = 'no text';
        else if (!p.ans || !p.ans.k) err = 'no ans';
        else if (p.ans.k === 'n' && (typeof p.ans.v !== 'number' || p.ans.v < 0 || p.ans.v !== Math.round(p.ans.v))) err = 'bad n ' + p.ans.v;
        else if (p.ans.k === 'pair' && (p.ans.a < 0 || p.ans.b < 0 || (PAIR_MAX[p.ans.u2] !== undefined && p.ans.b > PAIR_MAX[p.ans.u2]))) err = 'bad pair ' + p.ans.a + p.ans.u1 + p.ans.b + p.ans.u2;
        else if (p.ans.k === 'pick' && (p.ans.opts.indexOf(p.ans.pick) < 0 || p.ans.v <= 0)) err = 'bad pick';
        else if (/NaN|undefined/.test(p.t + JSON.stringify(p.ans) + (p.s || []).join())) err = 'NaN/undefined in text';
        else if (p.s && p.s.length) {
          for (var j = 0; j < p.s.length; j++) { var c = checkShiki(p.s[j]); if (c === false) { err = 'shiki wrong: ' + p.s[j]; break; } }
          if (!err && p.ans.k === 'n' && k.indexOf('c_box') !== 0) { var last = String(p.s[p.s.length - 1]).match(/=(\d+)$/); if (last && +last[1] !== p.ans.v) err = 'answer != last shiki: ' + p.s[p.s.length - 1] + ' vs ' + p.ans.v; }
        }
      }
      if (err) { bad++; if (bad <= 30) console.log('NG', k, 'Lv' + (GD + 1), err, p ? '| ' + p.t.slice(0, 60) : ''); }
    }
  }
});
console.log((bad ? 'FAIL ' : 'OK ') + grade + '/' + subject + ': ' + keys.length + ' types × 3 levels × ' + N + ' = ' + total + ' problems, ' + bad + ' problems');
process.exit(bad ? 1 : 0);
