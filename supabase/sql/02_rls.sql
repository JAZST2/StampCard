-- Enable RLS
alter table public.users enable row level security;
alter table public.businesses enable row level security;
alter table public.stamp_cards enable row level security;
alter table public.stamp_milestones enable row level security;
alter table public.user_stamp_cards enable row level security;
alter table public.transactions enable row level security;
alter table public.reward_claims enable row level security;

-- users
create policy "users_select_self" on public.users
for select to authenticated using (id = auth.uid());

create policy "users_insert_self" on public.users
for insert to authenticated with check (id = auth.uid());

create policy "users_update_self" on public.users
for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- businesses
create policy "businesses_owner_read_write" on public.businesses
for all to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

-- stamp cards + milestones: readable by everyone authenticated, writable by owner
create policy "stamp_cards_read_authenticated" on public.stamp_cards
for select to authenticated using (true);

create policy "stamp_cards_owner_write" on public.stamp_cards
for all to authenticated
using (
  exists (
    select 1 from public.businesses b
    where b.id = business_id and b.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.businesses b
    where b.id = business_id and b.owner_id = auth.uid()
  )
);

create policy "milestones_read_authenticated" on public.stamp_milestones
for select to authenticated using (true);

create policy "milestones_owner_write" on public.stamp_milestones
for all to authenticated
using (
  exists (
    select 1
    from public.stamp_cards sc
    join public.businesses b on b.id = sc.business_id
    where sc.id = stamp_card_id and b.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.stamp_cards sc
    join public.businesses b on b.id = sc.business_id
    where sc.id = stamp_card_id and b.owner_id = auth.uid()
  )
);

-- user stamp cards
create policy "user_stamp_cards_select_own_or_owner_business" on public.user_stamp_cards
for select to authenticated
using (
  user_id = auth.uid()
  or exists (
    select 1
    from public.stamp_cards sc
    join public.businesses b on b.id = sc.business_id
    where sc.id = stamp_card_id and b.owner_id = auth.uid()
  )
);

create policy "user_stamp_cards_insert_self" on public.user_stamp_cards
for insert to authenticated
with check (user_id = auth.uid());

-- update restricted to backend function (service role)

-- transactions
create policy "transactions_select_own_or_owner_business" on public.transactions
for select to authenticated
using (
  user_id = auth.uid()
  or exists (
    select 1 from public.businesses b
    where b.id = business_id and b.owner_id = auth.uid()
  )
);

-- reward claims
create policy "reward_claims_select_own_or_owner_business" on public.reward_claims
for select to authenticated
using (
  user_id = auth.uid()
  or exists (
    select 1 from public.businesses b
    where b.id = business_id and b.owner_id = auth.uid()
  )
);

create policy "reward_claims_insert_self" on public.reward_claims
for insert to authenticated
with check (user_id = auth.uid());
