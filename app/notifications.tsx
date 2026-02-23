import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface NotifToggleProps {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    description: string;
    value: boolean;
    onToggle: (val: boolean) => void;
    colors: { textSecondary: string; textPrimary: string; textMuted: string; border: string; accent: string };
}

function NotifToggle({ icon, label, description, value, onToggle, colors }: NotifToggleProps) {
    return (
        <View style={[styles.toggleItem, { borderBottomColor: colors.border }]}>
            <Ionicons name={icon} size={22} color={colors.textSecondary} />
            <View style={styles.toggleContent}>
                <Text style={[styles.toggleLabel, { color: colors.textPrimary }]}>{label}</Text>
                <Text style={[styles.toggleDesc, { color: colors.textMuted }]}>{description}</Text>
            </View>
            <Switch
                value={value}
                onValueChange={onToggle}
                trackColor={{ false: '#D1D1D6', true: colors.accent + '60' }}
                thumbColor={value ? colors.accent : '#FFFFFF'}
            />
        </View>
    );
}

export default function NotificationsScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const [pushEnabled, setPushEnabled] = useState(true);
    const [crowdAlerts, setCrowdAlerts] = useState(true);
    const [newRestaurants, setNewRestaurants] = useState(false);
    const [promotions, setPromotions] = useState(false);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Notifications</Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>ALERTS</Text>
                <View style={[styles.section, { backgroundColor: colors.card }]}>
                    <NotifToggle
                        icon="notifications-outline"
                        label="Push Notifications"
                        description="Enable all push notifications"
                        value={pushEnabled}
                        onToggle={setPushEnabled}
                        colors={colors}
                    />
                    <NotifToggle
                        icon="people-outline"
                        label="Crowd Alerts"
                        description="Get notified when crowd levels change"
                        value={crowdAlerts}
                        onToggle={setCrowdAlerts}
                        colors={colors}
                    />
                    <NotifToggle
                        icon="restaurant-outline"
                        label="New Restaurants"
                        description="Know when new places open nearby"
                        value={newRestaurants}
                        onToggle={setNewRestaurants}
                        colors={colors}
                    />
                    <NotifToggle
                        icon="pricetag-outline"
                        label="Promotions"
                        description="Special deals and offers"
                        value={promotions}
                        onToggle={setPromotions}
                        colors={colors}
                    />
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
    toggleItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
    },
    toggleContent: {
        flex: 1,
        marginLeft: 12,
    },
    toggleLabel: {
        fontSize: 15,
        fontWeight: '500',
    },
    toggleDesc: {
        fontSize: 12,
        marginTop: 2,
    },
});
