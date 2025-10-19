/**
 * Example: How to navigate to Saved Addresses Screen
 * 
 * This file demonstrates different ways to navigate to the saved addresses screen
 * from various parts of your app.
 */

import { Colors } from '@/src/shared/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const SavedAddressesNavigationExamples = () => {
  const router = useRouter();

  return (
    <View style={styles.container}> 
      <Text style={styles.title}>Navigate to Saved Addresses</Text>
      
      {/* Example 1: From Edit Profile Screen */}
      <Text style={styles.subtitle}>From Edit Profile (Already implemented):</Text>
      <TouchableOpacity 
        style={styles.exampleButton}
        onPress={() => router.push('/saved-addresses-page' as any)}
      >
        <Ionicons name="location" size={20} color={Colors.primary.teal} />
        <Text style={styles.buttonText}>Saved Addresses</Text>
        <Ionicons name="chevron-forward" size={16} color={Colors.text.secondary} />
      </TouchableOpacity>

      {/* Example 2: From Home Screen Header */}
      <Text style={styles.subtitle}>From Home Screen Header:</Text>
      <TouchableOpacity 
        style={styles.headerButton}
        onPress={() => router.push('/saved-addresses' as any)}
      >
        <Ionicons name="location" size={20} color={Colors.text.white} />
      </TouchableOpacity>

      {/* Example 3: From Booking Flow */}
      <Text style={styles.subtitle}>During Booking (Delivery Address):</Text>
      <TouchableOpacity 
        style={styles.addressSelector}
        onPress={() => router.push('/saved-addresses' as any)}
      >
        <View style={styles.addressInfo}>
          <Text style={styles.addressLabel}>Delivery Address</Text>
          <Text style={styles.addressText}>Choose from saved addresses</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={Colors.text.secondary} />
      </TouchableOpacity>

      {/* Example 4: From Profile Menu */}
      <Text style={styles.subtitle}>From Profile Tab Menu:</Text>
      <TouchableOpacity 
        style={styles.menuItem}
        onPress={() => router.push('/saved-addresses' as any)}
      >
        <View style={styles.menuIcon}>
          <Ionicons name="location" size={18} color={Colors.primary.teal} />
        </View>
        <View style={styles.menuContent}>
          <Text style={styles.menuTitle}>Manage Addresses</Text>
          <Text style={styles.menuSubtitle}>Add, edit or remove addresses</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={Colors.text.secondary} />
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

  // Example 2: Header Button
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Example 3: Address Selector
  addressSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.background.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  addressInfo: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  addressText: {
    fontSize: 16,
    color: Colors.text.primary,
  },

  // Example 4: Menu Item
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
});

export default SavedAddressesNavigationExamples;
