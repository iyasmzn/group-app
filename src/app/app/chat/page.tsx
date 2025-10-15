"use client"

import { AppBottombar } from "@/components/app/bottombar"
import { AppTopbar } from "@/components/app/topbar"
import PageWrapper from "@/components/page-wrapper"
import { MessageCircle } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChatListItem } from "@/components/app/chat/ChatListItem"
import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Reveal from "@/components/animations/Reveal"
import { useRouter } from "next/navigation"
import { groupService } from "@/services/groupService/groupService"
import { GroupMessage, groupMessageService } from "@/services/groupService/groupMessageService"
import { useRealtimeTable } from "@/lib/hooks/useRealtimeTable"
import { useAuth } from "@/lib/supabase/auth"

type GroupChatItem = {
  id: string
  name: string
  lastMessage: string
  time: string
  unread: number
}

export default function ChatPage() {
  const { user, supabase } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"private" | "group">("private")
  const [dragX, setDragX] = useState(0) // untuk indikator swipe
  const [groupChats, setGroupChats] = useState<GroupChatItem[]>([])


  const unread = { private: 3, group: 7 }

  const privateChats = [
    { name: "Alice", lastMessage: "Hey, apa kabar?", time: "19:45", unread: 2 },
    { name: "Bob", lastMessage: "Oke, besok ketemu ya", time: "18:20", unread: 1 },
  ]

   useEffect(() => {
    async function fetchGroups() {
      const userId = user?.id
      if (!userId) return
      const groups = await groupService.read()
      const messages = await groupMessageService.getLatestByGroups(groups.map((g) => g.id))

      const merged = await Promise.all(
        groups.map(async (g) => {
          const lastMsg = messages.find((m) => m.group_id === g.id)
          const unread = await groupMessageService.getUnreadCount(g.id, userId)

          return {
            id: g.id,
            name: g.name,
            lastMessage: lastMsg?.content ?? "Belum ada pesan",
            time: lastMsg?.createdat
              ? new Date(lastMsg.createdat).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : "",
            unread,
          }
        })
      )

      setGroupChats(merged)
    }
    fetchGroups()
  }, [])


  // realtime update pesan baru
  useRealtimeTable<GroupMessage>({
    supabase,
    table: "group_messages",
    onInsert: (msg) => {
      setGroupChats((prev) =>
        prev.map((chat) =>
          chat.id === msg.group_id
            ? {
                ...chat,
                lastMessage: msg.content,
                time: new Date(msg.createdat).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                unread: chat.unread + 1,
              }
            : chat
        )
      )
    },
  })

  const handleSwipe = (offsetX: number) => {
    if (offsetX < -50 && activeTab === "private") {
      setActiveTab("group")
      if (navigator.vibrate) navigator.vibrate(30) // haptic feedback
    } else if (offsetX > 50 && activeTab === "group") {
      setActiveTab("private")
      if (navigator.vibrate) navigator.vibrate(30)
    }
    setDragX(0)
  }

  return (
    <>
      <AppTopbar
        title="Chat"
        titleIcon={<MessageCircle className="w-6 h-6" />}
      />
      <PageWrapper>
        <div className="max-w-4xl mx-auto p-4">
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
                {unread.group > 0 && (
                  <span className="absolute -top-1 -right-3 bg-red-500 text-white text-xs rounded-full px-1.5">
                    {unread.group}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="mt-4 relative">
            {/* Overlay indikator swipe */}
            {dragX !== 0 && (
              <div
                className="absolute inset-0 pointer-events-none transition-colors"
                style={{
                  backgroundColor:
                    dragX > 0
                      ? "rgba(59,130,246,0.1)" // biru muda saat swipe kanan
                      : "rgba(239,68,68,0.1)", // merah muda saat swipe kiri
                }}
              />
            )}

            <AnimatePresence mode="wait" initial={false}>
              {activeTab === "private" && (
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
                      <ChatListItem {...chat} index={i} onClick={() => router.push('/app/users/123/chat')} />
                    </Reveal>
                  ))}
                </motion.div>
              )}

              {activeTab === "group" && (
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
                  {groupChats.map((chat, i) => (
                    <Reveal key={i} delay={i * 0.1} animation="fadeInRight">
                      <ChatListItem 
                        index={i} 
                        {...chat}
                        onClick={async () => {
                          // update last_seen
                          if (!user) return
                          await groupMessageService.markAsRead(chat.id, user?.id, new Date().toISOString())
                          router.push(`/app/groups/${chat.id}/chat`)
                        }} 
                      />
                    </Reveal>
                  ))}
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