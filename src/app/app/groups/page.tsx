'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import PageWrapper from '@/components/page-wrapper'
import { AppTopbar } from '@/components/app/topbar'
import {
  ArrowDownZA,
  ArrowUpAZ,
  BellDot,
  CalendarArrowDown,
  CalendarArrowUp,
  Home,
  MessageCircle,
  MessageCircleQuestion,
  RefreshCw,
  Settings2,
} from 'lucide-react'
import { AppBottombar } from '@/components/app/bottombar'
import { useAuth } from '@/lib/supabase/auth'
import { motion } from 'framer-motion'
import { AddGroupDialog } from './components/addGroupDialog'
import LoadingOverlay from '@/components/loading-overlay'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Badge } from '@/components/ui/badge'
import { GroupData } from '@/types/group'
import Reveal from '@/components/animations/Reveal'
import { AppAvatar } from '@/components/ui/app-avatar'

const motionUl = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // delay antar anak
      delayChildren: 0.1, // jeda awal sebelum mulai
    },
  },
}

export default function GroupsPageWrapper() {
  const { user } = useAuth()

  if (!user) {
    return (
      <PageWrapper>
        <div className="max-w-4xl mx-auto p-4">
          <p className="text-center">
            Please{' '}
            <Link href="/login" className="text-blue-600 hover:underline">
              login
            </Link>{' '}
            to view your groups.
          </p>
        </div>
      </PageWrapper>
    )
  }

  return <GroupsPage userId={user.id} />
}

