"use client"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { AppAvatar } from "./app-avatar"

type AvatarItem = {
  id: string | number
  name: string
  image?: string | null
  status?: "online" | "offline" | "away"
}

type AppAvatarGroupProps = {
  items: AvatarItem[]
  max?: number
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl"
}

export function AppAvatarGroup({ items, max = 3, size = "md" }: AppAvatarGroupProps) {
  const displayItems = items.slice(0, max)
  const extraCount = items.length - max

  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex items-center">
        {displayItems.map((item, index) => (
          <div
            key={item.id}
            className="-ml-2 first:ml-0"
            style={{ zIndex: items.length - index }}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <AppAvatar
                    name={item.name}
                    image={item.image}
                    size={size}
                    status={item.status}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{item.name}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        ))}

        {extraCount > 0 && (
          <div
            className="-ml-2 rounded-full bg-gray-300 border flex items-center justify-center text-xs font-medium text-gray-700"
            style={{
              width:
                size === "xs" ? 20 :
                size === "sm" ? 32 :
                size === "md" ? 40 :
                size === "lg" ? 56 :
                size === "xl" ? 72 : 86,
              height:
                size === "xs" ? 20 :
                size === "sm" ? 32 :
                size === "md" ? 40 :
                size === "lg" ? 56 :
                size === "xl" ? 72 : 86,
            }}
          >
            +{extraCount}
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}