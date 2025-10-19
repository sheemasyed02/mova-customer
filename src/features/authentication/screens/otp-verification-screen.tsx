import { Colors } from '@/src/shared/constants/Colors';
import { Typography } from '@/src/shared/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function OTPVerificationScreen() {
  const { phoneNumber } = useLocalSearchParams();
  const displayPhoneNumber = phoneNumber ? phoneNumber.toString() : "+91 XXXXX XX234";
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const inputRefs = useRef<(TextInput | null)[]>([]);
  const spinnerAnim = useRef(new Animated.Value(0)).current;

  // Timer countdown
  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Auto-verify when 6 digits are entered
  useEffect(() => {
    if (otp.every(digit => digit !== '') && otp.join('').length === 6) {
      handleVerifyOTP();
    }
  }, [otp]);

  const handleOTPChange = (value: string, index: number) => {
    // Only allow numeric input
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take only the last character
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    setIsVerifying(true);
    
    // Start loading animation
    Animated.loop(
      Animated.timing(spinnerAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();

    const otpCode = otp.join('');
    
    // Simulate API call
    setTimeout(() => {
      console.log('OTP Verified:', otpCode);
      setIsVerifying(false);
      spinnerAnim.stopAnimation();
      router.push('/(features)/authentication/profile-setup' as any);
    }, 1500);
  };

  const handleResendOTP = () => {
    setTimer(30);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
    console.log('Resending OTP...');
  };

  const handleWhatsAppVerification = () => {
    console.log('Try via WhatsApp');
  };

  const handleEditPhoneNumber = () => {
    router.back();
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isOTPComplete = otp.every(digit => digit !== '');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Illustration */}
          <View style={styles.illustrationContainer}>
            <View style={styles.phoneIconContainer}>
              <Ionicons name="phone-portrait" size={80} color={Colors.primary.teal} />
              <View style={styles.lockIconContainer}>
                <Ionicons name="lock-closed" size={24} color="#ffffff" />
              </View>
            </View>
          </View>

          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>Enter Verification Code</Text>
            <View style={styles.subtitleContainer}>
              <Text style={styles.subtitle}>
                Code sent to {displayPhoneNumber}
              </Text>
              <TouchableOpacity 
                style={styles.editButton}
                onPress={handleEditPhoneNumber}
              >
                <Ionicons name="pencil" size={16} color={Colors.primary.teal} />
              </TouchableOpacity>
            </View>
          </View>

          {/* OTP Input Section */}
          <View style={styles.otpSection}>
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => { inputRefs.current[index] = ref; }}
                  style={[
                    styles.otpInput,
                    digit ? styles.otpInputFilled : {},
                    index === otp.findIndex(d => d === '') ? styles.otpInputActive : {}
                  ]}
                  value={digit}
                  onChangeText={(value) => handleOTPChange(value, index)}
                  onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                  keyboardType="numeric"
                  maxLength={1}
                  textAlign="center"
                  selectTextOnFocus
                  autoFocus={index === 0}
                />
              ))}
            </View>
          </View>

          {/* Timer and Resend Section */}
          <View style={styles.timerSection}>
            {!canResend ? (
              <Text style={styles.timerText}>
                Resend OTP in {formatTimer(timer)}
              </Text>
            ) : (
              <TouchableOpacity 
                style={styles.resendButton}
                onPress={handleResendOTP}
              >
                <Text style={styles.resendButtonText}>Resend OTP</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* WhatsApp Option */}
          <TouchableOpacity 
            style={styles.whatsappButton}
            onPress={handleWhatsAppVerification}
          >
            <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
            <Text style={styles.whatsappText}>Didn't receive? Try via WhatsApp</Text>
          </TouchableOpacity>

          {/* Verify Button */}
          <View style={styles.buttonSection}>
            <TouchableOpacity
              style={[
                styles.verifyButton,
                !isOTPComplete && styles.verifyButtonDisabled
              ]}
              onPress={handleVerifyOTP}
              disabled={!isOTPComplete || isVerifying}
            >
              <LinearGradient
                colors={isOTPComplete ? [Colors.primary.teal, '#20A39E'] : ['#E5E7EB', '#D1D5DB']}
                style={styles.verifyButtonGradient}
              >
                {isVerifying ? (
                  <View style={styles.loadingContainer}>
                    <Animated.View 
                      style={[
                        styles.loadingSpinner,
                        {
                          transform: [{
                            rotate: spinnerAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: ['0deg', '360deg']
                            })
                          }]
                        }
                      ]} 
                    />
                    <Text style={styles.verifyButtonText}>Verifying...</Text>
                  </View>
                ) : (
                  <Text style={[
                    styles.verifyButtonText,
                    !isOTPComplete && styles.verifyButtonTextDisabled
                  ]}>
                    Verify
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  phoneIconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockIconContainer: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: Colors.primary.teal,
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: Typography.sizes.h1,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: Typography.sizes.bodyLarge,
    fontWeight: '400',
    color: Colors.text.secondary,
    textAlign: 'center',
    marginRight: 8,
  },
  editButton: {
    padding: 4,
  },
  otpSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 300,
  },
  otpInput: {
    width: 45,
    height: 55,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    fontSize: Typography.sizes.h2,
    fontWeight: '600',
    color: Colors.text.primary,
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  otpInputFilled: {
    borderColor: Colors.primary.teal,
    backgroundColor: '#F0FDFC',
  },
  otpInputActive: {
    borderColor: Colors.primary.teal,
    borderWidth: 3,
  },
  timerSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  timerText: {
    fontSize: Typography.sizes.body,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  resendButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  resendButtonText: {
    fontSize: Typography.sizes.bodyLarge,
    fontWeight: '600',
    color: Colors.primary.teal,
  },
  whatsappButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 30,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
  },
  whatsappText: {
    fontSize: Typography.sizes.body,
    fontWeight: '500',
    color: Colors.text.secondary,
    marginLeft: 8,
  },
  buttonSection: {
    marginTop: 20,
  },
  verifyButton: {
    shadowColor: Colors.primary.teal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  verifyButtonDisabled: {
    shadowOpacity: 0.1,
    elevation: 2,
  },
  verifyButtonGradient: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  verifyButtonText: {
    fontSize: Typography.sizes.bodyLarge,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
  verifyButtonTextDisabled: {
    color: Colors.text.secondary,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingSpinner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ffffff',
    borderTopColor: 'transparent',
    marginRight: 8,
  },
});
