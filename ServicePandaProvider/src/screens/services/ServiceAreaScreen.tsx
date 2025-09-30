import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import {
  Text,
  Card,
  TextInput,
  Button,
  IconButton,
  Divider,
  Surface,
  ActivityIndicator,
} from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import CustomAddressAutocomplete from '../../components/CustomAddressAutocomplete';
import SimpleAddressInput from '../../components/SimpleAddressInput';
import ServiceAreaMapFallback from '../../components/ServiceAreaMapFallback';
const apiService = require('../../services/api');

// Use the fallback map component since ServiceAreaMap doesn't exist
const ServiceAreaMap = ServiceAreaMapFallback;
const { colors } = require('../../utils/theme');

interface ServiceArea {
  id: string;
  address: string;
  radius: string;
  areaName: string;
}

interface ServiceAreaScreenProps {
  navigation?: {
    goBack: () => void;
  };
  onNavigate?: (screen: string) => void;
  onBack?: () => void;
}

const ServiceAreaScreen = ({ navigation, onNavigate, onBack }: ServiceAreaScreenProps) => {
  const [address, setAddress] = useState('');
  const [addressDetails, setAddressDetails] = useState<any>(null);
  const [radius, setRadius] = useState('25 km radius');
  const [areaName, setAreaName] = useState('');
  const [showRadiusDropdown, setShowRadiusDropdown] = useState(false);
  const [useSimpleInput, setUseSimpleInput] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number, address: string} | null>(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  
  const queryClient = useQueryClient();

  // Get provider ID for API calls
  const [providerId, setProviderId] = useState<string | null>(null);

  useEffect(() => {
    const getProviderId = async () => {
      const id = await apiService.getProviderId();
      setProviderId(id);
    };
    getProviderId();
  }, []);

  // Keyboard visibility listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  // Fetch service areas using React Query
  const { data: serviceAreas = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['service-areas', providerId],
    queryFn: () => providerId ? apiService.getServiceAreas(providerId) : Promise.resolve([]),
    enabled: !!providerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Add service area mutation
  const addServiceAreaMutation = useMutation({
    mutationFn: (data: any) => apiService.addServiceArea(providerId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-areas', providerId] });
      Alert.alert('Success', 'Service area added successfully!');
      // Clear form
      setAddress('');
      setAddressDetails(null);
      setAreaName('');
      setRadius('25 km radius');
      setSelectedLocation(null);
    },
    onError: (error: any) => {
      Alert.alert('Error', error.message || 'Failed to add service area');
    },
  });

  // Delete service area mutation
  const deleteServiceAreaMutation = useMutation({
    mutationFn: (areaId: string) => apiService.deleteServiceArea(providerId, areaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-areas', providerId] });
      Alert.alert('Success', 'Service area deleted successfully!');
    },
    onError: (error: any) => {
      Alert.alert('Error', error.message || 'Failed to delete service area');
    },
  });

  const radiusOptions = [
    '10 km radius',
    '15 km radius', 
    '20 km radius',
    '25 km radius',
    '30 km radius',
    '40 km radius',
    '50 km radius',
    '75 km radius',
    '100 km radius',
  ];


  const handleAddServiceArea = () => {
    if (!address.trim()) {
      Alert.alert('Error', 'Please enter a service location address');
      return;
    }

    if (!providerId) {
      Alert.alert('Error', 'Provider ID not found. Please try logging in again.');
      return;
    }

    const serviceAreaData = {
      centerAddress: address.trim(),
      radiusKm: parseInt(radius.split(' ')[0]), // Extract number from "25 km radius"
      areaName: areaName.trim() || address.trim().split(',')[0],
      // Include coordinates if available
      ...(selectedLocation && {
        centerLat: selectedLocation.lat.toString(),
        centerLng: selectedLocation.lng.toString(),
      }),
    };

    addServiceAreaMutation.mutate(serviceAreaData);
  };

  const handleDeleteServiceArea = (id: string) => {
    Alert.alert(
      'Delete Service Area',
      'Are you sure you want to delete this service area?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteServiceAreaMutation.mutate(id);
          },
        },
      ]
    );
  };

  const handleLocate = () => {
    if (addressDetails && addressDetails.geometry) {
      const lat = addressDetails.geometry.location.lat;
      const lng = addressDetails.geometry.location.lng;
      
      // Update the selected location for map preview
      setSelectedLocation({
        lat: lat,
        lng: lng,
        address: address
      });
      
      Alert.alert(
        'Location Found', 
        `Address located on map!\n\nCoordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}\nAddress: ${address}`,
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert('Location', 'Please select an address from the suggestions first');
    }
  };

  const handleEditServiceArea = (id: string) => {
    const areaToEdit = serviceAreas.find((area: any) => area.id === id);
    if (areaToEdit) {
      setAddress(areaToEdit.centerAddress || '');
      setRadius(areaToEdit.radiusKm ? `${areaToEdit.radiusKm} km radius` : '25 km radius');
      setAreaName(areaToEdit.areaName || '');
      
      // If coordinates are available, set selected location
      if (areaToEdit.centerLat && areaToEdit.centerLng) {
        setSelectedLocation({
          lat: parseFloat(areaToEdit.centerLat),
          lng: parseFloat(areaToEdit.centerLng),
          address: areaToEdit.centerAddress || ''
        });
      }
      
      Alert.alert('Edit Mode', 'Service area details loaded for editing. Make your changes and tap "Add Service Area" to update.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onScrollBeginDrag={() => Keyboard.dismiss()}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* Header */}
        {/* <View style={styles.header}>
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={() => {
              if (navigation) {
                navigation.goBack();
              } else if (onBack) {
                onBack();
              }
            }}
          />
          <Text variant="headlineSmall" style={styles.headerTitle}>
            Service Area
          </Text>
        </View> */}

        <Text variant="titleMedium" style={styles.subtitle}>
          Configure your service coverage
        </Text>

        {/* Configure Service Area Section */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <View style={styles.titleRow}>
                <IconButton icon="cog" size={20} iconColor={colors.primary} />
                <Text variant="titleLarge" style={styles.sectionTitle}>
                  Configure Service Area
                </Text>
              </View>
              <Text variant="bodyMedium" style={styles.sectionDescription}>
                Set up your service coverage area. This determines which job requests you'll receive.
              </Text>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.subSection}>
              <Text variant="titleMedium" style={styles.subSectionTitle}>
                + Add Service Area
              </Text>
              <Text variant="bodyMedium" style={styles.subSectionDescription}>
                Select your service locations and coverage radius. You can add multiple areas.
              </Text>

              {/* Service Location Address */}
              <View style={styles.inputRow}>
                <View style={styles.addressInputContainer}>
                  {useSimpleInput ? (
                    <SimpleAddressInput
                      value={address}
                      onChange={setAddress}
                      placeholder="Enter full address (e.g., 123 Main St, Brisbane QLD 4000)"
                      label="Service Location Address"
                      required={true}
                      style={styles.addressInput}
                    />
                  ) : (
                    <CustomAddressAutocomplete
                      value={address}
                      onChange={(newAddress, details) => {
                        setAddress(newAddress);
                        setAddressDetails(details);
                        
                        // If address is selected from suggestions (details available), dismiss keyboard
                        if (details && details.geometry) {
                          Keyboard.dismiss();
                          // Auto-populate selected location for map preview
                          setSelectedLocation({
                            lat: details.geometry.location.lat,
                            lng: details.geometry.location.lng,
                            address: newAddress
                          });
                        } else {
                          // Clear selected location when typing new address
                          if (newAddress !== address) {
                            setSelectedLocation(null);
                          }
                        }
                        
                        // If there's an error, switch to simple input
                        if (details === null && newAddress && newAddress.length > 3) {
                          setUseSimpleInput(true);
                        }
                      }}
                      placeholder="Enter full address (e.g., 123 Main St, Brisbane QLD 4000)"
                      label="Service Location Address"
                      required={true}
                      style={styles.addressInput}
                    />
                  )}
                </View>
                <Button
                  mode="outlined"
                  onPress={handleLocate}
                  style={styles.locateButton}
                >
                  Locate
                </Button>
              </View>
              <Text variant="bodySmall" style={styles.helperText}>
                {useSimpleInput 
                  ? "Enter the full address manually. Tap 'Done' on keyboard when finished."
                  : "Start typing an Australian address to see suggestions. Keyboard will hide automatically when you select an address."
                }
              </Text>
              
              <TouchableOpacity
                style={styles.switchButton}
                onPress={() => setUseSimpleInput(!useSimpleInput)}
              >
                <Text style={styles.switchButtonText}>
                  {useSimpleInput ? 'Switch to Autocomplete' : 'Switch to Manual Entry'}
                </Text>
              </TouchableOpacity>

              {/* Service Radius */}
              <View style={styles.radiusContainer}>
                <Text variant="bodyMedium" style={styles.radiusLabel}>
                  Service Radius *
                </Text>
                <TouchableOpacity
                  style={styles.dropdownContainer}
                  onPress={() => setShowRadiusDropdown(!showRadiusDropdown)}
                >
                  <Text style={styles.dropdownText}>{radius}</Text>
                  <IconButton
                    icon={showRadiusDropdown ? "chevron-up" : "chevron-down"}
                    size={20}
                    onPress={() => setShowRadiusDropdown(!showRadiusDropdown)}
                  />
                </TouchableOpacity>
                
                {showRadiusDropdown && (
                  <View style={styles.dropdownOptions}>
                    {radiusOptions.map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.dropdownOption,
                          radius === option && styles.dropdownOptionSelected
                        ]}
                        onPress={() => {
                          setRadius(option);
                          setShowRadiusDropdown(false);
                        }}
                      >
                        {radius === option && (
                          <IconButton icon="check" size={16} iconColor={colors.primary} />
                        )}
                        <Text style={[
                          styles.dropdownOptionText,
                          radius === option && styles.dropdownOptionTextSelected
                        ]}>
                          {option}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Area Name */}
              <TextInput
                label="Area Name (Optional)"
                value={areaName}
                onChangeText={setAreaName}
                placeholder="e.g., Gold Coast North, Brisbane CBD"
                mode="outlined"
                style={styles.areaNameInput}
                onSubmitEditing={() => Keyboard.dismiss()}
                returnKeyType="done"
              />
              <Text variant="bodySmall" style={styles.helperText}>
                Give this service area a friendly name for easy identification
              </Text>

              {/* Add Button */}
              <Button
                mode="contained"
                onPress={handleAddServiceArea}
                style={styles.addButton}
                contentStyle={styles.addButtonContent}
                loading={addServiceAreaMutation.isPending}
                disabled={addServiceAreaMutation.isPending}
              >
                {addServiceAreaMutation.isPending ? 'Adding...' : 'Add Service Area'}
              </Button>

              {/* Info Message */}
              <Surface style={styles.infoSurface}>
                <Text variant="bodySmall" style={styles.infoText}>
                  💡 Start typing an address to see suggestions. Select from the dropdown to verify the location.
                </Text>
              </Surface>
            </View>
          </Card.Content>
        </Card>

        {/* Service Area Preview */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Service Area Preview
            </Text>
            <Text variant="bodyMedium" style={styles.sectionDescription}>
              The green zone shows your service coverage area
            </Text>
            {selectedLocation ? (
              <View style={styles.mapContainer}>
                {ServiceAreaMap ? (
                  <ServiceAreaMap
                    latitude={selectedLocation.lat}
                    longitude={selectedLocation.lng}
                    radius={parseInt(radius.split(' ')[0])} // Extract number from "25 km radius"
                    address={selectedLocation.address}
                  />
                ) : (
                  <ServiceAreaMapFallback
                    latitude={selectedLocation.lat}
                    longitude={selectedLocation.lng}
                    radius={parseInt(radius.split(' ')[0])} // Extract number from "25 km radius"
                    address={selectedLocation.address}
                  />
                )}
                <View style={styles.mapInfo}>
                  <Text variant="bodySmall" style={styles.mapAddress}>
                    📍 {selectedLocation.address}
                  </Text>
                  <Text variant="bodySmall" style={styles.mapCoords}>
                    {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                  </Text>
                  <Text variant="bodySmall" style={styles.mapRadius}>
                    Service radius: {radius}
                  </Text>
                </View>
              </View>
            ) : (
            <View style={styles.previewContainer}>
              <IconButton icon="map-marker" size={48} iconColor={colors.textTertiary} />
              <Text variant="bodyMedium" style={styles.previewText}>
                Select an address to preview service area
              </Text>
            </View>
            )}
          </Card.Content>
        </Card>

        {/* Your Service Areas */}
        <Card style={[styles.card, styles.lastCard]}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Your Service Areas ({serviceAreas.length})
            </Text>
            <Text variant="bodyMedium" style={styles.sectionDescription}>
              Areas where you provide services
            </Text>
            
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Loading service areas...</Text>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Failed to load service areas</Text>
                <Button mode="outlined" onPress={() => refetch()} style={styles.retryButton}>
                  Retry
                </Button>
              </View>
            ) : serviceAreas.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No service areas configured yet</Text>
                <Text style={styles.emptySubtext}>Add your first service area above to get started</Text>
              </View>
            ) : (
              serviceAreas.map((area: any, index: number) => (
              <View key={area.id}>
                <View style={styles.serviceAreaItem}>
                  <View style={styles.serviceAreaInfo}>
                    <View style={styles.checkmarkContainer}>
                      <IconButton icon="check" size={16} iconColor={colors.surface} />
                    </View>
                    <View style={styles.serviceAreaDetails}>
                      <Text variant="bodyMedium" style={styles.serviceAreaAddress}>
                        {area.centerAddress || area.address || 'Address not available'}
                      </Text>
                      <Text variant="bodySmall" style={styles.serviceAreaRadius}>
                        🎯 {area.radiusKm ? `${area.radiusKm} km radius` : '25 km radius'}
                      </Text>
                      <Text variant="bodySmall" style={styles.serviceAreaName}>
                        📍 {area.areaName || area.centerAddress?.split(',')[0] || 'Service Area'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.serviceAreaActions}>
                    <IconButton
                      icon="pencil"
                      size={20}
                      iconColor={colors.primary}
                      onPress={() => handleEditServiceArea(area.id)}
                    />
                    <IconButton
                      icon="delete"
                      size={20}
                      iconColor={colors.error}
                      onPress={() => handleDeleteServiceArea(area.id)}
                    />
                  </View>

                </View>
                {index < serviceAreas.length - 1 && <Divider style={styles.itemDivider} />}
              </View>
              ))
            )}
          </Card.Content>
        </Card>
      </ScrollView>
      
      {/* Floating Done Button - appears when keyboard is visible */}
      {keyboardVisible && (
        <View style={styles.floatingButtonContainer}>
          <TouchableOpacity
            style={styles.floatingDoneButton}
            onPress={() => Keyboard.dismiss()}
            activeOpacity={0.8}
          >
            <Text style={styles.floatingDoneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 100, // Extra space at bottom to prevent content from being hidden
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    marginLeft: 8,
    fontWeight: '600',
    color: colors.text,
  },
  subtitle: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    color: colors.textSecondary,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
    backgroundColor: colors.surface,
  },
  lastCard: {
    marginBottom: 32, // Extra margin for the last card
  },
  sectionHeader: {
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  sectionDescription: {
    color: colors.textSecondary,
    lineHeight: 20,
  },
  divider: {
    marginVertical: 16,
  },
  subSection: {
    marginTop: 8,
  },
  subSectionTitle: {
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  subSectionDescription: {
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  addressInputContainer: {
    flex: 1,
    zIndex: 1,
  },
  addressInput: {
    backgroundColor: colors.surface,
  },
  locateButton: {
    height: 56,
    justifyContent: 'center',
  },
  radiusContainer: {
    marginTop: 16,
  },
  radiusLabel: {
    marginBottom: 8,
    color: colors.text,
    fontWeight: '500',
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    minHeight: 56,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
  },
  dropdownText: {
    color: colors.text,
    fontSize: 16,
  },
  dropdownOptions: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    marginTop: 4,
    elevation: 4,
    zIndex: 1000,
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  dropdownOptionSelected: {
    backgroundColor: colors.primaryContainer,
  },
  dropdownOptionText: {
    color: colors.text,
    fontSize: 16,
    marginLeft: 8,
  },
  dropdownOptionTextSelected: {
    color: colors.primary,
    fontWeight: '500',
  },
  areaNameInput: {
    backgroundColor: colors.surface,
    marginTop: 16,
  },
  helperText: {
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 8,
    fontSize: 12,
    lineHeight: 16,
  },
  switchButton: {
    backgroundColor: colors.primaryContainer,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  switchButtonText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '500',
  },
  addButton: {
    marginTop: 8,
    backgroundColor: colors.primary,
  },
  addButtonContent: {
    paddingVertical: 8,
  },
  warningSurface: {
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  warningText: {
    color: '#92400e',
    fontSize: 12,
    lineHeight: 16,
  },
  infoSurface: {
    backgroundColor: '#e0f2fe',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#0ea5e9',
  },
  infoText: {
    color: '#0c4a6e',
    fontSize: 12,
    lineHeight: 16,
  },
  previewContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f4',
    borderRadius: 8,
    padding: 32,
    marginTop: 16,
    minHeight: 120,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  mapContainer: {
    marginTop: 16,
  },
  mapInfo: {
    backgroundColor: colors.surface,
    padding: 12,
    marginTop: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  mapAddress: {
    color: colors.text,
    fontWeight: '500',
    marginBottom: 4,
  },
  mapCoords: {
    color: colors.textSecondary,
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  mapRadius: {
    color: colors.primary,
    fontWeight: '500',
  },
  previewText: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  serviceAreaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 4,
    backgroundColor: 'transparent',
    minHeight: 80,
  },
  serviceAreaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkmarkContainer: {
    backgroundColor: colors.success,
    borderRadius: 12,
    marginRight: 8,
  },
  serviceAreaDetails: {
    marginLeft: 8,
    flex: 1,
  },
  serviceAreaAddress: {
    fontWeight: '600',
    color: colors.text || '#1a1a1a',
    fontSize: 16,
    marginBottom: 4,
  },
  serviceAreaName: {
    color: colors.textSecondary || '#666666',
    marginTop: 4,
    fontSize: 13,
    fontWeight: '500',
    backgroundColor: 'transparent',
  },
  serviceAreaRadius: {
    color: colors.primary || '#007AFF',
    marginTop: 2,
    fontSize: 12,
    fontWeight: '600',
    backgroundColor: 'transparent',
  },
  serviceAreaActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  radiusText: {
    color: colors.textSecondary,
    marginRight: 8,
  },
  itemDivider: {
    marginLeft: 48,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    color: colors.textSecondary,
    fontSize: 16,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    borderColor: colors.primary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  emptySubtext: {
    color: colors.textTertiary,
    fontSize: 14,
    textAlign: 'center',
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    zIndex: 1000,
  },
  floatingDoneButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  floatingDoneButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

module.exports = ServiceAreaScreen;

