import { supabase } from "@/lib/supabase/client"

type Where<T> = Partial<Record<keyof T, any>>

export function crudService<T extends { id: string }>(table: string) {
  return {
    async create(payload: Omit<T, "id">) {
      const { data, error } = await supabase.from(table).insert(payload).select().single()
      if (error) throw error
      return data as T
    },

    async read(where?: Where<T>) {
      let query = supabase.from(table).select("*")
      if (where) {
        Object.entries(where).forEach(([key, value]) => {
          query = query.eq(key, value)
        })
      }
      const { data, error } = await query
      if (error) throw error
      return data as T[]
    },

    async update(id: string, payload: Partial<Omit<T, "id">>) {
      const { data, error } = await supabase.from(table).update(payload).eq("id", id).select().single()
      if (error) throw error
      return data as T
    },

    async remove(id: string) {
      const { error } = await supabase.from(table).delete().eq("id", id)
      if (error) throw error
      return true
    },
  }
}
