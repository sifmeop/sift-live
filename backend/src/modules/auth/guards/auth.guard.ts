import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'
import { JwtService } from '@nestjs/jwt'

import { IS_PUBLIC_KEY } from '../decorators/public.decorator'
import { GqlContext } from '../interfaces/auth-context.interface'
import { AuthPayload } from '../interfaces/auth-payload.interface'
import { type Request } from 'express'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
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
      throw new UnauthorizedException('Access token space missing')
    }

    try {
      const payload: AuthPayload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
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
