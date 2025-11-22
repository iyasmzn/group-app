'use client'

import { useParams } from 'next/navigation'
import { useLoanDetail, useUpdateLoanStatus } from '@/lib/hooks/groupCoop'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AppAvatar } from '@/components/ui/app-avatar'
import { Progress } from '@/components/ui/progress'
import { formatCurrency, formatDate } from '@/lib/utils/format'
import { diffDays } from '@/lib/utils/schedule'
import Reveal from '@/components/animations/Reveal'
import { Eye, FileX, HandCoins, History, Plus, X } from 'lucide-react'
import Link from 'next/link'
import LoadingOverlay from '@/components/loading-overlay'

export default function LoanDetailPage() {
  const { loanId, groupId } = useParams() as { loanId: string; groupId: string }
  const { data, isLoading } = useLoanDetail(loanId)
  const updateStatus = useUpdateLoanStatus()

  if (isLoading) return <LoadingOverlay isLoading={true} />
  if (!data?.data) return <EmptyLoan groupId={groupId} />

  const loan = data.data

  // progress tenor
  const startDate = loan.start_date ? new Date(loan.start_date) : null
  const dueDate = loan.due_date ? new Date(loan.due_date) : null
  const totalDays = diffDays(dueDate, startDate)
  const elapsedDays = diffDays(new Date(), startDate)
  const progress = Math.min(Math.max((elapsedDays / totalDays) * 100, 0), 100)

  return (
    <div className="max-w-2xl mx-auto py-4 md:p-6 space-y-6">
      <Reveal>
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HandCoins />
              <p>Detail Loan</p>
            </div>
            <Link href={`/app/groups/${groupId}/coop/loans`}>
              <Button variant={'outline'}>
                <X />
              </Button>
            </Link>
          </CardHeader>
        </Card>
      </Reveal>
      <Reveal>
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3">
                <AppAvatar
                  name={loan.group_coop_members?.profiles?.full_name || 'O'}
                  image={loan.group_coop_members?.profiles?.avatar_url}
                  size="sm"
                />
                <div>
                  <p className="font-medium">{loan.group_coop_members?.profiles?.full_name}</p>
                  <p className="text-sm text-muted-foreground">{loan.group_coop_members?.role}</p>
                </div>
              </div>
            </div>
            <Badge
              className="animate-pulse"
              variant={
                loan.status == 'pending'
                  ? 'default'
                  : loan.status == 'active'
                  ? 'success'
                  : 'secondary'
              }
            >
              {loan.status}
            </Badge>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-3xl font-bold text-primary">{formatCurrency(loan.principal)}</p>

            <div className="space-y-1">
              <Progress value={progress} />
              <p className="text-xs text-muted-foreground">{progress.toFixed(0)}% tenor berjalan</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Tenor</p>
                <p>{loan.term_months} bulan</p>
              </div>
              <div>
                <p className="text-muted-foreground">Bunga</p>
                <p>{loan.interest_rate}%</p>
              </div>
              <div>
                <p className="text-muted-foreground">Mulai</p>
                <p>{formatDate(loan.start_date)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Jatuh Tempo</p>
                <p>{formatDate(loan.due_date)}</p>
              </div>
            </div>

            {loan.note && <p className="italic text-sm text-muted-foreground">“{loan.note}”</p>}
          </CardContent>

          <CardFooter className="flex gap-2 justify-end">
            {loan.status !== 'completed' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateStatus.mutate({ loanId: loan.id, status: 'completed' })}
              >
                Tandai Selesai
              </Button>
            )}
          </CardFooter>
        </Card>
      </Reveal>

      {/* Repayment list */}
      <Reveal delay={0.3}>
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              Repayments
              <Link href={`/app/groups/${groupId}/coop/loans/${loanId}/repayments`}>
                <Button variant={'ghost'}>
                  <History />
                </Button>
              </Link>
            </CardTitle>
            {/* Tombol tambah di header */}
            <Link href={`/app/groups/${groupId}/coop/loans/${loanId}/repayments/form`}>
              <Button onClick={() => console.log('open add repayment form')}>
                <Plus /> Tambah
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {loan.group_coop_repayments?.length ? (
              <ul className="space-y-2">
                {loan.group_coop_repayments.map((r: any) => (
                  <li key={r.id} className="flex justify-between border-b pb-1 text-sm">
                    <span>{formatCurrency(r.amount)}</span>
                    <span className="text-muted-foreground">{formatDate(r.paid_at)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">Belum ada pembayaran</p>
            )}
          </CardContent>
        </Card>
      </Reveal>
    </div>
  )
}

function EmptyLoan({ groupId }: { groupId: string }) {
  return (
    <Reveal>
      <Card className="border-dashed border-muted-foreground/30 text-center py-10">
        <CardContent className="flex flex-col items-center gap-4">
          <FileX className="h-12 w-12 text-muted-foreground" />
          <div>
            <h3 className="text-lg font-semibold">Data loan tidak ditemukan.</h3>
          </div>
          <Link href={`/app/groups/${groupId}/coop/loans`}>
            <Button>Kembali</Button>
          </Link>
        </CardContent>
      </Card>
    </Reveal>
  )
}
