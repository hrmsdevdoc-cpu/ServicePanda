import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput as RNTextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { colors } from '../utils/theme';
import { GOOGLE_MAPS_CONFIG } from '../config/googleMaps';

interface AddressSuggestion {
  description: string;
  place_id: string;
  structured_formatting?: {
    main_text: string;
    secondary_text: string;
  };
}

interface CustomAddressAutocompleteProps {
  value: string;
  onChange: (address: string, details?: any) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  error?: boolean;
  style?: any;
}

const CustomAddressAutocomplete: React.FC<CustomAddressAutocompleteProps> = ({
  value,
  onChange,
  placeholder = "Start typing your address...",
  label = "Address",
  required = false,
  error = false,
  style,
}) => {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [verified, setVerified] = useState(false);
  const [hasError, setHasError] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const inputRef = useRef<RNTextInput>(null);

  // Fetch address suggestions from your server (same as web version)
  const fetchSuggestions = async (input: string) => {
    if (input.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    setHasError(false);

    try {
      // Use the same server endpoint as the web version
      const { API_BASE_URL } = require('../config/api');
      const response = await fetch(
        `${API_BASE_URL}/api/address/autocomplete?input=${encodeURIComponent(input)}&types=address&components=country:AU`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === 'OK') {
        setSuggestions(data.predictions || []);
      } else {
        console.warn('Address autocomplete error:', data.error || data.status);
        setSuggestions([]);
        if (data.error) {
          setHasError(true);
        }
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change with debouncing
  const handleInputChange = (text: string) => {
    onChange(text);
    setVerified(false);
    setShowSuggestions(true);

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce API calls
    timeoutRef.current = setTimeout(() => {
      fetchSuggestions(text);
    }, 300);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = async (suggestion: AddressSuggestion) => {
    console.log('Suggestion selected:', suggestion);
    
    // Update the input field
    onChange(suggestion.description);
    setSuggestions([]);
    setShowSuggestions(false);
    setVerified(true);

    // Optionally fetch place details for coordinates using server endpoint
    try {
      const { API_BASE_URL } = require('../config/api');
      const response = await fetch(
        `${API_BASE_URL}/api/address/details?place_id=${suggestion.place_id}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'OK' && data.result) {
          // Check if it's an Australian address
          const isAustralian = data.result.address_components?.some((component: any) => 
            component.types.includes('country') && component.short_name === 'AU'
          );

          if (isAustralian) {
            onChange(suggestion.description, data.result);
          } else {
            Alert.alert(
              'Invalid Location',
              'Please select an Australian address. This service is only available in Australia.',
              [{ text: 'OK' }]
            );
            setVerified(false);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setTimeout(() => setShowSuggestions(false), 200);
    };

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // If there's an error with the API, show fallback message
  if (hasError) {
    return (
      <View style={[styles.container, style]}>
        {label && (
          <Text style={[styles.label, error && styles.labelError]}>
            {label} {required && "*"}
            {error && <Text style={styles.errorText}> Required</Text>}
          </Text>
        )}
        
        <View style={styles.fallbackContainer}>
          <Text style={styles.fallbackText}>
            Address autocomplete is temporarily unavailable. Please enter the full address manually.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, error && styles.labelError]}>
          {label} {required && "*"}
          {error && <Text style={styles.errorText}> Required</Text>}
        </Text>
      )}
      
      <View style={styles.inputContainer}>
        <View style={[
          styles.textInputContainer,
          error && styles.textInputError,
          verified && styles.textInputVerified,
          style,
        ]}>
          <Text style={styles.mapIcon}>📍</Text>
          <RNTextInput
            ref={inputRef}
            value={value}
            onChangeText={handleInputChange}
            onFocus={() => {
              if (value.length >= 3) {
                setShowSuggestions(true);
                fetchSuggestions(value);
              }
            }}
            onBlur={() => {
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            placeholder={placeholder}
            placeholderTextColor={colors.textSecondary}
            style={styles.textInput}
            autoCorrect={false}
            autoCapitalize="words"
            returnKeyType="search"
          />
          
          <View style={styles.rightIconContainer}>
            {isLoading && <ActivityIndicator size="small" color={colors.primary} />}
            {!isLoading && verified && <Text style={styles.checkIcon}>✓</Text>}
            {!isLoading && !verified && value && <Text style={styles.warningIcon}>⚠</Text>}
          </View>
        </View>
      </View>

      {/* Suggestions dropdown - positioned outside input container */}
      {showSuggestions && suggestions.length > 0 && (
        <View style={styles.suggestionsWrapper}>
          <View style={styles.suggestionsContainer}>
            <ScrollView 
              style={styles.suggestionsList}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {suggestions.map((suggestion, index) => {
                const mainText = suggestion.structured_formatting?.main_text || suggestion.description?.split(', ')[0] || '';
                const secondaryText = suggestion.structured_formatting?.secondary_text || 
                                    suggestion.description?.split(', ').slice(1).join(', ') || '';
                
                return (
                  <TouchableOpacity
                    key={suggestion.place_id || index}
                    style={styles.suggestionItem}
                    onPress={() => handleSuggestionSelect(suggestion)}
                  >
                    <Text style={styles.mapIconSmall}>📍</Text>
                    <View style={styles.suggestionTextContainer}>
                      <Text style={styles.suggestionMainText}>{mainText}</Text>
                      {secondaryText && (
                        <Text style={styles.suggestionSecondaryText}>{secondaryText}</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      )}

      {/* Address verification status */}
      {value && !isLoading && (
        <View style={styles.statusContainer}>
          {verified ? (
            <View style={styles.verifiedStatus}>
              <Text style={styles.checkIcon}>✓</Text>
              <Text style={styles.verifiedText}>Address verified - Australian postal address</Text>
            </View>
          ) : (
            <View style={styles.warningStatus}>
              <Text style={styles.warningIcon}>⚠</Text>
              <Text style={styles.warningText}>Please select from suggestions to verify address</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  labelError: {
    color: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
  },
  inputContainer: {
    position: 'relative',
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 56,
  },
  textInputError: {
    borderColor: colors.error,
  },
  textInputVerified: {
    borderColor: colors.success,
  },
  mapIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 4,
    minHeight: 40,
  },
  rightIconContainer: {
    paddingLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 24,
  },
  checkIcon: {
    fontSize: 16,
    color: colors.success,
    fontWeight: 'bold',
  },
  warningIcon: {
    fontSize: 16,
    color: colors.warning,
  },
  suggestionsWrapper: {
    marginTop: 4,
    zIndex: 9999,
    elevation: 10,
  },
  suggestionsContainer: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  suggestionsList: {
    maxHeight: 200,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  mapIconSmall: {
    fontSize: 14,
    marginRight: 8,
  },
  suggestionTextContainer: {
    flex: 1,
  },
  suggestionMainText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  suggestionSecondaryText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusContainer: {
    marginTop: 8,
  },
  verifiedStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedText: {
    fontSize: 12,
    color: colors.success,
    marginLeft: 4,
  },
  warningStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  warningText: {
    fontSize: 12,
    color: colors.warning,
    marginLeft: 4,
  },
  fallbackContainer: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    padding: 16,
    minHeight: 56,
    justifyContent: 'center',
  },
  fallbackText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default CustomAddressAutocomplete;
