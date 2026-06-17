import type { ExecutionContext } from '@nestjs/common'
import { createParamDecorator } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

import type { GqlContext } from '../interfaces/gql-context.interface'

export interface ClientInfo {
  ip?: string
  userAgent?: string
}

export const GetClientInfo = createParamDecorator(
  (_: unknown, context: ExecutionContext): ClientInfo => {
    const ctx = GqlExecutionContext.create(context)
    const { req } = ctx.getContext<GqlContext>()

    const ip = req.ip
    const userAgent = req.headers['user-agent']

    return { ip, userAgent }
  },
)
