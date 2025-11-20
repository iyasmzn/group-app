import { supabase } from '@/lib/supabase/client'

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
  lastSenderFullName: string
  unread: number
}

export type RPCRow = {
  group_id: string
  group_name: string | null
  last_message: string | null
  last_sender_full_name: string | null
  last_createdat: string | null
  unread_count: number | null
}

export const groupMessageService = {
  async getLatestByGroups(groupIds: string[], userId: string): Promise<GroupChatItem[]> {
    try {
      const { data, error } = await supabase.rpc('get_group_latest_and_unread', {
        uid: userId,
      })

      if (error || !data) throw error

      const filtered = data.filter((row: RPCRow) => groupIds.includes(row.group_id))

      return filtered.map((row: RPCRow) => ({
        id: row.group_id,
        name: row.group_name ?? '',
        lastMessage: row.last_message ?? 'Belum ada pesan',
        lastSenderFullName: row.last_sender_full_name ?? '?',
        lastCreatedAt: row.last_createdat ?? '',
        unread: row.unread_count ?? 0,
      }))
    } catch {
      // fallback ke versi lama jika RPC gagal
      return await groupMessageService._legacyGetLatestByGroups(groupIds, userId)
    }
  },

    async _legacyGetLatestByGroups(groupIds: string[], userId: string): Promise<GroupChatItem[]> {
    const { data, error } = await supabase
      .from('group_messages')
      .select('group_id, content, createdat, sender_id')
      .in('group_id', groupIds)
      .order('createdat', { ascending: false })

    if (error) throw error

    // Updated Map type to allow nulls in values, and assert key is not null
    const latestMap = new Map<string, { content: string | null; createdat: string | null }>()
    for (const msg of data ?? []) {
      if (!latestMap.has(msg.group_id!)) {  // Non-null assertion for key
        latestMap.set(msg.group_id!, {  // Non-null assertion for key
          content: msg.content,  // Now assignable since Map allows null
          createdat: msg.createdat,
        })
      }
    }

    const result: GroupChatItem[] = []
    for (const groupId of groupIds) {
      const last = latestMap.get(groupId)
      const unread = await groupMessageService.getUnreadCount(groupId, userId)
      result.push({
        id: groupId,
        name: '', // bisa join ke tabel groups kalau perlu
        lastMessage: last?.content ?? 'Belum ada pesan',
        lastSenderFullName: '?', // perlu join ke tabel users kalau perlu
        lastCreatedAt: last?.createdat ?? '',
        unread,
      })
    }

    return result.sort(
      (a, b) => new Date(b.lastCreatedAt).getTime() - new Date(a.lastCreatedAt).getTime()
    )
  },


  async getUnreadCount(groupId: string, userId: string) {
    const { data: seenRow, error: seenError } = await supabase
      .from('group_last_seen')
      .select('message_last_seen_at')
      .eq('group_id', groupId)
      .eq('user_id', userId)
      .maybeSingle()

    if (seenError) throw seenError

    if (!seenRow || !seenRow.message_last_seen_at) {
      const { count } = await supabase
        .from('group_messages')
        .select('id', { count: 'exact', head: true })
        .eq('group_id', groupId)
      return count ?? 0
    }

    const { count, error } = await supabase
      .from('group_messages')
      .select('id', { count: 'exact', head: true })
      .eq('group_id', groupId)
      .neq('sender_id', userId)
      .gt('createdat', seenRow.message_last_seen_at!)  // Non-null assertion to fix type error

    if (error) throw error
    return count ?? 0
  },

  async markAsRead(groupId: string, userId: string, lastMessageAt: string) {
    const { error } = await supabase.rpc('mark_group_as_read', {
      gid: groupId,
      uid: userId,
      last_msg_at: lastMessageAt,
    })
    if (error) throw error
    return true
  },
}
