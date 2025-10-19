/**
 * Example: Booking Integration with Saved Addresses
 * 
 * This example shows how to integrate the saved addresses screen
 * with a booking flow for address selection.
 */

import { Colors } from '@/src/shared/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Address {
  id: string;
  type: 'home' | 'work' | 'other'; 
  label: string;
  fullAddress: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export const BookingWithSavedAddresses = () => {
  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showAddressSelector, setShowAddressSelector] = useState(false);

  // Sample saved addresses (would come from state/API)
  const savedAddresses: Address[] = [
    {
      id: '1',
      type: 'home',
      label: 'Home',
      fullAddress: '123 MG Road, Koramangala',
      landmark: 'Near Forum Mall',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560095',
      isDefault: true,
    },
    {
      id: '2',
      type: 'work',
      label: 'Office',
      fullAddress: '456 Brigade Road, Commercial Street',
      landmark: 'Next to Metro Station',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      isDefault: false,
    },
  ];

  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address);
    setShowAddressSelector(false);
  };

  const handleManageAddresses = () => {
    setShowAddressSelector(false);
    router.push('/saved-addresses' as any);
  };

  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'home': return 'home';
      case 'work': return 'briefcase';
      default: return 'location';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking - Address Selection</Text>

      {/* Address Selection Field */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Delivery Address</Text>
        <TouchableOpacity 
          style={styles.addressField}
          onPress={() => setShowAddressSelector(true)}
        >
          {selectedAddress ? (
            <View style={styles.selectedAddressContainer}>
              <View style={styles.addressTypeIcon}>
                <Ionicons 
                  name={getAddressIcon(selectedAddress.type) as any} 
                  size={16} 
                  color={Colors.primary.teal} 
                />
              </View>
              <View style={styles.addressDetails}>
                <Text style={styles.addressLabel}>{selectedAddress.label}</Text>
                <Text style={styles.addressText}>{selectedAddress.fullAddress}</Text>
                <Text style={styles.addressSubtext}>
                  {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.placeholderContainer}>
              <Ionicons name="location-outline" size={20} color={Colors.text.secondary} />
              <Text style={styles.placeholderText}>Select delivery address</Text>
            </View>
          )}
          <Ionicons name="chevron-down" size={16} color={Colors.text.secondary} />
        </TouchableOpacity>
      </View>

      {/* Address Selector Modal */}
      <Modal
        visible={showAddressSelector}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddressSelector(false)}
      >
        <View style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={() => setShowAddressSelector(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            
            <Text style={styles.modalTitle}>Select Address</Text>
            
            <TouchableOpacity 
              onPress={handleManageAddresses}
              style={styles.manageButton}
            >
              <Text style={styles.manageText}>Manage</Text>
            </TouchableOpacity>
          </View>

          {/* Address List */}
          <View style={styles.addressList}>
            {savedAddresses.map((address) => (
              <TouchableOpacity
                key={address.id}
                style={[
                  styles.addressOption,
                  selectedAddress?.id === address.id && styles.addressOptionSelected
                ]}
                onPress={() => handleAddressSelect(address)}
              >
                <View style={styles.addressOptionIcon}>
                  <Ionicons 
                    name={getAddressIcon(address.type) as any} 
                    size={18} 
                    color={Colors.primary.teal} 
                  />
                </View>
                
                <View style={styles.addressOptionDetails}>
                  <View style={styles.addressOptionHeader}>
                    <Text style={styles.addressOptionLabel}>{address.label}</Text>
                    {address.isDefault && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultBadgeText}>Default</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.addressOptionText}>{address.fullAddress}</Text>
                  {address.landmark && (
                    <Text style={styles.addressOptionLandmark}>Near {address.landmark}</Text>
                  )}
                  <Text style={styles.addressOptionSubtext}>
                    {address.city}, {address.state} - {address.pincode}
                  </Text>
                </View>

                {selectedAddress?.id === address.id && (
                  <Ionicons name="checkmark-circle" size={20} color={Colors.primary.teal} />
                )}
              </TouchableOpacity>
            ))}

            {/* Add New Address Option */}
            <TouchableOpacity 
              style={styles.addAddressOption}
              onPress={handleManageAddresses}
            >
              <View style={styles.addAddressIcon}>
                <Ionicons name="add" size={18} color={Colors.primary.teal} />
              </View>
              <Text style={styles.addAddressText}>Add New Address</Text>
            </TouchableOpacity>
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
    marginBottom: 24,
  },

  // Form
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  addressField: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.background.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 60,
  },

  // Selected Address
  selectedAddressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  addressTypeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary.teal + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addressDetails: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  addressText: {
    fontSize: 13,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  addressSubtext: {
    fontSize: 11,
    color: Colors.text.secondary,
  },

  // Placeholder
  placeholderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  placeholderText: {
    fontSize: 16,
    color: Colors.text.secondary,
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

  // Address List
  addressList: {
    padding: 16,
  },
  addressOption: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: Colors.background.white,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  addressOptionSelected: {
    borderColor: Colors.primary.teal,
    backgroundColor: Colors.primary.teal + '05',
  },
  addressOptionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary.teal + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addressOptionDetails: {
    flex: 1,
  },
  addressOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  addressOptionLabel: {
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
  addressOptionText: {
    fontSize: 14,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  addressOptionLandmark: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  addressOptionSubtext: {
    fontSize: 12,
    color: Colors.text.secondary,
  },

  // Add Address Option
  addAddressOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.background.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary.teal,
    borderStyle: 'dashed',
  },
  addAddressIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary.teal + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addAddressText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary.teal,
  },
});

export default BookingWithSavedAddresses;
