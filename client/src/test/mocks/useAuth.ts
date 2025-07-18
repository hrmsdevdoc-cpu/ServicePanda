import { vi } from 'vitest'

export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  profileImageUrl: 'https://example.com/avatar.jpg'
}

export const mockUseAuth = {
  user: mockUser,
  isLoading: false,
  isAuthenticated: true,
  loginMutation: {
    mutate: vi.fn(),
    isPending: false,
    isError: false,
    error: null,
  },
  logoutMutation: {
    mutate: vi.fn(),
    isPending: false,
    isError: false,
    error: null,
  },
  registerMutation: {
    mutate: vi.fn(),
    isPending: false,
    isError: false,
    error: null,
  },
}

// Mock the useAuth hook
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth,
}))