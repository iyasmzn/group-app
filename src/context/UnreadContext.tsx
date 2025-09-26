"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "@/lib/supabase/auth"

const UnreadContext = createContext<number>(0)

export function UnreadProvider({ groupId, children }: { groupId: string; children: React.ReactNode }) {
  const { supabase, user } = useAuth()
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!groupId || !user) return

    const fetchUnread = async () => {
      const { data: lastSeen } = await supabase
        .from("group_last_seen")
        .select("message_last_seen_at")
        .eq("group_id", groupId)
        .eq("user_id", user.id)
        .single()

      const since = lastSeen?.message_last_seen_at || "1970-01-01"
      const { count } = await supabase
        .from("group_messages")
        .select("id", { count: "exact", head: true })
        .eq("group_id", groupId)
        .gt("createdat", since)

      setCount(count || 0)
    }

    fetchUnread()

    const channel = supabase
      .channel(`group-messages-${groupId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "group_messages", filter: `group_id=eq.${groupId}` },
        () => fetchUnread()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [groupId, user, supabase])

  return <UnreadContext.Provider value={count}>{children}</UnreadContext.Provider>
}

export function useUnreadContext() {
  return useContext(UnreadContext)
}