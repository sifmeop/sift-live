import { Outlet } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useIntlayer } from 'react-intlayer'

import { useChannel } from '~/features/channel'
import { useSocket } from '~/shared/api/socket'
import { Spinner } from '~/shared/ui/Spinner'
import { ChatBox } from '~/widgets/ChatBox'
import { StreamPlayer } from '~/widgets/StreamPlayer'

import { ChannelDescription } from './ui/ChannelDescription'
import { ChannelHeader } from './ui/ChannelHeader'

interface ChannelPageProps {
  username: string
}

export const ChannelPage = ({ username }: ChannelPageProps) => {
  const t = useIntlayer('channel-page')

  const socket = useSocket()

  const channel = useChannel(username)

  useEffect(() => {
    if (!channel.data || !socket) return

    socket.emit('channel:subscribe', { channelId: channel.data.id })

    return () => {
      if (channel.data) {
        socket.emit('channel:unsubscribe', { channelId: channel.data.id })
      }
    }
  }, [channel, socket])

  if (channel.error) {
    return (
      <div className="grid flex-1 place-items-center">
        <p>{t.channel.notFound.value}</p>
      </div>
    )
  }

  if (channel.fetching) {
    return <Spinner variant="full-absolute" />
  }

  if (!channel.data) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <p className="text-muted-foreground text-sm">{t.offline.value}</p>
      </div>
    )
  }

  return (
    <div className="grid h-full grid-cols-1 lg:grid-cols-[1fr_360px]">
      <div className="flex flex-col gap-4 overflow-y-auto p-4">
        <StreamPlayer isLive={channel.data.isLive} chanelId={channel.data.id} username={username} />
        <ChannelHeader username={username} channel={channel.data} />
        <ChannelDescription username={username} channel={channel.data} />
        <div className="mt-2">
          <Outlet />
        </div>
      </div>

      <aside className="bg-background hidden h-full flex-col border-l lg:flex">
        <ChatBox channelId={channel.data.id} username={username} />
      </aside>
    </div>
  )
}
