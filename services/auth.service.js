import { supabase } from '../lib/supabase'

export const sendOtpEmail = async (email) => {
  const { error } = await supabase.auth.signInWithOtp({ email })
  if (error) throw error
}

export const verifyOtpEmail = async (email, token) => {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email'
  })
  if (error) throw error
  return data
}

export const getCurrentSession = async () => {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}

export const onAuthChange = (callback) => (
  supabase.auth.onAuthStateChange((_event, session) => callback(session))
)

export const ensureUserProfile = async (user) => {
  if (!user?.id) return

  const payload = {
    id: user.id,
    name: user.user_metadata?.name ?? null,
    phone: user.phone ?? null,
  }

  const { error } = await supabase
    .from('users')
    .upsert(payload, { onConflict: 'id' })

  if (error) throw error
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}