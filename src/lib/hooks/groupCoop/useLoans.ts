// src/app/hooks/groupCoop/useLoans.ts
'use client'

import { useEffect, useState } from 'react'
import { approveLoan, createLoan, listLoans } from '@/services/groupCoopService'

export function useLoans(group_id?: string) {
  const [loans, setLoans] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<any>(null)

  async function fetchLoans() {
    setLoading(true)
    const { data, error } = await listLoans(group_id)
    if (error) setError(error)
    else setLoans(data || [])
    setLoading(false)
  }

  async function addLoan(input: any) {
    const response = await createLoan(input)
    await fetchLoans()
    return response
  }

  async function approve(loan_id: string, approved_by: string) {
    const response = await approveLoan(loan_id, approved_by)
    await fetchLoans()
    return response
  }

  useEffect(() => {
    if (group_id) fetchLoans()
  }, [group_id])

  return {
    loans,
    loading,
    error,
    addLoan,
    approve,
    refresh: fetchLoans,
  }
}
