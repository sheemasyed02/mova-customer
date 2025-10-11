/**
 * EXTEND BOOKING SCREEN
 * 
 * Navigation Routes:
 * - From Trip Details Screen: "Extend Booking" button → /extend-booking
 * - From My Trips Screen: "Extend Booking" button (ongoing trips) → /extend-booking
 * - From Notification: Deep link → /extend-booking?bookingId=MOV-12345
 * - From QuickExtendButton Component: Any screen → /extend-booking
 * 
 * Functionality:
 * - Add more time to ongoing booking
 * - Real-time availability checking
 * - Dynamic pricing calculation
 * - Owner approval workflow
 * - Integrated payment system
 * - Multiple extension support (up to 30 days total)
 * 
 * Key Features:
 * - Date/Time picker with validation
 * - Availability status with alternative dates
 * - Detailed cost breakdown with GST
 * - Instant vs Manual approval flow
 * - Payment method selection
 * - Success confirmation with updated booking details
 */

import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Modal,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface ExtendBookingData {
  bookingId: string;
  vehicleName: string;
  currentEndDate: string;
  currentEndTime: string;
  maxExtensionDays: number;
  basePricePerDay: number;
  hourlyRate: number;
  isAutoApproval: boolean;
  currentKmLimit: number;
  additionalKmPerDay: number;
}

