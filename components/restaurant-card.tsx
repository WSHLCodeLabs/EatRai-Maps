import { CrowdLevelBadge } from '@/components/CrowdLevelBadge';
import { useTheme } from '@/context/ThemeContext';
import { CROWD_COLORS, CrowdLevel } from '@/data/restaurants-data';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NavigationButton } from './navigation-button';

interface RestaurantCardProps {
    name: string;
    cuisine: string;
    distance: string;
    rating: number;
    imageUrl?: string | number;
    tag?: string;
    latitude?: number;
    longitude?: number;
    crowdLevel?: CrowdLevel;
    onPress?: () => void;
    onReportPress?: () => void;
}

export function RestaurantCard({
    name,
    cuisine,
    distance,
    rating,
    imageUrl,
    tag = 'QUIET',
    latitude,
    longitude,
    crowdLevel,
    onPress,
    onReportPress,
}: RestaurantCardProps) {
    const { colors } = useTheme();

    return (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.card }]}
            onPress={onPress}
            activeOpacity={0.9}
        >
            {/* Restaurant Image */}
            <View style={styles.imageContainer}>
                {imageUrl ? (
                    <Image
                        source={
                            typeof imageUrl === 'string'
                                ? { uri: imageUrl }
                                : imageUrl
                        }
                        style={styles.image}
                        contentFit="cover"
                    />
                ) : (
                    <View style={[styles.image, styles.imagePlaceholder, { backgroundColor: colors.border }]}>
                        <Ionicons name="restaurant" size={24} color={colors.textSecondary} />
                    </View>
                )}
            </View>

            {/* Restaurant Info */}
            <View style={styles.info}>
                <Text style={[styles.name, { color: colors.textPrimary }]} numberOfLines={1}>
                    {name}
                </Text>
                <Text style={[styles.details, { color: colors.textSecondary }]}>
                    {cuisine} • {distance}
                </Text>
                <View style={styles.ratingRow}>
                    <Ionicons name="star" size={14} color={colors.accent} />
                    <Text style={[styles.rating, { color: colors.textPrimary }]}>{rating.toFixed(1)}</Text>
                    {crowdLevel ? (
                        <CrowdLevelBadge level={crowdLevel} size="small" />
                    ) : tag && (
                        <View style={[styles.tag, { backgroundColor: colors.accent }]}>
                            <Text style={styles.tagText}>{tag}</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Buttons Container */}
            <View style={styles.buttonsContainer}>
                {/* Report Crowd Button */}
                {onReportPress && (
                    <TouchableOpacity
                        style={[
                            styles.reportButton,
                            { backgroundColor: colors.border },
                            crowdLevel && { borderColor: CROWD_COLORS[crowdLevel] }
                        ]}
                        onPress={onReportPress}
                    >
                        <Ionicons
                            name="megaphone"
                            size={18}
                            color={crowdLevel ? CROWD_COLORS[crowdLevel] : colors.accent}
                        />
                    </TouchableOpacity>
                )}

                {/* Navigation Button */}
                {latitude && longitude ? (
                    <NavigationButton
                        latitude={latitude}
                        longitude={longitude}
                        destinationName={name}
                        size="small"
                    />
                ) : (
                    <TouchableOpacity
                        style={[styles.arrowButton, { backgroundColor: colors.border }]}
                        onPress={onPress}
                    >
                        <Ionicons name="arrow-forward" size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        padding: 12,
        marginHorizontal: 16,
    },
    imageContainer: {
        width: 60,
        height: 60,
        borderRadius: 12,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    imagePlaceholder: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    info: {
        flex: 1,
        marginLeft: 12,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    details: {
        fontSize: 13,
        marginBottom: 4,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rating: {
        fontSize: 13,
        fontWeight: '600',
        marginLeft: 4,
        marginRight: 8,
    },
    tag: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    tagText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#0D0D0D',
    },
    arrowButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    reportButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
});
