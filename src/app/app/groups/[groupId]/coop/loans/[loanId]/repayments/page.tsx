'use client'

import { useParams } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { useCoopRepayments } from '@/lib/hooks/groupCoop'

export default function CoopRepaymentsPage() {
  const { loanId } = useParams() as { loanId: string }
  const { data: repayments, isLoading } = useCoopRepayments(loanId)

  if (isLoading) {
    return <p className="text-center text-muted-foreground">Loading pembayaran...</p>
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">📜 Histori Pembayaran</h1>

      {repayments?.length ? (
        <div className="relative border-l pl-6 space-y-6">
          {repayments.map((r: any, idx: number) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="relative"
            >
              {/* titik timeline */}
              <span className="absolute -left-3 top-2 w-3 h-3 rounded-full bg-primary" />

              <Card>
                <CardHeader>
                  <CardTitle>Pembayaran #{r.id}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Loan ID: {r.loan_id}</p>
                  <p>Jumlah: Rp {r.amount}</p>
                  <p>
                    Tanggal:{' '}
                    {r.created_at
                      ? format(new Date(r.created_at), 'dd MMM yyyy', { locale: id })
                      : '-'}
                  </p>
                  <p>Status: {r.status}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">Belum ada pembayaran</p>
      )}
    </div>
  )
}
