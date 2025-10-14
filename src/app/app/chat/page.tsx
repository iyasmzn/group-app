"use client"

import { AppBottombar } from "@/components/app/bottombar"
import { AppTopbar } from "@/components/app/topbar"
import PageWrapper from "@/components/page-wrapper"
import { MessageCircle } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ChatListItem } from "@/components/app/chat/ChatListItem"

export default function ChatPage() {
  const unread = {
    private: 3,
    group: 7,
  }

  // contoh data dummy
  const privateChats = [
    { name: "Alice", lastMessage: "Hey, apa kabar?", time: "19:45", unread: 2 },
    { name: "Bob", lastMessage: "Oke, besok ketemu ya", time: "18:20", unread: 1 },
  ]

  const groupChats = [
    { name: "Frontend Squad", lastMessage: "Push terakhir udah di-merge", time: "17:10", unread: 5 },
    { name: "Family", lastMessage: "Jangan lupa makan malam", time: "16:00", unread: 2 },
  ]

  return (
    <>
      <AppTopbar
        title="Chat"
        titleIcon={<MessageCircle className="w-6 h-6" />}
      />
      <PageWrapper>
        <div className="max-w-4xl mx-auto p-4">
          <Tabs defaultValue="private" className="w-full">
            <TabsList className="grid grid-cols-2 w-full max-w-sm">
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

            <TabsContent value="private" className="mt-4">
              {privateChats.map((chat, i) => (
                <ChatListItem key={i} {...chat} />
              ))}
            </TabsContent>

            <TabsContent value="group" className="mt-4">
              {groupChats.map((chat, i) => (
                <ChatListItem key={i} {...chat} />
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </PageWrapper>
      <AppBottombar />
    </>
  )
}