'use client'

import { Virtuoso, VirtuosoHandle } from 'react-virtuoso'
import { AppAvatar } from '@/components/ui/app-avatar'
import { cn } from '@/lib/utils'
import { formatDateDivider } from '@/lib/utils/format'
import React, { useRef, useEffect, useState } from 'react'
import { ArrowDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// ---------- Types ----------
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
}

// ---------- Debounce Helper ----------
function useDebounce(callback: (...args: any[]) => void, delay: number) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  return (...args: any[]) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => callback(...args), delay)
  }
}

// ---------- Bubble ----------
const MessageBubble = React.memo(({ msg, isOwn }: { msg: Message; isOwn: boolean }) => (
  <div className={cn('flex items-start gap-2', isOwn ? 'justify-end' : 'justify-start')}>
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
        {new Date(msg.createdat).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </span>
    </div>
  </div>
))
MessageBubble.displayName = 'MessageBubble'

// ---------- MessageList ----------
export function MessageList({ messages, currentUserId, height, width }: Props) {
  const virtuosoRef = useRef<VirtuosoHandle>(null)
  const [atBottom, setAtBottom] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const unreadCountRef = useRef(0)
  const prevMessagesLengthRef = useRef(messages.length)
  const [bounce, setBounce] = useState(false)
  const [stickyDate, setStickyDate] = useState<string | null>(null)

  // keep unread ref synced
  useEffect(() => {
    unreadCountRef.current = unreadCount
  }, [unreadCount])

  // Debounced bounce reset
  const triggerBounce = useDebounce(() => setBounce(false), 300)

  // scroll langsung ke bottom saat pertama render
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        virtuosoRef.current?.scrollToIndex({
          index: messages.length - 1,
          align: 'end',
          behavior: 'auto', // langsung tanpa animasi
        })
      }, 100)
    }
  }, [])

  // React only when new messages come
  useEffect(() => {
    const prevLen = prevMessagesLengthRef.current
    const currLen = messages.length
    if (currLen === prevLen) return

    prevMessagesLengthRef.current = currLen
    if (currLen === 0) return

    const lastMsg = messages[currLen - 1]
    const isOwn = lastMsg.sender_id === currentUserId

    if (isOwn) {
      // scroll ke bawah langsung kalau pesan sendiri
      virtuosoRef.current?.scrollToIndex({
        index: currLen - 1,
        align: 'end',
        behavior: 'smooth',
      })
      setAtBottom(true)
      setUnreadCount(0)
      unreadCountRef.current = 0
      return
    }

    if (!atBottom) {
      // unread naik hanya kalau user scroll ke atas
      const newCount = unreadCountRef.current + 1
      unreadCountRef.current = newCount
      setUnreadCount(newCount)
      setBounce(true)
      triggerBounce()
    } else {
      // kalau user di bawah, langsung scroll otomatis
      virtuosoRef.current?.scrollToIndex({
        index: currLen - 1,
        align: 'end',
        behavior: 'smooth',
      })
      setUnreadCount(0)
      unreadCountRef.current = 0
    }
  }, [messages, currentUserId, atBottom, triggerBounce])

  return (
    <div className="relative" style={{ height, width }}>
      <Virtuoso
        ref={virtuosoRef}
        style={{ height: '100%', width: '100%' }}
        data={messages}
        followOutput="auto"
        overscan={200}
        atBottomStateChange={(isBottom) => {
          setAtBottom(isBottom)
          if (isBottom) {
            setUnreadCount(0)
            unreadCountRef.current = 0
          }
        }}
        rangeChanged={(range) => {
          const firstMsg = messages[range.startIndex]
          if (firstMsg) setStickyDate(firstMsg.createdat)
        }}
        itemContent={(index, msg) => {
          const isOwn = msg.sender_id === currentUserId
          const prevMsg = messages[index - 1]
          const showDivider =
            !prevMsg ||
            new Date(prevMsg.createdat).toDateString() !== new Date(msg.createdat).toDateString()

          return (
            <div className="px-2 pb-2">
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

      {/* Sticky Date Divider */}
      <AnimatePresence>
        {stickyDate && (
          <motion.div
            key={stickyDate}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="absolute top-2 left-1/2 -translate-x-1/2 bg-muted text-muted-foreground text-xs px-3 py-1 rounded-full shadow-sm"
          >
            {formatDateDivider(stickyDate)}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll Button */}
      <AnimatePresence>
        {!atBottom && (
          <motion.button
            key="scroll-btn"
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 40 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={() => {
              virtuosoRef.current?.scrollToIndex({
                index: messages.length - 1,
                align: 'end',
                behavior: 'smooth',
              })
              setUnreadCount(0)
              unreadCountRef.current = 0
              setAtBottom(true)
            }}
            className={cn(
              'absolute bottom-16 right-4 flex items-center justify-center',
              'rounded-full shadow-md p-3',
              'bg-primary text-primary-foreground',
              'hover:scale-105 active:scale-95',
              'transition-transform duration-300 ease-out'
            )}
          >
            <ArrowDown className="w-5 h-5" />

            {/* Unread Badge */}
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span
                  key="badge"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: bounce ? 1.2 : 1,
                    opacity: 1,
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5"
                >
                  {unreadCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
