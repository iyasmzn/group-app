import { SupabaseClient } from '@supabase/supabase-js'

export type NotificationCategory = 'chat' | 'coop' | 'approval' | 'finance'

// NotificationMap: category -> (groupId -> count)
export type NotificationMap = Record<NotificationCategory, Record<string, number>>

export interface NotificationContextType {
  supabase: SupabaseClient
  unread: NotificationMap

  // helper maps (convenience) — tiap satu sama dengan unread.chat / unread.coop dll
  groupUnreadMap: Record<string, number>
  coopNotifMap: Record<string, number>
  approvalNotifMap: Record<string, number>
  financeNotifMap: Record<string, number>

  /** Refresh only one category in a specific group */
  refreshCategory: (category: NotificationCategory, id: string) => Promise<void>

  /** Reset unread for one group in specific category */
  resetCategory: (category: NotificationCategory, id: string) => void

  /** Total unread count across all categories */
  totalCount: number
}
