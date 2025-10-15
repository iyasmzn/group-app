'use client'

import { Virtuoso } from 'react-virtuoso'
import { AppAvatar } from '@/components/ui/app-avatar'
import { cn } from '@/lib/utils'
import { formatDateDivider } from '@/lib/utils/format'
import React from 'react'

type Message = {
  id: string
  content: string
  createdat: string
  sender_id: string
  sender?: {
    id: string
    full_name: string
    avatar_url?: string | null
  }
}

type Props = {
  messages: Message[]
  currentUserId?: string
  height: number | string
  width: number | string
  itemSize?: number
}

const MessageBubble = React.memo(({ msg, isOwn }: { msg: Message; isOwn: boolean }) => {
  return (
    <div
      className={cn('flex items-start gap-2 px-2 pb-2', isOwn ? 'justify-end' : 'justify-start')}
    >
      {!isOwn && msg.sender?.full_name && (
        <AppAvatar image={msg.sender?.avatar_url || ''} name={msg.sender?.full_name} size="sm" />
      )}
      <div
        className={cn(
          'max-w-[70%] px-4 py-2 rounded-xl text-sm shadow',
          isOwn
            ? 'bg-primary text-primary-foreground rounded-tr-none'
            : 'bg-muted text-foreground rounded-tl-none'
        )}
      >
        {!isOwn && (
          <p className="text-xs text-secondary-foreground mb-1 font-medium">
            {msg.sender?.full_name}
          </p>
        )}
        <p>{msg.content}</p>
        <span className="block text-[10px] text-muted-foreground mt-1 text-right">
          {new Date(msg.createdat).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  )
})
MessageBubble.displayName = 'MessageBubble'

export function MessageList({ messages, currentUserId, height, width }: Props) {
  return (
    <Virtuoso
      style={{ height, width }}
      data={messages}
      followOutput="auto"
      overscan={200}
      itemContent={(index, msg) => {
        const isOwn = msg.sender_id === currentUserId
        const prevMsg = messages[index - 1]

        const showDivider =
          !prevMsg ||
          new Date(prevMsg.createdat).toDateString() !== new Date(msg.createdat).toDateString()

        return (
          <div>
            {showDivider && (
              <div className="flex justify-center my-2">
                <span className="px-3 py-1 text-xs rounded-full bg-muted text-muted-foreground">
                  {formatDateDivider(msg.createdat)}
                </span>
              </div>
            )}
            <MessageBubble msg={msg} isOwn={isOwn} />
          </div>
        )
      }}
    />
  )
}
