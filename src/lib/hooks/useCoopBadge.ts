import { useAuth } from "../supabase/auth"
import { useRealtimeCount } from "./useRealtimeCount"

export function useCoopBadge(groupId?: string) {
  const { supabase } = useAuth()
  return useRealtimeCount({
    table: "group_coop_loans",
    filter: groupId ? `group_id=eq.${groupId}` : undefined,
    countQuery: async () => {
      if (!groupId) return 0
      const { count } = await supabase
        .from("group_coop_loans")
        .select("id", { count: "exact", head: true })
        .eq("group_id", groupId)
        .eq("status", "active")
      return count || 0
    },
  })
}