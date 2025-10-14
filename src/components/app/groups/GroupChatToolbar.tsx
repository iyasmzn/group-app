"use client"

import { motion } from "framer-motion"
import {
  ArrowLeft,
  MoreVertical,
  Users,
  BellOff,
  LogOut,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { GroupAvatar } from "@/components/group-avatar"
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

interface GroupChatTopbarProps {
  groupId: string
  name: string
  avatar?: string
  membersCount?: number
  className?: string
}

export function GroupChatTopbar({
  groupId,
  name,
  avatar,
  membersCount,
  className,
}: GroupChatTopbarProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const handleLeave = () => {
    setOpen(false)
    console.log("Left group!") // TODO: ganti dengan logic leave group
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

        <GroupAvatar name={name} image={avatar} size="sm" />

        <div className="flex flex-col leading-tight">
          <span className="font-medium text-sm">{name}</span>
          {membersCount !== undefined && (
            <span className="text-xs text-muted-foreground">
              {membersCount} members
            </span>
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
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={() => router.push(`members`)}>
              <Users className="w-4 h-4 mr-2" />
              View Members
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("Mute Group")}>
              <BellOff className="w-4 h-4 mr-2" />
              Mute Group
            </DropdownMenuItem>

            {/* Leave Group with AlertDialog */}
            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="text-red-600 focus:text-red-600"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Leave Group
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Leave this group?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You will no longer receive messages or notifications from
                    this group.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleLeave}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Leave
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