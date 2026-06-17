import type { ExecutionContext } from '@nestjs/common'
import { createParamDecorator } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

import type { GqlContext } from '~/common/interfaces/gql-context.interface'

export const RefreshToken = createParamDecorator(
  (_: unknown, context: ExecutionContext): string => {
    const ctx = GqlExecutionContext.create(context)
    const { req } = ctx.getContext<GqlContext>()
    return req.refreshToken!
  },
)
