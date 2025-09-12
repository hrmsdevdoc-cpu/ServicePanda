import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput as RNTextInput,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../utils/theme';

interface SimpleAddressInputProps {
  value: string;
  onChange: (address: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  error?: boolean;
  style?: any;
}

const SimpleAddressInput: React.FC<SimpleAddressInputProps> = ({
  value,
  onChange,
  placeholder = "Enter your address...",
  label = "Address",
  required = false,
  error = false,
  style,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, error && styles.labelError]}>
          {label} {required && "*"}
          {error && <Text style={styles.errorText}> Required</Text>}
        </Text>
      )}
      
      <View style={[
        styles.inputContainer,
        isFocused && styles.inputFocused,
        error && styles.inputError,
      ]}>
        <Text style={styles.mapIcon}>📍</Text>
        <RNTextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          style={styles.textInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          multiline
          numberOfLines={2}
          textAlignVertical="top"
        />
      </View>
      
      <Text style={styles.helperText}>
        Enter the full Australian address (e.g., 123 Main Street, Brisbane QLD 4000)
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  labelError: {
    color: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 56,
  },
  inputFocused: {
    borderColor: colors.primary,
  },
  inputError: {
    borderColor: colors.error,
  },
  mapIcon: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 4,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 4,
    minHeight: 40,
  },
  helperText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
});

export default SimpleAddressInput;
