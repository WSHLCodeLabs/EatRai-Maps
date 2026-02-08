import {
    calculateCrowdLevel,
    CrowdLevel,
    INITIAL_RESTAURANTS,
    Restaurant,
} from '@/data/restaurants-data';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Alert, Platform, ToastAndroid } from 'react-native';

const STORAGE_KEY = '@eatrai_crowd_reports';
const REFRESH_INTERVAL = 15 * 60 * 1000; // 15 minutes in milliseconds
const PROXIMITY_RADIUS = 500; // 500 meters - must be within this distance to report

interface RestaurantContextType {
    restaurants: Restaurant[];
    reportCrowdLevel: (restaurantId: string, level: CrowdLevel) => void;
    getRestaurantById: (id: string) => Restaurant | undefined;
    isLoading: boolean;
    userLocation: Location.LocationObject | null;
    checkProximity: (restaurantLat: number, restaurantLng: number) => Promise<boolean>;
    lastRefresh: Date | null;
    calculateDistanceToRestaurant: (restaurantLat: number, restaurantLng: number) => string;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

// Toast helper that works on both platforms
const showToast = (message: string) => {
    if (Platform.OS === 'android') {
        ToastAndroid.showWithGravity(message, ToastAndroid.SHORT, ToastAndroid.BOTTOM);
    } else {
        Alert.alert('', message, [{ text: 'OK' }], { cancelable: true });
    }
};

// Calculate distance between two points in meters (Haversine formula)
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
};

interface RestaurantProviderProps {
    children: ReactNode;
}

