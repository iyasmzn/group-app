import { supabase } from '@/lib/supabase/client'
import { CoopLoan } from '@/types/coop'
import { coopLedgerService } from './coopLedgerService'
import { Database } from '@/types/database.types'

type LoanRow = Database["public"]["Tables"]["group_coop_loans"]["Row"]
type NewLoan = Omit<LoanRow, "id" | "created_at" | "status" | "start_date" | "due_date">


export const coopLoanService = {
  async applyLoan(data: NewLoan) {
    const { data: loan, error } = await supabase
      .from('group_coop_loans')
      .insert([data])
      .select()
      .single()

    if (error || !loan) return { error }

    await coopLedgerService.addEntry({
      group_id: data.group_id,
      amount: data.principal,
      entry_type: 'debit',
      created_by: data.coop_member_id,
      reference_id: loan.id,
      reference_type: 'loan',
      description: 'Loan Disbursement',
    })

    return { loan }
  },

  async getLoans(groupId: string) {
    return await supabase.from('group_coop_loans').select('*').eq('group_id', groupId)
  },

  async getLoanDetail(loanId: string) {
    return await supabase
      .from('group_coop_loans')
      .select('*, group_coop_repayments(*)')
      .eq('id', loanId)
      .single()
  },

  async updateLoanStatus(loanId: string, status: string) {
    return await supabase.from('group_coop_loans').update({ status }).eq('id', loanId)
  },
}

export async function createLoan(input: {
  group_id: string
  coop_member_id: string
  principal: number
  term_months: number
  interest_rate: number
}) {
  return await supabase.from('group_coop_loans').insert([input])
}
