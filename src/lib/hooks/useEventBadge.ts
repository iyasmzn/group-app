import { useEffect, useState } from "react"
import { supabase } from "../supabase/client"

export function useEventBadge(groupId?: string) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!groupId) return
    const fetchCount = async () => {
      const { count } = await supabase
        .from("group_event_tasks")
        .select("id", { count: "exact", head: true })
        .eq("status", "todo")
        .eq("event_id.group_id", groupId) // join-like filter
      setCount(count || 0)
    }
    fetchCount()
  }, [groupId, supabase])

  return count
}