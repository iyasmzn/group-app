'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { useCoopLoans } from '@/lib/hooks/groupCoop'
import { Button } from '@/components/ui/button'

export default function CoopLoansPage() {
  const { groupId } = useParams() as { groupId: string }
  const { data: loans, isLoading } = useCoopLoans(groupId)

  if (isLoading) {
    return <p className="text-center text-muted-foreground">Loading pinjaman...</p>
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">💰 Pinjaman Koperasi</h1>
        {/* Tombol Add Loan */}
        <Link href={`/app/groups/${groupId}/coop/loans/apply`}>
          <Button>+ Tambah Pinjaman</Button>
        </Link>
      </div>

      {loans?.data?.length ? (
        loans.data.map((loan: any) => (
          <motion.div
            key={loan.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Pinjaman #{loan.id}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Principal: Rp {loan.principal}</p>
                <p>Status: {loan.status}</p>
                <p>Tenor: {loan.term_months} bulan</p>
                <p>Bunga: {loan.interest_rate}%</p>
              </CardContent>
            </Card>
          </motion.div>
        ))
      ) : (
        <p className="text-muted-foreground">Belum ada pinjaman</p>
      )}
    </div>
  )
}
