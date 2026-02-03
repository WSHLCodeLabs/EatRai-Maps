import { Colors, NeonGlow, SubtleGlow } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface MapMarkerProps {
    selected?: boolean;
    rating?: number;
}

export function MapMarker({ selected = false, rating }: MapMarkerProps) {
    return (
        <View style={[styles.container, selected && NeonGlow]}>
            <View style={[styles.marker, selected ? styles.markerSelected : styles.markerDefault]}>
                {rating ? (
                    <View style={styles.ratingContainer}>
                        <Ionicons name="leaf" size={10} color={selected ? Colors.deepBlack : Colors.neonGreen} />
                        <View style={styles.ratingBadge}>
                            <Ionicons name="star" size={8} color={Colors.neonGreen} />
                            <View style={styles.ratingText}>
                                <Ionicons name="star" size={8} color={Colors.neonGreen} />
                            </View>
                        </View>
                    </View>
                ) : (
                    <Ionicons
                        name="restaurant"
                        size={14}
                        color={selected ? Colors.deepBlack : Colors.neonGreen}
                    />
                )}
            </View>
            {/* Pin point */}
            <View style={[styles.pin, selected && { backgroundColor: Colors.neonGreen }]} />
        </View>
    );
}

// Simple marker for showing restaurant on map
export function SimpleMapMarker({ label, selected = false }: { label?: string; selected?: boolean }) {
    return (
        <View style={[styles.simpleContainer, selected && SubtleGlow]}>
            <View style={[styles.simpleMarker, selected && styles.simpleMarkerSelected]}>
                {label ? (
                    <View style={styles.labelRow}>
                        <Ionicons name="leaf" size={10} color={selected ? Colors.deepBlack : Colors.neonGreen} />
                        <View style={styles.labelText}>
                            <Ionicons name="star" size={8} color={Colors.neonGreen} />
                            <View style={styles.labelValue} />
                        </View>
                    </View>
                ) : (
                    <View style={styles.dot} />
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
    markerDefault: {
        backgroundColor: Colors.darkGray,
        borderColor: Colors.neonGreen,
    },
    markerSelected: {
        backgroundColor: Colors.neonGreen,
        borderColor: Colors.neonGreen,
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
        backgroundColor: Colors.mediumGray,
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
    simpleMarkerSelected: {
        backgroundColor: Colors.neonGreen,
        borderColor: Colors.neonGreen,
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
        backgroundColor: Colors.neonGreen,
    },
});
