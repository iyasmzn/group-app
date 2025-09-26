import { useEffect } from "react"
import { useAuth } from "../supabase/auth"

export function useGroupSeen(groupId: string) {
  const { supabase, user } = useAuth()

  useEffect(() => {
    if (!groupId || !user) return
    const update = async () => {
      await supabase.from("group_last_seen").upsert({
        user_id: user.id,
        group_id: groupId,
        last_seen_at: new Date().toISOString(),
      })
    }
    update()
    const interval = setInterval(update, 60000)
    return () => {
      clearInterval(interval)
      update()
    }
  }, [groupId, user])
}
