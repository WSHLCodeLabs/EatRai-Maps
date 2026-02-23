import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Alert,
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

interface HelpItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    description: string;
    colors: { textSecondary: string; textPrimary: string; textMuted: string; border: string };
    onPress?: () => void;
}

function HelpItem({ icon, label, description, colors, onPress }: HelpItemProps) {
    return (
        <TouchableOpacity
            style={[styles.helpItem, { borderBottomColor: colors.border }]}
            onPress={onPress}
            activeOpacity={0.6}
        >
            <View style={[styles.helpIconBg, { backgroundColor: colors.border }]}>
                <Ionicons name={icon} size={22} color={colors.textPrimary} />
            </View>
            <View style={styles.helpContent}>
                <Text style={[styles.helpLabel, { color: colors.textPrimary }]}>{label}</Text>
                <Text style={[styles.helpDesc, { color: colors.textMuted }]}>{description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </TouchableOpacity>
    );
}

export default function HelpSupportScreen() {
    const router = useRouter();
    const { colors } = useTheme();

    const handleContactUs = () => {
        Linking.openURL('mailto:support@eatrai.com').catch(() => {
            Alert.alert('Email', 'Please send your message to support@eatrai.com');
        });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Help & Support</Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={[styles.section, { backgroundColor: colors.card }]}>
                    <HelpItem
                        icon="help-circle-outline"
                        label="FAQ"
                        description="Frequently asked questions"
                        colors={colors}
                        onPress={() => Alert.alert('FAQ', 'FAQ page coming soon!')}
                    />
                    <HelpItem
                        icon="mail-outline"
                        label="Contact Us"
                        description="Send us an email"
                        colors={colors}
                        onPress={handleContactUs}
                    />
                    <HelpItem
                        icon="bug-outline"
                        label="Report a Problem"
                        description="Let us know if something isn't working"
                        colors={colors}
                        onPress={() => Alert.alert('Report a Problem', 'Thank you for your feedback! Report feature coming soon.')}
                    />
                    <HelpItem
                        icon="chatbubble-outline"
                        label="Feedback"
                        description="Share your thoughts and suggestions"
                        colors={colors}
                        onPress={() => Alert.alert('Feedback', 'Feedback feature coming soon!')}
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
        paddingTop: 24,
        paddingBottom: 40,
    },
    section: {
        marginHorizontal: 16,
        borderRadius: 16,
        overflow: 'hidden',
    },
    helpItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
    },
    helpIconBg: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    helpContent: {
        flex: 1,
        marginLeft: 12,
    },
    helpLabel: {
        fontSize: 15,
        fontWeight: '500',
    },
    helpDesc: {
        fontSize: 12,
        marginTop: 2,
    },
});
