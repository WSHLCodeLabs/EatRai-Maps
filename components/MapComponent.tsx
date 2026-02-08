import { Colors } from '@/constants/theme';
import { CrowdLevel } from '@/data/restaurants-data';
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
  crowdLevel?: CrowdLevel;
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
  children?: React.ReactNode;
}

const MapComponent = forwardRef<any, MapComponentProps>((props, ref) => {
  const {
    restaurants = [],
    selectedRestaurantId,
    onMarkerPress,
    route = [],
    showRoute = false,
    children,
    ...restProps
  } = props;

  return (
    <MapView
      ref={ref}
      style={styles.map}
      initialRegion={{
        latitude: 14.0205,
        longitude: 99.9870,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }}
      rotateEnabled={true}
      showsUserLocation={true}
      showsMyLocationButton={false}
      provider={PROVIDER_DEFAULT}
      {...restProps}
    >
      {/* Restaurant Markers with crowd level colors */}
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
          <MapMarker
            selected={selectedRestaurantId === restaurant.id}
            crowdLevel={restaurant.crowdLevel}
          />
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

      {/* Allow children for custom markers */}
      {children}
    </MapView>
  );
});

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapComponent;
