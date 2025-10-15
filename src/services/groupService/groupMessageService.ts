// services/groupMessageService.ts
import { supabase } from "@/lib/supabase/client"

export type GroupMessage = {
  id: string
  group_id: string
  sender_id: string
  content: string
  createdat: string
}

export type GroupChatItem = {
  id: string
  name: string
  lastMessage: string
  lastCreatedAt: string
  unread: number
}

export const groupMessageService = {
  async getLatestByGroups(groupIds: string[], userId: string) {
    // ambil semua pesan terbaru per grup
    const { data, error } = await supabase
      .from("group_messages")
      .select("group_id, content, createdat, sender_id")
      .in("group_id", groupIds)
      .order("createdat", { ascending: false })

    if (error) throw error

    // ambil hanya pesan terbaru per grup
    const latestMap = new Map<string, { content: string; createdat: string }>()
    for (const msg of data ?? []) {
      if (!latestMap.has(msg.group_id)) {
        latestMap.set(msg.group_id, {
          content: msg.content,
          createdat: msg.createdat,
        })
      }
    }

    // hitung unread per grup
    const result: GroupChatItem[] = []
    for (const groupId of groupIds) {
      const last = latestMap.get(groupId)
      const unread = await groupMessageService.getUnreadCount(groupId, userId)
      result.push({
        id: groupId,
        name: "", // bisa join ke tabel groups untuk ambil nama
        lastMessage: last?.content ?? "Belum ada pesan",
        lastCreatedAt: last?.createdat ?? "",
        unread,
      })
    }

    // sort berdasarkan lastCreatedAt terbaru
    return result.sort(
      (a, b) =>
        new Date(b.lastCreatedAt).getTime() -
        new Date(a.lastCreatedAt).getTime()
    )
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