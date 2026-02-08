import { FilterChip } from '@/components/filter-chip';
import { GlowButton } from '@/components/glow-button';
import MapComponent from '@/components/MapComponent';
import { RoutePreview } from '@/components/route-preview';
import { CardShadow, Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// Restaurant data with coordinates
const RESTAURANTS = [
  {
    id: '1',
    name: 'The Green Room',
    cuisine: 'Italian',
    distance: '0.4mi',
    rating: 4.8,
    tag: 'QUIET',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200',
    latitude: 13.7463,
    longitude: 100.5340,
  },
  {
    id: '2',
    name: 'Sakura Ramen House',
    cuisine: 'Japanese',
    distance: '0.7mi',
    rating: 4.6,
    tag: 'POPULAR',
    latitude: 13.7400,
    longitude: 100.5350,
  },
  {
    id: '3',
    name: 'Café Luna',
    cuisine: 'French Café',
    distance: '0.3mi',
    rating: 4.9,
    tag: 'QUIET',
    latitude: 13.7580,
    longitude: 100.5018,
  },
];

interface SelectedRestaurant {
  id: string;
  name: string;
  cuisine: string;
  distance: string;
  latitude: number;
  longitude: number;
}

export default function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('now-open');
  const [selectedRestaurant, setSelectedRestaurant] = useState<SelectedRestaurant | null>(null);
  const mapRef = React.useRef<any>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const centerMapOnUser = async () => {
    let loc = location;
    if (!loc) {
      loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    }

    if (loc && loc.coords && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        1000
      );
    }
  };

  const handleMarkerPress = (restaurant: any) => {
    setSelectedRestaurant({
      id: restaurant.id,
      name: restaurant.name,
      cuisine: restaurant.cuisine || '',
      distance: restaurant.distance || '',
      latitude: restaurant.latitude,
      longitude: restaurant.longitude,
    });

    // Animate map to show route
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: restaurant.latitude,
          longitude: restaurant.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        500
      );
    }
  };

  const clearSelection = () => {
    setSelectedRestaurant(null);
  };

  // Generate simple route (straight line from user to destination)
  const getRouteCoordinates = () => {
    if (!location || !selectedRestaurant) return [];
    return [
      { latitude: location.coords.latitude, longitude: location.coords.longitude },
      { latitude: selectedRestaurant.latitude, longitude: selectedRestaurant.longitude },
    ];
  };

  const restaurantList = RESTAURANTS.map((r) => ({
    id: r.id,
    name: r.name,
    latitude: r.latitude,
    longitude: r.longitude,
  }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Map Background with Markers */}
      <MapComponent
        ref={mapRef}
        restaurants={restaurantList}
        selectedRestaurantId={selectedRestaurant?.id}
        onMarkerPress={handleMarkerPress}
        route={getRouteCoordinates()}
        showRoute={!!selectedRestaurant}
      />

      {/* Dark Overlay for atmosphere */}
      <View style={styles.mapOverlay} pointerEvents="none" />

      <SafeAreaView style={styles.overlayContainer} pointerEvents="box-none">
        {/* Top Search Section */}
        <View style={styles.topSection}>
          {/* Search Bar */}
          <View style={[styles.searchBarContainer, CardShadow]}>
            <TextInput
              placeholder="Find quiet spots, ramen, cafes..."
              style={styles.searchInput}
              placeholderTextColor={Colors.textSecondary}
            />
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="options-outline" size={20} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Filter Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipContainer}
          >
            <FilterChip
              icon="flash"
              text="Now Open"
              active={activeFilter === 'now-open'}
              onPress={() => setActiveFilter('now-open')}
            />
            <FilterChip
              icon="moon"
              text="Quiet Areas"
              active={activeFilter === 'quiet'}
              onPress={() => setActiveFilter('quiet')}
            />
            <FilterChip
              icon="star"
              text="Top"
              active={activeFilter === 'top'}
              onPress={() => setActiveFilter('top')}
            />
          </ScrollView>
        </View>

        {/* Bottom Section with FAB and Card/Preview */}
        <View style={styles.bottomSection}>
          {/* Location FAB */}
          <View style={styles.fabContainer}>
            <GlowButton
              icon="locate"
              size={52}
              glowIntensity="high"
              onPress={centerMapOnUser}
            />
          </View>

          {/* Route Preview or Hint */}
          {selectedRestaurant ? (
            <RoutePreview
              restaurantName={selectedRestaurant.name}
              cuisine={selectedRestaurant.cuisine}
              distance={selectedRestaurant.distance}
              duration="5 min"
              latitude={selectedRestaurant.latitude}
              longitude={selectedRestaurant.longitude}
              onClose={clearSelection}
            />
          ) : (
            <View style={[styles.hintCard, CardShadow]}>
              <Ionicons name="restaurant" size={20} color={Colors.neonGreen} />
              <View style={styles.hintText}>
                <TextInput
                  style={styles.hintTitle}
                  editable={false}
                  value="Tap a marker to navigate"
                />
              </View>
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.deepBlack,
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  overlayContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topSection: {
    paddingTop: Platform.OS === 'android' ? 50 : 10,
    width: '100%',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 26, 26, 0.9)',
    marginHorizontal: 16,
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: Colors.mediumGray,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  filterButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.mediumGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  chipContainer: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  bottomSection: {
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
  },
  fabContainer: {
    alignItems: 'flex-end',
    paddingRight: 16,
    marginBottom: 16,
  },
  hintCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.darkGray,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  hintText: {
    flex: 1,
  },
  hintTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
});
