// じぶんドリル: 学年と パックの 登録ばしょ。各 packs/<学年>/<教科>.js が PACKS.register(...) で 中身を 足す
window.PACKS = (function () {
  var GRADES = [
    { id: 'e1', name: '小学1年生', short: '小1', tone: 'kana', cute: true, label: '1年' },
    { id: 'e2', name: '小学2年生', short: '小2', tone: 'kana', cute: true, label: '2年' },
    { id: 'e3', name: '小学3年生', short: '小3', tone: 'kana', cute: true, label: '3年' },
    { id: 'e4', name: '小学4年生', short: '小4', tone: 'normal', cute: true, label: '4年' },
    { id: 'e5', name: '小学5年生', short: '小5', tone: 'normal', cute: true, label: '5年' },
    { id: 'e6', name: '小学6年生', short: '小6', tone: 'normal', cute: true, label: '6年' },
    { id: 'j1', name: '中学1年生', short: '中1', tone: 'normal', cute: false, label: '中1' },
    { id: 'j2', name: '中学2年生', short: '中2', tone: 'normal', cute: false, label: '中2' },
    { id: 'j3', name: '中学3年生', short: '中3', tone: 'normal', cute: false, label: '中3' }
  ];
  var reg = {}, built = {};
  return {
    grades: GRADES,
    grade: function (id) { for (var i = 0; i < GRADES.length; i++) if (GRADES[i].id === id) return GRADES[i]; return null; },
    register: function (grade, subject, factory) { reg[grade + '/' + subject] = factory; },
    has: function (grade, subject) { return !!reg[grade + '/' + subject]; },
    get: function (grade, subject, H) {   // 中身は 1回だけ 組み立てる
      var k = grade + '/' + subject; if (!reg[k]) return null;
      return built[k] || (built[k] = reg[k](H));
    },
    list: function (grade) { var out = []; for (var k in reg) if (k.indexOf(grade + '/') === 0) out.push(k.split('/')[1]); return out; }
  };
})();
