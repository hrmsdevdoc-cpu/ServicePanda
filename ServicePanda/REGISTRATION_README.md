# ServicePanda Provider Registration System

## Overview

The ServicePanda mobile app now includes a comprehensive multi-step registration system for service providers, mirroring the functionality of the web application. This system guides providers through a complete onboarding process with progress tracking and resumption capabilities.

## Features

### Multi-Step Registration Flow
1. **Basic Information** - Personal and business details
2. **Service Selection** - Choose services to provide
3. **Service Areas** - Define geographic coverage
4. **Document Upload** - Upload required verification documents
5. **Completion** - Success confirmation and next steps

### Key Features
- **Progress Tracking** - Visual step indicators with completion status
- **Resume Capability** - Users can return and continue from where they left off
- **Form Validation** - Comprehensive input validation with error messages
- **Document Management** - File upload with size and type validation
- **Responsive Design** - Mobile-optimized UI components
- **API Integration** - Seamless integration with existing backend APIs

## Navigation

### Accessing Registration
- **From Signup Screen**: Tap "Join as Service Provider" button
- **Direct Navigation**: Navigate to `ProviderRegistration` screen
- **URL Parameter**: Support for direct step navigation (e.g., `?step=2`)

### Screen Flow
```
Login → Signup → ProviderRegistration (Step 1) → Step 2 → Step 3 → Step 4 → Success
```

## Components

### Main Registration Screen
- `ProviderRegistrationScreen.tsx` - Main orchestrator component
- Handles step progression and API calls
- Manages overall registration state

### Step Components
- `BasicInfoStep.tsx` - Personal and business information collection
- `ServicesStep.tsx` - Service category selection
- `ServiceAreasStep.tsx` - Geographic coverage configuration
- `DocumentUploadStep.tsx` - Document upload and validation

## API Integration

### Endpoints Used
- `POST /api/provider/register` - Create provider account
- `POST /api/provider/services` - Add selected services
- `POST /api/provider/{id}/service-areas` - Set service areas
- `POST /api/provider/{id}/documents` - Upload documents
- `GET /api/service-categories` - Fetch available services
- `GET /api/australian-states` - Fetch Australian states
- `GET /api/regions/state/{id}` - Fetch regions for state
- `GET /api/suburbs/{postcode}` - Fetch suburbs for postcode

### Data Flow
1. **Step 1**: Provider account creation with basic info
2. **Step 2**: Service selection and association
3. **Step 3**: Service area configuration
4. **Step 4**: Document upload and verification

## State Management

### Local State
- Form data for each step
- Document file references
- Current step tracking
- Loading states

### Persistent Storage
- Provider ID storage in AsyncStorage
- Progress resumption on app restart
- Form data persistence between steps

## Validation

### Form Validation
- Required field validation
- Email format validation
- Password strength requirements
- Australian mobile number validation
- File type and size validation

### Error Handling
- User-friendly error messages
- Field-level error display
- API error handling
- Network connectivity checks

## Styling

### Theme System
- Consistent color scheme
- Responsive design patterns
- Mobile-optimized components
- Accessibility considerations

### Component Styling
- Card-based layouts
- Progress indicators
- Interactive elements
- Loading states

## Usage Examples

### Starting Registration
```typescript
// Navigate to registration
navigation.navigate('ProviderRegistration');
```

### Handling Step Completion
```typescript
const handleStep1Submit = async (data) => {
  try {
    const response = await apiService.request('POST', '/api/provider/register', data);
    setProviderId(response.id);
    setCurrentStep(2);
  } catch (error) {
    Alert.alert('Error', error.message);
  }
};
```

### Document Upload
```typescript
const pickDocument = async (documentType) => {
  try {
    const result = await DocumentPicker.pick({
      type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
    });
    // Handle file selection
  } catch (error) {
    // Handle cancellation or errors
  }
};
```

## Dependencies

### Required Packages
- `react-native-document-picker` - File selection
- `@react-native-async-storage/async-storage` - Data persistence
- `@react-navigation/stack` - Navigation

### Internal Dependencies
- `ApiService` - API communication
- `colors` theme - Consistent styling
- Type definitions - TypeScript interfaces

## Testing

### Test Scenarios
- Complete registration flow
- Step navigation (forward/backward)
- Form validation
- Document upload
- Error handling
- Progress resumption

### Test Data
- Valid/invalid form inputs
- Various file types and sizes
- Network error conditions
- API response scenarios

## Future Enhancements

### Planned Features
- Offline support
- Multi-language support
- Advanced validation rules
- Progress analytics
- Admin approval workflow

### Technical Improvements
- Performance optimization
- Enhanced error handling
- Better accessibility
- Unit test coverage

## Troubleshooting

### Common Issues
- **Document Upload Fails**: Check file size and type
- **API Errors**: Verify network connectivity and server status
- **Navigation Issues**: Ensure proper screen registration
- **State Loss**: Check AsyncStorage implementation

### Debug Information
- Console logging for API calls
- Step progression tracking
- Form validation feedback
- Error boundary handling

## Support

For technical support or questions about the registration system, please refer to:
- API documentation
- Component source code
- Error logs and debugging information
- Development team resources
