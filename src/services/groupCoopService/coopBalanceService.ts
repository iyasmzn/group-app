import { supabase } from '@/lib/supabase/client'

export const coopBalanceService = {
  async getLoanBalance(loanId: string) {
    const { data: loan } = await supabase
      .from("group_coop_loans")
      .select('principal')
      .eq('id', loanId)
      .single()

    const { data: payments } = await supabase
      .from('group_coop_repayments')
      .select('amount')
      .eq('loan_id', loanId)

    const totalPaid = payments?.reduce((s, p) => s + Number(p.amount), 0) ?? 0

    return {
      principal: Number(loan?.principal ?? 0),
      totalPaid,
      outstanding: Number(loan?.principal ?? 0) - totalPaid,
    }
  },
}
