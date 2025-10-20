'use client'

import { motion } from 'framer-motion'
import { ShineBorder } from './shine-border'

type ProgressBarProps = {
  progress: number // 0–100
  shine?: boolean
  barColor?: string
  shineColor?: string[] | string
  position?: 'top' | 'bottom'
}

export function ProgressBar({
  progress,
  shine = true,
  barColor = 'bg-primary',
  shineColor = ['#A07CFE', '#FE8FB5', '#FFBE7B'],
  position = 'bottom',
}: ProgressBarProps) {
  return (
    <div className={`absolute ${position}-0 left-0 w-full h-1 bg-muted overflow-hidden `}>
      <motion.div
        style={{ width: `${progress}%` }}
        className="h-full relative"
        transition={{ duration: 0.1, ease: 'linear' }}
      >
        {shine ? (
          <ShineBorder className="rounded-full" shineColor={shineColor} />
        ) : (
          <div className={`w-full h-full ${barColor} rounded-full`} />
        )}
      </motion.div>
    </div>
  )
}
