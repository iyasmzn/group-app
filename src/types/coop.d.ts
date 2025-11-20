export type LedgerReferenceType = 'loan' | 'repayment' | 'interest' | 'fee'

export interface CoopLedgerEntry {
  group_id: string
  amount: number
  reference_type: LedgerReferenceType
  reference_id: string
  entry_type: 'debit' | 'credit'
  description?: string
  created_by: string
}

export interface CoopLoan {
  group_id: string
  coop_member_id: string
  principal: number
  interest_rate: number
  term_months: number
  start_date: string
  due_date: string
}

export interface CoopRepayment {
  loan_id: string
  amount: number
  paid_by: string
  paid_at: string
  note?: string
}

export interface CoopSettings {
  group_id: string
  interest_rate: number
  max_loan_amount: number
}
