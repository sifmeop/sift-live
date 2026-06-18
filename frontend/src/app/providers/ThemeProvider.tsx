import { createContext, use, useEffect, useState } from 'react'

import { setStorageItem } from '~/shared/lib/storage'

const STORAGE_KEY = 'ui-theme'

type Theme = 'light' | 'dark' | 'system'

interface ThemeProviderState {
  theme: Theme
  isDark: boolean
  setTheme: (theme: Theme) => void
}

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined)

export const ThemeProvider = ({ children }: React.PropsWithChildren) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
    return stored ?? 'system'
  })

  const setTheme = (newTheme: Theme) => {
    setStorageItem(STORAGE_KEY, newTheme)
    setThemeState(newTheme)

    const root = document.documentElement
    root.classList.remove('light', 'dark')

    let resolved: 'light' | 'dark'

    if (newTheme === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    } else {
      resolved = newTheme
    }

    root.classList.add(resolved)
  }

  useEffect(() => {
    if (theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add(mediaQuery.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [theme])

  return (
    // oxlint-disable-next-line react/jsx-no-constructed-context-values
    <ThemeProviderContext value={{ theme, isDark: theme === 'dark', setTheme }}>
      {children}
    </ThemeProviderContext>
  )
}

export const useTheme = () => {
  const context = use(ThemeProviderContext)

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}
