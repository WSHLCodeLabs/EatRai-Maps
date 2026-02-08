import { Colors, SubtleGlow } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface NavigationButtonProps {
    latitude: number;
    longitude: number;
    destinationName: string;
    size?: 'small' | 'medium' | 'large';
    variant?: 'icon' | 'full';
}

interface MapApp {
    name: string;
    icon: keyof typeof Ionicons.glyphMap;
    scheme: string;
    webUrl: string;
}

const MAP_APPS: MapApp[] = [
    {
        name: 'Google Maps',
        icon: 'map',
        scheme: 'google.navigation:q=',
        webUrl: 'https://www.google.com/maps/dir/?api=1&destination=',
    },
    {
        name: 'Apple Maps',
        icon: 'navigate',
        scheme: 'maps://app?daddr=',
        webUrl: 'https://maps.apple.com/?daddr=',
    },
    {
        name: 'Waze',
        icon: 'car',
        scheme: 'waze://?ll=',
        webUrl: 'https://waze.com/ul?ll=',
    },
];

export function NavigationButton({
    latitude,
    longitude,
    destinationName,
    size = 'medium',
    variant = 'icon',
}: NavigationButtonProps) {
    const [showModal, setShowModal] = useState(false);

    const sizeConfig = {
        small: { button: 32, icon: 16 },
        medium: { button: 44, icon: 20 },
        large: { button: 56, icon: 24 },
    };

    const config = sizeConfig[size];

    const openNavigation = async (app: MapApp) => {
        setShowModal(false);

        const coords = `${latitude},${longitude}`;
        let url = '';

        if (app.name === 'Google Maps') {
            url = Platform.select({
                ios: `comgooglemaps://?daddr=${coords}&directionsmode=driving`,
                android: `${app.scheme}${coords}`,
                default: `${app.webUrl}${coords}`,
            }) || '';
        } else if (app.name === 'Apple Maps') {
            url = `${app.scheme}${coords}`;
        } else if (app.name === 'Waze') {
            url = `${app.scheme}${coords}&navigate=yes`;
        }

        try {
            const canOpen = await Linking.canOpenURL(url);
            if (canOpen) {
                await Linking.openURL(url);
            } else {
                // Fallback to web URL
                const webUrl = `${app.webUrl}${coords}`;
                await Linking.openURL(webUrl);
            }
        } catch (error) {
            Alert.alert(
                'Navigation Error',
                `Unable to open ${app.name}. Please make sure the app is installed.`
            );
        }
    };

    const handlePress = () => {
        if (Platform.OS === 'web') {
            // On web, just open Google Maps
            openNavigation(MAP_APPS[0]);
        } else {
            setShowModal(true);
        }
    };

    return (
        <>
            <TouchableOpacity
                style={[
                    styles.button,
                    variant === 'full' && styles.fullButton,
                    {
                        width: variant === 'icon' ? config.button : undefined,
                        height: config.button,
                        borderRadius: config.button / 2,
                    },
                    SubtleGlow,
                ]}
                onPress={handlePress}
                activeOpacity={0.8}
            >
                <Ionicons name="navigate" size={config.icon} color={Colors.deepBlack} />
                {variant === 'full' && (
                    <Text style={styles.buttonText}>Navigate</Text>
                )}
            </TouchableOpacity>

            <Modal
                visible={showModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowModal(false)}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setShowModal(false)}
                >
                    <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
                        <Text style={styles.modalTitle}>Navigate to</Text>
                        <Text style={styles.modalSubtitle} numberOfLines={1}>
                            {destinationName}
                        </Text>

                        <View style={styles.appList}>
                            {MAP_APPS.map((app) => (
                                // Skip Apple Maps on Android
                                (Platform.OS !== 'android' || app.name !== 'Apple Maps') && (
                                    <TouchableOpacity
                                        key={app.name}
                                        style={styles.appItem}
                                        onPress={() => openNavigation(app)}
                                        activeOpacity={0.7}
                                    >
                                        <View style={styles.appIcon}>
                                            <Ionicons
                                                name={app.icon}
                                                size={24}
                                                color={Colors.neonGreen}
                                            />
                                        </View>
                                        <Text style={styles.appName}>{app.name}</Text>
                                        <Ionicons
                                            name="chevron-forward"
                                            size={20}
                                            color={Colors.textSecondary}
                                        />
                                    </TouchableOpacity>
                                )
                            ))}
                        </View>

                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => setShowModal(false)}
                        >
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </Pressable>
                </Pressable>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.neonGreen,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    fullButton: {
        paddingHorizontal: 20,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.deepBlack,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: Colors.darkGray,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.textPrimary,
        textAlign: 'center',
    },
    modalSubtitle: {
        fontSize: 14,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginTop: 4,
        marginBottom: 24,
    },
    appList: {
        gap: 8,
    },
    appItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.mediumGray,
        borderRadius: 16,
        padding: 16,
    },
    appIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: Colors.darkGray,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    appName: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        color: Colors.textPrimary,
    },
    cancelButton: {
        marginTop: 16,
        padding: 16,
        alignItems: 'center',
    },
    cancelText: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.textSecondary,
    },
});
