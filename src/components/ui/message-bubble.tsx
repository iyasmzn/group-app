'use client'

import React from 'react'
import { AppAvatar } from '@/components/ui/app-avatar'
import { cn } from '@/lib/utils'
import { isOnlyEmojis, getEmojiCount } from '@/lib/utils/helper'

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
  msg: Message
  isOwn: boolean
}

export const MessageBubble = React.memo(({ msg, isOwn }: Props) => {
  const content = msg.content.trim()
  const isEmojiOnly = isOnlyEmojis(content)
  const emojiCount = getEmojiCount(content)

  // Tentukan ukuran font berdasarkan jumlah emoji
  let emojiSize = 'text-6xl'
  if (emojiCount >= 3) emojiSize = 'text-4xl'
  if (emojiCount >= 6) emojiSize = 'text-3xl'
  if (emojiCount >= 10) emojiSize = 'text-2xl'

  return (
    <div className={cn('flex items-start gap-2', isOwn ? 'justify-end' : 'justify-start')}>
      {!isOwn && msg.sender?.full_name && (
        <AppAvatar image={msg.sender?.avatar_url || ''} name={msg.sender?.full_name} size="sm" />
      )}

      <div
        className={cn(
          'max-w-[75%] px-4 py-2 rounded-xl shadow transition-all',
          isEmojiOnly
            ? 'bg-transparent shadow-none select-none text-center'
            : isOwn
            ? 'bg-primary text-primary-foreground rounded-tr-none text-sm'
            : 'bg-muted text-foreground rounded-tl-none text-sm'
        )}
      >
        {!isOwn && !isEmojiOnly && (
          <p className="text-xs text-secondary-foreground mb-1 font-medium">
            {msg.sender?.full_name}
          </p>
        )}

        <p
          className={cn(
            'whitespace-pre-wrap wrap-break-word leading-snug',
            isEmojiOnly && cn(emojiSize, 'leading-tight')
          )}
        >
          {msg.content}
        </p>

        <span
          className={cn(
            'block text-[10px] mt-1 text-right',
            isEmojiOnly
              ? 'text-muted-foreground/70'
              : isOwn
              ? 'text-primary-foreground'
              : 'text-muted-foreground'
          )}
        >
          {new Date(msg.createdat).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  )
})

MessageBubble.displayName = 'MessageBubble'
