import { crudService } from "@/services/crudService"
import { Profile } from "@/types/profile.type"

export type GroupMember = {
  id: string
  group_id: string
  user_id: string
  role?: "admin" | "member"
  joined_at?: string
  profiles?: Profile | null
}

export const groupMemberService = crudService<GroupMember>("group_members")