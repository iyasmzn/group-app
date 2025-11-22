import { supabase } from "@/lib/supabase/client"
import { crudService } from "../crudService"
import { GroupMember, GroupMemberRow, GroupRow, GroupWithOptionalLastSeen } from "@/types/group.type"

export const groupService = {
  // CRUD untuk baris "groups" murni
  ...crudService<GroupRow>("groups"),

  // Dapatkan groups milik owner tertentu (tanpa relasi)
  getByUser: (userId: string) => groupService.read({ owner_id: userId }),

  // Anggota sebuah group (dengan profile)
  async getMembers(groupId: string) {
    const { data, error } = await supabase
      .from("group_members")
      .select("user_id, profiles(full_name, avatar_url)")
      .eq("group_id", groupId)

    if (error) throw error
    return (data ?? []) as GroupMember[]
  },

  // Semua group yang diikuti oleh user (dengan relasi group_members)
  async getByMember(userId: string) {
    const { data, error } = await supabase
      .from("groups")
      .select("*, group_members!inner(*)")
      .eq("group_members.user_id", userId)

    if (error) throw error
    return (data ?? []) as (GroupRow & { group_members: GroupMemberRow[] })[]
  },

  // Last group untuk user dengan fallback
  async getLastGroupByUser(userId: string) {
    // 1) berdasarkan last_seen (relasi group_last_seen)
    const { data: groups, error } = await supabase
      .from("groups")
      .select(`
        *,
        group_members!inner(*),
        group_last_seen(last_seen_at, message_last_seen_at)
      `)
      .eq("group_members.user_id", userId)
      .eq("group_last_seen.user_id", userId)
      .order("last_seen_at", { referencedTable: "group_last_seen", ascending: false })
      .limit(1)

    if (error) throw error
    let g = (groups?.[0] ?? null) as GroupWithOptionalLastSeen | null

    // 2) fallback: jika tidak ada last_seen, pakai yang terbaru bergabung
    if (!g || !g.group_last_seen?.length) {
      const { data: fallbackGroups, error: fbError } = await supabase
        .from("groups")
        .select(`
          *,
          group_members!inner(joinedat)
        `)
        .eq("group_members.user_id", userId)
        .order("joinedat", { referencedTable: "group_members", ascending: false })
        .limit(1)

      if (fbError) throw fbError
      g = (fallbackGroups?.[0] ?? null) as (GroupRow & { group_members: GroupMemberRow[] }) | null
    }

    // Normalisasi agar selalu sesuai GroupWithOptionalLastSeen
    if (!g) return undefined

    const normalized: GroupWithOptionalLastSeen = {
      ...(g as GroupRow),
      group_members: (g as any).group_members ?? [],
      group_last_seen: (g as any).group_last_seen ?? [], // kosong kalau fallback
    }

    return normalized
  },
}