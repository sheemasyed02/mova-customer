import { Colors } from '@/constants/Colors';
import { useScrollContext } from '@/contexts/ScrollContext';
import { useScrollDirection } from '@/hooks/useScrollDirection';
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

export default function ReviewConfirm({ bookingData, updateBookingData, onNext, onBack }: Props) {
  const [couponCode, setCouponCode] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [paymentOption, setPaymentOption] = useState('full'); // 'full' or 'partial'

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

  const availableCoupons = [
    { code: 'FIRST20', discount: 1000, description: '₹1,000 off' },
    { code: 'WEEKEND15', discount: 750, description: '₹750 off' },
  ];

  const calculateDuration = () => {
    if (bookingData.pickup.date && bookingData.return.date) {
      const diffTime = bookingData.return.date.getTime() - bookingData.pickup.date.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  const applyCoupon = (code: string) => {
    const coupon = availableCoupons.find(c => c.code === code);
    if (coupon) {
      updateBookingData({ coupon });
      setCouponCode(code);
    }
  };

  const removeCoupon = () => {
    updateBookingData({ coupon: null });
    setCouponCode('');
  };

  const getFinalTotal = () => {
    const discount = bookingData.coupon?.discount || 0;
    return Math.max(0, bookingData.pricing.total - discount);
  };

  const renderTripDetailsCard = () => (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Trip Details</Text>
      
      <View style={styles.vehicleHeader}>
        <View style={styles.vehicleImageContainer}>
          <Ionicons name="car-sport" size={32} color={Colors.primary.teal} />
        </View>
        <Text style={styles.vehicleName}>{bookingData.vehicle.name}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Pickup:</Text>
        <View style={styles.detailValue}>
          <Text style={styles.detailText}>
            {bookingData.pickup.date?.toLocaleDateString('en', { 
              weekday: 'short', 
              day: 'numeric', 
              month: 'short' 
            })} at {bookingData.pickup.time}
          </Text>
          <Text style={styles.detailSubtext}>{bookingData.pickup.location}</Text>
          {bookingData.addons.delivery && (
            <Text style={styles.deliveryTag}>Delivery selected: Yes</Text>
          )}
        </View>
      </View>
      
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Return:</Text>
        <View style={styles.detailValue}>
          <Text style={styles.detailText}>
            {bookingData.return.date?.toLocaleDateString('en', { 
              weekday: 'short', 
              day: 'numeric', 
              month: 'short' 
            })} at {bookingData.return.time}
          </Text>
          <Text style={styles.detailSubtext}>{bookingData.return.location}</Text>
        </View>
      </View>
      
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Duration:</Text>
        <Text style={styles.summaryValue}>{calculateDuration()} Days</Text>
      </View>
      
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Estimated KM:</Text>
        <Text style={styles.summaryValue}>600 km</Text>
      </View>
    </View>
  );

  const renderAddonsSelected = () => {
    const selectedAddons = [];
    
    if (bookingData.addons.delivery) {
      selectedAddons.push({ name: 'Delivery to location', price: 200 });
    }
    if (bookingData.addons.enhancedCoverage) {
      selectedAddons.push({ name: 'Enhanced coverage', price: 300 });
    }
    if (bookingData.addons.childSeat > 0) {
      selectedAddons.push({ name: `Child seat (x${bookingData.addons.childSeat})`, price: bookingData.addons.childSeat * 100 });
    }
    if (bookingData.addons.gps) {
      selectedAddons.push({ name: 'GPS device', price: 50 });
    }
    if (bookingData.addons.phoneHolder) {
      selectedAddons.push({ name: 'Phone holder', price: 20 });
    }
    if (bookingData.addons.driver) {
      selectedAddons.push({ name: 'Driver service', price: 500 });
    }
    if (bookingData.addons.prepaidFuel) {
      selectedAddons.push({ name: 'Prepaid fuel', price: 3500 });
    }

    if (selectedAddons.length === 0) {
      return null;
    }

    return (
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Add-ons Selected</Text>
        
        {selectedAddons.map((addon, index) => (
          <View key={index} style={styles.addonRow}>
            <Text style={styles.addonName}>{addon.name}</Text>
            <Text style={styles.addonPrice}>₹{addon.price}</Text>
          </View>
        ))}
        
        <View style={styles.addonTotal}>
          <Text style={styles.addonTotalLabel}>Total add-ons:</Text>
          <Text style={styles.addonTotalValue}>₹{bookingData.pricing.addonsTotal}</Text>
        </View>
      </View>
    );
  };

  const renderPricingBreakdown = () => (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Pricing Breakdown</Text>
      
      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>Base rental ({calculateDuration()} days):</Text>
        <Text style={styles.priceValue}>₹{bookingData.pricing.baseRental.toLocaleString()}</Text>
      </View>
      
      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>Extra services:</Text>
        <Text style={styles.priceValue}>₹{bookingData.pricing.addonsTotal.toLocaleString()}</Text>
      </View>
      
      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>Platform fee:</Text>
        <Text style={styles.priceValue}>₹{bookingData.pricing.platformFee}</Text>
      </View>
      
      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>Subtotal:</Text>
        <Text style={styles.priceValue}>
          ₹{(bookingData.pricing.baseRental + bookingData.pricing.addonsTotal + bookingData.pricing.platformFee).toLocaleString()}
        </Text>
      </View>
      
      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>GST (18%):</Text>
        <Text style={styles.priceValue}>₹{bookingData.pricing.gst.toLocaleString()}</Text>
      </View>
      
      {bookingData.coupon && (
        <View style={styles.priceRow}>
          <Text style={[styles.priceLabel, styles.discountLabel]}>
            Discount ({bookingData.coupon.code}):
          </Text>
          <Text style={[styles.priceValue, styles.discountValue]}>
            -₹{bookingData.coupon.discount.toLocaleString()}
          </Text>
        </View>
      )}
      
      <View style={styles.priceDivider} />
      
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total Amount:</Text>
        <Text style={styles.totalValue}>₹{getFinalTotal().toLocaleString()}</Text>
      </View>
      
      <View style={styles.depositInfo}>
        <Text style={styles.depositLabel}>Security deposit: ₹{bookingData.pricing.securityDeposit.toLocaleString()} (hold only)</Text>
        <Text style={styles.amountToPayLabel}>Amount to pay now: ₹{getFinalTotal().toLocaleString()}</Text>
      </View>
    </View>
  );

  const renderSecurityDepositInfo = () => (
    <View style={styles.infoCard}>
      <View style={styles.infoHeader}>
        <Ionicons name="shield-checkmark" size={20} color={Colors.primary.teal} />
        <Text style={styles.infoTitle}>Security Deposit Info</Text>
      </View>
      
      <Text style={styles.infoText}>• ₹{bookingData.pricing.securityDeposit.toLocaleString()} will be blocked on your card</Text>
      <Text style={styles.infoText}>• Refunded within 7 days after trip</Text>
      <Text style={styles.infoText}>• Deductions only for damages/violations</Text>
      
      <TouchableOpacity>
        <Text style={styles.learnMoreText}>Learn more</Text>
      </TouchableOpacity>
    </View>
  );

  const renderApplyCoupon = () => (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Apply Coupon</Text>
      
      <View style={styles.couponInputRow}>
        <TextInput
          style={styles.couponInput}
          value={couponCode}
          onChangeText={setCouponCode}
          placeholder="Enter coupon code"
          autoCapitalize="characters"
        />
        <TouchableOpacity 
          style={styles.applyButton}
          onPress={() => applyCoupon(couponCode)}
        >
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>
      
      {bookingData.coupon && (
        <View style={styles.appliedCoupon}>
          <View style={styles.appliedCouponLeft}>
            <Ionicons name="checkmark-circle" size={16} color={Colors.functional.success} />
            <Text style={styles.appliedCouponText}>
              {bookingData.coupon.code} applied! ₹{bookingData.coupon.discount} off
            </Text>
          </View>
          <TouchableOpacity onPress={removeCoupon}>
            <Ionicons name="close" size={16} color={Colors.text.secondary} />
          </TouchableOpacity>
        </View>
      )}
      
      <View style={styles.availableCoupons}>
        <Text style={styles.availableCouponsTitle}>Available coupons:</Text>
        {availableCoupons.map((coupon, index) => (
          <TouchableOpacity 
            key={index}
            style={styles.couponOption}
            onPress={() => applyCoupon(coupon.code)}
          >
            <Text style={styles.couponCode}>{coupon.code}</Text>
            <Text style={styles.couponDescription}>{coupon.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderPaymentOptions = () => (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Payment Options</Text>
      
      <TouchableOpacity 
        style={[styles.paymentOptionRow, paymentOption === 'full' && styles.paymentOptionSelected]}
        onPress={() => setPaymentOption('full')}
      >
        <View style={[styles.radioButton, paymentOption === 'full' && styles.radioButtonSelected]}>
          {paymentOption === 'full' && <View style={styles.radioButtonInner} />}
        </View>
        <Text style={styles.paymentOptionText}>Pay Full Amount Now</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.paymentOptionRow, paymentOption === 'partial' && styles.paymentOptionSelected]}
        onPress={() => setPaymentOption('partial')}
      >
        <View style={[styles.radioButton, paymentOption === 'partial' && styles.radioButtonSelected]}>
          {paymentOption === 'partial' && <View style={styles.radioButtonInner} />}
        </View>
        <Text style={styles.paymentOptionText}>Pay 50% Now, 50% on Pickup</Text>
      </TouchableOpacity>
    </View>
  );

  const renderImportantNotes = () => (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Important Notes</Text>
      
      <View style={styles.noteItem}>
        <Ionicons name="information-circle" size={16} color={Colors.primary.teal} />
        <Text style={styles.noteText}>Cancellation policy reminder: Free cancellation up to 24 hours before pickup</Text>
      </View>
      
      <View style={styles.noteItem}>
        <Ionicons name="document-text" size={16} color={Colors.primary.teal} />
        <View style={styles.noteContent}>
          <Text style={styles.noteText}>Required documents:</Text>
          <Text style={styles.noteSubtext}>• Valid Driving License</Text>
          <Text style={styles.noteSubtext}>• Aadhaar or Passport</Text>
          <TouchableOpacity>
            <Text style={styles.uploadText}>Upload now or later</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.termsContainer}>
        <TouchableOpacity 
          style={styles.termsRow}
          onPress={() => setTermsAccepted(!termsAccepted)}
        >
          <View style={[styles.checkbox, termsAccepted && styles.checkboxActive]}>
            {termsAccepted && <Ionicons name="checkmark" size={14} color="#ffffff" />}
          </View>
          <Text style={styles.termsText}>
            I agree to Terms, Privacy Policy, and Cancellation Policy
          </Text>
        </TouchableOpacity>
        
        <View style={styles.termsLinks}>
          <TouchableOpacity><Text style={styles.linkText}>Terms</Text></TouchableOpacity>
          <Text style={styles.linkSeparator}> • </Text>
          <TouchableOpacity><Text style={styles.linkText}>Privacy Policy</Text></TouchableOpacity>
          <Text style={styles.linkSeparator}> • </Text>
          <TouchableOpacity><Text style={styles.linkText}>Cancellation Policy</Text></TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderContactVerification = () => (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Contact Details Verification</Text>
      
      <View style={styles.contactRow}>
        <View style={styles.contactInfo}>
          <Text style={styles.contactLabel}>Phone:</Text>
          <Text style={styles.contactValue}>+91 98765 43210</Text>
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={12} color={Colors.functional.success} />
            <Text style={styles.verifiedText}>verified</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Text style={styles.changeText}>Change</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.contactRow}>
        <View style={styles.contactInfo}>
          <Text style={styles.contactLabel}>Email:</Text>
          <Text style={styles.contactValue}>user@email.com</Text>
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={12} color={Colors.functional.success} />
            <Text style={styles.verifiedText}>verified</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Text style={styles.changeText}>Change</Text>
        </TouchableOpacity>
      </View>
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
        {renderTripDetailsCard()}
        {renderAddonsSelected()}
        {renderPricingBreakdown()}
        {renderSecurityDepositInfo()}
        {renderApplyCoupon()}
        {renderPaymentOptions()}
        {renderImportantNotes()}
        {renderContactVerification()}
      </ScrollView>
      
      {/* Bottom Navigation */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={[styles.proceedButton, !termsAccepted && styles.proceedButtonDisabled]}
          onPress={onNext}
          disabled={!termsAccepted}
        >
          <LinearGradient
            colors={termsAccepted ? 
              [Colors.primary.teal, Colors.accent.blue] : 
              ['#E5E7EB', '#E5E7EB']
            }
            style={styles.proceedGradient}
          >
            <Text style={[
              styles.proceedButtonText,
              !termsAccepted && styles.proceedButtonTextDisabled
            ]}>
              Proceed to Payment
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
  vehicleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  vehicleImageContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.secondary,
    width: 60,
  },
  detailValue: {
    flex: 1,
  },
  detailText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  detailSubtext: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  deliveryTag: {
    fontSize: 12,
    color: Colors.functional.success,
    marginTop: 2,
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
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  addonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addonName: {
    fontSize: 14,
    color: Colors.text.primary,
  },
  addonPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary.teal,
  },
  addonTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  addonTotalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  addonTotalValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.teal,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  priceValue: {
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
  priceDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary.teal,
  },
  depositInfo: {
    backgroundColor: '#F0F9FF',
    padding: 12,
    borderRadius: 8,
  },
  depositLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  amountToPayLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  infoCard: {
    backgroundColor: '#F0F9FF',
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary.teal,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  infoText: {
    fontSize: 14,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  learnMoreText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary.teal,
    marginTop: 8,
  },
  couponInputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  couponInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    fontSize: 14,
    color: Colors.text.primary,
  },
  applyButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.primary.teal,
    borderRadius: 8,
    justifyContent: 'center',
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  appliedCoupon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  appliedCouponLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  appliedCouponText: {
    fontSize: 14,
    color: Colors.functional.success,
  },
  availableCoupons: {
    gap: 8,
  },
  availableCouponsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  couponOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
  },
  couponCode: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.teal,
  },
  couponDescription: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  paymentOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  paymentOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  noteItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  noteContent: {
    flex: 1,
  },
  noteText: {
    fontSize: 14,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  noteSubtext: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  uploadText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary.teal,
    marginTop: 4,
  },
  termsContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxActive: {
    backgroundColor: Colors.primary.teal,
  },
  termsText: {
    fontSize: 14,
    color: Colors.text.primary,
    flex: 1,
    lineHeight: 20,
  },
  termsLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 32,
  },
  linkText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary.teal,
  },
  linkSeparator: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedText: {
    fontSize: 12,
    color: Colors.functional.success,
  },
  changeText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary.teal,
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
  proceedButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  proceedButtonDisabled: {
    opacity: 0.5,
  },
  proceedGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  proceedButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  proceedButtonTextDisabled: {
    color: Colors.text.secondary,
  },
});