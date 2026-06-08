import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

import { GqlContext } from '../interfaces/auth-context.interface'
import { AuthPayload } from '../interfaces/auth-payload.interface'

export const CurrentUser = createParamDecorator(
  (data: keyof AuthPayload, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context)
    const { req } = ctx.getContext<GqlContext>()
    return data ? req.user![data] : req.user
  },
)
