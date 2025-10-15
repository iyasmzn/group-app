'use client'

import { useEffect } from 'react'
import { SupabaseClient } from '@supabase/supabase-js'

type Options<T> = {
  supabase: SupabaseClient
  table: string
  schema?: string
  filters?: string[] // bisa banyak filter sekaligus
  onInsert?: (payload: T) => void
  onUpdate?: (payload: T) => void
  onDelete?: (payload: T) => void
}

export function useRealtimeTableMulti<T>({
  supabase,
  table,
  schema = 'public',
  filters = [],
  onInsert,
  onUpdate,
  onDelete,
}: Options<T>) {
  useEffect(() => {
    if (!supabase) return

    // kalau tidak ada filter, subscribe ke semua
    const activeFilters = filters.length > 0 ? filters : [undefined]

    const channels = activeFilters.map((flt) => {
      const channelName = `realtime:${schema}.${table}${flt ? `:${flt}` : ''}`

      const channel = supabase
        .channel(channelName)
        .on('postgres_changes', { event: '*', schema, table, filter: flt }, (payload) => {
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
            console.log(`[Realtime] Subscribed to ${table}`, { schema, table, filter: flt })
          }
        })

      return channel
    })

    return () => {
      channels.forEach((ch) => supabase.removeChannel(ch))
    }
  }, [supabase, table, schema, filters, onInsert, onUpdate, onDelete])
}
