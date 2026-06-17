import type { Request, Response } from 'express'
import type { AuthPayload } from '~/common/interfaces/auth-payload.interface'

export interface AuthenticatedRequest extends Request {
  user?: AuthPayload
  refreshToken?: string
}

export interface GqlContext {
  req: AuthenticatedRequest
  res: Response
}
