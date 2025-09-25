"use client"

import { useEffect, useState } from "react"
import { redirect, useParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/supabase/auth"
import Reveal from "@/components/animations/Reveal"
import GroupTopbar from "../components/group-topbar"
import { Paperclip, Send, Smile } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRealtimeTable } from "@/lib/hooks/useRealtimeTable"
import { toast } from "sonner"
import ChatInput from "@/components/app/chat-input"
import { GroupAvatar } from "@/components/group-avatar"

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

export default function GroupChatPage() {
  const { supabase, user } = useAuth()
  const { groupId } = useParams()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")

  if (!user) {
    toast.error('User invalid. Please re-Login.')
    redirect('/')
  }

  // fetch messages awal
  useEffect(() => {
    if (!groupId) return
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("group_messages")
        .select(`
          id,
          content,
          createdat,
          sender_id,
          sender:profiles!group_messages_sender_id_fkey (
            id,
            full_name,
            avatar_url
          )
        `)
        .eq("group_id", groupId)
        .order("createdat", { ascending: true })

      if (!error && Array.isArray(data)) setMessages(data as unknown as Message[])
    }

    fetchMessages()
  }, [groupId, supabase])

  // subscribe realtime pakai hook
  useRealtimeTable<Message>({
    supabase,
    table: "group_messages",
    filter: `group_id=eq.${groupId}`,

    onInsert: async (msg) => {
      console.log('onInsert', msg)
      // ambil profile pengirim
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .eq("id", msg.sender_id)
        .single()

      if (!profile) return;

      const messageWithProfile = {
        ...msg,
        sender: profile,
      }

      setMessages((prev) =>
        [...prev, messageWithProfile].sort(
          (a, b) => new Date(a.createdat).getTime() - new Date(b.createdat).getTime()
        )
      )
    },
    onUpdate: (msg) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, ...msg } : m))
      )
    },
    onDelete: (msg) => {
      setMessages((prev) => prev.filter((m) => m.id !== msg.id))
    },
  })

  // kirim pesan
  const handleSend = async () => {
    if (!newMessage.trim()) return

    const tempId = crypto.randomUUID()

    // buat pesan sementara
    const tempMessage: Message = {
      id: tempId,
      content: newMessage,
      createdat: new Date().toISOString(),
      sender_id: user.id,
      sender: {
        id: user.id,
        full_name: user?.user_metadata?.full_name || "You",
        avatar_url: user?.user_metadata?.avatar_url || null,
      },
    }

    // update state dulu
    setMessages((prev) => [...prev, tempMessage])
    setNewMessage("")

    // kirim ke supabase
    const { data, error } = await supabase
      .from("group_messages")
      .insert({
        content: newMessage,
        group_id: groupId,
        sender_id: user?.id,
      })
      .select(
        `
        id,
        content,
        createdat,
        sender_id,
        sender:profiles!group_messages_sender_id_fkey (
          id,
          full_name,
          avatar_url
        )
      `
      )
      .single()

    if (error) {
      console.error(error)
      // rollback kalau gagal
      setMessages((prev) => prev.filter((m) => m.id !== tempId))
    } else if (data) {
      // replace pesan sementara dengan pesan asli dari supabase
      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? (data as unknown as Message) : m))
      )
    }
  }

  return (
    <>
      <GroupTopbar backHref="dashboard" />
      <div className="flex flex-col">
        {/* Chat messages */}
        <div className="flex-1 space-y-4">
          {messages.map((msg) => {
            const isOwn = msg.sender_id === user?.id
            const initials =
              msg.sender?.full_name
                ?.split(" ")
                .slice(0, 2)
                .map((w) => w[0])
                .join("") || "U"

            return (
              <Reveal key={msg.id} delay={0.1}>
                <div
                  className={cn(
                    "flex items-end gap-2",
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
                      "max-w-[70%] px-4 py-2 rounded-lg text-sm shadow",
                      isOwn
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-muted text-foreground rounded-bl-none"
                    )}
                  >
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
            )
          })}
          <div className="h-20" /> {/* spacer for bottom bar */}
        </div>

        {/* Input */}
        <ChatInput
          value={newMessage}
          onChange={setNewMessage}
          onSend={handleSend}
        />
      </div>
    </>
  )
}