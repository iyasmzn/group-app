import { supabase } from "@/lib/supabase/client"
import { crudServiceComposite } from "@/services/crudServiceComposite"

export type GroupEventAttendance = {
  event_id: string
  user_id?: string | null
  display_name?: string | null
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

  /**
   * Assign multiple participants to an event at once.
   * Bisa berupa user_id (member grup) atau display_name (manual input).
   * Default status = "absent".
   */
  async assignParticipants(
    eventId: string,
    participants: { user_id?: string | null; display_name?: string | null }[]
  ) {
    const rows = participants.map((p) => ({
      event_id: eventId,
      user_id: p.user_id ?? null,
      display_name: p.display_name ?? null,
      status: "absent" as const,
    }))

    const { data, error } = await supabase
      .from("group_event_attendance")
      .insert(rows)
      .select()

    if (error) throw error
    return data as GroupEventAttendance[]
  },
}