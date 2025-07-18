import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Router } from 'wouter'
import CustomerDashboard from '@/pages/CustomerDashboard'
import { createTestQueryClient } from '../mocks/queryClient'
import { mockUseAuth, mockUser } from '../mocks/useAuth'

// Mock wouter
const mockNavigate = vi.fn()
vi.mock('wouter', async () => {
  const actual = await vi.importActual('wouter')
  return {
    ...actual,
    useLocation: () => ['/', mockNavigate],
  }
})

// Mock toast
const mockToast = vi.fn()
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}))

// Mock API requests
global.fetch = vi.fn()

const mockServiceCategories = [
  { id: 1, name: 'Domestic Cleaning', icon: 'home' },
  { id: 2, name: 'Bond Cleaning', icon: 'key' },
  { id: 3, name: 'Carpet Cleaning', icon: 'sofa' },
  { id: 4, name: 'Pest Control', icon: 'bug' },
]

const mockServiceRequests = [
  {
    id: 1,
    customerId: 'test-user-id',
    serviceCategory: 'Domestic Cleaning',
    status: 'pending',
    createdAt: new Date().toISOString(),
    description: 'House cleaning needed',
  },
  {
    id: 2,
    customerId: 'test-user-id',
    serviceCategory: 'Carpet Cleaning',
    status: 'completed',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    description: 'Carpet deep clean',
  },
]

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient()
  
  // Set up query data
  queryClient.setQueryData(['/api/service-categories'], mockServiceCategories)
  queryClient.setQueryData(['/api/service-requests/my-requests'], mockServiceRequests)
  queryClient.setQueryData(['/api/auth/user'], mockUser)

  return render(
    <QueryClientProvider client={queryClient}>
      <Router>
        {component}
      </Router>
    </QueryClientProvider>
  )
}

