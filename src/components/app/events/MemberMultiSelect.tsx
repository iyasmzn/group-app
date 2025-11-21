'use client'

import * as React from 'react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import { Profile } from '@/types/profile'
import Reveal from '@/components/animations/Reveal'
import { AppAvatar } from '@/components/ui/app-avatar'

export type MemberOption = {
  user_id: string | null
  full_name?: string | null
  profiles?: Partial<Profile> | null
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
  const toggle = (id: string | null) => {
    if (!id) return
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id))
    } else {
      onChange([...selected, id])
    }
  }

  // ✅ filter members yang belum dipilih
  const availableMembers = members.filter((m) => m.user_id && !selected.includes(m.user_id))

  return (
    <div className="rounded-md">
      <Command className="border">
        <CommandInput placeholder="Cari member..." />
        <CommandList>
          <CommandGroup heading="Member Grup">
            {availableMembers.map((m) => (
              <CommandItem
                key={m.user_id}
                onSelect={() => toggle(m.user_id)}
                className="flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <AppAvatar
                    image={m.profiles?.avatar_url}
                    name={m?.full_name || 'Member'}
                    size="xs"
                  />
                  {m?.full_name}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandEmpty>Tidak ada hasil</CommandEmpty>
        </CommandList>
      </Command>
      {selected.length > 0 && (
        <Reveal animation="fadeInUp">
          <div className="mt-2 rounded-md border p-2">
            <div className="mb-2 text-secondary-foreground text-sm">
              Terpilih ({selected.length})
            </div>
            <div className="flex flex-wrap gap-2">
              {selected.map((id) => {
                const member = members.find((m) => m.user_id === id)
                const displayName = member?.profiles?.full_name?.split(' ')[0] ?? id // 👈 ambil kata pertama
                return (
                  <Reveal key={id} animation="zoomIn">
                    <Button size="xs" variant="outline" onClick={() => toggle(id)}>
                      <AppAvatar
                        image={member?.profiles?.avatar_url}
                        name={member?.full_name || 'Member'}
                        size="xs"
                      />
                      {displayName} ✕
                    </Button>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </Reveal>
      )}
    </div>
  )
}
