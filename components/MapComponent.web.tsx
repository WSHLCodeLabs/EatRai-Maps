import React, { forwardRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const MapComponent = forwardRef((props, ref) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Maps are currently generic on Web.</Text>
      <Text style={styles.subtext}>Run on Android/iOS Simulator to see OSM Maps.</Text>
    </View>
  );
});

export default MapComponent;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  subtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  }
});
