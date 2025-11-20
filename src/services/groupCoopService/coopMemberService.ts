import { supabase } from '@/lib/supabase/client'

export const coopMemberService = {
  async addCoopMember(group_id: string, user_id: string) {
    return await supabase.from('group_coop_members').insert([{ group_id, user_id }])
  },

  async getCoopMembers(group_id: string) {
    return await supabase
      .from('group_coop_members')
      .select(
        `
      id,
      role,
      status,
      joined_at,
      profiles (
        id,
        full_name,
        avatar_url,
        email
      )
    `
      )
      .eq('group_id', group_id)
  },

  async isCoopMember(group_id: string, user_id: string) {
    const { data } = await supabase
      .from('group_coop_members')
      .select('id')
      .eq('group_id', group_id)
      .eq('user_id', user_id)
      .maybeSingle()

    return !!data
  },
}
