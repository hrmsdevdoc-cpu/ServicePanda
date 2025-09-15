const React = require('react');
const { useState } = require('react');
const {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} = require('react-native');
const { colors } = require('../../utils/theme');
const CustomAddressAutocomplete = require('../CustomAddressAutocomplete').default;
const SimpleAddressInput = require('../SimpleAddressInput').default;
const ServiceAreaMapFallback = require('../ServiceAreaMapFallback').default;

// Try to import react-native-maps, fallback to null if not available
let ServiceAreaMap = null;
try {
  ServiceAreaMap = require('../ServiceAreaMap').default;
} catch (error) {
  console.log('react-native-maps not available, using fallback map');
}

const ServiceAreasStep = ({ providerId, onSubmit, onBack, isLoading, formData }) => {
  const [serviceAreas, setServiceAreas] = useState([]);
  const [address, setAddress] = useState(formData?.address || '');
  const [addressDetails, setAddressDetails] = useState(null);
  const [radius, setRadius] = useState('25');
  const [areaName, setAreaName] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [useSimpleInput, setUseSimpleInput] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const radiusOptions = [
    { value: '5', label: '5 km radius' },
    { value: '10', label: '10 km radius' },
    { value: '15', label: '15 km radius' },
    { value: '20', label: '20 km radius' },
    { value: '25', label: '25 km radius' },
    { value: '30', label: '30 km radius' },
    { value: '35', label: '35 km radius' },
    { value: '40', label: '40 km radius' },
    { value: '45', label: '45 km radius' },
    { value: '50', label: '50 km radius' },
    { value: '55', label: '55 km radius' },
    { value: '60', label: '60 km radius' },
    { value: '65', label: '65 km radius' },
    { value: '70', label: '70 km radius' },
  ];

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

  const addServiceArea = () => {
    if (!address.trim()) {
      Alert.alert('Error', 'Please enter a service location address.');
      return;
    }

    if (!radius) {
      Alert.alert('Error', 'Please select a service radius.');
      return;
    }

    const newServiceArea = {
      id: Date.now(), // Temporary ID for UI
      address: address.trim(),
      radius: parseInt(radius),
      areaName: areaName.trim() || null,
      coordinates: addressDetails?.geometry ? {
        lat: addressDetails.geometry.location.lat,
        lng: addressDetails.geometry.location.lng
      } : null,
    };

    setServiceAreas(prev => [...prev, newServiceArea]);
    
    // Reset form
    setAddress('');
    setAddressDetails(null);
    setAreaName('');
    setSelectedLocation(null);
    
    Alert.alert('Success', 'Service area added successfully!');
  };

  const removeServiceArea = (id) => {
    setServiceAreas(prev => prev.filter(area => area.id !== id));
  };

  const handleSubmit = () => {
    if (serviceAreas.length === 0) {
      Alert.alert('Error', 'Please add at least one service area.');
      return;
    }

    // Transform data for API
    const areasForAPI = serviceAreas.map(area => ({
      address: area.address,
      radius: area.radius,
      areaName: area.areaName,
    }));

    onSubmit(areasForAPI);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Service Areas</Text>
        <Text style={styles.subtitle}>Define your service locations with coverage radius</Text>
      </View>

      {/* Add Service Area Card */}
      <View style={styles.addCard}>
        <Text style={styles.cardTitle}>+ Add Service Area</Text>
        <Text style={styles.cardDescription}>
          Select your service locations and coverage radius. You can add multiple areas.
        </Text>

        {/* Service Location Address */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Service Location Address *</Text>
          <View style={styles.addressInputContainer}>
            {useSimpleInput ? (
              <SimpleAddressInput
                value={address}
                onChange={setAddress}
                placeholder="Enter full address (e.g., 123 Main St, Brisbane QLD 4000)"
                style={styles.addressInput}
              />
            ) : (
              <CustomAddressAutocomplete
                value={address}
                onChange={(newAddress, details) => {
                  setAddress(newAddress);
                  setAddressDetails(details);
                  // Clear selected location when typing new address
                  if (newAddress !== address) {
                    setSelectedLocation(null);
                  }
                  // If there's an error, switch to simple input
                  if (details === null && newAddress && newAddress.length > 3) {
                    setUseSimpleInput(true);
                  }
                }}
                placeholder="Enter full address (e.g., 123 Main St, Brisbane QLD 4000)"
                style={styles.addressInput}
              />
            )}
          </View>
          <TouchableOpacity style={styles.locateButton} onPress={handleLocate}>
            <Text style={styles.locateButtonText}>Locate</Text>
          </TouchableOpacity>
          <Text style={styles.hint}>
            Start typing an address to see suggestions. Select from the dropdown to verify the location.
          </Text>
          <TouchableOpacity 
            style={styles.switchInputButton}
            onPress={() => setUseSimpleInput(!useSimpleInput)}
          >
            <Text style={styles.switchInputText}>
              {useSimpleInput ? 'Use Address Suggestions' : 'Manual Entry'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Service Radius */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Service Radius *</Text>
          <TouchableOpacity 
            style={styles.simpleDropdown}
            onPress={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <Text style={styles.simpleDropdownText}>
              {radiusOptions.find(opt => opt.value === radius)?.label || 'Select radius'}
            </Text>
            <Text style={styles.simpleDropdownArrow}>▼</Text>
          </TouchableOpacity>
          
          {/* Simple Dropdown Options */}
          {isDropdownOpen && (
            <View style={styles.simpleDropdownOptions}>
              <ScrollView 
                style={styles.dropdownScrollView}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
              >
                {radiusOptions.map(option => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.simpleDropdownOption,
                      radius === option.value && styles.simpleDropdownOptionSelected
                    ]}
                    onPress={() => {
                      setRadius(option.value);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <Text style={[
                      styles.simpleDropdownOptionText,
                      radius === option.value && styles.simpleDropdownOptionTextSelected
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Area Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Area Name (Optional)</Text>
          <TextInput
            style={styles.textInput}
            value={areaName}
            onChangeText={setAreaName}
            placeholder="e.g., Gold Coast North, Brisbane CBD"
          />
          <Text style={styles.hint}>
            Give this service area a friendly name for easy identification
          </Text>
        </View>

        {/* Add Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={addServiceArea}
          disabled={!address.trim() || !radius}
        >
          <Text style={styles.addButtonText}>Add Service Area</Text>
        </TouchableOpacity>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            💡 Start typing an address to see suggestions. Select from the dropdown to verify the location.
          </Text>
        </View>
      </View>

      {/* Service Area Preview */}
      <View style={styles.addCard}>
        <Text style={styles.previewTitle}>Service Area Preview</Text>
        <Text style={styles.previewDescription}>
          The green zone shows your service coverage area
        </Text>

        {selectedLocation ? (
          <View style={styles.mapContainer}>
            {ServiceAreaMap ? (
              <ServiceAreaMap
                latitude={selectedLocation.lat}
                longitude={selectedLocation.lng}
                radius={parseInt(radius)}
                address={selectedLocation.address}
              />
            ) : (
              <ServiceAreaMapFallback
                latitude={selectedLocation.lat}
                longitude={selectedLocation.lng}
                radius={parseInt(radius)}
                address={selectedLocation.address}
              />
            )}
            <View style={styles.mapInfo}>
              <Text style={styles.mapAddress}>
                📍 {selectedLocation.address}
              </Text>
              <Text style={styles.mapCoords}>
                {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
              </Text>
              <Text style={styles.mapRadius}>
                Service radius: {radius} km
              </Text>
            </View>
          </View>
        ) : serviceAreas.length === 0 ? (
          <View style={styles.emptyPreview}>
            <Text style={styles.emptyText}>No service areas added yet</Text>
            <Text style={styles.emptySubtext}>Add your first service area above</Text>
          </View>
        ) : (
          <View style={styles.areasList}>
            {serviceAreas.map(area => (
              <View key={area.id} style={styles.areaItem}>
                <View style={styles.areaInfo}>
                  <Text style={styles.areaAddress}>{area.address}</Text>
                  <Text style={styles.areaDetails}>
                    {area.radius} km radius
                    {area.areaName && ` • ${area.areaName}`}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeServiceArea(area.id)}
                >
                  <Text style={styles.removeButtonText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navigation}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.nextButton, serviceAreas.length === 0 && styles.nextButtonDisabled]}
          onPress={handleSubmit}
          disabled={serviceAreas.length === 0 || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Text style={styles.nextButtonText}>Next Step</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  addCard: {
    backgroundColor: colors.white,
    margin: 5,
    marginTop: 0,
    marginBottom: 20,
    paddingHorizontal: 12,
    paddingVertical: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressInputContainer: {
    width: '100%',
    marginBottom: 10,
    zIndex: 10,
    position: 'relative',
  },
  addressInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 50,
    textAlignVertical: 'top',
  },
  locateButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  locateButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
  },
  hint: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 6,
    lineHeight: 16,
  },
  switchInputButton: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.background,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    alignSelf: 'flex-start',
  },
  switchInputText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  // Simple dropdown styles
  simpleDropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    backgroundColor: colors.white,
    minHeight: 48,
  },
  simpleDropdownText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  simpleDropdownArrow: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  simpleDropdownOptions: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.white,
    marginTop: 4,
    maxHeight: 200,
  },
  dropdownScrollView: {
    maxHeight: 200,
  },
  simpleDropdownOption: {
    padding: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.borderLight,
  },
  simpleDropdownOptionSelected: {
    backgroundColor: colors.primary + '10',
  },
  simpleDropdownOptionText: {
    fontSize: 16,
    color: colors.text,
  },
  simpleDropdownOptionTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: colors.warningLight,
    borderWidth: 1,
    borderColor: colors.warning,
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#0c4a6e',
    textAlign: 'center',
    lineHeight: 20,
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
    fontSize: 14,
  },
  mapCoords: {
    color: colors.textSecondary,
    marginBottom: 4,
    fontFamily: 'monospace',
    fontSize: 12,
  },
  mapRadius: {
    color: colors.primary,
    fontWeight: '500',
    fontSize: 12,
  },
  previewCard: {
    backgroundColor: colors.white,
    margin: 20,
    marginTop: 0,
    paddingHorizontal: 12,
    paddingVertical: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  previewDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  emptyPreview: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  areasList: {
    marginTop: 10,
  },
  areaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
    marginBottom: 10,
  },
  areaInfo: {
    flex: 1,
  },
  areaAddress: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  areaDetails: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  removeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 10,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
  },
  backButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  nextButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: colors.border,
  },
  nextButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

module.exports = ServiceAreasStep;
