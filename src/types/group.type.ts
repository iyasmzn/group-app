import { Profile } from './profile.type'

export interface GroupData {
  id: string
  name: string
  image_url: string
  createdat: Date
  description: string
  description_updatedat: Date
  description_updatedby: Date
  group_members?: GroupMember[]
  owner?: Partial<Profile> | null
  desc_updatedby?: Partial<Profile> | null
  unreadCount?: number | null
  member_count?: number | null
}

export interface GroupMember {
  id: string
  joinedat?: string
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

// Baris "groups" murni (tanpa relasi)
export type GroupRow = {
  id: string
  name: string
  owner_id: string
  image_url: string | null
  created_at?: string | null
  description: string | null
  description_updatedat: string | null
  description_updatedby: string | null
}

// Relasi group_members minimal yang kamu pakai
export type GroupMemberRow = {
  joinedat: string | null
  user_id?: string
  profiles?: Partial<Profile>
}

// Relasi group_last_seen minimal yang kamu pakai
export type GroupLastSeenRow = {
  last_seen_at: string | null
  message_last_seen_at: string | null
}

// Bentuk hasil SELECT dengan relasi opsional
export type GroupWithOptionalLastSeen = GroupRow & {
  group_members: GroupMemberRow[]
  group_last_seen?: GroupLastSeenRow[] // <- array, bukan string
}

// Tipe untuk getMembers yang spesifik
export type GroupMemberService = {
  user_id: string
  profiles: Partial<Profile>
}