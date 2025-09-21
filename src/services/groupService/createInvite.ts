import { supabase } from "@/lib/supabase/client"
import { v4 as uuidv4 } from "uuid"

export async function createInvite(groupId: string, groupRoleId: String) {
  const code = uuidv4()
  const { data, error } = await supabase.from("group_invites").insert({
    group_id: groupId,
    group_role_id: groupRoleId,
    code,
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // expired 7 hari
  }).select().single()

  if (error) throw error
  return `${data}`
}
