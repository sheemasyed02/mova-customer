import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ 
      headerShown: false,
      title: "",
      headerTitle: "",
    }}>
      <Stack.Screen name="welcome" options={{ headerShown: false, title: "", headerTitle: "" }} />
      <Stack.Screen name="login" options={{ headerShown: false, title: "", headerTitle: "" }} />
      <Stack.Screen name="login-signup" options={{ headerShown: false, title: "", headerTitle: "" }} />
      <Stack.Screen name="otp-verification" options={{ headerShown: false, title: "", headerTitle: "" }} />
      <Stack.Screen name="profile-setup" options={{ headerShown: false, title: "", headerTitle: "" }} />
    </Stack>
  );
}