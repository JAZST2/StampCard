import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  user: null,
  session: null,
  isBootstrapping: true,
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setBootstrapping: (isBootstrapping) => set({ isBootstrapping }),
  clearAuth: () => set({ user: null, session: null }),
}))