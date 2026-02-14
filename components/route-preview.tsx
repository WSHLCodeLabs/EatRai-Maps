import { NeonGlow } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
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
    const { colors } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.card }]}>
            {/* Handle bar */}
            <View style={[styles.handleBar, { backgroundColor: colors.border }]} />

            {/* Restaurant Info */}
            <View style={styles.header}>
                <View style={styles.info}>
                    <Text style={[styles.name, { color: colors.textPrimary }]} numberOfLines={1}>
                        {restaurantName}
                    </Text>
                    <Text style={[styles.cuisine, { color: colors.textSecondary }]}>{cuisine}</Text>
                </View>
                {onClose && (
                    <Ionicons
                        name="close"
                        size={24}
                        color={colors.textSecondary}
                        onPress={onClose}
                    />
                )}
            </View>

            {/* Route Stats */}
            <View style={styles.statsRow}>
                <View style={styles.stat}>
                    <View style={[styles.statIcon, { backgroundColor: colors.accent }, NeonGlow]}>
                        <Ionicons name="walk" size={18} color="#0D0D0D" />
                    </View>
                    <View>
                        <Text style={[styles.statValue, { color: colors.textPrimary }]}>{distance}</Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Distance</Text>
                    </View>
                </View>

                {duration && (
                    <View style={styles.stat}>
                        <View style={[styles.statIcon, { backgroundColor: colors.accent }, NeonGlow]}>
                            <Ionicons name="time" size={18} color="#0D0D0D" />
                        </View>
                        <View>
                            <Text style={[styles.statValue, { color: colors.textPrimary }]}>{duration}</Text>
                            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Est. Time</Text>
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
        borderRadius: 24,
        padding: 20,
        paddingBottom: Platform.OS === 'ios' ? 28 : 20,
        marginHorizontal: 16,
    },
    handleBar: {
        width: 36,
        height: 4,
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
    },
    cuisine: {
        fontSize: 14,
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
        alignItems: 'center',
        justifyContent: 'center',
    },
    statValue: {
        fontSize: 16,
        fontWeight: '600',
    },
    statLabel: {
        fontSize: 12,
    },
});
