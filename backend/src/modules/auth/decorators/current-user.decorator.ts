import type { ExecutionContext } from '@nestjs/common'
import { createParamDecorator } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

import type { AuthPayload } from '../../../common/interfaces/auth-payload.interface'
import type { GqlContext } from '~/common/interfaces/gql-context.interface'

export const CurrentUser = createParamDecorator(
  (data: keyof AuthPayload, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context)
    const { req } = ctx.getContext<GqlContext>()
    return req.user?.[data]
  },
)
