import { useRealtimeCount } from "./useRealtimeCount"
import { supabase } from "../supabase/client"

export function useAssetBadge(groupId?: string) {
  return useRealtimeCount({
    table: "group_assets",
    filter: groupId ? `group_id=eq.${groupId}` : undefined,
    countQuery: async () => {
      if (!groupId) return 0
      const { count } = await supabase
        .from("group_assets")
        .select("id", { count: "exact", head: true })
        .eq("group_id", groupId)
        .eq("status", "maintenance")
      return count || 0
    },
  })
}