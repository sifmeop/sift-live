import { useIntlayer } from 'react-intlayer'

import { createLoginSchema } from './login.schema'

export const useLoginSchema = () => {
  const v = useIntlayer('auth-validation')

  return createLoginSchema({
    invalidEmail: v.invalidEmail.value,
    emailTooLong: v.emailTooLong.value,
    usernameLength: v.usernameLength.value,
    usernameRegex: v.usernameRegex.value,
    passwordMin: v.passwordMin.value,
    passwordMax: v.passwordMax.value,
    passwordLowercase: v.passwordLowercase.value,
    passwordUppercase: v.passwordUppercase.value,
    passwordNumber: v.passwordNumber.value,
    passwordSpecial: v.passwordSpecial.value,
    passwordNoSpaces: v.passwordNoSpaces.value,
    passwordRequired: v.passwordRequired.value,
  })
}
