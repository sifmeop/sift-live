import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

import { type AppSocket } from './socket.types'
import { createId } from '@paralleldrive/cuid2'
import { type ExtendedError } from 'socket.io'
import { type AuthPayload } from '~/common/interfaces/auth-payload.interface'
import { type EnvConfig } from '~/config/env.config'

@Injectable()
export class WsAuthMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnvConfig>,
  ) {}

  verify(socket: AppSocket, next: (err?: ExtendedError) => void): void {
    const token = socket.handshake.auth.token as string | undefined

    socket.data.anonymousId = createId()

    if (!token || typeof token !== 'string') {
      socket.data.user = null
      next()
      return
    }

    void this.jwtService
      .verifyAsync<AuthPayload>(token, {
        secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
        issuer: this.configService.getOrThrow<string>('JWT_ACCESS_ISSUER'),
        audience: this.configService.getOrThrow<string>('JWT_ACCESS_AUDIENCE'),
      })
      .then((payload) => {
        socket.data.user = payload
        next()
      })
      .catch(() => {
        next(new Error('Invalid or expired access token'))
      })
  }
}
