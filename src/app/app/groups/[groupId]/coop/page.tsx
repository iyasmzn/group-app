'use client'

import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useParams } from 'next/navigation'
import { useCoopDashboard, useLedgerSummary } from '@/lib/hooks/groupCoop'
import Link from 'next/link'
import { Settings2 } from 'lucide-react'
import { formatScheduleDate } from '@/lib/utils/schedule'
import { AppAvatar } from '@/components/ui/app-avatar'
import { formatCurrency } from '@/lib/utils/format'

export default function CoopPage() {
  const params = useParams()
  const groupId = params?.groupId as string

  const { data: dashboard, isLoading: loadingDashboard } = useCoopDashboard(groupId)
  const { data: summary, isLoading: loadingSummary } = useLedgerSummary(groupId)

  if (loadingDashboard || loadingSummary) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-muted-foreground"
        >
          Loading dashboard...
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <h1 className="text-2xl font-bold">📊 Dashboard Koperasi</h1>
        <Link href={`/app/groups/${groupId}/coop/settings`}>
          <Button variant="outline">
            <Settings2 />
            Kelola Pengaturan
          </Button>
        </Link>
      </motion.div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div whileHover={{ scale: 1.02 }}>
          <Card>
            <CardHeader>
              <CardTitle>Total Pinjaman</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">
              {formatCurrency(summary?.total_loans ?? 0)}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }}>
          <Card>
            <CardHeader>
              <CardTitle>Total Pembayaran</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">
              {formatCurrency(summary?.total_repayments ?? 0)}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }}>
          <Card>
            <CardHeader>
              <CardTitle>Sisa Tunggakan</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold text-red-500">
              {formatCurrency(summary?.outstanding_balance ?? 0)}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle>Transaksi Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            {dashboard?.recentTransactions?.length ? (
              <div className="space-y-3">
                {dashboard.recentTransactions.map((tx: any) => (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between rounded-md border p-3 hover:bg-muted/50 transition"
                  >
                    {/* Kiri: avatar + detail */}
                    <div className="flex items-center gap-3">
                      <AppAvatar
                        name={tx.profiles?.full_name}
                        image={tx.profiles?.avatar_url || undefined}
                        size="sm"
                      />
                      <div>
                        <p className="font-medium">{tx.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {tx.profiles?.full_name} •{' '}
                          {formatScheduleDate(new Date(tx.created_at), 'dd MMM yyyy HH:mm')}
                        </p>
                      </div>
                    </div>

                    {/* Kanan: nominal */}
                    <span
                      className={`font-semibold ${
                        tx.entry_type === 'debit' ? 'text-red-500' : 'text-green-600'
                      }`}
                    >
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        maximumFractionDigits: 0,
                      }).format(tx.amount)}
                    </span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Belum ada transaksi</p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
