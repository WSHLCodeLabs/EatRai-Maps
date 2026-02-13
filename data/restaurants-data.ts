/**
 * Real restaurant data near Kasetsart University, Kamphaeng Saen Campus
 * Coordinates from Google Maps - Kamphaeng Saen, Nakhon Pathom
 */

// Crowd level type
export type CrowdLevel = 'Quiet' | 'Moderate' | 'Busy';

// Crowd reports structure
export interface CrowdReports {
    quiet: number;
    moderate: number;
    busy: number;
}

export interface Restaurant {
    id: string;
    name: string;
    cuisine: string;
    distance: string;
    rating: number;
    tag: 'QUIET' | 'POPULAR' | 'BUSY' | 'NEW';
    imageUrl: string;
    latitude: number;
    longitude: number;
    crowdReports: CrowdReports;
    crowdLevel: CrowdLevel;
}

// Helper function to calculate crowd level based on reports
export function calculateCrowdLevel(reports: CrowdReports): CrowdLevel {
    const { quiet, moderate, busy } = reports;
    if (busy >= quiet && busy >= moderate) return 'Busy';
    if (moderate >= quiet && moderate > busy) return 'Moderate';
    return 'Quiet';
}

// Center point for KU Kamphaeng Saen Campus
export const KASETSART_KAMPHAENG_SAEN_REGION = {
    latitude: 14.0205,
    longitude: 99.9870,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
};

// Crowd level colors
export const CROWD_COLORS = {
    Quiet: '#7CEB00',    // Neon Green
    Moderate: '#FFD700', // Yellow
    Busy: '#FF5555',     // Red
};

// Real restaurants near KU Kamphaeng Saen Campus (coordinates from Google Maps)
export const INITIAL_RESTAURANTS: Restaurant[] = [
    {
        id: '1',
        name: 'กินเก่ง',
        cuisine: 'Thai Food',
        distance: '300 m',
        rating: 4.6,
        tag: 'POPULAR',
        imageUrl: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400',
        latitude: 14.017344401691004,
        longitude: 99.9927172382506,
        crowdReports: { quiet: 6, moderate: 3, busy: 1 },
        crowdLevel: 'Quiet',
    },
    {
        id: '2',
        name: 'เตี๋ยวยำติดปีก',
        cuisine: 'Thai Noodles',
        distance: '250 m',
        rating: 4.5,
        tag: 'POPULAR',
        imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
        latitude: 14.017632020102027,
        longitude: 99.99040176893497,
        crowdReports: { quiet: 4, moderate: 8, busy: 5 },
        crowdLevel: 'Moderate',
    },
    {
        id: '3',
        name: 'เต๋วเรือ',
        cuisine: 'Boat Noodles',
        distance: '400 m',
        rating: 4.4,
        tag: 'BUSY',
        imageUrl: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=400',
        latitude: 14.019612962264643,
        longitude: 99.99146330941517,
        crowdReports: { quiet: 2, moderate: 5, busy: 9 },
        crowdLevel: 'Busy',
    },
    {
        id: '4',
        name: 'ร้านเด็กเส้น',
        cuisine: 'Thai Noodles',
        distance: '350 m',
        rating: 4.3,
        tag: 'QUIET',
        imageUrl: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400',
        latitude: 14.019129897681074,
        longitude: 99.99177723837474,
        crowdReports: { quiet: 10, moderate: 4, busy: 2 },
        crowdLevel: 'Quiet',
    },
    {
        id: '5',
        name: 'ก๋วยเตี๋ยวเรือถูกปาก',
        cuisine: 'Boat Noodles',
        distance: '500 m',
        rating: 4.7,
        tag: 'POPULAR',
        imageUrl: 'https://images.unsplash.com/photo-1547928578-bca3e9c5a8f5?w=400',
        latitude: 14.021139507656049,
        longitude: 99.99178282908903,
        crowdReports: { quiet: 3, moderate: 7, busy: 6 },
        crowdLevel: 'Moderate',
    },
    {
        id: '6',
        name: 'โช ราเมน',
        cuisine: 'Japanese Ramen',
        distance: '200 m',
        rating: 4.5,
        tag: 'NEW',
        imageUrl: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=400',
        latitude: 14.022419178653173,
        longitude: 99.9893362094152,
        crowdReports: { quiet: 5, moderate: 6, busy: 4 },
        crowdLevel: 'Moderate',
    },
    {
        id: '7',
        name: 'ครัว 9 ไร่',
        cuisine: 'Thai Food',
        distance: '600 m',
        rating: 4.4,
        tag: 'QUIET',
        imageUrl: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400',
        latitude: 14.021960944522768,
        longitude: 99.98344601885749,
        crowdReports: { quiet: 12, moderate: 3, busy: 1 },
        crowdLevel: 'Quiet',
    },
    {
        id: '8',
        name: 'ร้านร่มไทร พี่ติ๊ด',
        cuisine: 'Thai Café',
        distance: '800 m',
        rating: 4.3,
        tag: 'QUIET',
        imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400',
        latitude: 14.025928085995977,
        longitude: 99.9748996002541,
        crowdReports: { quiet: 8, moderate: 4, busy: 2 },
        crowdLevel: 'Quiet',
    },
    {
        id: '9',
        name: 'เจ๊มะขิ่น',
        cuisine: 'Thai Food',
        distance: '450 m',
        rating: 4.5,
        tag: 'NEW',
        imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
        latitude: 14.0110154,
        longitude: 99.9958611,
        crowdReports: { quiet: 5, moderate: 3, busy: 1 },
        crowdLevel: 'Quiet',
    },
    {
        id: '10',
        name: 'เต้าหู้เย็นเป่าปิง',
        cuisine: 'Dessert',
        distance: '200 m',
        rating: 4.5,
        tag: 'NEW',
        imageUrl: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400',
        latitude: 14.0210961,
        longitude: 99.9919658,
        crowdReports: { quiet: 5, moderate: 3, busy: 1 },
        crowdLevel: 'Quiet',
    },
];

// Export for backward compatibility
export const RESTAURANTS = INITIAL_RESTAURANTS;
