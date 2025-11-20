import { supabase } from '@/lib/supabase/client'
import { CoopLedgerEntry } from '@/types/coop'

export const coopLedgerService = {
  async addEntry(entry: CoopLedgerEntry) {
    return await supabase.from('group_coop_ledger').insert([entry])
  },

  async getLedgerByGroup(groupId: string) {
    return await supabase
      .from('group_coop_ledger')
      .select('*')
      .eq('group_id', groupId)
      .order('created_at', { ascending: false })
  },

  async getSummary(groupId: string) {
    return await supabase.rpc('get_coop_financial_summary', { group_id: groupId })
  },
}
