-- じぶんドリル: 家庭（保護者アカウント）・ドキュメント同期・利用権（Stripe）
-- 1家庭 = auth.users の 1行。子ども・記録・自作問題は docs に JSON で置く（端末優先、最後に書いた方が勝ち）

create table if not exists public.families (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

create table if not exists public.docs (
  user_id uuid not null references auth.users(id) on delete cascade,
  key text not null,                     -- 'profiles' | 'rec.<childId>' | 'content'
  data jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, key)
);

create table if not exists public.entitlements (
  user_id uuid primary key references auth.users(id) on delete cascade,
  status text not null default 'trial',  -- trial | active | past_due | canceled | expired
  plan text,                             -- month | year
  current_period_end timestamptz,        -- ここまで使える（trial なら 無料期間の 終わり）
  stripe_customer_id text,
  stripe_subscription_id text,
  updated_at timestamptz not null default now()
);

-- 新しい 保護者が 登録したら 家庭と 3日間の 無料期間を 作る
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.families (id, email) values (new.id, new.email) on conflict (id) do nothing;
  insert into public.entitlements (user_id, status, current_period_end)
    values (new.id, 'trial', now() + interval '3 days') on conflict (user_id) do nothing;
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 行レベルの 権限: 自分の 家庭の ものだけ
alter table public.families enable row level security;
alter table public.docs enable row level security;
alter table public.entitlements enable row level security;

drop policy if exists "families self" on public.families;
create policy "families self" on public.families for select using (auth.uid() = id);

drop policy if exists "docs self select" on public.docs;
create policy "docs self select" on public.docs for select using (auth.uid() = user_id);
drop policy if exists "docs self insert" on public.docs;
create policy "docs self insert" on public.docs for insert with check (auth.uid() = user_id);
drop policy if exists "docs self update" on public.docs;
create policy "docs self update" on public.docs for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "docs self delete" on public.docs;
create policy "docs self delete" on public.docs for delete using (auth.uid() = user_id);

-- 利用権は 読むだけ（書くのは Stripe の Webhook＝service role）
drop policy if exists "entitlements self select" on public.entitlements;
create policy "entitlements self select" on public.entitlements for select using (auth.uid() = user_id);
