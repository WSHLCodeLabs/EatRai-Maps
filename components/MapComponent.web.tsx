import { Colors } from '@/constants/theme';
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Restaurant {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

interface RouteCoordinate {
  latitude: number;
  longitude: number;
}

interface MapComponentProps {
  restaurants?: Restaurant[];
  selectedRestaurantId?: string | null;
  onMarkerPress?: (restaurant: Restaurant) => void;
  route?: RouteCoordinate[];
  showRoute?: boolean;
}

const MapComponent = forwardRef<any, MapComponentProps>((props, ref) => {
  const {
    restaurants = [],
    selectedRestaurantId,
    onMarkerPress,
    route = [],
    showRoute = false,
  } = props;

  const [center, setCenter] = useState({ lat: 13.7563, lng: 100.5018 });
  const [zoom, setZoom] = useState(14);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useImperativeHandle(ref, () => ({
    animateToRegion: (region: any, duration: number) => {
      setCenter({ lat: region.latitude, lng: region.longitude });
      // Adjust zoom based on delta
      const avgDelta = (region.latitudeDelta + region.longitudeDelta) / 2;
      const newZoom = Math.round(Math.log2(360 / avgDelta));
      setZoom(Math.min(Math.max(newZoom, 10), 18));
    },
  }));

  const handleMarkerClick = (restaurant: Restaurant) => {
    onMarkerPress?.(restaurant);
  };

  const openGoogleMapsDirections = (lat: number, lng: number, name: string) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
    window.open(url, '_blank');
  };

  // Create markers string for static map
  const markersParam = restaurants
    .map((r) => `markers=color:${selectedRestaurantId === r.id ? 'green' : 'red'}%7C${r.latitude},${r.longitude}`)
    .join('&');

  // Show route line if selected
  const pathParam = showRoute && route.length > 1
    ? `&path=color:0x7CEB00%7Cweight:4%7C${route.map(r => `${r.latitude},${r.longitude}`).join('|')}`
    : '';

  return (
    <View style={styles.container}>
      {/* Map Background with gradient overlay */}
      <View style={styles.mapBackground}>
        <View style={styles.gridPattern}>
          {Array.from({ length: 20 }).map((_, i) => (
            <View key={`h-${i}`} style={[styles.gridLine, styles.gridHorizontal, { top: `${i * 5}%` }]} />
          ))}
          {Array.from({ length: 20 }).map((_, i) => (
            <View key={`v-${i}`} style={[styles.gridLine, styles.gridVertical, { left: `${i * 5}%` }]} />
          ))}
        </View>
      </View>

      {/* Restaurant Markers */}
      <View style={styles.markersContainer}>
        {restaurants.map((restaurant, index) => {
          const isSelected = selectedRestaurantId === restaurant.id;
          // Position markers in a circular pattern around center
          const angle = (index / restaurants.length) * 2 * Math.PI;
          const radius = 25; // percentage from center
          const left = 50 + radius * Math.cos(angle);
          const top = 40 + radius * Math.sin(angle) * 0.6;

          return (
            <TouchableOpacity
              key={restaurant.id}
              style={[
                styles.marker,
                isSelected && styles.markerSelected,
                { left: `${left}%`, top: `${top}%` },
              ]}
              onPress={() => handleMarkerClick(restaurant)}
            >
              <Text style={[styles.markerIcon, isSelected && styles.markerIconSelected]}>
                🍽️
              </Text>
              <View style={[styles.markerLabel, isSelected && styles.markerLabelSelected]}>
                <Text style={[styles.markerText, isSelected && styles.markerTextSelected]} numberOfLines={1}>
                  {restaurant.name}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Route visualization */}
      {showRoute && route.length > 1 && (
        <View style={styles.routeLine} pointerEvents="none">
          <View style={styles.routeDot} />
          <View style={styles.routePath} />
          <View style={[styles.routeDot, styles.routeDotEnd]} />
        </View>
      )}

      {/* Web navigation hint */}
      {selectedRestaurantId && (
        <TouchableOpacity
          style={styles.webNavHint}
          onPress={() => {
            const selected = restaurants.find(r => r.id === selectedRestaurantId);
            if (selected) {
              openGoogleMapsDirections(selected.latitude, selected.longitude, selected.name);
            }
          }}
        >
          <Text style={styles.webNavText}>🗺️ Open in Google Maps</Text>
        </TouchableOpacity>
      )}

      {/* Center indicator */}
      <View style={styles.centerIndicator}>
        <View style={styles.centerDot} />
        <Text style={styles.centerLabel}>You are here</Text>
      </View>
    </View>
  );
});

export default MapComponent;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.deepBlack,
    overflow: 'hidden',
  },
  mapBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0a1a0a',
  },
  gridPattern: {
    ...StyleSheet.absoluteFillObject,
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: 'rgba(124, 235, 0, 0.08)',
  },
  gridHorizontal: {
    left: 0,
    right: 0,
    height: 1,
  },
  gridVertical: {
    top: 0,
    bottom: 0,
    width: 1,
  },
  markersContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  marker: {
    position: 'absolute',
    alignItems: 'center',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    zIndex: 1,
  },
  markerSelected: {
    zIndex: 10,
  },
  markerIcon: {
    fontSize: 24,
    opacity: 0.7,
  },
  markerIconSelected: {
    fontSize: 32,
    opacity: 1,
  },
  markerLabel: {
    backgroundColor: 'rgba(26, 26, 26, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 4,
    borderWidth: 1,
    borderColor: Colors.mediumGray,
    maxWidth: 120,
  },
  markerLabelSelected: {
    backgroundColor: Colors.neonGreen,
    borderColor: Colors.neonGreen,
  },
  markerText: {
    color: Colors.textPrimary,
    fontSize: 11,
    fontWeight: '500',
  },
  markerTextSelected: {
    color: Colors.deepBlack,
    fontWeight: '700',
  },
  routeLine: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 100,
    height: 2,
    flexDirection: 'row',
    alignItems: 'center',
    transform: [{ translateX: -50 }, { rotate: '-30deg' }],
  },
  routePath: {
    flex: 1,
    height: 3,
    backgroundColor: Colors.neonGreen,
    opacity: 0.8,
  },
  routeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.neonGreen,
    borderWidth: 2,
    borderColor: Colors.deepBlack,
  },
  routeDotEnd: {
    backgroundColor: '#FF6B6B',
  },
  webNavHint: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: Colors.neonGreen,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  webNavText: {
    color: Colors.deepBlack,
    fontWeight: '600',
    fontSize: 14,
  },
  centerIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    alignItems: 'center',
    transform: [{ translateX: -40 }, { translateY: -20 }],
  },
  centerDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4A90D9',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#4A90D9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  centerLabel: {
    marginTop: 4,
    fontSize: 10,
    color: Colors.textSecondary,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
});
