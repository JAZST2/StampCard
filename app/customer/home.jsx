import { View, StyleSheet } from 'react-native'
import AppText from '../../components/atoms/AppText'
import AppButton from '../../components/atoms/AppButton'
import { colors } from '../../constants/theme'
import { signOut } from '../../services/auth.service'
import { useAuthStore } from '../../store/authStore'
import { useState } from 'react'
import SetupCardScreen from '../business/setup-card'

export default function HomeScreen() {
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const [showSetupCard, setShowSetupCard] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    clearAuth()
  }

  if (showSetupCard) {
    return (
      <View style={styles.setupWrapper}>
        <View style={styles.setupTopBar}>
          <AppButton
            label="Back to Home"
            onPress={() => setShowSetupCard(false)}
            variant="ghost"
          />
        </View>
        <SetupCardScreen />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <AppText variant="h2">Welcome!</AppText>
      <AppText variant="caption">You are logged in.</AppText>
      <AppButton
        label="Business: Setup Card"
        onPress={() => setShowSetupCard(true)}
        style={styles.button}
      />
      <AppButton label="Sign Out" onPress={handleSignOut} style={styles.button} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: 16,
    minWidth: 140,
  },
  setupWrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  setupTopBar: {
    paddingTop: 56,
    paddingHorizontal: 12,
  },
})