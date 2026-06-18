import { z } from 'zod'

import {
  createEmailField,
  createPasswordField,
  createUsernameField,
  type ValidationMessages,
} from './fields'

export const createRegisterSchema = (m: ValidationMessages) =>
  z.object({
    email: createEmailField(m),
    username: createUsernameField(m),
    password: createPasswordField(m),
  })

export type RegisterSchema = z.infer<ReturnType<typeof createRegisterSchema>>
