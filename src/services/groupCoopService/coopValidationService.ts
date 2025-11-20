import { supabase } from '@/lib/supabase/client'

export async function validateLoanEligibility(coop_member_id: string, amount: number) {
  // Cek pinjaman aktif
  const { data: activeLoans } = await supabase
    .from('group_coop_loans')
    .select('*')
    .eq('coop_member_id', coop_member_id)
    .eq('status', 'active')

  if (activeLoans && activeLoans.length > 0) {
    return { success: false, message: 'Coop Member has active loan' }
  }

  // Bisa tambahkan logika: maxLoan, history, risk score, etc.
  return { success: true }
}
