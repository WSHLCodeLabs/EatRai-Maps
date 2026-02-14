import { CrowdLevelBadge } from '@/components/CrowdLevelBadge';
import { Colors } from '@/constants/theme';
import { Restaurant } from '@/data/restaurants-data';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface PromotedCardProps {
    restaurant: Restaurant;
    distance: string;
    onPress: () => void;
}

/**
 * Promoted restaurant ad card for the map screen.
 * Visually distinct from standard cards with a gold badge,
 * hero image, and CTA button.
 */
export function PromotedCard({ restaurant, distance, onPress }: PromotedCardProps) {
    return (
        <TouchableOpacity
            style={styles.card}
            onPress={onPress}
            activeOpacity={0.92}
        >
            {/* Promoted Badge */}
            <View style={styles.badgeRow}>
                <View style={styles.badge}>
                    <Ionicons name="megaphone" size={12} color="#1A1A1A" />
                    <Text style={styles.badgeText}>Promoted</Text>
                </View>
            </View>

            {/* Hero Image */}
            <View style={styles.imageContainer}>
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
                    <View style={[styles.heroImage, styles.imagePlaceholder]}>
                        <Ionicons name="restaurant" size={32} color={Colors.textSecondary} />
                    </View>
                )}
            </View>

            {/* Info Section */}
            <View style={styles.infoSection}>
                <View style={styles.infoLeft}>
                    <Text style={styles.name} numberOfLines={1}>
                        {restaurant.name}
                    </Text>
                    <Text style={styles.details}>
                        {restaurant.cuisine} • {distance}
                    </Text>
                    <View style={styles.ratingRow}>
                        <Ionicons name="star" size={14} color={Colors.neonGreen} />
                        <Text style={styles.rating}>{restaurant.rating.toFixed(1)}</Text>
                        <CrowdLevelBadge level={restaurant.crowdLevel} size="small" />
                    </View>
                </View>

                {/* CTA Button */}
                <TouchableOpacity style={styles.ctaButton} onPress={onPress}>
                    <Text style={styles.ctaText}>View</Text>
                    <Ionicons name="arrow-forward" size={14} color={Colors.deepBlack} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}

const AMBER = '#F5A623';

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.darkGray,
        borderRadius: 16,
        marginHorizontal: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: AMBER + '40',
        // Amber glow
        shadowColor: AMBER,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    badgeRow: {
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 10,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: AMBER,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#1A1A1A',
        letterSpacing: 0.3,
    },
    imageContainer: {
        width: '100%',
        height: 120,
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    imagePlaceholder: {
        backgroundColor: Colors.mediumGray,
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoSection: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        paddingTop: 10,
    },
    infoLeft: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 2,
    },
    details: {
        fontSize: 13,
        color: Colors.textSecondary,
        marginBottom: 4,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rating: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginLeft: 4,
        marginRight: 8,
    },
    ctaButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: Colors.neonGreen,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 10,
    },
    ctaText: {
        fontSize: 13,
        fontWeight: '700',
        color: Colors.deepBlack,
    },
});
