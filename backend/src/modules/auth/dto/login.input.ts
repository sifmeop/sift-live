import { Field, InputType } from '@nestjs/graphql'

import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator'
import { ToLower, Trim } from '~/common/decorators/normalize.decorators'

@InputType()
export class LoginInput {
  @Field()
  @Trim()
  @IsEmail()
  @MaxLength(254)
  @ToLower()
  email!: string

  @Field()
  @Trim()
  @IsString()
  @MinLength(1)
  password!: string
}
