import { supabase } from "@/lib/supabase/client"

type Where<T> = {
  [K in keyof T]?: T[K]
}

export function crudServiceComposite<T>(table: string, keys: (keyof T)[]) {
  return {
    async create(payload: T) {
      const { data, error } = await supabase
        .from(table as any)  // Type assertion to bypass strict table name typing
        .insert(payload)
        .select()
        .single()
      if (error) throw error
      return data as T
    },
    
    async read(
      where?: Where<T>,
      options?: {
        orderBy?: keyof T
        orderDir?: "asc" | "desc"
        limit?: number
        offset?: number
        select?: string
      }
    ) {
      let query = supabase.from(table as any).select(options?.select ?? "*")  // Type assertion

      if (where) {
        Object.entries(where).forEach(([key, value]) => {
          query = query.eq(key, value)
        })
      }

      if (options?.orderBy) {
        query = query.order(options.orderBy as string, {
          ascending: options.orderDir === "asc",
        })
      }

      if (options?.limit !== undefined && options?.offset !== undefined) {  // Fixed syntax error
        query = query.range(options.offset, options.offset + options.limit - 1)
      }

      const { data, error } = await query
      if (error) throw error
      return data as T[]
    },

    async update(keysValue: Partial<T>, payload: Partial<T>) {
      let query = supabase.from(table as any).update(payload)  // Type assertion
      Object.entries(keysValue).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
      const { data, error } = await query.select().maybeSingle()
      if (error) throw error
      return data as T
    },

    async remove(keysValue: Partial<T>) {
      let query = supabase.from(table as any).delete()  // Type assertion
      Object.entries(keysValue).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
      const { error } = await query
      if (error) throw error
      return true
    },
  }
}
