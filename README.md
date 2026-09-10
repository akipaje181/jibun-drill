# じぶんドリル（事業・販売用）

学年（小1〜中3）を えらぶと、その学年の中身に切り替わり、おうちの人が **自分で問題を作れる** 家庭学習ドリル（PWA）。
土台は「すずドリル」v25（`../すずドリル/`。そちらは すず専用として凍結。こちらには影響しない）。

## 使い方（ローカルで見る）
- `.claude/launch.json` の `jibun`（`python3 -m http.server 8766`）で配信して http://localhost:8766 を開く。file:// 直開きは localStorage が使えない。
- 初回は「はじめに」画面で なまえ・学年を登録 → ホーム。

## ファイル
| ファイル | 中身 |
|---|---|
| `index.html` | 本体（画面・手書き・まるつけ・記録・やる気の仕組み・つくる画面）。学年の中身は持たない |
| `packs/index.js` | 学年一覧（`PACKS.grades`：id・名前・ことばの調子 tone・キャラの既定 cute）と登録口 `PACKS.register(学年, 教科, factory)` |
| `packs/e2/math.js` | 小2 さんすう 文章題 34型＋ちょうせん 6型（TYPES/UNITS/GEN/LESSONS/SCHOOL/HINTS）。すずドリルから移したもの |
| `packs/e2/calc.js` | 小2 けいさん1まい（60回コース） |
| `packs/e2/kanji.js` | 小2 配当漢字 160字 |
| `tools/verify.js` | 生成器の機械検証 `node tools/verify.js e2 math 400` |
| `sw.js` | オフライン用キャッシュ。**中身を変えたら VERSION を上げ、パックを足したら CORE に追加** |

## 仕組み
- **パック**: `PACKS.register('j1', 'math', function (H) { ...; return { name, label, types, units, order, gen, lessons, school, defaultWeak, hints }; })`。`H` は本体の生成ヘルパー（`ri ch gd step5 num pair pk P tm lv`）。`H.lv()` が型ごとの難しさ（0/1/2）。
- 本体の `applyPack()` が、プロフィールの学年のパック ＋ 自作データ（`localStorage: jibun.content`）から `TYPES/UNITS/GEN/LESSONS/SCHOOL/CGEN/COURSE/KANJI` を組み立てる。以降の画面（きょうの5問・にがて・記録・印刷・カレンダー）はそれをそのまま使う。
- **プロフィール**（`jibun.profiles`）: `{ list:[{id,name,grade,tone?,cute?}], current }`。記録は子どもごと `jibun.rec.<id>`。学年・ことば・キャラの変更はマイルーム（マイページ）の「せってい」。
- **ことばの調子** `T(key)`: `kana`（小1〜3）／`normal`（小4〜）。主要画面（タイル名・見出し・ボタン・採点メッセージ・手書き枠）を辞書化済み。結果パネル・クエスト・ヘルプなど細部はまだ kana のまま。
- **キャラ（cute）**: 小学生は出す、中学生は出さない が既定。出さないときは 起動時の声かけ・部屋・なかま・いろ・アクセサリー・かざり を隠し、レベル・★・メダル・クエストは残す。
- **答えの種類** `ans.k`: `n`（0以上の整数＋単位）/ `int`（負もOK、「−」ボタン）/ `dec`（小数）/ `frac`（整数＋分子/分母、約分して比較）/ `text`（文字。全半角・大小・空白を無視）/ `pair` / `pick` / `choice` / `self`。
- **テストの結果を入れる**: 写真読み取りは外した（APIキーを端末に置かないため。サーバ経由で後から）。型と○✗を手で入れて、まちがえた型を多めにしたプリント10まいを作る。ページには `grade` を持たせ、他学年では出さない。

## じぶんで つくる（自作データ）
`content.units[]`: `{ id, grade, kind:'tpl'|'card', name, items:[...] }`
- **穴あき（tpl）** item: `{ id, name, text:'りんごが {a}こ…', vars:[{n:'a',min,max,step,list?}], ans:'a+b', unit, kind:'n'|'int'|'dec', cond:'a>b', shiki:'{a}+{b}={a+b}' }`。
  - 式は `evalExpr`（自前パーサ。eval不使用）: `+ - * / % ^ ( )`、`abs floor ceil round min max sqrt`、比較と `&&` `||`。全角記号も可。
  - 生成は `tplGen(item)`: 条件に合う組み合わせを200回まで探し、`n` なら負・小数を捨てる。作成画面で「見本を5問」を出して確かめられる。
  - 1 item = 1型（`u_<unit>_<item>`）。記録・にがて・難しさ判定がそのまま効く。
- **カード（card）** item: `{ id, q, a, opts:[], note, mode:'choice'|'input'|'self' }`。1カテゴリー = 1型（`u_<unit>`）。カードごとの正誤は `_types['card_<id>']` に別で記録し、まちがえたカードほど出やすい（同じ5問内では重複を避ける）。4たくの候補が足りないときは同じカテゴリーの他の答えから補う。
- まとめて入れる（1行1問 `問題, 答え, 候補1｜候補2, かいせつ`。タブ区切りも可）。書き出し／読み込み（JSON、共有シートかクリップボード）。

## 学年を足す・型を足す
1. `packs/<学年>/math.js` を作り `PACKS.register` する（既存の e2 を雛形に）。`index.html` の `<script src>` と `sw.js` の CORE に追加。
2. `node tools/verify.js <学年> math 400` を通す（式の検算・負の答え・答えと最後の式の一致・単位の桁）。
3. `sw.js` の VERSION を上げる。

## まだ無いもの（プランの第2段階以降）
- アカウント・複数端末の同期・課金（Supabase＋Stripe）
- 写真の自動読み取り（サーバ経由の Claude API）
- 小1・小3・中1 の運営側の型ライブラリ、答えの種類 `expr`（文字式）`eq`（方程式の解）`ratio`
- 細部の文言辞書化（結果パネル・クエスト・ヘルプ）
