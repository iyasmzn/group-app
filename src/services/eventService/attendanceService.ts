import { crudServiceComposite } from "@/services/crudServiceComposite"

export type GroupEventAttendance = {
  event_id: string
  user_id: string
  status: "present" | "absent" | "late" | "excused"
}

const base = crudServiceComposite<GroupEventAttendance>(
  "group_event_attendance",
  ["event_id", "user_id"]
)

export const attendanceService = {
  ...base,

  async markAttendance(
    eventId: string,
    userId: string,
    status: GroupEventAttendance["status"]
  ) {
    return base.create({ event_id: eventId, user_id: userId, status })
  },
}