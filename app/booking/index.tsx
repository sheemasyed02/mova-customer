import AddonsExtras from '@/app/booking/addons-extras';
import BookingConfirmation from '@/app/booking/booking-confirmation';
import DateTimeSelection from '@/app/booking/date-time-selection';
import Payment from '@/app/booking/payment';
import ReviewConfirm from '@/app/booking/review-confirm';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Dimensions,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface BookingData {
  vehicle: {
    id: string;
    name: string;
    image: string;
    pricePerDay: number;
    location: string;
  };
  pickup: {
    date: Date | null;
    time: string;
    location: string;
    delivery: boolean;
    deliveryAddress?: string;
  };
  return: {
    date: Date | null;
    time: string;
    location: string;
  };
  addons: {
    delivery: boolean;
    driver: boolean;
    enhancedCoverage: boolean;
    childSeat: number;
    gps: boolean;
    phoneHolder: boolean;
    firstAidKit: boolean;
    prepaidFuel: boolean;
  };
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
  payment: {
    method: string;
    details: any;
  } | null;
}

export default function BookingFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    vehicle: {
      id: '1',
      name: 'Hyundai Creta 2023',
      image: '',
      pricePerDay: 2500,
      location: 'MG Road, Bangalore',
    },
    pickup: {
      date: null,
      time: '',
      location: 'MG Road, Bangalore',
      delivery: false,
    },
    return: {
      date: null,
      time: '',
      location: 'MG Road, Bangalore',
    },
    addons: {
      delivery: false,
      driver: false,
      enhancedCoverage: false,
      childSeat: 0,
      gps: false,
      phoneHolder: false,
      firstAidKit: false,
      prepaidFuel: false,
    },
    pricing: {
      baseRental: 5000,
      addonsTotal: 0,
      platformFee: 200,
      gst: 0,
      total: 0,
      securityDeposit: 5000,
    },
    coupon: null,
    payment: null,
  });

  const steps = [
    { number: 1, title: 'Date & Time', completed: currentStep > 1 },
    { number: 2, title: 'Add-ons', completed: currentStep > 2 },
    { number: 3, title: 'Review', completed: currentStep > 3 },
    { number: 4, title: 'Payment', completed: currentStep > 4 },
    { number: 5, title: 'Confirm', completed: currentStep > 5 },
  ];

  const updateBookingData = (updates: Partial<BookingData>) => {
    setBookingData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {steps.map((step, index) => (
        <View key={step.number} style={styles.stepContainer}>
          <View style={styles.stepRow}>
            <View
              style={[
                styles.stepCircle,
                currentStep === step.number && styles.stepCircleActive,
                step.completed && styles.stepCircleCompleted,
              ]}
            >
              {step.completed ? (
                <Ionicons name="checkmark" size={14} color="#ffffff" />
              ) : (
                <Text
                  style={[
                    styles.stepNumber,
                    currentStep === step.number && styles.stepNumberActive,
                  ]}
                >
                  {step.number}
                </Text>
              )}
            </View>
            
            {index < steps.length - 1 && (
              <View
                style={[
                  styles.stepConnector,
                  step.completed && styles.stepConnectorCompleted,
                ]}
              />
            )}
          </View>
          
          <Text
            style={[
              styles.stepTitle,
              currentStep === step.number && styles.stepTitleActive,
              step.completed && styles.stepTitleCompleted,
            ]}
          >
            {step.title}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <DateTimeSelection
            bookingData={bookingData}
            updateBookingData={updateBookingData}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <AddonsExtras
            bookingData={bookingData}
            updateBookingData={updateBookingData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <ReviewConfirm
            bookingData={bookingData}
            updateBookingData={updateBookingData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 4:
        return (
          <Payment
            bookingData={bookingData}
            updateBookingData={updateBookingData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 5:
        return (
          <BookingConfirmation
            bookingData={bookingData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          {currentStep > 1 && currentStep < 5 && (
            <TouchableOpacity style={styles.backButton} onPress={prevStep}>
              <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
            </TouchableOpacity>
          )}
          
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>
              {currentStep === 1 && 'Select Pickup & Return'}
              {currentStep === 2 && 'Enhance Your Trip'}
              {currentStep === 3 && 'Review Your Booking'}
              {currentStep === 4 && 'Payment'}
              {currentStep === 5 && 'Booking Confirmed!'}
            </Text>
          </View>
          
          {currentStep < 5 && <View style={styles.headerSpacer} />}
        </View>

        {/* Step Indicator */}
        {currentStep < 5 && renderStepIndicator()}

        {/* Current Step Content */}
        {renderCurrentStep()}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  headerSpacer: {
    width: 40,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#F9FAFB',
  },
  stepContainer: {
    flex: 1,
    alignItems: 'center',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    marginBottom: 8,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleActive: {
    backgroundColor: Colors.primary.teal,
  },
  stepCircleCompleted: {
    backgroundColor: Colors.functional.success,
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  stepNumberActive: {
    color: '#ffffff',
  },
  stepConnector: {
    flex: 1,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginLeft: 8,
  },
  stepConnectorCompleted: {
    backgroundColor: Colors.functional.success,
  },
  stepTitle: {
    fontSize: 12,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  stepTitleActive: {
    color: Colors.primary.teal,
    fontWeight: '600',
  },
  stepTitleCompleted: {
    color: Colors.functional.success,
    fontWeight: '500',
  },
});