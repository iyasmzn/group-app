// src/services/crudService.ts
import { supabase } from "@/lib/supabase/client"

export const crudService = {
  async create<T>(table: string, payload: Partial<T>) {
    const { data, error } = await supabase.from(table).insert(payload).select()
    if (error) throw error
    return data
  },

  async read<T>(table: string, filters?: Record<string, any>) {
    let query = supabase.from(table).select("*")
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }
    const { data, error } = await query
    if (error) throw error
    return data as T[]
  },

  async update<T>(table: string, id: string | number, payload: Partial<T>) {
    const { data, error } = await supabase.from(table).update(payload).eq("id", id).select()
    if (error) throw error
    return data
  },

  async remove(table: string, id: string | number) {
    const { error } = await supabase.from(table).delete().eq("id", id)
    if (error) throw error
    return true
  },
}
