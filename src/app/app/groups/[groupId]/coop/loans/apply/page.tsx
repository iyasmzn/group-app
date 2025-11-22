'use client'

import { useParams } from 'next/navigation'
import { useApplyLoan, useCoopMembers } from '@/lib/hooks/groupCoop'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AppAvatar } from '@/components/ui/app-avatar'
import { Undo2 } from 'lucide-react'
import Link from 'next/link'
import Reveal from '@/components/animations/Reveal'
import { Textarea } from '@/components/ui/textarea'

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

  // format currency untuk tampilan
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(value)

  function handlePrincipalChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, '') // ambil hanya angka
    const intVal = raw ? parseInt(raw, 10) : 0
    setForm({ ...form, principal: intVal })
  }

  async function handleSubmit() {
    await applyLoan.mutateAsync(form)
    setForm({ ...form, principal: 0, note: '' })
  }

  return (
    <Reveal>
      <Card className="max-w-md mx-auto mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link href={`/app/groups/${groupId}/coop/loans`}>
              <Undo2 />
            </Link>
            Ajukan Pinjaman Baru
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Select anggota koperasi */}
          <div className="space-y-2">
            <Label htmlFor="coop_member_id">Anggota Koperasi</Label>
            <Select
              value={form.coop_member_id}
              onValueChange={(val) => setForm({ ...form, coop_member_id: val })}
            >
              <SelectTrigger id="coop_member_id" className="w-full">
                <SelectValue placeholder="-- Pilih Anggota --" />
              </SelectTrigger>
              <SelectContent>
                {!loadingMembers &&
                  members?.map((m: any) => (
                    <SelectItem key={m.id} value={m.id}>
                      <AppAvatar
                        name={m.profiles.full_name}
                        image={m.profiles?.avatar_url || undefined}
                        size="xs"
                      />
                      {m.profiles.full_name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Principal dengan format currency */}
          <div className="space-y-2">
            <Label htmlFor="principal">Jumlah Pinjaman</Label>
            <Input
              id="principal"
              name="principal"
              type="text"
              value={form.principal ? formatCurrency(form.principal) : ''}
              onChange={handlePrincipalChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="term_months">Tenor (bulan)</Label>
            <Input
              id="term_months"
              name="term_months"
              type="number"
              value={form.term_months}
              onChange={(e) => setForm({ ...form, term_months: Number(e.target.value) })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="interest_rate">Bunga (%)</Label>
            <Input
              id="interest_rate"
              name="interest_rate"
              type="number"
              value={form.interest_rate}
              onChange={(e) => setForm({ ...form, interest_rate: Number(e.target.value) })}
            />
          </div>

          {/* Catatan */}
          <div className="space-y-2">
            <Label htmlFor="note">Catatan</Label>
            <Textarea
              id="note"
              name="note"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="Catatan pinjaman..."
              className="min-h-[120px]"
            />
          </div>

          <Button onClick={handleSubmit} disabled={applyLoan.isPending} className="w-full">
            {applyLoan.isPending ? 'Mengajukan...' : 'Ajukan Pinjaman'}
          </Button>
        </CardContent>
      </Card>
    </Reveal>
  )
}
