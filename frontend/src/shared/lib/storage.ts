import { z } from 'zod'

export const ACCESS_TOKEN_KEY = 'accessToken'

export const getStorageItem = <T>(key: string, schema: z.ZodType<T>, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    return schema.parse(raw)
  } catch {
    return fallback
  }
}

export const setStorageItem = (key: string, value: string | null) => {
  if (value === null) {
    localStorage.removeItem(key)
  } else {
    localStorage.setItem(key, value)
  }
}
