'use client'

import { useParams } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { useAddCoopMember, useCoopMembers, useRemoveCoopMember } from '@/lib/hooks/groupCoop'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Plus, XIcon } from 'lucide-react'
import { MemberMultiSelect } from '@/components/app/events/MemberMultiSelect'
import { useGroupMembers } from '@/lib/hooks/useGroupMembers'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useState } from 'react'
import { AppAvatar } from '@/components/ui/app-avatar'

export default function CoopMembersPage() {
  const { groupId } = useParams() as { groupId: string }
  const { data: members = [], isLoading } = useCoopMembers(groupId)
  const { members: groupMembers, loading: groupLoading } = useGroupMembers(groupId)
  const [loading, setLoading] = useState<Boolean>(false)

  const addMemberMutation = useAddCoopMember()
  const removeMemberMutation = useRemoveCoopMember()

  const setSelectedMembers = async (ids: string[]) => {
    try {
      setLoading(true)
      const alreadySelectedIds = members.map((v) => v.user_id)
      console.log('ids', ids)
      const userIdNew = ids.filter((v) => !alreadySelectedIds.includes(v)).toString()
      console.log('ids 2', ids)
      console.log('userIdNew', userIdNew)
      if (userIdNew) {
        const { error: errorAdd } = await addMemberMutation.mutateAsync({
          groupId,
          userId: userIdNew,
        })
        if (errorAdd) {
          toast.error(errorAdd.message)
          return
        }
        toast.success('Anggota berhasil ditambahkan')
      }

      const userIdOld = alreadySelectedIds.filter((v) => !ids.includes(v)).toString()
      console.log('ids 3', ids)
      console.log('userIdOld', userIdOld)
      if (userIdOld) {
        await removeMembers(userIdOld)
      }
    } catch (err) {
      setLoading(false)
      toast.error('Gagal menambahkan anggota')
    }
  }

  const removeMembers = async (userId: string) => {
    const { error: errorRmv } = await removeMemberMutation.mutateAsync({
      groupId,
      userId,
    })
    if (errorRmv) {
      toast.error(errorRmv.message)
      return
    }
    toast.success('Anggota berhasil dihapuskan')
  }

  if (isLoading) {
    return <p className="text-center text-muted-foreground">Loading anggota...</p>
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-4">👥 Anggota Koperasi</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" /> Tambah Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Member</DialogTitle>
            </DialogHeader>

            <div>
              {/* Pilih dari member grup */}
              <MemberMultiSelect
                members={groupMembers.map((v) => {
                  return { ...v, full_name: v.profiles.full_name }
                })}
                selected={members.map((v) => v.user_id)}
                onChange={setSelectedMembers}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {members.length ? (
        members.map((m: any) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader className="flex items-center gap-4">
                <AppAvatar
                  name={m.profiles?.full_name || 'O'}
                  image={m.profiles?.avatar_url ?? undefined}
                  preview
                />
                <div>
                  <CardTitle>{m.profiles?.full_name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {m.role} • {m.status}
                  </p>
                </div>
                <div className="flex-1">{/* untuk stat per user */}</div>
                <div>
                  <Button onClick={() => removeMembers(m.user_id)} variant={'destructive-outline'}>
                    <XIcon />
                  </Button>
                </div>
              </CardHeader>
            </Card>
          </motion.div>
        ))
      ) : (
        <>
          <p className="text-muted-foreground">
            Belum ada anggota aktif. Silakan tambah anggota dari grup.
          </p>
        </>
      )}
    </div>
  )
}
