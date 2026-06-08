import { Args, Mutation, Resolver } from '@nestjs/graphql'

import { AuthService } from './auth.service'
import { Public } from './decorators/public.decorator'
import { LoginInput } from './dto/login.input'
import { RegisterInput } from './dto/register.input'
import { AuthResponse } from './entities/auth-response.entity'
import { RefreshResponse } from './entities/refresh-response.entity'

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => AuthResponse)
  register(@Args('register') input: RegisterInput): Promise<AuthResponse> {
    return this.authService.register(input)
  }

  @Public()
  @Mutation(() => AuthResponse)
  login(@Args('login') input: LoginInput): Promise<AuthResponse> {
    return this.authService.register(input)
  }

  @Public()
  @Mutation(() => RefreshResponse)
  refresh(@Args('refreshToken') refreshToken: string): Promise<RefreshResponse> {
    return this.authService.refresh(refreshToken)
  }
}
