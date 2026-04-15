import { supabase } from '../lib/supabase'

export const createStampCard = async ({ businessId, name, totalStamps }) => {
  const payload = {
    business_id: businessId,
    name: name.trim(),
    total_stamps: totalStamps,
  }

  const { data, error } = await supabase
    .from('stamp_cards')
    .insert(payload)
    .select('*')
    .single()

  if (error) throw error
  return data
}

export const createStampMilestone = async ({
  stampCardId,
  stampCount,
  rewardDescription,
  isClaimable = true,
}) => {
  const payload = {
    stamp_card_id: stampCardId,
    stamp_count: stampCount,
    reward_description: rewardDescription.trim(),
    is_claimable: isClaimable,
  }

  const { data, error } = await supabase
    .from('stamp_milestones')
    .insert(payload)
    .select('*')
    .single()

  if (error) throw error
  return data
}

export const getCardWithMilestones = async (stampCardId) => {
  const { data, error } = await supabase
    .from('stamp_cards')
    .select(`
      id,
      business_id,
      name,
      total_stamps,
      stamp_milestones (
        id,
        stamp_count,
        reward_description,
        is_claimable
      )
    `)
    .eq('id', stampCardId)
    .single()

  if (error) throw error
  return data
}
