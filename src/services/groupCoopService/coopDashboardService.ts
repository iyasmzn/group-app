import { supabase } from '@/lib/supabase/client'

export const coopDashboardService = {
  async getCoopDashboard(group_id: string) {
    const { data, error } = await supabase.rpc('get_coop_dashboard', { gid: group_id })
    if (error) throw error
    return data?.[0]
  },

  async getRecentLedger(group_id: string, limit = 10) {
    return await supabase
      .from('group_coop_ledger')
      .select(
        `
        id,
        amount,
        entry_type,
        description,
        created_at,
        created_by,
        reference_type,
        reference_id,
        group_coop_members!group_coop_ledger_created_by_fkey (
          user_id,
          role,
          users ( full_name, avatar_url )
        )
      `
      )
      .eq('group_id', group_id)
      .order('created_at', { ascending: false })
      .limit(limit)
  },

  async getActiveMembers(group_id: string) {
    return await supabase
      .from('group_coop_members')
      .select(
        `
        id,
        role,
        status,
        user_id,
        users (
          full_name,
          avatar_url
        )
      `
      )
      .eq('group_id', group_id)
      .eq('status', 'active')
  },

  async fetchFullCoopDashboard(group_id: string) {
    const [summary, ledger, members] = await Promise.all([
      coopDashboardService.getCoopDashboard(group_id),
      coopDashboardService.getRecentLedger(group_id),
      coopDashboardService.getActiveMembers(group_id),
    ])

    return {
      ...summary,
      recentTransactions: ledger.data || [],
      members: members.data || [],
    }
  },
}