function GroupsPage({ userId }: { userId: string }) {
  const [groups, setGroups] = useState<GroupData[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'name' | 'createdat'>('createdat')
  const [ascending, setAscending] = useState(false)
  const [offset, setOffset] = useState(0)
  const [searchGroupName, setSearchGroupName] = useState('')
  const [totalRow, setTotalRow] = useState(0)
  const limit = 3
  const totalPages = Math.ceil(totalRow / limit)
  const currentPage = Math.floor(offset / limit) + 1

  useEffect(() => {
    fetchGroups()
  }, [userId, sortBy, ascending, searchGroupName, offset])

  // ✅ Fetch groups where user is a member and get total group members
  const fetchGroups = async () => {
    setLoading(true)
    const query = supabase
      .from('groups')
      .select(
        `
        *,
        group_members!inner(*),
        group_last_seen(last_seen_at, message_last_seen_at)
      `
      )
      .eq('group_members.user_id', userId)
      .eq('group_last_seen.user_id', userId)
      .ilike('name', `%${searchGroupName}%`)
      .order(sortBy, { ascending: ascending })

    const { data: totalData } = await query
    setTotalRow(totalData ? totalData.length : 0)
    console.log('totalData', totalData)
    const { data, error } = await query.range(offset, offset + limit - 1) // pagination
    console.log('groups', data)

    if (error) {
      console.error('Error fetching groups:', error)
      setLoading(false)
    } else {
      setGroups(data || [])
      const groupsWithUnread = await Promise.all(
        (data || []).map(async (g) => {
          const lastSeenAt = g.group_last_seen?.[0]?.message_last_seen_at || '1970-01-01'

          const { count } = await supabase
            .from('group_messages')
            .select('id', { count: 'exact', head: true })
            .eq('group_id', g.id)
            .neq('sender_id', userId)
            .gt('createdat', lastSeenAt)

          return {
            ...g,
            unreadCount: count || 0,
          }
        })
      )
      setGroups(groupsWithUnread)
      setLoading(false)
    }
  }

  return (
    <>
      <LoadingOverlay isLoading={loading} />
      <AppTopbar title="Groups" titleIcon={<Home className="h-6 w-6" />} />
      <PageWrapper>
        <div className="max-w-4xl mx-auto py-4 px-2 md:px-6">
          <div className="flex items-center justify-between mb-4 gap-2">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="🔍 Search by Group Name"
                value={searchGroupName}
                onChange={(e) => setSearchGroupName(e.target.value)}
              />
            </div>
            {/* Button Create Group */}
            <AddGroupDialog setLoading={setLoading} />
          </div>

          {/* filter */}
          <div className="flex gap-4 items-center justify-center md:justify-end mb-4 flex-wrap">
            {/* filter */}
            <div className="flex items-center gap-2">
              <label htmlFor="sortBy" className="text-sm font-medium">
                Sort by:
              </label>
              <Select
                defaultValue="createdat"
                onValueChange={(value: 'name' | 'createdat') => setSortBy(value)}
              >
                <SelectTrigger id="sortBy" className="w-[150px]">
                  {sortBy === 'name' ? 'Name' : 'Creation Date'}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="createdat">Creation Date</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={() => setAscending(!ascending)}
                className="border px-2 py-1 text-sm"
                variant={'outline'}
              >
                {sortBy === 'name' ? (
                  ascending ? (
                    <ArrowUpAZ className={`inline-block mr-1 w-4 h-4`} />
                  ) : (
                    <ArrowDownZA className={`inline-block mr-1 w-4 h-4`} />
                  )
                ) : ascending ? (
                  <CalendarArrowUp className={`inline-block mr-1 w-4 h-4`} />
                ) : (
                  <CalendarArrowDown className={`inline-block mr-1 w-4 h-4`} />
                )}
                {ascending ? 'Asc' : 'Desc'}
              </Button>
              <Button onClick={fetchGroups} variant={'outline'}>
                <RefreshCw className={loading ? 'animate-spin' : ''} />
              </Button>
            </div>
          </div>

          {/* List groups */}
          <motion.ul className="space-y-2" initial="hidden" animate="show" variants={motionUl}>
            {groups.length ? (
              groups.map((group, gIndex) => (
                <Reveal
                  key={gIndex}
                  animation="fadeInRight"
                  delay={gIndex * 0.1}
                  distance={25}
                  className="flex items-center justify-between py-2 px-4 border rounded-lg hover:bg-muted"
                >
                  <div className="flex-1 flex items-center gap-3">
                    {/* Avatar inisial */}
                    <Link href={`groups/${group.id}`}>
                      <AppAvatar
                        name={group.name}
                        image={group.image_url} // kalau ada, tampil gambar
                        size="md"
                      />
                    </Link>
                    <div className="flex flex-col">
                      {/* group name */}
                      <Link href={`groups/${group.id}`} className="font-medium">
                        {group.name}
                      </Link>
                      <span className="text-xs text-secondary-foreground">
                        {/* group createdat */}
                        Since{' '}
                        {new Date(group.createdat).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                        })}
                        {' • '}
                        {/* group member total */}
                        {group?.group_members?.length} member
                        {group?.group_members?.length !== 1 ? 's' : ''}
                      </span>
                      <div className="flex items-center gap-4">
                        {/* message */}
                        <Reveal animation="fadeInDown" distance={5}>
                          <Link
                            href={`groups/${group.id}/chat`}
                            className="pt-2 flex items-center gap-2"
                          >
                            {group.unreadCount ? (
                              <MessageCircleQuestion className="text-warning w-5 h-5" />
                            ) : (
                              <MessageCircle />
                            )}
                            <Badge
                              variant={group.unreadCount ? 'warning' : 'secondary'}
                              className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums text-gray-500"
                            >
                              {group.unreadCount}
                            </Badge>
                          </Link>
                        </Reveal>
                        {/* info */}
                        <Reveal animation="fadeInDown" distance={5} delay={0.3}>
                          <span className="pt-2 flex items-center gap-2">
                            <BellDot className="text-info w-5 h-5" />
                            <Badge
                              className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums bg-info text-white"
                              variant="outline"
                            >
                              5+
                            </Badge>
                          </span>
                        </Reveal>
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`groups/${group.id}/profile`}
                    className="text-sm text-muted-foreground hover:text-warning border rounded-lg p-2"
                  >
                    <Settings2 />
                  </Link>
                </Reveal>
              ))
            ) : (
              <div>
                <p className="text-center text-muted-foreground">
                  You are not a member of any groups yet. Create or join a group to get started!
                </p>
              </div>
            )}
          </motion.ul>

          <div className="flex items-center justify-between flex-wrap mt-4">
            {/* total group */}
            {totalRow > 0 && (
              <span className="text-sm text-muted-foreground">
                {totalRow} group{totalRow !== 1 ? 's' : ''}
              </span>
            )}
            {/* Pagination */}
            {totalRow > limit && (
              <Pagination className="flex-1 justify-end">
                <PaginationContent>
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious onClick={() => setOffset((currentPage - 2) * limit)} />
                    </PaginationItem>
                  )}
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <PaginationItem key={i + 'pagination'}>
                      <PaginationLink
                        onClick={() => setOffset(i * limit)}
                        isActive={currentPage == i + 1}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  {currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationNext onClick={() => setOffset(currentPage * limit)} />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </div>
      </PageWrapper>
      <AppBottombar />
    </>
  )
}
