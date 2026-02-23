import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function MyReviewsScreen() {
    const router = useRouter();
    const { colors } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>My Reviews</Text>
                <View style={styles.headerRight} />
            </View>

            {/* Empty State */}
            <View style={styles.emptyContainer}>
                <View style={[styles.emptyIcon, { backgroundColor: colors.card }]}>
                    <Ionicons name="star-outline" size={48} color={colors.accent} />
                </View>
                <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No Reviews Yet</Text>
                <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                    Share your dining experience! Your reviews help others discover great food.
                </Text>
                <TouchableOpacity
                    style={[styles.writeButton, { backgroundColor: colors.accent }]}
                    onPress={() => router.replace('/(tabs)/restaurants')}
                    activeOpacity={0.7}
                >
                    <Ionicons name="create-outline" size={20} color="#0D0D0D" />
                    <Text style={styles.writeButtonText}>Browse Restaurants</Text>
                </TouchableOpacity>
            </View>
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
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    emptyIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 32,
    },
    writeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        gap: 8,
    },
    writeButtonText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0D0D0D',
    },
});
