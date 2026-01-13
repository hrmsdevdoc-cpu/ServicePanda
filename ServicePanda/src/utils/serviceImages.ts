// Service Images Utility
// Provides fallback images for service categories when API doesn't provide images

export const getServiceImage = (serviceName: string, index: number = 0): string => {
  const serviceImages: { [key: string]: string } = {
    'Plumbing': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop',
    'Electrical': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop',
    'HVAC': 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop',
    'Cleaning': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    'Landscaping': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
    'Painting': 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop',
    'Carpentry': 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop',
    'Appliance Repair': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    'Bike Service': 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=300&fit=crop',
    'Roofing': 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=300&fit=crop',
    'Other': 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop',
    'Home Cleaning': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    'AC Repair': 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop',
    'Kitchen Renovation': 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop',
    'Garden Maintenance': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
    'Plumbing Services': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop',
    'Electrical Work': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop',
    'Plumbing Repair': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop',
    'Electrical Repair': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop',
    'HVAC Repair': 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop',
    'Deep Clean': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    'Garden Care': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
    'Interior & Exterior': 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop',
    'Custom Work': 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop',
    'Fix & Maintain': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    'Fix & Install': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop',
    'Wiring & Repair': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop',
    'Heating & Cooling': 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop'
  };

  // Try exact match first
  if (serviceImages[serviceName]) {
    return serviceImages[serviceName];
  }

  // Try partial match for variations
  const lowerServiceName = serviceName.toLowerCase();
  for (const [key, value] of Object.entries(serviceImages)) {
    if (lowerServiceName.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerServiceName)) {
      return value;
    }
  }

  // Default fallback images based on index
  const defaultImages = [
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop', // Plumbing
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop', // Electrical
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop', // HVAC
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', // Cleaning
    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop', // Landscaping
    'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop', // Painting
    'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop', // Carpentry
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop'  // Appliance
  ];

  return defaultImages[index % defaultImages.length];
};

// Function to get service image with API fallback
export const getServiceImageWithFallback = (apiImage: string | null | undefined, serviceName: string, index: number = 0, baseUrl: string = ''): string => {
  // Return API image if it exists and is not null/undefined
  if (apiImage && apiImage.trim() !== '') {
    // If it's a relative path (starts with /), add the base URL
    if (apiImage.startsWith('/') && baseUrl) {
      return baseUrl + apiImage;
    }
    return apiImage;
  }
  
  // Fallback to static image
  return getServiceImage(serviceName, index);
};
