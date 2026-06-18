import { t, type Dictionary } from 'intlayer'

const headerContent = {
  key: 'header',
  content: {
    signInDialogTitle: t({
      en: 'Sign in',
      uk: 'Увійти',
      ru: 'Войти',
    }),
    createAccountDialogTitle: t({
      en: 'Create account',
      uk: 'Створити акаунт',
      ru: 'Создать аккаунт',
    }),
    languageLabel: t({
      en: 'Language',
      uk: 'Мова',
      ru: 'Язык',
    }),
    themeLabel: t({
      en: 'Theme',
      uk: 'Тема',
      ru: 'Тема',
    }),
    darkMode: t({
      en: 'Dark mode',
      uk: 'Темна тема',
      ru: 'Тёмная тема',
    }),
    signOut: t({
      en: 'Sign out',
      uk: 'Вийти',
      ru: 'Выйти',
    }),
    signIn: t({
      en: 'Sign in',
      uk: 'Увійти',
      ru: 'Войти',
    }),
  },
} satisfies Dictionary

export default headerContent
