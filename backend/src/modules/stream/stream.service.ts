import { InjectQueue } from '@nestjs/bullmq'
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { SocketService } from '../socket/socket.service'
import { RecordingReadyDto } from './dto/recording-ready.dto'
import { Queue } from 'bullmq'
import { EnvConfig } from '~/config/env.config'
import { PrismaService } from '~/prisma/prisma.service'

const QUEUE_NAME = 'stream-processing'

const RECORDING_FINALIZATION_DELAY_MS = 3000
const MAX_ATTEMPTS = 3

interface StreamProcessingJobData {
  channelId: string
  username: string
}

@Injectable()
export class StreamService {
  private readonly logger = new Logger(StreamService.name)

  constructor(
    private readonly prismaService: PrismaService,
    private readonly socketService: SocketService,
    private readonly configService: ConfigService<EnvConfig>,
    @InjectQueue(QUEUE_NAME) private readonly streamProcessingQueue: Queue<StreamProcessingJobData>,
  ) {}

  async handleStreamStart(streamKey: string): Promise<void> {
    const channel = await this.prismaService.channel.findFirst({
      where: { streamKey },
      include: { category: true },
    })

    if (!channel) {
      throw new UnauthorizedException('Invalid stream key')
    }

    await this.prismaService.stream.updateMany({
      where: { channelId: channel.id, endedAt: null },
      data: { endedAt: new Date() },
    })

    await this.prismaService.stream.create({
      data: {
        channelId: channel.id,
        title: channel.title,
        categoryLogs: {
          create: {
            categoryId: channel.categoryId,
            categoryName: channel.category.title,
          },
        },
      },
    })

    await this.prismaService.channel.update({
      where: { id: channel.id },
      data: { isLive: true },
    })

    this.logger.log(`Stream started for channel: ${channel.id}`)

    await this.socketService.emitUsersChannelOnline(channel.id)
  }

  async handleStreamEnd(streamKey: string): Promise<void> {
    const channel = await this.prismaService.channel.findFirst({
      where: { streamKey },
      include: { user: { select: { username: true } } },
    })

    if (!channel) {
      throw new UnauthorizedException('Invalid stream key')
    }

    await this.prismaService.channel.update({
      where: { id: channel.id },
      data: { isLive: false },
    })

    this.logger.log(`Stream ended for channel: ${channel.id}`)

    await this.socketService.emitUsersChannelOffline(channel.id)

    await this.streamProcessingQueue.add(
      'process',
      { channelId: channel.id, username: channel.user.username },
      {
        delay: RECORDING_FINALIZATION_DELAY_MS,
        attempts: MAX_ATTEMPTS,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
        removeOnComplete: true,
      },
    )
  }

  async handleRecordingReady({
    streamId,
    channelId,
    duration,
    posterUrl,
  }: RecordingReadyDto): Promise<void> {
    const now = new Date()

    const lastLog = await this.prismaService.streamCategoryLog.findFirst({
      where: { streamId, endedAt: null },
    })

    if (lastLog) {
      const categoryDuration = Math.round((now.getTime() - lastLog.startedAt.getTime()) / 1000)
      await this.prismaService.streamCategoryLog.update({
        where: { id: lastLog.id },
        data: { endedAt: now, duration: categoryDuration },
      })
    }

    const publicUrl = this.configService.getOrThrow<string>('MINIO_PUBLIC_URL')
    const bucket = this.configService.getOrThrow<string>('MINIO_BUCKET')
    const baseUrl = `${publicUrl}/${bucket}/${channelId}/${streamId}`

    const videoUrl = `${baseUrl}/playlist.m3u8`
    const fullPosterUrl = posterUrl ? `${publicUrl}/${bucket}/${posterUrl}` : null

    await this.prismaService.stream.update({
      where: { id: streamId },
      data: { endedAt: now, duration, videoUrl, posterUrl: fullPosterUrl },
    })

    this.logger.log(`Recording ready for stream: ${streamId}, duration: ${String(duration)}s`)
  }
}
