"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { groupMessageService } from "@/services/groupService/groupMessageService"

export function useUnreadCounts(userId?: string) {
  const [privateUnread, setPrivateUnread] = useState(0)
  const [groupUnread, setGroupUnread] = useState(0)

  // fetch awal
  useEffect(() => {
    if (!userId) return

    async function fetchUnread() {
      // contoh: ambil semua group user
      const { data: groups } = await supabase.from("groups").select("id")
      if (!groups) return

      let total = 0
      for (const g of groups) {
        const count = await groupMessageService.getUnreadCount(g.id, userId as string)
        total += count
      }
      setGroupUnread(total)

      // TODO: privateUnread nanti kalau tabel private_messages sudah ada
      setPrivateUnread(0)
    }

    fetchUnread()
  }, [userId])

  // realtime update
  useEffect(() => {
    if (!userId) return

    const channel = supabase
      .channel("realtime:group_messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "group_messages" },
        async (payload) => {
          const msg = payload.new
          // kalau bukan pesan dari user sendiri → increment unread
          if (msg.sender_id !== userId) {
            setGroupUnread((prev) => prev + 1)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  return { privateUnread, groupUnread }
}