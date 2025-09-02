# ServicePanda Provider Mobile App

A React Native mobile application for service providers to manage leads, track business activities, and grow their service business.

## Features

- 🔐 **Authentication**: Secure login and registration system
- 📊 **Dashboard**: Real-time stats and recent activity
- 🎯 **Lead Management**: View, purchase, and manage customer leads
- 🛠️ **Service Management**: Configure services and service areas
- 📄 **Document Management**: Upload and manage business documents
- 💳 **Payment Integration**: Stripe payment methods and credit system
- 📱 **Mobile Optimized**: Native mobile experience with offline support

## Prerequisites

- Node.js 18+ 
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Install React Native CLI globally**
   ```bash
   npm install -g @react-native-community/cli
   ```

3. **Install iOS dependencies (macOS only)**
   ```bash
   cd ios && pod install && cd ..
   ```

## Running the App

### Android
```bash
npm run android
```

### iOS (macOS only)
```bash
npm run ios
```

### Start Metro bundler
```bash
npm start
```

## Project Structure

```
src/
├── components/          # Reusable UI components
├── screens/            # App screens
│   ├── auth/          # Authentication screens
│   ├── dashboard/     # Dashboard and stats
│   ├── leads/         # Lead management
│   ├── profile/       # User profile
│   ├── services/      # Service configuration
│   ├── documents/     # Document management
│   └── payment/       # Payment methods
├── navigation/         # Navigation configuration
├── services/           # API and business logic
├── types/             # TypeScript type definitions
├── utils/             # Utility functions and themes
└── hooks/             # Custom React hooks
```

## API Integration

The app connects to your existing ServicePanda backend API. Make sure your server is running on port 3000.

### API Base URL
- **Development**: `http://10.0.2.2:3000` (Android emulator)
- **Production**: Configure in `src/services/api.ts`

### Authentication
The app uses the same authentication system as your web app:
- Provider login: `POST /api/provider/login`
- Headers: `x-provider-id` for authenticated requests

## Key Features

### Dashboard
- Real-time lead counts
- Credit balance display
- Recent activity feed
- Application status alerts

### Lead Management
- View new leads
- Purchase leads with credits or payment
- Track lead status (new, open, closed)
- Customer interaction tracking

### Service Configuration
- Select service categories
- Configure service areas with GPS coordinates
- Upload business documents

### Payment System
- Stripe integration
- Credit balance management
- Voucher redemption
- Payment method management

## Development

### Adding New Screens
1. Create screen component in `src/screens/`
2. Add to navigation in `src/navigation/`
3. Update types if needed

### API Integration
1. Add endpoint to `src/services/api.ts`
2. Create corresponding types in `src/types/`
3. Use React Query for data fetching

### Styling
- Use React Native Paper components
- Follow the theme in `src/utils/theme.ts`
- Use StyleSheet for component-specific styles

## Troubleshooting

### Common Issues

1. **Metro bundler issues**
   ```bash
   npm start --reset-cache
   ```

2. **Android build errors**
   ```bash
   cd android && ./gradlew clean && cd ..
   ```

3. **iOS build errors**
   ```bash
   cd ios && pod deintegrate && pod install && cd ..
   ```

### Debug Mode
- Enable developer menu on device/emulator
- Use React Native Debugger for enhanced debugging
- Check Metro bundler console for errors

## Contributing

1. Follow the existing code structure
2. Use TypeScript for all new code
3. Follow React Native best practices
4. Test on both Android and iOS

## License

This project is part of the ServicePanda platform.


















