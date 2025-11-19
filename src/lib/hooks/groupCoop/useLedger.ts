'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export function useLedger(group_id: string) {
  const [ledger, setLedger] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchLedger() {
    const { data } = await supabase
      .from('group_coop_ledger')
      .select('*')
      .eq('group_id', group_id)
      .order('created_at', { ascending: false })

    setLedger(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchLedger()
  }, [group_id])

  return { ledger, loading, refresh: fetchLedger }
}
