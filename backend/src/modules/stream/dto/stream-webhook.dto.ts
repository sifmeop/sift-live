import { IsString, Matches } from 'class-validator'

export class StreamWebhookDto {
  @IsString()
  path!: string

  @IsString()
  @Matches(/^token=live_[a-f0-9]{40}$/)
  query!: string
}
