/**
 * Example: Checkout Integration with Payment Methods
 * 
 * This example shows how to integrate the payment methods screen
 * with a checkout flow for payment selection.
 */

import { Colors } from '@/src/shared/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PaymentMethod {
  id: string; 
  type: 'card' | 'upi' | 'wallet';
  displayName: string;
  details: string;
  icon: string;
  isDefault: boolean;
}

export const CheckoutWithPaymentMethods = () => {
  const router = useRouter();
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [showPaymentSelector, setShowPaymentSelector] = useState(false);

  // Sample payment methods (would come from state/API)
  const paymentMethods: PaymentMethod[] = [
    {
      id: '1',
      type: 'card',
      displayName: 'Visa Card',
      details: '**** **** **** 1234',
      icon: '💳',
      isDefault: true,
    },
    {
      id: '2',
      type: 'upi',
      displayName: 'PhonePe UPI',
      details: 'john@phonepe',
      icon: '📱',
      isDefault: false,
    },
    {
      id: '3',
      type: 'wallet',
      displayName: 'Paytm Wallet',
      details: '₹1,250.50 available',
      icon: '👛',
      isDefault: false,
    },
  ];

  // Set default payment method on load
  React.useEffect(() => {
    const defaultPayment = paymentMethods.find(p => p.isDefault) || paymentMethods[0];
    setSelectedPayment(defaultPayment);
  }, []);

  const handlePaymentSelect = (payment: PaymentMethod) => {
    setSelectedPayment(payment);
    setShowPaymentSelector(false);
  };

  const handleManagePayments = () => {
    setShowPaymentSelector(false);
    router.push('/payment-methods' as any);
  };

  const getPaymentTypeIcon = (type: string) => {
    switch (type) {
      case 'card': return 'card';
      case 'upi': return 'phone-portrait';
      case 'wallet': return 'wallet';
      default: return 'card';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checkout - Payment Selection</Text>

      {/* Booking Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Booking Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Vehicle</Text>
          <Text style={styles.summaryValue}>Honda City</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Duration</Text>
          <Text style={styles.summaryValue}>3 hours</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalValue}>₹899</Text>
        </View>
      </View>

      {/* Payment Method Selection */}
      <View style={styles.paymentSection}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        
        <TouchableOpacity 
          style={styles.paymentSelector}
          onPress={() => setShowPaymentSelector(true)}
        >
          {selectedPayment ? (
            <View style={styles.selectedPaymentContainer}>
              <View style={styles.paymentIcon}>
                <Ionicons 
                  name={getPaymentTypeIcon(selectedPayment.type) as any} 
                  size={20} 
                  color={Colors.primary.teal} 
                />
              </View>
              <View style={styles.paymentDetails}>
                <Text style={styles.paymentName}>{selectedPayment.displayName}</Text>
                <Text style={styles.paymentInfo}>{selectedPayment.details}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.placeholderContainer}>
              <Ionicons name="card-outline" size={20} color={Colors.text.secondary} />
              <Text style={styles.placeholderText}>Select payment method</Text>
            </View>
          )}
          <Ionicons name="chevron-down" size={16} color={Colors.text.secondary} />
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={handleManagePayments}
          >
            <Ionicons name="settings" size={16} color={Colors.primary.teal} />
            <Text style={styles.quickActionText}>Manage Payment Methods</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Pay Button */}
      <TouchableOpacity style={styles.payButton}>
        <Text style={styles.payButtonText}>Pay ₹899</Text>
        <Ionicons name="arrow-forward" size={20} color={Colors.text.white} />
      </TouchableOpacity>

      {/* Payment Method Selector Modal */}
      <Modal
        visible={showPaymentSelector}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPaymentSelector(false)}
      >
        <View style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={() => setShowPaymentSelector(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            
            <Text style={styles.modalTitle}>Select Payment Method</Text>
            
            <TouchableOpacity 
              onPress={handleManagePayments}
              style={styles.manageButton}
            >
              <Text style={styles.manageText}>Manage</Text>
            </TouchableOpacity>
          </View>

          {/* Payment Methods List */}
          <ScrollView style={styles.paymentsList}>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentOption,
                  selectedPayment?.id === method.id && styles.paymentOptionSelected
                ]}
                onPress={() => handlePaymentSelect(method)}
              >
                <View style={styles.paymentOptionIcon}>
                  <Ionicons 
                    name={getPaymentTypeIcon(method.type) as any} 
                    size={20} 
                    color={Colors.primary.teal} 
                  />
                </View>
                
                <View style={styles.paymentOptionDetails}>
                  <View style={styles.paymentOptionHeader}>
                    <Text style={styles.paymentOptionName}>{method.displayName}</Text>
                    {method.isDefault && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultBadgeText}>Default</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.paymentOptionInfo}>{method.details}</Text>
                </View>

                {selectedPayment?.id === method.id && (
                  <Ionicons name="checkmark-circle" size={20} color={Colors.primary.teal} />
                )}
              </TouchableOpacity>
            ))}

            {/* Add New Payment Method */}
            <TouchableOpacity 
              style={styles.addPaymentOption}
              onPress={handleManagePayments}
            >
              <View style={styles.addPaymentIcon}>
                <Ionicons name="add" size={20} color={Colors.primary.teal} />
              </View>
              <Text style={styles.addPaymentText}>Add New Payment Method</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Payment Security Info */}
          <View style={styles.securityInfo}>
            <View style={styles.securityHeader}>
              <Ionicons name="shield-checkmark" size={16} color={Colors.functional.success} />
              <Text style={styles.securityText}>Your payment is secure and encrypted</Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.background.lightGrey,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 20,
  },

  // Summary Card
  summaryCard: {
    backgroundColor: Colors.background.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
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
    paddingVertical: 6,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  summaryValue: {
    fontSize: 14,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    marginTop: 8,
    paddingTop: 12,
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

  // Payment Section
  paymentSection: {
    backgroundColor: Colors.background.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  paymentSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  selectedPaymentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary.teal + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  paymentDetails: {
    flex: 1,
  },
  paymentName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  paymentInfo: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  placeholderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  placeholderText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  quickActions: {
    marginTop: 12,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quickActionText: {
    fontSize: 14,
    color: Colors.primary.teal,
    fontWeight: '500',
  },

  // Pay Button
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: Colors.primary.teal,
    borderRadius: 12,
    gap: 8,
  },
  payButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.white,
  },

  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background.lightGrey,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.background.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
  },
  cancelText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  manageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.primary.teal,
  },
  manageText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.white,
  },

  // Payment Options
  paymentsList: {
    flex: 1,
    padding: 16,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.background.white,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  paymentOptionSelected: {
    borderColor: Colors.primary.teal,
    backgroundColor: Colors.primary.teal + '05',
  },
  paymentOptionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary.teal + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  paymentOptionDetails: {
    flex: 1,
  },
  paymentOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  paymentOptionName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginRight: 8,
  },
  defaultBadge: {
    backgroundColor: Colors.functional.success,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  defaultBadgeText: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.text.white,
    textTransform: 'uppercase',
  },
  paymentOptionInfo: {
    fontSize: 14,
    color: Colors.text.secondary,
  },

  // Add Payment Option
  addPaymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.background.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary.teal,
    borderStyle: 'dashed',
    marginTop: 8,
  },
  addPaymentIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary.teal + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addPaymentText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary.teal,
  },

  // Security Info
  securityInfo: {
    padding: 16,
    backgroundColor: Colors.background.white,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  securityText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
});

export default CheckoutWithPaymentMethods;
