import { Field, InputType, PartialType } from '@nestjs/graphql'

import { RegisterInput } from './register.input'

@InputType()
export class LoginInput extends PartialType(RegisterInput) {
  @Field()
  email!: string

  @Field()
  password!: string
}
