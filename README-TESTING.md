# Testing Guide for ServicePanda Dashboard

## Overview

This testing setup uses **Vitest** (faster alternative to Jest) with **React Testing Library** for comprehensive testing of the CustomerDashboard component and other React components.

## Test Structure

```
client/src/test/
├── components/           # Component-specific tests
│   └── CustomerDashboard.test.tsx
├── integration/          # Integration tests
│   └── dashboard-flow.test.tsx
├── mocks/               # Mock utilities
│   ├── queryClient.ts   # React Query test client
│   └── useAuth.ts       # Authentication mock
├── utils/               # Test utilities
│   └── test-utils.tsx   # Custom render functions
└── setup.ts             # Test setup configuration
```

## Running Tests

### Basic Commands
```bash
# Run all tests
npm run test

# Run tests with UI (visual test runner)
npm run test:ui

# Run tests once (CI mode)
npm run test:run

# Run tests with coverage report
npm run test:coverage
```

### Watch Mode
```bash
# Run specific test file
npx vitest CustomerDashboard.test.tsx

# Run tests matching pattern
npx vitest dashboard

# Run with coverage
npx vitest --coverage
```

## Test Categories

### 1. Component Tests (`CustomerDashboard.test.tsx`)

**Rendering Tests:**
- ✅ Welcome message displays user's first name
- ✅ User profile information appears in sidebar
- ✅ Service categories load and display
- ✅ Recent activity section shows service requests

**Interaction Tests:**
- ✅ Tab navigation between Dashboard/Profile sections
- ✅ Service category clicks navigate to request form
- ✅ Profile form updates and validation
- ✅ Logout button functionality

**Data Flow Tests:**
- ✅ Profile updates trigger API calls
- ✅ Success/error toast notifications
- ✅ Cache updates after profile changes
- ✅ Loading and error states

### 2. Integration Tests (`dashboard-flow.test.tsx`)

**Complete User Workflows:**
- ✅ Full dashboard → profile update → service selection flow
- ✅ Multiple service category navigation
- ✅ Profile update with immediate UI refresh
- ✅ Error handling and recovery

### 3. Mock Strategy

**API Mocking:**
```typescript
// Mock successful API responses
global.fetch = vi.fn().mockImplementation((url) => {
  if (url.includes('/api/auth/user')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        id: 'test-user',
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com'
      })
    })
  }
})
```

**React Query Mocking:**
```typescript
const queryClient = createTestQueryClient()
queryClient.setQueryData(['/api/auth/user'], mockUser)
```

## Key Testing Patterns

### 1. User Interaction Testing
```typescript
const user = userEvent.setup()
await user.click(screen.getByRole('button', { name: /profile/i }))
await user.type(screen.getByLabelText(/first name/i), 'New Name')
```

### 2. Async Operations
```typescript
await waitFor(() => {
  expect(screen.getByText('Profile Updated')).toBeInTheDocument()
})
```

### 3. Mock Verification
```typescript
expect(mockToast).toHaveBeenCalledWith({
  title: 'Profile Updated',
  description: 'Your profile has been successfully updated.',
  variant: 'default',
})
```

## Real-World Test Scenarios

### Profile Update Flow
1. User navigates to profile tab
2. Updates first and last name
3. Submits form
4. API call is made with correct data
5. Success toast appears
6. Dashboard welcome message updates immediately

### Service Selection Flow
1. User clicks service category (e.g., "Domestic Cleaning")
2. Navigation occurs to service request form
3. URL includes correct category and step parameters

### Error Handling
1. API returns error response
2. Error toast appears with appropriate message
3. Form remains in editable state
4. User can retry operation

## Best Practices

### 1. Test User Behavior, Not Implementation
```typescript
// Good: Test what user sees/does
expect(screen.getByText('Welcome back, John!')).toBeInTheDocument()

// Avoid: Testing internal state
expect(component.state.userName).toBe('John')
```

### 2. Use Semantic Queries
```typescript
// Good: Accessible queries
screen.getByRole('button', { name: /update profile/i })
screen.getByLabelText(/first name/i)

// Avoid: Brittle selectors
screen.getByClassName('update-btn')
```

### 3. Test Different User States
- Authenticated vs unauthenticated users
- Users with/without profile data
- Loading states
- Error conditions

## Coverage Goals

- **Functions:** 80%+
- **Statements:** 85%+
- **Branches:** 75%+
- **Lines:** 85%+

## Common Issues & Solutions

### 1. "Warning: React has detected a change in the order of Hooks"
**Solution:** Ensure mocks are consistent and don't change hook call order

### 2. "observer.getOptimisticResult is not a function"
**Solution:** Use proper React Query test client and ensure hooks are mocked correctly

### 3. Navigation not working in tests
**Solution:** Mock `wouter` navigation properly:
```typescript
const mockNavigate = vi.fn()
vi.mock('wouter', () => ({
  useLocation: () => ['/', mockNavigate],
}))
```

## Advanced Testing Features

### Custom Matchers
Add project-specific assertions for common patterns.

### Visual Regression Testing
Consider adding screenshot testing for critical UI components.

### Performance Testing
Monitor component render times and optimize based on test results.

### E2E Integration
These unit/integration tests complement (but don't replace) full end-to-end testing.