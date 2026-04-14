-- Atomic business action: add one stamp and auto-create pending reward
create or replace function public.add_stamp_atomic(
  p_business_id uuid,
  p_user_id uuid,
  p_stamp_card_id uuid
)
returns table (
  user_stamp_card_id uuid,
  current_stamps int,
  pending_reward_claim_id uuid
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_owner_id uuid;
  v_milestone_id uuid;
  v_claim_id uuid;
begin
  select owner_id into v_owner_id
  from public.businesses
  where id = p_business_id;

  if v_owner_id is null then
    raise exception 'Business not found';
  end if;

  if v_owner_id <> auth.uid() then
    raise exception 'Not authorized to add stamp';
  end if;

  insert into public.user_stamp_cards (user_id, stamp_card_id, current_stamps)
  values (p_user_id, p_stamp_card_id, 0)
  on conflict (user_id, stamp_card_id) do nothing;

  update public.user_stamp_cards usc
  set current_stamps = current_stamps + 1
  where usc.user_id = p_user_id and usc.stamp_card_id = p_stamp_card_id
  returning usc.id, usc.current_stamps into user_stamp_card_id, current_stamps;

  insert into public.transactions (user_id, stamp_card_id, business_id, type, points)
  values (p_user_id, p_stamp_card_id, p_business_id, 'earn', 1);

  select sm.id into v_milestone_id
  from public.stamp_milestones sm
  where sm.stamp_card_id = p_stamp_card_id
    and sm.stamp_count = current_stamps
    and sm.is_claimable = true
  limit 1;

  if v_milestone_id is not null then
    insert into public.reward_claims (
      user_id, business_id, stamp_card_id, milestone_id, status
    ) values (
      p_user_id, p_business_id, p_stamp_card_id, v_milestone_id, 'pending'
    )
    returning id into v_claim_id;
  end if;

  pending_reward_claim_id := v_claim_id;
  return next;
end;
$$;

grant execute on function public.add_stamp_atomic(uuid, uuid, uuid) to authenticated;

-- Atomic business action: confirm one pending reward claim
create or replace function public.confirm_reward_claim(
  p_reward_claim_id uuid
)
returns table (
  reward_claim_id uuid,
  status public.claim_status,
  claimed_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_claim public.reward_claims%rowtype;
  v_owner_id uuid;
begin
  select * into v_claim
  from public.reward_claims
  where id = p_reward_claim_id;

  if v_claim.id is null then
    raise exception 'Reward claim not found';
  end if;

  select owner_id into v_owner_id
  from public.businesses
  where id = v_claim.business_id;

  if v_owner_id <> auth.uid() then
    raise exception 'Not authorized to confirm claim';
  end if;

  if v_claim.status <> 'pending' then
    raise exception 'Claim is no longer pending';
  end if;

  update public.reward_claims rc
  set status = 'claimed', claimed_at = now()
  where rc.id = p_reward_claim_id
  returning rc.id, rc.status, rc.claimed_at
  into reward_claim_id, status, claimed_at;

  update public.user_stamp_cards usc
  set last_reward_claimed_at = now()
  where usc.user_id = v_claim.user_id
    and usc.stamp_card_id = v_claim.stamp_card_id;

  insert into public.transactions (user_id, stamp_card_id, business_id, type, points)
  values (v_claim.user_id, v_claim.stamp_card_id, v_claim.business_id, 'redeem', 1);

  return next;
end;
$$;

grant execute on function public.confirm_reward_claim(uuid) to authenticated;
