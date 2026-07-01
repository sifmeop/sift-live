import { Logger, UsePipes, ValidationPipe } from '@nestjs/common'
import {
  ConnectedSocket,
  MessageBody,
  type OnGatewayConnection,
  type OnGatewayDisconnect,
  type OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'

import { ChannelSubscribeDto } from './dto/channel-subscribe.dto'
import { MessageSendDto } from './dto/message-send.dto'
import { SocketService } from './socket.service'
import { type AppSocket } from './socket.types'
import { type Server } from 'socket.io'

@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
@WebSocketGateway()
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(SocketGateway.name)

  @WebSocketServer()
  private server!: Server

  constructor(private readonly socketService: SocketService) {}

  afterInit(): void {
    this.socketService.setServer(this.server)
  }

  async handleConnection(socket: AppSocket): Promise<void> {
    const user = socket.data.user

    socket.emit('auth:connected')

    if (user) {
      await socket.join(`user:${user.sub}`)
      this.logger.log(`auth user ${user.sub} connected (socket ${socket.id})`)
    } else {
      this.logger.log(`anonymous ${socket.data.anonymousId} connected (socket ${socket.id})`)
    }

    socket.on('disconnecting', async () => {
      try {
        await this.socketService.cleanupDisconnect(socket)
      } catch (err) {
        this.logger.error(
          `Failed to cleanup socket ${socket.id} on disconnecting: ${(err as Error).message}`,
        )
      }
    })
  }

  handleDisconnect(socket: AppSocket): void {
    const user = socket.data.user

    if (user) {
      this.logger.log(`auth user ${user.sub} disconnected (socket ${socket.id})`)
    } else {
      this.logger.log(`anonymous ${socket.data.anonymousId} disconnected (socket ${socket.id})`)
    }
  }

  @SubscribeMessage('channel:subscribe')
  async handleChannelSubscribe(
    @ConnectedSocket() socket: AppSocket,
    @MessageBody() dto: ChannelSubscribeDto,
  ): Promise<void> {
    return this.socketService.channelSubscribe(socket, dto)
  }

  @SubscribeMessage('channel:unsubscribe')
  async handleChannelUnsubscribe(
    @ConnectedSocket() socket: AppSocket,
    @MessageBody() dto: ChannelSubscribeDto,
  ): Promise<void> {
    return this.socketService.channelUnsubscribe(socket, dto)
  }

  @SubscribeMessage('message:send')
  async handleMessageSend(
    @ConnectedSocket() socket: AppSocket,
    @MessageBody() dto: MessageSendDto,
  ): Promise<void> {
    return this.socketService.messageSend(socket, dto)
  }
}
