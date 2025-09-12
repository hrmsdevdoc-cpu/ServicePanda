// Google Maps API Configuration
// Note: API key is now handled by the server (same as web version)
// The server uses the GOOGLE_MAPS_API_KEY environment variable
export const GOOGLE_MAPS_CONFIG = {
    // API key is managed server-side for security
    // No need to expose API key in mobile app

    // API endpoints
    PLACES_AUTOCOMPLETE_URL: 'https://maps.googleapis.com/maps/api/place/autocomplete/json',
    PLACES_DETAILS_URL: 'https://maps.googleapis.com/maps/api/place/details/json',
    GEOCODING_URL: 'https://maps.googleapis.com/maps/api/geocode/json',

    // Configuration for autocomplete
    AUTOCOMPLETE_CONFIG: {
        language: 'en',
        components: 'country:au', // Restrict to Australia
        types: 'geocode', // Only return geocoding results
        fields: 'formatted_address,geometry,address_components,place_id',
    },

    // Debounce settings
    DEBOUNCE_MS: 300,
    MIN_LENGTH: 3,
    TIMEOUT_MS: 20000,
};

// Instructions for setting up Google Maps API:
// 1. Go to https://console.cloud.google.com/
// 2. Create a new project or select existing one
// 3. Enable the following APIs:
//    - Places API
//    - Geocoding API
//    - Maps JavaScript API (for web version)
// 4. Create credentials (API Key)
// 5. Restrict the API key to your app's bundle ID (for mobile) and domain (for web)
// 6. Replace 'YOUR_GOOGLE_MAPS_API_KEY_HERE' with your actual API key
// 7. For production, consider using environment variables or secure storage
