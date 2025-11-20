'use client'

import { useState, useRef, useMemo, useEffect } from 'react'
import { NotificationContext } from './NotificationContext'
import { NotificationMap, NotificationCategory } from './notificationTypes'
import { supabase } from '@/lib/supabase/client'
import { useRealtime } from '@/lib/hooks/useRealtime'
import { useProfile } from '@/lib/hooks/useProfile'

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useProfile()

  const [unread, setUnread] = useState<NotificationMap>({
    chat: {},
    coop: {},
    approval: {},
    finance: {},
  })

  const debounceRef = useRef<Map<string, NodeJS.Timeout>>(new Map())

  async function refreshCategory(category: NotificationCategory, id: string) {
    if (!user) return

    if (debounceRef.current.has(id)) clearTimeout(debounceRef.current.get(id)!)

    const timeout = setTimeout(async () => {
      const rpcMap = {
        chat: 'get_unread_count_for_group',
        coop: 'get_coop_notif_count',
        approval: 'get_approval_notif_count',
        finance: 'get_finance_notif_count',
      }

      // Use type assertion to bypass strict typing (temporary fix)
      const { data: count } = await supabase.rpc(rpcMap[category] as any, {
        uid: user.id,
        gid: id,
      })

      setUnread((prev) => ({
        ...prev,
        [category]: { ...prev[category], [id]: count ?? 0 },
      }))
      console.log(`Refreshed ${category} count for ${id}: ${count}`)
    }, 400)

    debounceRef.current.set(id, timeout)
    console.log(`Scheduled refresh for ${category} in ${id}`)
  }

  function resetCategory(category: NotificationCategory, id: string) {
    if (debounceRef.current.has(id)) {
      clearTimeout(debounceRef.current.get(id)!)
      debounceRef.current.delete(id)
    }
    setUnread((prev) => ({
      ...prev,
      [category]: { ...prev[category], [id]: 0 },
    }))
  }

  // Realtime Listeners...
  useRealtime<{ group_id: string; sender_id: string }>({
    supabase,
    type: 'postgres_changes',
    table: 'group_messages',
    onInsert: (msg) => {
      if (msg.sender_id !== user?.id) refreshCategory('chat', msg.group_id)
    },
  })

  useRealtime<{ group_id: string }>({
    supabase,
    type: 'postgres_changes',
    table: 'group_coop_loans',
    onInsert: (loan) => refreshCategory('coop', loan.group_id),
    onUpdate: (loan) => refreshCategory('coop', loan.group_id),
  })

  useRealtime<{ group_id: string }>({
    supabase,
    type: 'postgres_changes',
    table: 'group_coop_repayments',
    onInsert: (payment) => refreshCategory('coop', payment.group_id),
  })

  useRealtime<{ group_id: string }>({
    supabase,
    type: 'postgres_changes',
    table: 'group_approvals',
    onInsert: (appr) => refreshCategory('approval', appr.group_id),
    onUpdate: (appr) => refreshCategory('approval', appr.group_id),
  })

  useRealtime<{ group_id: string }>({
    supabase,
    type: 'postgres_changes',
    table: 'group_coop_ledger',
    onInsert: (entry) => refreshCategory('finance', entry.group_id),
  })

  // 🆕 — helper maps agar mudah digunakan
  const groupUnreadMap = unread.chat
  const coopNotifMap = unread.coop
  const approvalNotifMap = unread.approval
  const financeNotifMap = unread.finance

  const totalCount = useMemo(() => {
    return Object.values(unread)
      .flatMap(Object.values)
      .reduce((a, b) => a + b, 0)
  }, [unread])

  useEffect(() => {
    async function loadInitialUnread() {
      if (!user) return
      const { data, error } = await supabase.rpc('get_all_unread_for_user', { uid: user.id })

      if (error) {
        console.error('Failed to load initial unread:', error)
        return
      }

      if (data && Array.isArray(data)) {
        const chatMap: Record<string, number> = {}

        data.forEach((row) => {
          chatMap[row.group_id] = row.unread_count ?? 0
        })

        setUnread((prev) => ({
          ...prev,
          chat: chatMap, // only chat loaded initially
        }))
      }
    }

    loadInitialUnread()
  }, [user])

  return (
    <NotificationContext.Provider
      value={{
        supabase,
        unread,
        groupUnreadMap,
        coopNotifMap,
        approvalNotifMap,
        financeNotifMap,
        refreshCategory,
        resetCategory,
        totalCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}
