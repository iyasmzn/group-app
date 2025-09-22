"use client"

import { useEffect } from "react"
import {
  SupabaseClient,
  RealtimeChannel,
  RealtimePostgresChangesPayload,
} from "@supabase/supabase-js"

type Events = "INSERT" | "UPDATE" | "DELETE"

type Options<T> = {
  supabase: SupabaseClient
  table: string
  schema?: string
  filter?: string
  events?: Events[]
  onInsert?: (payload: T) => void
  onUpdate?: (payload: T) => void
  onDelete?: (payload: T) => void
}

export function useRealtimeTable<T>({
  supabase,
  table,
  schema = "public",
  filter,
  events = ["INSERT"],
  onInsert,
  onUpdate,
  onDelete,
}: Options<T>) {
  useEffect(() => {
    if (!supabase) return

    const channel: RealtimeChannel = supabase.channel(`${table}-changes`)

    events.forEach((event) => {
      channel.on(
        {
          event: "postgres_changes",
          schema,
          table,
          filter,
          type: event, // penting: event = "INSERT" | "UPDATE" | "DELETE"
        },
        (payload: RealtimePostgresChangesPayload<T>) => {
          if (event === "INSERT" && onInsert) onInsert(payload.new as T)
          if (event === "UPDATE" && onUpdate) onUpdate(payload.new as T)
          if (event === "DELETE" && onDelete) onDelete(payload.old as T)
        }
      )
    })

    channel.subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, table, schema, filter, events, onInsert, onUpdate, onDelete])
}
