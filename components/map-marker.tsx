import { Colors, NeonGlow, SubtleGlow } from '@/constants/theme';
import { CROWD_COLORS, CrowdLevel } from '@/data/restaurants-data';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface MapMarkerProps {
    selected?: boolean;
    rating?: number;
    crowdLevel?: CrowdLevel;
}

export function MapMarker({ selected = false, rating, crowdLevel }: MapMarkerProps) {
    // Get color based on crowd level
    const markerColor = crowdLevel ? CROWD_COLORS[crowdLevel] : Colors.neonGreen;

    return (
        <View style={[styles.container, selected && { ...NeonGlow, shadowColor: markerColor }]}>
            <View style={[
                styles.marker,
                {
                    borderColor: markerColor,
                    backgroundColor: selected ? markerColor : Colors.darkGray,
                }
            ]}>
                {rating ? (
                    <View style={styles.ratingContainer}>
                        <Ionicons name="leaf" size={10} color={selected ? Colors.deepBlack : markerColor} />
                        <View style={styles.ratingBadge}>
                            <Ionicons name="star" size={8} color={markerColor} />
                            <View style={styles.ratingText}>
                                <Ionicons name="star" size={8} color={markerColor} />
                            </View>
                        </View>
                    </View>
                ) : (
                    <Ionicons
                        name="restaurant"
                        size={14}
                        color={selected ? Colors.deepBlack : markerColor}
                    />
                )}
            </View>
            {/* Pin point */}
            <View style={[styles.pin, { backgroundColor: markerColor }]} />
        </View>
    );
}

// Simple marker for showing restaurant on map
export function SimpleMapMarker({ label, selected = false, crowdLevel }: { label?: string; selected?: boolean; crowdLevel?: CrowdLevel }) {
    const markerColor = crowdLevel ? CROWD_COLORS[crowdLevel] : Colors.neonGreen;

    return (
        <View style={[styles.simpleContainer, selected && { ...SubtleGlow, shadowColor: markerColor }]}>
            <View style={[
                styles.simpleMarker,
                selected && { backgroundColor: markerColor, borderColor: markerColor }
            ]}>
                {label ? (
                    <View style={styles.labelRow}>
                        <Ionicons name="leaf" size={10} color={selected ? Colors.deepBlack : markerColor} />
                        <View style={styles.labelText}>
                            <Ionicons name="star" size={8} color={markerColor} />
                            <View style={styles.labelValue} />
                        </View>
                    </View>
                ) : (
                    <View style={[styles.dot, { backgroundColor: markerColor }]} />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    marker: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
    },
    ratingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        marginLeft: 2,
    },
    pin: {
        width: 3,
        height: 8,
        borderBottomLeftRadius: 2,
        borderBottomRightRadius: 2,
        marginTop: -2,
    },
    simpleContainer: {
        alignItems: 'center',
    },
    simpleMarker: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: Colors.darkGray,
        borderWidth: 1,
        borderColor: Colors.mediumGray,
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    labelText: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 4,
    },
    labelValue: {
        width: 4,
        height: 4,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
});
