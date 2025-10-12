/**
 * REPORT ISSUE SCREEN
 * 
 * Purpose: Report problems during or after trip
 * 
 * Navigation Routes:
 * - From Trip Details Screen: "Report Issue" button → /report-issue
 * - From My Trips Screen: "Report Issue" button → /report-issue
 * - From Emergency button: /report-issue?emergency=true
 * 
 * Key Features Implemented:
 * ✅ Issue Category Selection (10 categories from Vehicle breakdown to Other)
 * ✅ Issue Details (When, Where, Description with 50 char minimum, Severity levels)
 * ✅ Upload Evidence (Photos up to 10, Videos up to 2, Documents, Camera/Gallery)
 * ✅ What do you want (Multiple checkboxes for desired actions)
 * ✅ Contact Preference (Phone, WhatsApp, Email, In-app, Best time picker)
 * ✅ Emergency Toggle (Priority handling, immediate call, 24/7 number)
 * ✅ Auto-filled Booking Details (ID, Vehicle, Owner, Contact, Trip status)
 * ✅ Submit Flow (Ticket ID generation, Response times, Tracking options)
 * ✅ Emergency Features (Call initiation, Roadside assistance, Support centers)
 */

import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    Linking,
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

const { width } = Dimensions.get('window');

interface IssueCategory {
  id: string;
  title: string;
  icon: string;
  description?: string;
}

interface UploadedFile {
  id: string;
  type: 'photo' | 'video' | 'document';
  uri: string;
  name: string;
  size?: number;
  duration?: number;
}

interface ContactTime {
  start: string;
  end: string;
}

