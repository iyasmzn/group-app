import { crudService } from "@/services/crudService"

export type GroupEventTask = {
  id: string
  event_id: string
  title: string
  description?: string
  assigned_to?: string
  status: "todo" | "in_progress" | "done"
  due_at?: string
}

const base = crudService<GroupEventTask>("group_event_tasks")

export const taskService = {
  ...base,

  async assignTask(
    eventId: string,
    payload: Omit<GroupEventTask, "id" | "event_id">
  ) {
    return base.create({ ...payload, event_id: eventId })
  },
}