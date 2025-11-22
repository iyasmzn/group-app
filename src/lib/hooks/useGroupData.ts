import { useCallback, useEffect, useState } from "react"
import { useAuth } from "@/lib/supabase/auth"
import { GroupData } from "@/types/group.type"
import { useNotifications } from "@/context/notification/NotificationContext"
import { groupService } from "@/services/groupService/groupService"

export type LastGroupState = {
  id: string
  name: string
  image_url: string | null
  last_seen_at: string | null
  message_last_seen_at: string | null
  unreadCount: number
  joinedate: string | null
}


export function useGroupData(groupId?: string) {
  const { supabase } = useAuth()
  const [groupData, setGroupData] = useState<GroupData | null>(null)

  useEffect(() => {
    if (!groupId) return

    const fetchGroup = async () => {
      const { data, error } = await supabase
        .from("groups")
        .select("*, group_members(*)")
        .eq("id", groupId)
        .single()
      if (!error) setGroupData(data)
    }

    fetchGroup()

    // ✅ subscribe ke perubahan group_members
    const channel = supabase
      .channel(`group-members-${groupId}`)
      .on(
        "postgres_changes",
        {
          event: "*", // insert, update, delete
          schema: "public",
          table: "group_members",
          filter: `group_id=eq.${groupId}`,
        },
        () => {
          // refetch data kalau ada perubahan
          fetchGroup()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [groupId, supabase])

  return groupData
}

export function useLastGroup(userId?: string) {
  const { unread } = useNotifications()
  const [lastGroup, setLastGroup] = useState<LastGroupState | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchLastGroup = useCallback(async () => {
    if (!userId) return
    setLoading(true)

    const g = await groupService.getLastGroupByUser(userId)

    if (g) {
      const lastSeenAt = g.group_last_seen?.[0]?.message_last_seen_at ?? null
      const unreadCount = unread.chat[g.id] ?? 0

      setLastGroup({
        id: g.id,
        name: g.name,
        image_url: g.image_url,
        last_seen_at: g.group_last_seen?.[0]?.last_seen_at ?? null,
        message_last_seen_at: lastSeenAt,
        unreadCount,
        joinedate: g.group_members[0]?.joinedat ?? null,
      })
    }

    setLoading(false)
  }, [userId, unread])

  useEffect(() => {
    if (userId) fetchLastGroup()
  }, [userId, fetchLastGroup])

  return { lastGroup, loading }
}
