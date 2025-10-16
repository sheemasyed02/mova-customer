import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface RatePromptProps {
  visible: boolean;
  bookingId: string;
  vehicleName: string;
  ownerName: string;
  vehicleImage?: string;
  onDismiss: () => void;
  onRate: () => void;
}

export default function RatePromptCard({ 
  visible, 
  bookingId, 
  vehicleName, 
  ownerName, 
  vehicleImage,
  onDismiss, 
  onRate 
}: RatePromptProps) {
  const router = useRouter();

  if (!visible) return null;

  const handleRateNow = () => {
    onRate();
    router.push({
      pathname: '/rate-review' as any,
      params: {
        bookingId,
        vehicleName,
        ownerName,
        vehicleImage: vehicleImage || '',
      }
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primary.teal, Colors.accent.blue]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <TouchableOpacity style={styles.dismissButton} onPress={onDismiss}>
            <Ionicons name="close" size={20} color="#ffffff" />
          </TouchableOpacity>
          
          <View style={styles.iconContainer}>
            <Ionicons name="star" size={32} color="#FFD700" />
          </View>
          
          <Text style={styles.title}>Trip Completed!</Text>
          <Text style={styles.subtitle}>
            How was your experience with {vehicleName}?
          </Text>
          
          <View style={styles.incentive}>
            <Ionicons name="gift" size={16} color="#ffffff" />
            <Text style={styles.incentiveText}>Get ₹100 off your next booking</Text>
          </View>
          
          <View style={styles.actions}>
            <TouchableOpacity style={styles.laterButton} onPress={onDismiss}>
              <Text style={styles.laterText}>Maybe Later</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.rateButton} onPress={handleRateNow}>
              <Text style={styles.rateText}>Rate Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  gradient: {
    padding: 20,
  },
  content: {
    alignItems: 'center',
    position: 'relative',
  },
  dismissButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 16,
  },
  incentive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 20,
  },
  incentiveText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  laterButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    alignItems: 'center',
  },
  laterText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
  rateButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    alignItems: 'center',
  },
  rateText: {
    fontSize: 14,
    color: Colors.primary.teal,
    fontWeight: '600',
  },
});