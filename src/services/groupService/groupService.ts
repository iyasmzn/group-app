import { supabase } from "@/lib/supabase/client"
import { crudService } from "../crudService"
import { Profile } from "@/types/profile"

// definisi type untuk tabel groups
export type Group = {
  id: string
  name: string
  owner_id: string
  image_url?: string | null
  created_at?: string
  description?: string
  description_updatedat?: string | Date
  description_updatedby?: string
}
export type GroupMember = {
  user_id: string
  profiles: Partial<Profile>
}

// buat service khusus untuk groups
export const groupService = {
  ...crudService<Group>("groups"),

  getByUser: (userId: string) => groupService.read({ owner_id: userId }),

  async getMembers(groupId: string) {
    const { data, error } = await supabase
      .from("group_members")
      .select("user_id, profiles(full_name, avatar_url)")
      .eq("group_id", groupId)

    if (error) throw error
    return data as GroupMember[]
  },
}
