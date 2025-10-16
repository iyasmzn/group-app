'use client'

import { Virtuoso, VirtuosoHandle } from 'react-virtuoso'
import { cn } from '@/lib/utils'
import { formatDateDivider } from '@/lib/utils/format'
import React, { useRef, useEffect, useState } from 'react'
import { ArrowDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppBadges } from '@/context/AppBadgeContext'
import { MessageBubble } from '@/components/ui/message-bubble'
import { groupMessageService } from '@/services/groupService/groupMessageService'

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
  groupId: string
}

export function MessageList({ messages, currentUserId, height, width, groupId }: Props) {
  const virtuosoRef = useRef<VirtuosoHandle>(null)
  const [atBottom, setAtBottom] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const unreadRef = useRef(0)
  const prevMessagesRef = useRef(messages.length)
  const [stickyDate, setStickyDate] = useState<string | null>(null)
  const [firstLoad, setFirstLoad] = useState(true)
  const prevIsBottomRef = useRef<boolean>(true)
  const { resetGroupUnread, refresh } = useAppBadges()

  // Scroll ke bawah pada load pertama
  useEffect(() => {
    if (firstLoad && messages.length > 0) {
      setFirstLoad(false)
      requestAnimationFrame(() => {
        setTimeout(() => {
          virtuosoRef.current?.scrollToIndex({
            index: messages.length - 1,
            align: 'end',
            behavior: 'auto',
          })
          resetGroupUnread(groupId)
        }, 50)
      })
    }
  }, [firstLoad, messages.length, groupId, resetGroupUnread])

  // Deteksi pesan baru
  useEffect(() => {
    const prevLen = prevMessagesRef.current
    const currLen = messages.length
    if (currLen === prevLen) return
    prevMessagesRef.current = currLen
    if (currLen === 0) return

    const lastMsg = messages[currLen - 1]
    const isOwn = lastMsg.sender_id === currentUserId
    console.log('New message detected. isOwn:', isOwn, 'atBottom:', atBottom)
    if (isOwn || atBottom) {
      setTimeout(() => {
        virtuosoRef.current?.scrollToIndex({
          index: currLen - 1,
          align: 'end',
          behavior: 'smooth',
        })
      }, 50)
      console.log('Auto-scrolling to bottom')
      setUnreadCount(0)
      unreadRef.current = 0
      resetGroupUnread(groupId)
    } else {
      setUnreadCount((prev) => prev + 1)
      unreadRef.current += 1
    }
  }, [messages.length])

  const handleRangeChange = (range: { startIndex: number }) => {
    const msg = messages[range.startIndex]
    if (!msg) return
    const newDate = msg.createdat
    if (newDate !== stickyDate) setStickyDate(newDate)
  }

  const handleAtBottomChange = (isBottom: boolean) => {
    if (prevIsBottomRef.current !== isBottom) {
      prevIsBottomRef.current = isBottom
      setAtBottom(isBottom)
      if (isBottom) {
        setUnreadCount(0)
        unreadRef.current = 0
        resetGroupUnread(groupId)
      }
    }
  }

  useEffect(() => {
    return () => {
      console.log('MessageList unmount → refresh badge state')
      groupMessageService.markAsRead(groupId, currentUserId!, new Date().toISOString())
      setTimeout(() => {
        refresh() // aman, hanya sekali saat unmount
      }, 1000)
    }
  }, []) // kosong → tidak rerun saat atBottom berubah

  return (
    <div className="relative" style={{ height, width }}>
      {/* Sticky Date */}
      <AnimatePresence>
        {stickyDate && (
          <motion.div
            key={stickyDate}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="absolute top-2 left-1/2 -translate-x-1/2 bg-muted text-muted-foreground text-xs px-3 py-1 rounded-full shadow-sm z-10"
          >
            {formatDateDivider(stickyDate)}
          </motion.div>
        )}
      </AnimatePresence>

      <Virtuoso
        ref={virtuosoRef}
        style={{ height: '100%', width: '100%', overflowX: 'hidden' }}
        data={messages}
        followOutput={false}
        overscan={200}
        rangeChanged={handleRangeChange}
        atBottomStateChange={handleAtBottomChange}
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

      {/* Tombol scroll ke bawah */}
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
              unreadRef.current = 0
              setAtBottom(true)
              resetGroupUnread(groupId)
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
            {unreadCount > 0 && (
              <motion.span
                key="badge"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5"
              >
                {unreadCount}
              </motion.span>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
