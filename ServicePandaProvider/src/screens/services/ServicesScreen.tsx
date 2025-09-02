<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
const { colors } = require('../../utils/theme');
const apiService = require('../../services/api');

const { width } = Dimensions.get('window');

// Service icons mapping - same as web version
const serviceIcons = {
  'Domestic Cleaning': '✨',
  'Bond Cleaning': '🏢',
  'Carpet Cleaning': '🏠',
  'Pest Control': '🐛',
  'Gardening': '🌱',
  'Removals': '🚚',
  'Handyman': '🔧',
  'Electrical': '⚡',
  'Air Conditioning': '🔧',
  'Plumbing': '💧',
  'Appliance Repair': '🏠',
  'Demo': '🏠',
  'Gutter Cleaning': '🏠',
  'Locksmith': '🔒',
  'Painting': '🏠',
  'Pool Maintenance': '🏊',
  'Roofing': '🏠',
  'Security Systems': '🏠',
  'Solar Installation': '🏠',
  'Test Service': '🏠',
  'Tree Services': '🌳',
  'Window Cleaning': '🏠',
};

const ServicesScreen = () => {
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const queryClient = useQueryClient();

  // Fetch service categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['/api/service-categories'],
    queryFn: () => apiService.request('GET', '/api/service-categories'),
    retry: false,
  });

  // Fetch provider's existing services
  const { data: providerServices = [], isLoading: servicesLoading } = useQuery({
    queryKey: ['/api/provider/services'],
    queryFn: () => apiService.request('GET', '/api/provider/services'),
    retry: false,
  });

  // Set initial selected services when data loads
  useEffect(() => {
    if (Array.isArray(providerServices) && providerServices.length > 0) {
      // Extract category IDs and remove duplicates
      const serviceIds = providerServices.map((service: any) => service.categoryId);
      const uniqueServiceIds = Array.from(new Set(serviceIds));
      
      console.log('Original service IDs:', serviceIds);
      console.log('Deduplicated service IDs:', uniqueServiceIds);
      
      setSelectedServices(uniqueServiceIds);
    }
  }, [providerServices]);

  // Update provider services mutation
  const updateServicesMutation = useMutation({
    mutationFn: async (categoryIds: number[]) => {
      const providerId = await apiService.getProviderId();
      if (!providerId) {
        throw new Error("Provider information not found.");
      }
      
      console.log('Updating services for provider:', providerId, 'categories:', categoryIds);
      return apiService.request('POST', `/api/service-providers/${providerId}/services`, { categoryIds });
    },
    onSuccess: () => {
      console.log('Services updated successfully');
      queryClient.invalidateQueries({ queryKey: ['/api/provider/services'] });
      Alert.alert(
        'Success!',
        'Your service offerings have been updated successfully.',
        [{ text: 'OK' }]
      );
    },
    onError: (error: any) => {
      console.error('Error updating services:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to update services. Please try again.',
        [{ text: 'OK' }]
      );
    },
  });

  const toggleService = (categoryId: number) => {
    setSelectedServices(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const handleSaveServices = () => {
    setHasAttemptedSubmit(true);

    if (selectedServices.length === 0) {
      Alert.alert(
        'Please select your services',
        'You must select at least one service you specialize in',
        [{ text: 'OK' }]
      );
      return;
    }

    updateServicesMutation.mutate(selectedServices);
  };

  if (categoriesLoading || servicesLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading services...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Title style={styles.title}>Services</Title>
        <Paragraph style={styles.subtitle}>Manage your service offerings.</Paragraph>
      </View>

      {/* Main Services Card */}
      <Card style={styles.mainCard}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Text style={styles.cardTitle}>Manage Your Services</Text>
              <Text style={styles.cardSubtitle}>
                Select the services you offer to your customers. This will determine what types of jobs you receive.
              </Text>
            </View>
            <Button
              mode="contained"
              onPress={handleSaveServices}
              disabled={updateServicesMutation.isPending || selectedServices.length === 0}
              style={styles.saveButton}
              buttonColor={colors.primary}
            >
              {updateServicesMutation.isPending ? 'Saving...' : 'Save Services'}
            </Button>
          </View>

          {/* Validation message */}
          {hasAttemptedSubmit && selectedServices.length === 0 && (
            <View style={styles.validationMessage}>
              <Text style={styles.validationText}>
                Please select at least one service you specialize in
              </Text>
            </View>
          )}

          {/* Services Grid */}
          <View style={styles.servicesGrid}>
            {categories.map((category: any) => {
              const icon = serviceIcons[category.name as keyof typeof serviceIcons] || '🔧';
              const isSelected = selectedServices.includes(category.id);
              
              return (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.serviceCard,
                    isSelected && styles.serviceCardSelected
                  ]}
                  onPress={() => toggleService(category.id)}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.serviceIcon,
                    isSelected && styles.serviceIconSelected
                  ]}>
                    <Text style={styles.serviceIconText}>{icon}</Text>
                  </View>
                  <Text style={[
                    styles.serviceName,
                    isSelected && styles.serviceNameSelected
                  ]}>
                    {category.name}
                  </Text>
                  {isSelected && (
                    <View style={styles.selectedIndicator}>
                      <Text style={styles.selectedCheck}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Selected services summary */}
          {selectedServices.length > 0 && (
            <View style={styles.selectedSummary}>
              <Text style={styles.selectedTitle}>
                Selected Services ({selectedServices.length}):
              </Text>
              <View style={styles.selectedTags}>
                {categories
                  .filter((cat: any) => selectedServices.includes(cat.id))
                  .map((cat: any) => (
                    <View key={cat.id} style={styles.selectedTag}>
                      <Text style={styles.selectedTagText}>{cat.name}</Text>
                    </View>
                  ))}
              </View>
            </View>
          )}
          
          {/* Save button at bottom */}
          <View style={styles.bottomSaveContainer}>
            <Button
              mode="contained"
              onPress={handleSaveServices}
              disabled={updateServicesMutation.isPending}
              style={styles.bottomSaveButton}
              buttonColor={colors.primary}
            >
              {updateServicesMutation.isPending ? 'Saving...' : 'Save Services'}
            </Button>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
=======
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Title, Paragraph, Card } from 'react-native-paper';
const { colors } = require('../../utils/theme');

const ServicesScreen = () => {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Services Overview</Title>
          <Paragraph>Manage your service offerings and categories</Paragraph>
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Title>Service Categories</Title>
          <Paragraph>Plumbing, Electrical, Cleaning, and more</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Service Areas</Title>
          <Paragraph>Configure your service coverage locations</Paragraph>
        </Card.Content>
      </Card>
    </View>
>>>>>>> 085af7f9981a4f4c28bc1fde96eb87c8bbc41059
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
<<<<<<< HEAD
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  mainCard: {
    elevation: 4,
    marginBottom: 16,
    borderRadius: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  cardTitleContainer: {
    flex: 1,
    marginRight: 16,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  saveButton: {
    borderRadius: 8,
    minWidth: 120,
  },
  validationMessage: {
    backgroundColor: colors.errorContainer,
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  validationText: {
    color: colors.error,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  serviceCard: {
    width: (width - 64) / 3 - 8, // 3 columns with padding
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
    minHeight: 100,
  },
  serviceCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  serviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  serviceIconSelected: {
    backgroundColor: colors.primary,
  },
  serviceIconText: {
    fontSize: 20,
  },
  serviceName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 16,
  },
  serviceNameSelected: {
    color: colors.primary,
  },
  selectedIndicator: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    backgroundColor: colors.primary,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCheck: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  selectedSummary: {
    backgroundColor: colors.successLight,
    borderWidth: 1,
    borderColor: colors.success,
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  selectedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.success,
    marginBottom: 12,
  },
  selectedTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedTag: {
    backgroundColor: colors.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  selectedTagText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  bottomSaveContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  bottomSaveButton: {
    borderRadius: 8,
    minWidth: 200,
    paddingVertical: 8,
  },
});

export default ServicesScreen;
=======
  card: {
    elevation: 2,
    marginBottom: 16,
  },
});

module.exports = ServicesScreen;
>>>>>>> 085af7f9981a4f4c28bc1fde96eb87c8bbc41059







