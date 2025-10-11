import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native';

interface QuickExtendButtonProps {
  bookingId: string;
  vehicleName: string;
  currentEndDate: string;
  currentEndTime: string;
  style?: any;
}

export default function QuickExtendButton({ 
  bookingId, 
  vehicleName, 
  currentEndDate, 
  currentEndTime, 
  style 
}: QuickExtendButtonProps) {
  const router = useRouter();

  const handleExtendPress = () => {
    // Navigate to extend booking screen with parameters
    router.push({
      pathname: '/extend-booking',
      params: {
        bookingId,
        vehicleName,
        currentEndDate,
        currentEndTime,
      }
    } as any);
  };

  return (
    <TouchableOpacity style={[styles.container, style]} onPress={handleExtendPress}>
      <LinearGradient
        colors={[Colors.primary.teal, Colors.accent.blue]}
        style={styles.gradient}
      >
        <Ionicons name="time" size={16} color={Colors.text.white} />
        <Text style={styles.text}>Extend Booking</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
    minWidth: 120,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.white,
  },
});