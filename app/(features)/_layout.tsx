import { Stack } from 'expo-router';

export default function FeaturesLayout() {
  return (
    <Stack screenOptions={{ 
      headerShown: false,
      title: "",
      headerTitle: "",
    }}>
      <Stack.Screen name="onboarding" options={{ headerShown: false, title: "", headerTitle: "" }} />
      <Stack.Screen name="authentication" options={{ headerShown: false, title: "", headerTitle: "" }} />
      <Stack.Screen name="profile" options={{ headerShown: false, title: "", headerTitle: "" }} />
      <Stack.Screen name="booking" options={{ headerShown: false, title: "", headerTitle: "" }} />
      <Stack.Screen name="messaging" options={{ headerShown: false, title: "", headerTitle: "" }} />
      <Stack.Screen name="notifications" options={{ headerShown: false, title: "", headerTitle: "" }} />
      <Stack.Screen name="vehicles" options={{ headerShown: false, title: "", headerTitle: "" }} />
      <Stack.Screen name="search" options={{ headerShown: false, title: "", headerTitle: "" }} />
    </Stack>
  );
}