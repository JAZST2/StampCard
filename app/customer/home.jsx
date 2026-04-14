import { View, StyleSheet } from 'react-native'
import AppText from '../../components/atoms/AppText'
import AppButton from '../../components/atoms/AppButton'
import { colors } from '../../constants/theme'
import { signOut } from '../../services/auth.service'
import { useAuthStore } from '../../store/authStore'

export default function HomeScreen() {
  const clearAuth = useAuthStore((state) => state.clearAuth)

  const handleSignOut = async () => {
    await signOut()
    clearAuth()
  }

  return (
    <View style={styles.container}>
      <AppText variant="h2">Welcome!</AppText>
      <AppText variant="caption">You are logged in.</AppText>
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
})