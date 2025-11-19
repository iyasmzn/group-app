import { supabase } from '@/lib/supabase/client'

export async function getGroupSettings(group_id: string) {
  return await supabase.from('group_coop_settings').select('*').eq('group_id', group_id).single()
}

export async function updateGroupSettings(
  group_id: string,
  data: {
    interest_rate?: number
    max_loan_amount?: number
  }
) {
  return await supabase
    .from('group_coop_settings')
    .update(data)
    .eq('group_id', group_id)
    .select()
    .single()
}

export async function createDefaultSettings(group_id: string) {
  return await supabase
    .from('group_coop_settings')
    .insert([
      {
        group_id,
        interest_rate: 10,
        max_loan_amount: 1000000,
      },
    ])
    .select()
    .single()
}
