import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/supabase/auth"
import { PlusCircle } from "lucide-react"
import { useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { toast } from "sonner"

type AddGroupDialogProps = {
  setGroups: React.Dispatch<React.SetStateAction<any[]>>
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}


export function AddGroupDialog({ setGroups, setLoading }: AddGroupDialogProps) {
  const {user} = useAuth()
  const [newGroupName, setNewGroupName] = useState("")
  const [open, setOpen] = useState(false)
  
  const createGroup = async () => {
    if (!newGroupName.trim()) return
    setOpen(false)
    setLoading(true)

    const { data: group, error } = await supabase
      .from("groups")
      .insert([{ name: newGroupName, owner_id: user?.id }])
      .select()
      .single()

    if (error || !group) {
      toast.error(error?.message || "Failed to create group")
      setLoading(false)
      setOpen(true)
      return
    }

    // buat role owner default
    const { data: ownerRole } = await supabase
      .from("group_roles")
      .insert([{ 
        group_id: group.id, 
        name: "Owner", 
        permissions: ["manage_members","manage_roles","send_message","delete_message"] 
      }])
      .select()
      .single()

    if (!ownerRole) return

    // tambahkan creator sebagai member
    await supabase.from("group_members").insert([{ 
      group_id: group.id, 
      user_id: user?.id, 
      role_id: ownerRole.id 
    }])

    // update groups state in parent component
    setGroups(prev => [...prev, group])
    setNewGroupName("")
    setLoading(false)
  }
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusCircle /> Add
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Group</DialogTitle>
          <DialogDescription>
            Enter the name of the new group you want to create.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="name-1">Name</Label>
            <Input id="name-1" value={newGroupName} onChange={e => setNewGroupName(e.target.value)} />
          </div>
        </div>
        <DialogFooter className="grid grid-cols-2 gap-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button disabled={!newGroupName} onClick={() => createGroup()}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
