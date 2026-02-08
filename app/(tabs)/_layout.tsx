import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

import { Colors } from '@/constants/theme';
import { RestaurantProvider } from '@/context/RestaurantContext';

export default function TabLayout() {
  return (
    <RestaurantProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.neonGreen,
          tabBarInactiveTintColor: Colors.textSecondary,
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabBarLabel,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'MAP',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'location' : 'location-outline'}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="restaurants"
          options={{
            title: 'RESTAURANTS',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'restaurant' : 'restaurant-outline'}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'PROFILE',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'person' : 'person-outline'}
                size={24}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </RestaurantProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.deepBlack,
    borderTopWidth: 0,
    elevation: 0,
    height: 85,
    paddingTop: 8,
    paddingBottom: 24,
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
