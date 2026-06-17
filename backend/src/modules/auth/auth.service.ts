import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

import { RedisService } from '../redis/redis.service'
import { UserService } from '../user/user.service'
import { LoginInput } from './dto/login.input'
import { RegisterInput } from './dto/register.input'
import { verify } from 'argon2'
import ms, { StringValue } from 'ms'
import { createHash, randomBytes, randomUUID } from 'node:crypto'
import { ClientInfo } from '~/common/decorators/client-info.decorator'
import { EnvConfig } from '~/config/env.config'
import { PrismaService } from '~/prisma/prisma.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService<EnvConfig>,
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async register(input: RegisterInput) {
    const isExist = await this.userService.findByEmail(input.email)

    if (isExist) {
      throw new BadRequestException('User already exists')
    }

    const newUser = await this.userService.create(input.email, input.password, input.username)

    const { password: _, ...safeUser } = newUser

    const tokens = await this.signTokens(newUser.id, newUser.email, {})

    return { user: safeUser, ...tokens }
  }

  async login(input: LoginInput, clientInfo: ClientInfo) {
    const user = await this.userService.findByEmail(input.email)

    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const isValidPassword = await verify(user.password, input.password)

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const { password: _, ...safeUser } = user
    const tokens = await this.signTokens(user.id, user.email, clientInfo)

    return { user: safeUser, ...tokens }
  }

  async logout(refreshToken: string): Promise<boolean> {
    const tokenHash = createHash('sha256').update(refreshToken).digest('hex')
    await this.prismaService.session.updateMany({
      where: { refreshTokenHash: tokenHash },
      data: { revokedAt: new Date() },
    })
    return true
  }

  async refresh(refreshToken: string, clientInfo: ClientInfo) {
    const tokenHash = createHash('sha256').update(refreshToken).digest('hex')

    const session = await this.prismaService.session.findUnique({
      where: { refreshTokenHash: tokenHash },
      include: { user: { select: { email: true } } },
    })

    if (!session || session.revokedAt || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token')
    }

    await this.prismaService.session.update({
      where: { id: session.id },
      data: { revokedAt: new Date() },
    })

    return this.signTokens(session.userId, session.user.email, clientInfo)
  }

  private async signTokens(
    userId: string,
    email: string,
    context: { userAgent?: string; ip?: string },
  ) {
    const jti = randomUUID()
    const refreshToken = randomBytes(32).toString('hex')
    const refreshTokenHash = createHash('sha256').update(refreshToken).digest('hex')
    const refreshTtl = this.configService.getOrThrow<string>('JWT_REFRESH_TTL')
    const expiresAt = new Date(Date.now() + ms(refreshTtl as StringValue))

    const [accessToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email, jti },
        {
          secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
          expiresIn: this.configService.getOrThrow<StringValue>('JWT_ACCESS_TTL'),
          issuer: this.configService.getOrThrow<string>('JWT_ACCESS_ISSUER'),
          audience: this.configService.getOrThrow<string>('JWT_ACCESS_AUDIENCE'),
        },
      ),
      this.prismaService.session.create({
        data: {
          userId,
          refreshTokenHash,
          userAgent: context.userAgent,
          ip: context.ip,
          expiresAt,
        },
      }),
    ])

    return { accessToken, refreshToken }
  }
}
