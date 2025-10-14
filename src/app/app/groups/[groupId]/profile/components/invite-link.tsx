import { GlobalQRCode } from "@/components/global-qr-code";
import LoadingOverlay from "@/components/loading-overlay";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/lib/supabase/auth";
import { longDate } from "@/lib/utils/format";
import { copyToClipboard } from "@/lib/utils/clipboard";
import { createInvite } from "@/services/groupService/createInvite";
import { GroupInvite } from "@/types/group";
import { Copy, Link2, QrCode } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function InviteLink() {
  const [ open, setOpen ] = useState<boolean>(false)
  const [ loading, setLoading ] = useState<boolean>(false)
  const { groupId } = useParams()
  const { supabase } = useAuth()
  const [ invite, setInvite ] = useState<GroupInvite | null>(null)
  const [ inviteLink, setInviteLink ] = useState<string>("")

  useEffect(() => {
    setInviteLink(`${window.location.origin}/invite/${invite?.code}`)
  }, [invite])
  
  const handleOpen = async () => {
    try {
      if (!groupId) {
        toast.error('Group ID invalid.')
        return;
      }
      setLoading(true)
      // check active invite data
      const {data: inviteData, error: errInvite} = await supabase
        .from("group_invites")
        .select(`*`)
        .eq("group_id", groupId)
        .gte("expires_at", new Date().toISOString())
        .maybeSingle()
      console.log('invite', inviteData)

      if (errInvite) {
        toast.error(errInvite?.message || "Error getting invite link.")
        return
      } else if (inviteData) {
        setInvite(inviteData)
        setOpen(true)
        return
      }
      
      // get group role member
      const {data: role, error: errRole} = await supabase
        .from("group_roles")
        .select(`*`)
        .eq("group_id", groupId)
        .eq("code", 'member')
        .maybeSingle()

      if (errRole || !role) {
        toast.error(errRole?.message || "There is no member role. Can't share group via share link.")
        return;
      }

      await createInvite(groupId as string, role.id).then(res => {
        setInvite(res)
        setOpen(true)
      }).catch(err => {
        toast.error(err?.message || 'Failed to create new invite link.')
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async (text: string) => {
    const success = await copyToClipboard(text)
    if (success) toast.success("Copied to clipboard!")
    else toast.error("Failed to copy.")
  }
  
  return (
    <>
      <LoadingOverlay isLoading={loading} />
      <button className="flex flex-col py-2 px-3 rounded-xl items-center border border-primary hover:bg-secondary transition-all"
        onClick={handleOpen}
      >
        <Link2 className="w-7 h-7 text-primary" />
        <span className="text-xs mt-1 text-foreground">Invite</span>
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <span className="flex items-center gap-2">
                <QrCode />  Invite Member
              </span>
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            <GlobalQRCode text={inviteLink} />
          </div>
          <Card>
            <CardContent className="flex items-center gap-3">
              <Button className="flex-1" onClick={() => handleCopy(inviteLink)}>
                <Copy /> Copy Link
              </Button>
              <Button variant={"primary-outline"} className="flex-1"  onClick={() => invite && handleCopy(invite.code)}>
                <Copy /> Copy Code
              </Button>
            </CardContent>
          </Card>
          <p className="text-center text-secondary-foreground text-sm">Expires at: {invite && longDate(invite.expires_at)}</p>
          <DialogFooter className="sm:justify-center">
            <DialogClose asChild>
              <Button variant={'outline'}>
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}