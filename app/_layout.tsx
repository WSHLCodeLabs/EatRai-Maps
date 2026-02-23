import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { RestaurantProvider } from '@/context/RestaurantContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootNavigator() {
  const { isDarkMode } = useTheme();

  return (
    <NavThemeProvider value={isDarkMode ? DarkTheme : DefaultTheme}>
      <RestaurantProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="signup" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          <Stack.Screen name="restaurant-detail" options={{ headerShown: false }} />
          <Stack.Screen name="saved-places" options={{ headerShown: false }} />
          <Stack.Screen name="recent-searches" options={{ headerShown: false }} />
          <Stack.Screen name="my-reviews" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ headerShown: false }} />
          <Stack.Screen name="notifications" options={{ headerShown: false }} />
          <Stack.Screen name="help-support" options={{ headerShown: false }} />
          <Stack.Screen name="about" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      </RestaurantProvider>
    </NavThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootNavigator />
    </ThemeProvider>
  );
}
