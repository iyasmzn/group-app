import { supabase } from '@/lib/supabase/client'

export async function addLedgerEntry(entry: {
  group_id: string
  loan_id?: string
  amount: number
  type: 'loan_disbursement' | 'repayment' | 'penalty' | 'fee'
  created_by: string
}) {
  return await supabase.from('group_coop_ledger').insert([entry])
}

export async function getLedgerSummary(group_id: string) {
  return await supabase.rpc('get_coop_financial_summary', { group_id })
}
