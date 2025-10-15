'use client'

import { useEffect, useRef } from 'react'
import { useAuth } from '@/lib/supabase/auth'
import { useAppBadges } from '@/context/AppBadgeContext'

type Mode = 'once' | 'debounce'

export function useMessageSeen(
  groupId: string,
  messagesEndRef: React.RefObject<HTMLDivElement | null>,
  mode: Mode = 'debounce', // default debounce
  debounceMs: number = 2000
) {
  const { supabase, user } = useAuth()
  const { resetGroupUnread } = useAppBadges()
  const hasUpdatedRef = useRef(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!messagesEndRef?.current || !groupId || !user) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (mode === 'once') {
            if (hasUpdatedRef.current) return
            hasUpdatedRef.current = true
            ;(async () => {
              await supabase.from('group_last_seen').upsert({
                user_id: user.id,
                group_id: groupId,
                message_last_seen_at: new Date().toISOString(),
              })
              resetGroupUnread(groupId)
            })()
          } else if (mode === 'debounce') {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
            timeoutRef.current = setTimeout(async () => {
              await supabase.from('group_last_seen').upsert({
                user_id: user.id,
                group_id: groupId,
                message_last_seen_at: new Date().toISOString(),
              })
              resetGroupUnread(groupId)
            }, debounceMs)
          }
        }
      },
      { threshold: 1.0 }
    )

    observer.observe(messagesEndRef.current)

    return () => {
      observer.disconnect()
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [messagesEndRef, groupId, user, supabase, resetGroupUnread, mode, debounceMs])
}
