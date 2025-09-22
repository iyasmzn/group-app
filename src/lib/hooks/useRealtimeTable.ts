"use client"

import { useEffect } from "react"
import {
  SupabaseClient,
} from "@supabase/supabase-js"

type Events = "INSERT" | "UPDATE" | "DELETE"

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