"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { groupMessageService } from "@/services/groupService/groupMessageService"
import { Profile } from "@/types/profile"
import { useProfile } from "@/lib/hooks/useProfile"
import { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase/client"

type AppBadgeContextType = {
  supabase: typeof supabase,
  user: User | null
  chat: number
  groups: number
  groupUnreadMap: Record<string, number>
  refresh: () => Promise<void>
  resetGroupUnread: (groupId: string) => void 
  profile: Profile | null
  profileLoading: boolean
}

const AppBadgeContext = createContext<AppBadgeContextType>({
  supabase,
  user: null,
  chat: 0,
  groups: 0,
  groupUnreadMap: {},
  refresh: async () => {},
  resetGroupUnread: () => {},
  profile: null,
  profileLoading: false
})

export function AppBadgeProvider({ children }: { children: React.ReactNode }) {
  const { user, profile, loading: profileLoading } = useProfile()
  const [groupUnreadMap, setGroupUnreadMap] = useState<Record<string, number>>({})

  // fungsi fetch awal unread
  async function refresh() {
    if (!user) return
    const { data: groupList } = await supabase.from("groups")
      .select("id, group_members!inner(user_id)")
      .eq("group_members.user_id", user.id)
    if (!groupList) return

    const map: Record<string, number> = {}
    let total = 0
    for (const g of groupList) {
      const count = await groupMessageService.getUnreadCount(g.id, user.id)
      map[g.id] = count
      total += count
    }
    setGroupUnreadMap(map)
  }

  useEffect(() => {
    refresh()
  }, [user?.id])

  // realtime listener
  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel("realtime:group_messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "group_messages" },
        async (payload) => {
          const msg = payload.new as { group_id: string; sender_id: string; createdat: string }
          if (msg.sender_id !== user.id) {
            // hitung ulang unread untuk grup ini saja
            const count = await groupMessageService.getUnreadCount(msg.group_id, user.id)
            setGroupUnreadMap((prev) => {
              const updated = { ...prev, [msg.group_id]: count }
              return updated
            })
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user?.id])

  // di AppBadgeProvider
  function resetGroupUnread(groupId: string) {
    setGroupUnreadMap((prev) => {
      const updated = { ...prev, [groupId]: 0 }
      return updated
    })
    // otomatis groups = sum dari map → ikut nol kalau semua sudah dibaca
  }

  // total unread groups = sum dari map
  const groups = Object.values(groupUnreadMap).reduce((a, b) => a + b, 0)
  const chat = groups // + privateUnread kalau ada

  return (
    <AppBadgeContext.Provider value={{ 
      supabase,
      user,
      chat, 
      groups, 
      groupUnreadMap, 
      refresh, 
      resetGroupUnread,
      profile,
      profileLoading
    }}>
      {children}
    </AppBadgeContext.Provider>
  )
}

export function useAppBadges() {
  return useContext(AppBadgeContext)
}