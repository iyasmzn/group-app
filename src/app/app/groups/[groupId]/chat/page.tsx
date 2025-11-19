'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/lib/supabase/auth'
import { supabase } from '@/lib/supabase/client'
import { useParams } from 'next/navigation'
import { ChatShell } from './ChatShell'
import ChatInput from '@/components/app/chat-input'
import { MessageList } from '@/components/ui/message-list'
import { generateId } from '@/lib/utils/helper'
import { useNotifications } from '@/context/notification/NotificationContext'

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
  const { user } = useAuth()
  const { groupId } = useParams()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const { resetCategory } = useNotifications()

  // ✅ Fetch pesan awal (tetap dipanggil walau groupId belum siap)
  useEffect(() => {
    if (!groupId) return
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .rpc('get_group_messages', { gid: groupId })
        .select('id, content, createdat, sender_id, sender')
      if (error) {
        console.log('Fetch messages error:', error)
      } else if (data) {
        setMessages(data as Message[])
      }
    }
    fetchMessages()
    // Reset unread count saat membuka chat
    resetCategory('chat', groupId as string)
  }, [groupId])

  // ✅ Realtime listener
  useEffect(() => {
    if (!groupId || !user?.id) return

    const channel = supabase
      .channel(`group_messages:${groupId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'group_messages',
          filter: `group_id=eq.${groupId}`,
        },
        async (payload) => {
          // Skip pesan dari user sendiri
          if (payload.new.sender_id === user.id) return

          // Ambil pesan baru via RPC
          const { data, error } = await supabase.rpc('get_group_messages', {
            gid: groupId,
            msg_id: payload.new.id,
          })

          if (error) {
            console.error('RPC error:', error)
            return
          }

          if (data && data.length > 0) {
            const msg = data[0] as Message
            setMessages((prev) => {
              if (prev.some((m) => m.id === msg.id)) return prev
              return [...prev, msg]
            })
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [groupId, user?.id])

  // ✅ Kirim pesan
  const handleSend = async () => {
    if (!newMessage.trim() || !user?.id || !groupId) return

    const tempId = generateId()
    const tempMessage: Message = {
      id: tempId,
      content: newMessage,
      createdat: new Date().toISOString(),
      sender_id: user.id,
      sender: {
        id: user.id,
        full_name: user.user_metadata?.full_name || 'You',
        avatar_url: user.user_metadata?.avatar_url || null,
      },
    }

    // Optimistic UI
    setMessages((prev) => [...prev, tempMessage])
    setNewMessage('')

    const { data: inserted, error } = await supabase
      .from('group_messages')
      .insert({
        content: newMessage,
        group_id: groupId,
        sender_id: user.id,
      })
      .select('id')
      .single()

    if (error) {
      console.error(error)
      // rollback jika gagal
      setMessages((prev) => prev.filter((m) => m.id !== tempId))
      return
    }

    // Ambil data lengkap via RPC
    if (inserted) {
      const { data: enriched, error: rpcError } = await supabase.rpc('get_group_messages', {
        gid: groupId,
        msg_id: inserted.id,
      })

      if (rpcError) {
        console.error('RPC error:', rpcError)
        return
      }

      if (enriched && enriched.length > 0) {
        const fullMsg = enriched[0] as Message
        setMessages((prev) => prev.map((m) => (m.id === tempId ? fullMsg : m)))
      }
    }
  }

  // ✅ Sort pesan
  const sortedMessages = useMemo(() => {
    return [...messages].sort(
      (a, b) => new Date(a.createdat).getTime() - new Date(b.createdat).getTime()
    )
  }, [messages])

  // ✅ Render hanya setelah groupId siap
  if (!groupId) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Loading chat...
      </div>
    )
  }

  return (
    <ChatShell
      footer={<ChatInput value={newMessage} onChange={setNewMessage} onSend={handleSend} />}
    >
      <div className="w-full">
        <MessageList
          messages={sortedMessages}
          currentUserId={user?.id}
          height="100%"
          width="100%"
          groupId={groupId as string}
        />
      </div>
    </ChatShell>
  )
}
