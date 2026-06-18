import { Field, InputType } from '@nestjs/graphql'

import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator'
import { ToLower, Trim } from '~/common/decorators/normalize.decorators'

@InputType()
export class RegisterInput {
  @Field()
  @Trim()
  @IsEmail()
  @MaxLength(254)
  @ToLower()
  email!: string

  @Field()
  @Trim()
  @IsString()
  @MinLength(4)
  @MaxLength(25)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers and underscore',
  })
  username!: string

  @Field()
  @Trim()
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  @Matches(/[a-z]/, { message: 'Password must contain a lowercase letter' })
  @Matches(/[A-Z]/, { message: 'Password must contain an uppercase letter' })
  @Matches(/\d/, { message: 'Password must contain a number' })
  @Matches(/[^A-Za-z0-9\s]/, { message: 'Password must contain a special character' })
  @Matches(/^\S*$/, { message: 'Password must not contain spaces' })
  password!: string
}
