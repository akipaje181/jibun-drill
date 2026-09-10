#!/bin/bash
# Stripe の Webhook・カスタマーポータルを 作り、Supabase の Secrets に 入れる（秘密の値は 画面に 出さない）
# 使い方: stripe login を 済ませてから  bash tools/stripe_setup.sh [price_month] [price_year]
# STRIPE_SECRET_KEY だけは Stripe の 画面から Supabase の Secrets に 手で 貼る
set -e
cd "$(dirname "$0")/.."
PROJECT=clfmhgnkwanhnbsjpyxc
APP_URL="https://akipaje181.github.io/jibun-drill/"
HOOK_URL="https://${PROJECT}.supabase.co/functions/v1/stripe-webhook"
PRICE_MONTH="${1:-price_1UE1vfHNACYGGNVXDLK8gTZq}"
PRICE_YEAR="${2:-price_1UE1vKHNACYGGNVXIcESJkk0}"

echo "1) Stripe の ログインを 確かめる"
ACCT=$(stripe get /v1/account 2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('id',''))" || true)
if [ -z "$ACCT" ]; then echo "NG: Stripe に ログインして いません。先に  stripe login  を 実行して ください"; exit 1; fi
echo "   → アカウント $ACCT"

echo "2) Webhook を 作る（同じ URL の ものが あれば 作りなおす）"
EXIST=$(stripe webhook_endpoints list 2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); print(' '.join(e['id'] for e in d.get('data',[]) if e.get('url')=='$HOOK_URL'))")
for id in $EXIST; do stripe webhook_endpoints delete "$id" --confirm >/dev/null 2>&1 || true; done
WH=$(stripe webhook_endpoints create --url "$HOOK_URL" --description "jibun-drill" \
  --enabled-events checkout.session.completed --enabled-events customer.subscription.created --enabled-events customer.subscription.updated \
  --enabled-events customer.subscription.deleted --enabled-events invoice.paid --enabled-events invoice.payment_failed 2>/dev/null \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['secret'])")
if [ -z "$WH" ]; then echo "NG: Webhook を 作れませんでした"; exit 1; fi
echo "   → 作りました: $HOOK_URL"

echo "3) カスタマーポータル（解約・カード変更の 画面）を 用意する"
HAS=$(stripe billing_portal configurations list 2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); print(len(d.get('data',[])))")
if [ "$HAS" = "0" ]; then
  stripe billing_portal configurations create \
    -d "business_profile[headline]=じぶんドリル" \
    -d "features[subscription_cancel][enabled]=true" -d "features[subscription_cancel][mode]=at_period_end" \
    -d "features[payment_method_update][enabled]=true" -d "features[invoice_history][enabled]=true" >/dev/null
  echo "   → 作りました"
else echo "   → すでに あります"; fi

echo "4) Supabase の Secrets に 入れる（Webhook の 署名・価格ID・アプリの URL）"
supabase secrets set --project-ref "$PROJECT" STRIPE_WEBHOOK_SECRET="$WH" \
  STRIPE_PRICE_MONTH="$PRICE_MONTH" STRIPE_PRICE_YEAR="$PRICE_YEAR" APP_URL="$APP_URL" >/dev/null
echo "   → 入れました"
echo "SETUP OK。のこりは STRIPE_SECRET_KEY を Supabase の 画面に 貼る だけです"
