'use client'

import { useEffect } from 'react'
import { SupabaseClient } from '@supabase/supabase-js'

type Options<T> = {
  supabase: SupabaseClient
  table: string
  schema?: string
  filter?: string
  onInsert?: (payload: T) => void
  onUpdate?: (payload: T) => void
  onDelete?: (payload: T) => void
}

export function useRealtimeTable<T>({
  supabase,
  table,
  schema = 'public',
  filter,
  onInsert,
  onUpdate,
  onDelete,
}: Options<T>) {
  useEffect(() => {
    if (!supabase) return

    // bikin nama channel unik biar tidak bentrok
    const channelName = `realtime:${schema}.${table}${filter ? `:${filter}` : ''}`

    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', { event: '*', schema, table, filter }, (payload) => {
        console.log('[Realtime] Change received:', payload)

        switch (payload.eventType) {
          case 'INSERT':
            onInsert?.(payload.new as T)
            break
          case 'UPDATE':
            onUpdate?.(payload.new as T)
            break
          case 'DELETE':
            onDelete?.(payload.old as T)
            break
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`[Realtime] Subscribed to ${table}`, { schema, table, filter })
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, table, schema, filter, onInsert, onUpdate, onDelete])
}
