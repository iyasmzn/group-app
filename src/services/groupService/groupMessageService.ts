// services/groupMessageService.ts
import { supabase } from "@/lib/supabase/client"

export type GroupMessage = {
  id: string
  group_id: string
  sender_id: string
  content: string
  createdat: string
}

export const groupMessageService = {
  async getLatestByGroups(groupIds: string[]) {
    const { data, error } = await supabase
      .from("group_messages")
      .select("group_id, content, createdat")
      .in("group_id", groupIds)
      .order("createdat", { ascending: false })

    if (error) throw error
    return data as GroupMessage[]
  },
  
  async getUnreadCount(groupId: string, userId: string) {
    // ambil record last_seen
    const { data: seenRow, error: seenError } = await supabase
      .from("group_last_seen")
      .select("message_last_seen_at")
      .eq("group_id", groupId)
      .eq("user_id", userId)
      .maybeSingle()

    if (seenError) throw seenError
    // kalau belum ada record, anggap semua pesan unread
    if (!seenRow || !seenRow.message_last_seen_at) {
      const { count } = await supabase
        .from("group_messages")
        .select("id", { count: "exact", head: true })
        .eq("group_id", groupId)
      return count ?? 0
    }

    // kalau ada record, hitung pesan setelah message_last_seen_at
    const { count, error } = await supabase
      .from("group_messages")
      .select("id", { count: "exact", head: true })
      .eq("group_id", groupId)
      .neq("sender_id", userId)
      .gt("createdat", seenRow.message_last_seen_at)

    if (error) throw error
    return count ?? 0
  },

  async markAsRead(groupId: string, userId: string, lastMessageAt: string) {
    // update atau insert record last_seen
    const { error } = await supabase
      .from("group_last_seen")
      .upsert({
        group_id: groupId,
        user_id: userId,
        last_seen_at: new Date().toISOString(),
        message_last_seen_at: lastMessageAt,
      })
    if (error) throw error
    return true
  },

}