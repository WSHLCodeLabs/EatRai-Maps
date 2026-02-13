import { CrowdLevelBadge } from '@/components/CrowdLevelBadge';
import { CrowdReportModal } from '@/components/CrowdReportModal';
import { NavigationButton } from '@/components/navigation-button';
import { CardShadow, Colors, SubtleGlow } from '@/constants/theme';
import { useRestaurants } from '@/context/RestaurantContext';
import { CROWD_COLORS } from '@/data/restaurants-data';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function RestaurantDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { getRestaurantById, calculateDistanceToRestaurant } = useRestaurants();
    const [modalVisible, setModalVisible] = useState(false);

    const restaurant = id ? getRestaurantById(id) : undefined;

    if (!restaurant) {
        return (
            <View style={styles.errorContainer}>
                <Ionicons name="alert-circle-outline" size={64} color={Colors.textSecondary} />
                <Text style={styles.errorText}>Restaurant not found</Text>
                <TouchableOpacity style={styles.backButtonError} onPress={() => router.back()}>
                    <Text style={styles.backButtonErrorText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const distance = calculateDistanceToRestaurant(restaurant.latitude, restaurant.longitude);
    const crowdColor = CROWD_COLORS[restaurant.crowdLevel];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ScrollView style={styles.scrollView} bounces={false}>
                {/* Hero Image */}
                <View style={styles.heroContainer}>
                    {restaurant.imageUrl ? (
                        <Image
                            source={
                                typeof restaurant.imageUrl === 'string'
                                    ? { uri: restaurant.imageUrl }
                                    : restaurant.imageUrl
                            }
                            style={styles.heroImage}
                            contentFit="cover"
                        />
                    ) : (
                        <View style={[styles.heroImage, styles.heroPlaceholder]}>
                            <Ionicons name="restaurant" size={64} color={Colors.textSecondary} />
                        </View>
                    )}
                    {/* Gradient overlay at bottom of image */}
                    <View style={styles.heroGradient} />

                    {/* Back Button */}
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
                    </TouchableOpacity>

                    {/* Crowd Badge on hero */}
                    <View style={styles.heroBadge}>
                        <CrowdLevelBadge level={restaurant.crowdLevel} size="large" />
                    </View>
                </View>

                {/* Content */}
                <View style={styles.content}>
                    {/* Name & Cuisine */}
                    <Text style={styles.name}>{restaurant.name}</Text>
                    <Text style={styles.cuisine}>{restaurant.cuisine}</Text>

                    {/* Stats Row */}
                    <View style={styles.statsRow}>
                        {/* Rating */}
                        <View style={[styles.statCard, CardShadow]}>
                            <Ionicons name="star" size={20} color={Colors.neonGreen} />
                            <Text style={styles.statValue}>{restaurant.rating.toFixed(1)}</Text>
                            <Text style={styles.statLabel}>Rating</Text>
                        </View>

                        {/* Distance */}
                        <View style={[styles.statCard, CardShadow]}>
                            <Ionicons name="location" size={20} color={Colors.neonGreen} />
                            <Text style={styles.statValue}>{distance}</Text>
                            <Text style={styles.statLabel}>Distance</Text>
                        </View>

                        {/* Crowd */}
                        <View style={[styles.statCard, CardShadow]}>
                            <Ionicons name="people" size={20} color={crowdColor} />
                            <Text style={[styles.statValue, { color: crowdColor }]}>
                                {restaurant.crowdLevel}
                            </Text>
                            <Text style={styles.statLabel}>Right Now</Text>
                        </View>
                    </View>

                    {/* Crowd Reports Section */}
                    <View style={[styles.section, CardShadow]}>
                        <Text style={styles.sectionTitle}>Crowd Reports</Text>
                        <View style={styles.crowdBars}>
                            <CrowdBar
                                label="Quiet"
                                count={restaurant.crowdReports.quiet}
                                total={
                                    restaurant.crowdReports.quiet +
                                    restaurant.crowdReports.moderate +
                                    restaurant.crowdReports.busy
                                }
                                color={CROWD_COLORS.Quiet}
                            />
                            <CrowdBar
                                label="Moderate"
                                count={restaurant.crowdReports.moderate}
                                total={
                                    restaurant.crowdReports.quiet +
                                    restaurant.crowdReports.moderate +
                                    restaurant.crowdReports.busy
                                }
                                color={CROWD_COLORS.Moderate}
                            />
                            <CrowdBar
                                label="Busy"
                                count={restaurant.crowdReports.busy}
                                total={
                                    restaurant.crowdReports.quiet +
                                    restaurant.crowdReports.moderate +
                                    restaurant.crowdReports.busy
                                }
                                color={CROWD_COLORS.Busy}
                            />
                        </View>
                        <TouchableOpacity
                            style={[styles.reportButton, SubtleGlow]}
                            onPress={() => setModalVisible(true)}
                        >
                            <Ionicons name="megaphone" size={18} color={Colors.deepBlack} />
                            <Text style={styles.reportButtonText}>Report Crowd Level</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Location Section */}
                    <View style={[styles.section, CardShadow]}>
                        <Text style={styles.sectionTitle}>Location</Text>
                        <View style={styles.locationRow}>
                            <View style={styles.locationInfo}>
                                <Ionicons name="navigate-outline" size={18} color={Colors.textSecondary} />
                                <Text style={styles.locationText}>
                                    {restaurant.latitude.toFixed(6)}, {restaurant.longitude.toFixed(6)}
                                </Text>
                            </View>
                            <NavigationButton
                                latitude={restaurant.latitude}
                                longitude={restaurant.longitude}
                                destinationName={restaurant.name}
                                size="medium"
                            />
                        </View>
                    </View>

                    {/* Bottom spacing */}
                    <View style={{ height: 40 }} />
                </View>
            </ScrollView>

            {/* Crowd Report Modal */}
            <CrowdReportModal
                visible={modalVisible}
                restaurant={restaurant}
                onClose={() => setModalVisible(false)}
            />
        </View>
    );
}

