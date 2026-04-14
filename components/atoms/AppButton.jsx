import { TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native'
import AppText from './AppText'
import { colors, radius, spacing } from '../../constants/theme'

export default function AppButton({
  label,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  style,
}) {
  const isDisabled = disabled || loading

  return (
    <TouchableOpacity
      style={[styles.base, styles[variant], isDisabled && styles.disabled, style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.85}
    >
      {loading
        ? <ActivityIndicator color={variant === 'primary' ? '#fff' : colors.primary} />
        : <AppText style={styles[`${variant}Text`]}>{label}</AppText>
      }
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: { backgroundColor: colors.primary },
  primaryText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  ghost: { backgroundColor: 'transparent' },
  ghostText: { color: colors.primary, fontSize: 15, fontWeight: '500' },
  disabled: { opacity: 0.55 },
})