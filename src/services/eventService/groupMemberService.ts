import { crudService } from "@/services/crudService"

export type GroupMember = {
  id: string
  group_id: string
  user_id: string
  role?: "admin" | "member"
  joined_at?: string
}

export const groupMemberService = crudService<GroupMember>("group_members")