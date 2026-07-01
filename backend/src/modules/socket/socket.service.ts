import { Injectable } from '@nestjs/common'

import { ChannelSubscribeDto } from './dto/channel-subscribe.dto'
import { MessageSendDto } from './dto/message-send.dto'
import { AppSocket } from './socket.types'
import { type Server } from 'socket.io'
import { RedisService } from '~/modules/redis/redis.service'
import { PrismaService } from '~/prisma/prisma.service'

@Injectable()
export class SocketService {
  private server?: Server

  constructor(
    private readonly redisService: RedisService,
    private readonly prismaService: PrismaService,
  ) {}

  setServer(server: Server): void {
    this.server = server
  }

  async channelSubscribe(socket: AppSocket, dto: ChannelSubscribeDto): Promise<void> {
    const channel = await this.prismaService.channel.findUnique({
      where: { id: dto.channelId },
      select: { id: true },
    })

    if (!channel) {
      socket.emit('channel:subscribed', { channelId: dto.channelId, ok: false })
      return
    }

    await this.redisService.addViewer(channel.id, socket.id)
    await this.redisService.addSocketChannel(socket.id, channel.id)

    await socket.join(`channel:${channel.id}`)
    socket.emit('channel:subscribed', { channelId: channel.id, ok: true })
  }

  async channelUnsubscribe(socket: AppSocket, dto: ChannelSubscribeDto): Promise<void> {
    await this.redisService.removeViewer(dto.channelId, socket.id)
    await this.redisService.removeSocketChannel(socket.id, dto.channelId)

    await socket.leave(`channel:${dto.channelId}`)
    socket.emit('channel:unsubscribed', { channelId: dto.channelId })
  }

  async cleanupDisconnect(socket: AppSocket): Promise<void> {
    const channelIds = await this.redisService.getSocketChannels(socket.id)

    if (channelIds.length === 0) {
      return
    }

    for (const channelId of channelIds) {
      await this.redisService.removeViewer(channelId, socket.id)
    }

    await this.redisService.deleteSocketMapping(socket.id)
  }

  async messageSend(socket: AppSocket, dto: MessageSendDto): Promise<void> {
    const user = socket.data.user

    if (!user) {
      socket.emit('error', { event: 'message:send', message: 'Authentication required' })
      return
    }

    const { sub: userId, username } = user

    const channel = await this.prismaService.channel.findUnique({
      where: {
        id: dto.channelId,
      },
      select: { id: true },
    })

    if (!channel) {
      return
    }

    const message = await this.prismaService.message.create({
      data: {
        userId,
        text: dto.text,
        channelId: channel.id,
      },
      include: {
        user: { select: { color: true } },
      },
    })

    const payload = {
      id: message.id,
      userId,
      text: dto.text,
      channelId: channel.id,
      username,
      color: message.user.color,
    }

    this.server?.to(`channel:${channel.id}`).emit('message:new', payload)
  }

  async emitUsersChannelOnline(channelId: string): Promise<void> {
    this.server?.to(`channel:${channelId}`).emit('channel:online', { channelId })

    const followers = await this.prismaService.channelFollow.findMany({
      where: { channelId },
      select: { followerId: true },
    })

    for (const follower of followers) {
      this.server?.to(`user:${follower.followerId}`).emit('channel:online', { channelId })
    }
  }

  async emitUsersChannelOffline(channelId: string): Promise<void> {
    this.server?.to(`channel:${channelId}`).emit('channel:offline', { channelId })

    const followers = await this.prismaService.channelFollow.findMany({
      where: { channelId },
      select: { followerId: true },
    })

    for (const follower of followers) {
      this.server?.to(`user:${follower.followerId}`).emit('channel:offline', { channelId })
    }
  }

  emitToUser(userId: string, event: string, payload: unknown): void {
    this.server?.to(`user:${userId}`).emit(event, payload)
  }
}
