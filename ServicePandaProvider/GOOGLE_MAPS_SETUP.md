# Google Maps API Setup for ServicePanda Provider App

This guide will help you set up Google Maps API for the ServicePanda Provider mobile app to enable address autocomplete functionality.

## Prerequisites

- Google Cloud Platform account
- Access to Google Cloud Console
- ServicePanda Provider app project

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note down your project ID

## Step 2: Enable Required APIs

Enable the following APIs in your Google Cloud project:

1. **Places API** - For address autocomplete functionality
2. **Geocoding API** - For converting addresses to coordinates
3. **Maps JavaScript API** - For web version (if applicable)

### To enable APIs:

1. Go to [APIs & Services > Library](https://console.cloud.google.com/apis/library)
2. Search for each API name
3. Click on the API and press "Enable"

## Step 3: Create API Key

1. Go to [APIs & Services > Credentials](https://console.cloud.google.com/apis/credentials)
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key

## Step 4: Restrict API Key (Recommended for Production)

For security, restrict your API key:

1. Click on your API key in the credentials page
2. Under "Application restrictions":
   - For mobile: Select "Android apps" and add your app's package name and SHA-1 certificate fingerprint
   - For iOS: Select "iOS apps" and add your app's bundle identifier
3. Under "API restrictions":
   - Select "Restrict key"
   - Choose only the APIs you enabled (Places API, Geocoding API, Maps JavaScript API)

## Step 5: Configure the App

1. Open `/src/config/googleMaps.ts`
2. Replace `YOUR_GOOGLE_MAPS_API_KEY_HERE` with your actual API key:

```typescript
export const GOOGLE_MAPS_CONFIG = {
  API_KEY: "your-actual-api-key-here",
  // ... rest of config
};
```

## Step 6: Test the Implementation

1. Run the app: `npm run android` or `npm run ios`
2. Navigate to Service Area screen
3. Start typing an address in the address field
4. You should see autocomplete suggestions appear
5. Select a suggestion to verify the address

## Troubleshooting

### Common Issues:

1. **"This API project is not authorized to use this API"**

   - Make sure you've enabled the required APIs
   - Check that your API key has access to the APIs

2. **"REQUEST_DENIED" error**

   - Verify your API key is correct
   - Check API restrictions settings

3. **No suggestions appearing**

   - Ensure Places API is enabled
   - Check that your API key has Places API access
   - Verify internet connection

4. **"INVALID_REQUEST" error**
   - Check that the API key is properly configured
   - Ensure the request format is correct

### Debug Steps:

1. Check browser console for error messages
2. Verify API key in Google Cloud Console
3. Test API key with a simple request
4. Check network connectivity

## Security Best Practices

1. **Never commit API keys to version control**
2. **Use environment variables for production**
3. **Restrict API keys to specific apps/domains**
4. **Monitor API usage in Google Cloud Console**
5. **Set up billing alerts**

## Cost Considerations

- Google Maps APIs have usage-based pricing
- Places API: $2.83 per 1,000 requests
- Geocoding API: $5.00 per 1,000 requests
- Set up billing alerts to monitor costs

## Additional Resources

- [Google Places API Documentation](https://developers.google.com/maps/documentation/places/web-service)
- [Google Geocoding API Documentation](https://developers.google.com/maps/documentation/geocoding)
- [React Native Google Places Autocomplete](https://github.com/FaridSafi/react-native-google-places-autocomplete)

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Google Cloud Console logs
3. Contact the development team
4. Check Google Maps API status page
