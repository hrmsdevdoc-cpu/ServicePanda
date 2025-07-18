import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Router } from 'wouter'
import CustomerDashboard from '@/pages/CustomerDashboard'
import { createTestQueryClient } from '../mocks/queryClient'

// Mock the useAuth hook with real user data scenario
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: {
      id: 'user_1752865854065_ytux5spo5',
      email: 'manish@netvision.com.au',
      firstName: 'Manish',
      lastName: 'Khanna',
    },
    isLoading: false,
    isAuthenticated: true,
    logoutMutation: {
      mutate: vi.fn(),
      isPending: false,
    },
  }),
}))

// Mock toast
const mockToast = vi.fn()
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}))

// Mock navigation
const mockNavigate = vi.fn()
vi.mock('wouter', async () => {
  const actual = await vi.importActual('wouter')
  return {
    ...actual,
    useLocation: () => ['/', mockNavigate],
  }
})

describe('Dashboard Integration Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockToast.mockClear()
    mockNavigate.mockClear()
    
    // Mock fetch for API calls
    global.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes('/api/service-categories')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            { id: 1, name: 'Domestic Cleaning', icon: 'home' },
            { id: 2, name: 'Bond Cleaning', icon: 'key' },
            { id: 3, name: 'Carpet Cleaning', icon: 'sofa' },
            { id: 4, name: 'Pest Control', icon: 'bug' },
          ]),
        })
      }
      
      if (url.includes('/api/service-requests/my-requests')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            {
              id: 3,
              customerId: 'user_1752865854065_ytux5spo5',
              serviceCategory: 'Domestic Cleaning',
              status: 'pending',
              createdAt: new Date().toISOString(),
              description: 'House cleaning needed',
            },
          ]),
        })
      }
      
      if (url.includes('/api/auth/user') && !url.includes('PUT')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            id: 'user_1752865854065_ytux5spo5',
            email: 'manish@netvision.com.au',
            firstName: 'Manish',
            lastName: 'Khanna',
          }),
        })
      }
      
      // Handle profile updates
      if (url.includes('/api/auth/user')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            id: 'user_1752865854065_ytux5spo5',
            email: 'manish@netvision.com.au',
            firstName: 'Updated Name',
            lastName: 'Updated Last',
          }),
        })
      }
      
      return Promise.reject(new Error('Unknown API endpoint'))
    })
  })

  const renderDashboard = () => {
    const queryClient = createTestQueryClient()
    
    return render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <CustomerDashboard />
        </Router>
      </QueryClientProvider>
    )
  }

  it('should complete full user dashboard workflow', async () => {
    const user = userEvent.setup()
    renderDashboard()

    // 1. Verify user welcome message shows correct name
    await waitFor(() => {
      expect(screen.getByText('Welcome back, Manish!')).toBeInTheDocument()
    })

    // 2. Verify user profile shows in sidebar
    expect(screen.getByText('Manish Khanna')).toBeInTheDocument()
    expect(screen.getByText('manish@netvision.com.au')).toBeInTheDocument()

    // 3. Verify service categories are loaded and clickable
    await waitFor(() => {
      expect(screen.getByText('Domestic Cleaning')).toBeInTheDocument()
    })

    // 4. Click on a service category to navigate to request form
    await user.click(screen.getByText('Domestic Cleaning'))
    expect(mockNavigate).toHaveBeenCalledWith('/request-service?category=Domestic%20Cleaning&step=2')

    // 5. Navigate to profile tab
    await user.click(screen.getByRole('button', { name: /profile/i }))
    
    // 6. Verify profile form loads with current data
    await waitFor(() => {
      expect(screen.getByDisplayValue('Manish')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Khanna')).toBeInTheDocument()
    })

    // 7. Update profile information
    const firstNameInput = screen.getByDisplayValue('Manish')
    await user.clear(firstNameInput)
    await user.type(firstNameInput, 'Updated Name')
    
    const lastNameInput = screen.getByDisplayValue('Khanna')
    await user.clear(lastNameInput)
    await user.type(lastNameInput, 'Updated Last')

    // 8. Submit profile update
    await user.click(screen.getByRole('button', { name: /update profile/i }))

    // 9. Verify success toast is shown
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
        variant: 'default',
      })
    })

    // 10. Go back to dashboard tab
    await user.click(screen.getByRole('button', { name: /dashboard/i }))

    // 11. Verify recent activity shows user's requests
    await waitFor(() => {
      expect(screen.getByText('Recent Activity')).toBeInTheDocument()
      expect(screen.getByText('House cleaning needed')).toBeInTheDocument()
      expect(screen.getByText('Pending')).toBeInTheDocument()
    })
  })

  it('should handle service category navigation correctly', async () => {
    const user = userEvent.setup()
    renderDashboard()

    // Wait for service categories to load
    await waitFor(() => {
      expect(screen.getByText('Domestic Cleaning')).toBeInTheDocument()
    })

    // Test different service categories
    const serviceCategories = [
      'Domestic Cleaning',
      'Bond Cleaning', 
      'Carpet Cleaning',
      'Pest Control'
    ]

    for (const category of serviceCategories) {
      await user.click(screen.getByText(category))
      expect(mockNavigate).toHaveBeenCalledWith(
        `/request-service?category=${encodeURIComponent(category)}&step=2`
      )
    }
  })

  it('should show appropriate loading and error states', async () => {
    // Test with failing API call
    global.fetch = vi.fn().mockRejectedValue(new Error('API Error'))
    
    renderDashboard()

    // Should still render the basic layout
    expect(screen.getByText('Welcome back, Manish!')).toBeInTheDocument()
    expect(screen.getByText('ServicePanda')).toBeInTheDocument()
  })
})