'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { JSX, useEffect, useState, useRef } from 'react'
import { Hammer, Clock, Info, ShieldAlert, CheckCircle2, X } from 'lucide-react'
import { ProgressBar } from './ui/progress-bar'
import { ShineBorder } from './ui/shine-border'

type Variant = 'soon' | 'maintenance' | 'info' | 'warning' | 'success'

type StatusCardProps = {
  title?: string
  description?: string
  variant?: Variant
  actionLabel?: string
  actionHref?: string
  secondaryActionLabel?: string
  secondaryAction?: () => void
  autoDismiss?: number // ms
  onDismiss?: () => void
  className?: string
  shineBorder?: boolean
  shineBorderColor?: string[] | string
  progressShine?: boolean
  progressBarColor?: string
  progressShineColor?: string[] | string
  progressPosition?: 'top' | 'bottom'
  closable?: boolean
}

export default function StatusCard({
  title = 'Coming Soon 🚀',
  description = 'Fitur ini sedang dalam pengembangan. Nantikan update berikutnya!',
  variant = 'soon',
  actionLabel = 'Kembali ke Beranda',
  actionHref = '/',
  secondaryActionLabel = 'Hubungi Support',
  secondaryAction,
  autoDismiss,
  onDismiss,
  className,
  shineBorder = false,
  shineBorderColor = ['#A07CFE', '#FE8FB5', '#FFBE7B'],
  progressShine = false,
  progressBarColor = 'bg-primary',
  progressShineColor = ['#A07CFE', '#FE8FB5', '#FFBE7B'],
  progressPosition = 'bottom',
  closable = false,
}: StatusCardProps) {
  const router = useRouter()
  const [visible, setVisible] = useState(true)
  const [progress, setProgress] = useState(100)
  const [paused, setPaused] = useState(false)
  const startRef = useRef(Date.now())
  const elapsedRef = useRef(0)

  useEffect(() => {
    if (autoDismiss) {
      let frame: number
      const tick = () => {
        if (!paused) {
          const elapsed = Date.now() - startRef.current + elapsedRef.current
          const percent = Math.max(0, 100 - (elapsed / autoDismiss) * 100)
          setProgress(percent)
          if (elapsed >= autoDismiss) {
            setVisible(false)
            onDismiss?.()
            return
          }
        }
        frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
      return () => cancelAnimationFrame(frame)
    }
  }, [paused, autoDismiss, onDismiss])

  const handleClose = () => {
    setVisible(false)
    onDismiss?.()
  }

  const variantConfig: Record<Variant, { icon: JSX.Element }> = {
    soon: { icon: <Clock className="w-12 h-12 text-primary" /> },
    maintenance: { icon: <Hammer className="w-12 h-12 text-yellow-500" /> },
    info: { icon: <Info className="w-12 h-12 text-blue-500" /> },
    warning: { icon: <ShieldAlert className="w-12 h-12 text-orange-500" /> },
    success: { icon: <CheckCircle2 className="w-12 h-12 text-green-500" /> },
  }

  const { icon } = variantConfig[variant]

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="status-card"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className={cn('flex justify-center items-center py-20 px-4', className)}
        >
          <Card
            className="relative max-w-md w-full shadow-lg border border-border/50 overflow-hidden"
            onMouseEnter={() => {
              setPaused(true)
              elapsedRef.current += Date.now() - startRef.current
            }}
            onMouseLeave={() => {
              setPaused(false)
              startRef.current = Date.now()
            }}
          >
            {shineBorder && <ShineBorder className="w-full h-full" shineColor={shineBorderColor} />}

            {closable && (
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 p-1 rounded-md hover:bg-muted transition"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}

            <CardHeader className="flex flex-col items-center text-center space-y-3">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                {icon}
              </motion.div>
              <CardTitle className="text-2xl font-semibold">{title}</CardTitle>
              <CardDescription className="text-muted-foreground">{description}</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center gap-3 pt-4">
              <Button onClick={() => router.push(actionHref)}>{actionLabel}</Button>
              {secondaryAction && (
                <Button variant="outline" onClick={secondaryAction}>
                  {secondaryActionLabel}
                </Button>
              )}
            </CardContent>

            {autoDismiss && (
              <ProgressBar
                progress={progress}
                shine={progressShine}
                barColor={progressBarColor}
                shineColor={progressShineColor}
                position={progressPosition}
              />
            )}
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
