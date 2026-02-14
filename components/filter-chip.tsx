import { NeonGlow } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface FilterChipProps {
    icon: keyof typeof Ionicons.glyphMap;
    text: string;
    active?: boolean;
    onPress?: () => void;
}

export function FilterChip({ icon, text, active = false, onPress }: FilterChipProps) {
    const { colors } = useTheme();

    return (
        <TouchableOpacity
            style={[
                styles.chip,
                active
                    ? [{ backgroundColor: colors.accent }, NeonGlow]
                    : { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border },
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Ionicons
                name={icon}
                size={14}
                color={active ? '#0D0D0D' : colors.textPrimary}
                style={styles.icon}
            />
            <Text style={[styles.text, { color: active ? '#0D0D0D' : colors.textPrimary }]}>
                {text}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        marginRight: 8,
    },
    icon: {
        marginRight: 6,
    },
    text: {
        fontSize: 13,
        fontWeight: '600',
    },
});
