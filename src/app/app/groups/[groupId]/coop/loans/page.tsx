'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { useApproveLoan, useCoopLoans, useDeleteLoan } from '@/lib/hooks/groupCoop'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AppAvatar } from '@/components/ui/app-avatar'
import { formatCurrency, formatDate } from '@/lib/utils/format'
import { diffDays } from '@/lib/utils/schedule'
import LoadingOverlay from '@/components/loading-overlay'
import { CheckCircle, FileX, Info, Plus, Trash } from 'lucide-react'
import { AppConfirmDialog } from '@/components/ui/app-confirm-dialog'
import { toast } from 'sonner'
import Reveal from '@/components/animations/Reveal'
import { Progress } from '@/components/ui/progress'
import { useAuth } from '@/context/AuthContext'

export default function CoopLoansPage() {
  const { groupId } = useParams() as { groupId: string }
  const { data: loans, isLoading } = useCoopLoans(groupId)
  const { user } = useAuth()

  if (isLoading || !user) {
    return <LoadingOverlay absolute />
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-bold">💰 Pinjaman Koperasi</h1>
        <Link
          href={`/app/groups/${groupId}/coop/loans/apply`}
          className="fixed md:relative bottom-21 md:bottom-0 right-4 md:right-4"
        >
          <Button className="rounded-full h-13 w-13 md:h-auto md:w-auto">
            <Plus className="text-3xl" />
            <span className="hidden md:inline-block">Tambah</span>
          </Button>
        </Link>
      </div>

      {loans?.data?.length ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loans.data.map((loan: any) => (
            <motion.div
              key={loan.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <LoanCard loan={loan} groupId={groupId} userId={user.id} />
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyLoans groupId={groupId} />
      )}
    </div>
  )
}

function LoanCard({ loan, groupId, userId }: { loan: any; groupId: string; userId: string }) {
  // Hitung progress tenor
  const totalDays = diffDays(new Date(loan.due_date), new Date(loan.start_date))
  const elapsedDays = diffDays(new Date(), new Date(loan.start_date))
  const progress = Math.min(Math.max((elapsedDays / totalDays) * 100, 0), 100)

  const approveLoan = useApproveLoan()
  const deleteLoan = useDeleteLoan(groupId)

  const handleApprove = async (loan: any, userId: string) => {
    const { error } = await approveLoan.mutateAsync({ loanId: loan.id, approvedBy: userId })
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Berhasil approve loan.')
    }
  }
  const handleDelete = async (loan: any) => {
    const { error } = await deleteLoan.mutateAsync(loan.id)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Berhasil menghapus loan.')
    }
  }

  return (
    <Card className="hover:shadow-lg transition border border-muted">
      {/* Header: Member info + status */}
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <AppAvatar
            name={loan.group_coop_members?.profiles?.full_name || 'O'}
            image={loan.group_coop_members?.profiles?.avatar_url}
            size="sm"
          />
          <div>
            <p className="font-medium text-sm">{loan.group_coop_members?.profiles?.full_name}</p>
            <p className="text-xs text-muted-foreground">
              {loan.group_coop_members?.role} • {loan.group_coop_members?.status}
            </p>
          </div>
        </div>
        <Badge
          variant={
            loan.status === 'pending'
              ? 'default'
              : loan.status === 'active'
              ? 'success'
              : 'secondary'
          }
          className="text-xs animate-pulse"
        >
          {loan.status}
        </Badge>
      </CardHeader>

      {/* Body: Fokus ke jumlah */}
      <CardContent className="mt-2 space-y-2">
        <p className="text-2xl font-bold text-primary">{formatCurrency(loan.principal)}</p>

        {/* Progress bar tenor */}
        <div className="space-y-1">
          <Progress value={progress} />
          <p className="text-xs text-muted-foreground">{progress.toFixed(0)}% tenor berjalan</p>
        </div>

        {/* Detail kecil */}
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div>
            <p>Tenor</p>
            <p className="font-medium text-foreground">{loan.term_months} bln</p>
          </div>
          <div>
            <p>Bunga</p>
            <p className="font-medium text-foreground">{loan.interest_rate}%</p>
          </div>
          <div>
            <p>Mulai</p>
            <p className="font-medium text-foreground">{formatDate(loan.start_date)}</p>
          </div>
          <div>
            <p>Jatuh Tempo</p>
            <p className="font-medium text-foreground">{formatDate(loan.due_date)}</p>
          </div>
        </div>

        {loan.note && <p className="italic text-xs text-muted-foreground mt-1">“{loan.note}”</p>}
      </CardContent>

      {/* Footer: Action */}
      <CardFooter className="flex justify-stretch gap-2">
        <Link href={`/app/groups/${groupId}/coop/loans/${loan.id}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full">
            <Info /> Detail
          </Button>
        </Link>
        {loan.status == 'pending' && (
          <>
            {/* approve */}
            <AppConfirmDialog
              trigger={
                <Button variant="success-outline" size="sm" className="flex-1">
                  <CheckCircle /> Setujui
                </Button>
              }
              title="Setujui Pengajuan?"
              description="Apakah kamu yakin ingin menyetujui pengajuan ini? Tindakan ini tidak bisa dibatalkan."
              confirmText="Ya, Setujui"
              cancelText="Batal"
              onConfirm={() => {
                handleApprove(loan, userId)
              }}
            />
            {/* delete */}
            <AppConfirmDialog
              trigger={
                <Button variant="destructive" size="sm">
                  <Trash />
                </Button>
              }
              title="Hapus Data?"
              description="Apakah kamu yakin ingin menghapus data ini? Tindakan ini tidak bisa dibatalkan."
              confirmText="Ya, Hapus"
              cancelText="Batal"
              onConfirm={() => {
                handleDelete(loan)
              }}
            />
          </>
        )}
      </CardFooter>
    </Card>
  )
}

function EmptyLoans({ groupId }: { groupId: string }) {
  return (
    <Reveal>
      <Card className="border-dashed border-muted-foreground/30 text-center py-10">
        <CardContent className="flex flex-col items-center gap-4">
          <FileX className="h-12 w-12 text-muted-foreground" />
          <div>
            <h3 className="text-lg font-semibold">Belum ada pinjaman</h3>
            <p className="text-sm text-muted-foreground">
              Anggota koperasi belum mengajukan pinjaman. Mulai ajukan pinjaman baru sekarang.
            </p>
          </div>
          <Link href={`/app/groups/${groupId}/coop/loans/apply`}>
            <Button>Ajukan Pinjaman</Button>
          </Link>
        </CardContent>
      </Card>
    </Reveal>
  )
}
