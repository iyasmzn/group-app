import { useEffect } from "react"
import { useAuth } from "@/lib/supabase/auth"
import { useAppBadges } from "@/context/AppBadgeContext"

export function useMessageSeen(
  groupId: string,
  messagesEndRef: React.RefObject<HTMLDivElement | null>
) {
  const { supabase, user } = useAuth()
  const { resetGroupUnread } = useAppBadges()

  useEffect(() => {
    if (!messagesEndRef?.current || !groupId || !user) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        (async () => {
          await supabase
            .from("group_last_seen")
            .upsert({
              user_id: user.id,
              group_id: groupId,
              message_last_seen_at: new Date().toISOString(),
            })
            .select()

          // setelah DB update, reset badge global
          resetGroupUnread(groupId)
        })()
      }
    }, { threshold: 1.0 })

    observer.observe(messagesEndRef.current)
    return () => observer.disconnect()
  }, [messagesEndRef, groupId, user, supabase, resetGroupUnread])
}