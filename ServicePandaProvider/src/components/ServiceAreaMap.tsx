import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import { colors } from '../utils/theme';

interface ServiceAreaMapProps {
  latitude: number;
  longitude: number;
  radius: number; // in kilometers
  address: string;
}

const ServiceAreaMap: React.FC<ServiceAreaMapProps> = ({
  latitude,
  longitude,
  radius,
  address,
}) => {
  const { width, height } = Dimensions.get('window');
  const mapHeight = Math.min(height * 0.3, 200); // 30% of screen height or max 200px

  return (
    <View style={[styles.container, { height: mapHeight }]}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.01, // Zoom level
          longitudeDelta: 0.01,
        }}
        region={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={false}
        showsMyLocationButton={false}
        scrollEnabled={true}
        zoomEnabled={true}
        rotateEnabled={false}
        pitchEnabled={false}
      >
        {/* Center marker */}
        <Marker
          coordinate={{
            latitude: latitude,
            longitude: longitude,
          }}
          title="Service Center"
          description={address}
          pinColor={colors.primary}
        />
        
        {/* Service radius circle */}
        <Circle
          center={{
            latitude: latitude,
            longitude: longitude,
          }}
          radius={radius * 1000} // Convert km to meters
          strokeColor={colors.primary}
          fillColor={`${colors.primary}20`} // 20% opacity
          strokeWidth={2}
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  map: {
    flex: 1,
  },
});

export default ServiceAreaMap;
