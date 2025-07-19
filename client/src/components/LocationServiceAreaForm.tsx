import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, MapPin, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ServiceArea {
  id?: number;
  centerAddress: string;
  centerLat?: string;
  centerLng?: string;
  radiusKm: number;
  areaName?: string;
}

interface LocationServiceAreaFormProps {
  providerId: number;
  initialAddress?: string;
  onServiceAreasChange?: (areas: ServiceArea[]) => void;
  onAddServiceArea?: (area: ServiceArea) => void;
}

declare global {
  interface Window {
    google: any;
  }
}

export function LocationServiceAreaForm({ 
  providerId, 
  initialAddress = "", 
  onServiceAreasChange,
  onAddServiceArea 
}: LocationServiceAreaFormProps) {
  const { toast } = useToast();
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([]);
  const [currentArea, setCurrentArea] = useState<Partial<ServiceArea>>({
    centerAddress: initialAddress || "",
    radiusKm: 25,
    areaName: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // Google Maps references
  const mapRef = useRef<HTMLDivElement>(null);
  const autocompleteRef = useRef<any>(null);
  const mapInstanceRef = useRef<any>(null);
  const circleRef = useRef<any>(null);
  const addressInputRef = useRef<HTMLInputElement>(null);

  // Radius options (10-100km, default 25km)
  const radiusOptions = [10, 15, 20, 25, 30, 40, 50, 75, 100];

  // Load existing service areas
  useEffect(() => {
    fetchExistingServiceAreas();
  }, [providerId]);

  // Initialize Google Maps
  useEffect(() => {
    if (window.google && window.google.maps && !mapLoaded) {
      initializeGoogleMaps();
      setMapLoaded(true);
    }
  }, [mapLoaded]);

  // Update map when current area changes
  useEffect(() => {
    if (mapInstanceRef.current && currentArea.centerLat && currentArea.centerLng) {
      updateMapLocation();
    }
  }, [currentArea.centerLat, currentArea.centerLng, currentArea.radiusKm]);

  // Update initial address when prop changes
  useEffect(() => {
    console.log('Initial address received:', initialAddress);
    if (initialAddress && initialAddress !== currentArea.centerAddress) {
      console.log('Setting initial address:', initialAddress);
      setCurrentArea(prev => ({
        ...prev,
        centerAddress: initialAddress,
      }));
    }
  }, [initialAddress]);

  // Pre-populate map if we have an initial address with coordinates  
  useEffect(() => {
    if (initialAddress && window.google && window.google.maps && mapInstanceRef.current && !currentArea.centerLat) {
      // Try to geocode the initial address to get coordinates and show on map
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: initialAddress }, (results: any, status: any) => {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          const lat = location.lat();
          const lng = location.lng();
          
          setCurrentArea(prev => ({
            ...prev,
            centerLat: lat.toString(),
            centerLng: lng.toString(),
          }));
          
          // Center map on the address
          mapInstanceRef.current.setCenter(location);
          mapInstanceRef.current.setZoom(12);
        }
      });
    }
  }, [initialAddress, mapLoaded]);

  const fetchExistingServiceAreas = async () => {
    try {
      const response = await apiRequest("GET", `/api/provider/${providerId}/location-service-areas`);
      const areas = await response.json();
      setServiceAreas(areas);
      onServiceAreasChange?.(areas);
    } catch (error) {
      console.error("Error fetching service areas:", error);
    }
  };

  const initializeGoogleMaps = () => {
    if (!mapRef.current || !addressInputRef.current) return;

    try {
      console.log('Initializing Google Maps...');
      
      // Initialize map (centered on Australia)
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: -25.2744, lng: 133.7751 }, // Center of Australia
        zoom: 5,
        mapTypeControl: false,
        streetViewControl: false,
      });
      
      mapInstanceRef.current = map;
      console.log('Google Maps initialized successfully');

      // Initialize autocomplete
      const autocomplete = new window.google.maps.places.Autocomplete(
        addressInputRef.current,
        {
          types: ['address'],
          componentRestrictions: { country: 'au' }, // Australia only
        }
      );

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry && place.geometry.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          
          setCurrentArea(prev => ({
            ...prev,
            centerAddress: place.formatted_address || place.name,
            centerLat: lat.toString(),
            centerLng: lng.toString(),
          }));
          
          // Center map on selected location
          map.setCenter({ lat, lng });
          map.setZoom(10);
        }
      });

      autocompleteRef.current = autocomplete;
      
    } catch (error) {
      console.error('Error initializing Google Maps:', error);
      
      // Check if it's an API restriction error
      const errorMessage = error?.message || String(error);
      if (errorMessage.includes('ApiTargetBlocked')) {
        toast({
          title: "Google Maps API Error",
          description: "Maps JavaScript API is not enabled. Please enable 'Maps JavaScript API' in Google Cloud Console.",
          variant: "destructive",
        });
      } else if (errorMessage.includes('RefererNotAllowed')) {
        toast({
          title: "Domain Authorization Error", 
          description: "Your Replit domain needs to be added to Google Cloud Console API restrictions.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Maps Error",
          description: "Failed to initialize Google Maps. Check console for details.",
          variant: "destructive",
        });
      }
    }
  };

  const updateMapLocation = () => {
    if (!mapInstanceRef.current || !currentArea.centerLat || !currentArea.centerLng) return;

    const center = {
      lat: parseFloat(currentArea.centerLat),
      lng: parseFloat(currentArea.centerLng),
    };

    // Center map
    mapInstanceRef.current.setCenter(center);
    mapInstanceRef.current.setZoom(10);

    // Remove existing circle
    if (circleRef.current) {
      circleRef.current.setMap(null);
    }

    // Add service radius circle (green zone)
    const circle = new window.google.maps.Circle({
      strokeColor: '#22c55e',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#22c55e',
      fillOpacity: 0.2,
      map: mapInstanceRef.current,
      center: center,
      radius: (currentArea.radiusKm || 25) * 1000, // Convert km to meters
    });

    circleRef.current = circle;

    // Add center marker
    new window.google.maps.Marker({
      position: center,
      map: mapInstanceRef.current,
      title: currentArea.centerAddress,
      icon: {
        url: 'data:image/svg+xml;base64,' + btoa(`
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="#ef4444"/>
            <circle cx="12" cy="10" r="3" fill="white"/>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(24, 24),
      },
    });
  };

  const handleAddServiceArea = async () => {
    if (!currentArea.centerAddress || !currentArea.radiusKm) {
      toast({
        title: "Missing Information",
        description: "Please select an address and radius",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiRequest("POST", `/api/provider/${providerId}/location-service-areas`, {
        centerAddress: currentArea.centerAddress,
        centerLat: currentArea.centerLat,
        centerLng: currentArea.centerLng,
        radiusKm: currentArea.radiusKm,
        areaName: currentArea.areaName || undefined,
      });

      const newArea = await response.json();
      const updatedAreas = [...serviceAreas, newArea];
      setServiceAreas(updatedAreas);
      onServiceAreasChange?.(updatedAreas);
      onAddServiceArea?.(newArea);

      // Reset form
      setCurrentArea({
        centerAddress: "",
        radiusKm: 25,
        areaName: "",
      });
      
      // Clear input
      if (addressInputRef.current) {
        addressInputRef.current.value = "";
      }

      // Clear map
      if (circleRef.current) {
        circleRef.current.setMap(null);
      }

      toast({
        title: "Service Area Added!",
        description: `Successfully added service area with ${currentArea.radiusKm}km radius`,
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add service area",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveServiceArea = async (areaId: number) => {
    try {
      // Delete from database first
      await apiRequest("DELETE", `/api/provider/${providerId}/location-service-areas/${areaId}`);
      
      // Then update local state
      const updatedAreas = serviceAreas.filter(area => area.id !== areaId);
      setServiceAreas(updatedAreas);
      onServiceAreasChange?.(updatedAreas);
      
      toast({
        title: "Service Area Removed",
        description: "Service area has been successfully removed",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove service area",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Service Area Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Service Area
          </CardTitle>
          <CardDescription>
            Select your service locations and coverage radius. You can add multiple areas.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="address">Service Location Address *</Label>
              <Input
                id="address"
                ref={addressInputRef}
                placeholder="Enter your service area address..."
                value={currentArea.centerAddress || ""}
                onChange={(e) => setCurrentArea(prev => ({ ...prev, centerAddress: e.target.value }))}
                onFocus={() => {
                  if (!mapLoaded && window.google && window.google.maps) {
                    initializeGoogleMaps();
                    setMapLoaded(true);
                  }
                }}
              />
              <p className="text-sm text-muted-foreground">
                Start typing to see address suggestions
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="radius">Service Radius *</Label>
              <Select 
                value={currentArea.radiusKm?.toString()} 
                onValueChange={(value) => setCurrentArea(prev => ({ ...prev, radiusKm: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select radius" />
                </SelectTrigger>
                <SelectContent>
                  {radiusOptions.map(radius => (
                    <SelectItem key={radius} value={radius.toString()}>
                      {radius} km radius
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="areaName">Area Name (Optional)</Label>
            <Input
              id="areaName"
              placeholder="e.g., Gold Coast North, Brisbane CBD"
              value={currentArea.areaName || ""}
              onChange={(e) => setCurrentArea(prev => ({ ...prev, areaName: e.target.value }))}
            />
            <p className="text-sm text-muted-foreground">
              Give this service area a friendly name for easy identification
            </p>
          </div>

          <Button 
            onClick={handleAddServiceArea} 
            disabled={isLoading || !currentArea.centerAddress}
            className="w-full"
          >
            {isLoading ? "Adding..." : "Add Service Area"}
          </Button>
        </CardContent>
      </Card>

      {/* Google Map */}
      <Card>
        <CardHeader>
          <CardTitle>Service Area Preview</CardTitle>
          <CardDescription>
            The green zone shows your service coverage area
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            ref={mapRef} 
            className="w-full h-64 rounded-lg border bg-muted"
            style={{ minHeight: '300px' }}
          >
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <MapPin className="h-8 w-8 mb-2" />
              <p>Select an address to preview service area</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Service Areas */}
      {serviceAreas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Service Areas ({serviceAreas.length})</CardTitle>
            <CardDescription>
              Areas where you provide services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {serviceAreas.map((area, index) => (
                <div 
                  key={area.id || index} 
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="h-4 w-4 text-green-600" />
                      <span className="font-medium">
                        {area.areaName || `Service Area ${index + 1}`}
                      </span>
                      <Badge variant="outline">{area.radiusKm}km radius</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {area.centerAddress}
                    </p>
                  </div>
                  {area.id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveServiceArea(area.id!)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}