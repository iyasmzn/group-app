"use client"

import { UserAvatar } from "./user-avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type UserAvatarGroupProps = {
  users: any[]
  max?: number // jumlah avatar yang ditampilkan
  size?: number
}

export function UserAvatarGroup({ users, max = 3, size = 40 }: UserAvatarGroupProps) {
  const displayUsers = users.slice(0, max)
  const extraCount = users.length - max

  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex items-center">
        {displayUsers.map((user, index) => {
          const name = user?.user_metadata?.full_name || user?.email || "User"
          return (
            <div
              key={user.id || index}
              className={`-ml-2 first:ml-0`}
              style={{ zIndex: users.length - index }}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <UserAvatar user={user} size={size} status={user.status} />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{name}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          )
        })}

        {extraCount > 0 && (
          <div
            className="-ml-2 rounded-full bg-gray-300 border flex items-center justify-center text-xs font-medium text-gray-700"
            style={{ width: size, height: size }}
          >
            +{extraCount}
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
