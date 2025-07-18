import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Check, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddressSuggestion {
  description: string;
  place_id: string;
  structured_formatting?: {
    main_text: string;
    secondary_text: string;
  };
}

interface ParsedAddress {
  streetNumber?: string;
  street?: string;
  suburb?: string;
  state?: string;
  postcode?: string;
  country?: string;
}

interface AddressInputProps {
  value: string;
  onChange: (address: string, parsedAddress?: ParsedAddress) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
}

export default function AddressInputFixed({
  value,
  onChange,
  label,
  placeholder = "Enter address...",
  required = false,
  error,
  className
}: AddressInputProps) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Fetch address suggestions from Google Places API
  const fetchAddressSuggestions = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/address/autocomplete?input=${encodeURIComponent(query)}&types=address&components=country:AU`
      );
      
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
    console.log('Input changed to:', newValue);
    onChange(newValue);
    setVerified(false);
    setShowSuggestions(true);

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Only fetch suggestions if we have enough characters
    if (newValue.length >= 3) {
      timeoutRef.current = setTimeout(() => {
        fetchAddressSuggestions(newValue);
      }, 300);
    } else {
      setSuggestions([]);
    }
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
            console.log('Input focused, value:', value);
            if (value.length >= 3) {
              setShowSuggestions(true);
              fetchAddressSuggestions(value);
            }
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
        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg">
          {suggestions.map((suggestion, index) => {
            const mainText = suggestion.structured_formatting?.main_text || suggestion.description?.split(', ')[0] || '';
            const secondaryText = suggestion.structured_formatting?.secondary_text || 
                                suggestion.description?.split(', ').slice(1).join(', ') || '';
            
            return (
              <div
                key={suggestion.place_id || index}
                className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-start transition-colors cursor-pointer"
                onClick={() => {
                  console.log('=== DIV CLICKED ===', suggestion.description);
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