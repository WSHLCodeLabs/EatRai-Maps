import { CrowdLevelBadge } from '@/components/CrowdLevelBadge';
import { NeonGlow } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { Restaurant } from '@/data/restaurants-data';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Animated,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface RandomPickerModalProps {
    visible: boolean;
    availableRestaurants: Restaurant[];
    distance: (lat: number, lng: number) => string;
    onClose: () => void;
    onNavigate: (restaurant: Restaurant) => void;
}

export function RandomPickerModal({
    visible,
    availableRestaurants,
    distance,
    onClose,
    onNavigate,
}: RandomPickerModalProps) {
    const { colors } = useTheme();
    const [pickedRestaurant, setPickedRestaurant] = useState<Restaurant | null>(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const [displayName, setDisplayName] = useState('');
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const resultFadeAnim = useRef(new Animated.Value(0)).current;
    const resultScaleAnim = useRef(new Animated.Value(0.5)).current;

    const spin = useCallback(() => {
        if (availableRestaurants.length === 0) return;

        setIsSpinning(true);
        setPickedRestaurant(null);
        resultFadeAnim.setValue(0);
        resultScaleAnim.setValue(0.5);

        // Slot-machine style: cycle through names rapidly then slow down
        const totalCycles = 15 + Math.floor(Math.random() * 10);
        const picked = availableRestaurants[Math.floor(Math.random() * availableRestaurants.length)];
        let cycle = 0;

        const interval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * availableRestaurants.length);
            setDisplayName(availableRestaurants[randomIndex].name);
            cycle++;

            if (cycle >= totalCycles) {
                clearInterval(interval);
                // Show final result
                setDisplayName(picked.name);
                setPickedRestaurant(picked);
                setIsSpinning(false);

                // Animate result card in
                Animated.parallel([
                    Animated.spring(resultScaleAnim, {
                        toValue: 1,
                        friction: 6,
                        tension: 100,
                        useNativeDriver: true,
                    }),
                    Animated.timing(resultFadeAnim, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                ]).start();
            }
        }, Math.max(50, 50 + cycle * 8)); // Gradually slow down
    }, [availableRestaurants, resultFadeAnim, resultScaleAnim]);

    // Auto spin on open
    useEffect(() => {
        if (visible && availableRestaurants.length > 0) {
            // Reset state
            setPickedRestaurant(null);
            setDisplayName('');

            // Animate modal in
            fadeAnim.setValue(0);
            scaleAnim.setValue(0.8);
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 8,
                    tension: 100,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                // Start spinning after modal appears
                setTimeout(spin, 200);
            });
        }
    }, [visible]);

    if (availableRestaurants.length === 0 && visible) {
        return (
            <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
                <View style={styles.backdrop}>
                    <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <Ionicons name="sad-outline" size={48} color={colors.textSecondary} />
                        <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
                            ไม่มีร้านที่ว่าง
                        </Text>
                        <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                            ร้านอาหารทุกร้านอยู่ในสถานะแน่น ลองใหม่ภายหลังนะ
                        </Text>
                        <TouchableOpacity
                            style={[styles.closeBtn, { borderColor: colors.border }]}
                            onPress={onClose}
                        >
                            <Text style={{ color: colors.textPrimary, fontWeight: '600' }}>ปิด</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }

    return (
        <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
            <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
                <Animated.View
                    style={[
                        styles.card,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.accent + '40',
                            transform: [{ scale: scaleAnim }],
                        },
                    ]}
                >
                    {/* Close Button */}
                    <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
                        <Ionicons name="close" size={24} color={colors.textSecondary} />
                    </TouchableOpacity>

                    {/* Header */}
                    <View style={styles.header}>
                        <View style={[styles.diceCircle, NeonGlow, { backgroundColor: colors.accent }]}>
                            <Ionicons name="dice" size={32} color="#0D0D0D" />
                        </View>
                        <Text style={[styles.title, { color: colors.textPrimary }]}>
                            สุ่มร้านอาหาร
                        </Text>
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                            เฉพาะร้านที่มีที่ว่าง ({availableRestaurants.length} ร้าน)
                        </Text>
                    </View>

                    {/* Spinning Name Display */}
                    <View style={[styles.slotContainer, { borderColor: colors.border, backgroundColor: colors.background }]}>
                        <Text
                            style={[
                                styles.slotText,
                                {
                                    color: isSpinning ? colors.textSecondary : colors.accent,
                                    fontSize: isSpinning ? 18 : 22,
                                },
                            ]}
                            numberOfLines={1}
                        >
                            {displayName || '...'}
                        </Text>
                    </View>

                    {/* Result Card (appears after spin) */}
                    {pickedRestaurant && (
                        <Animated.View
                            style={[
                                styles.resultCard,
                                {
                                    backgroundColor: colors.background,
                                    borderColor: colors.border,
                                    opacity: resultFadeAnim,
                                    transform: [{ scale: resultScaleAnim }],
                                },
                            ]}
                        >
                            {/* Restaurant Image */}
                            <View style={styles.resultImageContainer}>
                                {pickedRestaurant.imageUrl ? (
                                    <Image
                                        source={
                                            typeof pickedRestaurant.imageUrl === 'string'
                                                ? { uri: pickedRestaurant.imageUrl }
                                                : pickedRestaurant.imageUrl
                                        }
                                        style={styles.resultImage}
                                        contentFit="cover"
                                    />
                                ) : (
                                    <View style={[styles.resultImage, { backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center' }]}>
                                        <Ionicons name="restaurant" size={28} color={colors.textSecondary} />
                                    </View>
                                )}
                            </View>

                            {/* Restaurant Info */}
                            <View style={styles.resultInfo}>
                                <Text style={[styles.resultName, { color: colors.textPrimary }]} numberOfLines={1}>
                                    {pickedRestaurant.name}
                                </Text>
                                <Text style={[styles.resultDetails, { color: colors.textSecondary }]}>
                                    {pickedRestaurant.cuisine} • {distance(pickedRestaurant.latitude, pickedRestaurant.longitude)}
                                </Text>
                                <View style={styles.resultMeta}>
                                    <Ionicons name="star" size={14} color={colors.accent} />
                                    <Text style={[styles.resultRating, { color: colors.textPrimary }]}>
                                        {pickedRestaurant.rating.toFixed(1)}
                                    </Text>
                                    <CrowdLevelBadge level={pickedRestaurant.crowdLevel} size="small" />
                                </View>
                            </View>
                        </Animated.View>
                    )}

                    {/* Action Buttons */}
                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={[styles.spinBtn, { borderColor: colors.accent }]}
                            onPress={spin}
                            disabled={isSpinning}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="dice" size={20} color={colors.accent} />
                            <Text style={[styles.spinBtnText, { color: colors.accent }]}>
                                สุ่มอีกครั้ง
                            </Text>
                        </TouchableOpacity>

                        {pickedRestaurant && (
                            <TouchableOpacity
                                style={[styles.navBtn, { backgroundColor: colors.accent }]}
                                onPress={() => onNavigate(pickedRestaurant)}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.navBtnText}>ดูรายละเอียด</Text>
                                <Ionicons name="arrow-forward" size={18} color="#0D0D0D" />
                            </TouchableOpacity>
                        )}
                    </View>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    card: {
        width: '100%',
        maxWidth: 380,
        borderRadius: 20,
        padding: 24,
        borderWidth: 1,
        shadowColor: '#7CEB00',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    closeIcon: {
        position: 'absolute',
        top: 14,
        right: 14,
        zIndex: 10,
        padding: 4,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    diceCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 13,
        marginTop: 4,
    },
    slotContainer: {
        borderWidth: 1,
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        minHeight: 56,
    },
    slotText: {
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    resultCard: {
        flexDirection: 'row',
        borderRadius: 12,
        borderWidth: 1,
        overflow: 'hidden',
        marginBottom: 20,
    },
    resultImageContainer: {
        width: 90,
        height: 90,
    },
    resultImage: {
        width: '100%',
        height: '100%',
    },
    resultInfo: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
    },
    resultName: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 2,
    },
    resultDetails: {
        fontSize: 12,
        marginBottom: 6,
    },
    resultMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    resultRating: {
        fontSize: 13,
        fontWeight: '600',
        marginRight: 6,
    },
    actions: {
        flexDirection: 'row',
        gap: 10,
    },
    spinBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1.5,
    },
    spinBtnText: {
        fontSize: 15,
        fontWeight: '700',
    },
    navBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 14,
        borderRadius: 12,
    },
    navBtnText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0D0D0D',
    },
    emptyCard: {
        borderRadius: 20,
        padding: 32,
        alignItems: 'center',
        borderWidth: 1,
        gap: 12,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    emptySubtitle: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
    },
    closeBtn: {
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 10,
        borderWidth: 1,
        marginTop: 8,
    },
});
