# ServicePanda Customer App

A React Native mobile application for customers to request services and manage quotes from verified service providers.

## 🚀 Features

### 🔐 Authentication
- **Sign In/Sign Up** - Secure customer registration and login
- **Password Recovery** - Reset password via email
- **Profile Management** - Update personal information and preferences

### 🏠 Home Dashboard
- **Personalized Welcome** - Greeting with customer name
- **Quick Actions** - Fast access to request services
- **Service Categories** - Browse available service types
- **Recent Activity** - View recent requests and updates

### 🛠️ Service Booking
- **Service Categories** - Domestic cleaning, end of lease cleaning, carpet cleaning, pest control, gardening, removals, handyman, plumbing, electrician
- **Smart Request Form** - Detailed service description with location and urgency
- **Location Selection** - Suburb, postcode, and state selection
- **Schedule Preferences** - Preferred date and time slots
- **Budget Indication** - Optional budget guidance for providers

### 📋 Request Management
- **My Requests** - View all service requests with status tracking
- **Status Filtering** - Filter by pending, quoted, accepted, completed
- **Request Details** - Comprehensive view of request information
- **Real-time Updates** - Live status updates as providers respond

### 💰 Quote Management
- **Quote Reception** - Receive quotes from multiple providers
- **Provider Profiles** - View provider ratings, verification status
- **Quote Comparison** - Compare prices, timelines, and descriptions
- **Accept/Reject** - Simple quote acceptance and rejection
- **Provider Contact** - Direct communication with service providers

### 👤 Profile & Settings
- **Profile Editing** - Update personal information
- **Contact Information** - Manage email, phone, and address
- **Account Settings** - Privacy, notifications, and preferences
- **Support Access** - Help and customer support integration

## 🛠️ Technology Stack

- **Framework**: React Native 0.75.0
- **Language**: TypeScript
- **Navigation**: React Navigation 6
- **State Management**: React Query (TanStack Query)
- **HTTP Client**: Axios
- **Storage**: AsyncStorage
- **UI Components**: Custom components with Material Icons
- **Styling**: StyleSheet (React Native)

## 📱 App Architecture

```
ServicePandaCustomer/
├── src/
│   ├── types/           # TypeScript type definitions
│   ├── config/          # API configuration
│   ├── services/        # API service layers
│   ├── screens/         # Screen components
│   │   ├── auth/        # Authentication screens
│   │   └── main/        # Main app screens
│   └── components/      # Reusable components
├── App.tsx              # Main app component with navigation
└── package.json         # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- React Native CLI
- Android Studio (for Android)
- Xcode (for iOS)
- Your existing ServicePanda backend server

### Installation

1. **Install dependencies**
   ```bash
   cd ServicePandaCustomer
   npm install
   ```

2. **Configure API endpoint**
   ```typescript
   // src/config/api.ts
   const API_BASE_URL = __DEV__ 
     ? 'http://localhost:3000'  // Your development server
     : 'https://your-production-domain.com';
   ```

3. **Install iOS dependencies** (iOS only)
   ```bash
   cd ios && pod install && cd ..
   ```

### Running the App

#### Development
```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

#### Production Build
```bash
# Android
npm run build:android

# iOS
npm run build:ios
```

## 🔗 Backend Integration

The app integrates with your existing Express.js ServicePanda backend:

### Required API Endpoints
- `POST /api/auth/login` - Customer login
- `POST /api/auth/register` - Customer registration
- `GET /api/auth/me` - Get current user
- `GET /api/service-categories` - List service categories
- `POST /api/service-requests` - Create service request
- `GET /api/service-requests/my-requests` - Get user's requests
- `GET /api/service-requests/:id/quotes` - Get quotes for request
- `POST /api/quotes/:id/accept` - Accept a quote
- `POST /api/quotes/:id/reject` - Reject a quote

### Authentication
- Uses JWT tokens stored in AsyncStorage
- Automatic token refresh and error handling
- Secure logout with token cleanup

## 📱 Screen Flow

```
📱 App Launch
├── 🔐 Authentication (if not logged in)
│   ├── Login Screen
│   ├── Register Screen
│   └── Forgot Password Screen
└── 🏠 Main App (if logged in)
    ├── 📊 Home Dashboard
    ├── 🛠️ Service Request
    ├── 📋 My Requests
    ├── 💰 Quotes View
    ├── 📄 Request Details
    └── 👤 Profile Settings
```

## 🎨 Design System

### Colors
- **Primary**: #007AFF (iOS Blue)
- **Success**: #28a745 (Green)
- **Warning**: #ffa500 (Orange)
- **Danger**: #dc3545 (Red)
- **Background**: #f8f9fa (Light Gray)

### Typography
- **Headers**: Bold, 24px
- **Body**: Regular, 16px
- **Caption**: Regular, 14px
- **Small**: Regular, 12px

### Components
- **Cards**: 12px border radius, subtle shadows
- **Buttons**: 12px border radius, 16px padding
- **Inputs**: 12px border radius, 14px padding

## 🔔 Notifications

### Push Notifications Setup
1. Configure Firebase Cloud Messaging
2. Update notification settings in profile
3. Handle notification permissions

### Notification Types
- New quote received
- Quote accepted/rejected
- Service request updates
- Provider messages

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# E2E tests
npm run test:e2e
```

## 📈 Performance Optimization

### Implemented Optimizations
- **React Query Caching** - Efficient data fetching and caching
- **Image Optimization** - Lazy loading and compression
- **Bundle Splitting** - Optimized bundle sizes
- **Async Storage** - Persistent local storage

### Monitoring
- Crash reporting with error boundaries
- Performance monitoring
- User analytics tracking

## 🚀 Deployment

### Android Play Store
1. Generate signed APK
2. Upload to Play Console
3. Configure store listing

### iOS App Store
1. Build for distribution
2. Upload to App Store Connect
3. Submit for review

## 🔧 Configuration

### Environment Variables
```bash
# .env
API_BASE_URL=https://api.servicepanda.com.au
GOOGLE_MAPS_API_KEY=your_google_maps_key
STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

### Deep Linking
Configure deep links for:
- Quote notifications
- Service request updates
- Password reset flows

## 📞 Support

For technical support or questions:
- **Email**: dev@servicepanda.com.au
- **Documentation**: [ServicePanda Docs](https://docs.servicepanda.com.au)
- **Issues**: Create GitHub issues for bugs and feature requests

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**ServicePanda Customer App v1.0.0**  
Built with ❤️ for Australian service marketplace
