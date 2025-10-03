// src/services/eventService.ts
import { crudService } from "@/services/crudService"

export type GroupEvent = {
  id: string
  group_id: string
  title: string
  description?: string
  start_at?: string
  end_at?: string
  location?: string
  recurrence_rule?: string
  created_at?: string
}

const base = crudService<GroupEvent>("group_events")

export const eventService = {
  ...base,

  // contoh method tambahan khusus event
  async getUpcoming(groupId: string) {
    const events = await base.read({ group_id: groupId })
    return events.filter(e => e.start_at && new Date(e.start_at) > new Date())
  },
}