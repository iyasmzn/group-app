"use client"

import { useEffect } from "react"
import { SupabaseClient } from "@supabase/supabase-js"

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

    const channel = supabase
      .channel(`realtime:${schema}.${table}`)
      .on(
        "postgres_changes",
        { event: "*", schema, table, filter },
        (payload) => {
          console.log("[Realtime] Change received:", payload)

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
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log(`[Realtime] Subscribed to ${table}`, { schema, table, filter })
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, table, schema, filter, onInsert, onUpdate, onDelete])
}