import { CardShadow, Colors, NeonGlow } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { NavigationButton } from './navigation-button';

interface RoutePreviewProps {
    restaurantName: string;
    cuisine: string;
    distance: string;
    duration?: string;
    latitude: number;
    longitude: number;
    onClose?: () => void;
}

export function RoutePreview({
    restaurantName,
    cuisine,
    distance,
    duration,
    latitude,
    longitude,
    onClose,
}: RoutePreviewProps) {
    return (
        <View style={[styles.container, CardShadow]}>
            {/* Handle bar */}
            <View style={styles.handleBar} />

            {/* Restaurant Info */}
            <View style={styles.header}>
                <View style={styles.info}>
                    <Text style={styles.name} numberOfLines={1}>
                        {restaurantName}
                    </Text>
                    <Text style={styles.cuisine}>{cuisine}</Text>
                </View>
                {onClose && (
                    <Ionicons
                        name="close"
                        size={24}
                        color={Colors.textSecondary}
                        onPress={onClose}
                    />
                )}
            </View>

            {/* Route Stats */}
            <View style={styles.statsRow}>
                <View style={styles.stat}>
                    <View style={[styles.statIcon, NeonGlow]}>
                        <Ionicons name="walk" size={18} color={Colors.deepBlack} />
                    </View>
                    <View>
                        <Text style={styles.statValue}>{distance}</Text>
                        <Text style={styles.statLabel}>Distance</Text>
                    </View>
                </View>

                {duration && (
                    <View style={styles.stat}>
                        <View style={[styles.statIcon, NeonGlow]}>
                            <Ionicons name="time" size={18} color={Colors.deepBlack} />
                        </View>
                        <View>
                            <Text style={styles.statValue}>{duration}</Text>
                            <Text style={styles.statLabel}>Est. Time</Text>
                        </View>
                    </View>
                )}
            </View>

            {/* Navigation Button */}
            <NavigationButton
                latitude={latitude}
                longitude={longitude}
                destinationName={restaurantName}
                variant="full"
                size="large"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.darkGray,
        borderRadius: 24,
        padding: 20,
        paddingBottom: Platform.OS === 'ios' ? 28 : 20,
        marginHorizontal: 16,
    },
    handleBar: {
        width: 36,
        height: 4,
        backgroundColor: Colors.mediumGray,
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    info: {
        flex: 1,
        marginRight: 12,
    },
    name: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    cuisine: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 24,
        marginBottom: 20,
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    statIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.neonGreen,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statValue: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    statLabel: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
});
