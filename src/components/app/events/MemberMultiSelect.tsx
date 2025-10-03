"use client"

import * as React from "react"
import { Check, Users } from "lucide-react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { Profile } from "@/types/profile"
import { GroupAvatar } from "@/components/group-avatar"
import Reveal from "@/components/animations/Reveal"

export type MemberOption = {
  user_id: string
  full_name: string | null
  profiles?: Profile | null
}

export function MemberMultiSelect({
  members,
  selected,
  onChange,
}: {
  members: MemberOption[]
  selected: string[]
  onChange: (ids: string[]) => void
}) {
  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id))
    } else {
      onChange([...selected, id])
    }
  }

  return (
    <div className="border rounded-md">
      <Command>
        <CommandInput placeholder="Cari member..." />
        <CommandList>
          <CommandEmpty>Tidak ada hasil</CommandEmpty>
          <CommandGroup heading="Member Grup">
            {members.map((m) => (
              <CommandItem
                key={m.user_id}
                onSelect={() => toggle(m.user_id)}
                className="flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <GroupAvatar image={m.profiles?.avatar_url} name={m?.full_name || 'Member'} size="xs" />
                  {m?.full_name}
                </span>
                {selected.includes(m.user_id) && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 border-t">
          {selected.map((id) => {
            const member = members.find((m) => m.user_id === id)
            const displayName =
              member?.profiles?.full_name?.split(" ")[0] ?? id // 👈 ambil kata pertama
            return (
              <Reveal key={id} animation="zoomIn">
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => toggle(id)}
                >
                  <GroupAvatar
                    image={member?.profiles?.avatar_url}
                    name={member?.full_name || "Member"}
                    size="xs"
                  />
                  {displayName} ✕
                </Button>
              </Reveal>
            )
          })}
        </div>
      )}
    </div>
  )
}