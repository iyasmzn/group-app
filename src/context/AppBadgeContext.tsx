'use client'

import { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { groupMessageService } from '@/services/groupService/groupMessageService'
import { Profile } from '@/types/profile'
import { useProfile } from '@/lib/hooks/useProfile'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'

type AppBadgeContextType = {
  supabase: typeof supabase
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
  profileLoading: false,
})

export function AppBadgeProvider({ children }: { children: React.ReactNode }) {
  const { user, profile, loading: profileLoading } = useProfile()
  const [groupUnreadMap, setGroupUnreadMap] = useState<Record<string, number>>({})

  // TTL untuk refresh
  let lastRefresh = 0
  async function refresh() {
    if (!user) return
    const now = Date.now()
    if (now - lastRefresh < 10000) return
    lastRefresh = now

    const { data: unreadList } = await supabase.rpc('get_unread_counts', { uid: user.id })
    type UnreadEntry = { group_id: string; unread_count: number }

    const map = Object.fromEntries(
      (unreadList as UnreadEntry[]).map((r: UnreadEntry) => [r.group_id, r.unread_count])
    )
    setGroupUnreadMap(map)
  }

  useEffect(() => {
    refresh()
  }, [user?.id])

  // debounce untuk update per grup
  const debounceMap = new Map<string, NodeJS.Timeout>()
  async function updateGroupUnread(groupId: string) {
    if (!user) return
    if (debounceMap.has(groupId)) clearTimeout(debounceMap.get(groupId)!)
    const timeout = setTimeout(async () => {
      const { data: count } = await supabase.rpc('get_unread_count_for_group', {
        uid: user.id,
        gid: groupId,
      })
      setGroupUnreadMap((prev) => ({ ...prev, [groupId]: count ?? 0 }))
    }, 500)
    debounceMap.set(groupId, timeout)
  }

  // realtime listener
  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel('realtime:group_messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'group_messages' },
        (payload) => {
          const msg = payload.new as { group_id: string; sender_id: string }
          if (msg.sender_id !== user.id) {
            updateGroupUnread(msg.group_id)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user?.id])

  function resetGroupUnread(groupId: string) {
    setGroupUnreadMap((prev) => ({ ...prev, [groupId]: 0 }))
  }

  const groups = useMemo(
    () => Object.values(groupUnreadMap).reduce((a, b) => a + b, 0),
    [groupUnreadMap]
  )
  const chat = groups // + privateUnread kalau ada

  return (
    <AppBadgeContext.Provider
      value={{
        supabase,
        user,
        chat,
        groups,
        groupUnreadMap,
        refresh,
        resetGroupUnread,
        profile,
        profileLoading,
      }}
    >
      {children}
    </AppBadgeContext.Provider>
  )
}

export function useAppBadges() {
  return useContext(AppBadgeContext)
}
