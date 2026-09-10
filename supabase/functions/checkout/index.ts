// 購入ページ（Stripe Checkout）を 作る。登録から 3日以内なら 1か月無料（trial 30日）
import { cors, json, stripe, userClient, adminClient, appUrl } from '../_shared.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const { plan } = await req.json().catch(() => ({ plan: 'month' }));
    const price = plan === 'year' ? Deno.env.get('STRIPE_PRICE_YEAR') : Deno.env.get('STRIPE_PRICE_MONTH');
    if (!price) return json({ error: 'price not configured' }, 500);

    const sb = userClient(req);
    const { data: { user }, error } = await sb.auth.getUser();
    if (error || !user) return json({ error: 'not signed in' }, 401);

    const admin = adminClient();
    const { data: fam } = await admin.from('families').select('created_at').eq('id', user.id).maybeSingle();
    const { data: ent } = await admin.from('entitlements').select('stripe_customer_id,status').eq('user_id', user.id).maybeSingle();
    const createdAt = fam?.created_at ? new Date(fam.created_at).getTime() : Date.now();
    const withinTrial = Date.now() - createdAt <= 3 * 24 * 3600 * 1000;   // 3日以内の 購入 → 1か月 無料

    let customer = ent?.stripe_customer_id ?? undefined;
    if (!customer) {
      const c = await stripe.customers.create({ email: user.email ?? undefined, metadata: { user_id: user.id } });
      customer = c.id;
      await admin.from('entitlements').upsert({ user_id: user.id, stripe_customer_id: customer, updated_at: new Date().toISOString() });
    }
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer,
      line_items: [{ price, quantity: 1 }],
      subscription_data: withinTrial ? { trial_period_days: 30, metadata: { user_id: user.id, plan } } : { metadata: { user_id: user.id, plan } },
      client_reference_id: user.id,
      metadata: { user_id: user.id, plan },
      success_url: appUrl() + '?paid=1',
      cancel_url: appUrl() + '?paid=0',
      locale: 'ja',
      allow_promotion_codes: true,
    });
    return json({ url: session.url, free_month: withinTrial });
  } catch (e) {
    return json({ error: String(e?.message ?? e) }, 500);
  }
});
