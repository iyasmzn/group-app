import { crudService } from "@/services/crudService"

export type GroupEventContribution = {
  id: string
  event_id: string
  user_id: string
  amount: number
  paid_at?: string
  note?: string
}

const base = crudService<GroupEventContribution>("group_event_contributions")

export const contributionService = {
  ...base,

  async addContribution(
    eventId: string,
    userId: string,
    amount: number,
    note?: string
  ) {
    return base.create({ event_id: eventId, user_id: userId, amount, note })
  },
}