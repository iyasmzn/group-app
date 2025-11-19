import { supabase } from '@/lib/supabase/client'

export async function getGroupMembers(group_id: string) {
  // Jika kamu punya tabel group_members
  const { data, error } = await supabase
    .from('group_members')
    .select('user_id, role, joined_at')
    .eq('group_id', group_id)

  if (data) {
    // Ambil info user (name, email, etc) dari profiles
    const enriched = await Promise.all(
      data.map(async (m) => {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('id', m.user_id)
          .single()
        return { ...m, ...profile }
      })
    )

    return { data: enriched, error: null }
  }

  return { data: null, error }
}

export async function getLoanHistoryForMember(borrower_id: string) {
  return await supabase.from('group_coop_loans').select('*').eq('borrower_id', borrower_id)
}

export async function getActiveLoansForMember(borrower_id: string) {
  return await supabase
    .from('group_coop_loans')
    .select('*')
    .eq('borrower_id', borrower_id)
    .eq('status', 'active')
}

export async function getMemberSummary(borrower_id: string) {
  const [history, active] = await Promise.all([
    getLoanHistoryForMember(borrower_id),
    getActiveLoansForMember(borrower_id),
  ])

  return {
    borrower_id,
    totalLoans: history.data?.length || 0,
    activeLoans: active.data?.length || 0,
    totalBorrowed: history.data?.reduce((a, b) => a + b.principal, 0) || 0,
  }
}
