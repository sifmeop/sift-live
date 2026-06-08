import { AuthPayload } from './auth-payload.interface'
import { Request } from 'express'

export interface AuthenticatedRequest extends Request {
  user?: AuthPayload
}

export interface GqlContext {
  req: AuthenticatedRequest
}
