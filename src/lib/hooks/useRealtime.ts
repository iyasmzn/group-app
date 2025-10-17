'use client'

import { useEffect } from 'react'
import { SupabaseClient } from '@supabase/supabase-js'

type PostgresChangeOptions<T> = {
  type: 'postgres_changes'
  schema?: string
  table: string
  filter?: string
  onInsert?: (payload: T) => void
  onUpdate?: (payload: T) => void
  onDelete?: (payload: T) => void
}

type BroadcastOptions<T> = {
  type: 'broadcast'
  channel: string
  event: string
  onPayload: (payload: T) => void
  fallback?: (payload: T) => Promise<T>
}

type Options<T> = {
  supabase: SupabaseClient
} & (PostgresChangeOptions<T> | BroadcastOptions<T>)

/**
 * Generic hook untuk subscribe realtime:
 * - postgres_changes (tabel)
 * - broadcast (custom channel/NOTIFY)
 */
export function useRealtime<T>(options: Options<T>) {
  const { supabase } = options

  useEffect(() => {
    if (!supabase) return

    if (options.type === 'postgres_changes') {
      const { schema = 'public', table, filter, onInsert, onUpdate, onDelete } = options

      const channelName = `realtime:${schema}.${table}${filter ? `:${filter}` : ''}`
      const channel = supabase
        .channel(channelName)
        .on('postgres_changes', { event: '*', schema, table, filter }, (payload) => {
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
        .subscribe()

      console.log(`[Realtime] Subscribed to ${table}`, { schema, table, filter })

      return () => {
        supabase.removeChannel(channel)
        console.log(`[Realtime] Unsubscribed to ${table}`, { schema, table, filter })
      }
    }

    if (options.type === 'broadcast') {
      const { channel: channelName, event, onPayload, fallback } = options

      const channel = supabase
        .channel(channelName)
        .on('broadcast', { event }, async ({ payload }) => {
          let msg = payload as T
          console.log('Received broadcast payload:', msg)
          if (fallback) {
            msg = await fallback(msg)
          }
          onPayload(msg)
        })
        .subscribe()

      console.log(`[Realtime] Subscribed to channel ${channelName}`)

      return () => {
        supabase.removeChannel(channel)
        console.log(`[Realtime] Unsubscribed from channel ${channelName}`)
      }
    }
  }, [supabase, options])
}
