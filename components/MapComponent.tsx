import { Colors } from '@/constants/theme';
import React, { forwardRef } from 'react';
import { StyleSheet } from 'react-native';
// @ts-ignore
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
import { MapMarker } from './map-marker';

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
    ...restProps
  } = props;

  return (
    <MapView
      ref={ref}
      style={styles.map}
      initialRegion={{
        latitude: 13.7563, // Default to Bangkok
        longitude: 100.5018,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
      rotateEnabled={true}
      showsUserLocation={true}
      showsMyLocationButton={false} // Custom button used
      provider={PROVIDER_DEFAULT}
      {...restProps}
    >
      {/* Restaurant Markers */}
      {restaurants.map((restaurant) => (
        <Marker
          key={restaurant.id}
          coordinate={{
            latitude: restaurant.latitude,
            longitude: restaurant.longitude,
          }}
          title={restaurant.name}
          onPress={() => onMarkerPress?.(restaurant)}
        >
          <MapMarker selected={selectedRestaurantId === restaurant.id} />
        </Marker>
      ))}

      {/* Route Polyline */}
      {showRoute && route.length > 1 && (
        <Polyline
          coordinates={route}
          strokeColor={Colors.neonGreen}
          strokeWidth={4}
          lineDashPattern={[1]}
        />
      )}
    </MapView>
  );
});

export default MapComponent;

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
