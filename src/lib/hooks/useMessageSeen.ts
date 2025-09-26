// lib/hooks/useMessageSeen.ts
import { useEffect } from "react"
import { useAuth } from "@/lib/supabase/auth"

export function useMessageSeen(
  groupId: string,
  messagesEndRef: React.RefObject<HTMLDivElement | null>
) {
  const { supabase, user } = useAuth()

  useEffect(() => {
    if (!messagesEndRef?.current || !groupId || !user) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        // bungkus di async IIFE
        (async () => {
          await supabase
            .from("group_last_seen")
            .upsert(
              {
                user_id: user.id,
                group_id: groupId,
                message_last_seen_at: new Date().toISOString(),
              }
            )
            .select()
        })()
      }
    }, { threshold: 1.0 })

    observer.observe(messagesEndRef.current)
    return () => observer.disconnect()
  }, [messagesEndRef, groupId, user])
}