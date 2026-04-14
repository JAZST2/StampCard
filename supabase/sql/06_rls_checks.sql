-- RLS verification checklist queries
-- Use Supabase SQL editor and impersonate each user with:
-- select set_config('request.jwt.claim.sub', '<user-uuid>', true);

-- Customer should only see own stamp cards
select * from public.user_stamp_cards;

-- Customer should only see own claims
select * from public.reward_claims;

-- Customer should not update stamp count directly (expect permission error)
update public.user_stamp_cards
set current_stamps = current_stamps + 10
where user_id = auth.uid();

-- Business owner should see claims for own business
select rc.*
from public.reward_claims rc
join public.businesses b on b.id = rc.business_id
where b.owner_id = auth.uid();
