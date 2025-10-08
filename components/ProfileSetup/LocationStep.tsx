import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import React, { useState } from 'react';
import {
    Alert,
    Animated,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import { ProfileData } from '../ProfileSetupScreen';

interface LocationStepProps {
  profileData: ProfileData;
  updateProfileData: (data: Partial<ProfileData>) => void;
  onNext: () => void;
  onSkip: () => void;
}

const indianStates = [
  'Select State',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
];

// Sample cities data - in a real app, this would be fetched based on selected state
const citiesByState: { [key: string]: string[] } = {
  'Karnataka': ['Select City', 'Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum'],
  'Maharashtra': ['Select City', 'Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
  'Tamil Nadu': ['Select City', 'Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli'],
  'Delhi': ['Select City', 'New Delhi', 'Central Delhi', 'South Delhi', 'North Delhi', 'East Delhi'],
  'Gujarat': ['Select City', 'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar'],
};

export default function LocationStep({
  profileData,
  updateProfileData,
  onNext,
  onSkip,
}: LocationStepProps) {
  const [animatedValue] = useState(new Animated.Value(0));
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const getCurrentLocation = async () => {
    setLocationLoading(true);
    
    try {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Location permission is needed to use current location feature.',
          [{ text: 'OK' }]
        );
        setLocationLoading(false);
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({});
      
      // Reverse geocoding to get address
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        updateProfileData({
          state: address.region || '',
          city: address.city || '',
          pincode: address.postalCode || '',
          useCurrentLocation: true,
        });
        
        Alert.alert('Success', 'Location detected successfully!');
      } else {
        Alert.alert('Error', 'Could not determine your location. Please enter manually.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get current location. Please enter manually.');
    } finally {
      setLocationLoading(false);
    }
  };

  const handleStateSelect = (state: string) => {
    if (state !== 'Select State') {
      updateProfileData({ state, city: '' }); // Reset city when state changes
    }
    setShowStateDropdown(false);
  };

  const handleCitySelect = (city: string) => {
    if (city !== 'Select City') {
      updateProfileData({ city });
    }
    setShowCityDropdown(false);
  };

  const availableCities = profileData.state && profileData.state !== 'Select State' 
    ? citiesByState[profileData.state] || ['Select City']
    : ['Select City'];

  const isFormValid = () => {
    return profileData.state && 
           profileData.state !== 'Select State' && 
           profileData.city && 
           profileData.city !== 'Select City' && 
           profileData.pincode && 
           profileData.pincode.length === 6;
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <Animated.View style={[{
          opacity: animatedValue,
          transform: [{
            translateY: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [30, 0],
            })
          }]
        }]}>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
          {/* Current Location Button */}
          <View style={styles.locationSection}>
            <TouchableOpacity
              style={styles.currentLocationButton}
              onPress={getCurrentLocation}
              disabled={locationLoading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[Colors.primary.teal, '#20A39E', '#1A8B87']}
                style={styles.currentLocationGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons 
                  name={locationLoading ? "refresh" : "location"} 
                  size={20} 
                  color="#ffffff" 
                  style={[locationLoading && { transform: [{ rotate: '45deg' }] }]}
                />
                <Text style={styles.currentLocationText}>
                  {locationLoading ? 'Getting Location...' : 'Use Current Location'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <Text style={styles.orText}>or enter manually</Text>
          </View>

          {/* Manual Entry Form */}
          <View style={styles.formSection}>
            {/* State Dropdown */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>State *</Text>
              <TouchableOpacity
                style={styles.dropdownContainer}
                onPress={() => setShowStateDropdown(!showStateDropdown)}
                activeOpacity={0.7}
              >
                <Ionicons name="location-outline" size={20} color={Colors.text.secondary} style={styles.inputIcon} />
                <Text style={[
                  styles.dropdownText,
                  (!profileData.state || profileData.state === 'Select State') && styles.placeholder
                ]}>
                  {profileData.state || 'Select State'}
                </Text>
                <Ionicons 
                  name={showStateDropdown ? "chevron-up" : "chevron-down"} 
                  size={16} 
                  color={Colors.text.secondary} 
                />
              </TouchableOpacity>

              {showStateDropdown && (
                <View style={styles.dropdown}>
                  <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                    {indianStates.map((state, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownItem}
                        onPress={() => handleStateSelect(state)}
                      >
                        <Text style={[
                          styles.dropdownItemText,
                          index === 0 && styles.dropdownPlaceholder
                        ]}>
                          {state}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* City Dropdown */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>City *</Text>
              <TouchableOpacity
                style={[
                  styles.dropdownContainer,
                  (!profileData.state || profileData.state === 'Select State') && styles.disabled
                ]}
                onPress={() => setShowCityDropdown(!showCityDropdown)}
                disabled={!profileData.state || profileData.state === 'Select State'}
                activeOpacity={0.7}
              >
                <Ionicons name="business-outline" size={20} color={Colors.text.secondary} style={styles.inputIcon} />
                <Text style={[
                  styles.dropdownText,
                  (!profileData.city || profileData.city === 'Select City') && styles.placeholder
                ]}>
                  {profileData.city || 'Select City'}
                </Text>
                <Ionicons 
                  name={showCityDropdown ? "chevron-up" : "chevron-down"} 
                  size={16} 
                  color={Colors.text.secondary} 
                />
              </TouchableOpacity>

              {showCityDropdown && (
                <View style={styles.dropdown}>
                  <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                    {availableCities.map((city, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownItem}
                        onPress={() => handleCitySelect(city)}
                      >
                        <Text style={[
                          styles.dropdownItemText,
                          index === 0 && styles.dropdownPlaceholder
                        ]}>
                          {city}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Pincode */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Pincode *</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color={Colors.text.secondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={profileData.pincode}
                  onChangeText={(text) => updateProfileData({ pincode: text.replace(/[^0-9]/g, '') })}
                  placeholder="Enter 6-digit pincode"
                  placeholderTextColor={Colors.text.secondary}
                  keyboardType="numeric"
                  maxLength={6}
                />
              </View>
            </View>
          </View>

          {/* Info Section */}
          <View style={styles.infoSection}>
            <View style={styles.infoCard}>
              <Ionicons name="car-outline" size={24} color={Colors.primary.teal} />
              <Text style={styles.infoText}>
                This helps us show nearby vehicles and provide accurate pickup locations for your rides.
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            <TouchableOpacity
              style={[
                styles.continueButton,
                !isFormValid() && styles.continueButtonDisabled
              ]}
              onPress={onNext}
              disabled={!isFormValid()}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={isFormValid() 
                  ? [Colors.primary.teal, '#20A39E', '#1A8B87']
                  : ['#E5E7EB', '#E5E7EB']
                }
                style={styles.continueButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={[
                  styles.continueButtonText,
                  !isFormValid() && styles.continueButtonTextDisabled
                ]}>
                  Continue
                </Text>
                <Ionicons 
                  name="arrow-forward" 
                  size={18} 
                  color={isFormValid() ? "#ffffff" : "#9CA3AF"} 
                  style={styles.continueIcon} 
                />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    flexGrow: 1,
  },
  locationSection: {
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 16,
  },
  currentLocationButton: {
    width: '100%',
    marginBottom: 12,
    shadowColor: Colors.primary.teal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  currentLocationGradient: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  currentLocationText: {
    fontSize: Typography.sizes.body,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
  orText: {
    fontSize: Typography.sizes.caption,
    fontWeight: '500',
    color: Colors.text.secondary,
    textAlign: 'center',
    marginVertical: 8,
  },
  formSection: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
    position: 'relative',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 48,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 48,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  disabled: {
    opacity: 0.5,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '400',
    color: Colors.text.primary,
  },
  dropdownText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '400',
    color: Colors.text.primary,
  },
  placeholder: {
    color: Colors.text.secondary,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    maxHeight: 200,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  dropdownScroll: {
    maxHeight: 180,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemText: {
    fontSize: Typography.sizes.body,
    fontWeight: '400',
    color: Colors.text.primary,
  },
  dropdownPlaceholder: {
    color: Colors.text.secondary,
    fontStyle: 'italic',
  },
  infoSection: {
    marginBottom: 25,
  },
  infoCard: {
    backgroundColor: 'rgba(45, 155, 142, 0.05)',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(45, 155, 142, 0.1)',
  },
  infoText: {
    flex: 1,
    fontSize: Typography.sizes.caption,
    fontWeight: '400',
    color: Colors.text.secondary,
    lineHeight: 18,
    marginLeft: 12,
  },
  actionSection: {
    marginTop: 20,
  },
  continueButton: {
    marginBottom: 12,
    shadowColor: Colors.primary.teal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  continueButtonDisabled: {
    shadowOpacity: 0,
    elevation: 0,
    opacity: 0.6,
  },
  continueButtonGradient: {
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  continueButtonTextDisabled: {
    color: '#9CA3AF',
  },
  continueIcon: {
    marginLeft: 8,
  },
});