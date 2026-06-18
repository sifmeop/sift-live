import { t, type Dictionary } from 'intlayer'

const homeContent = {
  key: 'home',
  content: {
    welcome: t({
      en: 'Welcome to',
      uk: 'Ласкаво просимо до',
      ru: 'Добро пожаловать в',
    }),
    brandName: t({
      en: 'Sift Live',
      uk: 'Sift Live',
      ru: 'Sift Live',
    }),
    subtitle: t({
      en: 'Discover, watch, and share live streams. Join the community and start streaming today.',
      uk: 'Відкривайте, дивіться та діліться прямими ефірами. Приєднуйтесь до спільноти й починайте транслювати вже сьогодні.',
      ru: 'Открывайте, смотрите и делитесь прямыми эфирами. Присоединяйтесь к сообществу и начинайте транслировать уже сегодня.',
    }),
    browseStreams: t({
      en: 'Browse Streams',
      uk: 'Переглянути стріми',
      ru: 'Смотреть стримы',
    }),
    goLive: t({
      en: 'Go Live',
      uk: 'Розпочати стрім',
      ru: 'Начать стрим',
    }),
  },
} satisfies Dictionary

export default homeContent
