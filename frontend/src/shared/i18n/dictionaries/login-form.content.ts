import { t, type Dictionary } from 'intlayer'

const loginFormContent = {
  key: 'login-form',
  content: {
    welcomeBack: t({
      en: 'Welcome back',
      uk: 'З поверненням',
      ru: 'С возвращением',
    }),
    signInToContinue: t({
      en: 'Sign in to continue watching',
      uk: 'Увійдіть, щоб продовжити перегляд',
      ru: 'Войдите, чтобы продолжить просмотр',
    }),
    email: t({
      en: 'Email',
      uk: 'Електронна пошта',
      ru: 'Электронная почта',
    }),
    emailPlaceholder: t({
      en: 'you@example.com',
      uk: 'you@example.com',
      ru: 'you@example.com',
    }),
    password: t({
      en: 'Password',
      uk: 'Пароль',
      ru: 'Пароль',
    }),
    passwordPlaceholder: t({
      en: 'Enter your password',
      uk: 'Введіть пароль',
      ru: 'Введите пароль',
    }),
    signInButton: t({
      en: 'Sign in',
      uk: 'Увійти',
      ru: 'Войти',
    }),
    noAccount: t({
      en: "Don't have an account?",
      uk: 'Немає акаунту?',
      ru: 'Нет аккаунта?',
    }),
    signUpLink: t({
      en: 'Sign up',
      uk: 'Зареєструватися',
      ru: 'Зарегистрироваться',
    }),
  },
} satisfies Dictionary

export default loginFormContent
