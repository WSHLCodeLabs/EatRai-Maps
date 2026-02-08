import { CrowdLevelBadge } from '@/components/CrowdLevelBadge';
import { CardShadow, Colors } from '@/constants/theme';
import { useRestaurants } from '@/context/RestaurantContext';
import { CROWD_COLORS, CrowdLevel, Restaurant } from '@/data/restaurants-data';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
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
    const { reportCrowdLevel, checkProximity } = useRestaurants();
    const [isNearby, setIsNearby] = useState<boolean | null>(null);
    const [isChecking, setIsChecking] = useState(false);

    // Check proximity when modal opens
    useEffect(() => {
        if (visible && restaurant) {
            checkUserProximity();
        } else {
            setIsNearby(null);
            setIsChecking(false);
        }
    }, [visible, restaurant]);

    const checkUserProximity = async () => {
        if (!restaurant) return;

        setIsChecking(true);
        const nearby = await checkProximity(restaurant.latitude, restaurant.longitude);
        setIsNearby(nearby);
        setIsChecking(false);
    };

    if (!restaurant) return null;

    const handleReport = async (level: CrowdLevel) => {
        if (!isNearby) {
            // Re-check proximity before reporting
            const nearby = await checkProximity(restaurant.latitude, restaurant.longitude);
            if (!nearby) return;
        }

        reportCrowdLevel(restaurant.id, level);
        onClose();
    };

    const ReportButton = ({ level, icon }: { level: CrowdLevel; icon: string }) => {
        const color = CROWD_COLORS[level];
        const isDisabled = isChecking || !isNearby;

        return (
            <TouchableOpacity
                style={[
                    styles.reportButton,
                    {
                        borderColor: isDisabled ? Colors.mediumGray : color,
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
                <Ionicons name={icon as any} size={24} color={isDisabled ? Colors.textSecondary : color} />
                <Text style={[styles.reportButtonText, { color: isDisabled ? Colors.textSecondary : color }]}>{level}</Text>
                <Text style={styles.reportCount}>
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
                <Pressable style={[styles.modal, CardShadow]} onPress={e => e.stopPropagation()}>
                    {/* Close Button */}
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Ionicons name="close" size={24} color={Colors.textSecondary} />
                    </TouchableOpacity>

                    {/* Restaurant Header */}
                    <View style={styles.header}>
                        <View style={styles.imageContainer}>
                            {restaurant.imageUrl ? (
                                <Image source={{ uri: restaurant.imageUrl }} style={styles.image} contentFit="cover" />
                            ) : (
                                <View style={[styles.image, styles.imagePlaceholder]}>
                                    <Ionicons name="restaurant" size={24} color={Colors.textSecondary} />
                                </View>
                            )}
                        </View>
                        <View style={styles.headerInfo}>
                            <Text style={styles.name} numberOfLines={1}>{restaurant.name}</Text>
                            <Text style={styles.cuisine}>{restaurant.cuisine} • {restaurant.distance}</Text>
                            <View style={styles.ratingRow}>
                                <Ionicons name="star" size={14} color={Colors.neonGreen} />
                                <Text style={styles.rating}>{restaurant.rating.toFixed(1)}</Text>
                                <CrowdLevelBadge level={restaurant.crowdLevel} size="small" />
                            </View>
                        </View>
                    </View>

                    {/* Divider */}
                    <View style={styles.divider} />

                    {/* Proximity Status */}
                    {isChecking ? (
                        <View style={styles.proximityStatus}>
                            <ActivityIndicator size="small" color={Colors.neonGreen} />
                            <Text style={styles.proximityText}>Checking your location...</Text>
                        </View>
                    ) : isNearby === false ? (
                        <View style={styles.proximityStatus}>
                            <Ionicons name="location-outline" size={20} color="#FF6B6B" />
                            <Text style={[styles.proximityText, { color: '#FF6B6B' }]}>
                                You must be near this restaurant to report
                            </Text>
                        </View>
                    ) : isNearby === true ? (
                        <View style={styles.proximityStatus}>
                            <Ionicons name="checkmark-circle" size={20} color={Colors.neonGreen} />
                            <Text style={[styles.proximityText, { color: Colors.neonGreen }]}>
                                You're nearby! You can report.
                            </Text>
                        </View>
                    ) : null}

                    {/* Report Section */}
                    <Text style={styles.reportTitle}>Report Current Crowd Level</Text>
                    <Text style={styles.reportSubtitle}>Help others know how busy it is right now</Text>

                    {/* Report Buttons */}
                    <View style={styles.reportButtons}>
                        <ReportButton level="Quiet" icon="leaf" />
                        <ReportButton level="Moderate" icon="people" />
                        <ReportButton level="Busy" icon="flame" />
                    </View>

                    {/* Retry Button if not nearby */}
                    {isNearby === false && (
                        <TouchableOpacity style={styles.retryButton} onPress={checkUserProximity}>
                            <Ionicons name="refresh" size={16} color={Colors.neonGreen} />
                            <Text style={styles.retryText}>Retry Location Check</Text>
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
        backgroundColor: Colors.darkGray,
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: Colors.mediumGray,
    },
    closeButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.mediumGray,
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
        backgroundColor: Colors.mediumGray,
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
        color: Colors.textPrimary,
        marginBottom: 4,
    },
    cuisine: {
        fontSize: 13,
        color: Colors.textSecondary,
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
        color: Colors.textPrimary,
        marginRight: 8,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.mediumGray,
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
        backgroundColor: Colors.deepBlack,
        borderRadius: 10,
    },
    proximityText: {
        fontSize: 13,
        color: Colors.textSecondary,
    },
    reportTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.textPrimary,
        textAlign: 'center',
        marginBottom: 4,
    },
    reportSubtitle: {
        fontSize: 13,
        color: Colors.textSecondary,
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
        backgroundColor: Colors.deepBlack,
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
        color: Colors.textSecondary,
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
        color: Colors.neonGreen,
        fontWeight: '600',
    },
});
