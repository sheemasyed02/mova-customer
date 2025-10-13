import { Colors } from '@/constants/Colors';
import { useScrollContext } from '@/contexts/ScrollContext';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface BookingData {
  vehicle: any;
  pickup: any;
  return: any;
  addons: any;
  pricing: {
    baseRental: number;
    addonsTotal: number;
    platformFee: number;
    gst: number;
    total: number;
    securityDeposit: number;
  };
  coupon: {
    code: string;
    discount: number;
  } | null;
  payment: any;
}

interface Props {
  bookingData: BookingData;
}

export default function BookingConfirmation({ bookingData }: Props) {
  const router = useRouter();
  const [scaleAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [bookingId] = useState('MOVA' + Math.random().toString().substring(2, 8).toUpperCase());

  // Scroll detection for animated tab bar
  const { scrollDirection, onScroll, cleanup } = useScrollDirection(8);
  const { updateScrollDirection } = useScrollContext();
  
  // Update scroll context when scroll direction changes
  React.useEffect(() => {
    updateScrollDirection(scrollDirection);
  }, [scrollDirection, updateScrollDirection]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  useEffect(() => {
    // Success animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const getFinalTotal = () => {
    const discount = bookingData.coupon?.discount || 0;
    return Math.max(0, bookingData.pricing.total - discount);
  };

  const getPickupDateTime = () => {
    const date = bookingData.pickup.date?.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    const time = bookingData.pickup.time || '10:00 AM';
    return `${date} at ${time}`;
  };

  const getReturnDateTime = () => {
    const date = bookingData.return.date?.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    const time = bookingData.return.time || '10:00 AM';
    return `${date} at ${time}`;
  };

  const renderSuccessHeader = () => (
    <View style={styles.successHeader}>
      <Animated.View 
        style={[
          styles.successIcon,
          { transform: [{ scale: scaleAnim }] }
        ]}
      >
        <LinearGradient
          colors={[Colors.functional.success, '#22C55E']}
          style={styles.successGradient}
        >
          <Ionicons name="checkmark" size={40} color="#ffffff" />
        </LinearGradient>
      </Animated.View>
      
      <Animated.View 
        style={[
          styles.successText,
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <Text style={styles.successTitle}>Booking Confirmed!</Text>
        <Text style={styles.successSubtitle}>
          Your car rental is confirmed. Get ready for your trip!
        </Text>
      </Animated.View>
    </View>
  );

  const renderBookingDetails = () => (
    <View style={styles.detailsCard}>
      <View style={styles.detailsHeader}>
        <Text style={styles.detailsTitle}>Booking Details</Text>
        <View style={styles.bookingIdContainer}>
          <Text style={styles.bookingIdLabel}>Booking ID</Text>
          <Text style={styles.bookingId}>{bookingId}</Text>
        </View>
      </View>
      
      <View style={styles.vehicleSection}>
        <Image 
          source={{ uri: bookingData.vehicle.image }} 
          style={styles.vehicleImage}
        />
        <View style={styles.vehicleInfo}>
          <Text style={styles.vehicleName}>{bookingData.vehicle.name}</Text>
          <Text style={styles.vehicleType}>{bookingData.vehicle.type}</Text>
          <View style={styles.vehicleFeatures}>
            <View style={styles.feature}>
              <Ionicons name="people" size={14} color={Colors.text.secondary} />
              <Text style={styles.featureText}>{bookingData.vehicle.seats} seats</Text>
            </View>
            <View style={styles.feature}>
              <Ionicons name="car" size={14} color={Colors.text.secondary} />
              <Text style={styles.featureText}>{bookingData.vehicle.transmission}</Text>
            </View>
            <View style={styles.feature}>
              <Ionicons name="speedometer" size={14} color={Colors.text.secondary} />
              <Text style={styles.featureText}>{bookingData.vehicle.fuelType}</Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.separator} />
      
      <View style={styles.tripDetails}>
        <View style={styles.tripSection}>
          <Text style={styles.tripSectionTitle}>Pickup</Text>
          <View style={styles.tripInfo}>
            <Ionicons name="location" size={16} color={Colors.primary.teal} />
            <View style={styles.tripInfoText}>
              <Text style={styles.tripLocation}>{bookingData.pickup.location}</Text>
              <Text style={styles.tripDateTime}>{getPickupDateTime()}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.tripConnector}>
          <View style={styles.connectorLine} />
          <Ionicons name="car" size={16} color={Colors.primary.teal} />
          <View style={styles.connectorLine} />
        </View>
        
        <View style={styles.tripSection}>
          <Text style={styles.tripSectionTitle}>Return</Text>
          <View style={styles.tripInfo}>
            <Ionicons name="location" size={16} color={Colors.accent.blue} />
            <View style={styles.tripInfoText}>
              <Text style={styles.tripLocation}>{bookingData.return.location}</Text>
              <Text style={styles.tripDateTime}>{getReturnDateTime()}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const renderPaymentSummary = () => (
    <View style={styles.paymentCard}>
      <Text style={styles.paymentTitle}>Payment Summary</Text>
      
      <View style={styles.paymentDetails}>
        <View style={styles.paymentRow}>
          <Text style={styles.paymentLabel}>Base rental:</Text>
          <Text style={styles.paymentValue}>₹{bookingData.pricing.baseRental.toLocaleString()}</Text>
        </View>
        
        {bookingData.pricing.addonsTotal > 0 && (
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Add-ons & extras:</Text>
            <Text style={styles.paymentValue}>₹{bookingData.pricing.addonsTotal.toLocaleString()}</Text>
          </View>
        )}
        
        <View style={styles.paymentRow}>
          <Text style={styles.paymentLabel}>Platform fee:</Text>
          <Text style={styles.paymentValue}>₹{bookingData.pricing.platformFee.toLocaleString()}</Text>
        </View>
        
        <View style={styles.paymentRow}>
          <Text style={styles.paymentLabel}>GST (18%):</Text>
          <Text style={styles.paymentValue}>₹{bookingData.pricing.gst.toLocaleString()}</Text>
        </View>
        
        {bookingData.coupon && (
          <View style={styles.paymentRow}>
            <Text style={[styles.paymentLabel, styles.discountLabel]}>
              Discount ({bookingData.coupon.code}):
            </Text>
            <Text style={[styles.paymentValue, styles.discountValue]}>
              -₹{bookingData.coupon.discount.toLocaleString()}
            </Text>
          </View>
        )}
        
        <View style={styles.separator} />
        
        <View style={styles.paymentRow}>
          <Text style={styles.totalLabel}>Total paid:</Text>
          <Text style={styles.totalValue}>₹{getFinalTotal().toLocaleString()}</Text>
        </View>
        
        <View style={styles.paymentRow}>
          <Text style={styles.paymentLabel}>Security deposit:</Text>
          <Text style={styles.securityDeposit}>₹{bookingData.pricing.securityDeposit.toLocaleString()}</Text>
        </View>
        <Text style={styles.securityNote}>
          (Will be refunded within 5-7 business days after return)
        </Text>
      </View>
      
      <View style={styles.paymentMethod}>
        <Ionicons name="card" size={16} color={Colors.text.secondary} />
        <Text style={styles.paymentMethodText}>
          Paid via {bookingData.payment.method}
        </Text>
        <View style={styles.paymentStatus}>
          <Ionicons name="checkmark-circle" size={16} color={Colors.functional.success} />
          <Text style={styles.paymentStatusText}>Completed</Text>
        </View>
      </View>
    </View>
  );

  const renderNextSteps = () => (
    <View style={styles.nextStepsCard}>
      <Text style={styles.nextStepsTitle}>What's next?</Text>
      
      <View style={styles.stepsList}>
        <View style={styles.step}>
          <View style={styles.stepIcon}>
            <Ionicons name="document-text" size={16} color={Colors.primary.teal} />
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Download your voucher</Text>
            <Text style={styles.stepDescription}>
              We've sent you a booking voucher via email. Keep it handy!
            </Text>
          </View>
        </View>
        
        <View style={styles.step}>
          <View style={styles.stepIcon}>
            <Ionicons name="call" size={16} color={Colors.primary.teal} />
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Owner will contact you</Text>
            <Text style={styles.stepDescription}>
              The vehicle owner will call you 24 hours before pickup
            </Text>
          </View>
        </View>
        
        <View style={styles.step}>
          <View style={styles.stepIcon}>
            <Ionicons name="id-card" size={16} color={Colors.primary.teal} />
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Bring required documents</Text>
            <Text style={styles.stepDescription}>
              Valid driving license, Aadhaar card, and credit card
            </Text>
          </View>
        </View>
        
        <View style={styles.step}>
          <View style={styles.stepIcon}>
            <Ionicons name="car" size={16} color={Colors.primary.teal} />
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Vehicle inspection</Text>
            <Text style={styles.stepDescription}>
              Do a quick inspection with the owner before taking the car
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderEmergencyContact = () => (
    <View style={styles.emergencyCard}>
      <View style={styles.emergencyHeader}>
        <Ionicons name="shield-checkmark" size={20} color="#F59E0B" />
        <Text style={styles.emergencyTitle}>Emergency Support</Text>
      </View>
      <Text style={styles.emergencyText}>
        Need help during your trip? Our 24/7 support team is here for you.
      </Text>
      <TouchableOpacity style={styles.emergencyButton}>
        <Ionicons name="call" size={16} color="#ffffff" />
        <Text style={styles.emergencyButtonText}>Call Support</Text>
      </TouchableOpacity>
    </View>
  );

  const renderActionButtons = () => (
    <View style={styles.actionButtons}>
      <TouchableOpacity style={styles.secondaryButton}>
        <Ionicons name="download" size={16} color={Colors.primary.teal} />
        <Text style={styles.secondaryButtonText}>Download Voucher</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.primaryButton}
        onPress={() => router.push('/(tabs)')}
      >
        <LinearGradient
          colors={[Colors.primary.teal, Colors.accent.blue]}
          style={styles.primaryGradient}
        >
          <Text style={styles.primaryButtonText}>Back to Home</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {renderSuccessHeader()}
        {renderBookingDetails()}
        {renderPaymentSummary()}
        {renderNextSteps()}
        {renderEmergencyContact()}
      </ScrollView>
      
      <View style={styles.bottomContainer}>
        {renderActionButtons()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  successHeader: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  successIcon: {
    marginBottom: 20,
  },
  successGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successText: {
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  detailsCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  bookingIdContainer: {
    alignItems: 'flex-end',
  },
  bookingIdLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  bookingId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary.teal,
  },
  vehicleSection: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  vehicleImage: {
    width: 80,
    height: 60,
    borderRadius: 8,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  vehicleType: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  vehicleFeatures: {
    flexDirection: 'row',
    gap: 16,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featureText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  tripDetails: {
    gap: 20,
  },
  tripSection: {
    gap: 8,
  },
  tripSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  tripInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  tripInfoText: {
    flex: 1,
  },
  tripLocation: {
    fontSize: 14,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  tripDateTime: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  tripConnector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 8,
  },
  connectorLine: {
    width: 20,
    height: 1,
    backgroundColor: '#D1D5DB',
  },
  paymentCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  paymentDetails: {
    gap: 8,
    marginBottom: 16,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  paymentValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  discountLabel: {
    color: Colors.functional.success,
  },
  discountValue: {
    color: Colors.functional.success,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary.teal,
  },
  securityDeposit: {
    fontSize: 14,
    fontWeight: '500',
    color: '#F59E0B',
  },
  securityNote: {
    fontSize: 11,
    color: Colors.text.secondary,
    fontStyle: 'italic',
    marginTop: 4,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  paymentMethodText: {
    fontSize: 14,
    color: Colors.text.secondary,
    flex: 1,
  },
  paymentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  paymentStatusText: {
    fontSize: 12,
    color: Colors.functional.success,
    fontWeight: '500',
  },
  nextStepsCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  nextStepsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  stepsList: {
    gap: 16,
  },
  step: {
    flexDirection: 'row',
    gap: 12,
  },
  stepIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#E0F2FE',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 12,
    color: Colors.text.secondary,
    lineHeight: 16,
  },
  emergencyCard: {
    backgroundColor: '#FFF7ED',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  emergencyText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F59E0B',
    paddingVertical: 12,
    borderRadius: 8,
  },
  emergencyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary.teal,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.teal,
  },
  primaryButton: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  primaryGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
});