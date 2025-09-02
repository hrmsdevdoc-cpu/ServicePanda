const React = require('react');
const { useState, useEffect } = require('react');
const {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} = require('react-native');
const { colors } = require('../../utils/theme');

const BasicInfoStep = ({ formData, onSubmit, isLoading }) => {
  const [localFormData, setLocalFormData] = useState(formData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setLocalFormData(formData);
  }, [formData]);

  const validateForm = () => {
    const newErrors = {};

    if (!localFormData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!localFormData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!localFormData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(localFormData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!localFormData.password) {
      newErrors.password = 'Password is required';
    } else if (localFormData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!localFormData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^(\+61|0)[2-478](?:[ -]?[0-9]){8}$/.test(localFormData.mobileNumber.replace(/\s/g, ''))) {
      newErrors.mobileNumber = 'Please enter a valid Australian mobile number';
    }

    if (!localFormData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(localFormData);
    }
  };

  const updateField = (field, value) => {
    setLocalFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Basic Information</Text>
        <Text style={styles.subtitle}>
          Tell us about yourself and your business
        </Text>
      </View>

      <View style={styles.form}>
        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>First Name *</Text>
              <TextInput
                style={[styles.input, errors.firstName && styles.inputError]}
                placeholder="Enter your first name"
                value={localFormData.firstName}
                onChangeText={(value) => updateField('firstName', value)}
                autoCapitalize="words"
              />
              {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
            </View>

            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>Last Name *</Text>
              <TextInput
                style={[styles.input, errors.lastName && styles.inputError]}
                placeholder="Enter your last name"
                value={localFormData.lastName}
                onChangeText={(value) => updateField('lastName', value)}
                autoCapitalize="words"
              />
              {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address *</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="Enter your email address"
              value={localFormData.email}
              onChangeText={(value) => updateField('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password *</Text>
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              placeholder="Create a password (min 6 characters)"
              value={localFormData.password}
              onChangeText={(value) => updateField('password', value)}
              secureTextEntry
            />
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mobile Number *</Text>
            <TextInput
              style={[styles.input, errors.mobileNumber && styles.inputError]}
              placeholder="Enter your mobile number"
              value={localFormData.mobileNumber}
              onChangeText={(value) => updateField('mobileNumber', value)}
              keyboardType="phone-pad"
            />
            {errors.mobileNumber && <Text style={styles.errorText}>{errors.mobileNumber}</Text>}
          </View>
        </View>

        {/* Business Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Information</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Business Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your business name (optional)"
              value={localFormData.businessName}
              onChangeText={(value) => updateField('businessName', value)}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Business ABN</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your business ABN (optional)"
              value={localFormData.businessAbn}
              onChangeText={(value) => updateField('businessAbn', value)}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Address Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address Information</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address *</Text>
            <TextInput
              style={[styles.input, styles.textArea, errors.address && styles.inputError]}
              placeholder="Enter your full address"
              value={localFormData.address}
              onChangeText={(value) => updateField('address', value)}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.white} size="small" />
          ) : (
            <Text style={styles.submitButtonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          By creating an account, you agree to our Terms of Service and Privacy Policy.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 12, // Reduced from 16
  },
  title: {
    fontSize: 18, // Reduced from 20
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4, // Reduced from 6
  },
  subtitle: {
    fontSize: 12, // Reduced from 14
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16, // Reduced from 18
  },
  form: {
    flex: 1,
  },
  section: {
    marginBottom: 12, // Reduced from 16
  },
  sectionTitle: {
    fontSize: 14, // Reduced from 16
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8, // Reduced from 12
    paddingBottom: 4, // Reduced from 6
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    marginBottom: 8, // Reduced from 12
  },
  halfWidth: {
    width: '48%',
  },
  label: {
    fontSize: 12, // Reduced from 14
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4, // Reduced from 6
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4, // Reduced from 6
    padding: 8, // Reduced from 12
    fontSize: 13, // Reduced from 14
    color: colors.text,
    height: 36, // Reduced from 40
  },
  textArea: {
    height: 50, // Reduced from 60
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 11, // Reduced from 12
    marginTop: 2, // Reduced from 3
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 4, // Reduced from 6
    padding: 10, // Reduced from 12
    alignItems: 'center',
    marginTop: 12, // Reduced from 16
    marginBottom: 8, // Reduced from 12
    height: 36, // Reduced from 40
  },
  submitButtonDisabled: {
    backgroundColor: colors.border,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 13, // Reduced from 14
    fontWeight: '600',
  },
  disclaimer: {
    fontSize: 10, // Reduced from 12
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 14, // Reduced from 16
  },
});

module.exports = BasicInfoStep;
