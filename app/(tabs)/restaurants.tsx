import { CrowdReportModal } from '@/components/CrowdReportModal';
import { FilterChip } from '@/components/filter-chip';
import { RestaurantCard } from '@/components/restaurant-card';
import { Colors } from '@/constants/theme';
import { useRestaurants } from '@/context/RestaurantContext';
import { Restaurant } from '@/data/restaurants-data';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    FlatList,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

type FilterType = 'all' | 'quiet' | 'moderate' | 'busy' | 'nearby';

export default function RestaurantsScreen() {
    const { restaurants, calculateDistanceToRestaurant } = useRestaurants();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const filteredRestaurants = restaurants.filter((restaurant) => {
        const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter =
            activeFilter === 'all' ||
            (activeFilter === 'quiet' && restaurant.crowdLevel === 'Quiet') ||
            (activeFilter === 'moderate' && restaurant.crowdLevel === 'Moderate') ||
            (activeFilter === 'busy' && restaurant.crowdLevel === 'Busy') ||
            (activeFilter === 'nearby' && parseFloat(restaurant.distance) <= 0.5);
        return matchesSearch && matchesFilter;
    });

    const handleReportPress = (restaurant: Restaurant) => {
        setSelectedRestaurant(restaurant);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedRestaurant(null);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Restaurants</Text>
                <Text style={styles.subtitle}>Near KU Kamphaeng Saen • {filteredRestaurants.length} places</Text>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color={Colors.textSecondary} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search restaurants..."
                        placeholderTextColor={Colors.textSecondary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={20} color={Colors.textSecondary} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Filter Chips */}
            <View style={styles.filterContainer}>
                <FilterChip
                    icon="apps"
                    text="All"
                    active={activeFilter === 'all'}
                    onPress={() => setActiveFilter('all')}
                />
                <FilterChip
                    icon="leaf"
                    text="Quiet"
                    active={activeFilter === 'quiet'}
                    onPress={() => setActiveFilter('quiet')}
                />
                <FilterChip
                    icon="people"
                    text="Moderate"
                    active={activeFilter === 'moderate'}
                    onPress={() => setActiveFilter('moderate')}
                />
                <FilterChip
                    icon="flame"
                    text="Busy"
                    active={activeFilter === 'busy'}
                    onPress={() => setActiveFilter('busy')}
                />
            </View>

            {/* Restaurant List */}
            <FlatList
                data={filteredRestaurants}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                renderItem={({ item }) => (
                    <RestaurantCard
                        name={item.name}
                        cuisine={item.cuisine}
                        distance={calculateDistanceToRestaurant(item.latitude, item.longitude)}
                        rating={item.rating}
                        crowdLevel={item.crowdLevel}
                        imageUrl={item.imageUrl}
                        latitude={item.latitude}
                        longitude={item.longitude}
                        onReportPress={() => handleReportPress(item)}
                    />
                )}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="restaurant-outline" size={48} color={Colors.textMuted} />
                        <Text style={styles.emptyText}>No restaurants found</Text>
                    </View>
                }
            />

            {/* Crowd Report Modal */}
            <CrowdReportModal
                visible={modalVisible}
                restaurant={selectedRestaurant}
                onClose={handleCloseModal}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.deepBlack,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 16 : 20,
        paddingBottom: 12,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    subtitle: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginTop: 4,
    },
    searchContainer: {
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.darkGray,
        borderRadius: 12,
        paddingHorizontal: 14,
        height: 48,
        borderWidth: 1,
        borderColor: Colors.mediumGray,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: Colors.textPrimary,
        marginLeft: 10,
    },
    filterContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    listContent: {
        paddingBottom: 24,
    },
    separator: {
        height: 12,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
    },
    emptyText: {
        fontSize: 16,
        color: Colors.textMuted,
        marginTop: 12,
    },
});
