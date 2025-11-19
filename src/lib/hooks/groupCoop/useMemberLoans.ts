'use client'

import { useEffect, useState } from 'react'
import { getMemberSummary } from '@/services/groupCoopService'

export function useMemberLoans(member_id: string) {
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  async function fetchSummary() {
    setLoading(true)
    const data = await getMemberSummary(member_id)
    setSummary(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchSummary()
  }, [member_id])

  return { summary, loading, refresh: fetchSummary }
}
