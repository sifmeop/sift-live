import { Body, Controller, Get, Logger, Post, Query, UnauthorizedException } from '@nestjs/common'

import { SocketService } from '../socket/socket.service'
import { StreamAuthDto } from './dto/stream-auth.dto'
import { StreamWebhookDto } from './dto/stream-webhook.dto'
import { StreamService } from './stream.service'
import { Public } from '~/common/decorators/public.decorator'
import { PrismaService } from '~/prisma/prisma.service'

@Controller('stream')
export class StreamController {
  private readonly logger = new Logger(StreamController.name)

  constructor(
    private readonly streamService: StreamService,
    private readonly socketService: SocketService,
    private readonly prismaService: PrismaService,
  ) {}

  @Public()
  @Post('webhook/auth')
  async auth(@Body() body: StreamAuthDto) {
    const channel = await this.prismaService.channel.findFirst({
      where: { streamKey: body.token },
      include: { user: { select: { username: true } } },
    })

    if (!channel || channel.user.username !== body.path || channel.streamKey !== body.token) {
      throw new UnauthorizedException('Invalid stream key')
    }

    this.logger.log(`Successfully authenticated stream by user ${channel.id}`)

    return true
  }

  @Public()
  @Get('webhook/stream-connect')
  async streamConnect(@Query() query: StreamWebhookDto) {
    const streamKey = query.path.split('/')[1]

    const channel = await this.prismaService.channel.findFirst({
      where: { streamKey },
      select: { id: true },
    })

    if (!channel) {
      throw new UnauthorizedException('Invalid stream key')
    }

    await this.prismaService.channel.update({
      where: { id: channel.id },
      data: { isLive: true },
    })

    this.logger.log(`Successfully connected stream by user ${channel.id}`)

    this.socketService.emitUsersChannelOnline(channel.id)
  }

  @Public()
  @Get('webhook/stream-disconnect')
  async streamDisconnect(@Query() query: StreamWebhookDto) {
    const streamKey = query.path.split('/')[1]

    const channel = await this.prismaService.channel.findFirst({
      where: { streamKey },
      select: { id: true },
    })

    if (!channel) {
      throw new UnauthorizedException('Invalid stream key')
    }

    await this.prismaService.channel.update({
      where: { id: channel.id },
      data: { isLive: false },
    })

    this.logger.log(`Successfully disconnected stream by user ${channel.id}`)

    this.socketService.emitUsersChannelOffline(channel.id)
  }
}
