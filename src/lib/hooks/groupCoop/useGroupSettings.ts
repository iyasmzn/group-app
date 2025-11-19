'use client'

import { useEffect, useState } from 'react'
import { getGroupSettings, updateGroupSettings } from '@/services/groupCoopService'

export function useGroupSettings(group_id: string) {
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  async function fetchSettings() {
    const { data } = await getGroupSettings(group_id)
    setSettings(data || null)
    setLoading(false)
  }

  async function saveSettings(update: any) {
    const { data } = await updateGroupSettings(group_id, update)
    setSettings(data)
    return data
  }

  useEffect(() => {
    fetchSettings()
  }, [group_id])

  return { settings, loading, refresh: fetchSettings, saveSettings }
}
