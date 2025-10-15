"use client"

import { motion } from "framer-motion"
import {
  ArrowLeft,
  MoreVertical,
  User,
  BellOff,
  Trash2,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { AppAvatar } from "@/components/ui/app-avatar"

interface PrivateChatTopbarProps {
  name: string
  avatar?: string
  status?: string
  className?: string
}

export function PrivateChatTopbar({
  name,
  avatar,
  status,
  className,
}: PrivateChatTopbarProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const handleDelete = () => {
    setOpen(false)
    console.log("Chat deleted!") // TODO: ganti dengan logic hapus chat
  }

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

        <AppAvatar name={name} image={avatar} size="sm" />

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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => console.log("View Profile")}>
              <User className="w-4 h-4 mr-2" />
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("Mute Chat")}>
              <BellOff className="w-4 h-4 mr-2" />
              Mute
            </DropdownMenuItem>

            {/* Delete with AlertDialog */}
            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()} // biar tidak langsung close
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Chat
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this chat?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. All messages in this chat will
                    be permanently removed.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  )
}