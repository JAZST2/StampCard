-- Vertical test flow (manual SQL runner, replace request.jwt.claim.sub per actor)

-- 1) As customer, join card
-- select set_config('request.jwt.claim.sub', '22222222-2222-2222-2222-222222222222', true);
insert into public.user_stamp_cards (user_id, stamp_card_id)
values ('22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444')
on conflict (user_id, stamp_card_id) do nothing;

-- 2) As business owner, add stamps 5x
-- select set_config('request.jwt.claim.sub', '11111111-1111-1111-1111-111111111111', true);
select * from public.add_stamp_atomic(
  '33333333-3333-3333-3333-333333333333',
  '22222222-2222-2222-2222-222222222222',
  '44444444-4444-4444-4444-444444444444'
);
select * from public.add_stamp_atomic(
  '33333333-3333-3333-3333-333333333333',
  '22222222-2222-2222-2222-222222222222',
  '44444444-4444-4444-4444-444444444444'
);
select * from public.add_stamp_atomic(
  '33333333-3333-3333-3333-333333333333',
  '22222222-2222-2222-2222-222222222222',
  '44444444-4444-4444-4444-444444444444'
);
select * from public.add_stamp_atomic(
  '33333333-3333-3333-3333-333333333333',
  '22222222-2222-2222-2222-222222222222',
  '44444444-4444-4444-4444-444444444444'
);
select * from public.add_stamp_atomic(
  '33333333-3333-3333-3333-333333333333',
  '22222222-2222-2222-2222-222222222222',
  '44444444-4444-4444-4444-444444444444'
);

-- 3) Validate pending reward created
select id, status, milestone_id
from public.reward_claims
where user_id = '22222222-2222-2222-2222-222222222222'
  and stamp_card_id = '44444444-4444-4444-4444-444444444444'
order by created_at desc
limit 1;

-- 4) Confirm claim as business owner
select * from public.confirm_reward_claim(
  (select id
   from public.reward_claims
   where user_id = '22222222-2222-2222-2222-222222222222'
     and stamp_card_id = '44444444-4444-4444-4444-444444444444'
   order by created_at desc
   limit 1)
);

-- 5) Replay should fail
-- select * from public.confirm_reward_claim('<same-claim-id>');
