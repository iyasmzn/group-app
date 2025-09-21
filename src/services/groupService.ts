import { crudService } from "./crudService"

// definisi type untuk tabel groups
export type Group = {
  id: string
  name: string
  owner_id: string
  image_url?: string | null
  created_at?: string
  description?: string
  description_updatedat?: string | Date
  description_updatedby?: string
}

// buat service khusus untuk groups
export const groupService = crudService<Group>("groups")

// contoh: tambahan method spesifik groups
export const groupCustomService = {
  ...groupService,
  getByUser: (userId: string) => groupService.read({ owner_id: userId }),
}
