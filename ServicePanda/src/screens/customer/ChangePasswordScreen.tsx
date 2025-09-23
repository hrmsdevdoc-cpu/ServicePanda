const React = require('react');
const { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, StatusBar } = require('react-native');
const { TextInput: PaperTextInput } = require('react-native-paper');
const { colors } = require('../../utils/theme');
const { apiService } = require('../../services/api');

const ChangePasswordScreen = ({ onBack }) => {
  const [formData, setFormData] = React.useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = React.useState({
    current: false,
    new: false,
    confirm: false
  });
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters long';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await apiService.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      Alert.alert(
        'Success',
        'Your password has been changed successfully.',
        [
          {
            text: 'OK',
            onPress: () => {
              setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
              });
              onBack();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Password change error:', error);
      let errorMessage = 'Failed to change password. Please try again.';
      
      if (error.message) {
        if (error.message.includes('current password')) {
          errorMessage = 'Current password is incorrect.';
        } else if (error.message.includes('same')) {
          errorMessage = 'New password must be different from current password.';
        } else {
          errorMessage = error.message;
        }
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Password</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>

          {/* Current Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Current Password</Text>
            <PaperTextInput
              mode="outlined"
              value={formData.currentPassword}
              onChangeText={(value) => handleInputChange('currentPassword', value)}
              secureTextEntry={!showPasswords.current}
              placeholder="Enter your current password"
              style={styles.paperInput}
              right={
                <PaperTextInput.Icon 
                  icon={showPasswords.current ? "eye-off" : "eye"} 
                  iconColor={colors.textTertiary}
                  onPress={() => togglePasswordVisibility('current')}
                />
              }
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              placeholderTextColor={colors.textTertiary}
            />
            {errors.currentPassword && (
              <Text style={styles.errorText}>{errors.currentPassword}</Text>
            )}
          </View>

          {/* New Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>New Password</Text>
            <PaperTextInput
              mode="outlined"
              value={formData.newPassword}
              onChangeText={(value) => handleInputChange('newPassword', value)}
              secureTextEntry={!showPasswords.new}
              placeholder="Enter your new password"
              style={styles.paperInput}
              right={
                <PaperTextInput.Icon 
                  icon={showPasswords.new ? "eye-off" : "eye"} 
                  iconColor={colors.textTertiary}
                  onPress={() => togglePasswordVisibility('new')}
                />
              }
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              placeholderTextColor={colors.textTertiary}
            />
            {errors.newPassword && (
              <Text style={styles.errorText}>{errors.newPassword}</Text>
            )}
          </View>

          {/* Confirm New Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Confirm New Password</Text>
            <PaperTextInput
              mode="outlined"
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange('confirmPassword', value)}
              secureTextEntry={!showPasswords.confirm}
              placeholder="Confirm your new password"
              style={styles.paperInput}
              right={
                <PaperTextInput.Icon 
                  icon={showPasswords.confirm ? "eye-off" : "eye"} 
                  iconColor={colors.textTertiary}
                  onPress={() => togglePasswordVisibility('confirm')}
                />
              }
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              placeholderTextColor={colors.textTertiary}
            />
            {errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}
          </View>

          {/* Password Requirements */}
          <View style={styles.requirementsContainer}>
            <Text style={styles.requirementsTitle}>Password Requirements:</Text>
            <Text style={styles.requirementText}>• At least 6 characters long</Text>
            <Text style={styles.requirementText}>• Different from your current password</Text>
          </View>

          {/* Change Password Button */}
          <TouchableOpacity
            style={[styles.changePasswordButton, loading && styles.buttonDisabled]}
            onPress={handleChangePassword}
            disabled={loading}
          >
            <Text style={styles.changePasswordButtonText}>
              {loading ? 'Changing Password...' : 'Change Password'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  form: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 30,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  paperInput: {
    backgroundColor: colors.background,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    marginTop: 4,
  },
  requirementsContainer: {
    backgroundColor: colors.primary + '10',
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  changePasswordButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: colors.textSecondary,
  },
  changePasswordButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

module.exports = ChangePasswordScreen;
