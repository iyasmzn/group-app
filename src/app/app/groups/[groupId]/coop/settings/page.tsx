'use client'

import { useParams } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useCoopMembers, useCoopSettings } from '@/lib/hooks/groupCoop'
import { toast } from 'sonner'
import Link from 'next/link'
import { Cog, Coins, Save, UserCog, Users2 } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/lib/utils/format'

export default function CoopSettingsPage() {
  const { groupId } = useParams() as { groupId: string }
  const { settings, loading, saveSettings, saving } = useCoopSettings(groupId)
  const { data: members = [], isLoading: isLoadingMember } = useCoopMembers(groupId)
  const [displayLoan, setDisplayLoan] = useState('')

  const [form, setForm] = useState({
    interest_rate: settings?.interest_rate ?? 0,
    max_loan_amount: settings?.max_loan_amount ?? 0,
  })

  useEffect(() => {
    if (settings) {
      setForm({
        interest_rate: settings.interest_rate ?? 0,
        max_loan_amount: settings.max_loan_amount ?? 0,
      })
    }
  }, [settings])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: Number(e.target.value) })
  }

  useEffect(() => {
    setDisplayLoan(form.max_loan_amount ? formatCurrency(form.max_loan_amount) : '')
  }, [form.max_loan_amount])

  function handleLoanChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^0-9]/g, '') // hanya angka
    const intVal = raw ? parseInt(raw, 10) : 0
    setForm({ ...form, max_loan_amount: intVal })
    setDisplayLoan(raw ? formatCurrency(intVal) : '')
  }

  async function handleSave() {
    try {
      await saveSettings(form)
      toast.success('Coop setting saved')
    } catch (err) {
      toast.error('Coop setting failed to save')
    }
  }

  if (loading) {
    return <p className="text-center text-muted-foreground">Loading settings...</p>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto p-6 space-y-6"
    >
      <h1 className="text-2xl font-bold mb-6">⚙️ Pengaturan Koperasi</h1>
      {/* Card Pengaturan Pinjaman */}
      <Card>
        <CardHeader>
          <CardTitle className="flex gap-2 items-center">
            <Coins /> Aturan Pinjaman
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="interest_rate">Bunga (%)</Label>
            <Input
              id="interest_rate"
              name="interest_rate"
              type="number"
              value={form.interest_rate}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max_loan_amount">Maksimal Pinjaman (Rp)</Label>
            <Input
              id="max_loan_amount"
              name="max_loan_amount"
              type="text"
              value={displayLoan}
              onChange={handleLoanChange}
            />
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full mt-4">
            <Save /> {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </Button>
        </CardContent>
      </Card>

      {/* Card Manage Anggota */}
      {isLoadingMember ? (
        <Card className="hover:shadow-lg transition">
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-40 rounded-md" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Skeleton jumlah anggota */}
            <Skeleton className="h-4 w-32 rounded-md" />

            {/* Skeleton tombol */}
            <Skeleton className="h-10 w-full rounded-md" />
          </CardContent>
        </Card>
      ) : (
        <Card className="hover:shadow-lg transition">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCog /> Kelola Anggota
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Jumlah anggota */}
            <p className="text-muted-foreground">
              Jumlah anggota: <span className="font-semibold">{members.length}</span>
            </p>

            {/* Tombol menuju halaman anggota */}
            <Link href={`/app/groups/${groupId}/coop/settings/members`}>
              <Button className="w-full rainbow-border" variant="ghost">
                <Cog /> Kelola Anggota
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </motion.div>
  )
}
