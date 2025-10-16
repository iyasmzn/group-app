'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, PlusCircle } from 'lucide-react'
import { ShineBorder } from '@/components/ui/shine-border'

export function EmptyGroupCard() {
  return (
    <Card className="relative overflow-hidden">
      <ShineBorder shineColor={['#A07CFE', '#FE8FB5', '#FFBE7B']} />
      <CardContent className="flex flex-col items-center justify-center text-center py-10 space-y-4">
        <Users className="w-12 h-12 text-muted-foreground" />
        <p className="text-muted-foreground text-sm max-w-xs">
          You are not a member of any groups yet. Join or create a group to get started!
        </p>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/groups/explore">
              <Users className="w-4 h-4 mr-1" />
              Browse Groups
            </Link>
          </Button>
          <Button asChild>
            <Link href="/groups/create">
              <PlusCircle className="w-4 h-4 mr-1" />
              Create Group
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
