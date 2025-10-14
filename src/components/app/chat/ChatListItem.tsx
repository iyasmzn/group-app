import Reveal from "@/components/animations/Reveal"
import { GroupAvatar } from "@/components/group-avatar"

interface ChatListItemProps {
  name: string
  avatar?: string
  lastMessage: string
  time: string
  unread?: number
  onClick?: () => void
  index?: number // tambahan untuk delay animasi
}

export function ChatListItem({
  name,
  avatar,
  lastMessage,
  time,
  unread = 0,
  onClick,
}: ChatListItemProps) {
  return (
    <div
      onClick={onClick}
      className="
        flex items-center gap-3 p-3 rounded-lg cursor-pointer
        hover:bg-muted/50
        transition-all duration-200 ease-out
        hover:scale-[1.01] active:scale-[0.99]
        animate-in fade-in slide-in-from-bottom-2
      "
    >
      <GroupAvatar name={name} image={avatar} size="lg" />

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <p className="font-medium truncate">{name}</p>
          <span className="text-xs text-gray-500 shrink-0 ml-2">{time}</span>
        </div>
        <p className="text-sm text-gray-600 truncate">{lastMessage}</p>
      </div>

      {unread > 0 && (
        <span
          className="
            ml-2 bg-blue-500 text-white text-xs rounded-full px-2 py-0.5
            animate-in fade-in zoom-in duration-200
          "
        >
          {unread}
        </span>
      )}
    </div>
  )
}