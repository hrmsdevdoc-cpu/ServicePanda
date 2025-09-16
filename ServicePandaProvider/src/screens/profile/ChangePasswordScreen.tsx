const React = require('react');
const { useState, useEffect } = require('react');
const { View, Text, StyleSheet, ScrollView, Alert, Animated, Dimensions, TouchableOpacity } = require('react-native');
const { Card, Title, Paragraph, Button, TextInput: PaperTextInput, HelperText } = require('react-native-paper');
const { colors } = require('../../utils/theme');
const { useMutation, useQueryClient } = require('@tanstack/react-query');
const { changePassword } = require('../../services/api');

const { width } = Dimensions.get('window');

interface ChangePasswordScreenProps {
  onNavigate?: (screen: string) => void;
  onBack?: () => void;
}

const ChangePasswordScreen = ({ onNavigate, onBack }: ChangePasswordScreenProps) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<any>({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.95)).current;

  const queryClient = useQueryClient();

  // Animation on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: (data: any) => changePassword(data.currentPassword, data.newPassword),
    onSuccess: () => {
      queryClient.invalidateQueries();
      Alert.alert('Success', 'Password changed successfully!', [
        {
          text: 'OK',
          onPress: () => onBack?.()
        }
      ]);
    },
    onError: (error: any) => {
      Alert.alert('Error', error?.message || 'Failed to change password');
    }
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: '' }));
    }
  };

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords((prev: any) => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!formData.newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'New password must be at least 8 characters long';
    }
    
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    changePasswordMutation.mutate(formData);
  };

  const handleCancel = () => {
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setErrors({});
    onBack?.();
  };

  return (
    <ScrollView style={styles.container}>
      <Animated.View
        style={[
          styles.animatedContainer,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim }
            ]
          }
        ]}
      >
        {/* Back Button Header */}
        <View style={styles.backHeader}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => onBack?.()}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </View>

        {/* Modern Header */}
        <View style={styles.modernHeader}>
          <View style={styles.modernHeaderContent}>
            <Text style={styles.modernHeaderTitle}>Change Password</Text>
            <Text style={styles.modernHeaderSubtitle}>
              Update your account password for better security
            </Text>
          </View>
          <View style={styles.modernHeaderIcon}>
            <Text style={styles.modernHeaderEmoji}>🔒</Text>
          </View>
        </View>

        {/* Password Form */}
        <View style={styles.modernCard}>
          <View style={styles.modernCardHeader}>
            <View style={styles.modernCardIcon}>
              <Text style={styles.modernCardEmoji}>🔐</Text>
            </View>
            <View style={styles.modernCardInfo}>
              <Text style={styles.modernCardTitle}>Password Information</Text>
              <Text style={styles.modernCardSubtitle}>
                Enter your current password and choose a new secure password
              </Text>
            </View>
          </View>
          
          <View style={styles.modernFormFields}>
            {/* Current Password */}
            <View style={styles.modernInputGroup}>
              <Text style={styles.modernLabel}>Current Password *</Text>
              <View style={styles.modernInputContainer}>
                <Text style={styles.modernInputIcon}>🔑</Text>
                <PaperTextInput
                  mode="outlined"
                  value={formData.currentPassword}
                  onChangeText={(value: string) => handleInputChange('currentPassword', value)}
                  style={styles.modernInput}
                  error={!!errors.currentPassword}
                  secureTextEntry={!showPasswords.current}
                  placeholder="Enter your current password"
                  placeholderTextColor={colors.textSecondary}
                />
                <TouchableOpacity 
                  style={styles.eyeButton}
                  onPress={() => togglePasswordVisibility('current')}
                >
                  <Text style={styles.eyeButtonText}>
                    {showPasswords.current ? '👁️' : '👁️‍🗨️'}
                  </Text>
                </TouchableOpacity>
              </View>
              {errors.currentPassword && <Text style={styles.modernErrorText}>{errors.currentPassword}</Text>}
            </View>

            {/* New Password */}
            <View style={styles.modernInputGroup}>
              <Text style={styles.modernLabel}>New Password *</Text>
              <View style={styles.modernInputContainer}>
                <Text style={styles.modernInputIcon}>🔒</Text>
                <PaperTextInput
                  mode="outlined"
                  value={formData.newPassword}
                  onChangeText={(value: string) => handleInputChange('newPassword', value)}
                  style={styles.modernInput}
                  error={!!errors.newPassword}
                  secureTextEntry={!showPasswords.new}
                  placeholder="Enter your new password"
                  placeholderTextColor={colors.textSecondary}
                />
                <TouchableOpacity 
                  style={styles.eyeButton}
                  onPress={() => togglePasswordVisibility('new')}
                >
                  <Text style={styles.eyeButtonText}>
                    {showPasswords.new ? '👁️' : '👁️‍🗨️'}
                  </Text>
                </TouchableOpacity>
              </View>
              {errors.newPassword && <Text style={styles.modernErrorText}>{errors.newPassword}</Text>}
              <Text style={styles.modernInfoText}>
                Password must be at least 8 characters long
              </Text>
            </View>

            {/* Confirm Password */}
            <View style={styles.modernInputGroup}>
              <Text style={styles.modernLabel}>Confirm New Password *</Text>
              <View style={styles.modernInputContainer}>
                <Text style={styles.modernInputIcon}>🔒</Text>
                <PaperTextInput
                  mode="outlined"
                  value={formData.confirmPassword}
                  onChangeText={(value: string) => handleInputChange('confirmPassword', value)}
                  style={styles.modernInput}
                  error={!!errors.confirmPassword}
                  secureTextEntry={!showPasswords.confirm}
                  placeholder="Confirm your new password"
                  placeholderTextColor={colors.textSecondary}
                />
                <TouchableOpacity 
                  style={styles.eyeButton}
                  onPress={() => togglePasswordVisibility('confirm')}
                >
                  <Text style={styles.eyeButtonText}>
                    {showPasswords.confirm ? '👁️' : '👁️‍🗨️'}
                  </Text>
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && <Text style={styles.modernErrorText}>{errors.confirmPassword}</Text>}
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.modernButtonContainer}>
          <View style={styles.modernButtonRow}>
            <TouchableOpacity 
              style={styles.modernCancelButton}
              onPress={handleCancel}
              activeOpacity={0.8}
            >
              <Text style={styles.modernCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.modernSaveButton,
                changePasswordMutation.isPending && styles.modernSaveButtonDisabled
              ]}
              onPress={handleSubmit}
              activeOpacity={0.8}
              disabled={changePasswordMutation.isPending}
            >
              <Text style={styles.modernSaveButtonText}>
                {changePasswordMutation.isPending ? 'Changing...' : 'Change Password'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 120,
  },
  animatedContainer: {
    flex: 1,
  },
  // Back Header
  backHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: 4,
  },
  // Modern Header
  modernHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  modernHeaderContent: {
    flex: 1,
  },
  modernHeaderTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  modernHeaderSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 22,
    fontWeight: '500',
  },
  modernHeaderIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  modernHeaderEmoji: {
    fontSize: 24,
  },
  // Modern Card
  modernCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    width: '100%',
    maxWidth: '100%',
  },
  modernCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modernCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  modernCardEmoji: {
    fontSize: 24,
  },
  modernCardInfo: {
    flex: 1,
  },
  modernCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  modernCardSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
    lineHeight: 20,
  },
  // Modern Form Fields
  modernFormFields: {
    gap: 16,
  },
  modernInputGroup: {
    gap: 8,
  },
  modernLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: -0.1,
  },
  modernInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingHorizontal: 16,
    paddingVertical: 4,
    minHeight: 50,
    maxWidth: '100%',
  },
  modernInputIcon: {
    fontSize: 20,
    marginRight: 12,
    color: colors.textSecondary,
  },
  modernInput: {
    flex: 1,
    backgroundColor: 'transparent',
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  eyeButton: {
    padding: 8,
    marginLeft: 8,
  },
  eyeButtonText: {
    fontSize: 18,
  },
  modernErrorText: {
    fontSize: 14,
    color: colors.error,
    fontWeight: '500',
    marginTop: 4,
  },
  modernInfoText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    fontStyle: 'italic',
    marginTop: 4,
  },
  // Modern Buttons
  modernButtonContainer: {
    marginTop: 30,
    marginBottom: 30,
    paddingHorizontal: 4,
  },
  modernButtonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    maxWidth: '100%',
  },
  modernCancelButton: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    minWidth: 0,
  },
  modernCancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  modernSaveButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    minWidth: 0,
  },
  modernSaveButtonDisabled: {
    backgroundColor: colors.textSecondary,
    shadowOpacity: 0.05,
  },
  modernSaveButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});

module.exports = ChangePasswordScreen;
