import { crudService } from "@/services/crudService"

export type GroupEventMinute = {
  id: string
  event_id: string
  content: string
  created_by: string
  created_at?: string
}

const base = crudService<GroupEventMinute>("group_event_minutes")

export const minutesService = {
  ...base,

  async addMinute(eventId: string, userId: string, content: string) {
    return base.create({ event_id: eventId, created_by: userId, content })
  },
}