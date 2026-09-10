// じぶんドリル: サーバの 接続先（公開して よい 値だけ。秘密の 鍵は Supabase の Secrets に 置く）
// supabaseUrl と supabaseAnonKey が 空の あいだは、ログイン・同期・購入は 出ず、端末だけで 動く
window.JIBUN_CONFIG = {
  supabaseUrl: 'https://clfmhgnkwanhnbsjpyxc.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsZm1oZ25rd2FuaG5ic2pweXhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwMjIxMzksImV4cCI6MjEwNDU5ODEzOX0.diCaXE1rXJ-w246bDRgVVzK4PrjMw8MTKvtt3p4oQQA',
  appUrl: 'https://akipaje181.github.io/jibun-drill/',
  trialDays: 3,
  priceMonth: 3980,
  priceYear: 35760
};
