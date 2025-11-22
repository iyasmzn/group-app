import { supabase } from '@/lib/supabase/client'
import { coopLedgerService } from './coopLedgerService'
import { Database } from '@/types/database.types'
import { coopMemberService } from './coopMemberService'

type LoanRow = Database["public"]["Tables"]["group_coop_loans"]["Row"]
type NewLoan = Omit<LoanRow, "id" | "created_at" | "status">


export const coopLoanService = {
  async applyLoan(data: NewLoan) {
    const { data: loan, error } = await supabase
      .from('group_coop_loans')
      .insert([data])
      .select()
      .single()

    if (error || !loan) return { error }

    const { data: memberData, error: errorMember } = await coopMemberService
      .getCoopMemberById(data.coop_member_id)
    if (errorMember || !memberData) return { errorMember }
    
    
    await coopLedgerService.addEntry({
      group_id: data.group_id,
      amount: data.principal,
      entry_type: 'debit',
      created_by: memberData.user_id,
      reference_id: loan.id,
      reference_type: 'loan',
      description: 'Loan Disbursement',
    })

    return { loan }
  },

  async getLoans(groupId: string) {
    return await supabase.from('group_coop_loans').select(`
      *,
      group_coop_members (
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
      )
    `).eq('group_id', groupId)
  },

  async getLoanDetail(loanId: string) {
    return await supabase
      .from('group_coop_loans')
      .select(`*, 
        group_coop_repayments(*),
        group_coop_members (
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
        )
      `)
      .eq('id', loanId)
      .single()
  },

  async updateLoanStatus(loanId: string, status: string) {
    return await supabase.from('group_coop_loans').update({ status }).eq('id', loanId)
  },

  async deleteLoan(id: string, groupId: string) {
  // hapus dulu ledger entry yang refer ke loan ini
  await supabase
    .from("group_coop_ledger")
    .delete()
    .eq("reference_id", id)
    .eq("reference_type", "loan")

  // baru hapus loan
  return await supabase
    .from("group_coop_loans")
    .delete()
    .eq("id", id)
    .eq("group_id", groupId)
}
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
