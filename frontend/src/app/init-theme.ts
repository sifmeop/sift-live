import { z } from 'zod'

import { getStorageItem } from '~/shared/lib/storage'

const THEME_KEY = 'ui-theme'

const stored = getStorageItem(THEME_KEY, z.enum(['light', 'dark', 'system']), 'system')

let resolved: 'light' | 'dark'
if (stored === 'system') {
  resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
} else {
  resolved = stored
}

document.documentElement.classList.add(resolved)
