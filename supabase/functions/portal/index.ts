// お支払いの 管理（解約・カード変更）= Stripe カスタマーポータル
import { cors, json, stripe, userClient, adminClient, appUrl } from '../_shared.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const sb = userClient(req);
    const { data: { user }, error } = await sb.auth.getUser();
    if (error || !user) return json({ error: 'not signed in' }, 401);
    const { data: ent } = await adminClient().from('entitlements').select('stripe_customer_id').eq('user_id', user.id).maybeSingle();
    if (!ent?.stripe_customer_id) return json({ error: 'no customer' }, 400);
    const session = await stripe.billingPortal.sessions.create({ customer: ent.stripe_customer_id, return_url: appUrl(), locale: 'ja' });
    return json({ url: session.url });
  } catch (e) {
    return json({ error: String(e?.message ?? e) }, 500);
  }
});
