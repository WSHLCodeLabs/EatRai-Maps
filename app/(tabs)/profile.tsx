import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
    const { isDarkMode, toggleTheme, colors } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Profile Header */}
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        <View style={[styles.avatar, { backgroundColor: colors.card, borderColor: colors.accent }]}>
                            <Ionicons name="person" size={48} color={colors.accent} />
                        </View>
                    </View>
                    <Text style={[styles.name, { color: colors.textPrimary }]}>Guest User</Text>
                    <Text style={[styles.email, { color: colors.textSecondary }]}>Sign in to save your favorites</Text>
                </View>

                {/* Sign In Button */}
                <TouchableOpacity
                    style={[styles.signInButton, { backgroundColor: colors.accent }]}
                    onPress={() => router.push('/login' as any)}
                >
                    <Ionicons name="log-in-outline" size={20} color={isDarkMode ? '#0D0D0D' : '#FFFFFF'} />
                    <Text style={[styles.signInText, { color: isDarkMode ? '#0D0D0D' : '#FFFFFF' }]}>Sign In</Text>
                </TouchableOpacity>

                {/* Create Account Link */}
                <View style={styles.createAccountContainer}>
                    <Text style={[styles.createAccountText, { color: colors.textSecondary }]}>Don't have an account? </Text>
                    <TouchableOpacity onPress={() => router.push('/signup' as any)}>
                        <Text style={[styles.createAccountLink, { color: colors.accent }]}>Sign up</Text>
                    </TouchableOpacity>
                </View>

                {/* Menu Items */}
                <View style={[styles.menuSection, { backgroundColor: colors.card }]}>
                    <MenuItem icon="heart-outline" label="Saved Places" colors={colors} />
                    <MenuItem icon="time-outline" label="Recent Searches" colors={colors} />
                    <MenuItem icon="star-outline" label="My Reviews" colors={colors} />
                </View>

                <View style={[styles.menuSection, { backgroundColor: colors.card }]}>
                    <MenuItem icon="settings-outline" label="Settings" colors={colors} />
                    <MenuItem icon="notifications-outline" label="Notifications" colors={colors} />
                    {/* Dark Mode Toggle */}
                    <View style={[styles.menuItem, { borderBottomColor: colors.border }]}>
                        <Ionicons name="moon-outline" size={22} color={colors.textSecondary} />
                        <Text style={[styles.menuLabel, { color: colors.textPrimary }]}>Dark Mode</Text>
                        <Switch
                            value={isDarkMode}
                            onValueChange={toggleTheme}
                            trackColor={{ false: '#D1D1D6', true: colors.accent + '60' }}
                            thumbColor={isDarkMode ? colors.accent : '#FFFFFF'}
                        />
                    </View>
                </View>

                <View style={[styles.menuSection, { backgroundColor: colors.card }]}>
                    <MenuItem icon="help-circle-outline" label="Help & Support" colors={colors} />
                    <MenuItem icon="information-circle-outline" label="About" colors={colors} />
                </View>

                {/* App Version */}
                <Text style={[styles.version, { color: colors.textMuted }]}>EatRai Maps v1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

interface MenuItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    colors: { textSecondary: string; textPrimary: string; textMuted: string; border: string };
}

function MenuItem({ icon, label, colors }: MenuItemProps) {
    return (
        <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border }]}>
            <Ionicons name={icon} size={22} color={colors.textSecondary} />
            <Text style={[styles.menuLabel, { color: colors.textPrimary }]}>{label}</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        paddingTop: 40,
        paddingBottom: 24,
    },
    avatarContainer: {
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    name: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
    },
    signInButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
        marginBottom: 32,
        gap: 8,
    },
    signInText: {
        fontSize: 16,
        fontWeight: '700',
    },
    menuSection: {
        marginHorizontal: 16,
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
    },
    menuLabel: {
        flex: 1,
        fontSize: 15,
        marginLeft: 12,
    },
    version: {
        textAlign: 'center',
        fontSize: 12,
        marginTop: 24,
    },
    createAccountContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    createAccountText: {
        fontSize: 14,
    },
    createAccountLink: {
        fontSize: 14,
        fontWeight: '600',
    },
});
