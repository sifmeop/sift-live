import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import Redis from 'ioredis'
import { EnvConfig } from '~/config/env.config'

const CHANNEL_VIEWERS_PREFIX = 'channel'
const SOCKET_CHANNELS_PREFIX = 'socket'
const VIEWERS_SUFFIX = 'viewers'
const TTL_SECONDS = 60 * 60 * 24

@Injectable()
export class RedisService extends Redis {
  constructor(configService: ConfigService<EnvConfig>) {
    super(configService.getOrThrow<string>('REDIS_URL'))
  }

  async addViewer(channelId: string, socketId: string): Promise<void> {
    const key = this.channelViewersKey(channelId)

    await this.pipeline().sadd(key, socketId).expire(key, TTL_SECONDS).exec()
  }

  async removeViewer(channelId: string, socketId: string): Promise<void> {
    await this.srem(this.channelViewersKey(channelId), socketId)
  }

  async getViewerCount(channelId: string): Promise<number> {
    return this.scard(this.channelViewersKey(channelId))
  }

  async addSocketChannel(socketId: string, channelId: string): Promise<void> {
    await this.sadd(this.socketChannelsKey(socketId), channelId)
  }

  async removeSocketChannel(socketId: string, channelId: string): Promise<void> {
    await this.srem(this.socketChannelsKey(socketId), channelId)
  }

  async getSocketChannels(socketId: string): Promise<string[]> {
    return this.smembers(this.socketChannelsKey(socketId))
  }

  async deleteSocketMapping(socketId: string): Promise<void> {
    await this.del(this.socketChannelsKey(socketId))
  }

  private channelViewersKey(channelId: string): string {
    return `${CHANNEL_VIEWERS_PREFIX}:${channelId}:${VIEWERS_SUFFIX}`
  }

  private socketChannelsKey(socketId: string): string {
    return `${SOCKET_CHANNELS_PREFIX}:${socketId}`
  }
}
