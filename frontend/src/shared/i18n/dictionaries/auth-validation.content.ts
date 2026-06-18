import { t, type Dictionary } from 'intlayer'

const authValidationContent = {
  key: 'auth-validation',
  content: {
    invalidEmail: t({
      en: 'Invalid email address',
      uk: 'Невірна електронна адреса',
      ru: 'Недействительный email-адрес',
    }),
    emailTooLong: t({
      en: 'Email is too long',
      uk: 'Електронна адреса занадто довга',
      ru: 'Email-адрес слишком длинный',
    }),
    usernameLength: t({
      en: 'Username must be 4-25 characters',
      uk: "Ім'я користувача має бути 4-25 символів",
      ru: 'Имя пользователя должно быть 4-25 символов',
    }),
    usernameRegex: t({
      en: 'Only letters, numbers and underscore',
      uk: 'Тільки літери, цифри та підкреслення',
      ru: 'Только буквы, цифры и подчёркивание',
    }),
    passwordMin: t({
      en: 'Password must be at least 8 characters',
      uk: 'Пароль має бути не менше 8 символів',
      ru: 'Пароль должен быть не менее 8 символов',
    }),
    passwordMax: t({
      en: 'Password is too long',
      uk: 'Пароль занадто довгий',
      ru: 'Пароль слишком длинный',
    }),
    passwordLowercase: t({
      en: 'Must contain a lowercase letter',
      uk: 'Має містити малу літеру',
      ru: 'Должен содержать строчную букву',
    }),
    passwordUppercase: t({
      en: 'Must contain an uppercase letter',
      uk: 'Має містити велику літеру',
      ru: 'Должен содержать заглавную букву',
    }),
    passwordNumber: t({
      en: 'Must contain a number',
      uk: 'Має містити цифру',
      ru: 'Должен содержать цифру',
    }),
    passwordSpecial: t({
      en: 'Must contain a special character',
      uk: 'Має містити спеціальний символ',
      ru: 'Должен содержать специальный символ',
    }),
    passwordNoSpaces: t({
      en: 'Must not contain spaces',
      uk: 'Не має містити пробіли',
      ru: 'Не должен содержать пробелы',
    }),
    passwordRequired: t({
      en: 'Password is required',
      uk: 'Пароль обовʼязковий',
      ru: 'Пароль обязателен',
    }),
  },
} satisfies Dictionary

export default authValidationContent
