import { t, type Dictionary } from 'intlayer'

const sharedUiContent = {
  key: 'shared-ui',
  content: {
    close: t({
      en: 'Close',
      uk: 'Закрити',
      ru: 'Закрыть',
    }),
  },
} satisfies Dictionary

export default sharedUiContent
