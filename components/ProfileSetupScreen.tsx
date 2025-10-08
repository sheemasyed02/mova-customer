import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import { BasicDetailsStep, LocationStep, PreferencesStep } from './ProfileSetup';

const { width, height } = Dimensions.get('window');

export interface ProfileData {
  // Basic Details
  profilePhoto?: string;
  fullName: string;
  email: string;
  dateOfBirth: Date | null;
  gender: string;
  
  // Location
  state: string;
  city: string;
  pincode: string;
  useCurrentLocation: boolean;
  
  // Preferences
  favoriteVehicleTypes: string[];
  typicalUsage: string;
}

const initialProfileData: ProfileData = {
  fullName: '',
  email: '',
  dateOfBirth: null,
  gender: '',
  state: '',
  city: '',
  pincode: '',
  useCurrentLocation: false,
  favoriteVehicleTypes: [],
  typicalUsage: '',
};

export default function ProfileSetupScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState<ProfileData>(initialProfileData);
  const [animatedValue] = useState(new Animated.Value(0));
  const [slideAnimation] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  React.useEffect(() => {
    Animated.timing(slideAnimation, {
      toValue: currentStep - 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
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
          { text: 'Skip', onPress: () => router.push('/home-permission' as any) },
        ]
      );
    } else if (currentStep === 3) {
      handleFinishSetup();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleFinishSetup = () => {
    // Save profile data to storage/API
    console.log('Profile Setup Complete:', profileData);
    router.push('/home-permission' as any); // Navigate to permission screen
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
    const stepProps = {
      profileData,
      updateProfileData,
      onNext: handleNext,
      onSkip: handleSkip,
    };

    switch (currentStep) {
      case 1:
        return <BasicDetailsStep {...stepProps} />;
      case 2:
        return <LocationStep {...stepProps} />;
      case 3:
        return <PreferencesStep {...stepProps} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={['rgba(45, 155, 142, 0.02)', 'rgba(45, 155, 142, 0.05)', '#ffffff']}
        style={styles.backgroundGradient}
      />

      {/* Header */}
      <Animated.View style={[styles.header, {
        opacity: animatedValue,
        transform: [{
          translateY: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [-30, 0],
          })
        }]
      }]}>
        {currentStep > 1 && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
        )}
        
        <View style={styles.headerContent}>
          <Text style={styles.stepIndicator}>
            Step {currentStep} of 3
          </Text>
          <Text style={styles.title}>{getStepTitle()}</Text>
          <Text style={styles.subtitle}>{getStepSubtitle()}</Text>
        </View>

        {/* Progress Bar */}
        {renderProgressBar()}
      </Animated.View>

      {/* Step Content */}
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <Animated.View style={[styles.stepContainer, {
          transform: [{
            translateX: slideAnimation.interpolate({
              inputRange: [0, 1, 2],
              outputRange: [0, -width, -width * 2],
            })
          }]
        }]}>
          {renderStep()}
        </Animated.View>
      </KeyboardAvoidingView>
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
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 25,
    backgroundColor: 'transparent',
  },
  backButton: {
    position: 'absolute',
    top: 55,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1,
  },
  headerContent: {
    alignItems: 'center',
    marginTop: 10,
  },
  stepIndicator: {
    fontSize: Typography.sizes.caption,
    fontWeight: '500',
    color: Colors.primary.teal,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: Typography.sizes.h2,
    fontWeight: '700',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: Typography.sizes.caption,
    fontWeight: '400',
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 18,
    opacity: 0.8,
    marginBottom: 25,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressStep: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  progressDotActive: {
    backgroundColor: Colors.primary.teal,
    borderColor: Colors.primary.teal,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  progressTextActive: {
    color: '#ffffff',
  },
  progressLine: {
    width: 40,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
  progressLineActive: {
    backgroundColor: Colors.primary.teal,
  },
  content: {
    flex: 1,
  },
  stepContainer: {
    flex: 1,
    width: width * 3,
    flexDirection: 'row',
  },
});