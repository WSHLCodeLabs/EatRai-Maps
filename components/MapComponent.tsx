import React, { forwardRef } from 'react';
import { StyleSheet } from 'react-native';
// @ts-ignore
import MapView, { PROVIDER_DEFAULT, UrlTile } from 'react-native-maps';

const MapComponent = forwardRef((props: any, ref: any) => {
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
      {...props}
    >
      <UrlTile
        urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maximumZ={19}
        zIndex={1}
      />
    </MapView>
  );
});

export default MapComponent;

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
