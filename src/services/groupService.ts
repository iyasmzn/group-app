import { crudService } from "./crudService"

export const groupService = {
  create: (name: string, ownerId: string) =>
    crudService.create("groups", { name, owner_id: ownerId }),
  getByUser: (userId: string) =>
    crudService.read("groups", { owner_id: userId }),
  update: (id: string, payload: { name?: string }) =>
    crudService.update("groups", id, payload),
  delete: (id: string) =>
    crudService.remove("groups", id),
}
