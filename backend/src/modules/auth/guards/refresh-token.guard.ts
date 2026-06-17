import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

import type { GqlContext } from '~/common/interfaces/gql-context.interface'

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context)
    const { req } = ctx.getContext<GqlContext>()

    const refreshToken = req.cookies['refreshToken'] as string

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing')
    }

    req.refreshToken = refreshToken

    return true
  }
}
