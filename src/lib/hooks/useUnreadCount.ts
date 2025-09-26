import { useRealtimeCount } from "./useRealtimeCount"
import { useAuth } from "@/lib/supabase/auth"

export function useUnreadCount(groupId?: string) {
  const { supabase, user } = useAuth()

  return useRealtimeCount({
    table: "group_messages",
    filter: groupId ? `group_id=eq.${groupId}` : undefined,
    countQuery: async () => {
      if (!groupId || !user) return 0
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
      return count || 0
    },
  })
}