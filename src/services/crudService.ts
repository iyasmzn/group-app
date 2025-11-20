import { supabase } from "@/lib/supabase/client"

type Where<T> = {
  [K in keyof T]?: T[K]
}

export function crudService<T extends { id: string }>(table: string) {
  return {
    async create(payload: Omit<T, "id">, select: string = "*") {
      const { data, error } = await supabase
        .from(table as any)  // Type assertion to bypass strict table name typing
        .insert(payload)
        .select(select)
        .single()
      if (error) throw error
      return data as unknown as T
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

      // filter
      if (where) {
        Object.entries(where).forEach(([key, value]) => {
          query = query.eq(key, value)
        })
      }

      // sorting
      if (options?.orderBy) {
        query = query.order(options.orderBy as string, {
          ascending: options.orderDir === "asc",
        })
      }

      // pagination
      if (options?.limit !== undefined && options?.offset !== undefined) {
        query = query.range(
          options.offset,
          options.offset + options.limit - 1
        )
      }

      const { data, error } = await query
      if (error) throw error
      return data as unknown as T[]
    },

    async update(
      id: string,
      payload: Partial<Omit<T, "id">>,
      select: string = "*"
    ) {
      const { data, error } = await supabase
        .from(table as any)  // Type assertion
        .update(payload)
        .eq("id", id)
        .select(select)
        .maybeSingle()
      if (error) throw error
      return data as unknown as T
    },

    async remove(id: string) {
      const { error } = await supabase.from(table as any).delete().eq("id", id)  // Type assertion
      if (error) throw error
      return true
    },
  }
}
