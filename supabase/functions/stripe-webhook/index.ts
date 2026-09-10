// Stripe からの 通知を 受けて 利用権（entitlements）を 更新する
import { stripe, adminClient } from '../_shared.ts';

function mapStatus(s: string) {
  if (s === 'active' || s === 'trialing') return 'active';
  if (s === 'past_due' || s === 'unpaid') return 'past_due';
  if (s === 'canceled' || s === 'incomplete_expired') return 'canceled';
  return s;
}
async function applySubscription(sub: any) {
  const admin = adminClient();
  const userId = sub.metadata?.user_id ?? (await admin.from('entitlements').select('user_id').eq('stripe_customer_id', sub.customer).maybeSingle()).data?.user_id;
  if (!userId) return;
  await admin.from('entitlements').upsert({
    user_id: userId,
    status: mapStatus(sub.status),
    plan: sub.metadata?.plan ?? (sub.items?.data?.[0]?.price?.recurring?.interval === 'year' ? 'year' : 'month'),
    current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
    stripe_customer_id: typeof sub.customer === 'string' ? sub.customer : sub.customer?.id,
    stripe_subscription_id: sub.id,
    updated_at: new Date().toISOString(),
  });
}

Deno.serve(async (req) => {
  const sig = req.headers.get('stripe-signature') ?? '';
  const body = await req.text();
  let event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, sig, Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? '');
  } catch (e) {
    return new Response('bad signature: ' + String(e?.message ?? e), { status: 400 });
  }
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const s: any = event.data.object;
        if (s.subscription) applySubscription(await stripe.subscriptions.retrieve(s.subscription));
        break;
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await applySubscription(event.data.object);
        break;
      case 'invoice.paid':
      case 'invoice.payment_failed': {
        const inv: any = event.data.object;
        if (inv.subscription) await applySubscription(await stripe.subscriptions.retrieve(inv.subscription));
        break;
      }
    }
  } catch (e) {
    return new Response('handler error: ' + String(e?.message ?? e), { status: 500 });
  }
  return new Response(JSON.stringify({ received: true }), { headers: { 'Content-Type': 'application/json' } });
});
