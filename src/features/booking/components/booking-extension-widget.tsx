import { Colors } from '@/src/shared/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface BookingExtensionWidgetProps { 
  bookingId: string;
  vehicleName: string;
  currentEndDate: string;
  currentEndTime: string;
  isOngoing?: boolean;
  style?: any;
}

export default function BookingExtensionWidget({ 
  bookingId, 
  vehicleName, 
  currentEndDate, 
  currentEndTime, 
  isOngoing = false,
  style 
}: BookingExtensionWidgetProps) {
  const router = useRouter();

  if (!isOngoing) return null;

  const handleExtendPress = () => {
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
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Ionicons name="time-outline" size={20} color={Colors.primary.teal} />
        <Text style={styles.title}>Extend Your Trip</Text>
      </View>
      
      <Text style={styles.subtitle}>
        Current return: {currentEndDate} at {currentEndTime}
      </Text>
      
      <Text style={styles.description}>
        Want to keep the {vehicleName} longer? Extend your booking based on availability.
      </Text>
      
      <TouchableOpacity style={styles.button} onPress={handleExtendPress}>
        <Text style={styles.buttonText}>Extend Booking</Text>
        <Ionicons name="chevron-forward" size={16} color={Colors.primary.teal} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0F2FE',
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background.white,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary.teal,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.teal,
  },
});
