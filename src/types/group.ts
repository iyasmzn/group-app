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
  owner?:GroupMember
  desc_updatedby?:GroupMember
}

export interface GroupMember {
  id: string
  full_name: string
  user_id: string
  profiles?: Profile
  group_roles?: GroupRole
}

export interface GroupInvite {
  id: string
  code: string
  expires_at: Date
  group_id: string
}

export interface GroupRole {
  id: string
  name: string
}