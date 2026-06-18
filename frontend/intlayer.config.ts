import { type IntlayerConfig, Locales } from 'intlayer'

const config: IntlayerConfig = {
  internationalization: {
    defaultLocale: Locales.ENGLISH,
    locales: [Locales.ENGLISH, Locales.UKRAINIAN, Locales.RUSSIAN],
  },
  routing: {
    mode: 'no-prefix',
    storage: [{ type: 'localStorage', name: 'language' }],
  },
}

export default config
