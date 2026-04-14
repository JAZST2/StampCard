import { TextInput, View, StyleSheet } from 'react-native'
import AppText from './AppText'
import { colors, radius, spacing } from '../../constants/theme'

export default function AppInput({
  value,
  onChangeText,
  placeholder,
  error,
  keyboardType = 'default',
  autoCapitalize = 'none',
  maxLength,
  style,
}) {
  return (
    <View style={style}>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        maxLength={maxLength}
      />
      {error && <AppText variant="error" style={styles.errorText}>{error}</AppText>}
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: 15,
    color: colors.textPrimary,
  },
  inputError: { borderColor: colors.error },
  errorText: { marginTop: spacing.xs },
})