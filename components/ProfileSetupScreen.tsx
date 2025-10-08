import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export interface ProfileData {
  // Step 1: Basic Details
  profilePhoto?: string;
  fullName: string;
  email: string;
  dateOfBirth: Date | null;
  gender: string;
  
  // Step 2: Location
  useCurrentLocation: boolean;
  state: string;
  city: string;
  pincode: string;
  
  // Step 3: Preferences
  favoriteVehicleTypes: string[];
  typicalUsage: string;
}

const initialProfileData: ProfileData = {
  fullName: '',
  email: '',
  dateOfBirth: null,
  gender: '',
  useCurrentLocation: false,
  state: '',
  city: '',
  pincode: '',
  favoriteVehicleTypes: [],
  typicalUsage: '',
};

interface DatePickerProps {
  visible: boolean;
  onClose: () => void;
  onDateSelect: (date: Date) => void;
  initialDate?: Date;
}

const CustomDatePicker: React.FC<DatePickerProps> = ({ visible, onClose, onDateSelect, initialDate = new Date() }) => {
  const [selectedDay, setSelectedDay] = useState(initialDate.getDate());
  const [selectedMonth, setSelectedMonth] = useState(initialDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(initialDate.getFullYear());
  const [activeTab, setActiveTab] = useState(0); // 0: Day, 1: Month, 2: Year

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const years = Array.from({ length: 80 }, (_, i) => new Date().getFullYear() - i);

  const handleConfirm = () => {
    const date = new Date(selectedYear, selectedMonth, selectedDay);
    onDateSelect(date);
    onClose();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0: // Days
        return (
          <FlatList
            key="days"
            data={days}
            numColumns={7}
            keyExtractor={(item) => item.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.dateItem,
                  selectedDay === item && styles.dateItemSelected
                ]}
                onPress={() => setSelectedDay(item)}
              >
                <Text style={[
                  styles.dateText,
                  selectedDay === item && styles.dateTextSelected
                ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        );
      case 1: // Months
        return (
          <FlatList
            key="months"
            data={months}
            numColumns={3}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={[
                  styles.monthItem,
                  selectedMonth === index && styles.dateItemSelected
                ]}
                onPress={() => setSelectedMonth(index)}
              >
                <Text style={[
                  styles.dateText,
                  selectedMonth === index && styles.dateTextSelected
                ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        );
      case 2: // Years
        return (
          <FlatList
            key="years"
            data={years}
            numColumns={4}
            keyExtractor={(item) => item.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.yearItem,
                  selectedYear === item && styles.dateItemSelected
                ]}
                onPress={() => setSelectedYear(item)}
              >
                <Text style={[
                  styles.dateText,
                  selectedYear === item && styles.dateTextSelected
                ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.datePickerContainer}>
          <View style={styles.datePickerHeader}>
            <Text style={styles.datePickerTitle}>Select Date</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={Colors.text.secondary} />
            </TouchableOpacity>
          </View>

          {/* Date Preview */}
          <View style={styles.datePreview}>
            <Text style={styles.datePreviewText}>
              {selectedDay} {months[selectedMonth]} {selectedYear}
            </Text>
          </View>

          {/* Tabs */}
          <View style={styles.tabContainer}>
            {['Day', 'Month', 'Year'].map((tab, index) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tab,
                  activeTab === index && styles.activeTab
                ]}
                onPress={() => setActiveTab(index)}
              >
                <Text style={[
                  styles.tabText,
                  activeTab === index && styles.activeTabText
                ]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content */}
          <View style={styles.tabContent}>
            {renderTabContent()}
          </View>

          {/* Action Buttons */}
          <View style={styles.datePickerActions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <LinearGradient
                colors={[Colors.primary.teal, Colors.accent.blue]}
                style={styles.confirmButtonGradient}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default function ProfileSetupScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState<ProfileData>(initialProfileData);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentStep]);

  const updateProfileData = (data: Partial<ProfileData>) => {
    setProfileData(prev => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinishSetup();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    if (currentStep === 1) {
      Alert.alert(
        'Skip Profile Setup?',
        'You can complete your profile later in settings.',
        [
          { text: 'Continue Setup', style: 'cancel' },
          { text: 'Skip', onPress: () => router.push('/(tabs)' as any) },
        ]
      );
    } else if (currentStep === 3) {
      handleFinishSetup();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleFinishSetup = () => {
    console.log('Profile Setup Complete:', profileData);
    router.push('/home-permission' as any);
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Complete Your Profile';
      case 2: return 'Where Are You?';
      case 3: return 'Tell Us Your Preferences';
      default: return '';
    }
  };

  const getStepSubtitle = () => {
    switch (currentStep) {
      case 1: return 'Help us personalize your experience';
      case 2: return 'This helps us show nearby vehicles';
      case 3: return 'We\'ll recommend the best options for you';
      default: return '';
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to change your profile photo.');
      return;
    }

    Alert.alert(
      'Select Image',
      'Choose an option',
      [
        { text: 'Camera', onPress: openCamera },
        { text: 'Gallery', onPress: openGallery },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const openCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      updateProfileData({ profilePhoto: result.assets[0].uri });
    }
  };

  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      updateProfileData({ profilePhoto: result.assets[0].uri });
    }
  };

  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const getCurrentLocation = async () => {
    try {
      setIsLoadingLocation(true);
      
      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission Required',
          'Please allow location access to automatically fill your address. You can also enter it manually below.',
          [
            { text: 'Settings', onPress: () => Location.requestForegroundPermissionsAsync() },
            { text: 'Enter Manually', style: 'cancel' }
          ]
        );
        setIsLoadingLocation(false);
        return;
      }

      // Get current position
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Reverse geocode to get address
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (address.length > 0) {
        const addr = address[0];
        updateProfileData({
          useCurrentLocation: true,
          state: addr.region || addr.subregion || '',
          city: addr.city || addr.district || '',
          pincode: addr.postalCode || '',
        });
        
        Alert.alert(
          'Location Found!',
          `We've found your location: ${addr.city || addr.district}, ${addr.region || addr.subregion}. You can edit the details if needed.`,
          [{ text: 'OK' }]
        );
      } else {
        throw new Error('Unable to get address details');
      }
    } catch (error) {
      console.error('Location error:', error);
      Alert.alert(
        'Location Error', 
        'Could not get your current location. Please check your GPS and internet connection, or enter your address manually.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const isStep1Valid = () => {
    return profileData.fullName.trim().length >= 2 && 
           profileData.email.trim().length > 0 &&
           /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email.trim());
  };

  const isStep2Valid = () => {
    return profileData.state.trim().length > 0 && 
           profileData.city.trim().length > 0 &&
           profileData.pincode.trim().length === 6;
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      {[1, 2, 3].map((step) => (
        <View key={step} style={styles.progressStep}>
          <View style={[
            styles.progressDot,
            currentStep >= step && styles.progressDotActive
          ]}>
            {currentStep > step ? (
              <Ionicons name="checkmark" size={12} color="#ffffff" />
            ) : (
              <Text style={[
                styles.progressText,
                currentStep >= step && styles.progressTextActive
              ]}>
                {step}
              </Text>
            )}
          </View>
          {step < 3 && (
            <View style={[
              styles.progressLine,
              currentStep > step && styles.progressLineActive
            ]} />
          )}
        </View>
      ))}
    </View>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return null;
    }
  };

  const renderStep1 = () => {
    const genders = [
      { id: 'male', label: 'Male', icon: 'male' },
      { id: 'female', label: 'Female', icon: 'female' },
      { id: 'other', label: 'Other', icon: 'person' },
      { id: 'prefer-not-to-say', label: 'Prefer not to say', icon: 'help' },
    ];

    return (
      <View style={styles.stepContent}>
        {/* Profile Photo */}
        <View style={styles.photoSection}>
          <TouchableOpacity
            style={styles.photoContainer}
            onPress={pickImage}
            activeOpacity={0.8}
          >
            {profileData.profilePhoto ? (
              <Image source={{ uri: profileData.profilePhoto }} style={styles.profilePhoto} />
            ) : (
              <View style={styles.defaultPhoto}>
                <Ionicons name="camera" size={24} color={Colors.text.secondary} />
              </View>
            )}
            
            <View style={styles.cameraIconBadge}>
              <Ionicons name="camera" size={14} color="#ffffff" />
            </View>
          </TouchableOpacity>
          
          <Text style={styles.photoText}>Add Profile Photo</Text>
          <Text style={styles.photoSubtext}>Optional</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Full Name <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={18} color={Colors.text.secondary} />
              <TextInput
                style={styles.input}
                value={profileData.fullName}
                onChangeText={(text) => updateProfileData({ fullName: text })}
                placeholder="Enter your full name"
                placeholderTextColor={Colors.text.secondary}
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Email Address <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={18} color={Colors.text.secondary} />
              <TextInput
                style={styles.input}
                value={profileData.email}
                onChangeText={(text) => updateProfileData({ email: text })}
                placeholder="Enter your email"
                placeholderTextColor={Colors.text.secondary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Date of Birth */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date of Birth</Text>
            <TouchableOpacity
              style={styles.inputContainer}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={18} color={Colors.text.secondary} />
              <Text style={[styles.input, !profileData.dateOfBirth && styles.placeholderText]}>
                {profileData.dateOfBirth 
                  ? profileData.dateOfBirth.toLocaleDateString() 
                  : 'Select date of birth'
                }
              </Text>
            </TouchableOpacity>
          </View>

          {/* Gender */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderGrid}>
              {genders.map((gender) => (
                <TouchableOpacity
                  key={gender.id}
                  style={[
                    styles.genderOption,
                    profileData.gender === gender.id && styles.genderOptionSelected
                  ]}
                  onPress={() => updateProfileData({ gender: gender.id })}
                >
                  <Ionicons
                    name={gender.icon as any}
                    size={16}
                    color={profileData.gender === gender.id ? Colors.primary.teal : Colors.text.secondary}
                  />
                  <Text style={[
                    styles.genderText,
                    profileData.gender === gender.id && styles.genderTextSelected
                  ]}>
                    {gender.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderStep2 = () => {
    return (
      <View style={styles.stepContent}>
        {/* Use Current Location */}
        <TouchableOpacity
          style={[styles.locationButton, isLoadingLocation && styles.locationButtonDisabled]}
          onPress={getCurrentLocation}
          activeOpacity={0.8}
          disabled={isLoadingLocation}
        >
          <LinearGradient
            colors={isLoadingLocation 
              ? ['#9CA3AF', '#6B7280'] 
              : [Colors.primary.teal, Colors.accent.blue]
            }
            style={styles.locationButtonGradient}
          >
            {isLoadingLocation ? (
              <>
                <Ionicons name="refresh" size={20} color="#ffffff" />
                <Text style={styles.locationButtonText}>Getting Location...</Text>
              </>
            ) : (
              <>
                <Ionicons name="location" size={20} color="#ffffff" />
                <Text style={styles.locationButtonText}>Use Current Location</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or enter manually</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Manual Location Entry */}
        <View style={styles.formSection}>
          {/* State */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>State</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="location-outline" size={18} color={Colors.text.secondary} />
              <TextInput
                style={styles.input}
                value={profileData.state}
                onChangeText={(text) => updateProfileData({ state: text })}
                placeholder="Enter your state"
                placeholderTextColor={Colors.text.secondary}
              />
            </View>
          </View>

          {/* City */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>City</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="business-outline" size={18} color={Colors.text.secondary} />
              <TextInput
                style={styles.input}
                value={profileData.city}
                onChangeText={(text) => updateProfileData({ city: text })}
                placeholder="Enter your city"
                placeholderTextColor={Colors.text.secondary}
              />
            </View>
          </View>

          {/* Pincode */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Pincode</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="pin-outline" size={18} color={Colors.text.secondary} />
              <TextInput
                style={styles.input}
                value={profileData.pincode}
                onChangeText={(text) => updateProfileData({ pincode: text.replace(/\D/g, '').slice(0, 6) })}
                placeholder="Enter 6-digit pincode"
                placeholderTextColor={Colors.text.secondary}
                keyboardType="numeric"
                maxLength={6}
              />
            </View>
          </View>
        </View>

        {/* Map placeholder */}
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map" size={32} color={Colors.text.secondary} />
          <Text style={styles.mapPlaceholderText}>Map showing selected location</Text>
        </View>
      </View>
    );
  };

  const renderStep3 = () => {
    const vehicleTypes = [
      { id: 'hatchback', label: 'Hatchback', icon: '🚗' },
      { id: 'sedan', label: 'Sedan', icon: '🚙' },
      { id: 'suv', label: 'SUV', icon: '🚐' },
      { id: 'luxury', label: 'Luxury', icon: '🚘' },
      { id: 'bike', label: 'Bike', icon: '🏍️' },
    ];

    const usageTypes = [
      { id: 'daily-commute', label: 'Daily commute', icon: 'briefcase-outline' },
      { id: 'weekend-trips', label: 'Weekend trips', icon: 'car-outline' },
      { id: 'business-travel', label: 'Business travel', icon: 'business-outline' },
      { id: 'special-occasions', label: 'Special occasions', icon: 'gift-outline' },
      { id: 'flexible', label: 'Flexible/All purposes', icon: 'options-outline' },
    ];

    return (
      <View style={styles.stepContent}>
        {/* Vehicle Types */}
        <View style={styles.preferenceSection}>
          <Text style={styles.preferenceTitle}>Favorite vehicle types</Text>
          <Text style={styles.preferenceSubtext}>Select all that apply</Text>
          
          <View style={styles.vehicleGrid}>
            {vehicleTypes.map((vehicle) => (
              <TouchableOpacity
                key={vehicle.id}
                style={[
                  styles.vehicleOption,
                  profileData.favoriteVehicleTypes.includes(vehicle.id) && styles.vehicleOptionSelected
                ]}
                onPress={() => {
                  const types = profileData.favoriteVehicleTypes;
                  const newTypes = types.includes(vehicle.id)
                    ? types.filter(id => id !== vehicle.id)
                    : [...types, vehicle.id];
                  updateProfileData({ favoriteVehicleTypes: newTypes });
                }}
              >
                <Text style={styles.vehicleIcon}>{vehicle.icon}</Text>
                <Text style={[
                  styles.vehicleText,
                  profileData.favoriteVehicleTypes.includes(vehicle.id) && styles.vehicleTextSelected
                ]}>
                  {vehicle.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Usage Types */}
        <View style={styles.preferenceSection}>
          <Text style={styles.preferenceTitle}>Typical usage</Text>
          <Text style={styles.preferenceSubtext}>Select one</Text>
          
          <View style={styles.usageContainer}>
            {usageTypes.map((usage) => (
              <TouchableOpacity
                key={usage.id}
                style={[
                  styles.usageOption,
                  profileData.typicalUsage === usage.id && styles.usageOptionSelected
                ]}
                onPress={() => updateProfileData({ typicalUsage: usage.id })}
              >
                <Ionicons
                  name={usage.icon as any}
                  size={18}
                  color={profileData.typicalUsage === usage.id ? Colors.primary.teal : Colors.text.secondary}
                />
                <Text style={[
                  styles.usageText,
                  profileData.typicalUsage === usage.id && styles.usageTextSelected
                ]}>
                  {usage.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          style={styles.mainScrollView}
          contentContainerStyle={styles.mainScrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Clean Header without navigation */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.stepIndicator}>Step {currentStep} of 3</Text>
              <Text style={styles.title}>{getStepTitle()}</Text>
              <Text style={styles.subtitle}>{getStepSubtitle()}</Text>
            </View>

            {renderProgressBar()}
          </View>

          {/* Step Content */}
          <View style={styles.stepContentContainer}>
            {renderStep()}
          </View>

          {/* Action Buttons - Inside ScrollView */}
          <View style={styles.actionSection}>
            <TouchableOpacity
              style={[
                styles.nextButton,
                (currentStep === 1 && !isStep1Valid()) && styles.nextButtonDisabled,
                (currentStep === 2 && !isStep2Valid()) && styles.nextButtonDisabled,
              ]}
              onPress={handleNext}
              disabled={
                (currentStep === 1 && !isStep1Valid()) ||
                (currentStep === 2 && !isStep2Valid())
              }
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={
                  (currentStep === 1 && isStep1Valid()) ||
                  (currentStep === 2 && isStep2Valid()) ||
                  currentStep === 3
                    ? [Colors.primary.teal, Colors.accent.blue]
                    : ['#E5E7EB', '#D1D5DB']
                }
                style={styles.nextButtonGradient}
              >
                <Text style={[
                  styles.nextButtonText,
                  ((currentStep === 1 && !isStep1Valid()) || 
                   (currentStep === 2 && !isStep2Valid())) && styles.nextButtonTextDisabled
                ]}>
                  {currentStep === 3 ? 'Finish Setup' : 'Next'}
                </Text>
                <Ionicons 
                  name="arrow-forward" 
                  size={16} 
                  color={
                    (currentStep === 1 && isStep1Valid()) ||
                    (currentStep === 2 && isStep2Valid()) ||
                    currentStep === 3
                      ? "#ffffff"
                      : "#9CA3AF"
                  }
                  style={styles.nextIcon} 
                />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
              <Text style={styles.skipText}>
                {currentStep === 1 ? 'Skip for now' : 'Skip'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Custom Date Picker */}
      <CustomDatePicker
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onDateSelect={(date) => updateProfileData({ dateOfBirth: date })}
        initialDate={profileData.dateOfBirth || new Date()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  safeArea: {
    flex: 1,
  },
  mainScrollView: {
    flex: 1,
  },
  mainScrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  stepContentContainer: {
    flex: 1,
    marginBottom: 20,
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 20,
  },
  keyboardView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
    paddingTop: 10,
  },
  header: {
    paddingTop: 40,
    paddingBottom: 20,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 15,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  stepIndicator: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500',
    marginBottom: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary.teal,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 15,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  progressStep: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E5E7EB',
  },
  progressDotActive: {
    backgroundColor: Colors.primary.teal,
  },
  progressText: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginLeft: 8,
    marginRight: 16,
    fontWeight: '500',
  },
  progressTextActive: {
    color: Colors.primary.teal,
    fontWeight: '600',
  },
  progressLine: {
    width: 30,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
  progressLineActive: {
    backgroundColor: Colors.primary.teal,
  },
  stepContent: {
    flex: 1,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  profilePhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: Colors.primary.teal,
  },
  defaultPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#ffffff',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cameraIconBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: Colors.primary.teal,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  photoText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  photoSubtext: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  formSection: {
    gap: 12,
  },
  inputGroup: {
    gap: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  required: {
    color: '#EF4444',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 44,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.text.primary,
    fontWeight: '500',
    paddingVertical: 0,
  },
  placeholderText: {
    color: Colors.text.secondary,
  },
  genderContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  genderGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minWidth: '45%',
  },
  genderOptionSelected: {
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
    borderColor: Colors.primary.teal,
  },
  genderText: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  genderTextSelected: {
    color: Colors.primary.teal,
    fontWeight: '600',
  },
  // Step 2 Location Styles
  locationButton: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  locationButtonDisabled: {
    opacity: 0.7,
  },
  locationButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 8,
  },
  locationButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  mapPlaceholder: {
    marginTop: 20,
    height: 120,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  mapPlaceholderText: {
    marginTop: 8,
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  // Step 3 Preferences Styles
  preferenceSection: {
    marginBottom: 20,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary.teal,
    marginBottom: 6,
  },
  preferenceSubtext: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 15,
  },
  vehicleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  vehicleOption: {
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minWidth: '30%',
    gap: 8,
  },
  vehicleOptionSelected: {
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
    borderColor: Colors.primary.teal,
  },
  vehicleIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  vehicleText: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: '500',
    textAlign: 'center',
  },
  vehicleTextSelected: {
    color: Colors.primary.teal,
    fontWeight: '600',
  },
  usageContainer: {
    gap: 12,
  },
  usageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  usageOptionSelected: {
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
    borderColor: Colors.primary.teal,
  },
  usageText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500',
    flex: 1,
  },
  usageTextSelected: {
    color: Colors.primary.teal,
    fontWeight: '600',
  },
  actionSection: {
    paddingVertical: 15,
    paddingBottom: 30,
    gap: 12,
  },
  nextButton: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  nextButtonDisabled: {
    opacity: 0.6,
  },
  nextButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 6,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  nextButtonTextDisabled: {
    color: '#9CA3AF',
  },
  nextIcon: {
    marginLeft: 4,
  },
  continueButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  continueGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  continueText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary.teal,
  },
  continueTextDisabled: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  skipText: {
    fontSize: 16,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  // Date Picker Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  datePickerContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  datePickerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary.teal,
  },
  closeButton: {
    padding: 4,
  },
  datePreview: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  datePreviewText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: Colors.primary.teal,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  activeTabText: {
    color: Colors.primary.teal,
    fontWeight: '600',
  },
  tabContent: {
    maxHeight: 300,
    padding: 20,
  },
  dateItem: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
  },
  dateItemSelected: {
    backgroundColor: Colors.primary.teal,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  dateTextSelected: {
    color: '#ffffff',
    fontWeight: '600',
  },
  monthItem: {
    width: 80,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
  },
  yearItem: {
    width: 60,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 6,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
  },
  datePickerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  confirmButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  confirmButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});