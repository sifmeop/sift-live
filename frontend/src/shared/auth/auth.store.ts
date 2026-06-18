import { z } from 'zod'
import { create } from 'zustand'

import { ACCESS_TOKEN_KEY, getStorageItem, setStorageItem } from '~/shared/lib/storage'

export interface AuthUser {
  id: string
  email: string
  username: string
}

export interface AuthState {
  token: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (data: { accessToken: string; user: AuthUser }) => void
  logout: () => void
  setUser: (user: AuthUser) => void
  setToken: (token: string) => void
  setLoading: (loading: boolean) => void
}

const initialToken = getStorageItem(ACCESS_TOKEN_KEY, z.string().nullable(), null)

export const useAuthStore = create<AuthState>((set) => ({
  token: initialToken,
  user: null,
  isAuthenticated: false,
  isLoading: !!initialToken,
  login: ({ accessToken, user }) => {
    setStorageItem(ACCESS_TOKEN_KEY, accessToken)
    set({ token: accessToken, user, isAuthenticated: true, isLoading: false })
  },
  logout: () => {
    setStorageItem(ACCESS_TOKEN_KEY, null)
    set({ token: null, user: null, isAuthenticated: false, isLoading: false })
  },
  setUser: (user) => {
    set({ user, isAuthenticated: true, isLoading: false })
  },
  setToken: (token) => {
    setStorageItem(ACCESS_TOKEN_KEY, token)
    set({ token, isAuthenticated: true })
  },
  setLoading: (loading) => set({ isLoading: loading }),
}))
