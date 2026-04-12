import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { useAuthStore } from '../store/authStore'

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(customer)" />
      <Stack.Screen name="(business)" />
    </Stack>
  )
}