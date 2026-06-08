import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

import { RedisService } from '../redis/redis.service'
import { UserService } from '../user/user.service'
import { LoginInput } from './dto/login.input'
import { RegisterInput } from './dto/register.input'
import { AuthResponse } from './entities/auth-response.entity'
import { RefreshResponse } from './entities/refresh-response.entity'
import { AuthPayload } from './interfaces/auth-payload.interface'
import { verify } from 'argon2'
import { StringValue } from 'ms'

@Injectable()
export class AuthService {
  private readonly REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async register(input: RegisterInput): Promise<AuthResponse> {
    const isExist = await this.userService.findByEmail(input.email)

    if (isExist) {
      throw new BadRequestException('User already exists')
    }

    const newUser = await this.userService.create(input.email, input.password)

    const tokens = await this.signTokens(newUser.id, newUser.email)

    const { password, ...safeUser } = newUser

    return { user: safeUser, ...tokens }
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    const user = await this.userService.findByEmail(input.email)

    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const isValidPassword = await verify(user.password, input.password)

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const { password, ...safeUser } = user

    const tokens = await this.signTokens(user.id, user.email)

    return { user: safeUser, ...tokens }
  }

  async refresh(refreshToken: string): Promise<RefreshResponse> {
    let payload: AuthPayload | null = null

    try {
      payload = await this.jwtService.verifyAsync<AuthPayload>(refreshToken, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      })
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token')
    }

    const savedToken = await this.redisService.get(`user:refresh:${payload.sub}`)

    if (!savedToken || savedToken !== refreshToken) {
      throw new UnauthorizedException('Invalid or expired refresh token')
    }

    return await this.signTokens(payload.sub, payload.email)
  }

  private async signTokens(userId: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
          expiresIn: this.configService.getOrThrow<StringValue>('JWT_ACCESS_TTL'),
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.getOrThrow<StringValue>('JWT_REFRESH_TTL'),
        },
      ),
    ])

    await this.saveRefreshToken(userId, refreshToken)

    return { accessToken, refreshToken }
  }

  private async saveRefreshToken(userId: string, refreshToken: string) {
    await this.redisService.setex(`user:refresh:${userId}`, this.REFRESH_TOKEN_TTL, refreshToken)
  }
}
