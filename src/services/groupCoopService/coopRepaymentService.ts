import { supabase } from '@/lib/supabase/client'
import { coopLedgerService } from './coopLedgerService'
import { Database } from '@/types/database.types'

type RepaymentRow = Database["public"]["Tables"]["group_coop_repayments"]["Row"]
type NewRepayment = Omit<RepaymentRow, "id" | "created_at">

export const coopRepaymentService = {
  async addRepayment(data: NewRepayment) {
    console.log('addRepayment')
    const { data: repayment, error } = await supabase
      .from('group_coop_repayments')
      .insert([data])
      .select()
      .single()

    if (error || !repayment) return { error }

    console.log('get Loan')
    const loan = await supabase
      .from('group_coop_loans')
      .select('group_id, coop_member_id')
      .eq('id', data.loan_id)
      .single()

    if (loan.error || !loan.data || !loan.data.group_id) return { error: loan.error }

    console.log('insert ledger')
    await coopLedgerService.addEntry({
      group_id: loan.data.group_id,
      entry_type: 'credit',
      amount: data.amount,
      created_by: data.paid_by,
      reference_id: repayment.id,
      reference_type: 'repayment',
      description: 'Loan Repayment',
    })

    return { repayment, group_id: loan.data.group_id }
  },

  async getRepayments(loanId: string) {
    return await supabase
      .from('group_coop_repayments')
      .select('*')
      .eq('loan_id', loanId)
      .order('paid_at', { ascending: true })
  },
}
