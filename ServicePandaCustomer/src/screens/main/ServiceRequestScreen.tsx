import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/MaterialIcons';
import serviceRequestService from '../../services/serviceRequestService';

const ServiceRequestScreen: React.FC<{ navigation: any, route: any }> = ({ 
  navigation, 
  route 
}) => {
  const { selectedCategory } = route.params || {};
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    categoryId: selectedCategory || '',
    title: '',
    description: '',
    location: '',
    suburb: '',
    postcode: '',
    state: 'NSW',
    preferredDate: '',
    preferredTime: '',
    budget: '',
    urgency: 'medium' as 'low' | 'medium' | 'high',
  });

  // Fetch service categories
  const { data: categories = [] } = useQuery({
    queryKey: ['service-categories'],
    queryFn: serviceRequestService.getServiceCategories,
  });

  // Create service request mutation
  const createRequestMutation = useMutation({
    mutationFn: serviceRequestService.createServiceRequest,
    onSuccess: (data) => {
      Alert.alert(
        'Request Submitted!',
        'Your service request has been submitted. Service providers will start sending you quotes soon.',
        [
          {
            text: 'View Request',
            onPress: () => navigation.navigate('RequestDetails', { requestId: data.id }),
          },
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home'),
          },
        ]
      );
      queryClient.invalidateQueries({ queryKey: ['recent-service-requests'] });
    },
    onError: (error: any) => {
      Alert.alert('Error', error.message);
    },
  });

  const states = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'];

  const urgencyLevels = [
    { value: 'low', label: 'Low - Within a week', color: '#28a745' },
    { value: 'medium', label: 'Medium - Within 3 days', color: '#ffa500' },
    { value: 'high', label: 'High - ASAP', color: '#dc3545' },
  ];

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const required = ['categoryId', 'title', 'description', 'location', 'suburb', 'postcode', 'state'];
    for (const field of required) {
      if (!formData[field as keyof typeof formData]?.trim()) {
        Alert.alert('Error', `Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const requestData = {
      ...formData,
      budget: formData.budget ? parseFloat(formData.budget) : undefined,
    };

    createRequestMutation.mutate(requestData);
  };

  const selectedCategoryName = categories.find(cat => cat.id === formData.categoryId)?.name || '';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Request Service</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          {/* Service Category */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Service Category *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.categoryList}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryChip,
                      formData.categoryId === category.id && styles.categoryChipSelected,
                    ]}
                    onPress={() => updateField('categoryId', category.id)}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        formData.categoryId === category.id && styles.categoryChipTextSelected,
                      ]}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Request Title */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Service Title *</Text>
            <TextInput
              style={styles.input}
              value={formData.title}
              onChangeText={(value) => updateField('title', value)}
              placeholder={`e.g., ${selectedCategoryName} needed`}
              placeholderTextColor="#999"
              maxLength={100}
            />
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(value) => updateField('description', value)}
              placeholder="Describe what you need done, any specific requirements, etc."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              maxLength={500}
            />
            <Text style={styles.charCount}>{formData.description.length}/500</Text>
          </View>

          {/* Location */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location *</Text>
            <TextInput
              style={styles.input}
              value={formData.location}
              onChangeText={(value) => updateField('location', value)}
              placeholder="Full address or general area"
              placeholderTextColor="#999"
              maxLength={200}
            />
          </View>

          {/* Suburb, Postcode, State */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Area Details *</Text>
            <View style={styles.row}>
              <View style={styles.flex2}>
                <TextInput
                  style={styles.input}
                  value={formData.suburb}
                  onChangeText={(value) => updateField('suburb', value)}
                  placeholder="Suburb"
                  placeholderTextColor="#999"
                />
              </View>
              <View style={styles.flex1}>
                <TextInput
                  style={styles.input}
                  value={formData.postcode}
                  onChangeText={(value) => updateField('postcode', value)}
                  placeholder="Postcode"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  maxLength={4}
                />
              </View>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.stateList}>
                {states.map((state) => (
                  <TouchableOpacity
                    key={state}
                    style={[
                      styles.stateChip,
                      formData.state === state && styles.stateChipSelected,
                    ]}
                    onPress={() => updateField('state', state)}
                  >
                    <Text
                      style={[
                        styles.stateChipText,
                        formData.state === state && styles.stateChipTextSelected,
                      ]}
                    >
                      {state}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Urgency */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Urgency</Text>
            {urgencyLevels.map((level) => (
              <TouchableOpacity
                key={level.value}
                style={[
                  styles.urgencyOption,
                  formData.urgency === level.value && styles.urgencyOptionSelected,
                ]}
                onPress={() => updateField('urgency', level.value)}
              >
                <View style={styles.urgencyContent}>
                  <View style={[styles.urgencyIndicator, { backgroundColor: level.color }]} />
                  <Text style={styles.urgencyLabel}>{level.label}</Text>
                </View>
                <Icon
                  name={formData.urgency === level.value ? 'radio-button-checked' : 'radio-button-unchecked'}
                  size={24}
                  color={formData.urgency === level.value ? '#007AFF' : '#ccc'}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Budget (Optional) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Budget (Optional)</Text>
            <TextInput
              style={styles.input}
              value={formData.budget}
              onChangeText={(value) => updateField('budget', value)}
              placeholder="Expected budget (AUD)"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
            <Text style={styles.helperText}>
              This helps providers give more accurate quotes
            </Text>
          </View>

          {/* Preferred Date/Time (Optional) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferred Schedule (Optional)</Text>
            <View style={styles.row}>
              <View style={styles.flex1}>
                <TextInput
                  style={styles.input}
                  value={formData.preferredDate}
                  onChangeText={(value) => updateField('preferredDate', value)}
                  placeholder="Preferred date"
                  placeholderTextColor="#999"
                />
              </View>
              <View style={styles.flex1}>
                <TextInput
                  style={styles.input}
                  value={formData.preferredTime}
                  onChangeText={(value) => updateField('preferredTime', value)}
                  placeholder="Preferred time"
                  placeholderTextColor="#999"
                />
              </View>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, createRequestMutation.isPending && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={createRequestMutation.isPending}
          >
            {createRequestMutation.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Submit Request</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            By submitting this request, you agree to receive quotes from verified service providers in your area.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    paddingTop: 14,
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
  categoryList: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  categoryChipSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  categoryChipTextSelected: {
    color: '#fff',
  },
  stateList: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  stateChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  stateChipSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  stateChipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  stateChipTextSelected: {
    color: '#fff',
  },
  urgencyOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
  },
  urgencyOptionSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#e8f4ff',
  },
  urgencyContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  urgencyIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  urgencyLabel: {
    fontSize: 16,
    color: '#333',
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  disclaimer: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default ServiceRequestScreen;