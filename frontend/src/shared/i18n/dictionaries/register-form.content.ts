import { t, type Dictionary } from 'intlayer'

const registerFormContent = {
  key: 'register-form',
  content: {
    createAccount: t({
      en: 'Create your account',
      uk: 'Створіть акаунт',
      ru: 'Создайте аккаунт',
    }),
    joinCommunity: t({
      en: 'Join the community and start streaming',
      uk: 'Приєднуйтесь до спільноти й починайте транслювати',
      ru: 'Присоединяйтесь к сообществу и начинайте транслировать',
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
    username: t({
      en: 'Username',
      uk: "Ім'я користувача",
      ru: 'Имя пользователя',
    }),
    usernamePlaceholder: t({
      en: 'Pick a username',
      uk: "Виберіть ім'я користувача",
      ru: 'Выберите имя пользователя',
    }),
    password: t({
      en: 'Password',
      uk: 'Пароль',
      ru: 'Пароль',
    }),
    passwordPlaceholder: t({
      en: 'Create a password',
      uk: 'Створіть пароль',
      ru: 'Создайте пароль',
    }),
    createAccountButton: t({
      en: 'Create account',
      uk: 'Створити акаунт',
      ru: 'Создать аккаунт',
    }),
    alreadyHaveAccount: t({
      en: 'Already have an account?',
      uk: 'Вже маєте акаунт?',
      ru: 'Уже есть аккаунт?',
    }),
    signInLink: t({
      en: 'Sign in',
      uk: 'Увійти',
      ru: 'Войти',
    }),
  },
} satisfies Dictionary

export default registerFormContent
