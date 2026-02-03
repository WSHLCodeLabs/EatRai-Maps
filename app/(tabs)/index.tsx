import MapComponent from '@/components/MapComponent';
import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Component for category chips below the search bar
const CategoryChip = ({ icon, text, library }: { icon: string; text: string; library?: any }) => {
  const IconLib = library || MaterialIcons;
  return (
    <TouchableOpacity style={styles.chip}>
      <IconLib name={icon} size={16} color="#5f6368" style={styles.chipIcon} />
      <Text style={styles.chipText}>{text}</Text>
    </TouchableOpacity>
  );
};

export default function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
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
        mapRef.current.animateToRegion({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            latitudeDelta: 0.005, // Zoom in closer
            longitudeDelta: 0.005,
        }, 1000);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <MapComponent ref={mapRef} />

      <SafeAreaView style={styles.overlayContainer} pointerEvents="box-none">
        {/* Top Search Section */}
        <View style={styles.topSection}>
          <View style={styles.searchBarContainer}>
            <TouchableOpacity style={styles.iconButton}>
               {/* Google Maps uses a colorful icon or hamburger here, implementing hamburger */}
               <Ionicons name="menu" size={24} color="#5f6368" />
            </TouchableOpacity>
            
            <TextInput
              placeholder="Search here"
              style={styles.searchInput}
              placeholderTextColor="#5f6368"
            />
            
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="mic" size={24} color="#5f6368" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.profileButton}>
              <View style={styles.profileCircle}>
                <Text style={styles.profileInitial}>E</Text>
              </View>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.categoryScroll}
          >
            <CategoryChip icon="restaurant" text="Restaurants" />
            <CategoryChip icon="local-cafe" text="Coffee" />
            <CategoryChip icon="local-grocery-store" text="Groceries" />
            <CategoryChip icon="local-gas-station" text="Gas" />
            <CategoryChip icon="hotel" text="Hotels" />
            <CategoryChip icon="shopping-bag" text="Shopping" />
          </ScrollView>
        </View>

        {/* Bottom Action Section */}
        <View style={styles.bottomSection}>
          <View style={styles.rightButtons}>
             <TouchableOpacity style={styles.fabSmall}>
                <MaterialIcons name="layers" size={24} color="#3c4043" />
             </TouchableOpacity>

             <TouchableOpacity 
               style={[styles.fabSmall, { marginTop: 12 }]}
               onPress={centerMapOnUser}
             >
                <MaterialIcons name="my-location" size={24} color="#1f1f1f" />
             </TouchableOpacity>

             <TouchableOpacity style={styles.fabDirection}>
                <FontAwesome5 name="directions" size={24} color="white" />
                <Text style={styles.directionText}>GO</Text>
             </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  overlayContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topSection: {
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    width: '100%',
    alignItems: 'center',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    width: '92%',
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 12,
    elevation: 4, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  iconButton: {
    padding: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    marginLeft: 8,
  },
  profileButton: {
    marginLeft: 8,
  },
  profileCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#8e44ad',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  categoryScroll: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginRight: 8,
  },
  chipIcon: {
    marginRight: 6,
  },
  chipText: {
    fontSize: 14,
    color: '#3c4043',
    fontWeight: '500',
  },
  bottomSection: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginBottom: Platform.OS === 'ios' ? 80 : 60, // Space for tab bar
  },
  rightButtons: {
    alignItems: 'center',
    gap: 12, // Gap doesn't work effectively in nested views without flex sometimes, but okay in simple views
  },
  fabSmall: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabDirection: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#1a73e8', // Google Blue
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginTop: 12,
  },
  directionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 2,
  },
});

