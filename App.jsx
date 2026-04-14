import LoginScreen from './app/auth/login'
import HomeScreen from './app/customer/home'
import { useAuthStore } from './store/authStore'
import { getCurrentSession, onAuthChange } from './services/auth.service'
import { useEffect } from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { colors } from './constants/theme'

export default function App() {
  const session = useAuthStore((state) => state.session)
  const setUser = useAuthStore((state) => state.setUser)
  const setSession = useAuthStore((state) => state.setSession)
  const isBootstrapping = useAuthStore((state) => state.isBootstrapping)
  const setBootstrapping = useAuthStore((state) => state.setBootstrapping)

  useEffect(() => {
    let mounted = true

    const bootstrap = async () => {
      try {
        const currentSession = await getCurrentSession()
        if (!mounted) return
        setSession(currentSession)
        setUser(currentSession?.user ?? null)
      } finally {
        if (mounted) setBootstrapping(false)
      }
    }

    bootstrap()

    const { data: subscription } = onAuthChange((nextSession) => {
      setSession(nextSession)
      setUser(nextSession?.user ?? null)
    })

    return () => {
      mounted = false
      subscription?.subscription?.unsubscribe?.()
    }
  }, [setBootstrapping, setSession, setUser])

  if (isBootstrapping) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  return session ? <HomeScreen /> : <LoginScreen />
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
})