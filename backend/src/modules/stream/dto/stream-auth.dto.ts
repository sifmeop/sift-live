import { IsString, Matches } from 'class-validator'

export class StreamAuthDto {
  @IsString()
  path!: string

  @IsString()
  @Matches(/^live_[a-f0-9]+$/)
  token!: string
}
