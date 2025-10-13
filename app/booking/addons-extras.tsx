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
  coupon: any;
  payment: any;
}

interface Props {
  bookingData: BookingData;
  updateBookingData: (updates: Partial<BookingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function AddonsExtras({ bookingData, updateBookingData, onNext, onBack }: Props) {
  const [deliveryAddress, setDeliveryAddress] = useState('');

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

  const calculateAddonsTotal = () => {
    let total = 0;
    if (bookingData.addons.delivery) total += 200;
    if (bookingData.addons.driver) total += 500;
    if (bookingData.addons.enhancedCoverage) total += 300;
    if (bookingData.addons.childSeat > 0) total += bookingData.addons.childSeat * 100;
    if (bookingData.addons.gps) total += 50;
    if (bookingData.addons.phoneHolder) total += 20;
    if (bookingData.addons.prepaidFuel) total += 3500;
    return total;
  };

  const updateAddon = (addon: keyof typeof bookingData.addons, value: any) => {
    const newAddons = { ...bookingData.addons, [addon]: value };
    const addonsTotal = calculateAddonsTotal();
    const subtotal = bookingData.pricing.baseRental + addonsTotal + bookingData.pricing.platformFee;
    const gst = Math.round(subtotal * 0.18);
    const total = subtotal + gst;

    updateBookingData({
      addons: newAddons,
      pricing: {
        ...bookingData.pricing,
        addonsTotal,
        gst,
        total,
      }
    });
  };

  const renderCompactVehicleSummary = () => (
    <View style={styles.compactSummary}>
      <View style={styles.vehicleImageSmall}>
        <Ionicons name="car-sport" size={24} color={Colors.primary.teal} />
      </View>
      <View style={styles.vehicleInfoCompact}>
        <Text style={styles.vehicleNameCompact}>{bookingData.vehicle.name}</Text>
        <Text style={styles.vehiclePriceCompact}>₹{bookingData.vehicle.pricePerDay}/day</Text>
      </View>
    </View>
  );

  const renderDeliveryOptions = () => (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Delivery Options</Text>
      
      <TouchableOpacity 
        style={styles.optionRow}
        onPress={() => updateAddon('delivery', !bookingData.addons.delivery)}
      >
        <View style={styles.optionLeft}>
          <View style={[styles.checkbox, bookingData.addons.delivery && styles.checkboxActive]}>
            {bookingData.addons.delivery && <Ionicons name="checkmark" size={14} color="#ffffff" />}
          </View>
          <View style={styles.optionInfo}>
            <Text style={styles.optionTitle}>Deliver to my location</Text>
            <Text style={styles.optionPrice}>₹200</Text>
            <Text style={styles.optionNote}>Available within 10 km radius</Text>
          </View>
        </View>
      </TouchableOpacity>
      
      {bookingData.addons.delivery && (
        <View style={styles.addressInput}>
          <TextInput
            style={styles.textInput}
            value={deliveryAddress}
            onChangeText={setDeliveryAddress}
            placeholder="Enter delivery address"
            multiline
          />
        </View>
      )}
    </View>
  );

  const renderAdditionalServices = () => (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Additional Services</Text>
      
      <TouchableOpacity 
        style={styles.optionRow}
        onPress={() => updateAddon('driver', !bookingData.addons.driver)}
      >
        <View style={styles.optionLeft}>
          <View style={[styles.checkbox, bookingData.addons.driver && styles.checkboxActive]}>
            {bookingData.addons.driver && <Ionicons name="checkmark" size={14} color="#ffffff" />}
          </View>
          <View style={styles.optionInfo}>
            <Text style={styles.optionTitle}>Book with driver</Text>
            <Text style={styles.optionPrice}>₹500/day</Text>
            <Text style={styles.optionNote}>Includes 8 hours, 80 km/day</Text>
            <Text style={styles.optionNote}>Driver accommodation: Your responsibility</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderProtectionInsurance = () => (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Protection & Insurance</Text>
      
      <View style={styles.standardCoverageCard}>
        <View style={styles.coverageHeader}>
          <Ionicons name="shield-checkmark" size={20} color={Colors.functional.success} />
          <Text style={styles.coverageTitle}>Standard coverage (included)</Text>
        </View>
        <Text style={styles.coverageDescription}>Basic insurance details and liability coverage</Text>
        <TouchableOpacity>
          <Text style={styles.learnMoreText}>Learn more</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={styles.optionRow}
        onPress={() => updateAddon('enhancedCoverage', !bookingData.addons.enhancedCoverage)}
      >
        <View style={styles.optionLeft}>
          <View style={[styles.checkbox, bookingData.addons.enhancedCoverage && styles.checkboxActive]}>
            {bookingData.addons.enhancedCoverage && <Ionicons name="checkmark" size={14} color="#ffffff" />}
          </View>
          <View style={styles.optionInfo}>
            <Text style={styles.optionTitle}>Add Super Coverage</Text>
            <Text style={styles.optionPrice}>₹300</Text>
            <View style={styles.benefitsList}>
              <Text style={styles.benefitItem}>• Zero deductible</Text>
              <Text style={styles.benefitItem}>• Accidental damage covered</Text>
              <Text style={styles.benefitItem}>• Theft protection</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.viewPolicyText}>View policy details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderAccessories = () => (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Accessories</Text>
      
      <View style={styles.accessoryRow}>
        <View style={styles.accessoryInfo}>
          <Text style={styles.accessoryTitle}>Child seat</Text>
          <Text style={styles.accessoryPrice}>₹100/day</Text>
        </View>
        <View style={styles.quantitySelector}>
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => updateAddon('childSeat', Math.max(0, bookingData.addons.childSeat - 1))}
          >
            <Ionicons name="remove" size={16} color={Colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{bookingData.addons.childSeat}</Text>
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => updateAddon('childSeat', bookingData.addons.childSeat + 1)}
          >
            <Ionicons name="add" size={16} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.accessoryToggle}
        onPress={() => updateAddon('gps', !bookingData.addons.gps)}
      >
        <View style={styles.accessoryLeft}>
          <View style={[styles.checkbox, bookingData.addons.gps && styles.checkboxActive]}>
            {bookingData.addons.gps && <Ionicons name="checkmark" size={14} color="#ffffff" />}
          </View>
          <Text style={styles.accessoryTitle}>GPS device</Text>
        </View>
        <Text style={styles.accessoryPrice}>₹50/day</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.accessoryToggle}
        onPress={() => updateAddon('phoneHolder', !bookingData.addons.phoneHolder)}
      >
        <View style={styles.accessoryLeft}>
          <View style={[styles.checkbox, bookingData.addons.phoneHolder && styles.checkboxActive]}>
            {bookingData.addons.phoneHolder && <Ionicons name="checkmark" size={14} color="#ffffff" />}
          </View>
          <Text style={styles.accessoryTitle}>Phone holder</Text>
        </View>
        <Text style={styles.accessoryPrice}>₹20/day</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.accessoryToggle}
        onPress={() => updateAddon('firstAidKit', !bookingData.addons.firstAidKit)}
      >
        <View style={styles.accessoryLeft}>
          <View style={[styles.checkbox, bookingData.addons.firstAidKit && styles.checkboxActive]}>
            {bookingData.addons.firstAidKit && <Ionicons name="checkmark" size={14} color="#ffffff" />}
          </View>
          <Text style={styles.accessoryTitle}>First aid kit</Text>
        </View>
        <Text style={styles.accessoryPrice}>Free</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFuelOptions = () => (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Fuel Options</Text>
      
      <TouchableOpacity 
        style={styles.optionRow}
        onPress={() => updateAddon('prepaidFuel', !bookingData.addons.prepaidFuel)}
      >
        <View style={styles.optionLeft}>
          <View style={[styles.checkbox, bookingData.addons.prepaidFuel && styles.checkboxActive]}>
            {bookingData.addons.prepaidFuel && <Ionicons name="checkmark" size={14} color="#ffffff" />}
          </View>
          <View style={styles.optionInfo}>
            <Text style={styles.optionTitle}>Full tank on delivery</Text>
            <Text style={styles.optionPrice}>Estimated cost: ₹3,500</Text>
            <Text style={styles.optionNote}>Refund for unused fuel</Text>
          </View>
        </View>
      </TouchableOpacity>
      
      <View style={styles.standardOption}>
        <Text style={styles.standardTitle}>Standard: Pick up and return with same fuel level</Text>
      </View>
    </View>
  );

