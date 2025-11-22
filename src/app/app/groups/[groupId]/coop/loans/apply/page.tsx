'use client'

import { useParams, useRouter } from 'next/navigation'
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
import { toast } from 'sonner'
import { addMonthsToDate } from '@/lib/utils/schedule'
import { ShineBorder } from '@/components/ui/shine-border'
import LoadingOverlay from '@/components/loading-overlay'
import { formatCurrency } from '@/lib/utils/format'

export default function ApplyLoanForm() {
  const { groupId } = useParams() as { groupId: string }
  const applyLoan = useApplyLoan()
  const { data: members, isLoading: loadingMembers } = useCoopMembers(groupId)
  const [saveLoading, setSaveLoading] = useState(false)
  const router = useRouter()

  const [form, setForm] = useState({
    coop_member_id: '',
    group_id: groupId,
    principal: 0,
    term_months: 12,
    interest_rate: 0,
    note: '',
    start_date: '',
    due_date: '',
  })

  function handlePrincipalChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, '') // ambil hanya angka
    const intVal = raw ? parseInt(raw, 10) : 0
    setForm({ ...form, principal: intVal })
  }

  async function handleSubmit() {
    try {
      setSaveLoading(true)
      if (!form.coop_member_id) {
        throw Error('Member required.')
      }
      if (!form.principal) {
        throw Error('Amount required.')
      }

      // tanggal mulai pinjaman = sekarang
      const startDate = new Date()

      // tanggal jatuh tempo = startDate + term_months
      let dueDate: Date | null = null
      if (form.term_months && form.term_months > 0) {
        dueDate = addMonthsToDate(startDate, form.term_months)
      }

      const payload = {
        ...form,
        start_date: startDate.toISOString(),
        due_date: dueDate ? dueDate.toISOString() : '',
      }

      const res = await applyLoan.mutateAsync(payload)

      // reset form setelah submit
      const resetForm = {
        ...form,
        coop_member_id: '',
        principal: 0,
        note: '',
        start_date: '',
        due_date: '',
      }
      setForm(resetForm)
      toast.success('Berhasil membuat pinjaman baru')
      router.push(`/app/groups/${groupId}/coop/loans${res.loan ? '/' + res.loan.id : ''}`)
    } catch (error) {
      toast.error(error ? error.toString() : 'Failed to apply loan')
      setSaveLoading(false)
    }
  }

  return (
    <>
      <LoadingOverlay isLoading={saveLoading} />
      <Reveal>
        <Card className="max-w-md mx-auto mt-6 relative">
          <ShineBorder shineColor={['#A07CFE', '#FE8FB5', '#FFBE7B']} />
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
    </>
  )
}
