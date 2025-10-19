import { Colors } from '@/src/shared/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView, 
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  latitude?: number;
  longitude?: number;
}

interface AddressForm {
  type: 'home' | 'work' | 'other';
  label: string;
  fullAddress: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

interface FormErrors {
  fullAddress?: string;
  city?: string;
  state?: string;
  pincode?: string;
  label?: string;
}

export default function SavedAddressesScreen() {
  const router = useRouter();
  
  // State management
  const [addresses, setAddresses] = useState<Address[]>([
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
      latitude: 12.9352,
      longitude: 77.6245,
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
      latitude: 12.9716,
      longitude: 77.5946,
    },
  ]);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<AddressForm>({
    type: 'home',
    label: '',
    fullAddress: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  // Address type options
  const addressTypes = [
    { value: 'home', label: 'Home', icon: 'home' },
    { value: 'work', label: 'Work', icon: 'briefcase' },
    { value: 'other', label: 'Other', icon: 'location' },
  ];

  // Indian cities and states (sample data)
  const cities = [
    'Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad'
  ];

  const states = [
    'Karnataka', 'Maharashtra', 'Delhi', 'Tamil Nadu', 'Telangana', 'Gujarat', 'West Bengal'
  ];

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullAddress.trim()) {
      newErrors.fullAddress = 'Address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }

    if (formData.type === 'other' && !formData.label.trim()) {
      newErrors.label = 'Label is required for custom address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handlers
  const handleAddAddress = () => {
    setEditingAddress(null);
    setFormData({
      type: 'home',
      label: '',
      fullAddress: '',
      landmark: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: addresses.length === 0,
    });
    setErrors({});
    setShowAddressForm(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      type: address.type,
      label: address.label,
      fullAddress: address.fullAddress,
      landmark: address.landmark || '',
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      isDefault: address.isDefault,
    });
    setErrors({});
    setShowAddressForm(true);
  };

  const handleDeleteAddress = (id: string) => {
    const address = addresses.find(addr => addr.id === id);
    if (!address) return;

    Alert.alert(
      'Delete Address',
      `Are you sure you want to delete "${address.label}" address?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setAddresses(prev => {
              const filtered = prev.filter(addr => addr.id !== id);
              // If deleted address was default, make first address default
              if (address.isDefault && filtered.length > 0) {
                filtered[0].isDefault = true;
              }
              return filtered;
            });
          }
        }
      ]
    );
  };

  const handleSetDefault = (id: string) => {
    setAddresses(prev => 
      prev.map(addr => ({
        ...addr,
        isDefault: addr.id === id
      }))
    );
  };

  const handleSaveAddress = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const addressData: Address = {
        id: editingAddress?.id || Date.now().toString(),
        type: formData.type,
        label: formData.type === 'other' ? formData.label : 
               addressTypes.find(t => t.value === formData.type)?.label || '',
        fullAddress: formData.fullAddress,
        landmark: formData.landmark,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        isDefault: formData.isDefault,
      };

      if (editingAddress) {
        // Update existing address
        setAddresses(prev => 
          prev.map(addr => {
            if (addr.id === editingAddress.id) {
              return addressData;
            }
            // Remove default from other addresses if this one is set as default
            if (formData.isDefault && addr.isDefault) {
              return { ...addr, isDefault: false };
            }
            return addr;
          })
        );
      } else {
        // Add new address
        setAddresses(prev => {
          const updated = formData.isDefault 
            ? prev.map(addr => ({ ...addr, isDefault: false }))
            : prev;
          return [...updated, addressData];
        });
      }

      setShowAddressForm(false);
      Alert.alert('Success', `Address ${editingAddress ? 'updated' : 'added'} successfully!`);
    } catch (error) {
      Alert.alert('Error', 'Failed to save address. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseCurrentLocation = async () => {
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location access is required to use this feature.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (address.length > 0) {
        const addr = address[0];
        setFormData(prev => ({
          ...prev,
          fullAddress: `${addr.street || ''} ${addr.streetNumber || ''}`.trim(),
          city: addr.city || '',
          state: addr.region || '',
          pincode: addr.postalCode || '',
        }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get current location. Please try again.');
    } finally {
      setLocationLoading(false);
    }
  };

  const updateFormField = (field: keyof AddressForm, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'home': return 'home';
      case 'work': return 'briefcase';
      default: return 'location';
    }
  };

  const renderAddressCard = (address: Address) => (
    <View key={address.id} style={styles.addressCard}>
      <View style={styles.addressHeader}>
        <View style={styles.addressTypeContainer}>
          <View style={[styles.typeIcon, { backgroundColor: Colors.primary.teal + '15' }]}>
            <Ionicons 
              name={getAddressIcon(address.type) as any} 
              size={18} 
              color={Colors.primary.teal} 
            />
          </View>
          <View style={styles.addressLabelContainer}>
            <Text style={styles.addressLabel}>{address.label}</Text>
            {address.isDefault && (
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultBadgeText}>Default</Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.addressActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleEditAddress(address)}
          >
            <Ionicons name="pencil" size={16} color={Colors.text.secondary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleDeleteAddress(address.id)}
          >
            <Ionicons name="trash" size={16} color={Colors.functional.error} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.addressDetails}>
        <Text style={styles.fullAddress}>{address.fullAddress}</Text>
        {address.landmark && (
          <Text style={styles.landmark}>Near {address.landmark}</Text>
        )}
        <Text style={styles.cityState}>
          {address.city}, {address.state} - {address.pincode}
        </Text>
      </View>

      {!address.isDefault && (
        <TouchableOpacity 
          style={styles.setDefaultButton}
          onPress={() => handleSetDefault(address.id)}
        >
          <Text style={styles.setDefaultText}>Set as Default</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Ionicons name="location-outline" size={80} color={Colors.text.light} />
      </View>
      <Text style={styles.emptyTitle}>No saved addresses</Text>
      <Text style={styles.emptySubtitle}>Add address for faster checkout</Text>
      <TouchableOpacity style={styles.emptyAddButton} onPress={handleAddAddress}>
        <Text style={styles.emptyAddButtonText}>Add Address</Text>
      </TouchableOpacity>
    </View>
  );

  const renderAddressForm = () => (
    <Modal
      visible={showAddressForm}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowAddressForm(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        {/* Form Header */}
        <View style={styles.formHeader}>
          <TouchableOpacity 
            onPress={() => setShowAddressForm(false)}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <Text style={styles.formTitle}>
            {editingAddress ? 'Edit Address' : 'Add New Address'}
          </Text>
          
          <TouchableOpacity 
            onPress={handleSaveAddress}
            style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
            disabled={isLoading}
          >
            <Text style={[styles.saveButtonText, isLoading && styles.saveButtonTextDisabled]}>
              {isLoading ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView 
          style={styles.formKeyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView style={styles.formScrollView} showsVerticalScrollIndicator={false}>
            {/* Address Type Selection */}
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Address Type</Text>
              <View style={styles.typeSelector}>
                {addressTypes.map((type) => (
                  <TouchableOpacity
                    key={type.value}
                    style={[
                      styles.typeOption,
                      formData.type === type.value && styles.typeOptionActive
                    ]}
                    onPress={() => updateFormField('type', type.value)}
                  >
                    <Ionicons 
                      name={type.icon as any} 
                      size={20} 
                      color={formData.type === type.value ? Colors.text.white : Colors.text.secondary} 
                    />
                    <Text style={[
                      styles.typeOptionText,
                      formData.type === type.value && styles.typeOptionTextActive
                    ]}>
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Custom Label (for Other type) */}
            {formData.type === 'other' && (
              <View style={styles.formSection}>
                <Text style={styles.inputLabel}>
                  Label <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.textInput, errors.label && styles.inputError]}
                  value={formData.label}
                  onChangeText={(text) => updateFormField('label', text)}
                  placeholder="e.g., Friend's Place, Gym"
                  placeholderTextColor={Colors.text.light}
                />
                {errors.label && (
                  <Text style={styles.errorText}>{errors.label}</Text>
                )}
              </View>
            )}

            {/* Complete Address */}
            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>
                Complete Address <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.textArea, errors.fullAddress && styles.inputError]}
                value={formData.fullAddress}
                onChangeText={(text) => updateFormField('fullAddress', text)}
                placeholder="House/Flat no., Building name, Street"
                placeholderTextColor={Colors.text.light}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
              {errors.fullAddress && (
                <Text style={styles.errorText}>{errors.fullAddress}</Text>
              )}
            </View>

            {/* Landmark */}
            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>Landmark (Optional)</Text>
              <TextInput
                style={styles.textInput}
                value={formData.landmark}
                onChangeText={(text) => updateFormField('landmark', text)}
                placeholder="e.g., Near Metro Station"
                placeholderTextColor={Colors.text.light}
              />
            </View>

            {/* City and State */}
            <View style={styles.formRow}>
              <View style={[styles.formSection, styles.halfWidth]}>
                <Text style={styles.inputLabel}>
                  City <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.textInput, errors.city && styles.inputError]}
                  value={formData.city}
                  onChangeText={(text) => updateFormField('city', text)}
                  placeholder="Select city"
                  placeholderTextColor={Colors.text.light}
                />
                {errors.city && (
                  <Text style={styles.errorText}>{errors.city}</Text>
                )}
              </View>

              <View style={[styles.formSection, styles.halfWidth]}>
                <Text style={styles.inputLabel}>
                  State <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.textInput, errors.state && styles.inputError]}
                  value={formData.state}
                  onChangeText={(text) => updateFormField('state', text)}
                  placeholder="Select state"
                  placeholderTextColor={Colors.text.light}
                />
                {errors.state && (
                  <Text style={styles.errorText}>{errors.state}</Text>
                )}
              </View>
            </View>

            {/* Pincode */}
            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>
                Pincode <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.textInput, errors.pincode && styles.inputError]}
                value={formData.pincode}
                onChangeText={(text) => updateFormField('pincode', text)}
                placeholder="000000"
                placeholderTextColor={Colors.text.light}
                keyboardType="numeric"
                maxLength={6}
              />
              {errors.pincode && (
                <Text style={styles.errorText}>{errors.pincode}</Text>
              )}
            </View>

            {/* Use Current Location */}
            <TouchableOpacity 
              style={styles.locationButton}
              onPress={handleUseCurrentLocation}
              disabled={locationLoading}
            >
              <Ionicons 
                name="location" 
                size={20} 
                color={Colors.primary.teal} 
              />
              <Text style={styles.locationButtonText}>
                {locationLoading ? 'Getting location...' : 'Use Current Location'}
              </Text>
            </TouchableOpacity>

            {/* Set as Default */}
            <TouchableOpacity 
              style={styles.checkboxContainer}
              onPress={() => updateFormField('isDefault', !formData.isDefault)}
            >
              <View style={[styles.checkbox, formData.isDefault && styles.checkboxActive]}>
                {formData.isDefault && (
                  <Ionicons name="checkmark" size={16} color={Colors.text.white} />
                )}
              </View>
              <Text style={styles.checkboxLabel}>Set as default address</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={20} color={Colors.text.primary} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Saved Addresses</Text>
        
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddAddress}
        >
          <Ionicons name="add" size={20} color={Colors.text.white} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      {addresses.length > 0 ? (
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {addresses.map(renderAddressCard)}
        </ScrollView>
      ) : (
        renderEmptyState()
      )}

      {/* Add/Edit Address Form Modal */}
      {renderAddressForm()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.lightGrey,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Colors.background.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Content
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },

  // Address Cards
  addressCard: {
    backgroundColor: Colors.background.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  addressTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  typeIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addressLabelContainer: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  defaultBadge: {
    backgroundColor: Colors.functional.success,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  defaultBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.text.white,
    textTransform: 'uppercase',
  },
  addressActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressDetails: {
    marginBottom: 12,
  },
  fullAddress: {
    fontSize: 14,
    color: Colors.text.primary,
    lineHeight: 20,
    marginBottom: 4,
  },
  landmark: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  cityState: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  setDefaultButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary.teal,
    backgroundColor: Colors.primary.teal + '10',
    alignSelf: 'flex-start',
  },
  setDefaultText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary.teal,
  },

  // Empty State
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    marginBottom: 24,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  emptyAddButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: Colors.primary.teal,
  },
  emptyAddButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.white,
  },

  // Form Modal
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background.lightGrey,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
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
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.primary.teal,
  },
  saveButtonDisabled: {
    backgroundColor: Colors.background.lightGrey,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.white,
  },
  saveButtonTextDisabled: {
    color: Colors.text.secondary,
  },
  formKeyboardView: {
    flex: 1,
  },
  formScrollView: {
    flex: 1,
  },

  // Form Sections
  formSection: {
    backgroundColor: Colors.background.white,
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: Colors.background.white,
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  halfWidth: {
    flex: 1,
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginTop: 0,
    backgroundColor: 'transparent',
  },

  // Address Type Selector
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  typeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: Colors.background.white,
    gap: 8,
  },
  typeOptionActive: {
    backgroundColor: Colors.primary.teal,
    borderColor: Colors.primary.teal,
  },
  typeOptionText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  typeOptionTextActive: {
    color: Colors.text.white,
  },

  // Form Inputs
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  required: {
    color: Colors.functional.error,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text.primary,
    backgroundColor: Colors.background.white,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text.primary,
    backgroundColor: Colors.background.white,
    height: 80,
  },
  inputError: {
    borderColor: Colors.functional.error,
  },
  errorText: {
    fontSize: 12,
    color: Colors.functional.error,
    marginTop: 4,
  },

  // Location Button
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary.teal,
    backgroundColor: Colors.primary.teal + '10',
    marginHorizontal: 20,
    marginTop: 12,
    gap: 8,
  },
  locationButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.teal,
  },

  // Checkbox
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 12,
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: Colors.primary.teal,
    borderColor: Colors.primary.teal,
  },
  checkboxLabel: {
    fontSize: 14,
    color: Colors.text.primary,
  },
});