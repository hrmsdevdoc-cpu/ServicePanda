import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MapPin, Check, AlertCircle, Loader2 } from "lucide-react";

interface AddressSuggestion {
  description: string;
  place_id: string;
  structured_formatting?: {
    main_text: string;
    secondary_text: string;
  };
  formatted_address?: string;
  address_components?: {
    long_name: string;
    short_name: string;
    types: string[];
  }[];
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

interface ParsedAddress {
  streetNumber: string;
  streetName: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
  unit?: string;
}

interface AddressInputProps {
  value: string;
  onChange: (address: string, parsedAddress?: ParsedAddress) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  error?: boolean;
  className?: string;
}

export function AddressInput({
  value,
  onChange,
  placeholder = "Start typing your address...",
  label = "Address",
  required = false,
  error = false,
  className
}: AddressInputProps) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [verified, setVerified] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Parse address components from Google Places API response
  const parseAddressComponents = (components: any[]): ParsedAddress => {
    const parsed: ParsedAddress = {
      streetNumber: '',
      streetName: '',
      suburb: '',
      state: '',
      postcode: '',
      country: ''
    };

    components.forEach(component => {
      const types = component.types;
      
      if (types.includes('street_number')) {
        parsed.streetNumber = component.long_name;
      } else if (types.includes('route')) {
        parsed.streetName = component.long_name;
      } else if (types.includes('subpremise')) {
        parsed.unit = component.long_name;
      } else if (types.includes('locality')) {
        parsed.suburb = component.long_name;
      } else if (types.includes('administrative_area_level_1')) {
        parsed.state = component.short_name;
      } else if (types.includes('postal_code')) {
        parsed.postcode = component.long_name;
      } else if (types.includes('country')) {
        parsed.country = component.short_name;
      }
    });

    return parsed;
  };

  // Validate if address is in Australia and properly formatted
  const validateAustralianAddress = (parsedAddress: ParsedAddress): boolean => {
    return (
      parsedAddress.country === 'AU' &&
      parsedAddress.streetNumber !== '' &&
      parsedAddress.streetName !== '' &&
      parsedAddress.suburb !== '' &&
      parsedAddress.state !== '' &&
      parsedAddress.postcode !== '' &&
      /^\d{4}$/.test(parsedAddress.postcode) // Australian postcodes are 4 digits
    );
  };

  // Fetch address suggestions using Google Places API Autocomplete
  const fetchAddressSuggestions = async (input: string) => {
    if (input.length < 3) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      // Using Google Places API with Australian bias
      const response = await fetch(`/api/address/autocomplete?input=${encodeURIComponent(input)}&types=address&components=country:AU`);
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.predictions || []);
      }
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle input change with debouncing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setVerified(false);
    setShowSuggestions(true);

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce API calls
    timeoutRef.current = setTimeout(() => {
      fetchAddressSuggestions(newValue);
    }, 300);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: AddressSuggestion) => {
    console.log('=== Address suggestion selected ===', suggestion.description);
    
    // Update the input field with the selected address
    onChange(suggestion.description);
    
    // Hide suggestions and clear the list
    setSuggestions([]);
    setShowSuggestions(false);
    setVerified(false);
    
    console.log('=== Address selection completed ===');
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full">
      {label && (
        <Label className={cn("text-sm font-medium", error && "text-red-600")}>
          {label} {required && "*"}
          {error && <span className="text-red-500 text-xs ml-1">Required</span>}
        </Label>
      )}
      
      <div className="relative">
        <Input
          ref={inputRef}
          value={value}
          onChange={handleInputChange}
          onFocus={() => {
            console.log('Input focused, value:', value); // Debug log
            if (value.length >= 3) {
              setShowSuggestions(true);
              fetchAddressSuggestions(value);
            }
          }}
          onBlur={() => {
            // Delay hiding suggestions to allow clicks to register
            setTimeout(() => setShowSuggestions(false), 200);
          }}
          placeholder={placeholder}
          className={cn(
            "pl-10 pr-10",
            error && "border-red-500",
            verified && "border-green-500",
            className
          )}
          autoComplete="off"
        />
        
        {/* Location icon */}
        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        
        {/* Status icon */}
        <div className="absolute right-3 top-3">
          {loading && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
          {!loading && verified && <Check className="h-4 w-4 text-green-500" />}
          {!loading && !verified && value && <AlertCircle className="h-4 w-4 text-yellow-500" />}
        </div>
      </div>

      {/* Address suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div 
          data-suggestions-dropdown
          className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg"
        >
          {suggestions.map((suggestion, index) => {
            // Use structured formatting if available, otherwise fall back to description
            const mainText = suggestion.structured_formatting?.main_text || suggestion.description?.split(', ')[0] || '';
            const secondaryText = suggestion.structured_formatting?.secondary_text || 
                                suggestion.description?.split(', ').slice(1).join(', ') || '';
            
            return (
              <div
                key={suggestion.place_id || index}
                className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-start transition-colors cursor-pointer"
                onMouseDown={(e) => {
                  console.log('=== MOUSE DOWN ===', suggestion.description);
                  e.preventDefault(); // Prevent input blur
                  handleSuggestionSelect(suggestion);
                }}
              >
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">{mainText}</div>
                  {secondaryText && (
                    <div className="text-xs text-gray-500 mt-0.5 truncate">{secondaryText}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Address verification status */}
      {value && !loading && (
        <div className="mt-2 text-xs">
          {verified ? (
            <div className="flex items-center text-green-600">
              <Check className="h-3 w-3 mr-1" />
              Address verified - Australian postal address
            </div>
          ) : (
            <div className="flex items-center text-yellow-600">
              <AlertCircle className="h-3 w-3 mr-1" />
              Please select from suggestions to verify address
            </div>
          )}
        </div>
      )}
    </div>
  );
}