describe('CustomerDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockToast.mockClear()
  })

  describe('Rendering', () => {
    it('should render welcome message with user name', () => {
      renderWithProviders(<CustomerDashboard />)
      
      expect(screen.getByText('Welcome back, John!')).toBeInTheDocument()
      expect(screen.getByText('Find and book professional services with ease')).toBeInTheDocument()
    })

    it('should render user profile information in sidebar', () => {
      renderWithProviders(<CustomerDashboard />)
      
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('test@example.com')).toBeInTheDocument()
    })

    it('should render service categories', () => {
      renderWithProviders(<CustomerDashboard />)
      
      expect(screen.getByText('Domestic Cleaning')).toBeInTheDocument()
      expect(screen.getByText('Bond Cleaning')).toBeInTheDocument()
      expect(screen.getByText('Carpet Cleaning')).toBeInTheDocument()
      expect(screen.getByText('Pest Control')).toBeInTheDocument()
    })

    it('should render recent activity section', () => {
      renderWithProviders(<CustomerDashboard />)
      
      expect(screen.getByText('Recent Activity')).toBeInTheDocument()
      expect(screen.getByText('House cleaning needed')).toBeInTheDocument()
      expect(screen.getByText('Carpet deep clean')).toBeInTheDocument()
    })
  })

  describe('Navigation', () => {
    it('should switch between dashboard tabs', async () => {
      const user = userEvent.setup()
      renderWithProviders(<CustomerDashboard />)
      
      // Should start on dashboard tab
      expect(screen.getByRole('button', { name: /dashboard/i })).toHaveClass('text-primary')
      
      // Click profile tab
      await user.click(screen.getByRole('button', { name: /profile/i }))
      
      // Should show profile form
      expect(screen.getByText('Personal Information')).toBeInTheDocument()
      expect(screen.getByDisplayValue('John')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Doe')).toBeInTheDocument()
    })

    it('should navigate to service request when clicking service category', async () => {
      const user = userEvent.setup()
      renderWithProviders(<CustomerDashboard />)
      
      // Click on Domestic Cleaning service
      await user.click(screen.getByText('Domestic Cleaning'))
      
      expect(mockNavigate).toHaveBeenCalledWith('/request-service?category=Domestic%20Cleaning&step=2')
    })
  })

  describe('Profile Updates', () => {
    it('should update profile when form is submitted', async () => {
      const user = userEvent.setup()
      
      // Mock successful API response
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 'test-user-id',
          email: 'test@example.com',
          firstName: 'Jane',
          lastName: 'Smith',
        }),
      })

      renderWithProviders(<CustomerDashboard />)
      
      // Go to profile tab
      await user.click(screen.getByRole('button', { name: /profile/i }))
      
      // Update first name
      const firstNameInput = screen.getByDisplayValue('John')
      await user.clear(firstNameInput)
      await user.type(firstNameInput, 'Jane')
      
      // Update last name
      const lastNameInput = screen.getByDisplayValue('Doe')
      await user.clear(lastNameInput)
      await user.type(lastNameInput, 'Smith')
      
      // Submit form
      await user.click(screen.getByRole('button', { name: /update profile/i }))
      
      // Check that API was called
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/auth/user',
          expect.objectContaining({
            method: 'PUT',
            headers: expect.objectContaining({
              'Content-Type': 'application/json',
            }),
            body: JSON.stringify({
              firstName: 'Jane',
              lastName: 'Smith',
            }),
          })
        )
      })

      // Check success toast
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Profile Updated',
          description: 'Your profile has been successfully updated.',
          variant: 'default',
        })
      })
    })

    it('should show error when profile update fails', async () => {
      const user = userEvent.setup()
      
      // Mock API error
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ message: 'Invalid data' }),
      })

      renderWithProviders(<CustomerDashboard />)
      
      // Go to profile tab
      await user.click(screen.getByRole('button', { name: /profile/i }))
      
      // Submit form with empty fields
      const firstNameInput = screen.getByDisplayValue('John')
      await user.clear(firstNameInput)
      
      await user.click(screen.getByRole('button', { name: /update profile/i }))
      
      // Check error toast
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Missing Information',
          description: 'Please fill in both first and last name.',
          variant: 'destructive',
        })
      })
    })
  })

  describe('Service Requests', () => {
    it('should display recent service requests with correct status', () => {
      renderWithProviders(<CustomerDashboard />)
      
      // Check for pending request
      expect(screen.getByText('House cleaning needed')).toBeInTheDocument()
      expect(screen.getByText('Pending')).toBeInTheDocument()
      
      // Check for completed request
      expect(screen.getByText('Carpet deep clean')).toBeInTheDocument()
      expect(screen.getByText('Completed')).toBeInTheDocument()
    })

    it('should show "Latest" badge for most recent request', () => {
      renderWithProviders(<CustomerDashboard />)
      
      // The first request (most recent) should have "Latest" badge
      const latestBadges = screen.getAllByText('Latest')
      expect(latestBadges).toHaveLength(1)
    })

    it('should show empty state when no requests exist', () => {
      const queryClient = createTestQueryClient()
      queryClient.setQueryData(['/api/service-categories'], mockServiceCategories)
      queryClient.setQueryData(['/api/service-requests/my-requests'], [])
      queryClient.setQueryData(['/api/auth/user'], mockUser)

      render(
        <QueryClientProvider client={queryClient}>
          <Router>
            <CustomerDashboard />
          </Router>
        </QueryClientProvider>
      )
      
      expect(screen.getByText('No recent activity')).toBeInTheDocument()
    })
  })

  describe('Logout', () => {
    it('should call logout mutation when logout button is clicked', async () => {
      const user = userEvent.setup()
      renderWithProviders(<CustomerDashboard />)
      
      await user.click(screen.getByRole('button', { name: /logout/i }))
      
      expect(mockUseAuth.logoutMutation.mutate).toHaveBeenCalled()
    })
  })

  describe('Loading States', () => {
    it('should show loading state when user data is loading', () => {
      const queryClient = createTestQueryClient()
      
      // Don't set user data to simulate loading
      queryClient.setQueryData(['/api/service-categories'], mockServiceCategories)
      queryClient.setQueryData(['/api/service-requests/my-requests'], mockServiceRequests)

      render(
        <QueryClientProvider client={queryClient}>
          <Router>
            <CustomerDashboard />
          </Router>
        </QueryClientProvider>
      )
      
      // Should show loading state or fallback content
      expect(screen.getByText('Welcome back, Customer!')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', () => {
      renderWithProviders(<CustomerDashboard />)
      
      // Check for navigation buttons
      expect(screen.getByRole('button', { name: /dashboard/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /profile/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument()
      
      // Check for form inputs when on profile tab
      fireEvent.click(screen.getByRole('button', { name: /profile/i }))
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
    })
  })
})