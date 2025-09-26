import { useAuth } from "../supabase/auth"
import { useRealtimeCount } from "./useRealtimeCount"

export function useFinanceBadge(groupId?: string) {
  const { supabase } = useAuth()
  return useRealtimeCount({
    table: "group_event_contributions",
    filter: groupId ? `event_id=eq.${groupId}` : undefined,
    countQuery: async () => {
      if (!groupId) return 0
      const { count } = await supabase
        .from("group_event_contributions")
        .select("id", { count: "exact", head: true })
        .is("paid_at", null)
      return count || 0
    },
  })
}