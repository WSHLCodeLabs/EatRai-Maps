import { FilterChip } from '@/components/filter-chip';
import { RestaurantCard } from '@/components/restaurant-card';
import { Colors } from '@/constants/theme';
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

// Mock restaurant data
const RESTAURANTS = [
    {
        id: '1',
        name: 'The Green Room',
        cuisine: 'Italian',
        distance: '0.4mi',
        rating: 4.8,
        tag: 'QUIET',
        imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200',
    },
    {
        id: '2',
        name: 'Sakura Ramen House',
        cuisine: 'Japanese',
        distance: '0.7mi',
        rating: 4.6,
        tag: 'POPULAR',
        imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200',
    },
    {
        id: '3',
        name: 'Café Luna',
        cuisine: 'French Café',
        distance: '0.3mi',
        rating: 4.9,
        tag: 'QUIET',
        imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200',
    },
    {
        id: '4',
        name: 'Spice Garden',
        cuisine: 'Indian',
        distance: '1.2mi',
        rating: 4.5,
        tag: 'BUSY',
        imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=200',
    },
    {
        id: '5',
        name: 'Ocean Blue',
        cuisine: 'Seafood',
        distance: '0.9mi',
        rating: 4.7,
        tag: 'QUIET',
        imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=200',
    },
];

type FilterType = 'all' | 'quiet' | 'popular' | 'nearby';

export default function RestaurantsScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');

    const filteredRestaurants = RESTAURANTS.filter((restaurant) => {
        const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter =
            activeFilter === 'all' ||
            (activeFilter === 'quiet' && restaurant.tag === 'QUIET') ||
            (activeFilter === 'popular' && restaurant.tag === 'POPULAR') ||
            (activeFilter === 'nearby' && parseFloat(restaurant.distance) < 0.5);
        return matchesSearch && matchesFilter;
    });

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Restaurants</Text>
                <Text style={styles.subtitle}>{filteredRestaurants.length} places nearby</Text>
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
                    icon="flame"
                    text="Popular"
                    active={activeFilter === 'popular'}
                    onPress={() => setActiveFilter('popular')}
                />
                <FilterChip
                    icon="location"
                    text="Nearby"
                    active={activeFilter === 'nearby'}
                    onPress={() => setActiveFilter('nearby')}
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
                        distance={item.distance}
                        rating={item.rating}
                        tag={item.tag}
                        imageUrl={item.imageUrl}
                    />
                )}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="restaurant-outline" size={48} color={Colors.textMuted} />
                        <Text style={styles.emptyText}>No restaurants found</Text>
                    </View>
                }
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
