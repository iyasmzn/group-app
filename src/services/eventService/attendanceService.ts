import { supabase } from "@/lib/supabase/client"
import { Profile } from "@/types/profile"
import { crudService } from "../crudService"

export type GroupEventAttendance = {
  id: string
  event_id: string
  user_id?: string | null
  display_name?: string | null
  status: "present" | "absent" | "late" | "excused"
  profiles?: Profile | null
  attend_at?: string | null
  notes?: string | null
}

const base = crudService<GroupEventAttendance>("group_event_attendance")

export const attendanceService = {
  ...base,

  async markAttendance(
    id: string,
    status: GroupEventAttendance["status"],
    notes?: GroupEventAttendance["notes"],
  ) {
    const now = new Date().toISOString()
    return base.update(id, { status, attend_at: ['present', 'late'].includes(status) ? now : null, notes })
  },

  /**
   * Assign multiple participants to an event at once.
   * Bisa berupa user_id (member grup) atau display_name (manual input).
   * Default status = "absent".
   */
  async assignParticipants(
    eventId: string,
    participants: {
      user_id?: string | null
      display_name?: string | null
      status?: GroupEventAttendance["status"] | null
      notes?: string | null
    }[]
  ) {
    const rows = participants.map((p) => ({
      event_id: eventId,
      user_id: p.user_id ?? null,
      display_name: p.display_name ?? null,
      status: p.status ?? null, // gunakan default di DB jika ada
      notes: p.notes ?? null,
    }))

    const { data, error } = await supabase
      .from("group_event_attendance")
      .insert(rows)
      .select()

    if (error) throw error
    return data as GroupEventAttendance[]
  },
  async addParticipant(eventId: string, participant: { user_id?: string; display_name?: string; status?: GroupEventAttendance["status"]; notes?: string }) {
    return this.assignParticipants(eventId, [participant])
  }
}