'use client'

import React from 'react'
import { motion, type Variants } from 'framer-motion'
import { AppAvatar } from '@/components/ui/app-avatar'
import { cn } from '@/lib/utils'

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

const emojiOnlyRegex =
  /^(?:\p{Emoji_Presentation}|\p{Extended_Pictographic}|\p{Emoji}\uFE0F?|\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\s)+$/u

export const MessageBubble = React.memo(({ msg, isOwn }: Props) => {
  const content = msg.content.trim()
  const isEmojiOnly = emojiOnlyRegex.test(content)

  // Hitung jumlah emoji
  const emojiCount = (
    content.match(/\p{Emoji_Presentation}|\p{Extended_Pictographic}|\p{Emoji}/gu) || []
  ).length

  // Tentukan ukuran font berdasarkan jumlah emoji
  let emojiSize = 'text-6xl'
  if (emojiCount >= 3) emojiSize = 'text-4xl'
  if (emojiCount >= 6) emojiSize = 'text-3xl'
  if (emojiCount >= 10) emojiSize = 'text-2xl'

  // 🟢 Smooth animasi untuk text message
  const textVariants: Variants = {
    hidden: {},
    visible: {},
  }

  // 🟣 Smooth animasi untuk emoji-only message
  const emojiVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 10,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.1,
        ease: 'easeOut',
      },
    },
  }

  return (
    <div className={cn('flex items-start gap-2', isOwn ? 'justify-end' : 'justify-start')}>
      {!isOwn && msg.sender?.full_name && (
        <AppAvatar image={msg.sender?.avatar_url || ''} name={msg.sender?.full_name} size="sm" />
      )}

      <motion.div
        variants={isEmojiOnly ? emojiVariants : textVariants}
        initial="hidden"
        animate="visible"
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
            'whitespace-pre-wrap break-words leading-snug',
            isEmojiOnly && cn(emojiSize, 'leading-tight')
          )}
        >
          {msg.content}
        </p>

        {!isEmojiOnly && (
          <span
            className={cn(
              'block text-[10px] text-muted-foreground mt-1 text-right',
              isOwn ? 'text-primary-foreground' : 'text-muted-foreground'
            )}
          >
            {new Date(msg.createdat).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        )}
      </motion.div>
    </div>
  )
})

MessageBubble.displayName = 'MessageBubble'
