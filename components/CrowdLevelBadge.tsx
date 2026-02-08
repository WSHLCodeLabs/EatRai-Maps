import { Colors } from '@/constants/theme';
import { CROWD_COLORS, CrowdLevel } from '@/data/restaurants-data';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface CrowdLevelBadgeProps {
    level: CrowdLevel;
    size?: 'small' | 'medium' | 'large';
    showGlow?: boolean;
}

export function CrowdLevelBadge({ level, size = 'small', showGlow = true }: CrowdLevelBadgeProps) {
    const color = CROWD_COLORS[level];

    const badgeSize = {
        small: { paddingHorizontal: 8, paddingVertical: 2, fontSize: 10 },
        medium: { paddingHorizontal: 10, paddingVertical: 4, fontSize: 12 },
        large: { paddingHorizontal: 14, paddingVertical: 6, fontSize: 14 },
    }[size];

    const glowStyle = showGlow ? {
        shadowColor: color,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 8,
        elevation: 4,
    } : {};

    return (
        <View style={[
            styles.badge,
            { backgroundColor: color },
            badgeSize,
            glowStyle,
        ]}>
            <Text style={[
                styles.text,
                { fontSize: badgeSize.fontSize },
            ]}>
                {level.toUpperCase()}
            </Text>
        </View>
    );
}

// Icon indicator for map markers
export function CrowdIndicator({ level }: { level: CrowdLevel }) {
    const color = CROWD_COLORS[level];

    return (
        <View style={[styles.indicator, { backgroundColor: color }]}>
            <View style={[styles.indicatorInner, { backgroundColor: color }]} />
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontWeight: '700',
        color: Colors.deepBlack,
        letterSpacing: 0.5,
    },
    indicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    indicatorInner: {
        width: 6,
        height: 6,
        borderRadius: 3,
        opacity: 0.6,
    },
});
