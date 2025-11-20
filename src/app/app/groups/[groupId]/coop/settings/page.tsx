'use client'

import { useParams } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useCoopSettings } from '@/lib/hooks/groupCoop'

export default function CoopSettingsPage() {
  const { groupId } = useParams() as { groupId: string }
  const { settings, loading, saveSettings, saving } = useCoopSettings(groupId)

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

  async function handleSave() {
    await saveSettings(form)
  }

  if (loading) {
    return <p className="text-center text-muted-foreground">Loading settings...</p>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto p-6"
    >
      <h1 className="text-2xl font-bold mb-6">⚙️ Pengaturan Koperasi</h1>

      <Card>
        <CardHeader>
          <CardTitle>Aturan Pinjaman</CardTitle>
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
              type="number"
              value={form.max_loan_amount}
              onChange={handleChange}
            />
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full mt-4">
            {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
