'use client'

import { useParams } from 'next/navigation'
import { useApplyLoan, useCoopMembers } from '@/lib/hooks/groupCoop'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

// contoh: hook untuk ambil daftar anggota koperasi

export default function ApplyLoanForm() {
  const { groupId } = useParams() as { groupId: string }
  const applyLoan = useApplyLoan()
  const { data: members, isLoading: loadingMembers } = useCoopMembers(groupId)

  const [form, setForm] = useState({
    coop_member_id: '',
    group_id: groupId,
    principal: 0,
    term_months: 12,
    interest_rate: 10,
    note: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm({ ...form, [name]: name === 'note' ? value : Number(value) })
  }

  async function handleSubmit() {
    await applyLoan.mutateAsync(form)
    setForm({ ...form, principal: 0, note: '' })
  }

  return (
    <Card className="max-w-md mx-auto mt-6">
      <CardHeader>
        <CardTitle>Ajukan Pinjaman Baru</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Select anggota koperasi */}
        <div className="space-y-2">
          <Label htmlFor="coop_member_id">Anggota Koperasi</Label>
          <select
            id="coop_member_id"
            name="coop_member_id"
            value={form.coop_member_id}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="">-- Pilih Anggota --</option>
            {!loadingMembers &&
              members?.map((m: any) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="principal">Jumlah Pinjaman</Label>
          <Input
            id="principal"
            name="principal"
            type="number"
            value={form.principal}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="term_months">Tenor (bulan)</Label>
          <Input
            id="term_months"
            name="term_months"
            type="number"
            value={form.term_months}
            onChange={handleChange}
          />
        </div>

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
          <Label htmlFor="note">Catatan</Label>
          <Input id="note" name="note" type="text" value={form.note} onChange={handleChange} />
        </div>

        <Button onClick={handleSubmit} disabled={applyLoan.isPending} className="w-full">
          {applyLoan.isPending ? 'Mengajukan...' : 'Ajukan Pinjaman'}
        </Button>
      </CardContent>
    </Card>
  )
}
