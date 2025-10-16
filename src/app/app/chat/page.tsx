'use client'

import { useEffect, useMemo, useState, useCallback } from 'react'
import { useAuth } from '@/lib/supabase/auth'
import { supabase } from '@/lib/supabase/client'
import { AppTopbar } from '@/components/app/topbar'
import { AppBottombar } from '@/components/app/bottombar'
import PageWrapper from '@/components/page-wrapper'
import { MessageCircle } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChatListItem } from '@/components/app/chat/ChatListItem'
import { AnimatePresence, motion } from 'framer-motion'
import Reveal from '@/components/animations/Reveal'
import { useRouter } from 'next/navigation'
import { groupService } from '@/services/groupService/groupService'
import { GroupMessage, groupMessageService } from '@/services/groupService/groupMessageService'
import { useRealtimeTable } from '@/lib/hooks/useRealtimeTable'
import { cn } from '@/lib/utils'
import LoadingOverlay from '@/components/loading-overlay'

type GroupChatItem = {
  id: string
  name: string
  lastMessage: string
  time: string
  lastCreatedAt: string
  unread: number
}

export default function ChatPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'private' | 'group'>('private')
  const [dragX, setDragX] = useState(0)
  const [groupChats, setGroupChats] = useState<GroupChatItem[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingOpenChat, setLoadingOpenChat] = useState(false)

  const userId = useMemo(() => user?.id, [user?.id])
  const unreadPrivate = 3 // dummy private
  const totalGroupUnread = groupChats.reduce((sum, g) => sum + g.unread, 0)

  // ✅ Fetch awal
  useEffect(() => {
    async function fetchGroups() {
      if (!userId) return
      setLoading(true)
      const groups = await groupService.getByMember(userId)
      const chats = await groupMessageService.getLatestByGroups(
        groups.map((g) => g.id),
        userId
      )

      const merged = chats.map((c) => ({
        ...c,
        name: groups.find((g) => g.id === c.id)?.name ?? 'Unknown',
        time: c.lastCreatedAt
          ? new Date(c.lastCreatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : '',
      }))

      setGroupChats(
        merged.sort(
          (a, b) => new Date(b.lastCreatedAt).getTime() - new Date(a.lastCreatedAt).getTime()
        )
      )
      setLoading(false)
    }

    fetchGroups()
  }, [userId])

  // ✅ Optimistic unread sync debounce (1 sync per 10s)
  const debounceSyncUnread = useMemo(() => {
    let timeout: NodeJS.Timeout | null = null
    return (groupId: string) => {
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(async () => {
        if (!userId) return
        const unread = await groupMessageService.getUnreadCount(groupId, userId)
        setGroupChats((prev) => prev.map((c) => (c.id === groupId ? { ...c, unread } : c)))
      }, 10000)
    }
  }, [userId])

  // ✅ Realtime listener optimized
  useRealtimeTable<GroupMessage>({
    supabase,
    table: 'group_messages',
    onInsert: async (msg) => {
      if (!userId) return

      setGroupChats((prev) => {
        const existing = prev.find((c) => c.id === msg.group_id)
        if (existing) {
          const updated = prev.map((c) =>
            c.id === msg.group_id
              ? {
                  ...c,
                  lastMessage: msg.content,
                  time: new Date(msg.createdat).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  }),
                  lastCreatedAt: msg.createdat,
                  unread: c.unread + 1,
                }
              : c
          )

          // hanya sort kalau grup yang diupdate bukan yang paling atas
          if (msg.group_id !== prev[0]?.id) {
            return [...updated].sort(
              (a, b) => new Date(b.lastCreatedAt).getTime() - new Date(a.lastCreatedAt).getTime()
            )
          }
          return updated
        }

        // kalau grup baru
        return [
          {
            id: msg.group_id,
            name: 'Unknown',
            lastMessage: msg.content,
            time: new Date(msg.createdat).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
            lastCreatedAt: msg.createdat,
            unread: 1,
          },
          ...prev,
        ]
      })

      debounceSyncUnread(msg.group_id)
    },
  })

  // ✅ Swipe handling
  const handleSwipe = useCallback(
    (offsetX: number) => {
      if (offsetX < -50 && activeTab === 'private') {
        setActiveTab('group')
        navigator.vibrate?.(30)
      } else if (offsetX > 50 && activeTab === 'group') {
        setActiveTab('private')
        navigator.vibrate?.(30)
      }
      setDragX(0)
    },
    [activeTab]
  )

  return (
    <>
      <AppTopbar title="Chat" titleIcon={<MessageCircle className="w-6 h-6" />} />
      <PageWrapper>
        <LoadingOverlay isLoading={loadingOpenChat} />
        <div className="max-w-4xl mx-auto p-4">
          <Tabs
            value={activeTab}
            onValueChange={(v) => {
              setActiveTab(v as any)
              navigator.vibrate?.(20)
            }}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 w-full sm:max-w-sm">
              <TabsTrigger value="private" className="relative">
                Pribadi
                {unreadPrivate > 0 && (
                  <span className="absolute -top-1 -right-3 bg-red-500 text-white text-xs rounded-full px-1.5">
                    {unreadPrivate}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="group" className="relative">
                Grup
                {totalGroupUnread > 0 && (
                  <span className="absolute -top-1 -right-3 bg-red-500 text-white text-xs rounded-full px-1.5">
                    {totalGroupUnread}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* ✅ Loading State */}
          {loading ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="flex flex-col items-center justify-start pt-10 h-[60vh] text-muted-foreground"
            >
              <div className="space-y-4 w-full max-w-md px-4">
                {/* Skeleton chat list */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
                    <div className="flex-1 space-y-1">
                      <div className="h-3 w-3/4 bg-muted rounded animate-pulse" />
                      <div className="h-3 w-1/2 bg-muted rounded animate-pulse" />
                    </div>
                  </motion.div>
                ))}

                {/* Loading text */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{
                    delay: 0.5,
                    duration: 0.6,
                    repeat: Infinity,
                    repeatType: 'reverse',
                  }}
                  className="text-sm text-center pt-6"
                >
                  Memuat percakapan...
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <div className="mt-4 relative">
              {' '}
              {dragX !== 0 && (
                <div
                  className={cn(
                    'absolute inset-0 pointer-events-none transition-colors bg-primary/5 rounded-xl'
                  )}
                />
              )}
              <AnimatePresence mode="wait" initial={false}>
                {activeTab === 'private' ? (
                  <motion.div
                    key="private"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDrag={(e, info) => setDragX(info.offset.x)}
                    onDragEnd={(_, info) => handleSwipe(info.offset.x)}
                  >
                    {[
                      { name: 'Alice', lastMessage: 'Hai!', time: '19:45', unread: 2 },
                      { name: 'Bob', lastMessage: 'Oke besok ya', time: '18:20', unread: 1 },
                    ].map((chat, i) => (
                      <Reveal key={i} delay={i * 0.1} animation="fadeInLeft">
                        <ChatListItem
                          index={i}
                          {...chat}
                          onClick={() => router.push('/app/users/123/chat')}
                        />
                      </Reveal>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="group"
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 40 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDrag={(e, info) => setDragX(info.offset.x)}
                    onDragEnd={(_, info) => handleSwipe(info.offset.x)}
                  >
                    {groupChats.length === 0 ? (
                      <div className="text-center text-muted-foreground py-10">
                        Belum ada pesan grup
                      </div>
                    ) : (
                      groupChats.map((chat, i) => (
                        <Reveal key={chat.id} delay={i * 0.1} animation="fadeInRight">
                          <ChatListItem
                            index={i}
                            {...chat}
                            onClick={async () => {
                              if (!userId) return
                              setLoadingOpenChat(true)
                              await groupMessageService.markAsRead(
                                chat.id,
                                userId,
                                new Date().toISOString()
                              )
                              setGroupChats((prev) =>
                                prev.map((c) => (c.id === chat.id ? { ...c, unread: 0 } : c))
                              )
                              router.push(`/app/groups/${chat.id}/chat`)
                            }}
                          />
                        </Reveal>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </PageWrapper>
      <AppBottombar />
    </>
  )
}