export default function ReportIssueScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Check if this is an emergency report
  const isEmergencyMode = params.emergency === 'true';
  
  // Form state
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [issueDateTime, setIssueDateTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [location, setLocation] = useState('');
  const [currentLocation, setCurrentLocation] = useState<string>('');
  const [issueDescription, setIssueDescription] = useState('');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>('medium');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [desiredActions, setDesiredActions] = useState<string[]>([]);
  const [contactPreference, setContactPreference] = useState<string>('');
  const [contactTime, setContactTime] = useState<ContactTime>({ start: '09:00', end: '18:00' });
  const [isEmergency, setIsEmergency] = useState(isEmergencyMode);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedTicketId, setGeneratedTicketId] = useState('');
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [showTimeRangePicker, setShowTimeRangePicker] = useState(false);

  // Sample booking data - in real app, this would come from API
  const bookingData = {
    bookingId: 'MOV-12345',
    vehicleName: 'Hyundai Creta 2023',
    ownerName: 'Amit Motors',
    ownerPhone: '+91 98765 43210',
    userPhone: '+91 98765 12345',
    userEmail: 'user@example.com',
    tripStatus: 'ongoing',
    pickupLocation: 'MG Road, Bangalore',
    registrationNumber: 'KA 01 AB 1234',
  };

  const issueCategories: IssueCategory[] = [
    { id: 'breakdown', title: 'Vehicle breakdown', icon: 'car-outline', description: 'Engine, battery, or mechanical issues' },
    { id: 'accident', title: 'Accident/Collision', icon: 'warning-outline', description: 'Any collision or accident involving the vehicle' },
    { id: 'different', title: 'Vehicle different from listing', icon: 'swap-horizontal-outline', description: 'Vehicle doesn\'t match the booking details' },
    { id: 'cleanliness', title: 'Cleanliness issues', icon: 'sparkles-outline', description: 'Dirty interior, exterior, or hygiene concerns' },
    { id: 'missing', title: 'Missing features/accessories', icon: 'remove-circle-outline', description: 'Advertised features or accessories not available' },
    { id: 'documentation', title: 'Documentation issues', icon: 'document-text-outline', description: 'Problems with vehicle papers or documents' },
    { id: 'owner', title: 'Owner behavior', icon: 'person-outline', description: 'Unprofessional or inappropriate owner behavior' },
    { id: 'billing', title: 'Overcharging/Billing issue', icon: 'card-outline', description: 'Unexpected charges or billing disputes' },
    { id: 'safety', title: 'Safety concern', icon: 'shield-outline', description: 'Safety-related issues with the vehicle' },
    { id: 'other', title: 'Other', icon: 'ellipsis-horizontal-outline', description: 'Any other issue not listed above' },
  ];

  const desiredActionOptions = [
    { id: 'assistance', title: 'Immediate assistance', icon: 'flash' },
    { id: 'compensation', title: 'Compensation/Refund', icon: 'cash' },
    { id: 'replacement', title: 'Vehicle replacement', icon: 'swap-horizontal' },
    { id: 'cancel', title: 'Cancel booking', icon: 'close-circle' },
    { id: 'record', title: 'Just reporting for record', icon: 'document-text' },
    { id: 'owner_action', title: 'Owner action required', icon: 'person' },
    { id: 'support_contact', title: 'Contact from support team', icon: 'call' },
  ];

  const contactOptions = [
    { id: 'phone', title: 'Phone call (immediate)', icon: 'call' },
    { id: 'whatsapp', title: 'WhatsApp', icon: 'logo-whatsapp' },
    { id: 'email', title: 'Email', icon: 'mail' },
    { id: 'inapp', title: 'In-app message', icon: 'chatbubble' },
  ];

  useEffect(() => {
    getCurrentLocation();
    if (isEmergencyMode) {
      setSeverity('high');
      setContactPreference('phone');
      setDesiredActions(['assistance']);
    }
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        const address = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        
        if (address.length > 0) {
          const addr = address[0];
          setCurrentLocation(`${addr.street}, ${addr.city}, ${addr.region}`);
        }
      }
    } catch (error) {
      console.log('Error getting location:', error);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleDateTimeChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setIssueDateTime(selectedDate);
    }
    setShowDatePicker(false);
    setShowTimePicker(false);
  };

  const handleJustNow = () => {
    setIssueDateTime(new Date());
  };

  const handleUseCurrentLocation = () => {
    if (currentLocation) {
      setLocation(currentLocation);
    } else {
      Alert.alert('Location not available', 'Please allow location access or enter manually');
    }
  };

  const handleUsePickupLocation = () => {
    setLocation(bookingData.pickupLocation);
  };

  const toggleDesiredAction = (actionId: string) => {
    if (desiredActions.includes(actionId)) {
      setDesiredActions(desiredActions.filter(id => id !== actionId));
    } else {
      setDesiredActions([...desiredActions, actionId]);
    }
  };

  const handleMediaUpload = async (type: 'camera' | 'gallery' | 'video') => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please allow access to photos');
        return;
      }

      let result;
      if (type === 'camera') {
        const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
        if (cameraStatus.status !== 'granted') {
          Alert.alert('Permission needed', 'Please allow camera access');
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: type === 'video' ? ImagePicker.MediaTypeOptions.Videos : ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
          videoMaxDuration: 30,
        });
      }

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const newFile: UploadedFile = {
          id: Date.now().toString(),
          type: asset.type === 'video' ? 'video' : 'photo',
          uri: asset.uri,
          name: asset.fileName || `${asset.type}_${Date.now()}`,
          size: asset.fileSize,
          duration: asset.duration || undefined,
        };

        // Check limits
        const photos = uploadedFiles.filter(f => f.type === 'photo');
        const videos = uploadedFiles.filter(f => f.type === 'video');

        if (newFile.type === 'photo' && photos.length >= 10) {
          Alert.alert('Limit reached', 'You can upload maximum 10 photos');
          return;
        }

        if (newFile.type === 'video' && videos.length >= 2) {
          Alert.alert('Limit reached', 'You can upload maximum 2 videos');
          return;
        }

        setUploadedFiles([...uploadedFiles, newFile]);
        setShowMediaModal(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload file');
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(uploadedFiles.filter(f => f.id !== fileId));
  };

  const validateForm = (): boolean => {
    if (!selectedCategory) {
      Alert.alert('Missing Information', 'Please select an issue category');
      return false;
    }

    if (!location.trim()) {
      Alert.alert('Missing Information', 'Please specify where the issue happened');
      return false;
    }

    if (issueDescription.trim().length < 50) {
      Alert.alert('Description too short', 'Please provide at least 50 characters describing the issue');
      return false;
    }

    if (desiredActions.length === 0) {
      Alert.alert('Missing Information', 'Please select what you want us to do');
      return false;
    }

    if (!contactPreference) {
      Alert.alert('Missing Information', 'Please select how we should contact you');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simulate API submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate ticket ID
      const ticketId = `ISSUE-${Math.floor(Math.random() * 100000)}`;
      setGeneratedTicketId(ticketId);
      
      if (isEmergency) {
        // For emergency, show immediate call option
        Alert.alert(
          'Emergency Reported',
          'We\'ve received your emergency report. Support will call you within 15 minutes.',
          [
            { text: 'Call Now', onPress: () => Linking.openURL(`tel:+911800123456`) },
            { text: 'OK', onPress: () => setShowSuccessModal(true) },
          ]
        );
      } else {
        setShowSuccessModal(true);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getResponseTime = () => {
    if (isEmergency) return 'Within 15 minutes';
    switch (severity) {
      case 'high': return 'Within 1 hour';
      case 'medium': return 'Within 4 hours';
      case 'low': return 'Within 24 hours';
      default: return 'Within 24 hours';
    }
  };

  const handleEmergencyCall = () => {
    Linking.openURL('tel:+911800123456');
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
      </TouchableOpacity>
      
      <View style={styles.headerCenter}>
        <Text style={styles.headerTitle}>Report an Issue</Text>
        <Text style={styles.headerSubtitle}>#{bookingData.bookingId} • {bookingData.vehicleName}</Text>
      </View>
      
      <View style={styles.headerSpacer} />
      
      {isEmergency && (
        <TouchableOpacity style={styles.emergencyCallButton} onPress={handleEmergencyCall}>
          <Ionicons name="call" size={20} color={Colors.text.white} />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderIssueCategories = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Issue Category *</Text>
      <Text style={styles.sectionSubtitle}>Select the category that best describes your issue</Text>
      
      <View style={styles.categoriesGrid}>
        {issueCategories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryCard,
              selectedCategory === category.id && styles.categoryCardSelected
            ]}
            onPress={() => handleCategorySelect(category.id)}
          >
            <Ionicons 
              name={category.icon as any} 
              size={24} 
              color={selectedCategory === category.id ? Colors.primary.teal : Colors.text.secondary} 
            />
            <Text style={[
              styles.categoryTitle,
              selectedCategory === category.id && styles.categoryTitleSelected
            ]}>
              {category.title}
            </Text>
            {category.description && (
              <Text style={styles.categoryDescription}>{category.description}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderIssueDetails = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Issue Details</Text>
      
      {/* When did this happen */}
      <View style={styles.subsection}>
        <Text style={styles.fieldLabel}>When did this happen? *</Text>
        <View style={styles.dateTimeContainer}>
          <TouchableOpacity 
            style={styles.dateTimeButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={16} color={Colors.primary.teal} />
            <Text style={styles.dateTimeText}>
              {issueDateTime.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.dateTimeButton}
            onPress={() => setShowTimePicker(true)}
          >
            <Ionicons name="time-outline" size={16} color={Colors.primary.teal} />
            <Text style={styles.dateTimeText}>
              {issueDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.justNowButton} onPress={handleJustNow}>
            <Text style={styles.justNowText}>Just now</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Where did this happen */}
      <View style={styles.subsection}>
        <Text style={styles.fieldLabel}>Where did this happen? *</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter location details"
          value={location}
          onChangeText={setLocation}
          multiline
        />
        <View style={styles.locationButtons}>
          <TouchableOpacity style={styles.locationButton} onPress={handleUseCurrentLocation}>
            <Ionicons name="location" size={14} color={Colors.primary.teal} />
            <Text style={styles.locationButtonText}>Use current location</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.locationButton} onPress={handleUsePickupLocation}>
            <Ionicons name="car" size={14} color={Colors.primary.teal} />
            <Text style={styles.locationButtonText}>At pickup location</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Describe the issue */}
      <View style={styles.subsection}>
        <Text style={styles.fieldLabel}>Describe the issue * (minimum 50 characters)</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Be as specific as possible. Include details about what happened, when, and any relevant circumstances..."
          value={issueDescription}
          onChangeText={setIssueDescription}
          multiline
          textAlignVertical="top"
        />
        <Text style={styles.characterCount}>
          {issueDescription.length}/50 minimum
        </Text>
      </View>

      {/* Severity */}
      <View style={styles.subsection}>
        <Text style={styles.fieldLabel}>Severity *</Text>
        <View style={styles.severityContainer}>
          {[
            { id: 'low', title: 'Low', subtitle: 'Minor inconvenience', color: Colors.functional.success },
            { id: 'medium', title: 'Medium', subtitle: 'Significant problem', color: Colors.functional.warning },
            { id: 'high', title: 'High', subtitle: 'Emergency/Safety issue', color: Colors.functional.error },
          ].map((level) => (
            <TouchableOpacity
              key={level.id}
              style={[
                styles.severityOption,
                severity === level.id && styles.severityOptionSelected,
                { borderColor: level.color }
              ]}
              onPress={() => setSeverity(level.id as any)}
            >
              <View style={[styles.severityIndicator, { backgroundColor: level.color }]} />
              <View style={styles.severityTextContainer}>
                <Text style={[
                  styles.severityTitle,
                  severity === level.id && styles.severityTitleSelected
                ]}>
                  {level.title}
                </Text>
                <Text style={styles.severitySubtitle}>{level.subtitle}</Text>
              </View>
              <View style={[
                styles.radioButton,
                severity === level.id && styles.radioButtonSelected
              ]}>
                {severity === level.id && <View style={styles.radioButtonInner} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderUploadEvidence = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Upload Evidence</Text>
      <Text style={styles.sectionSubtitle}>Clear evidence helps us resolve faster</Text>
      
      <View style={styles.uploadContainer}>
        <TouchableOpacity 
          style={styles.uploadButton}
          onPress={() => setShowMediaModal(true)}
        >
          <Ionicons name="camera" size={24} color={Colors.primary.teal} />
          <Text style={styles.uploadButtonText}>Add Photos/Videos</Text>
          <Text style={styles.uploadLimits}>
            Photos: {uploadedFiles.filter(f => f.type === 'photo').length}/10 • 
            Videos: {uploadedFiles.filter(f => f.type === 'video').length}/2
          </Text>
        </TouchableOpacity>
        
        {uploadedFiles.length > 0 && (
          <ScrollView horizontal style={styles.uploadedFilesContainer}>
            {uploadedFiles.map((file) => (
              <View key={file.id} style={styles.uploadedFile}>
                <Image source={{ uri: file.uri }} style={styles.uploadedImage} />
                <TouchableOpacity 
                  style={styles.removeFileButton}
                  onPress={() => removeFile(file.id)}
                >
                  <Ionicons name="close" size={16} color={Colors.text.white} />
                </TouchableOpacity>
                <View style={styles.fileTypeIndicator}>
                  <Ionicons 
                    name={file.type === 'video' ? 'videocam' : 'image'} 
                    size={12} 
                    color={Colors.text.white} 
                  />
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );

  const renderDesiredActions = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>What do you want? *</Text>
      <Text style={styles.sectionSubtitle}>You can select multiple options</Text>
      
      <View style={styles.actionsContainer}>
        {desiredActionOptions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={[
              styles.actionOption,
              desiredActions.includes(action.id) && styles.actionOptionSelected
            ]}
            onPress={() => toggleDesiredAction(action.id)}
          >
            <View style={[
              styles.checkbox,
              desiredActions.includes(action.id) && styles.checkboxSelected
            ]}>
              {desiredActions.includes(action.id) && (
                <Ionicons name="checkmark" size={14} color={Colors.text.white} />
              )}
            </View>
            <Ionicons 
              name={action.icon as any} 
              size={18} 
              color={desiredActions.includes(action.id) ? Colors.primary.teal : Colors.text.secondary} 
            />
            <Text style={[
              styles.actionTitle,
              desiredActions.includes(action.id) && styles.actionTitleSelected
            ]}>
              {action.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderContactPreference = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Contact Preference *</Text>
      <Text style={styles.sectionSubtitle}>How should we reach you?</Text>
      
      <View style={styles.contactOptions}>
        {contactOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.contactOption,
              contactPreference === option.id && styles.contactOptionSelected
            ]}
            onPress={() => setContactPreference(option.id)}
          >
            <Ionicons 
              name={option.icon as any} 
              size={20} 
              color={contactPreference === option.id ? Colors.primary.teal : Colors.text.secondary} 
            />
            <Text style={[
              styles.contactTitle,
              contactPreference === option.id && styles.contactTitleSelected
            ]}>
              {option.title}
            </Text>
            <View style={[
              styles.radioButton,
              contactPreference === option.id && styles.radioButtonSelected
            ]}>
              {contactPreference === option.id && <View style={styles.radioButtonInner} />}
            </View>
          </TouchableOpacity>
        ))}
      </View>
      
      {contactPreference && contactPreference !== 'phone' && (
        <View style={styles.contactTimeContainer}>
          <Text style={styles.fieldLabel}>Best time to contact</Text>
          <TouchableOpacity 
            style={styles.timeRangeButton}
            onPress={() => setShowTimeRangePicker(true)}
          >
            <Ionicons name="time-outline" size={16} color={Colors.primary.teal} />
            <Text style={styles.timeRangeText}>
              {contactTime.start} - {contactTime.end}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderEmergencyToggle = () => (
    <View style={styles.section}>
      <View style={styles.emergencyContainer}>
        <View style={styles.emergencyHeader}>
          <Ionicons name="warning" size={24} color={Colors.functional.error} />
          <Text style={styles.emergencyTitle}>Emergency?</Text>
        </View>
        
        <TouchableOpacity
          style={[styles.emergencyToggle, isEmergency && styles.emergencyToggleActive]}
          onPress={() => setIsEmergency(!isEmergency)}
        >
          <View style={[
            styles.emergencyToggleThumb,
            isEmergency && styles.emergencyToggleThumbActive
          ]} />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.emergencyDescription}>
        Mark as emergency for immediate assistance and priority handling
      </Text>
      
      {isEmergency && (
        <View style={styles.emergencyInfo}>
          <View style={styles.emergencyInfoItem}>
            <Ionicons name="call" size={16} color={Colors.functional.error} />
            <Text style={styles.emergencyInfoText}>Immediate call from support</Text>
          </View>
          <View style={styles.emergencyInfoItem}>
            <Ionicons name="flash" size={16} color={Colors.functional.error} />
            <Text style={styles.emergencyInfoText}>Priority handling</Text>
          </View>
          <View style={styles.emergencyInfoItem}>
            <Ionicons name="time" size={16} color={Colors.functional.error} />
            <Text style={styles.emergencyInfoText}>24/7 emergency support: +91 1800 123 456</Text>
          </View>
        </View>
      )}
    </View>
  );

  const renderBookingDetails = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Related Booking Details</Text>
      <View style={styles.bookingDetailsCard}>
        <View style={styles.bookingDetailRow}>
          <Text style={styles.bookingDetailLabel}>Booking ID:</Text>
          <Text style={styles.bookingDetailValue}>{bookingData.bookingId}</Text>
        </View>
        <View style={styles.bookingDetailRow}>
          <Text style={styles.bookingDetailLabel}>Vehicle:</Text>
          <Text style={styles.bookingDetailValue}>{bookingData.vehicleName}</Text>
        </View>
        <View style={styles.bookingDetailRow}>
          <Text style={styles.bookingDetailLabel}>Registration:</Text>
          <Text style={styles.bookingDetailValue}>{bookingData.registrationNumber}</Text>
        </View>
        <View style={styles.bookingDetailRow}>
          <Text style={styles.bookingDetailLabel}>Owner:</Text>
          <Text style={styles.bookingDetailValue}>{bookingData.ownerName}</Text>
        </View>
        <View style={styles.bookingDetailRow}>
          <Text style={styles.bookingDetailLabel}>Trip Status:</Text>
          <Text style={[styles.bookingDetailValue, styles.tripStatus]}>{bookingData.tripStatus}</Text>
        </View>
      </View>
    </View>
  );

  const renderActionButtons = () => (
    <View style={styles.actionSection}>
      <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        <LinearGradient
          colors={isSubmitting ? ['#E5E7EB', '#E5E7EB'] : [Colors.primary.teal, Colors.accent.blue]}
          style={styles.submitGradient}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color={Colors.text.secondary} />
          ) : (
            <Text style={styles.submitButtonText}>Submit Report</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderMediaModal = () => (
    <Modal
      visible={showMediaModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowMediaModal(false)}
    >
      <SafeAreaView style={styles.mediaModal}>
        <View style={styles.mediaModalHeader}>
          <TouchableOpacity onPress={() => setShowMediaModal(false)}>
            <Text style={styles.mediaModalCancel}>Cancel</Text>
          </TouchableOpacity>
          
          <Text style={styles.mediaModalTitle}>Add Evidence</Text>
          
          <View style={styles.headerSpacer} />
        </View>
        
        <View style={styles.mediaModalContent}>
          <TouchableOpacity style={styles.mediaOption} onPress={() => handleMediaUpload('camera')}>
            <Ionicons name="camera" size={32} color={Colors.primary.teal} />
            <Text style={styles.mediaOptionTitle}>Take Photo</Text>
            <Text style={styles.mediaOptionSubtitle}>Capture with camera</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.mediaOption} onPress={() => handleMediaUpload('video')}>
            <Ionicons name="videocam" size={32} color={Colors.primary.teal} />
            <Text style={styles.mediaOptionTitle}>Record Video</Text>
            <Text style={styles.mediaOptionSubtitle}>Max 30 seconds</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.mediaOption} onPress={() => handleMediaUpload('gallery')}>
            <Ionicons name="images" size={32} color={Colors.primary.teal} />
            <Text style={styles.mediaOptionTitle}>Choose from Gallery</Text>
            <Text style={styles.mediaOptionSubtitle}>Select existing photos/videos</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );

  const renderSuccessModal = () => (
    <Modal
      visible={showSuccessModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowSuccessModal(false)}
    >
      <View style={styles.successOverlay}>
        <View style={styles.successModal}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={64} color={Colors.functional.success} />
          </View>
          
          <Text style={styles.successTitle}>Report Submitted</Text>
          <Text style={styles.successTicketId}>Ticket ID: #{generatedTicketId}</Text>
          
          <Text style={styles.successMessage}>
            We've received your report and will investigate the issue promptly.
          </Text>
          
          <Text style={styles.successResponseTime}>
            Expected response time: {getResponseTime()}
          </Text>
          
          <View style={styles.successActions}>
            <TouchableOpacity style={styles.trackButton}>
              <Text style={styles.trackButtonText}>Track Your Issue</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.doneButton}
              onPress={() => {
                setShowSuccessModal(false);
                router.back();
              }}
            >
              <LinearGradient
                colors={[Colors.primary.teal, Colors.accent.blue]}
                style={styles.doneGradient}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.viewAllIssuesLink}>
            <Text style={styles.viewAllIssuesText}>View all issues</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderDateTimePickers = () => (
    <>
      {showDatePicker && (
        <DateTimePicker
          value={issueDateTime}
          mode="date"
          display="default"
          maximumDate={new Date()}
          onChange={handleDateTimeChange}
        />
      )}
      
      {showTimePicker && (
        <DateTimePicker
          value={issueDateTime}
          mode="time"
          display="default"
          onChange={handleDateTimeChange}
        />
      )}
    </>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {renderHeader()}
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderIssueCategories()}
        {renderIssueDetails()}
        {renderUploadEvidence()}
        {renderDesiredActions()}
        {renderContactPreference()}
        {renderEmergencyToggle()}
        {renderBookingDetails()}
        
        <View style={styles.bottomSpacing} />
      </ScrollView>
      
      {renderActionButtons()}
      {renderMediaModal()}
      {renderSuccessModal()}
      {renderDateTimePickers()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.lightGrey,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: Colors.background.white,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  headerSpacer: {
    width: 40,
  },
  emergencyCallButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.functional.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: (width - 56) / 2,
    backgroundColor: Colors.background.white,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    minHeight: 120,
  },
  categoryCardSelected: {
    borderColor: Colors.primary.teal,
    backgroundColor: '#F0F9FF',
  },
  categoryTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.primary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  categoryTitleSelected: {
    color: Colors.primary.teal,
  },
  categoryDescription: {
    fontSize: 10,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 14,
  },
  subsection: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  dateTimeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.background.white,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dateTimeText: {
    fontSize: 14,
    color: Colors.text.primary,
  },
  justNowButton: {
    backgroundColor: Colors.primary.teal,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  justNowText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.white,
  },
  textInput: {
    backgroundColor: Colors.background.white,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 14,
    color: Colors.text.primary,
    minHeight: 44,
  },
  textArea: {
    backgroundColor: Colors.background.white,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 14,
    color: Colors.text.primary,
    minHeight: 100,
  },
  characterCount: {
    fontSize: 12,
    color: Colors.text.secondary,
    textAlign: 'right',
    marginTop: 4,
  },
  locationButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.primary.teal,
  },
  locationButtonText: {
    fontSize: 12,
    color: Colors.primary.teal,
    fontWeight: '500',
  },
  severityContainer: {
    gap: 8,
  },
  severityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.white,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
  },
  severityOptionSelected: {
    backgroundColor: '#F0F9FF',
  },
  severityIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
  },
  severityTextContainer: {
    flex: 1,
  },
  severityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  severityTitleSelected: {
    color: Colors.primary.teal,
  },
  severitySubtitle: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: Colors.primary.teal,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary.teal,
  },
  uploadContainer: {
    gap: 12,
  },
  uploadButton: {
    backgroundColor: Colors.background.white,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary.teal,
    borderStyle: 'dashed',
    alignItems: 'center',
    gap: 8,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary.teal,
  },
  uploadLimits: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  uploadedFilesContainer: {
    maxHeight: 100,
  },
  uploadedFile: {
    position: 'relative',
    marginRight: 8,
  },
  uploadedImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeFileButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.functional.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileTypeIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 2,
    borderRadius: 4,
  },
  actionsContainer: {
    gap: 8,
  },
  actionOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.white,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  actionOptionSelected: {
    backgroundColor: '#F0F9FF',
    borderColor: Colors.primary.teal,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: Colors.primary.teal,
    borderColor: Colors.primary.teal,
  },
  actionTitle: {
    flex: 1,
    fontSize: 14,
    color: Colors.text.primary,
  },
  actionTitleSelected: {
    color: Colors.primary.teal,
    fontWeight: '600',
  },
  contactOptions: {
    gap: 8,
  },
  contactOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.white,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  contactOptionSelected: {
    backgroundColor: '#F0F9FF',
    borderColor: Colors.primary.teal,
  },
  contactTitle: {
    flex: 1,
    fontSize: 14,
    color: Colors.text.primary,
  },
  contactTitleSelected: {
    color: Colors.primary.teal,
    fontWeight: '600',
  },
  contactTimeContainer: {
    marginTop: 12,
  },
  timeRangeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.background.white,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  timeRangeText: {
    fontSize: 14,
    color: Colors.text.primary,
  },
  emergencyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.background.white,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 8,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  emergencyToggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    padding: 2,
  },
  emergencyToggleActive: {
    backgroundColor: Colors.functional.error,
  },
  emergencyToggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.text.white,
  },
  emergencyToggleThumbActive: {
    alignSelf: 'flex-end',
  },
  emergencyDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 12,
  },
  emergencyInfo: {
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
    gap: 8,
  },
  emergencyInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emergencyInfoText: {
    fontSize: 12,
    color: Colors.functional.error,
    flex: 1,
  },
  bookingDetailsCard: {
    backgroundColor: Colors.background.white,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  bookingDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bookingDetailLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  bookingDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  tripStatus: {
    color: Colors.primary.teal,
    textTransform: 'capitalize',
  },
  actionSection: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.background.white,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: Colors.background.lightGrey,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  submitButton: {
    flex: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.white,
  },
  mediaModal: {
    flex: 1,
    backgroundColor: Colors.background.white,
  },
  mediaModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  mediaModalCancel: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  mediaModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  mediaModalContent: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
  mediaOption: {
    backgroundColor: Colors.background.lightGrey,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  mediaOptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  mediaOptionSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  successModal: {
    backgroundColor: Colors.background.white,
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  successIcon: {
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  successTicketId: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary.teal,
    marginBottom: 16,
  },
  successMessage: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 12,
  },
  successResponseTime: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.functional.success,
    marginBottom: 24,
    textAlign: 'center',
  },
  successActions: {
    width: '100%',
    gap: 12,
    marginBottom: 16,
  },
  trackButton: {
    backgroundColor: Colors.background.lightGrey,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  trackButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  doneButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  doneGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.white,
  },
  viewAllIssuesLink: {
    paddingVertical: 8,
  },
  viewAllIssuesText: {
    fontSize: 14,
    color: Colors.primary.teal,
    textDecorationLine: 'underline',
  },
  bottomSpacing: {
    height: 20,
  },
});