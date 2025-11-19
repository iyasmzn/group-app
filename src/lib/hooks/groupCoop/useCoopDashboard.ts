'use client'

import { useState, useEffect } from 'react'
import { getCoopDashboard } from '@/services/groupCoopService'

export function useCoopDashboard(group_id: string) {
  const [report, setReport] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  async function fetchDashboard() {
    setLoading(true)
    const data = await getCoopDashboard(group_id)
    setReport(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchDashboard()
  }, [group_id])

  return { report, loading, refresh: fetchDashboard }
}
