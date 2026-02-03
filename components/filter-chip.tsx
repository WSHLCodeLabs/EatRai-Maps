import { Colors, NeonGlow } from '@/constants/theme';
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
    return (
        <TouchableOpacity
            style={[
                styles.chip,
                active ? styles.chipActive : styles.chipInactive,
                active && NeonGlow,
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Ionicons
                name={icon}
                size={14}
                color={active ? Colors.deepBlack : Colors.textPrimary}
                style={styles.icon}
            />
            <Text style={[styles.text, active ? styles.textActive : styles.textInactive]}>
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
    chipActive: {
        backgroundColor: Colors.neonGreen,
    },
    chipInactive: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: Colors.mediumGray,
    },
    icon: {
        marginRight: 6,
    },
    text: {
        fontSize: 13,
        fontWeight: '600',
    },
    textActive: {
        color: Colors.deepBlack,
    },
    textInactive: {
        color: Colors.textPrimary,
    },
});
