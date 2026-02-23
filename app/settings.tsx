import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface SettingsItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value?: string;
    colors: { textSecondary: string; textPrimary: string; textMuted: string; border: string };
    onPress?: () => void;
}

function SettingsItem({ icon, label, value, colors, onPress }: SettingsItemProps) {
    return (
        <TouchableOpacity
            style={[styles.settingsItem, { borderBottomColor: colors.border }]}
            onPress={onPress}
            activeOpacity={0.6}
        >
            <Ionicons name={icon} size={22} color={colors.textSecondary} />
            <Text style={[styles.settingsLabel, { color: colors.textPrimary }]}>{label}</Text>
            {value && <Text style={[styles.settingsValue, { color: colors.textMuted }]}>{value}</Text>}
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </TouchableOpacity>
    );
}

export default function SettingsScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const [language, setLanguage] = useState('English');
    const [units, setUnits] = useState('km');

    const handleLanguage = () => {
        Alert.alert('Language', 'Select your preferred language', [
            { text: 'English', onPress: () => setLanguage('English') },
            { text: 'ไทย', onPress: () => setLanguage('ไทย') },
            { text: 'Cancel', style: 'cancel' },
        ]);
    };

    const handleUnits = () => {
        Alert.alert('Distance Units', 'Select your preferred unit', [
            { text: 'Kilometers (km)', onPress: () => setUnits('km') },
            { text: 'Miles (mi)', onPress: () => setUnits('mi') },
            { text: 'Cancel', style: 'cancel' },
        ]);
    };

    const handleClearCache = () => {
        Alert.alert('Clear Cache', 'This will clear all cached data. Continue?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Clear', style: 'destructive', onPress: () => Alert.alert('Done', 'Cache cleared successfully.') },
        ]);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Settings</Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* General */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>GENERAL</Text>
                <View style={[styles.section, { backgroundColor: colors.card }]}>
                    <SettingsItem icon="language-outline" label="Language" value={language} colors={colors} onPress={handleLanguage} />
                    <SettingsItem icon="speedometer-outline" label="Distance Units" value={units} colors={colors} onPress={handleUnits} />
                </View>

                {/* Data */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>DATA</Text>
                <View style={[styles.section, { backgroundColor: colors.card }]}>
                    <SettingsItem icon="trash-outline" label="Clear Cache" colors={colors} onPress={handleClearCache} />
                </View>

                {/* Legal */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>LEGAL</Text>
                <View style={[styles.section, { backgroundColor: colors.card }]}>
                    <SettingsItem icon="document-text-outline" label="Terms of Service" colors={colors} onPress={() => Alert.alert('Terms of Service', 'Coming soon.')} />
                    <SettingsItem icon="shield-checkmark-outline" label="Privacy Policy" colors={colors} onPress={() => Alert.alert('Privacy Policy', 'Coming soon.')} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 8,
        paddingBottom: 12,
        borderBottomWidth: 1,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    headerRight: {
        width: 40,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 1,
        marginTop: 24,
        marginBottom: 8,
        marginHorizontal: 20,
    },
    section: {
        marginHorizontal: 16,
        borderRadius: 16,
        overflow: 'hidden',
    },
    settingsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
    },
    settingsLabel: {
        flex: 1,
        fontSize: 15,
        marginLeft: 12,
    },
    settingsValue: {
        fontSize: 14,
        marginRight: 8,
    },
});
