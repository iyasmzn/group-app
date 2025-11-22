'use client'

import Reveal from '@/components/animations/Reveal'
import { ImageUploader } from '@/components/image-uploader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ShineBorder } from '@/components/ui/shine-border'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/context/AuthContext'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { useAddRepayment } from '@/lib/hooks/groupCoop'
import { formatCurrency } from '@/lib/utils/format'
import { Database } from '@/types/database.types'
import { Undo2 } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

type RepaymentRow = Database['public']['Tables']['group_coop_repayments']['Row']
type NewRepayment = Omit<RepaymentRow, 'id' | 'created_at'>

export default function RepaymentFormPage() {
  const { user } = useAuth()
  const { loanId, groupId } = useParams() as { loanId: string; groupId: string }

  return (
    <div className="max-w-2xl mx-auto py-4 md:p-6 space-y-6">
      <Reveal>
        {user && user.id ? (
          <RepaymentForm groupId={groupId} loanId={loanId} currentUserId={user.id} />
        ) : (
          <div>Not logged user.</div>
        )}
      </Reveal>
    </div>
  )
}

export function RepaymentForm({
  groupId,
  loanId,
  currentUserId,
}: {
  groupId: string
  loanId: string
  currentUserId: string
}) {
  const addRepayment = useAddRepayment()
  const router = useRouter()

  const backUrl = `/app/groups/${groupId}/coop/loans/${loanId}/repayments`

  const [form, setForm] = useState<NewRepayment>({
    note: '',
    amount: 0,
    loan_id: loanId,
    paid_at: new Date().toISOString(),
    paid_by: currentUserId,
    proof_image_url: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value,
    }))
  }

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, '') // ambil hanya angka
    const intVal = raw ? parseInt(raw, 10) : 0
    setForm({ ...form, amount: intVal })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      console.log('form', form)
      const res = await addRepayment.mutateAsync(form)

      // kalau service kamu memang return { error }, cek di sini
      if (res.error) {
        toast.error(res.error.message)
      } else {
        toast.success('Berhasil menambah pembayaran.')
        router.push(backUrl)
      }
    } catch (err: any) {
      // error dilempar oleh React Query kalau mutationFn throw
      toast.error('Error: ' + (err.message ?? err))
    }
  }

  return (
    <Reveal delay={0.2}>
      <Card className="w-full max-w-md mx-auto relative">
        <ShineBorder shineColor={['#A07CFE']} />
        <CardHeader className="flex flex-row items-center gap-4">
          <Link href={backUrl}>
            <Button variant={'outline'}>
              <Undo2 />
            </Button>
          </Link>
          <CardTitle>Tambah Repayment</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Amount */}
            <div className="space-y-1">
              <Label htmlFor="amount">Jumlah</Label>
              <Input
                id="amount"
                type="text"
                name="amount"
                value={form.amount ? formatCurrency(form.amount) : ''}
                onChange={handleAmountChange}
                required
              />
            </div>

            {/* Date */}
            <div className="space-y-1">
              <Label htmlFor="paid_at">Tanggal Bayar</Label>
              <Input
                id="paid_at"
                type="date"
                name="paid_at"
                value={form.paid_at?.split('T')[0]}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    paid_at: new Date(e.target.value).toISOString(),
                  }))
                }
                required
              />
            </div>

            {/* Note */}
            <div className="space-y-1">
              <Label htmlFor="note">Catatan</Label>
              <Textarea
                id="note"
                name="note"
                value={form.note ?? ''}
                onChange={handleChange}
                placeholder="Opsional"
              />
            </div>

            {/* Proof Image */}
            <div className="space-y-1">
              <Label>Bukti Pembayaran</Label>
              <ImageUploader
                multiple={false}
                enableCrop={true}
                aspect={1}
                onUpload={async (files) => {
                  const file = files[0]
                  try {
                    const result = await uploadToCloudinary(file)
                    setForm((prev) => ({
                      ...prev,
                      proof_image_url: result?.secure_url || '',
                    }))
                  } catch (err) {
                    toast.error('Upload gagal:' + err)
                  }
                }}
              />
              {form.proof_image_url && (
                <div className="mt-2 flex items-center gap-2">
                  <img
                    src={form.proof_image_url}
                    alt="Bukti pembayaran"
                    className="h-24 w-24 object-cover rounded-md border"
                  />
                  <p className="text-xs text-green-600">Bukti terupload ✔</p>
                </div>
              )}
            </div>

            {/* Submit */}
            <Button type="submit" disabled={addRepayment.isPending} className="w-full">
              {addRepayment.isPending ? 'Menyimpan...' : 'Tambah Repayment'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Reveal>
  )
}
