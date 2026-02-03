import { Colors, NeonGlow, SubtleGlow } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface GlowButtonProps {
    icon: keyof typeof Ionicons.glyphMap;
    size?: number;
    glowIntensity?: 'high' | 'low';
    onPress?: () => void;
}

export function GlowButton({
    icon,
    size = 48,
    glowIntensity = 'high',
    onPress,
}: GlowButtonProps) {
    const glow = glowIntensity === 'high' ? NeonGlow : SubtleGlow;

    return (
        <TouchableOpacity
            style={[
                styles.button,
                glow,
                { width: size, height: size, borderRadius: size / 2 },
            ]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <View style={styles.innerCircle}>
                <Ionicons name={icon} size={size * 0.45} color={Colors.neonGreen} />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.darkGray,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: Colors.neonGreen,
    },
    innerCircle: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
