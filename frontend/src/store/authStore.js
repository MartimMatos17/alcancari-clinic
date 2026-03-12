import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../lib/api'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      login: async (email, password) => {
        const res = await api.post('/auth/login', { email, password })
        set({ user: res.data.user, token: res.data.token })
        api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`
        return res.data.user
      },

      logout: () => {
        set({ user: null, token: null })
        delete api.defaults.headers.common['Authorization']
      },

      init: () => {
        const token = get().token
        if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      },
    }),
    { name: 'alcancari-auth', partialize: s => ({ token: s.token, user: s.user }) }
  )
)