export default function ExtendBookingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Extract parameters from route
  const routeBookingId = params.bookingId as string;
  const routeVehicleName = params.vehicleName as string;
  const routeCurrentEndDate = params.currentEndDate as string;
  const routeCurrentEndTime = params.currentEndTime as string;
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityResult, setAvailabilityResult] = useState<'available' | 'unavailable' | null>(null);
  const [nextAvailableDate, setNextAvailableDate] = useState<string>('');
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Sample booking data - in real app, this would come from props or API
  const bookingData: ExtendBookingData = {
    bookingId: routeBookingId || 'MOV-12345',
    vehicleName: routeVehicleName || 'Hyundai Creta',
    currentEndDate: routeCurrentEndDate || '17 Jan',
    currentEndTime: routeCurrentEndTime || '10:00 AM',
    maxExtensionDays: 30,
    basePricePerDay: 2500,
    hourlyRate: 125,
    isAutoApproval: true,
    currentKmLimit: 150,
    additionalKmPerDay: 300,
  };

  const currentEndDateTime = new Date('2025-01-17T10:00:00');
  
  useEffect(() => {
    // Set initial date to current end date + 1 day
    const initialDate = new Date(currentEndDateTime);
    initialDate.setDate(initialDate.getDate() + 1);
    setSelectedDate(initialDate);
    setSelectedTime(initialDate);
  }, []);

  const calculateExtension = () => {
    const timeDiff = selectedDate.getTime() - currentEndDateTime.getTime();
    const totalHours = Math.ceil(timeDiff / (1000 * 3600));
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    
    return { days, hours, totalHours };
  };

  const calculateCosts = () => {
    const { days, hours } = calculateExtension();
    const baseRental = days * bookingData.basePricePerDay;
    const proratedCharge = hours * bookingData.hourlyRate;
    const subtotal = baseRental + proratedCharge;
    const gst = Math.round(subtotal * 0.18);
    const total = subtotal + gst;
    
    return { baseRental, proratedCharge, subtotal, gst, total };
  };

  const checkAvailability = () => {
    setIsCheckingAvailability(true);
    setAvailabilityResult(null);
    
    // Simulate API call
    setTimeout(() => {
      const isAvailable = Math.random() > 0.3; // 70% chance available
      setAvailabilityResult(isAvailable ? 'available' : 'unavailable');
      
      if (!isAvailable) {
        // Set next available date (2 days earlier)
        const nextDate = new Date(selectedDate);
        nextDate.setDate(nextDate.getDate() - 2);
        setNextAvailableDate(nextDate.toDateString());
      }
      
      setIsCheckingAvailability(false);
    }, 2000);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      checkAvailability();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [selectedDate, selectedTime]);

  const handleExtensionRequest = () => {
    if (availabilityResult === 'available') {
      if (bookingData.isAutoApproval) {
        setShowPaymentMethods(true);
      } else {
        Alert.alert(
          'Extension Requested',
          'Your extension request has been sent to the owner. You\'ll receive a response within 2 hours.',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      }
    }
  };

  const handlePayment = () => {
    if (!selectedPaymentMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }
    
    // Simulate payment processing
    setTimeout(() => {
      setShowPaymentMethods(false);
      setShowSuccessModal(true);
    }, 1500);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
      </TouchableOpacity>
      
      <Text style={styles.headerTitle}>Extend Booking</Text>
      
      <View style={styles.headerSpacer} />
    </View>
  );

  const renderCurrentBookingInfo = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name="car" size={20} color={Colors.primary.teal} />
        <Text style={styles.sectionTitle}>Current Booking</Text>
      </View>
      
      <View style={styles.bookingInfoCard}>
        <View style={styles.bookingRow}>
          <Text style={styles.bookingLabel}>Vehicle:</Text>
          <Text style={styles.bookingValue}>{bookingData.vehicleName}</Text>
        </View>
        
        <View style={styles.bookingRow}>
          <Text style={styles.bookingLabel}>Current end time:</Text>
          <Text style={styles.bookingValue}>{bookingData.currentEndDate}, {bookingData.currentEndTime}</Text>
        </View>
        
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>You want to keep the car longer?</Text>
        </View>
      </View>
    </View>
  );

  const renderDateTimePicker = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name="calendar" size={20} color={Colors.primary.teal} />
        <Text style={styles.sectionTitle}>Select New Return Date & Time</Text>
      </View>
      
      <View style={styles.dateTimeContainer}>
        <TouchableOpacity 
          style={styles.dateTimeButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Ionicons name="calendar-outline" size={16} color={Colors.primary.teal} />
          <Text style={styles.dateTimeText}>{selectedDate.toDateString()}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.dateTimeButton}
          onPress={() => setShowTimePicker(true)}
        >
          <Ionicons name="time-outline" size={16} color={Colors.primary.teal} />
          <Text style={styles.dateTimeText}>{selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
        </TouchableOpacity>
      </View>
      
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          minimumDate={new Date()}
          maximumDate={new Date(Date.now() + bookingData.maxExtensionDays * 24 * 60 * 60 * 1000)}
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) setSelectedDate(date);
          }}
        />
      )}
      
      {showTimePicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          display="default"
          onChange={(event, time) => {
            setShowTimePicker(false);
            if (time) setSelectedTime(time);
          }}
        />
      )}
    </View>
  );

  const renderExtendedDuration = () => {
    const { days, hours } = calculateExtension();
    const totalDuration = days + Math.ceil(hours / 24);
    
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="time" size={20} color={Colors.primary.teal} />
          <Text style={styles.sectionTitle}>Extended Duration</Text>
        </View>
        
        <View style={styles.durationCard}>
          <View style={styles.durationRow}>
            <Text style={styles.durationLabel}>Additional days:</Text>
            <Text style={styles.durationValue}>{days}</Text>
          </View>
          
          <View style={styles.durationRow}>
            <Text style={styles.durationLabel}>Additional hours:</Text>
            <Text style={styles.durationValue}>{hours}</Text>
          </View>
          
          <View style={[styles.durationRow, styles.totalDurationRow]}>
            <Text style={styles.totalDurationLabel}>New total duration:</Text>
            <Text style={styles.totalDurationValue}>{totalDuration} days, {hours} hours</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderAvailabilityCheck = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name="checkmark-circle" size={20} color={Colors.primary.teal} />
        <Text style={styles.sectionTitle}>Availability Check</Text>
      </View>
      
      <View style={styles.availabilityCard}>
        {isCheckingAvailability ? (
          <View style={styles.checkingContainer}>
            <ActivityIndicator size="small" color={Colors.primary.teal} />
            <Text style={styles.checkingText}>Checking vehicle availability...</Text>
          </View>
        ) : availabilityResult === 'available' ? (
          <View style={styles.availableContainer}>
            <Ionicons name="checkmark-circle" size={24} color={Colors.functional.success} />
            <Text style={styles.availableText}>Vehicle available!</Text>
          </View>
        ) : availabilityResult === 'unavailable' ? (
          <View style={styles.unavailableContainer}>
            <Ionicons name="close-circle" size={24} color={Colors.functional.error} />
            <View style={styles.unavailableTextContainer}>
              <Text style={styles.unavailableText}>Vehicle booked after your current period</Text>
              <Text style={styles.nextAvailableText}>Next available return: {nextAvailableDate}</Text>
              <TouchableOpacity style={styles.alternateButton}>
                <Text style={styles.alternateButtonText}>Extend until {nextAvailableDate}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );

  const renderAdditionalCharges = () => {
    const { baseRental, proratedCharge, gst, total } = calculateCosts();
    const { days, hours } = calculateExtension();
    
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="calculator" size={20} color={Colors.primary.teal} />
          <Text style={styles.sectionTitle}>Additional Charges</Text>
        </View>
        
        <View style={styles.chargesCard}>
          <View style={styles.chargeRow}>
            <Text style={styles.chargeLabel}>Base rental ({days} extra days):</Text>
            <Text style={styles.chargeValue}>₹{baseRental.toLocaleString()}</Text>
          </View>
          
          <View style={styles.chargeRow}>
            <Text style={styles.chargeLabel}>Pro-rated charge ({hours} hours):</Text>
            <Text style={styles.chargeValue}>₹{proratedCharge.toLocaleString()}</Text>
          </View>
          
          <View style={styles.chargeDivider} />
          
          <View style={styles.chargeRow}>
            <Text style={styles.chargeLabel}>Total extension cost:</Text>
            <Text style={styles.chargeValue}>₹{(baseRental + proratedCharge).toLocaleString()}</Text>
          </View>
          
          <View style={styles.chargeRow}>
            <Text style={styles.chargeLabel}>GST (18%):</Text>
            <Text style={styles.chargeValue}>₹{gst.toLocaleString()}</Text>
          </View>
          
          <View style={[styles.chargeRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total to pay:</Text>
            <Text style={styles.totalValue}>₹{total.toLocaleString()}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderOwnerApproval = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name="person-circle" size={20} color={Colors.primary.teal} />
        <Text style={styles.sectionTitle}>Owner Approval</Text>
      </View>
      
      <View style={styles.approvalCard}>
        {bookingData.isAutoApproval ? (
          <View style={styles.instantApproval}>
            <Ionicons name="flash" size={20} color={Colors.functional.success} />
            <Text style={styles.instantText}>Instant confirmation</Text>
          </View>
        ) : (
          <View style={styles.manualApproval}>
            <Ionicons name="hourglass" size={20} color={Colors.functional.warning} />
            <View>
              <Text style={styles.approvalText}>Requires owner approval</Text>
              <Text style={styles.responseTime}>Estimated response time: Within 2 hours</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );

  const renderImportantNotes = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name="information-circle" size={20} color={Colors.primary.teal} />
        <Text style={styles.sectionTitle}>Important Notes</Text>
      </View>
      
      <View style={styles.notesCard}>
        <View style={styles.noteItem}>
          <Ionicons name="speedometer" size={16} color={Colors.text.secondary} />
          <Text style={styles.noteText}>Current KM limit increases: +{bookingData.additionalKmPerDay} km/day</Text>
        </View>
        
        <View style={styles.noteItem}>
          <Ionicons name="document-text" size={16} color={Colors.text.secondary} />
          <Text style={styles.noteText}>All terms remain same</Text>
        </View>
        
        <View style={styles.noteItem}>
          <Ionicons name="repeat" size={16} color={Colors.text.secondary} />
          <Text style={styles.noteText}>Can extend multiple times</Text>
        </View>
        
        <View style={styles.noteItem}>
          <Ionicons name="calendar" size={16} color={Colors.text.secondary} />
          <Text style={styles.noteText}>Maximum {bookingData.maxExtensionDays} days total</Text>
        </View>
      </View>
    </View>
  );

  const renderActionButtons = () => (
    <View style={styles.actionSection}>
      <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[
          styles.primaryButton, 
          availabilityResult !== 'available' && styles.disabledButton
        ]}
        onPress={handleExtensionRequest}
        disabled={availabilityResult !== 'available'}
      >
        <LinearGradient
          colors={availabilityResult === 'available' 
            ? [Colors.primary.teal, Colors.accent.blue] 
            : ['#E5E7EB', '#E5E7EB']
          }
          style={styles.primaryGradient}
        >
          <Text style={[
            styles.primaryButtonText,
            availabilityResult !== 'available' && styles.disabledButtonText
          ]}>
            {bookingData.isAutoApproval ? 'Confirm & Pay' : 'Request Extension'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderPaymentModal = () => (
    <Modal
      visible={showPaymentMethods}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowPaymentMethods(false)}
    >
      <SafeAreaView style={styles.paymentModal}>
        <View style={styles.paymentHeader}>
          <TouchableOpacity onPress={() => setShowPaymentMethods(false)}>
            <Text style={styles.paymentCancel}>Cancel</Text>
          </TouchableOpacity>
          
          <Text style={styles.paymentTitle}>Payment Method</Text>
          
          <View style={styles.headerSpacer} />
        </View>
        
        <ScrollView style={styles.paymentContent}>
          <View style={styles.paymentSummary}>
            <Text style={styles.paymentSummaryTitle}>Payment Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Extension cost:</Text>
              <Text style={styles.summaryValue}>₹{calculateCosts().total.toLocaleString()}</Text>
            </View>
            <Text style={styles.securityNote}>Security deposit: No additional hold</Text>
          </View>
          
          <View style={styles.paymentMethods}>
            {['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Wallet'].map((method) => (
              <TouchableOpacity
                key={method}
                style={[
                  styles.paymentMethod,
                  selectedPaymentMethod === method && styles.selectedPaymentMethod
                ]}
                onPress={() => setSelectedPaymentMethod(method)}
              >
                <Ionicons 
                  name={
                    method === 'UPI' ? 'phone-portrait' :
                    method.includes('Card') ? 'card' :
                    method === 'Net Banking' ? 'globe' : 'wallet'
                  } 
                  size={20} 
                  color={selectedPaymentMethod === method ? Colors.primary.teal : Colors.text.secondary} 
                />
                <Text style={[
                  styles.paymentMethodText,
                  selectedPaymentMethod === method && styles.selectedPaymentMethodText
                ]}>
                  {method}
                </Text>
                <View style={[
                  styles.radioButton,
                  selectedPaymentMethod === method && styles.selectedRadioButton
                ]}>
                  {selectedPaymentMethod === method && <View style={styles.radioButtonInner} />}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        
        <View style={styles.paymentActions}>
          <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
            <LinearGradient
              colors={[Colors.primary.teal, Colors.accent.blue]}
              style={styles.payGradient}
            >
              <Text style={styles.payButtonText}>Pay ₹{calculateCosts().total.toLocaleString()}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );

  const renderSuccessModal = () => (
    <Modal
      visible={showSuccessModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowSuccessModal(false)}
    >
      <View style={styles.successOverlay}>
        <View style={styles.successModal}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={64} color={Colors.functional.success} />
          </View>
          
          <Text style={styles.successTitle}>Extension Confirmed!</Text>
          <Text style={styles.successMessage}>
            Your booking has been extended successfully. New return time: {selectedDate.toDateString()} at {selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          
          {!bookingData.isAutoApproval && (
            <Text style={styles.ownerNotified}>Owner has been notified</Text>
          )}
          
          <TouchableOpacity 
            style={styles.successButton}
            onPress={() => {
              setShowSuccessModal(false);
              router.back();
            }}
          >
            <LinearGradient
              colors={[Colors.primary.teal, Colors.accent.blue]}
              style={styles.successGradient}
            >
              <Text style={styles.successButtonText}>View Updated Booking</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {renderHeader()}
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderCurrentBookingInfo()}
        {renderDateTimePicker()}
        {renderExtendedDuration()}
        {renderAvailabilityCheck()}
        {renderAdditionalCharges()}
        {renderOwnerApproval()}
        {renderImportantNotes()}
        
        <View style={styles.bottomSpacing} />
      </ScrollView>
      
      {renderActionButtons()}
      {renderPaymentModal()}
      {renderSuccessModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.lightGrey,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: Colors.background.white,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  bookingInfoCard: {
    backgroundColor: Colors.background.white,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  bookingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bookingLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  bookingValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  questionContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary.teal,
  },
  questionText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary.teal,
    textAlign: 'center',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  dateTimeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.background.white,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dateTimeText: {
    fontSize: 14,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  durationCard: {
    backgroundColor: Colors.background.white,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  durationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  durationLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  durationValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  totalDurationRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  totalDurationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  totalDurationValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary.teal,
  },
  availabilityCard: {
    backgroundColor: Colors.background.white,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  checkingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkingText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  availableContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  availableText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.functional.success,
  },
  unavailableContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  unavailableTextContainer: {
    flex: 1,
  },
  unavailableText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.functional.error,
    marginBottom: 4,
  },
  nextAvailableText: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  alternateButton: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  alternateButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.functional.warning,
  },
  chargesCard: {
    backgroundColor: Colors.background.white,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chargeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  chargeLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  chargeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  chargeDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 8,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
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
  approvalCard: {
    backgroundColor: Colors.background.white,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  instantApproval: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  instantText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.functional.success,
  },
  manualApproval: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  approvalText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.functional.warning,
  },
  responseTime: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  notesCard: {
    backgroundColor: Colors.background.white,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  noteText: {
    fontSize: 12,
    color: Colors.text.secondary,
    flex: 1,
  },
  actionSection: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.background.white,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: Colors.background.lightGrey,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  primaryButton: {
    flex: 2,
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
    color: Colors.text.white,
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledButtonText: {
    color: Colors.text.secondary,
  },
  bottomSpacing: {
    height: 20,
  },
  paymentModal: {
    flex: 1,
    backgroundColor: Colors.background.white,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  paymentCancel: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  paymentContent: {
    flex: 1,
    padding: 20,
  },
  paymentSummary: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  paymentSummaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary.teal,
  },
  securityNote: {
    fontSize: 12,
    color: Colors.functional.success,
    marginTop: 4,
  },
  paymentMethods: {
    gap: 12,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.background.white,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedPaymentMethod: {
    borderColor: Colors.primary.teal,
    backgroundColor: '#F0F9FF',
  },
  paymentMethodText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text.primary,
  },
  selectedPaymentMethodText: {
    color: Colors.primary.teal,
    fontWeight: '600',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedRadioButton: {
    borderColor: Colors.primary.teal,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary.teal,
  },
  paymentActions: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  payButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  payGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.white,
  },
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  successModal: {
    backgroundColor: Colors.background.white,
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  successIcon: {
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  ownerNotified: {
    fontSize: 12,
    color: Colors.functional.success,
    marginBottom: 24,
    textAlign: 'center',
  },
  successButton: {
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  successGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  successButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.white,
  },
});