export function RestaurantProvider({ children }: RestaurantProviderProps) {
    const [restaurants, setRestaurants] = useState<Restaurant[]>(INITIAL_RESTAURANTS);
    const [isLoading, setIsLoading] = useState(true);
    const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
    const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
    const refreshIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Load persisted data on mount and start auto-refresh
    useEffect(() => {
        loadPersistedData();
        startLocationTracking();
        startAutoRefresh();

        return () => {
            if (refreshIntervalRef.current) {
                clearInterval(refreshIntervalRef.current);
            }
        };
    }, []);

    // Start location tracking
    const startLocationTracking = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Location permission denied');
                return;
            }

            // Get initial location
            const location = await Location.getCurrentPositionAsync({});
            setUserLocation(location);

            // Watch for location updates
            Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.Balanced,
                    timeInterval: 30000, // Update every 30 seconds
                    distanceInterval: 50, // Or when moved 50 meters
                },
                (location) => {
                    setUserLocation(location);
                }
            );
        } catch (error) {
            console.error('Failed to get location:', error);
        }
    };

    // Auto-refresh crowd data every 15 minutes
    const startAutoRefresh = () => {
        refreshIntervalRef.current = setInterval(() => {
            refreshCrowdData();
        }, REFRESH_INTERVAL);
    };

    // Refresh crowd data (reset to base values or fetch from server)
    const refreshCrowdData = async () => {
        console.log('🔄 Refreshing crowd data...');

        // For now, we'll decay the reports slightly to simulate time-based decay
        setRestaurants(prevRestaurants =>
            prevRestaurants.map(restaurant => {
                const newReports = {
                    quiet: Math.max(0, Math.floor(restaurant.crowdReports.quiet * 0.8)),
                    moderate: Math.max(0, Math.floor(restaurant.crowdReports.moderate * 0.8)),
                    busy: Math.max(0, Math.floor(restaurant.crowdReports.busy * 0.8)),
                };
                return {
                    ...restaurant,
                    crowdReports: newReports,
                    crowdLevel: calculateCrowdLevel(newReports),
                };
            })
        );

        setLastRefresh(new Date());
        showToast('📊 Crowd data refreshed');
    };

    const loadPersistedData = async () => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                const crowdData: Record<string, { crowdReports: Restaurant['crowdReports'] }> = JSON.parse(stored);

                setRestaurants(prevRestaurants =>
                    prevRestaurants.map(restaurant => {
                        const savedData = crowdData[restaurant.id];
                        if (savedData) {
                            return {
                                ...restaurant,
                                crowdReports: savedData.crowdReports,
                                crowdLevel: calculateCrowdLevel(savedData.crowdReports),
                            };
                        }
                        return restaurant;
                    })
                );
            }
            setLastRefresh(new Date());
        } catch (error) {
            console.error('Failed to load crowd data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const persistData = async (updatedRestaurants: Restaurant[]) => {
        try {
            const crowdData: Record<string, { crowdReports: Restaurant['crowdReports'] }> = {};
            updatedRestaurants.forEach(r => {
                crowdData[r.id] = { crowdReports: r.crowdReports };
            });
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(crowdData));
        } catch (error) {
            console.error('Failed to persist crowd data:', error);
        }
    };

    // Check if user is within proximity to report
    const checkProximity = useCallback(async (restaurantLat: number, restaurantLng: number): Promise<boolean> => {
        try {
            let location = userLocation;

            // Get fresh location if not available
            if (!location) {
                location = await Location.getCurrentPositionAsync({});
                setUserLocation(location);
            }

            if (!location) {
                showToast('❌ Unable to get your location');
                return false;
            }

            const distance = calculateDistance(
                location.coords.latitude,
                location.coords.longitude,
                restaurantLat,
                restaurantLng
            );

            if (distance > PROXIMITY_RADIUS) {
                showToast(`📍 You need to be within ${PROXIMITY_RADIUS}m of the restaurant to report`);
                return false;
            }

            return true;
        } catch (error) {
            console.error('Failed to check proximity:', error);
            showToast('❌ Unable to verify location');
            return false;
        }
    }, [userLocation]);

    const reportCrowdLevel = useCallback((restaurantId: string, level: CrowdLevel) => {
        setRestaurants(prevRestaurants => {
            const updated = prevRestaurants.map(restaurant => {
                if (restaurant.id === restaurantId) {
                    const newReports = { ...restaurant.crowdReports };

                    // Increment the corresponding count
                    if (level === 'Quiet') newReports.quiet += 1;
                    else if (level === 'Moderate') newReports.moderate += 1;
                    else if (level === 'Busy') newReports.busy += 1;

                    return {
                        ...restaurant,
                        crowdReports: newReports,
                        crowdLevel: calculateCrowdLevel(newReports),
                    };
                }
                return restaurant;
            });

            // Persist the updated data
            persistData(updated);

            return updated;
        });

        // Show confirmation toast
        showToast('Thanks for your report! 🙏');
    }, []);

    const getRestaurantById = useCallback((id: string) => {
        return restaurants.find(r => r.id === id);
    }, [restaurants]);

    // Calculate distance from user to restaurant and format it
    const calculateDistanceToRestaurant = useCallback((restaurantLat: number, restaurantLng: number): string => {
        if (!userLocation) {
            return '-- m';
        }

        const distance = calculateDistance(
            userLocation.coords.latitude,
            userLocation.coords.longitude,
            restaurantLat,
            restaurantLng
        );

        // Format distance
        if (distance < 1000) {
            return `${Math.round(distance)} m`;
        } else {
            return `${(distance / 1000).toFixed(1)} km`;
        }
    }, [userLocation]);

    return (
        <RestaurantContext.Provider
            value={{
                restaurants,
                reportCrowdLevel,
                getRestaurantById,
                isLoading,
                userLocation,
                checkProximity,
                lastRefresh,
                calculateDistanceToRestaurant,
            }}
        >
            {children}
        </RestaurantContext.Provider>
    );
}

export function useRestaurants() {
    const context = useContext(RestaurantContext);
    if (context === undefined) {
        throw new Error('useRestaurants must be used within a RestaurantProvider');
    }
    return context;
}