  const renderPriceSummary = () => {
    const addonsTotal = calculateAddonsTotal();
    const subtotal = bookingData.pricing.baseRental + addonsTotal;
    const gst = Math.round(subtotal * 0.18);
    const total = subtotal + gst;

    return (
      <View style={styles.priceSummaryCard}>
        <Text style={styles.summaryTitle}>Updated Price Summary</Text>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Rental:</Text>
          <Text style={styles.summaryValue}>₹{bookingData.pricing.baseRental.toLocaleString()}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Add-ons:</Text>
          <Text style={styles.summaryValue}>₹{addonsTotal.toLocaleString()}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Taxes (18%):</Text>
          <Text style={styles.summaryValue}>₹{gst.toLocaleString()}</Text>
        </View>
        
        <View style={styles.summaryDivider} />
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryTotalLabel}>Total:</Text>
          <Text style={styles.summaryTotalValue}>₹{total.toLocaleString()}</Text>
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
        {renderCompactVehicleSummary()}
        {renderDeliveryOptions()}
        {renderAdditionalServices()}
        {renderProtectionInsurance()}
        {renderAccessories()}
        {renderFuelOptions()}
        {renderPriceSummary()}
      </ScrollView>
      
      {/* Bottom Navigation */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.continueButton} onPress={onNext}>
          <LinearGradient
            colors={[Colors.primary.teal, Colors.accent.blue]}
            style={styles.continueGradient}
          >
            <Text style={styles.continueButtonText}>Continue to Payment</Text>
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
  compactSummary: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    marginHorizontal: 20,
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    gap: 12,
  },
  vehicleImageSmall: {
    width: 40,
    height: 40,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehicleInfoCompact: {
    flex: 1,
  },
  vehicleNameCompact: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  vehiclePriceCompact: {
    fontSize: 12,
    color: Colors.primary.teal,
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
  optionRow: {
    marginBottom: 16,
  },
  optionLeft: {
    flexDirection: 'row',
    gap: 12,
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
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  optionPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary.teal,
    marginBottom: 4,
  },
  optionNote: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  addressInput: {
    marginTop: 12,
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
    minHeight: 80,
    textAlignVertical: 'top',
  },
  standardCoverageCard: {
    backgroundColor: '#F0F9FF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  coverageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  coverageTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  coverageDescription: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  learnMoreText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary.teal,
  },
  benefitsList: {
    marginTop: 4,
    marginBottom: 8,
  },
  benefitItem: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  viewPolicyText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary.teal,
  },
  accessoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  accessoryInfo: {
    flex: 1,
  },
  accessoryTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  accessoryPrice: {
    fontSize: 12,
    color: Colors.primary.teal,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {
    width: 32,
    height: 32,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    minWidth: 24,
    textAlign: 'center',
  },
  accessoryToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  accessoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  standardOption: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  standardTitle: {
    fontSize: 14,
    color: Colors.text.primary,
  },
  priceSummaryCard: {
    backgroundColor: '#E0F2FE',
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary.teal,
  },
  summaryTitle: {
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
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: Colors.primary.teal,
    marginVertical: 8,
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  summaryTotalValue: {
    fontSize: 16,
    fontWeight: 'bold',
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
  continueButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  continueGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});