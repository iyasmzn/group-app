'use client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useGroupBadges } from '@/context/GroupBadgeContext'
import { EllipsisVertical, MessageCircle } from 'lucide-react'

export function GroupTopbarMenu() {
  const { chat } = useGroupBadges()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisVertical className="text-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Group Menu</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <MessageCircle className="h-4 w-4 mr-2" />
          Chat
          {chat > 0 && (
            <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
              {chat}
            </span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Leave Group</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
