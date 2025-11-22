import { useAuth } from '@/context/AuthContext'
import { useEffect, useRef } from 'react'
import { supabase } from '../supabase/client'

export function useGroupSeen(groupId: string) {
  const { user } = useAuth()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isUnmountingRef = useRef(false)

  useEffect(() => {
    if (!groupId || !user?.id) return

    const updateSeen = async () => {
      if (isUnmountingRef.current) return
      try {
        await supabase.from('group_last_seen').upsert({
          user_id: user.id,
          group_id: groupId,
          last_seen_at: new Date().toISOString(),
        })
      } catch (err) {
        console.error('Failed to update group_last_seen:', err)
      }
    }

    // Initial update
    updateSeen()

    // Set interval every 60s
    intervalRef.current = setInterval(updateSeen, 60000)

    return () => {
      isUnmountingRef.current = true
      if (intervalRef.current) clearInterval(intervalRef.current)
      updateSeen() // final update on unmount
    }
  }, [groupId, user?.id])
}
