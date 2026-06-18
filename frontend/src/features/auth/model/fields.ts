import { z } from 'zod'

export interface ValidationMessages {
  invalidEmail: string
  emailTooLong: string
  usernameLength: string
  usernameRegex: string
  passwordMin: string
  passwordMax: string
  passwordLowercase: string
  passwordUppercase: string
  passwordNumber: string
  passwordSpecial: string
  passwordNoSpaces: string
  passwordRequired: string
}

export const createEmailField = (m: ValidationMessages) =>
  z.email(m.invalidEmail).trim().toLowerCase().max(254, m.emailTooLong)

export const createUsernameField = (m: ValidationMessages) =>
  z
    .string()
    .trim()
    .min(4, m.usernameLength)
    .max(25, m.usernameLength)
    .regex(/^[a-zA-Z0-9_]+$/, m.usernameRegex)

export const createPasswordField = (m: ValidationMessages) =>
  z
    .string()
    .min(8, m.passwordMin)
    .max(72, m.passwordMax)
    .refine((v) => /[a-z]/.test(v), m.passwordLowercase)
    .refine((v) => /[A-Z]/.test(v), m.passwordUppercase)
    .refine((v) => /\d/.test(v), m.passwordNumber)
    .refine((v) => /[^A-Za-z0-9\s]/.test(v), m.passwordSpecial)
    .refine((v) => !/\s/.test(v), m.passwordNoSpaces)
