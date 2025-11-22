'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { motion } from 'framer-motion' // Tambah import Framer Motion
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type ModeToggleVariant = 'dropdown' | 'switch'

interface ModeToggleProps {
  variant?: ModeToggleVariant
}

export function ModeToggle({ variant = 'dropdown' }: ModeToggleProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false) // Untuk hindari hydration mismatch

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Handler untuk switch: Toggle light/dark
  const handleSwitchToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  // Jika belum mounted (server-side), tampilkan placeholder untuk hindari flash
  if (!mounted) {
    return (
      <Button variant="outline" size="icon" disabled>
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    )
  }

  if (variant === 'switch') {
    const isDark = theme === 'dark'
    return (
      <div className="flex items-center space-x-2">
        <motion.div
          animate={{ rotate: isDark ? 180 : 0, scale: isDark ? 1.1 : 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-500" />
        </motion.div>
        <Switch
          checked={isDark}
          onCheckedChange={handleSwitchToggle}
          aria-label="Toggle theme"
          className="data-[state=checked]:bg-blue-600" // Tambah styling jika perlu
        />
        <motion.div
          animate={{ rotate: isDark ? 0 : -180, scale: isDark ? 1 : 1.1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <Moon className="h-[1.2rem] w-[1.2rem] text-blue-500" />
        </motion.div>
      </div>
    )
  }

  // Default: Dropdown
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
