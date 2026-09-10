// じぶんドリル: サーバの 接続先（公開して よい 値だけ。秘密の 鍵は Supabase の Secrets に 置く）
// supabaseUrl と supabaseAnonKey が 空の あいだは、ログイン・同期・購入は 出ず、端末だけで 動く
window.JIBUN_CONFIG = {
  supabaseUrl: '',
  supabaseAnonKey: '',
  appUrl: 'https://akipaje181.github.io/jibun-drill/',
  trialDays: 3,
  priceMonth: 3980,
  priceYear: 35760
};
