import { CardShadow, Colors, SubtleGlow } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface RestaurantCardProps {
    name: string;
    cuisine: string;
    distance: string;
    rating: number;
    imageUrl?: string;
    tag?: string;
    onPress?: () => void;
}

export function RestaurantCard({
    name,
    cuisine,
    distance,
    rating,
    imageUrl,
    tag = 'QUIET',
    onPress,
}: RestaurantCardProps) {
    return (
        <TouchableOpacity style={[styles.card, CardShadow]} onPress={onPress} activeOpacity={0.9}>
            {/* Restaurant Image */}
            <View style={styles.imageContainer}>
                {imageUrl ? (
                    <Image source={{ uri: imageUrl }} style={styles.image} contentFit="cover" />
                ) : (
                    <View style={[styles.image, styles.imagePlaceholder]}>
                        <Ionicons name="restaurant" size={24} color={Colors.textSecondary} />
                    </View>
                )}
            </View>

            {/* Restaurant Info */}
            <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>
                    {name}
                </Text>
                <Text style={styles.details}>
                    {cuisine} • {distance}
                </Text>
                <View style={styles.ratingRow}>
                    <Ionicons name="star" size={14} color={Colors.neonGreen} />
                    <Text style={styles.rating}>{rating.toFixed(1)}</Text>
                    {tag && (
                        <View style={[styles.tag, SubtleGlow]}>
                            <Text style={styles.tagText}>{tag}</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Navigation Arrow */}
            <TouchableOpacity style={styles.arrowButton}>
                <Ionicons name="arrow-forward" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.darkGray,
        borderRadius: 16,
        padding: 12,
        marginHorizontal: 16,
    },
    imageContainer: {
        width: 70,
        height: 70,
        borderRadius: 12,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    imagePlaceholder: {
        backgroundColor: Colors.mediumGray,
        alignItems: 'center',
        justifyContent: 'center',
    },
    info: {
        flex: 1,
        marginLeft: 12,
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
        marginBottom: 6,
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
    },
    tag: {
        backgroundColor: Colors.neonGreen,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        marginLeft: 10,
    },
    tagText: {
        fontSize: 10,
        fontWeight: '700',
        color: Colors.deepBlack,
        letterSpacing: 0.5,
    },
    arrowButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.mediumGray,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
