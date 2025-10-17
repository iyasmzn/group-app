import React from 'react'
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// channel mock
const channelMock = {
  on: vi.fn().mockReturnThis(),
  subscribe: vi.fn().mockReturnThis(),
}

// data statis
const profileData = { id: 'test-user-id', full_name: 'Test User' }
const unreadCounts: any[] = []

// supabase mock lengkap
vi.mock('@/lib/supabase/client', () => {
  return {
    supabase: {
      channel: vi.fn(() => channelMock),
      removeChannel: vi.fn(),

      // mock RPC
      rpc: vi.fn((fn: string) => {
        if (fn === 'get_unread_counts') {
          return Promise.resolve({ data: unreadCounts }) // stabil
        }
        if (fn === 'get_unread_count_for_group') {
          return Promise.resolve({ data: 1 }) // stabil
        }
        return Promise.resolve({ data: [] })
      }),

      // mock from().select().eq().single()
      from: vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: profileData,
          error: null,
        }),
      })),

      // mock auth
      auth: {
        getSession: vi.fn().mockResolvedValue({
          data: { session: { user: { id: 'test-user-id' } } },
        }),
        onAuthStateChange: vi.fn().mockReturnValue({
          data: { subscription: { unsubscribe: vi.fn() } },
        }),
      },
    },
  }
})

// mock useAuth hook
vi.mock('@/lib/supabase/auth', () => {
  return {
    useAuth: () => ({
      user: { id: 'test-user-id' },
    }),
  }
})

// Mock next/image
vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}))

// Mock AvatarImage dari shadcn/ui
vi.mock('@/components/ui/avatar', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>
  return {
    ...actual,
    AvatarImage: (props: any) => <img {...props} />,
  }
})

// Polyfill window.matchMedia untuk next-themes
if (!window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, // deprecated
    removeListener: () => {}, // deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })
}
