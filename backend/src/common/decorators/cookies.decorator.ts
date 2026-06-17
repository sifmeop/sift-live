import type { ExecutionContext } from '@nestjs/common'
import { createParamDecorator } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

import type { GqlContext } from '../interfaces/gql-context.interface'

export const Cookies = createParamDecorator((data: string, context: ExecutionContext): string => {
  const ctx = GqlExecutionContext.create(context)
  const { req } = ctx.getContext<GqlContext>()
  return req.cookies[data] as string
})
