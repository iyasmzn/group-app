'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import PageWrapper from '@/components/page-wrapper'
import { AppTopbar } from '@/components/app/topbar'
import {
  ArrowDownZA,
  ArrowUpAZ,
  CalendarArrowDown,
  CalendarArrowUp,
  Home,
  MessageCircle,
  MessageCircleQuestion,
  RefreshCw,
  Settings2,
} from 'lucide-react'
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
import { GroupData } from '@/types/group.type'
import Reveal from '@/components/animations/Reveal'
import { AppAvatar } from '@/components/ui/app-avatar'
import { AddGroupDialog } from '@/components/app/groups/AddGroupDialog'
import { useNotifications } from '@/context/notification/NotificationContext'
import { useAuth } from '@/context/AuthContext'

const PAGE_LIMIT = 6

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
  const { groupUnreadMap } = useNotifications()
  const [groups, setGroups] = useState<GroupData[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'name' | 'createdat'>('createdat')
  const [ascending, setAscending] = useState(false)
  const [offset, setOffset] = useState(0)
  const [searchGroupName, setSearchGroupName] = useState('')
  const [totalRow, setTotalRow] = useState(0)

  const limit = PAGE_LIMIT
  const totalPages = Math.max(1, Math.ceil(totalRow / limit))
  const currentPage = Math.floor(offset / limit) + 1

  const fetchGroups = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    try {
      const { data, error } = await supabase.rpc('get_user_groups', {
        uid: userId,
        q: searchGroupName || '',
        sort_by: sortBy, // 'createdat' | 'name'
        is_asc: ascending, // boolean
        limit_rows: limit,
        offset_rows: offset,
      })

      if (error) throw error

      const enriched = (data || []).map((g: any) => ({
        id: g.id,
        name: g.name,
        image_url: g.image_url,
        createdat: g.createdat,
        last_seen_at: g.last_seen_at,
        message_last_seen_at: g.message_last_seen_at,
        member_count: g.member_count,
        unreadCount: groupUnreadMap[g.id] ?? 0,
        description: g.description ?? '',
        description_updatedat: g.description_updatedat ?? null,
        description_updatedby: g.description_updatedby ?? null,
      }))

      setGroups(enriched)

      // total_count sudah dikirim di setiap row (window function)
      const total = data && data.length > 0 ? data[0].total_count : 0
      setTotalRow(total)
    } catch (err) {
      console.error('Error fetching groups via RPC:', err)
    } finally {
      setLoading(false)
    }
  }, [userId, searchGroupName, sortBy, ascending, limit, offset, groupUnreadMap])

  // reset offset kalau search berubah
  useEffect(() => {
    setOffset(0)
  }, [searchGroupName])

  // fetch data saat filter berubah
  useEffect(() => {
    fetchGroups()
  }, [fetchGroups])

  const handleRefresh = () => fetchGroups()
  const handlePageClick = (pageIndex: number) => setOffset(pageIndex * limit)

  return (
    <>
      <LoadingOverlay isLoading={loading} />
      <AppTopbar title="Groups" titleIcon={<Home className="h-6 w-6" />} />
      <PageWrapper>
        <div className="max-w-4xl mx-auto py-4 px-2 md:px-6">
          {/* Search + Add */}
          <div className="flex items-center justify-between mb-4 gap-2">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="🔍 Search by Group Name"
                value={searchGroupName}
                onChange={(e) => setSearchGroupName(e.target.value)}
              />
            </div>
            <AddGroupDialog setLoading={setLoading} />
          </div>

          {/* Sort + Refresh */}
          <div className="flex gap-4 items-center justify-center md:justify-end mb-4 flex-wrap">
            <div className="flex items-center gap-2">
              <label htmlFor="sortBy" className="text-sm font-medium">
                Sort by:
              </label>
              <Select defaultValue="createdat" onValueChange={(v: any) => setSortBy(v)}>
                <SelectTrigger id="sortBy" className="w-[150px]">
                  {sortBy === 'name' ? 'Name' : 'Creation Date'}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="createdat">Creation Date</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={() => setAscending((s) => !s)}
                variant="outline"
                className="border px-2 py-1 text-sm"
              >
                {sortBy === 'name' ? (
                  ascending ? (
                    <ArrowUpAZ className="inline-block mr-1 w-4 h-4" />
                  ) : (
                    <ArrowDownZA className="inline-block mr-1 w-4 h-4" />
                  )
                ) : ascending ? (
                  <CalendarArrowUp className="inline-block mr-1 w-4 h-4" />
                ) : (
                  <CalendarArrowDown className="inline-block mr-1 w-4 h-4" />
                )}
                {ascending ? 'Asc' : 'Desc'}
              </Button>

              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className={loading ? 'animate-spin' : ''} />
              </Button>
            </div>
          </div>

          {/* List */}
          <ul className="space-y-2">
            {loading ? (
              // Skeleton loader saat masih fetch
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="animate-pulse flex items-center justify-between py-2 px-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-muted" />
                    <div className="flex flex-col gap-2 flex-1">
                      <div className="h-4 w-1/3 bg-muted rounded" />
                      <div className="h-3 w-1/4 bg-muted rounded" />
                    </div>
                  </div>
                  <div className="w-6 h-6 bg-muted rounded" />
                </div>
              ))
            ) : groups.length ? (
              groups.map((group) => (
                <Reveal
                  key={group.id}
                  animation="fadeInRight"
                  distance={25}
                  className="flex items-center justify-between py-2 px-4 border rounded-lg hover:bg-muted"
                >
                  <div className="flex-1 flex items-center gap-3">
                    <Link href={`groups/${group.id}`}>
                      <AppAvatar name={group.name} image={group.image_url} size="md" />
                    </Link>
                    <div className="flex flex-col">
                      <Link href={`groups/${group.id}`} className="font-medium">
                        {group.name}
                      </Link>
                      <span className="text-xs text-secondary-foreground">
                        Since{' '}
                        {group.createdat
                          ? new Date(group.createdat).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                            })
                          : ''}
                        {' • '}
                        {group?.member_count ?? 0} member
                        {(group?.member_count ?? 0) !== 1 ? 's' : ''}
                      </span>

                      <div className="flex items-center gap-4 mt-1">
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

                        <span className="pt-2 flex items-center gap-2">
                          <Badge
                            className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums bg-info text-white"
                            variant="outline"
                          >
                            5+
                          </Badge>
                        </span>
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
          </ul>

          {/* Pagination + total */}
          <div className="flex items-center justify-between flex-wrap mt-4">
            {totalRow > 0 && (
              <span className="text-sm text-muted-foreground">
                {totalRow} group{totalRow !== 1 ? 's' : ''}
              </span>
            )}

            {totalRow > limit && (
              <Pagination className="flex-1 justify-end">
                <PaginationContent>
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious onClick={() => setOffset((currentPage - 2) * limit)} />
                    </PaginationItem>
                  )}

                  {Array.from({ length: totalPages }).map((_, i) => (
                    <PaginationItem key={`pg-${i}`}>
                      <PaginationLink
                        onClick={() => handlePageClick(i)}
                        isActive={currentPage === i + 1}
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
    </>
  )
}
