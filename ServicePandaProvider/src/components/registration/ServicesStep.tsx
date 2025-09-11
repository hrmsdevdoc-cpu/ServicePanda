const React = require('react');
const { useState, useEffect } = require('react');
const {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} = require('react-native');
const { colors } = require('../../utils/theme');
const apiService = require('../../services/api');

// Service icons mapping (you can add more icons as needed)
const serviceIcons = {
  'Domestic Cleaning': '🏠',
  'Bond Cleaning': '🔑',
  'End of Lease Cleaning': '🔑',
  'Carpet Cleaning': '🛋️',
  'Pest Control': '🐛',
  'Gardening': '🌱',
  'Removals': '🚚',
  'Handyman': '🔧',
  'Plumbing': '💧',
  'Electrician': '⚡',
};

const ServicesStep = ({ selectedServices, onSubmit, onBack, isLoading }) => {
  const [categories, setCategories] = useState([]);
  const [localSelectedServices, setLocalSelectedServices] = useState(selectedServices);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setLocalSelectedServices(selectedServices);
  }, [selectedServices]);

  const fetchCategories = async () => {
    try {
      setIsLoadingCategories(true);
      const response = await apiService.request('GET', '/api/service-categories');
      setCategories(response || []);
    } catch (error) {
      console.error('Error fetching service categories:', error);
      Alert.alert('Error', 'Failed to load service categories. Please try again.');
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const toggleService = (categoryId) => {
    setLocalSelectedServices(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const handleSubmit = () => {
    if (localSelectedServices.length === 0) {
      Alert.alert('Error', 'Please select at least one service you specialize in.');
      return;
    }
    onSubmit(localSelectedServices);
  };

  const getServiceIcon = (serviceName) => {
    return serviceIcons[serviceName] || '🔧';
  };

  if (isLoadingCategories) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading services...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Your Services</Text>
        <Text style={styles.subtitle}>
          Choose the services you specialize in (you can select multiple)
        </Text>
      </View>

      {/* Service Categories Grid */}
      <View style={styles.servicesGrid}>
        {categories.map((category) => {
          const isSelected = localSelectedServices.includes(category.id);
          const icon = getServiceIcon(category.name);
          
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

      {/* Selected Services Summary */}
      {localSelectedServices.length > 0 && (
        <View style={styles.selectedSummary}>
          <Text style={styles.selectedTitle}>
            Selected Services ({localSelectedServices.length}):
          </Text>
          <View style={styles.selectedTags}>
            {categories
              .filter(cat => localSelectedServices.includes(cat.id))
              .map(cat => (
                <View key={cat.id} style={styles.selectedTag}>
                  <Text style={styles.selectedTagText}>{cat.name}</Text>
                </View>
              ))}
          </View>
        </View>
      )}

      {/* Navigation Buttons */}
      <View style={styles.navigation}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
        >
          <Text style={styles.backButtonText}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.nextButton,
            localSelectedServices.length === 0 && styles.nextButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={localSelectedServices.length === 0 || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.white} size="small" />
          ) : (
            <Text style={styles.nextButtonText}>Next Step</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  serviceCard: {
    width: '48%',
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  serviceCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  serviceIconSelected: {
    backgroundColor: colors.primary,
  },
  serviceIconText: {
    fontSize: 24,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 18,
  },
  serviceNameSelected: {
    color: colors.primary,
  },
  selectedIndicator: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    backgroundColor: colors.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCheck: {
    color: colors.white,
    fontSize: 14,
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
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 16,
    minWidth: 120,
    alignItems: 'center',
  },
  backButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 16,
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

module.exports = ServicesStep;
