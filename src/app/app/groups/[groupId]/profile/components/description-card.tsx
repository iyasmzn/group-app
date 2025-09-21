import LoadingOverlay from "@/components/loading-overlay";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/supabase/auth";
import { longDateTime } from "@/lib/utils/format";
import { groupService } from "@/services/groupService";
import { Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type DescriptionCardProps = {
  group?: any
}

export default function DescriptionCard({group} : DescriptionCardProps) {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [descriptionFinal, setDescriptionFinal] = useState("")
  const [description, setDescription] = useState("")
  const [descriptionUpdatedat, setDescriptionUpdatedat] = useState<Date | null>(null)
  const [descriptionUpdatedby, setDescriptionUpdatedby] = useState("")
  const { update } = groupService
  const { user } = useAuth()
  
  if (!group) {
    return (
    <Card className="mb-4">
      <CardHeader>
        <CardDescription>
          Description
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-100"></Skeleton>
        <CardDescription className="pt-2">
          <Skeleton className="h-4 w-50"></Skeleton>
        </CardDescription>
      </CardContent>
    </Card>
    )
  }

  useEffect(() => {
    setDescriptionFinal(group.description)
    setDescriptionUpdatedat(group.description_updatedat)
    setDescriptionUpdatedby(group?.desc_updatedby?.full_name)
  }, [])
  
  const updateDescription = async () => {
    setOpen(false)
    setLoading(true)

    const now = new Date()
    
    await update(group.id, {
      description: description,
      description_updatedat: now,
      description_updatedby: user?.id
    }).then(res => {
      console.log('res',res)
      setDescriptionFinal(description)
      setDescriptionUpdatedat(now)
      setDescriptionUpdatedby(user?.user_metadata?.full_name)
      
      toast.success("Update description success.")
    }).catch(error => {
      toast.error(error?.message || "Update groups description error.")
      setDescription(group?.description)
      setDescriptionUpdatedat(group?.description_updatedat)
      setDescriptionUpdatedby(group?.desc_updatedby?.full_name)
    }).finally(() => {
      setLoading(false)
    })
    
  }
  
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit />
            Description
          </DialogTitle>
          <DialogDescription>
            Enter the description of the group you want.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="name-1"></Label>
            <Textarea id="name-1" value={description} onChange={e => setDescription(e.target.value)} />
          </div>
        </div>
        <DialogFooter className="grid grid-cols-2 gap-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button disabled={!description} onClick={() => updateDescription()}>Save changes</Button>
        </DialogFooter>
        </DialogContent>
      </Dialog>
      <Card className="mb-4 relative overflow-hidden">
        <CardHeader>
          <CardDescription>
            Description
          </CardDescription>
          {
            group?.description && 
            <CardAction>
              <Button variant={"outline"} onClick={() => {setOpen(true);setDescription(group?.description)}}>
                <Edit />
              </Button> 
            </CardAction>
          }
        </CardHeader>
        <CardContent>
          <LoadingOverlay isLoading={loading} absolute />
          {
            loading && 
            <Skeleton className="h-6 w-70"></Skeleton>
          }
          { !loading && descriptionFinal} 
          { !loading && !descriptionFinal ? (
            <span className="text-secondary-foreground flex items-center gap-2">Type your description here. 
              <Button variant={"outline"} onClick={() => {setOpen(true);setDescription(group?.description)}}>
                <Edit />
              </Button>
            </span>
          ) : null }
          {
            descriptionUpdatedat &&
            <CardDescription className="flex flex-col items-end">
              {
                loading ? <>
                  <Skeleton className="h-5 w-50 mb-2"></Skeleton>
                  <Skeleton className="h-5 w-20"></Skeleton>
                </> 
                :
                <>
                  <span>
                    updated at { longDateTime(descriptionUpdatedat) }
                  </span>
                  <span>
                    by { descriptionUpdatedby }
                  </span>
                </>
              }
            </CardDescription>
          }
        </CardContent>
      </Card>
    </>
  )
}