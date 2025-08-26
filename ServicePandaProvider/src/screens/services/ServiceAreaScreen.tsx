import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Card,
  TextInput,
  Button,
  IconButton,
  Divider,
  Surface,
} from 'react-native-paper';
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
  const [radius, setRadius] = useState('25 km radius');
  const [areaName, setAreaName] = useState('');
  const [showRadiusDropdown, setShowRadiusDropdown] = useState(false);
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([
    {
      id: '1',
      address: 'BRISBANE, 4000',
      radius: '25km radius',
      areaName: 'brisbane',
    },
    {
      id: '2',
      address: 'BRISBANE, 4000',
      radius: '50km radius',
      areaName: '4000',
    },
  ]);

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

    const newServiceArea: ServiceArea = {
      id: Date.now().toString(),
      address: address.trim().toUpperCase(),
      radius: radius,
      areaName: areaName.trim() || address.trim().split(',')[0],
    };

    setServiceAreas([...serviceAreas, newServiceArea]);
    setAddress('');
    setAreaName('');
    setRadius('25 km radius');
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
            setServiceAreas(serviceAreas.filter(area => area.id !== id));
          },
        },
      ]
    );
  };

  const handleLocate = () => {
    Alert.alert('Location', 'Location feature would be implemented here');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
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
        </View>

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
                <TextInput
                  label="Service Location Address *"
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Enter full address (e.g., 123 Main St, Brisbane QLD 4000)"
                  mode="outlined"
                  style={styles.addressInput}
                  right={
                    <TextInput.Icon
                      icon="map-marker"
                      onPress={handleLocate}
                    />
                  }
                />
                <Button
                  mode="outlined"
                  onPress={handleLocate}
                  style={styles.locateButton}
                >
                  Locate
                </Button>
              </View>
              <Text variant="bodySmall" style={styles.helperText}>
                Start typing an Australian address to see suggestions, or use "Locate" to find manually entered addresses
              </Text>

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
              >
                Add Service Area
              </Button>

              {/* Warning Message */}
              <Surface style={styles.warningSurface}>
                <Text variant="bodySmall" style={styles.warningText}>
                  ⚠️ Maps unavailable: You can still add service areas by typing the full address manually (e.g., "123 Main Street, Brisbane QLD 4000")
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
            <View style={styles.previewContainer}>
              <IconButton icon="map-marker" size={48} iconColor={colors.textTertiary} />
              <Text variant="bodyMedium" style={styles.previewText}>
                Select an address to preview service area
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Your Service Areas */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Your Service Areas ({serviceAreas.length})
            </Text>
            <Text variant="bodyMedium" style={styles.sectionDescription}>
              Areas where you provide services
            </Text>
            
            {serviceAreas.map((area, index) => (
              <View key={area.id}>
                <View style={styles.serviceAreaItem}>
                  <View style={styles.serviceAreaInfo}>
                    <View style={styles.checkmarkContainer}>
                      <IconButton icon="check" size={16} iconColor={colors.surface} />
                    </View>
                    <View style={styles.serviceAreaDetails}>
                      <Text variant="bodyMedium" style={styles.serviceAreaAddress}>
                        {area.address}
                      </Text>
                      <Text variant="bodySmall" style={styles.serviceAreaName}>
                        {area.areaName}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.serviceAreaActions}>
                    <Text variant="bodySmall" style={styles.radiusText}>
                      {area.radius}
                    </Text>
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
            ))}
          </Card.Content>
        </Card>
      </ScrollView>
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
  addressInput: {
    flex: 1,
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
    marginBottom: 16,
    fontSize: 12,
    lineHeight: 16,
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
  previewText: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  serviceAreaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
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
    fontWeight: '500',
    color: colors.text,
  },
  serviceAreaName: {
    color: colors.textSecondary,
    marginTop: 2,
  },
  serviceAreaActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radiusText: {
    color: colors.textSecondary,
    marginRight: 8,
  },
  itemDivider: {
    marginLeft: 48,
  },
});

module.exports = ServiceAreaScreen;
