"use client"

import { useEffect, useRef, useState } from "react"
import { redirect, useParams } from "next/navigation"
import { useAuth } from "@/lib/supabase/auth"
import Reveal from "@/components/animations/Reveal"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import ChatInput from "@/components/app/chat-input"
import { GroupAvatar } from "@/components/group-avatar"
import { formatDateDivider } from "@/lib/utils/format"
import { ChatShell } from "./ChatShell"
import { AnimatePresence } from "framer-motion"

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

export default function PrivateChatPage() {
  const { user } = useAuth()
  const { userId } = useParams()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Halo, apa kabar?",
      createdat: new Date().toISOString(),
      sender_id: "other",
      sender: { id: "other", full_name: "Alice", avatar_url: null },
    },
    {
      id: "2",
      content: "Baik, gimana kamu?",
      createdat: new Date().toISOString(),
      sender_id: "me",
      sender: { id: "me", full_name: "You", avatar_url: null },
    },
  ])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  if (!user) {
    toast.error("User invalid. Please re-Login.")
    redirect("/")
  }

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isTyping])

  // simulasi lawan bicara mengetik (demo)
  useEffect(() => {
    const timer = setInterval(() => {
      setIsTyping(true)
      setTimeout(() => setIsTyping(false), 5000)
    }, 8000) // setiap 8 detik muncul "typing..."
    return () => clearInterval(timer)
  }, [])

  const handleSend = () => {
    if (!newMessage.trim()) return

    const tempMessage: Message = {
      id: crypto.randomUUID(),
      content: newMessage,
      createdat: new Date().toISOString(),
      sender_id: "me",
      sender: {
        id: "me",
        full_name: user?.user_metadata?.full_name || "You",
        avatar_url: user?.user_metadata?.avatar_url || null,
      },
    }

    setMessages((prev) => [...prev, tempMessage])
    setNewMessage("")
  }

  return (
    <ChatShell
      footer={
        <ChatInput
          value={newMessage}
          onChange={setNewMessage}
          onSend={handleSend}
        />
      }
    >
      <div className="flex flex-col p-2 md:p-6">
        <div className="flex-1 space-y-4">
          {messages.map((msg, idx) => {
            const isOwn = msg.sender_id === "me"
            const prevMsg = messages[idx - 1]
            const showDivider =
              !prevMsg ||
              new Date(prevMsg.createdat).toDateString() !==
                new Date(msg.createdat).toDateString()

            return (
              <div key={msg.id}>
                {showDivider && (
                  <div className="flex justify-center my-4">
                    <span className="px-3 py-1 text-xs rounded-full bg-muted text-muted-foreground">
                      {formatDateDivider(msg.createdat)}
                    </span>
                  </div>
                )}

                <Reveal delay={0.1}>
                  <div
                    className={cn(
                      "flex items-start gap-2",
                      isOwn ? "justify-end" : "justify-start"
                    )}
                  >
                    {!isOwn && msg.sender?.full_name && (
                      <GroupAvatar
                        image={msg.sender?.avatar_url || ""}
                        name={msg.sender?.full_name}
                        size="sm"
                      />
                    )}

                    <div
                      className={cn(
                        "max-w-[70%] px-4 py-2 rounded-xl text-sm shadow",
                        isOwn
                          ? "bg-primary text-primary-foreground rounded-tr-none"
                          : "bg-muted text-foreground rounded-tl-none"
                      )}
                    >
                      {!isOwn && (
                        <p className="text-xs text-secondary-foreground mb-2">
                          {msg.sender?.full_name}
                        </p>
                      )}
                      <p>{msg.content}</p>
                      <span className="block text-[10px] text-muted-foreground mt-1 text-right">
                        {new Date(msg.createdat).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </Reveal>
              </div>
            )
          })}

          {/* Typing indicator */}{/* Typing indicator */}
          <AnimatePresence mode="wait">
            {isTyping && (
              <Reveal duration={0.3} distance={10} exit className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
                <GroupAvatar name="Alice" size="sm" />
                <div className="bg-muted px-3 py-2 rounded-xl">
                  <span className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300"></span>
                  </span>
                </div>
              </Reveal>
            )}
          </AnimatePresence>
          <div className="h-14"></div>
          <div ref={messagesEndRef} />
        </div>
      </div>
    </ChatShell>
  )
}