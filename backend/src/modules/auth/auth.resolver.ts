import { UseGuards } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'

import { AuthService } from './auth.service'
import { Public } from './decorators/public.decorator'
import { RefreshToken } from './decorators/refresh-token.decorator'
import { LoginInput } from './dto/login.input'
import { RegisterInput } from './dto/register.input'
import { AuthResponse } from './entities/auth-response.entity'
import { RefreshResponse } from './entities/refresh-response.entity'
import { RefreshTokenGuard } from './guards/refresh-token.guard'
import { Response } from 'express'
import ms, { StringValue } from 'ms'
import { type ClientInfo, GetClientInfo } from '~/common/decorators/client-info.decorator'
import { type GqlContext } from '~/common/interfaces/gql-context.interface'
import { EnvConfig } from '~/config/env.config'

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService<EnvConfig>,
  ) {}

  @Public()
  @Mutation(() => AuthResponse)
  async register(
    @Args('input') input: RegisterInput,
    @Context() ctx: GqlContext,
  ): Promise<AuthResponse> {
    const { user, accessToken, refreshToken } = await this.authService.register(input)

    this.setRefreshCookie(ctx.res, refreshToken)

    return { user, accessToken }
  }

  @Public()
  @Mutation(() => AuthResponse)
  async login(
    @Args('input') input: LoginInput,
    @Context() ctx: GqlContext,
    @GetClientInfo() clientInfo: ClientInfo,
  ): Promise<AuthResponse> {
    const { user, accessToken, refreshToken } = await this.authService.login(input, clientInfo)

    this.setRefreshCookie(ctx.res, refreshToken)

    return { user, accessToken }
  }

  @UseGuards(RefreshTokenGuard)
  @Mutation(() => Boolean)
  async logout(@Context() ctx: GqlContext, @RefreshToken() refreshToken: string): Promise<boolean> {
    await this.authService.logout(refreshToken)

    ctx.res.clearCookie('refreshToken')

    return true
  }

  @UseGuards(RefreshTokenGuard)
  @Mutation(() => RefreshResponse)
  async refresh(
    @Context() ctx: GqlContext,
    @RefreshToken() refreshToken: string,
    @GetClientInfo() clientInfo: ClientInfo,
  ): Promise<RefreshResponse> {
    const { accessToken, refreshToken: newRefreshToken } = await this.authService.refresh(
      refreshToken,
      clientInfo,
    )

    this.setRefreshCookie(ctx.res, newRefreshToken)

    return { accessToken }
  }

  private setRefreshCookie(res: Response, refreshToken: string): void {
    const ttl = this.configService.getOrThrow<string>('JWT_REFRESH_TTL')
    const maxAge = ms(ttl as StringValue)

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge,
    })
  }
}
