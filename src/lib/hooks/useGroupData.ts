// lib/hooks/useGroupData.ts
import { useEffect, useState } from "react"
import { useAuth } from "@/lib/supabase/auth"
import { GroupData } from "@/types/group"

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