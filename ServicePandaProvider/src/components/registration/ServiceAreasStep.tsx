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

const ServiceAreasStep = ({ providerId, onSubmit, onBack, isLoading }) => {
  const [serviceAreas, setServiceAreas] = useState([]);
  const [address, setAddress] = useState('');
  const [radius, setRadius] = useState('25');
  const [areaName, setAreaName] = useState('');

  const radiusOptions = [
    { value: '5', label: '5 km radius' },
    { value: '10', label: '10 km radius' },
    { value: '15', label: '15 km radius' },
    { value: '20', label: '20 km radius' },
    { value: '25', label: '25 km radius' },
    { value: '30', label: '30 km radius' },
    { value: '40', label: '40 km radius' },
    { value: '50', label: '50 km radius' },
  ];

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
    };

    setServiceAreas(prev => [...prev, newServiceArea]);
    
    // Reset form
    setAddress('');
    setAreaName('');
    
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
          <View style={styles.addressRow}>
            <TextInput
              style={styles.addressInput}
              value={address}
              onChangeText={setAddress}
              placeholder="Enter full Australian address (e.g., 123 Main Street, Brisbane QLD 4000)"
              multiline
              numberOfLines={2}
            />
            <TouchableOpacity style={styles.locateButton}>
              <Text style={styles.locateButtonText}>Locate</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.hint}>
            Start typing an Australian address to see suggestions, or use "Locate" to find manually entered addresses
          </Text>
        </View>

        {/* Service Radius */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Service Radius *</Text>
          <View style={styles.dropdownContainer}>
            <Text style={styles.dropdownText}>
              {radiusOptions.find(opt => opt.value === radius)?.label || 'Select radius'}
            </Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </View>
          {/* Simple dropdown simulation - in real app you'd use a proper dropdown */}
          <ScrollView style={styles.dropdownOptions} nestedScrollEnabled>
            {radiusOptions.map(option => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.dropdownOption,
                  radius === option.value && styles.dropdownOptionSelected
                ]}
                onPress={() => setRadius(option.value)}
              >
                <Text style={[
                  styles.dropdownOptionText,
                  radius === option.value && styles.dropdownOptionTextSelected
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
            Maps unavailable: You can still add service areas by typing the full address manually (e.g., "123 Main Street, Brisbane QLD 4000")
          </Text>
        </View>
      </View>

      {/* Service Area Preview */}
      <View style={styles.previewCard}>
        <Text style={styles.previewTitle}>Service Area Preview</Text>
        <Text style={styles.previewDescription}>
          The green zone shows your service coverage area
        </Text>

        {serviceAreas.length === 0 ? (
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
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  addCard: {
    backgroundColor: colors.white,
    margin: 20,
    marginTop: 0,
    padding: 20,
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
    alignItems: 'flex-start',
  },
  addressInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 50,
    textAlignVertical: 'top',
    marginRight: 10,
  },
  locateButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
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
  dropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    backgroundColor: colors.white,
  },
  dropdownText: {
    fontSize: 16,
    color: colors.text,
  },
  dropdownArrow: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  dropdownOptions: {
    maxHeight: 150,
    marginTop: 5,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  dropdownOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdownOptionSelected: {
    backgroundColor: colors.primaryLight,
  },
  dropdownOptionText: {
    fontSize: 16,
    color: colors.text,
  },
  dropdownOptionTextSelected: {
    color: colors.primary,
    fontWeight: '500',
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
    color: colors.warning,
    textAlign: 'center',
    lineHeight: 20,
  },
  previewCard: {
    backgroundColor: colors.white,
    margin: 20,
    marginTop: 0,
    padding: 20,
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
