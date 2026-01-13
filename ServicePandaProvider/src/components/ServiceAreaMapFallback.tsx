import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '../utils/theme';

interface ServiceAreaMapFallbackProps {
  latitude: number;
  longitude: number;
  radius: number; // in kilometers
  address: string;
}

const ServiceAreaMapFallback: React.FC<ServiceAreaMapFallbackProps> = ({
  latitude,
  longitude,
  radius,
  address,
}) => {
  const { width } = Dimensions.get('window');
  const mapSize = Math.min(width - 32, 300); // Max 300px wide
  const centerX = mapSize / 2;
  const centerY = mapSize / 2;
  const circleRadius = Math.min(mapSize * 0.3, 60); // Proportional circle size

  return (
    <View style={[styles.container, { width: mapSize, height: mapSize }]}>
      {/* Map background */}
      <View style={styles.mapBackground}>
        {/* Grid pattern */}
        <View style={styles.grid}>
          {Array.from({ length: 5 }).map((_, i) => (
            <View key={`h-${i}`} style={[styles.gridLine, styles.horizontalLine, { top: (i + 1) * (mapSize / 6) }]} />
          ))}
          {Array.from({ length: 5 }).map((_, i) => (
            <View key={`v-${i}`} style={[styles.gridLine, styles.verticalLine, { left: (i + 1) * (mapSize / 6) }]} />
          ))}
        </View>
        
        {/* Service radius circle */}
        <View 
          style={[
            styles.serviceCircle, 
            { 
              left: centerX - circleRadius, 
              top: centerY - circleRadius, 
              width: circleRadius * 2, 
              height: circleRadius * 2 
            }
          ]} 
        />
        
        {/* Center marker */}
        <View 
          style={[
            styles.centerMarker, 
            { 
              left: centerX - 8, 
              top: centerY - 8 
            }
          ]} 
        />
        
        {/* Coordinates display */}
        <View style={styles.coordinatesContainer}>
          <Text style={styles.coordinatesText}>
            {latitude.toFixed(4)}, {longitude.toFixed(4)}
          </Text>
        </View>
        
        {/* Radius indicator */}
        <View style={styles.radiusIndicator}>
          <Text style={styles.radiusText}>{radius}km</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#f8f9fa',
  },
  mapBackground: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#e8f4f8',
  },
  grid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: '#d1d5db',
    opacity: 0.3,
  },
  horizontalLine: {
    height: 1,
    left: 0,
    right: 0,
  },
  verticalLine: {
    width: 1,
    top: 0,
    bottom: 0,
  },
  serviceCircle: {
    position: 'absolute',
    borderRadius: 1000,
    borderWidth: 3,
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}20`, // 20% opacity
  },
  centerMarker: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  coordinatesContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  coordinatesText: {
    fontSize: 10,
    color: colors.textSecondary,
    fontFamily: 'monospace',
  },
  radiusIndicator: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  radiusText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ServiceAreaMapFallback;
