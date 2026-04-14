-- Minimal seed data (run after creating two auth users)
-- Replace UUID placeholders with real auth.users IDs before running.

-- Example:
-- set local role authenticated;
-- select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000001', true);

insert into public.users (id, name, phone)
values
  ('11111111-1111-1111-1111-111111111111', 'Business Owner', '+639000000001'),
  ('22222222-2222-2222-2222-222222222222', 'Customer One', '+639000000002')
on conflict (id) do nothing;

insert into public.businesses (id, name, owner_id)
values ('33333333-3333-3333-3333-333333333333', 'Demo Cafe', '11111111-1111-1111-1111-111111111111')
on conflict (id) do nothing;

insert into public.stamp_cards (id, business_id, name, total_stamps)
values ('44444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', 'Coffee Card', 10)
on conflict (id) do nothing;

insert into public.stamp_milestones (id, stamp_card_id, stamp_count, reward_description, is_claimable)
values
  ('55555555-5555-5555-5555-555555555551', '44444444-4444-4444-4444-444444444444', 5, 'Free Upsize', true),
  ('55555555-5555-5555-5555-555555555552', '44444444-4444-4444-4444-444444444444', 10, 'Free Drink', true)
on conflict (id) do nothing;
