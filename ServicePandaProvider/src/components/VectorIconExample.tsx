import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// Import vector icons like customer app
const Icon = require('react-native-vector-icons/MaterialIcons').default;
const { colors } = require('../utils/theme');

/**
 * Vector Icon Example Component
 * 
 * Ye component dikhata hai ki customer app ki tarah vector icons kaise use karte hain
 * ServicePandaProvider app mein.
 */
const VectorIconExample = () => {
  const iconExamples = [
    { name: 'home', label: 'Home', color: colors.primary },
    { name: 'person', label: 'Profile', color: colors.success },
    { name: 'notifications', label: 'Notifications', color: colors.warning },
    { name: 'settings', label: 'Settings', color: colors.textSecondary },
    { name: 'search', label: 'Search', color: colors.info },
    { name: 'favorite', label: 'Favorite', color: colors.error },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vector Icons Examples</Text>
      <Text style={styles.subtitle}>Customer app ki tarah vector icons use karne ka example</Text>
      
      <View style={styles.iconGrid}>
        {iconExamples.map((icon, index) => (
          <TouchableOpacity key={index} style={styles.iconButton}>
            <View style={[styles.iconContainer, { backgroundColor: icon.color + '20' }]}>
              <Icon 
                name={icon.name} 
                size={24} 
                color={icon.color}
              />
            </View>
            <Text style={styles.iconLabel}>{icon.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.codeExample}>
        <Text style={styles.codeTitle}>Usage Example:</Text>
        <Text style={styles.codeText}>
          {`// Import
const Icon = require('react-native-vector-icons/MaterialIcons').default;

// Usage
<Icon name="home" size={24} color="#3B82F6" />
<Icon name="person" size={20} color="#10B981" />
<Icon name="notifications" size={18} color="#F59E0B" />`}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  iconButton: {
    alignItems: 'center',
    marginBottom: 16,
    width: '30%',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconLabel: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
    textAlign: 'center',
  },
  codeExample: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  codeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  codeText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'monospace',
    lineHeight: 20,
  },
});

export default VectorIconExample;
