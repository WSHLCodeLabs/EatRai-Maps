import { CrowdLevelBadge } from '@/components/CrowdLevelBadge';
import { useRestaurants } from '@/context/RestaurantContext';
import { useTheme } from '@/context/ThemeContext';
import { CROWD_COLORS, CrowdLevel, Restaurant } from '@/data/restaurants-data';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface CrowdReportModalProps {
    visible: boolean;
    restaurant: Restaurant | null;
    onClose: () => void;
}

export function CrowdReportModal({ visible, restaurant, onClose }: CrowdReportModalProps) {
    const { reportCrowdLevel, checkProximity, getCooldownRemaining } = useRestaurants();
    const { colors } = useTheme();
    const [isNearby, setIsNearby] = useState<boolean | null>(null);
    const [isChecking, setIsChecking] = useState(false);
    const [cooldownSeconds, setCooldownSeconds] = useState(0);
    const cooldownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Check proximity and cooldown when modal opens
    useEffect(() => {
        if (visible && restaurant) {
            checkUserProximity();
            checkCooldown();
        } else {
            setIsNearby(null);
            setIsChecking(false);
            setCooldownSeconds(0);
            if (cooldownTimerRef.current) {
                clearInterval(cooldownTimerRef.current);
                cooldownTimerRef.current = null;
            }
        }

        return () => {
            if (cooldownTimerRef.current) {
                clearInterval(cooldownTimerRef.current);
                cooldownTimerRef.current = null;
            }
        };
    }, [visible, restaurant]);

    const checkCooldown = async () => {
        if (!restaurant) return;
        const remaining = await getCooldownRemaining(restaurant.id);
        if (remaining > 0) {
            setCooldownSeconds(Math.ceil(remaining / 1000));
            startCooldownTimer();
        } else {
            setCooldownSeconds(0);
        }
    };

    const startCooldownTimer = () => {
        if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
        cooldownTimerRef.current = setInterval(() => {
            setCooldownSeconds(prev => {
                if (prev <= 1) {
                    if (cooldownTimerRef.current) {
                        clearInterval(cooldownTimerRef.current);
                        cooldownTimerRef.current = null;
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const formatCooldown = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const checkUserProximity = async () => {
        if (!restaurant) return;

        setIsChecking(true);
        const nearby = await checkProximity(restaurant.latitude, restaurant.longitude);
        setIsNearby(nearby);
        setIsChecking(false);
    };

    if (!restaurant) return null;

    const isCooldownActive = cooldownSeconds > 0;

    const handleReport = async (level: CrowdLevel) => {
        if (isCooldownActive) return;

        if (!isNearby) {
            // Re-check proximity before reporting
            const nearby = await checkProximity(restaurant.latitude, restaurant.longitude);
            if (!nearby) return;
        }

        await reportCrowdLevel(restaurant.id, level);
        onClose();
    };

    const ReportButton = ({ level, icon }: { level: CrowdLevel; icon: string }) => {
        const color = CROWD_COLORS[level];
        const isDisabled = isChecking || !isNearby || isCooldownActive;

        return (
            <TouchableOpacity
                style={[
                    styles.reportButton,
                    { backgroundColor: colors.background },
                    {
                        borderColor: isDisabled ? colors.border : color,
                        shadowColor: isDisabled ? 'transparent' : color,
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: isDisabled ? 0 : 0.5,
                        shadowRadius: 10,
                        elevation: isDisabled ? 0 : 4,
                        opacity: isDisabled ? 0.5 : 1,
                    },
                ]}
                onPress={() => handleReport(level)}
                activeOpacity={0.8}
                disabled={isDisabled}
            >
                <Ionicons name={icon as any} size={24} color={isDisabled ? colors.textSecondary : color} />
                <Text style={[styles.reportButtonText, { color: isDisabled ? colors.textSecondary : color }]}>{level}</Text>
                <Text style={[styles.reportCount, { color: colors.textSecondary }]}>
                    {restaurant.crowdReports[level.toLowerCase() as keyof typeof restaurant.crowdReports]} reports
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <Pressable style={[styles.modal, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={e => e.stopPropagation()}>
                    {/* Close Button */}
                    <TouchableOpacity style={[styles.closeButton, { backgroundColor: colors.border }]} onPress={onClose}>
                        <Ionicons name="close" size={24} color={colors.textSecondary} />
                    </TouchableOpacity>

                    {/* Restaurant Header */}
                    <View style={styles.header}>
                        <View style={styles.imageContainer}>
                            {restaurant.imageUrl ? (
                                <Image
                                    source={
                                        typeof restaurant.imageUrl === 'string'
                                            ? { uri: restaurant.imageUrl }
                                            : restaurant.imageUrl
                                    }
                                    style={styles.image}
                                    contentFit="cover"
                                />
                            ) : (
                                <View style={[styles.image, styles.imagePlaceholder, { backgroundColor: colors.border }]}>
                                    <Ionicons name="restaurant" size={24} color={colors.textSecondary} />
                                </View>
                            )}
                        </View>
                        <View style={styles.headerInfo}>
                            <Text style={[styles.name, { color: colors.textPrimary }]} numberOfLines={1}>{restaurant.name}</Text>
                            <Text style={[styles.cuisine, { color: colors.textSecondary }]}>{restaurant.cuisine} • {restaurant.distance}</Text>
                            <View style={styles.ratingRow}>
                                <Ionicons name="star" size={14} color={colors.accent} />
                                <Text style={[styles.rating, { color: colors.textPrimary }]}>{restaurant.rating.toFixed(1)}</Text>
                                <CrowdLevelBadge level={restaurant.crowdLevel} size="small" />
                            </View>
                        </View>
                    </View>

                    {/* Divider */}
                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    {/* Proximity Status */}
                    {isChecking ? (
                        <View style={[styles.proximityStatus, { backgroundColor: colors.background }]}>
                            <ActivityIndicator size="small" color={colors.accent} />
                            <Text style={[styles.proximityText, { color: colors.textSecondary }]}>Checking your location...</Text>
                        </View>
                    ) : isNearby === false ? (
                        <View style={[styles.proximityStatus, { backgroundColor: colors.background }]}>
                            <Ionicons name="location-outline" size={20} color="#FF6B6B" />
                            <Text style={[styles.proximityText, { color: '#FF6B6B' }]}>
                                You must be near this restaurant to report
                            </Text>
                        </View>
                    ) : isNearby === true ? (
                        <View style={[styles.proximityStatus, { backgroundColor: colors.background }]}>
                            <Ionicons name="checkmark-circle" size={20} color={colors.accent} />
                            <Text style={[styles.proximityText, { color: colors.accent }]}>
                                You're nearby! You can report.
                            </Text>
                        </View>
                    ) : null}

                    {/* Cooldown Status */}
                    {isCooldownActive && (
                        <View style={[styles.cooldownStatus, { backgroundColor: colors.background }]}>
                            <Ionicons name="time-outline" size={20} color="#FF9F43" />
                            <Text style={[styles.cooldownText, { color: '#FF9F43' }]}>
                                {`Wait ${formatCooldown(cooldownSeconds)} before reporting again`}
                            </Text>
                        </View>
                    )}

                    {/* Report Section */}
                    <Text style={[styles.reportTitle, { color: colors.textPrimary }]}>Report Current Crowd Level</Text>
                    <Text style={[styles.reportSubtitle, { color: colors.textSecondary }]}>Help others know how busy it is right now</Text>

                    {/* Report Buttons */}
                    <View style={styles.reportButtons}>
                        <ReportButton level="Quiet" icon="leaf" />
                        <ReportButton level="Moderate" icon="people" />
                        <ReportButton level="Busy" icon="flame" />
                    </View>

                    {/* Retry Button if not nearby */}
                    {isNearby === false && (
                        <TouchableOpacity style={styles.retryButton} onPress={checkUserProximity}>
                            <Ionicons name="refresh" size={16} color={colors.accent} />
                            <Text style={[styles.retryText, { color: colors.accent }]}>Retry Location Check</Text>
                        </TouchableOpacity>
                    )}
                </Pressable>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modal: {
        width: '100%',
        maxWidth: 360,
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
    },
    closeButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    header: {
        flexDirection: 'row',
        marginBottom: 16,
        marginTop: 8,
    },
    imageContainer: {
        width: 70,
        height: 70,
        borderRadius: 12,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    imagePlaceholder: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    name: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
    },
    cuisine: {
        fontSize: 13,
        marginBottom: 6,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    rating: {
        fontSize: 13,
        fontWeight: '600',
        marginRight: 8,
    },
    divider: {
        height: 1,
        marginVertical: 16,
    },
    proximityStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 16,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 10,
    },
    proximityText: {
        fontSize: 13,
    },
    cooldownStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 16,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 10,
    },
    cooldownText: {
        fontSize: 13,
        fontWeight: '600',
    },
    reportTitle: {
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 4,
    },
    reportSubtitle: {
        fontSize: 13,
        textAlign: 'center',
        marginBottom: 20,
    },
    reportButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    reportButton: {
        flex: 1,
        borderRadius: 12,
        padding: 14,
        alignItems: 'center',
        borderWidth: 2,
    },
    reportButtonText: {
        fontSize: 13,
        fontWeight: '700',
        marginTop: 8,
    },
    reportCount: {
        fontSize: 10,
        marginTop: 4,
    },
    retryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        marginTop: 16,
        paddingVertical: 10,
    },
    retryText: {
        fontSize: 13,
        fontWeight: '600',
    },
});
