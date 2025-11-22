import { useEffect, useState } from "react"
import { supabase } from "../supabase/client"

type Options = {
  table: string
  filter?: string
  countQuery: () => Promise<number>
}

export function useRealtimeCount({ table, filter, countQuery }: Options) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let isMounted = true

    const fetchCount = async () => {
      const c = await countQuery()
      if (isMounted) setCount(c)
    }

    fetchCount()

    const channel = supabase
      .channel(`${table}-changes`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table, filter },
        () => {
          fetchCount()
        }
      )
      .subscribe()

    return () => {
      isMounted = false
      supabase.removeChannel(channel)
    }
  }, [supabase, table, filter, countQuery])

  return count
}