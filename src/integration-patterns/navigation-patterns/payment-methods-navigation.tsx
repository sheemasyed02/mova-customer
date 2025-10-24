import { Colors } from '@/src/shared/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const PaymentMethodsNavigationExamples = () => {
  const router = useRouter();
 
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Navigate to Payment Methods</Text>
      
      {/* Example 1: From Edit Profile Screen */}
      <Text style={styles.subtitle}>From Edit Profile (Already implemented):</Text>
      <TouchableOpacity 
        style={styles.exampleButton}
        onPress={() => router.push('/payment-methods' as any)}
      >
        <Ionicons name="card" size={20} color={Colors.primary.teal} />
        <Text style={styles.buttonText}>Payment Methods</Text>
        <Ionicons name="chevron-forward" size={16} color={Colors.text.secondary} />
      </TouchableOpacity>

      {/* Example 2: From Checkout Screen */}
      <Text style={styles.subtitle}>From Checkout (Payment Selection):</Text>
      <TouchableOpacity 
        style={styles.paymentSelector}
        onPress={() => router.push('/payment-methods' as any)}
      >
        <View style={styles.paymentInfo}>
          <Text style={styles.paymentLabel}>Payment Method</Text>
          <Text style={styles.paymentText}>Choose payment method</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={Colors.text.secondary} />
      </TouchableOpacity>

      {/* Example 3: From Booking Summary */}
      <Text style={styles.subtitle}>From Booking Summary:</Text>
      <View style={styles.bookingCard}>
        <Text style={styles.bookingTitle}>Payment Details</Text>
        <TouchableOpacity 
          style={styles.changePaymentButton}
          onPress={() => router.push('/payment-methods' as any)}
        >
          <View style={styles.selectedPayment}>
            <Text style={styles.cardIcon}>💳</Text>
            <Text style={styles.selectedPaymentText}>**** 1234</Text>
          </View>
          <Text style={styles.changeText}>Change</Text>
        </TouchableOpacity>
      </View>

      {/* Example 4: Quick Action Button */}
      <Text style={styles.subtitle}>Quick Access Button:</Text>
      <TouchableOpacity 
        style={styles.quickActionButton}
        onPress={() => router.push('/payment-methods' as any)}
      >
        <Ionicons name="wallet" size={24} color={Colors.text.white} />
        <Text style={styles.quickActionText}>Manage Payments</Text>
      </TouchableOpacity>

      {/* Example 5: Settings Menu Item */}
      <Text style={styles.subtitle}>From Settings Menu:</Text>
      <TouchableOpacity 
        style={styles.menuItem}
        onPress={() => router.push('/payment-methods' as any)}
      >
        <View style={styles.menuIcon}>
          <Ionicons name="card" size={18} color={Colors.primary.teal} />
        </View>
        <View style={styles.menuContent}>
          <Text style={styles.menuTitle}>Payment & Billing</Text>
          <Text style={styles.menuSubtitle}>Cards, UPI, wallets & billing</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={Colors.text.secondary} />
      </TouchableOpacity>

      {/* Example 6: Add Payment Shortcut */}
      <Text style={styles.subtitle}>Add Payment Method Shortcut:</Text>
      <TouchableOpacity 
        style={styles.addPaymentShortcut}
        onPress={() => router.push('/payment-methods' as any)}
      >
        <View style={styles.addIcon}>
          <Ionicons name="add" size={18} color={Colors.primary.teal} />
        </View>
        <Text style={styles.addPaymentText}>Add Payment Method</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: Colors.background.lightGrey,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginTop: 20,
    marginBottom: 8,
  },
  
  // Example 1: Settings Style Button
  exampleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.background.white,
    borderRadius: 12,
    gap: 12,
  },
  buttonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.primary,
  },

  // Example 2: Payment Selector
  paymentSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.background.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  paymentInfo: {
    flex: 1,
  },
  paymentLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  paymentText: {
    fontSize: 16,
    color: Colors.text.primary,
  },

  // Example 3: Booking Card
  bookingCard: {
    backgroundColor: Colors.background.white,
    borderRadius: 12,
    padding: 16,
  },
  bookingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  changePaymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  selectedPayment: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardIcon: {
    fontSize: 20,
  },
  selectedPaymentText: {
    fontSize: 14,
    color: Colors.text.primary,
  },
  changeText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.teal,
  },

  // Example 4: Quick Action
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: Colors.primary.teal,
    borderRadius: 12,
    gap: 8,
  },
  quickActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.white,
  },

  // Example 5: Menu Item
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.background.white,
    borderRadius: 12,
    gap: 12,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary.teal + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 12,
    color: Colors.text.secondary,
  },

  // Example 6: Add Payment Shortcut
  addPaymentShortcut: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.background.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary.teal,
    borderStyle: 'dashed',
    gap: 12,
  },
  addIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary.teal + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPaymentText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary.teal,
  },
});

export default PaymentMethodsNavigationExamples;

