import { supabase } from '@/lib/supabase/client'

export async function getCoopDashboard(group_id: string) {
  const [loans, repayments, ledger] = await Promise.all([
    supabase.from('group_coop_loans').select('*').eq('group_id', group_id),
    supabase.from('group_coop_repayments').select('*').eq('group_id', group_id),
    supabase.from('group_coop_ledger').select('*').eq('group_id', group_id),
  ])

  return {
    totalLoans: loans.data?.length,
    activeLoans: loans.data?.filter((l) => l.status === 'active').length,
    totalRepayments: repayments.data?.reduce((a, b) => a + b.amount, 0),
    cashflow: ledger.data,
  }
}
