import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ 
      headerShown: false,
      title: "",
      headerTitle: "",
    }}>
      <Stack.Screen name="splash" options={{ headerShown: false, title: "", headerTitle: "" }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false, title: "", headerTitle: "" }} />
      <Stack.Screen name="language-selection" options={{ headerShown: false, title: "", headerTitle: "" }} />
      <Stack.Screen name="location-permission" options={{ headerShown: false, title: "", headerTitle: "" }} />
      <Stack.Screen name="notification-permission" options={{ headerShown: false, title: "", headerTitle: "" }} />
    </Stack>
  );
}