'use client'

import { useParams } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { useCoopRepayments } from '@/lib/hooks/groupCoop'
import LoadingOverlay from '@/components/loading-overlay'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Undo2 } from 'lucide-react'
import { PreviewImageDialog } from '@/components/preview-image-dialog'
import { getBlurThumbnailUrl } from '@/lib/cloudinary'

export default function CoopRepaymentsPage() {
  const { loanId, groupId } = useParams() as { loanId: string; groupId: string }
  const { data: repayments, isLoading } = useCoopRepayments(loanId)

  if (isLoading) {
    return <LoadingOverlay isLoading={true} />
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link href={`/app/groups/${groupId}/coop/loans/${loanId}`}>
            <Button variant={'outline'}>
              <Undo2 />
            </Button>
          </Link>
          <h1 className="text-xl md:text-2xl font-bold">📜 Histori Pembayaran</h1>
        </div>
        <Link
          href={`/app/groups/${groupId}/coop/loans/${loanId}/repayments/form`}
          className="fixed md:relative bottom-5 md:bottom-0 right-5 md:right-0 z-10"
        >
          <Button className="rounded-full h-13 w-13 md:h-auto md:w-auto">
            <Plus />
            <span className="hidden md:inline-block">Tambah</span>
          </Button>
        </Link>
      </div>

      {repayments?.length ? (
        <div className="relative border-l-2 border-muted pl-8 space-y-8">
          {repayments.map((r: any, idx: number) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="relative"
            >
              {/* titik timeline */}
              <span
                className={`absolute -left-[0.65rem] top-6 w-4 h-4 rounded-full ring-4 ring-background ${
                  r.status === 'pending' ? 'bg-yellow-500' : 'bg-green-500'
                }`}
              />

              <Card className="shadow-md hover:shadow-xl transition-transform hover:scale-[1.02]">
                <CardHeader className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Pembayaran #{idx + 1}</CardTitle>
                  <Badge
                    variant={r.status === 'pending' ? 'secondary' : 'outline'}
                    className="capitalize"
                  >
                    {r.status ?? 'selesai'}
                  </Badge>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Jumlah:</span>{' '}
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                      }).format(r.amount)}
                    </p>
                    <p>
                      <span className="font-medium">Tanggal:</span>{' '}
                      {r.paid_at ? format(new Date(r.paid_at), 'dd MMM yyyy', { locale: id }) : '-'}
                    </p>
                    {r.note && r.note.trim() !== '' && (
                      <p>
                        <span className="font-medium">Catatan:</span> {r.note}
                      </p>
                    )}
                  </div>

                  {r.proof_image_url && r.proof_image_url !== '' && (
                    <div className="flex items-center justify-center relative">
                      <PreviewImageDialog
                        name={r.id}
                        image={r.proof_image_url}
                        thumb={getBlurThumbnailUrl(r.proof_image_url)}
                        trigger={
                          <img
                            src={r.proof_image_url}
                            alt="Bukti pembayaran"
                            className="h-32 w-32 object-cover rounded-md border hover:scale-105 transition-transform"
                          />
                        }
                      />
                    </div>
                  )}
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
