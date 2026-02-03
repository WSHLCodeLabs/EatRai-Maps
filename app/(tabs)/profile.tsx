import { CardShadow, Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Profile Header */}
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Ionicons name="person" size={48} color={Colors.neonGreen} />
                        </View>
                    </View>
                    <Text style={styles.name}>Guest User</Text>
                    <Text style={styles.email}>Sign in to save your favorites</Text>
                </View>

                {/* Sign In Button */}
                <TouchableOpacity style={styles.signInButton}>
                    <Ionicons name="log-in-outline" size={20} color={Colors.deepBlack} />
                    <Text style={styles.signInText}>Sign In</Text>
                </TouchableOpacity>

                {/* Menu Items */}
                <View style={[styles.menuSection, CardShadow]}>
                    <MenuItem icon="heart-outline" label="Saved Places" />
                    <MenuItem icon="time-outline" label="Recent Searches" />
                    <MenuItem icon="star-outline" label="My Reviews" />
                </View>

                <View style={[styles.menuSection, CardShadow]}>
                    <MenuItem icon="settings-outline" label="Settings" />
                    <MenuItem icon="notifications-outline" label="Notifications" />
                    <MenuItem icon="moon-outline" label="Dark Mode" rightText="On" />
                </View>

                <View style={[styles.menuSection, CardShadow]}>
                    <MenuItem icon="help-circle-outline" label="Help & Support" />
                    <MenuItem icon="information-circle-outline" label="About" />
                </View>

                {/* App Version */}
                <Text style={styles.version}>EatRai Maps v1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

interface MenuItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    rightText?: string;
}

function MenuItem({ icon, label, rightText }: MenuItemProps) {
    return (
        <TouchableOpacity style={styles.menuItem}>
            <Ionicons name={icon} size={22} color={Colors.textSecondary} />
            <Text style={styles.menuLabel}>{label}</Text>
            {rightText ? (
                <Text style={styles.menuRightText}>{rightText}</Text>
            ) : (
                <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.deepBlack,
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
        backgroundColor: Colors.darkGray,
        borderWidth: 2,
        borderColor: Colors.neonGreen,
        alignItems: 'center',
        justifyContent: 'center',
    },
    name: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    signInButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.neonGreen,
        marginHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
        marginBottom: 32,
        gap: 8,
    },
    signInText: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.deepBlack,
    },
    menuSection: {
        backgroundColor: Colors.darkGray,
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
        borderBottomColor: Colors.mediumGray,
    },
    menuLabel: {
        flex: 1,
        fontSize: 15,
        color: Colors.textPrimary,
        marginLeft: 12,
    },
    menuRightText: {
        fontSize: 14,
        color: Colors.neonGreen,
        fontWeight: '600',
    },
    version: {
        textAlign: 'center',
        color: Colors.textMuted,
        fontSize: 12,
        marginTop: 24,
    },
});
