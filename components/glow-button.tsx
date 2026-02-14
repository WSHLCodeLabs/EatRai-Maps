import { NeonGlow, SubtleGlow } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
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
    const { colors } = useTheme();
    const glow = glowIntensity === 'high' ? NeonGlow : SubtleGlow;

    return (
        <TouchableOpacity
            style={[
                styles.button,
                glow,
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: colors.card,
                    borderColor: colors.accent,
                },
            ]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <View style={styles.innerCircle}>
                <Ionicons name={icon} size={size * 0.45} color={colors.accent} />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
    },
    innerCircle: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
