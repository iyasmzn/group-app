"use client"

import { AppBottombar } from "@/components/app/bottombar"
import { AppTopbar } from "@/components/app/topbar"
import PageWrapper from "@/components/page-wrapper"
import { MessageCircle } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChatListItem } from "@/components/app/chat/ChatListItem"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Reveal from "@/components/animations/Reveal"

export default function ChatPage() {
  const [activeTab, setActiveTab] = useState<"private" | "group">("private")
  const [dragX, setDragX] = useState(0) // untuk indikator swipe

  const unread = { private: 3, group: 7 }

  const privateChats = [
    { name: "Alice", lastMessage: "Hey, apa kabar?", time: "19:45", unread: 2 },
    { name: "Bob", lastMessage: "Oke, besok ketemu ya", time: "18:20", unread: 1 },
  ]

  const groupChats = [
    { name: "Frontend Squad", lastMessage: "Push terakhir udah di-merge", time: "17:10", unread: 5 },
    { name: "Family", lastMessage: "Jangan lupa makan malam", time: "16:00", unread: 2 },
  ]

  // arah dibalik: swipe kiri -> group, swipe kanan -> private
  const handleSwipe = (offsetX: number) => {
    if (offsetX < -50 && activeTab === "private") {
      setActiveTab("group")
    } else if (offsetX > 50 && activeTab === "group") {
      setActiveTab("private")
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
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
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

          <div className="mt-4 relative overflow-hidden">
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
                    <Reveal delay={i * 0.1} animation="fadeInLeft">
                      <ChatListItem key={i} {...chat} index={i} />
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
                    <Reveal delay={i * 0.1} animation="fadeInRight">
                      <ChatListItem key={i} {...chat} index={i} />
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