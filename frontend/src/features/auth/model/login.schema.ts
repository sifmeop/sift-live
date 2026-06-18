import { z } from 'zod'

import { createEmailField, type ValidationMessages } from './fields'

export const createLoginSchema = (m: ValidationMessages) =>
  z.object({
    email: createEmailField(m),
    password: z.string().min(1, m.passwordRequired),
  })

export type LoginSchema = z.infer<ReturnType<typeof createLoginSchema>>
