import { Text, StyleSheet } from 'react-native'
import { colors, font } from '../../constants/theme'

export default function AppText({ children, variant = 'body', style, ...props }) {
  return (
    <Text style={[styles[variant], style]} {...props}>
      {children}
    </Text>
  )
}

const styles = StyleSheet.create({
  h1: { fontSize: 32, fontWeight: font.bold, color: colors.textPrimary },
  h2: { fontSize: 24, fontWeight: font.bold, color: colors.textPrimary },
  h3: { fontSize: 18, fontWeight: font.semibold, color: colors.textPrimary },
  body: { fontSize: 15, fontWeight: font.regular, color: colors.textPrimary },
  caption: { fontSize: 13, fontWeight: font.regular, color: colors.textSecondary },
  muted: { fontSize: 12, fontWeight: font.regular, color: colors.textMuted },
  error: { fontSize: 12, fontWeight: font.regular, color: colors.error },
})