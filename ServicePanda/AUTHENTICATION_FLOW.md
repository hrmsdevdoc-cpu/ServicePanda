# Authentication Flow Documentation

## Overview
The ServicePanda Provider app now implements a proper authentication flow that automatically checks login status on startup and shows the appropriate screen.

## How It Works

### 1. App Startup
- When the app starts, it shows a loading screen
- The `AuthContext` automatically checks if the user is already logged in
- It looks for stored authentication data in AsyncStorage (`providerId` and `providerData`)

### 2. Authentication Check
- **If user is logged in**: 
  - Verifies the stored token is still valid by calling `/api/provider/profile`
  - If valid, shows the Dashboard screen
  - If invalid, clears stored data and shows Login screen
- **If user is not logged in**: Shows the Login screen

### 3. Login Process
- User enters email and password
- App calls `/api/provider/login` API
- On success, stores authentication data in AsyncStorage
- Automatically redirects to Dashboard (no manual navigation needed)

### 4. Logout Process
- User clicks logout button in Dashboard sidebar
- App calls `/api/provider/logout` API
- Clears all stored authentication data
- Automatically returns to Login screen

## Key Components

### AuthContext (`src/contexts/AuthContext.tsx`)
- Manages authentication state (`isAuthenticated`, `isLoading`, `providerData`)
- Provides `login()`, `logout()`, and `checkAuthStatus()` methods
- Automatically checks authentication on app startup

### App.tsx
- Wraps the app with `AuthProvider` and `QueryClientProvider`
- Uses `AppContent` component to conditionally render screens based on auth state
- Shows Loading → Login → Dashboard automatically

### LoginScreen (`src/screens/auth/LoginScreen.tsx`)
- Uses `useAuth()` hook to access login method
- No longer needs `onNavigate` prop
- Automatically redirects to Dashboard on successful login

### DashboardScreen (`src/screens/dashboard/DashboardScreen.tsx`)
- Uses `useAuth()` hook to access logout method
- No longer needs `onLogout` prop
- Automatically returns to Login on logout

## API Integration

### Authentication Headers
- All API requests automatically include `x-provider-id` header when user is logged in
- This is handled by the `ApiService.getHeaders()` method

### Protected Endpoints
- `/api/provider/profile` - Get user profile
- `/api/provider/leads` - Get user's leads
- `/api/provider/credit/balance` - Get credit balance
- And other provider-specific endpoints

## Benefits

1. **Automatic State Management**: No need to manually track login state
2. **Persistent Login**: Users stay logged in between app sessions
3. **Secure**: Automatically validates stored tokens
4. **Clean Code**: No prop drilling for authentication methods
5. **Automatic Navigation**: No manual navigation calls needed

## Testing the Flow

1. **First Launch**: App shows Login screen
2. **Login**: Enter credentials, app shows Dashboard
3. **App Restart**: App automatically shows Dashboard (if still logged in)
4. **Logout**: Click logout, app returns to Login screen
5. **App Restart After Logout**: App shows Login screen

## Future Enhancements

- Add signup screen integration
- Add forgot password functionality
- Add biometric authentication
- Add session timeout handling
- Add refresh token mechanism
