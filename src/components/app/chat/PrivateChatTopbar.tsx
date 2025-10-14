"use client"

import { motion } from "framer-motion"
import { ArrowLeft, MoreVertical } from "lucide-react"
import { useRouter } from "next/navigation"
import { GroupAvatar } from "@/components/group-avatar"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PrivateChatTopbarProps {
  name: string
  avatar?: string
  status?: string // e.g. "online", "typing..."
  className?: string
}

export function PrivateChatTopbar({
  name,
  avatar,
  status,
  className,
}: PrivateChatTopbarProps) {
  const router = useRouter()

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "flex items-center justify-between px-3 py-2 border-b bg-background/80 backdrop-blur-md sticky top-0 z-50",
        className
      )}
    >
      {/* Left: Back + Avatar + Info */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <GroupAvatar name={name} image={avatar} size="sm" />

        <div className="flex flex-col leading-tight">
          <span className="font-medium text-sm">{name}</span>
          {status && (
            <motion.span
              key={status}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-muted-foreground"
            >
              {status}
            </motion.span>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1">
        <ModeToggle />
        <Button variant="ghost" size="icon" className="rounded-full">
          <MoreVertical className="w-5 h-5" />
        </Button>
      </div>
    </motion.header>
  )
}