'use client'

import { AppBottombar } from '@/components/app/bottombar'
import { AppTopbar } from '@/components/app/topbar'
import PageWrapper from '@/components/page-wrapper'
import { MessageCircle } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChatListItem } from '@/components/app/chat/ChatListItem'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Reveal from '@/components/animations/Reveal'
import { useRouter } from 'next/navigation'
import { groupService } from '@/services/groupService/groupService'
import { GroupMessage, groupMessageService } from '@/services/groupService/groupMessageService'
import { useRealtimeTable } from '@/lib/hooks/useRealtimeTable'
import { useAuth } from '@/lib/supabase/auth'
import { Skeleton } from '@/components/ui/skeleton'

type GroupChatItem = {
  id: string
  name: string
  lastMessage: string
  time: string
  lastCreatedAt: string
  unread: number
}

export default function ChatPage() {
  const { user, supabase } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'private' | 'group'>('private')
  const [dragX, setDragX] = useState(0)
  const [groupChats, setGroupChats] = useState<GroupChatItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const unread = { private: 3 } // dummy private
  const totalGroupUnread = groupChats.reduce((sum, g) => sum + g.unread, 0)

  const privateChats = [
    { name: 'Alice', lastMessage: 'Hey, apa kabar?', time: '19:45', unread: 2 },
    { name: 'Bob', lastMessage: 'Oke, besok ketemu ya', time: '18:20', unread: 1 },
  ]

  // Fetch awal
  useEffect(() => {
    async function fetchGroups() {
      if (!user) return
      setIsLoading(true)
      try {
        const groups = await groupService.getByMember(user.id)
        const chats = await groupMessageService.getLatestByGroups(
          groups.map((g) => g.id),
          user.id
        )

        const merged = chats.map((c) => ({
          ...c,
          name: groups.find((g) => g.id === c.id)?.name ?? 'Unknown',
          time: c.lastCreatedAt
            ? new Date(c.lastCreatedAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })
            : '',
        }))

        setGroupChats(
          merged.sort(
            (a, b) => new Date(b.lastCreatedAt).getTime() - new Date(a.lastCreatedAt).getTime()
          )
        )
      } finally {
        setIsLoading(false)
      }
    }
    fetchGroups()
  }, [user?.id])

  // Realtime update
  useRealtimeTable<GroupMessage>({
    supabase,
    table: 'group_messages',
    onInsert: async (msg) => {
      if (!user) return

      const unread = await groupMessageService.getUnreadCount(msg.group_id, user.id)

      setGroupChats((prev) => {
        const updated = prev.map((chat) =>
          chat.id === msg.group_id
            ? {
                ...chat,
                lastMessage: msg.content,
                time: new Date(msg.createdat).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                }),
                lastCreatedAt: msg.createdat,
                unread,
              }
            : chat
        )

        if (!updated.find((c) => c.id === msg.group_id)) {
          updated.push({
            id: msg.group_id,
            name: 'Unknown',
            lastMessage: msg.content,
            time: new Date(msg.createdat).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
            lastCreatedAt: msg.createdat,
            unread,
          })
        }

        return [...updated].sort(
          (a, b) => new Date(b.lastCreatedAt).getTime() - new Date(a.lastCreatedAt).getTime()
        )
      })
    },
  })

  const handleSwipe = (offsetX: number) => {
    if (offsetX < -50 && activeTab === 'private') {
      setActiveTab('group')
      if (navigator.vibrate) navigator.vibrate(30)
    } else if (offsetX > 50 && activeTab === 'group') {
      setActiveTab('private')
      if (navigator.vibrate) navigator.vibrate(30)
    }
    setDragX(0)
  }

  return (
    <>
      <AppTopbar title="Chat" titleIcon={<MessageCircle className="w-6 h-6" />} />
      <PageWrapper>
        <div className="max-w-4xl mx-auto p-4">
          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={(v) => {
              setActiveTab(v as any)
              if (navigator.vibrate) navigator.vibrate(20)
            }}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 w-full sm:max-w-sm">
              <TabsTrigger value="private" className="relative">
                Pribadi
                {unread.private > 0 && (
                  <span className="absolute -top-1 -right-3 bg-red-500 text-white text-xs rounded-full px-1.5">
                    {unread.private}
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

          {/* List */}
          <div className="mt-4 relative">
            {dragX !== 0 && (
              <div
                className="absolute inset-0 pointer-events-none transition-colors"
                style={{
                  backgroundColor: dragX > 0 ? 'rgba(59,130,246,0.1)' : 'rgba(239,68,68,0.1)',
                }}
              />
            )}

            <AnimatePresence mode="wait" initial={false}>
              {activeTab === 'private' && (
                <motion.div
                  key="private"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.3 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDrag={(e, info) => setDragX(info.offset.x)}
                  onDragEnd={(_, info) => handleSwipe(info.offset.x)}
                  className="space-y-2 relative z-10"
                >
                  {privateChats.map((chat, i) => (
                    <Reveal key={i} delay={i * 0.1} animation="fadeInLeft">
                      <ChatListItem
                        {...chat}
                        index={i}
                        onClick={() => router.push('/app/users/123/chat')}
                      />
                    </Reveal>
                  ))}
                </motion.div>
              )}

              {activeTab === 'group' && (
                <motion.div
                  key="group"
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  transition={{ duration: 0.3 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDrag={(e, info) => setDragX(info.offset.x)}
                  onDragEnd={(_, info) => handleSwipe(info.offset.x)}
                  className="space-y-2 relative z-10"
                >
                  {isLoading ? (
                    // 🟡 Skeleton loading
                    [...Array(4)].map((_, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 border rounded-xl">
                        <Skeleton className="w-12 h-12 rounded-full" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-2/3 mb-2" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                      </div>
                    ))
                  ) : groupChats.length === 0 ? (
                    <div className="text-center text-muted-foreground mt-10">
                      Belum ada grup yang aktif.
                    </div>
                  ) : (
                    groupChats.map((chat, i) => (
                      <Reveal key={i} delay={i * 0.1} animation="fadeInRight">
                        <ChatListItem
                          index={i}
                          {...chat}
                          onClick={async () => {
                            if (!user) return
                            await groupMessageService.markAsRead(
                              chat.id,
                              user.id,
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
        </div>
      </PageWrapper>
      <AppBottombar />
    </>
  )
}
