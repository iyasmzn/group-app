import { supabase } from '@/lib/supabase/client'
import { addLedgerEntry } from './ledgerService'
import { validateLoanEligibility } from './coopValidationService'

type LoanInput = {
  group_id: string
  borrower_id: string
  principal: number
  interest_rate?: number
  term_months: number
  start_date?: string
}

export async function createLoan(input: LoanInput) {
  // Business validation (limit, active loans etc)
  const isEligible = await validateLoanEligibility(input.borrower_id, input.principal)
  if (!isEligible.success) return { error: isEligible.message }

  const { data, error } = await supabase
    .from('group_coop_loans')
    .insert([
      {
        ...input,
        status: 'pending',
        start_date: input.start_date || new Date().toISOString(),
      },
    ])
    .select()
    .single()

  return { data, error }
}

export async function approveLoan(loan_id: string, approved_by: string) {
  const { data: loan, error } = await supabase
    .from('group_coop_loans')
    .update({ status: 'active' })
    .eq('id', loan_id)
    .select()
    .single()

  if (loan) {
    await addLedgerEntry({
      group_id: loan.group_id,
      loan_id,
      amount: loan.principal,
      type: 'loan_disbursement',
      created_by: approved_by,
    })
  }

  return { data: loan, error }
}

export async function listLoans(group_id?: string, status?: string) {
  let query = supabase.from('group_coop_loans').select('*')

  if (group_id) query = query.eq('group_id', group_id)
  if (status) query = query.eq('status', status)

  return await query
}
