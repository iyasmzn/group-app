import { Profile } from "./profile"

export interface GroupData {
  id: string
  name: string
  image_url: string
  createdat: Date
  description: string
  description_updatedat: Date
  description_updatedby: Date
  group_members?: GroupMember[]
  owner?:Partial<Profile> | null
  desc_updatedby?:GroupMember
  unreadCount?: number | null
}

export interface GroupMember {
  id: string
  user_id?: string
  role_id?: string
  profiles?: Partial<Profile> | null
  group_roles?: Partial<GroupRole> | null
}

export interface GroupInvite {
  id: string
  code: string
  expires_at: Date
  group_id: string
}

export interface GroupRole {
  id: string
  code: string
  name: string
  permissions?: string[]
  group_id?: string
}