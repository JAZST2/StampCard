import { View, StyleSheet } from 'react-native'
import AppText from '../atoms/AppText'
import AppInput from '../atoms/AppInput'
import AppButton from '../atoms/AppButton'
import { spacing } from '../../constants/theme'

export default function LoginForm({
  step,
  email,
  otp,
  onEmailChange,
  onOtpChange,
  onSubmit,
  onBack,
  loading,
  error,
}) {
  const isEmailStep = step === 'email'

  return (
    <View style={styles.container}>
      <AppText variant="h3" style={styles.heading}>
        {isEmailStep ? 'Enter your email' : 'Check your email'}
      </AppText>
      <AppText variant="caption" style={styles.sub}>
        {isEmailStep
          ? 'We will send you a one-time code'
          : 'Enter the 6-digit code we sent you'}
      </AppText>

      {isEmailStep ? (
        <AppInput
          value={email}
          onChangeText={onEmailChange}
          placeholder="your@email.com"
          keyboardType="email-address"
          error={error}
          style={styles.input}
        />
      ) : (
        <AppInput
          value={otp}
          onChangeText={onOtpChange}
          placeholder="000000"
          keyboardType="number-pad"
          maxLength={6}
          error={error}
          style={styles.input}
        />
      )}

      <AppButton
        label={isEmailStep ? 'Send Code' : 'Verify'}
        onPress={onSubmit}
        loading={loading}
        style={styles.button}
      />

      {!isEmailStep && (
        <AppButton
          label="← Back"
          onPress={onBack}
          variant="ghost"
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  heading: { marginBottom: spacing.xs },
  sub: { marginBottom: spacing.lg },
  input: { marginBottom: spacing.md },
  button: { marginBottom: spacing.sm },
})