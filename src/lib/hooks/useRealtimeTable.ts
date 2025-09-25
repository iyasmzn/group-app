"use client"

import { useEffect } from "react"
import {
  SupabaseClient,
} from "@supabase/supabase-js"

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
  schema = "public",
  filter,
  onInsert,
  onUpdate,
  onDelete,
}: Options<T>) {
  useEffect(() => {
    if (!supabase) return
    
    const channels = supabase.channel('custom-all-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: schema, table: table, filter: filter },
        (payload) => {
          console.log('Change received!', payload)

          if (payload.eventType === "INSERT" && onInsert) {
            onInsert(payload.new as T)
          }
          if (payload.eventType === "UPDATE" && onUpdate) {
            onUpdate(payload.new as T)
          }
          if (payload.eventType === "DELETE" && onDelete) {
            onDelete(payload.old as T)
          }

        }
      )
      .subscribe()

    channels.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        console.log(`[Realtime] Subscribed to ${table}`)
      }
    })

    return () => {
      supabase.removeChannel(channels)
    }
  }, [supabase, table, schema, filter, onInsert, onUpdate, onDelete])
}