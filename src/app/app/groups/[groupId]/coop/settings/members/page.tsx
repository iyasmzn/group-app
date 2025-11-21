'use client'

import { useParams } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { motion } from 'framer-motion'
import { useCoopMembers } from '@/lib/hooks/groupCoop'

export default function CoopMembersPage() {
  const { groupId } = useParams() as { groupId: string }
  const { data: members = [], isLoading } = useCoopMembers(groupId)

  if (isLoading) {
    return <p className="text-center text-muted-foreground">Loading anggota...</p>
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">👥 Anggota Koperasi</h1>

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
                <Avatar>
                  <AvatarImage src={m.profiles?.avatar_url ?? undefined} />
                  <AvatarFallback>{m.profiles?.full_name?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{m.profiles?.full_name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {m.role} • {m.status}
                  </p>
                </div>
              </CardHeader>
            </Card>
          </motion.div>
        ))
      ) : (
        <p className="text-muted-foreground">Belum ada anggota aktif</p>
      )}
    </div>
  )
}
