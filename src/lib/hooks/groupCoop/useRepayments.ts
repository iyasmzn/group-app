'use client'

import { useState } from 'react'
import { recordRepayment } from '@/services/groupCoopService'

export function useRepayments() {
  const [loading, setLoading] = useState(false)

  async function payLoan({ loan_id, amount, paid_by }: any) {
    setLoading(true)
    const response = await recordRepayment({ loan_id, amount, paid_by })
    setLoading(false)
    return response
  }

  return { payLoan, loading }
}
