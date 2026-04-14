import { useState } from 'react'
import { sendOtpEmail, verifyOtpEmail, ensureUserProfile } from '../services/auth.service'
import { useAuthStore } from '../store/authStore'

export const useAuth = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { setUser, setSession } = useAuthStore()

  const sendOtp = async (email, onSuccess) => {
    try {
      setLoading(true)
      setError(null)
      await sendOtpEmail(email)
      onSuccess()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async (email, token) => {
    try {
      setLoading(true)
      setError(null)
      const { user, session } = await verifyOtpEmail(email, token)
      await ensureUserProfile(user)
      setUser(user)
      setSession(session)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return { sendOtp, verifyOtp, loading, error }
}