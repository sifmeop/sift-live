import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'
import { JwtService } from '@nestjs/jwt'

import { AuthPayload } from '../../../common/interfaces/auth-payload.interface'
import { IS_PUBLIC_KEY } from '../decorators/public.decorator'
import { type Request } from 'express'
import { GqlContext } from '~/common/interfaces/gql-context.interface'
import { EnvConfig } from '~/config/env.config'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService<EnvConfig>,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      return true
    }

    const ctx = GqlExecutionContext.create(context)
    const { req } = ctx.getContext<GqlContext>()

    const token = this.extractTokenFromHeader(req)

    if (!token) {
      throw new UnauthorizedException('Access token is missing')
    }

    try {
      const payload: AuthPayload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
        issuer: this.configService.getOrThrow<string>('JWT_ACCESS_ISSUER'),
        audience: this.configService.getOrThrow<string>('JWT_ACCESS_AUDIENCE'),
      })

      req.user = payload
    } catch {
      throw new UnauthorizedException('Invalid or expired access token')
    }

    return true
  }

  private extractTokenFromHeader(req: Request): string | null {
    const [type, token] = req.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : null
  }
}
