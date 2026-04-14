import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import LoginForm from '../../components/organisms/LoginForm'
import AppText from '../../components/atoms/AppText'
import { colors, spacing } from '../../constants/theme'

export default function LoginScreen() {
  const [step, setStep] = useState('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const { sendOtp, verifyOtp, loading, error } = useAuth()

  const handleSubmit = () => {
    if (step === 'email') {
      sendOtp(email, () => setStep('otp'))
    } else {
      verifyOtp(email, otp)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.top}>
        <AppText variant="h1">StampCard</AppText>
        <AppText variant="caption">Collect rewards from your favorite shops</AppText>
      </View>

      <View style={styles.card}>
        <LoginForm
          step={step}
          email={email}
          otp={otp}
          onEmailChange={setEmail}
          onOtpChange={setOtp}
          onSubmit={handleSubmit}
          onBack={() => setStep('email')}
          loading={loading}
          error={error}
        />
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  top: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    gap: spacing.xs,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.lg,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
})