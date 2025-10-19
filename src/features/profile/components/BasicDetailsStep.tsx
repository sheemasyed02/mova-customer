import { Colors } from '@/src/shared/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Alert,
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { ProfileData } from '../../authentication/screens/profile-setup-screen';

interface CustomDatePickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ selectedDate, onDateChange }) => {
  const [tempDate, setTempDate] = useState(selectedDate);
  
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 75 }, (_, i) => currentYear - i);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  
  const selectedMonth = tempDate.getMonth();
  const selectedDay = tempDate.getDate();
  const selectedYear = tempDate.getFullYear();
  
  const updateDate = (month?: number, day?: number, year?: number) => {
    const newDate = new Date(
      year ?? selectedYear,
      month ?? selectedMonth,
      day ?? selectedDay
    );
    setTempDate(newDate);
    onDateChange(newDate);
  };
  
  const renderPickerColumn = (data: (string | number)[], selectedValue: string | number, onSelect: (value: any) => void, type: 'month' | 'day' | 'year') => {
    return (
      <View style={datePickerStyles.column}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={datePickerStyles.columnContent}
        >
          {data.map((item, index) => {
            const isSelected = item === selectedValue;
            return (
              <TouchableOpacity
                key={index}
                style={[
                  datePickerStyles.pickerItem,
                  isSelected && datePickerStyles.selectedPickerItem
                ]}
                onPress={() => onSelect(type === 'month' ? index : item)}
              >
                <Text style={[
                  datePickerStyles.pickerText,
                  isSelected && datePickerStyles.selectedPickerText
                ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };
  
  return (
    <View style={datePickerStyles.container}>
      <View style={datePickerStyles.pickerRow}>
        {renderPickerColumn(months, months[selectedMonth], (monthIndex) => updateDate(monthIndex), 'month')}
        {renderPickerColumn(days, selectedDay, (day) => updateDate(undefined, day), 'day')}
        {renderPickerColumn(years, selectedYear, (year) => updateDate(undefined, undefined, year), 'year')}
      </View>
    </View>
  );
};

const datePickerStyles = StyleSheet.create({
  container: {
    marginVertical: 30,
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 200,
  },
  column: {
    flex: 1,
    marginHorizontal: 5,
  },
  columnContent: {
    paddingVertical: 60,
  },
  pickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginVertical: 2,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedPickerItem: {
    backgroundColor: '#A855F7',
  },
  pickerText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  selectedPickerText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

interface BasicDetailsStepProps {
  profileData: ProfileData;
  updateProfileData: (data: Partial<ProfileData>) => void;
  onNext: () => void;
  onSkip: () => void;
}

export default function BasicDetailsStep({
  profileData,
  updateProfileData,
  onNext,
  onSkip,
}: BasicDetailsStepProps) {
  const [animatedValue] = useState(new Animated.Value(0));
  const [showDatePicker, setShowDatePicker] = useState(false);

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const genders = [
    { id: 'male', label: 'Male', icon: 'male' },
    { id: 'female', label: 'Female', icon: 'female' },
    { id: 'other', label: 'Other', icon: 'person' },
  ];

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to change your profile photo.');
      return;
    }

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

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      updateProfileData({ dateOfBirth: selectedDate });
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const isFormValid = () => {
    return profileData.fullName.trim().length >= 2 && 
           profileData.email.trim().length > 0 &&
           /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email.trim());
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
                  <LinearGradient
                    colors={['rgba(45, 155, 142, 0.1)', 'rgba(45, 155, 142, 0.2)']}
                    style={styles.defaultPhoto}
                  >
                    <Ionicons name="camera" size={28} color={Colors.primary.teal} />
                  </LinearGradient>
                )}
                
                <View style={styles.cameraIconContainer}>
                  <LinearGradient
                    colors={[Colors.primary.teal, '#20A39E']}
                    style={styles.cameraIcon}
                  >
                    <Ionicons name="camera" size={14} color="#ffffff" />
                  </LinearGradient>
                </View>
              </TouchableOpacity>
              
              <Text style={styles.photoText}>
                {profileData.profilePhoto ? 'Tap to change photo' : 'Add profile photo'}
              </Text>
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
                  <Ionicons name="person-outline" size={18} color={Colors.text.secondary} style={styles.inputIcon} />
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
                  <Ionicons name="mail-outline" size={18} color={Colors.text.secondary} style={styles.inputIcon} />
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
                  activeOpacity={0.7}
                >
                  <Ionicons name="calendar-outline" size={18} color={Colors.text.secondary} style={styles.inputIcon} />
                  <Text style={[
                    styles.input,
                    !profileData.dateOfBirth && styles.placeholder
                  ]}>
                    {profileData.dateOfBirth ? formatDate(profileData.dateOfBirth) : 'Select date of birth'}
                  </Text>
                  <Ionicons name="chevron-down" size={14} color={Colors.text.secondary} />
                </TouchableOpacity>
              </View>

              {/* Gender */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Gender</Text>
                <View style={styles.genderContainer}>
                  {genders.map((gender) => (
                    <TouchableOpacity
                      key={gender.id}
                      style={[
                        styles.genderOption,
                        profileData.gender === gender.id && styles.genderOptionSelected
                      ]}
                      onPress={() => updateProfileData({ gender: gender.id })}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={gender.icon as any}
                        size={16}
                        color={profileData.gender === gender.id ? '#ffffff' : Colors.text.secondary}
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

            {/* Action Buttons */}
            <View style={styles.actionSection}>
              <TouchableOpacity
                style={[
                  styles.nextButton,
                  !isFormValid() && styles.nextButtonDisabled
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
                  style={styles.nextButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={[
                    styles.nextButtonText,
                    !isFormValid() && styles.nextButtonTextDisabled
                  ]}>
                    Next
                  </Text>
                  <Ionicons 
                    name="arrow-forward" 
                    size={16} 
                    color={isFormValid() ? "#ffffff" : "#9CA3AF"} 
                    style={styles.nextIcon} 
                  />
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity onPress={onSkip} style={styles.skipButton}>
                <Text style={styles.skipText}>Skip for now</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Custom Date Picker Modal */}
          {showDatePicker && (
            <View style={styles.datePickerOverlay}>
              <TouchableOpacity 
                style={styles.datePickerBackdrop}
                onPress={() => setShowDatePicker(false)}
                activeOpacity={1}
              />
              <Animated.View style={styles.datePickerContainer}>
                <View style={styles.datePickerHeader}>
                  <TouchableOpacity 
                    onPress={() => setShowDatePicker(false)}
                    style={styles.backButton}
                  >
                    <Ionicons name="chevron-back" size={24} color={Colors.text.primary} />
                  </TouchableOpacity>
                  <Text style={styles.datePickerStep}>3/5</Text>
                </View>
                
                <Text style={styles.datePickerTitle}>What's your date of{'\n'}birth?</Text>
                
                <CustomDatePicker
                  selectedDate={profileData.dateOfBirth || new Date()}
                  onDateChange={(date) => {
                    updateProfileData({ dateOfBirth: date });
                    setShowDatePicker(false);
                  }}
                />
                
                <TouchableOpacity
                  style={styles.datePickerContinue}
                  onPress={() => setShowDatePicker(false)}
                >
                  <LinearGradient
                    colors={['#A855F7', '#9333EA']}
                    style={styles.datePickerContinueGradient}
                  >
                    <Ionicons name="arrow-forward" size={20} color="#ffffff" />
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            </View>
          )}
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
  photoSection: {
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 16,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  profilePhoto: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  defaultPhoto: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(45, 155, 142, 0.3)',
    borderStyle: 'dashed',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: -2,
    right: -2,
  },
  cameraIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  photoText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
    textAlign: 'center',
    marginTop: 8,
  },
  photoSubtext: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: 2,
  },
  formSection: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 6,
  },
  required: {
    color: '#EF4444',
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
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '400',
    color: Colors.text.primary,
  },
  placeholder: {
    color: Colors.text.secondary,
  },
  genderContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 4,
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minWidth: '30%',
    flex: 1,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.03,
    shadowRadius: 1,
    elevation: 1,
  },
  genderOptionSelected: {
    backgroundColor: Colors.primary.teal,
    borderColor: Colors.primary.teal,
  },
  genderText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.text.secondary,
    marginLeft: 6,
  },
  genderTextSelected: {
    color: '#ffffff',
  },
  actionSection: {
    marginTop: 20,
    paddingTop: 16,
  },
  nextButton: {
    marginBottom: 12,
  },
  nextButtonDisabled: {
    opacity: 0.6,
  },
  nextButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  nextButtonTextDisabled: {
    color: '#9CA3AF',
  },
  nextIcon: {
    marginLeft: 8,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  
  // Date Picker Modal Styles
  datePickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  datePickerBackdrop: {
    flex: 1,
  },
  datePickerContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 30,
    maxHeight: '80%',
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  datePickerStep: {
    fontSize: 16,
    fontWeight: '600',
    color: '#A855F7',
  },
  datePickerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 32,
  },
  datePickerContinue: {
    alignSelf: 'center',
    marginTop: 30,
    shadowColor: '#A855F7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  datePickerContinueGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
