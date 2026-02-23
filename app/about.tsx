import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Linking,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function AboutScreen() {
    const router = useRouter();
    const { colors } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>About</Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* App Logo & Info */}
                <View style={styles.logoSection}>
                    <View style={[styles.logoIcon, { backgroundColor: colors.card }]}>
                        <Ionicons name="restaurant" size={40} color={colors.accent} />
                    </View>
                    <Text style={[styles.appName, { color: colors.textPrimary }]}>EatRai Maps</Text>
                    <Text style={[styles.version, { color: colors.textSecondary }]}>Version 1.0.0</Text>
                    <Text style={[styles.tagline, { color: colors.textMuted }]}>
                        Find the best restaurants with real-time crowd data
                    </Text>
                </View>

                {/* About Description */}
                <View style={[styles.section, { backgroundColor: colors.card }]}>
                    <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>About EatRai</Text>
                    <Text style={[styles.description, { color: colors.textSecondary }]}>
                        EatRai Maps helps you discover amazing restaurants near you with real-time crowd information.
                        Know how busy a place is before you go, save your favorite spots, and share your dining experiences with the community.
                    </Text>
                </View>

                {/* Links */}
                <View style={[styles.section, { backgroundColor: colors.card }]}>
                    <TouchableOpacity
                        style={[styles.linkItem, { borderBottomColor: colors.border }]}
                        onPress={() => Linking.openURL('https://eatrai.com').catch(() => { })}
                        activeOpacity={0.6}
                    >
                        <Ionicons name="globe-outline" size={22} color={colors.textSecondary} />
                        <Text style={[styles.linkLabel, { color: colors.textPrimary }]}>Website</Text>
                        <Ionicons name="open-outline" size={16} color={colors.textMuted} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.linkItem, { borderBottomColor: colors.border }]}
                        onPress={() => Linking.openURL('https://eatrai.com/terms').catch(() => { })}
                        activeOpacity={0.6}
                    >
                        <Ionicons name="document-text-outline" size={22} color={colors.textSecondary} />
                        <Text style={[styles.linkLabel, { color: colors.textPrimary }]}>Terms of Service</Text>
                        <Ionicons name="open-outline" size={16} color={colors.textMuted} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.linkItem, { borderBottomColor: colors.border }]}
                        onPress={() => Linking.openURL('https://eatrai.com/privacy').catch(() => { })}
                        activeOpacity={0.6}
                    >
                        <Ionicons name="shield-checkmark-outline" size={22} color={colors.textSecondary} />
                        <Text style={[styles.linkLabel, { color: colors.textPrimary }]}>Privacy Policy</Text>
                        <Ionicons name="open-outline" size={16} color={colors.textMuted} />
                    </TouchableOpacity>
                </View>

                {/* Credits */}
                <View style={[styles.section, { backgroundColor: colors.card }]}>
                    <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Acknowledgments</Text>
                    <Text style={[styles.description, { color: colors.textSecondary }]}>
                        Built with React Native & Expo. Map data provided by OpenStreetMap contributors.
                        Icons by Ionicons.
                    </Text>
                </View>

                {/* Footer */}
                <Text style={[styles.footer, { color: colors.textMuted }]}>
                    © 2026 EatRai. All rights reserved.
                </Text>
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
    logoSection: {
        alignItems: 'center',
        paddingTop: 40,
        paddingBottom: 32,
    },
    logoIcon: {
        width: 80,
        height: 80,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    appName: {
        fontSize: 26,
        fontWeight: '700',
        marginBottom: 4,
    },
    version: {
        fontSize: 14,
        marginBottom: 8,
    },
    tagline: {
        fontSize: 13,
        textAlign: 'center',
        paddingHorizontal: 40,
    },
    section: {
        marginHorizontal: 16,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
    },
    description: {
        fontSize: 14,
        lineHeight: 22,
    },
    linkItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    linkLabel: {
        flex: 1,
        fontSize: 15,
        marginLeft: 12,
    },
    footer: {
        textAlign: 'center',
        fontSize: 12,
        marginTop: 16,
    },
});
