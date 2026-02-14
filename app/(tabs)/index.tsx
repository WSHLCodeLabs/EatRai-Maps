import { CrowdReportModal } from '@/components/CrowdReportModal';
import { FilterChip } from '@/components/filter-chip';
import { GlowButton } from '@/components/glow-button';
import MapComponent from '@/components/MapComponent';
import { PromotedCard } from '@/components/promoted-card';
import { RandomPickerModal } from '@/components/RandomPickerModal';
import { RoutePreview } from '@/components/route-preview';
import { CardShadow } from '@/constants/theme';
import { useRestaurants } from '@/context/RestaurantContext';
import { useTheme } from '@/context/ThemeContext';
import { Restaurant } from '@/data/restaurants-data';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { restaurants, calculateDistanceToRestaurant } = useRestaurants();
  const { isDarkMode, colors } = useTheme();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('now-open');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [randomPickerVisible, setRandomPickerVisible] = useState(false);
  const mapRef = React.useRef<any>(null);

  // Restaurants with available seats (Quiet or Moderate)
  const availableRestaurants = useMemo(
    () => restaurants.filter(r => r.crowdLevel === 'Quiet' || r.crowdLevel === 'Moderate'),
    [restaurants]
  );

  const handleRandomPick = () => {
    if (availableRestaurants.length === 0) {
      Alert.alert('ไม่มีร้านที่ว่าง', 'ร้านอาหารทุกร้านอยู่ในสถานะแน่น ลองใหม่ภายหลังนะ');
      return;
    }
    setRandomPickerVisible(true);
  };

  // Promoted restaurant (first promoted, or fallback to first)
  const promotedRestaurant = restaurants.find(r => r.isPromoted) || restaurants[0];

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

  // Tap marker → show navigation route preview
  const handleMarkerPress = (restaurant: any) => {
    const fullRestaurant = restaurants.find(r => r.id === restaurant.id);
    if (fullRestaurant) {
      setSelectedRestaurant(fullRestaurant);

      // Animate map to restaurant
      if (mapRef.current) {
        mapRef.current.animateToRegion(
          {
            latitude: fullRestaurant.latitude,
            longitude: fullRestaurant.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          500
        );
      }
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const clearSelection = () => {
    setSelectedRestaurant(null);
  };

  // Generate route from user to selected restaurant
  const getRouteCoordinates = () => {
    if (!location || !selectedRestaurant) return [];
    return [
      { latitude: location.coords.latitude, longitude: location.coords.longitude },
      { latitude: selectedRestaurant.latitude, longitude: selectedRestaurant.longitude },
    ];
  };

  // Prepare restaurant data for map
  const restaurantList = restaurants.map((r) => ({
    id: r.id,
    name: r.name,
    latitude: r.latitude,
    longitude: r.longitude,
    crowdLevel: r.crowdLevel,
  }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />

      {/* Map Background with Markers (no route line) */}
      <MapComponent
        ref={mapRef}
        restaurants={restaurantList}
        selectedRestaurantId={selectedRestaurant?.id}
        onMarkerPress={handleMarkerPress}
      />

      {/* Dark Overlay for atmosphere */}
      <View style={styles.mapOverlay} pointerEvents="none" />

      <SafeAreaView style={styles.overlayContainer} pointerEvents="box-none">
        {/* Top Search Section */}
        <View style={styles.topSection}>
          {/* Search Bar */}
          <View style={[styles.searchBarContainer, CardShadow, { backgroundColor: isDarkMode ? 'rgba(26, 26, 26, 0.9)' : 'rgba(255, 255, 255, 0.95)', borderColor: colors.border }]}>
            <TextInput
              placeholder="Find quiet spots, ramen, cafes..."
              style={[styles.searchInput, { color: colors.textPrimary }]}
              placeholderTextColor={colors.textSecondary}
            />
            <TouchableOpacity style={[styles.filterButton, { backgroundColor: colors.border }]}>
              <Ionicons name="options-outline" size={20} color={colors.textPrimary} />
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
              icon="leaf"
              text="Quiet"
              active={activeFilter === 'quiet'}
              onPress={() => setActiveFilter('quiet')}
            />
            <FilterChip
              icon="flame"
              text="Busy"
              active={activeFilter === 'busy'}
              onPress={() => setActiveFilter('busy')}
            />
          </ScrollView>
        </View>

        {/* Bottom Section with FAB and Navigation/Card */}
        <View style={styles.bottomSection}>
          {/* FAB Buttons */}
          <View style={styles.fabContainer}>
            <GlowButton
              icon="dice"
              size={52}
              glowIntensity="high"
              onPress={handleRandomPick}
            />
            <GlowButton
              icon="locate"
              size={52}
              glowIntensity="high"
              onPress={centerMapOnUser}
            />
          </View>

          {/* Route Preview when marker selected, otherwise Promoted Card */}
          {selectedRestaurant ? (
            <RoutePreview
              restaurantName={selectedRestaurant.name}
              cuisine={selectedRestaurant.cuisine}
              distance={calculateDistanceToRestaurant(selectedRestaurant.latitude, selectedRestaurant.longitude)}
              duration="5 min"
              latitude={selectedRestaurant.latitude}
              longitude={selectedRestaurant.longitude}
              onClose={clearSelection}
            />
          ) : promotedRestaurant ? (
            <PromotedCard
              restaurant={promotedRestaurant}
              distance={calculateDistanceToRestaurant(promotedRestaurant.latitude, promotedRestaurant.longitude)}
              onPress={() => router.push(`/restaurant-detail?id=${promotedRestaurant.id}` as any)}
            />
          ) : null}
        </View>
      </SafeAreaView>

      {/* Crowd Report Modal */}
      <CrowdReportModal
        visible={modalVisible}
        restaurant={selectedRestaurant}
        onClose={handleCloseModal}
      />

      {/* Random Picker Modal */}
      <RandomPickerModal
        visible={randomPickerVisible}
        availableRestaurants={availableRestaurants}
        distance={calculateDistanceToRestaurant}
        onClose={() => setRandomPickerVisible(false)}
        onNavigate={(restaurant) => {
          setRandomPickerVisible(false);
          router.push(`/restaurant-detail?id=${restaurant.id}` as any);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
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
    marginHorizontal: 16,
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 20,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  filterButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
    gap: 10,
  },
});
