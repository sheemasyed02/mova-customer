/**
 * Edit Profile Screen
 * 
 * Features:
 * - Profile photo management (camera, gallery, remove)
 * - Personal information editing with validation
 * - Contact preferences
 * - Real-time form validation
 * - Modern UI matching project design
 */

import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ProfileData {
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: Date | null;
  gender: string;
  bio: string;
  profilePhoto: string | null;
  contactMethod: 'phone' | 'email' | 'whatsapp';
  bestTimeToContact: 'morning' | 'afternoon' | 'evening' | 'anytime';
}

interface FormErrors {
  fullName?: string;
  email?: string;
  bio?: string;
}

export default function EditProfileScreen() {
  const router = useRouter();
  
  // Form state
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phoneNumber: '+91 9876543210',
    dateOfBirth: new Date('1990-01-01'),
    gender: 'male',
    bio: 'Travel enthusiast and car lover',
    profilePhoto: null,
    contactMethod: 'phone',
    bestTimeToContact: 'anytime',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setSaveLoading] = useState(false);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!profileData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (profileData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    if (!profileData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(profileData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (profileData.bio.length > 200) {
      newErrors.bio = 'Bio must be 200 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handlers
  const updateField = (field: keyof ProfileData, value: any) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
    
    // Clear specific field error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaveLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'Success',
        'Profile updated successfully!',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDiscard = () => {
    if (hasChanges) {
      Alert.alert(
        'Discard Changes',
        'Are you sure you want to discard your changes?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => router.back() }
        ]
      );
    } else {
      router.back();
    }
  };

  const handlePhotoAction = async (action: 'camera' | 'gallery' | 'remove') => {
    setShowPhotoOptions(false);

    if (action === 'remove') {
      updateField('profilePhoto', null);
      return;
    }

    const permissionResult = action === 'camera' 
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission Required', `Camera ${action === 'camera' ? '' : 'roll '}access is required to ${action === 'camera' ? 'take' : 'select'} photos.`);
      return;
    }

    const result = action === 'camera'
      ? await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        })
      : await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });

    if (!result.canceled && result.assets[0]) {
      updateField('profilePhoto', result.assets[0].uri);
    }
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return 'Select date';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
    { label: 'Prefer not to say', value: 'not_specified' },
  ];

  const contactMethodOptions = [
    { label: 'Phone', value: 'phone', icon: 'call' },
    { label: 'Email', value: 'email', icon: 'mail' },
    { label: 'WhatsApp', value: 'whatsapp', icon: 'logo-whatsapp' },
  ];

  const timeOptions = [
    { label: 'Morning (6 AM - 12 PM)', value: 'morning' },
    { label: 'Afternoon (12 PM - 6 PM)', value: 'afternoon' },
    { label: 'Evening (6 PM - 10 PM)', value: 'evening' },
    { label: 'Anytime', value: 'anytime' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleDiscard} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color={Colors.text.primary} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Edit Profile</Text>
        
        <TouchableOpacity 
          onPress={handleSave} 
          style={[styles.saveButton, !hasChanges && styles.saveButtonDisabled]}
          disabled={isLoading || !hasChanges}
        >
          {isLoading ? (
            <Text style={[styles.saveButtonText, !hasChanges && styles.saveButtonTextDisabled]}>
              Saving...
            </Text>
          ) : (
            <Text style={[styles.saveButtonText, !hasChanges && styles.saveButtonTextDisabled]}>
              Save
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Profile Photo Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profile Photo</Text>
            
            <View style={styles.photoSection}>
              <View style={styles.photoContainer}>
                {profileData.profilePhoto ? (
                  <Image source={{ uri: profileData.profilePhoto }} style={styles.profilePhoto} />
                ) : (
                  <View style={styles.placeholderPhoto}>
                    <Ionicons name="person" size={40} color={Colors.text.secondary} />
                  </View>
                )}
              </View>
              
              <TouchableOpacity 
                style={styles.changePhotoButton}
                onPress={() => setShowPhotoOptions(true)}
              >
                <Text style={styles.changePhotoText}>Change Photo</Text>
              </TouchableOpacity>
              
              <Text style={styles.photoGuideline}>Use a clear photo of yourself</Text>
            </View>
          </View>

          {/* Personal Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Details</Text>
            
            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Full Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.textInput, errors.fullName && styles.inputError]}
                value={profileData.fullName}
                onChangeText={(text) => updateField('fullName', text)}
                placeholder="Enter your full name"
                placeholderTextColor={Colors.text.light}
              />
              {errors.fullName && (
                <Text style={styles.errorText}>{errors.fullName}</Text>
              )}
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Email <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.inputWithIcon}>
                <TextInput
                  style={[styles.textInput, errors.email && styles.inputError]}
                  value={profileData.email}
                  onChangeText={(text) => updateField('email', text)}
                  placeholder="Enter your email"
                  placeholderTextColor={Colors.text.light}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={16} color={Colors.functional.success} />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              </View>
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>

            {/* Phone Number */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <View style={styles.inputWithIcon}>
                <TextInput
                  style={[styles.textInput, styles.readOnlyInput]}
                  value={profileData.phoneNumber}
                  editable={false}
                />
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={16} color={Colors.functional.success} />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.changeNumberLink}>
                <Text style={styles.linkText}>Change number</Text>
              </TouchableOpacity>
            </View>

            {/* Date of Birth */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Date of Birth</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={[styles.dateText, !profileData.dateOfBirth && styles.placeholderText]}>
                  {formatDate(profileData.dateOfBirth)}
                </Text>
                <Ionicons name="calendar" size={20} color={Colors.text.secondary} />
              </TouchableOpacity>
            </View>

            {/* Gender */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Gender</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowGenderPicker(true)}
              >
                <Text style={styles.dateText}>
                  {genderOptions.find(g => g.value === profileData.gender)?.label || 'Select gender'}
                </Text>
                <Ionicons name="chevron-down" size={20} color={Colors.text.secondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Optional Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Optional Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Bio/About</Text>
              <TextInput
                style={[styles.textArea, errors.bio && styles.inputError]}
                value={profileData.bio}
                onChangeText={(text) => updateField('bio', text)}
                placeholder="Tell others about yourself"
                placeholderTextColor={Colors.text.light}
                multiline
                numberOfLines={4}
                maxLength={200}
                textAlignVertical="top"
              />
              <View style={styles.characterCount}>
                <Text style={styles.characterCountText}>
                  {profileData.bio.length}/200 characters
                </Text>
              </View>
              {errors.bio && (
                <Text style={styles.errorText}>{errors.bio}</Text>
              )}
            </View>
          </View>

          {/* Contact Preferences */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Preferences</Text>
            
            {/* Preferred Contact Method */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Preferred contact method</Text>
              <View style={styles.optionsGroup}>
                {contactMethodOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionButton,
                      profileData.contactMethod === option.value && styles.optionButtonActive
                    ]}
                    onPress={() => updateField('contactMethod', option.value)}
                  >
                    <Ionicons 
                      name={option.icon as any} 
                      size={18} 
                      color={profileData.contactMethod === option.value ? Colors.text.white : Colors.text.secondary} 
                    />
                    <Text style={[
                      styles.optionText,
                      profileData.contactMethod === option.value && styles.optionTextActive
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Best Time to Contact */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Best time to contact</Text>
              <View style={styles.timeOptionsGroup}>
                {timeOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.timeOption,
                      profileData.bestTimeToContact === option.value && styles.timeOptionActive
                    ]}
                    onPress={() => updateField('bestTimeToContact', option.value)}
                  >
                    <Text style={[
                      styles.timeOptionText,
                      profileData.bestTimeToContact === option.value && styles.timeOptionTextActive
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            <TouchableOpacity
              style={styles.discardButton}
              onPress={handleDiscard}
            >
              <Text style={styles.discardButtonText}>Discard</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.saveChangesButton, (!hasChanges || isLoading) && styles.saveChangesButtonDisabled]}
              onPress={handleSave}
              disabled={!hasChanges || isLoading}
            >
              <Text style={[styles.saveChangesButtonText, (!hasChanges || isLoading) && styles.saveChangesButtonTextDisabled]}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Photo Options Modal */}
      <Modal
        visible={showPhotoOptions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPhotoOptions(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPhotoOptions(false)}
        >
          <View style={styles.photoOptionsModal}>
            <Text style={styles.modalTitle}>Change Profile Photo</Text>
            
            <TouchableOpacity 
              style={styles.photoOption}
              onPress={() => handlePhotoAction('camera')}
            >
              <Ionicons name="camera" size={24} color={Colors.primary.teal} />
              <Text style={styles.photoOptionText}>Take Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.photoOption}
              onPress={() => handlePhotoAction('gallery')}
            >
              <Ionicons name="images" size={24} color={Colors.primary.teal} />
              <Text style={styles.photoOptionText}>Choose from Gallery</Text>
            </TouchableOpacity>
            
            {profileData.profilePhoto && (
              <TouchableOpacity 
                style={styles.photoOption}
                onPress={() => handlePhotoAction('remove')}
              >
                <Ionicons name="trash" size={24} color={Colors.functional.error} />
                <Text style={[styles.photoOptionText, { color: Colors.functional.error }]}>
                  Remove Photo
                </Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={styles.cancelOption}
              onPress={() => setShowPhotoOptions(false)}
            >
              <Text style={styles.cancelOptionText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={profileData.dateOfBirth || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              updateField('dateOfBirth', selectedDate);
            }
          }}
          maximumDate={new Date()}
        />
      )}

      {/* Gender Picker Modal */}
      <Modal
        visible={showGenderPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowGenderPicker(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowGenderPicker(false)}
        >
          <View style={styles.genderModal}>
            <Text style={styles.modalTitle}>Select Gender</Text>
            
            {genderOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.genderOption,
                  profileData.gender === option.value && styles.genderOptionActive
                ]}
                onPress={() => {
                  updateField('gender', option.value);
                  setShowGenderPicker(false);
                }}
              >
                <Text style={[
                  styles.genderOptionText,
                  profileData.gender === option.value && styles.genderOptionTextActive
                ]}>
                  {option.label}
                </Text>
                {profileData.gender === option.value && (
                  <Ionicons name="checkmark" size={20} color={Colors.primary.teal} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
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

  // Content
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: Colors.background.white,
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 20,
  },

  // Photo Section
  photoSection: {
    alignItems: 'center',
  },
  photoContainer: {
    marginBottom: 16,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  placeholderPhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  changePhotoButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.primary.teal,
    marginBottom: 8,
  },
  changePhotoText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.white,
  },
  photoGuideline: {
    fontSize: 12,
    color: Colors.text.secondary,
    textAlign: 'center',
  },

  // Form Inputs
  inputGroup: {
    marginBottom: 20,
  },
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
  inputError: {
    borderColor: Colors.functional.error,
  },
  readOnlyInput: {
    backgroundColor: '#F9FAFB',
    color: Colors.text.secondary,
  },
  inputWithIcon: {
    position: 'relative',
  },
  verifiedBadge: {
    position: 'absolute',
    right: 12,
    top: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 12,
    color: Colors.functional.success,
    marginLeft: 4,
    fontWeight: '500',
  },
  changeNumberLink: {
    marginTop: 8,
  },
  linkText: {
    fontSize: 14,
    color: Colors.primary.teal,
    fontWeight: '500',
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.background.white,
  },
  dateText: {
    fontSize: 16,
    color: Colors.text.primary,
  },
  placeholderText: {
    color: Colors.text.light,
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
    height: 100,
  },
  characterCount: {
    alignItems: 'flex-end',
    marginTop: 4,
  },
  characterCountText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  errorText: {
    fontSize: 12,
    color: Colors.functional.error,
    marginTop: 4,
  },

  // Options
  optionsGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  optionButton: {
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
  optionButtonActive: {
    backgroundColor: Colors.primary.teal,
    borderColor: Colors.primary.teal,
  },
  optionText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  optionTextActive: {
    color: Colors.text.white,
  },
  timeOptionsGroup: {
    gap: 8,
  },
  timeOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: Colors.background.white,
  },
  timeOptionActive: {
    backgroundColor: Colors.primary.teal + '10',
    borderColor: Colors.primary.teal,
  },
  timeOptionText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  timeOptionTextActive: {
    color: Colors.primary.teal,
    fontWeight: '500',
  },

  // Action Buttons
  actionSection: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: Colors.background.white,
    marginTop: 12,
  },
  discardButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    backgroundColor: Colors.background.lightGrey,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  discardButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  saveChangesButton: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary.teal,
    alignItems: 'center',
  },
  saveChangesButtonDisabled: {
    backgroundColor: Colors.background.lightGrey,
  },
  saveChangesButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.white,
  },
  saveChangesButtonTextDisabled: {
    color: Colors.text.secondary,
  },

  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoOptionsModal: {
    backgroundColor: Colors.background.white,
    borderRadius: 16,
    padding: 20,
    margin: 20,
    minWidth: 280,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  photoOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 16,
  },
  photoOptionText: {
    fontSize: 16,
    color: Colors.text.primary,
  },
  cancelOption: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelOptionText: {
    fontSize: 16,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  genderModal: {
    backgroundColor: Colors.background.white,
    borderRadius: 16,
    padding: 20,
    margin: 20,
    minWidth: 280,
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  genderOptionActive: {
    backgroundColor: Colors.primary.teal + '10',
  },
  genderOptionText: {
    fontSize: 16,
    color: Colors.text.primary,
  },
  genderOptionTextActive: {
    color: Colors.primary.teal,
    fontWeight: '500',
  },
});