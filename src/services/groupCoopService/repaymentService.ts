import { supabase } from '@/lib/supabase/client'
import { addLedgerEntry } from './ledgerService'

export async function recordRepayment(input: { loan_id: string; amount: number; paid_by: string }) {
  const { data, error } = await supabase
    .from('group_coop_repayments')
    .insert([input])
    .select()
    .single()

  if (!error) {
    await addLedgerEntry({
      group_id: data.group_id,
      loan_id: input.loan_id,
      amount: input.amount,
      type: 'repayment',
      created_by: input.paid_by,
    })
  }

  return { data, error }
}