/**
 * Visual bar showing crowd report proportion
 */
function CrowdBar({
    label,
    count,
    total,
    color,
}: {
    label: string;
    count: number;
    total: number;
    color: string;
}) {
    const percentage = total > 0 ? (count / total) * 100 : 0;

    return (
        <View style={styles.crowdBarRow}>
            <Text style={[styles.crowdBarLabel, { color }]}>{label}</Text>
            <View style={styles.crowdBarTrack}>
                <View
                    style={[
                        styles.crowdBarFill,
                        { width: `${percentage}%`, backgroundColor: color },
                    ]}
                />
            </View>
            <Text style={styles.crowdBarCount}>{count}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.deepBlack,
    },
    scrollView: {
        flex: 1,
    },
    // Error state
    errorContainer: {
        flex: 1,
        backgroundColor: Colors.deepBlack,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
    },
    errorText: {
        fontSize: 18,
        color: Colors.textSecondary,
        marginTop: 16,
    },
    backButtonError: {
        marginTop: 24,
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: Colors.neonGreen,
        borderRadius: 12,
    },
    backButtonErrorText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.deepBlack,
    },
    // Hero
    heroContainer: {
        width: '100%',
        height: 280,
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    heroPlaceholder: {
        backgroundColor: Colors.darkGray,
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
        backgroundColor: 'transparent',
        // Simulated gradient overlay via shadow
        borderTopWidth: 0,
    },
    backButton: {
        position: 'absolute',
        top: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 52,
        left: 16,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(13, 13, 13, 0.7)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroBadge: {
        position: 'absolute',
        bottom: 16,
        right: 16,
    },
    // Content
    content: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    name: {
        fontSize: 28,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 4,
    },
    cuisine: {
        fontSize: 16,
        color: Colors.textSecondary,
        marginBottom: 20,
    },
    // Stats
    statsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        backgroundColor: Colors.darkGray,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        gap: 6,
    },
    statValue: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    statLabel: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    // Sections
    section: {
        backgroundColor: Colors.darkGray,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: 16,
    },
    // Crowd bars
    crowdBars: {
        gap: 12,
        marginBottom: 16,
    },
    crowdBarRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    crowdBarLabel: {
        width: 70,
        fontSize: 13,
        fontWeight: '600',
    },
    crowdBarTrack: {
        flex: 1,
        height: 8,
        backgroundColor: Colors.mediumGray,
        borderRadius: 4,
        overflow: 'hidden',
    },
    crowdBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    crowdBarCount: {
        width: 24,
        fontSize: 13,
        color: Colors.textSecondary,
        textAlign: 'right',
    },
    // Report button
    reportButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.neonGreen,
        borderRadius: 12,
        paddingVertical: 14,
        gap: 8,
    },
    reportButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.deepBlack,
    },
    // Location
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    locationInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
    },
    locationText: {
        fontSize: 13,
        color: Colors.textSecondary,
    },
});
