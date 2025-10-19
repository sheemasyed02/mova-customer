import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import LoadingScreen from '@/src/shared/components/ui/loading-screen';
import { useColorScheme } from '@/src/shared/hooks/use-color-scheme';

export {
    // Catch any errors thrown by the Layout component. 
    ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading starts from the splash screen
  initialRouteName: 'index',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Show custom loading screen while fonts are loading
  if (!loaded) {
    return <LoadingScreen />;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="splash" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="languageselection" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="otp-verification" options={{ headerShown: false }} />
        <Stack.Screen name="profile-setup" options={{ headerShown: false }} />
        <Stack.Screen name="home-permission" options={{ headerShown: false }} />
        <Stack.Screen name="notification-permission" options={{ headerShown: false }} />
        <Stack.Screen name="vehicle-inspection" options={{ headerShown: false }} />
        <Stack.Screen name="booking" options={{ headerShown: false }} />
        <Stack.Screen name="my-bookings" options={{ headerShown: false }} />
        <Stack.Screen name="booking-details" options={{ headerShown: false }} />
        <Stack.Screen name="rate-review" options={{ headerShown: false }} />
        <Stack.Screen name="inbox" options={{ headerShown: false }} />
        <Stack.Screen name="conversation" options={{ headerShown: false }} />
        <Stack.Screen name="chat/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="notifications-page" options={{ headerShown: false }} />
        <Stack.Screen name="edit-profile-page" options={{ headerShown: false }} />
        <Stack.Screen name="saved-addresses-page" options={{ headerShown: false }} />
        <Stack.Screen name="payment-methods-page" options={{ headerShown: false }} />
        <Stack.Screen name="vehicle-details-page" options={{ headerShown: false }} />
        <Stack.Screen name="favorites-page" options={{ headerShown: false }} />
        <Stack.Screen name="documents-page" options={{ headerShown: false }} />
        <Stack.Screen name="referral-page" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(features)" options={{ headerShown: false, title: "" }} />
        <Stack.Screen name="(main)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}
