import {
    calculateCrowdLevelWeighted,
    CrowdLevel,
    CrowdReport,
    INITIAL_RESTAURANTS,
    Restaurant,
} from '@/data/restaurants-data';
import { supabase } from '@/lib/supabase';
import * as Location from 'expo-location';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Alert, Platform, ToastAndroid } from 'react-native';

const REFRESH_INTERVAL = 2 * 60 * 1000; // 2 minutes — shared data needs faster refresh
const PROXIMITY_RADIUS = 500; // 500 meters

interface RestaurantContextType {
    restaurants: Restaurant[];
    reportCrowdLevel: (restaurantId: string, level: CrowdLevel) => void;
    getRestaurantById: (id: string) => Restaurant | undefined;
    isLoading: boolean;
    userLocation: Location.LocationObject | null;
    checkProximity: (restaurantLat: number, restaurantLng: number) => Promise<boolean>;
    lastRefresh: Date | null;
    calculateDistanceToRestaurant: (restaurantLat: number, restaurantLng: number) => string;
    refreshCrowdData: () => Promise<void>;
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
    const R = 6371e3;
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

    // Load data on mount and start auto-refresh
    useEffect(() => {
        fetchCrowdData();
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

            const location = await Location.getCurrentPositionAsync({});
            setUserLocation(location);

            Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.Balanced,
                    timeInterval: 30000,
                    distanceInterval: 50,
                },
                (location) => {
                    setUserLocation(location);
                }
            );
        } catch (error) {
            console.error('Failed to get location:', error);
        }
    };

    // Auto-refresh crowd data every 2 minutes
    const startAutoRefresh = () => {
        refreshIntervalRef.current = setInterval(() => {
            fetchCrowdData();
        }, REFRESH_INTERVAL);
    };

    // Fetch crowd reports from Supabase (only last 30 minutes)
    const fetchCrowdData = async () => {
        try {
            const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();

            const { data: reports, error } = await supabase
                .from('crowd_reports')
                .select('*')
                .gte('created_at', thirtyMinutesAgo)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Failed to fetch crowd data:', error.message);
                return;
            }

            // Group reports by restaurant_id
            const reportsByRestaurant: Record<string, CrowdReport[]> = {};
            for (const report of (reports || []) as CrowdReport[]) {
                if (!reportsByRestaurant[report.restaurant_id]) {
                    reportsByRestaurant[report.restaurant_id] = [];
                }
                reportsByRestaurant[report.restaurant_id].push(report);
            }

            // Update restaurants with weighted crowd levels
            setRestaurants(prevRestaurants =>
                prevRestaurants.map(restaurant => {
                    const restaurantReports = reportsByRestaurant[restaurant.id] || [];
                    const crowdLevel = calculateCrowdLevelWeighted(restaurantReports);

                    // Count reports for display
                    const crowdReports = {
                        quiet: restaurantReports.filter(r => r.crowd_level === 'Quiet').length,
                        moderate: restaurantReports.filter(r => r.crowd_level === 'Moderate').length,
                        busy: restaurantReports.filter(r => r.crowd_level === 'Busy').length,
                    };

                    return {
                        ...restaurant,
                        crowdReports,
                        crowdLevel,
                    };
                })
            );

            setLastRefresh(new Date());
        } catch (error) {
            console.error('Failed to fetch crowd data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Refresh crowd data (exposed for manual refresh)
    const refreshCrowdData = async () => {
        console.log('🔄 Refreshing crowd data...');
        await fetchCrowdData();
        showToast('📊 Crowd data refreshed');
    };

    // Check if user is within proximity to report
    const checkProximity = useCallback(async (restaurantLat: number, restaurantLng: number): Promise<boolean> => {
        try {
            let location = userLocation;

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

    // Report crowd level — INSERT into Supabase
    const reportCrowdLevel = useCallback(async (restaurantId: string, level: CrowdLevel) => {
        try {
            const { error } = await supabase
                .from('crowd_reports')
                .insert({
                    restaurant_id: restaurantId,
                    crowd_level: level,
                });

            if (error) {
                console.error('Failed to submit report:', error.message);
                showToast('❌ Failed to submit report');
                return;
            }

            showToast('Thanks for your report! 🙏');

            // Refresh data to reflect new report
            await fetchCrowdData();
        } catch (error) {
            console.error('Failed to report crowd level:', error);
            showToast('❌ Failed to submit report');
        }
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
                refreshCrowdData,
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
