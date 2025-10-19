import { Colors } from '@/src/shared/constants/Colors';
import { useScrollContext } from '@/src/shared/contexts/ScrollContext';
import { useScrollDirection } from '@/src/shared/hooks/useScrollDirection';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

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
  updateBookingData: (updates: Partial<BookingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Payment({ bookingData, updateBookingData, onNext, onBack }: Props) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [expandedSummary, setExpandedSummary] = useState(false);
  const [processing, setProcessing] = useState(false);
  
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
  
  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  
  // UPI state
  const [upiId, setUpiId] = useState('');
  
  // Net Banking state
  const [selectedBank, setSelectedBank] = useState('');

  const savedCards = [
    { id: '1', type: 'visa', lastFour: '1234', name: 'John Doe' },
    { id: '2', type: 'mastercard', lastFour: '5678', name: 'John Doe' },
  ];

  const banks = [
    'State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 
    'Kotak Mahindra Bank', 'Yes Bank', 'IndusInd Bank', 'Punjab National Bank'
  ];

  const wallets = [
    { name: 'Paytm', balance: 2500 },
    { name: 'PhonePe', balance: 0 },
    { name: 'Amazon Pay', balance: 1200 },
    { name: 'Mobikwik', balance: 0 },
  ];

  const getFinalTotal = () => {
    const discount = bookingData.coupon?.discount || 0;
    return Math.max(0, bookingData.pricing.total - discount);
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
    return formatted.substring(0, 19); // Max 16 digits + 3 spaces
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const getCardType = (number: string) => {
    const cleaned = number.replace(/\s/g, '');
    if (cleaned.startsWith('4')) return 'visa';
    if (cleaned.startsWith('5')) return 'mastercard';
    if (cleaned.startsWith('3')) return 'amex';
    if (cleaned.startsWith('6')) return 'rupay';
    return 'card';
  };

  const handlePayment = async () => {
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      updateBookingData({
        payment: {
          method: selectedPaymentMethod,
          amount: getFinalTotal(),
          status: 'completed',
        }
      });
      onNext();
    }, 3000);
  };

  const renderBookingSummary = () => (
    <View style={styles.summaryCard}>
      <TouchableOpacity 
        style={styles.summaryHeader}
        onPress={() => setExpandedSummary(!expandedSummary)}
      >
        <Text style={styles.summaryTitle}>Booking Summary</Text>
        <Ionicons 
          name={expandedSummary ? "chevron-up" : "chevron-down"} 
          size={20} 
          color={Colors.text.secondary} 
        />
      </TouchableOpacity>
      
      {expandedSummary && (
        <View style={styles.summaryContent}>
          <Text style={styles.vehicleName}>{bookingData.vehicle.name}</Text>
          <Text style={styles.tripDates}>
            {bookingData.pickup.date?.toLocaleDateString()} - {bookingData.return.date?.toLocaleDateString()}
          </Text>
          
          <View style={styles.priceBreakdown}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Base rental:</Text>
              <Text style={styles.priceValue}>₹{bookingData.pricing.baseRental.toLocaleString()}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Add-ons:</Text>
              <Text style={styles.priceValue}>₹{bookingData.pricing.addonsTotal.toLocaleString()}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>GST:</Text>
              <Text style={styles.priceValue}>₹{bookingData.pricing.gst.toLocaleString()}</Text>
            </View>
            {bookingData.coupon && (
              <View style={styles.priceRow}>
                <Text style={[styles.priceLabel, styles.discountLabel]}>Discount:</Text>
                <Text style={[styles.priceValue, styles.discountValue]}>-₹{bookingData.coupon.discount.toLocaleString()}</Text>
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );

  const renderAmountToPay = () => (
    <View style={styles.amountCard}>
      <Text style={styles.amountLabel}>Amount to pay:</Text>
      <Text style={styles.amountValue}>₹{getFinalTotal().toLocaleString()}</Text>
    </View>
  );

  const renderPaymentMethods = () => (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Payment Methods</Text>
      
      {/* Saved Cards */}
      {savedCards.length > 0 && (
        <View style={styles.paymentSection}>
          <Text style={styles.paymentSectionTitle}>Saved Cards</Text>
          {savedCards.map((card) => (
            <TouchableOpacity 
              key={card.id}
              style={[
                styles.paymentOption,
                selectedPaymentMethod === `saved-${card.id}` && styles.paymentOptionSelected
              ]}
              onPress={() => setSelectedPaymentMethod(`saved-${card.id}`)}
            >
              <View style={styles.paymentOptionLeft}>
                <Ionicons 
                  name={card.type === 'visa' ? 'card' : 'card'} 
                  size={20} 
                  color={Colors.primary.teal} 
                />
                <Text style={styles.paymentOptionText}>•••• {card.lastFour}</Text>
              </View>
              <View style={[styles.radioButton, selectedPaymentMethod === `saved-${card.id}` && styles.radioButtonSelected]}>
                {selectedPaymentMethod === `saved-${card.id}` && <View style={styles.radioButtonInner} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
      
      {/* Credit/Debit Card */}
      <View style={styles.paymentSection}>
        <TouchableOpacity 
          style={[
            styles.paymentSectionHeader,
            selectedPaymentMethod === 'card' && styles.paymentSectionSelected
          ]}
          onPress={() => setSelectedPaymentMethod('card')}
        >
          <View style={styles.paymentSectionLeft}>
            <Ionicons name="card" size={20} color={Colors.primary.teal} />
            <Text style={styles.paymentSectionTitle}>Credit/Debit Card</Text>
          </View>
          <View style={[styles.radioButton, selectedPaymentMethod === 'card' && styles.radioButtonSelected]}>
            {selectedPaymentMethod === 'card' && <View style={styles.radioButtonInner} />}
          </View>
        </TouchableOpacity>
        
        {selectedPaymentMethod === 'card' && (
          <View style={styles.cardForm}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Card Number</Text>
              <View style={styles.cardNumberInput}>
                <TextInput
                  style={styles.textInput}
                  value={cardNumber}
                  onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                  placeholder="1234 5678 9012 3456"
                  keyboardType="numeric"
                  maxLength={19}
                />
                <Ionicons 
                  name={getCardType(cardNumber) as any} 
                  size={20} 
                  color={Colors.text.secondary} 
                />
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Cardholder Name</Text>
              <TextInput
                style={styles.textInput}
                value={cardholderName}
                onChangeText={setCardholderName}
                placeholder="John Doe"
                autoCapitalize="words"
              />
            </View>
            
            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Expiry Date</Text>
                <TextInput
                  style={styles.textInput}
                  value={expiryDate}
                  onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                  placeholder="MM/YY"
                  keyboardType="numeric"
                  maxLength={5}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>CVV</Text>
                <TextInput
                  style={styles.textInput}
                  value={cvv}
                  onChangeText={setCvv}
                  placeholder="123"
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                />
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.saveCardRow}
              onPress={() => setSaveCard(!saveCard)}
            >
              <View style={[styles.checkbox, saveCard && styles.checkboxActive]}>
                {saveCard && <Ionicons name="checkmark" size={14} color="#ffffff" />}
              </View>
              <Text style={styles.saveCardText}>Save this card</Text>
            </TouchableOpacity>
            
            <View style={styles.acceptedCards}>
              <Text style={styles.acceptedCardsText}>Accepted cards:</Text>
              <View style={styles.cardIcons}>
                <Text style={styles.cardIcon}>VISA</Text>
                <Text style={styles.cardIcon}>MC</Text>
                <Text style={styles.cardIcon}>RuPay</Text>
                <Text style={styles.cardIcon}>AMEX</Text>
              </View>
            </View>
          </View>
        )}
      </View>
      
      {/* UPI */}
      <View style={styles.paymentSection}>
        <TouchableOpacity 
          style={[
            styles.paymentSectionHeader,
            selectedPaymentMethod === 'upi' && styles.paymentSectionSelected
          ]}
          onPress={() => setSelectedPaymentMethod('upi')}
        >
          <View style={styles.paymentSectionLeft}>
            <Ionicons name="phone-portrait" size={20} color={Colors.primary.teal} />
            <Text style={styles.paymentSectionTitle}>UPI</Text>
          </View>
          <View style={[styles.radioButton, selectedPaymentMethod === 'upi' && styles.radioButtonSelected]}>
            {selectedPaymentMethod === 'upi' && <View style={styles.radioButtonInner} />}
          </View>
        </TouchableOpacity>
        
        {selectedPaymentMethod === 'upi' && (
          <View style={styles.upiForm}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>UPI ID</Text>
              <TextInput
                style={styles.textInput}
                value={upiId}
                onChangeText={setUpiId}
                placeholder="yourname@paytm"
                keyboardType="email-address"
              />
            </View>
            
            <View style={styles.upiApps}>
              <Text style={styles.upiAppsText}>Popular UPI apps:</Text>
              <View style={styles.upiAppsList}>
                {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
                  <View key={app} style={styles.upiApp}>
                    <Text style={styles.upiAppText}>{app}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
      </View>
      
      {/* Net Banking */}
      <TouchableOpacity 
        style={[
          styles.paymentSectionHeader,
          selectedPaymentMethod === 'netbanking' && styles.paymentSectionSelected
        ]}
        onPress={() => setSelectedPaymentMethod('netbanking')}
      >
        <View style={styles.paymentSectionLeft}>
          <Ionicons name="business" size={20} color={Colors.primary.teal} />
          <Text style={styles.paymentSectionTitle}>Net Banking</Text>
        </View>
        <View style={[styles.radioButton, selectedPaymentMethod === 'netbanking' && styles.radioButtonSelected]}>
          {selectedPaymentMethod === 'netbanking' && <View style={styles.radioButtonInner} />}
        </View>
      </TouchableOpacity>
      
      {/* Wallets */}
      <View style={styles.paymentSection}>
        <Text style={styles.paymentSectionTitle}>Wallets</Text>
        {wallets.map((wallet, index) => (
          <TouchableOpacity 
            key={index}
            style={[
              styles.paymentOption,
              selectedPaymentMethod === `wallet-${index}` && styles.paymentOptionSelected
            ]}
            onPress={() => setSelectedPaymentMethod(`wallet-${index}`)}
          >
            <View style={styles.paymentOptionLeft}>
              <Ionicons name="wallet" size={20} color={Colors.primary.teal} />
              <View>
                <Text style={styles.paymentOptionText}>{wallet.name}</Text>
                {wallet.balance > 0 && (
                  <Text style={styles.walletBalance}>Balance: ₹{wallet.balance}</Text>
                )}
              </View>
            </View>
            <View style={[styles.radioButton, selectedPaymentMethod === `wallet-${index}` && styles.radioButtonSelected]}>
              {selectedPaymentMethod === `wallet-${index}` && <View style={styles.radioButtonInner} />}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderSecurityInfo = () => (
    <View style={styles.securityCard}>
      <View style={styles.securityIcons}>
        <Ionicons name="shield-checkmark" size={16} color={Colors.functional.success} />
        <Ionicons name="lock-closed" size={16} color={Colors.functional.success} />
      </View>
      <Text style={styles.securityText}>Your payment info is safe • SSL encrypted</Text>
      <Text style={styles.poweredBy}>Powered by Razorpay</Text>
    </View>
  );

  const renderProcessingModal = () => {
    if (!processing) return null;
    
    return (
      <View style={styles.processingOverlay}>
        <View style={styles.processingModal}>
          <View style={styles.processingAnimation}>
            <Ionicons name="card" size={40} color={Colors.primary.teal} />
          </View>
          <Text style={styles.processingTitle}>Processing your payment...</Text>
          <Text style={styles.processingSubtitle}>Please do not close or refresh</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {renderBookingSummary()}
        {renderAmountToPay()}
        {renderPaymentMethods()}
        {renderSecurityInfo()}
      </ScrollView>
      
      {/* Bottom Navigation */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={[styles.payButton, processing && styles.payButtonDisabled]}
          onPress={handlePayment}
          disabled={processing}
        >
          <LinearGradient
            colors={processing ? 
              ['#E5E7EB', '#E5E7EB'] : 
              [Colors.primary.teal, Colors.accent.blue]
            }
            style={styles.payGradient}
          >
            <Text style={[
              styles.payButtonText,
              processing && styles.payButtonTextDisabled
            ]}>
              {processing ? 'Processing...' : `Pay ₹${getFinalTotal().toLocaleString()}`}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      
      {renderProcessingModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  summaryContent: {
    marginTop: 16,
  },
  vehicleName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  tripDates: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 12,
  },
  priceBreakdown: {
    gap: 4,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  priceValue: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  discountLabel: {
    color: Colors.functional.success,
  },
  discountValue: {
    color: Colors.functional.success,
  },
  amountCard: {
    backgroundColor: Colors.primary.teal,
    marginHorizontal: 20,
    marginTop: 16,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  paymentSection: {
    marginBottom: 16,
  },
  paymentSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  paymentSectionSelected: {
    backgroundColor: '#E0F2FE',
    borderColor: Colors.primary.teal,
  },
  paymentSectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paymentSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
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
  radioButtonSelected: {
    borderColor: Colors.primary.teal,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary.teal,
  },
  paymentOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  paymentOptionSelected: {
    backgroundColor: '#E0F2FE',
    borderColor: Colors.primary.teal,
  },
  paymentOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paymentOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  walletBalance: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  cardForm: {
    gap: 16,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  textInput: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    fontSize: 14,
    color: Colors.text.primary,
  },
  cardNumberInput: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  saveCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: Colors.primary.teal,
  },
  saveCardText: {
    fontSize: 14,
    color: Colors.text.primary,
  },
  acceptedCards: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  acceptedCardsText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  cardIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  cardIcon: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.text.secondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
  },
  upiForm: {
    gap: 16,
  },
  upiApps: {
    gap: 8,
  },
  upiAppsText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  upiAppsList: {
    flexDirection: 'row',
    gap: 8,
  },
  upiApp: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
  },
  upiAppText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  securityCard: {
    backgroundColor: '#F0F9FF',
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  securityIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  securityText: {
    fontSize: 12,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  poweredBy: {
    fontSize: 10,
    color: Colors.text.secondary,
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
  payButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  payButtonDisabled: {
    opacity: 0.5,
  },
  payGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  payButtonTextDisabled: {
    color: Colors.text.secondary,
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingModal: {
    backgroundColor: '#ffffff',
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    gap: 16,
  },
  processingAnimation: {
    width: 80,
    height: 80,
    backgroundColor: '#E0F2FE',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  processingSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});