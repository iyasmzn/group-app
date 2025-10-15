'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/supabase/auth'
import { supabase } from '@/lib/supabase/client'
import { useParams } from 'next/navigation'
import { ChatShell } from './ChatShell'
import ChatInput from '@/components/app/chat-input'
import { MessageList } from '@/components/ui/message-list'
import { generateId } from '@/lib/utils/helper'

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

  if (!groupId) return null // ✅ fallback jika groupId belum ada

  // ✅ Fetch pesan awal
  useEffect(() => {
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
  }, [groupId])

  // ✅ Realtime listener
  useEffect(() => {
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
          // Skip pesan dari user sendiri (sudah ditangani optimistic + RPC di handleSend)
          if (payload.new.sender_id === user?.id) return

          // Ambil pesan baru via RPC agar sudah include profil
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

  // ✅ Send message
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

    setMessages((prev) => [...prev, tempMessage])
    setNewMessage('')

    // 1. Insert pesan baru (cukup ambil id saja)
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
      // rollback temp message
      setMessages((prev) => prev.filter((m) => m.id !== tempId))
      return
    }

    // 2. Ambil pesan lengkap via RPC (sudah include profil)
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

  // ✅ Sort messages sebelum render
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.createdat).getTime() - new Date(b.createdat).getTime()
  )
  console.log('sortedMessages', sortedMessages)

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
        />
      </div>
    </ChatShell>
  )
}
