import { Stack } from 'expo-router';

export default function BookingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="date-time-selection" />
      <Stack.Screen name="addons-extras" />
      <Stack.Screen name="review-confirm" />
      <Stack.Screen name="payment" />
      <Stack.Screen name="booking-confirmation" />
    </Stack>
  );
}