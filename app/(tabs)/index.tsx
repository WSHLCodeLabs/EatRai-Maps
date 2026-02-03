import { FilterChip } from '@/components/filter-chip';
import { GlowButton } from '@/components/glow-button';
import MapComponent from '@/components/MapComponent';
import { RestaurantCard } from '@/components/restaurant-card';
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

// Sample restaurant for the card
const FEATURED_RESTAURANT = {
  name: 'The Green Room',
  cuisine: 'Italian',
  distance: '0.4mi',
  rating: 4.8,
  tag: 'QUIET',
  imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200',
};

export default function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('now-open');
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Map Background */}
      <MapComponent ref={mapRef} />

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

        {/* Bottom Section with FAB and Card */}
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

          {/* Featured Restaurant Card */}
          <RestaurantCard
            name={FEATURED_RESTAURANT.name}
            cuisine={FEATURED_RESTAURANT.cuisine}
            distance={FEATURED_RESTAURANT.distance}
            rating={FEATURED_RESTAURANT.rating}
            tag={FEATURED_RESTAURANT.tag}
            imageUrl={FEATURED_RESTAURANT.imageUrl}
          />
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
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
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
});
