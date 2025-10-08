import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
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

export default function LoginSignupScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handlePhoneLogin = () => {
    // Navigate to OTP verification or main app
    console.log('Phone login with:', '+91' + phoneNumber);
    router.replace('/(tabs)');
  };

  const handleGoogleLogin = () => {
    console.log('Google login');
    router.replace('/(tabs)');
  };

  const handleFacebookLogin = () => {
    console.log('Facebook login');
    router.replace('/(tabs)');
  };

  const handleAppleLogin = () => {
    console.log('Apple login');
    router.replace('/(tabs)');
  };

  const formatPhoneNumber = (text: string) => {
    // Remove all non-digits
    const digits = text.replace(/\D/g, '');
    // Limit to 10 digits
    return digits.slice(0, 10);
  };

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
          {/* MOVA Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require('@/assets/images/icon.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Welcome to MOVA</Text>
            <Text style={styles.welcomeSubtext}>Your journey starts here</Text>
          </View>

          {/* Phone Number Login Section */}
          <View style={styles.authSection}>
            <Text style={styles.sectionTitle}>Phone Number</Text>
            
            <View style={styles.phoneInputContainer}>
              {/* Country Code */}
              <View style={styles.countryCodeContainer}>
                <Text style={styles.flagEmoji}>🇮🇳</Text>
                <Text style={styles.countryCode}>+91</Text>
              </View>
              
              {/* Phone Input */}
              <TextInput
                style={styles.phoneInput}
                placeholder="Enter your phone number"
                placeholderTextColor={Colors.text.secondary}
                value={phoneNumber}
                onChangeText={(text) => setPhoneNumber(formatPhoneNumber(text))}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>
            
            {/* Continue with Phone Button */}
            <TouchableOpacity
              style={[
                styles.primaryButton,
                phoneNumber.length !== 10 && styles.primaryButtonDisabled
              ]}
              onPress={handlePhoneLogin}
              disabled={phoneNumber.length !== 10}
            >
              <LinearGradient
                colors={phoneNumber.length === 10 ? [Colors.primary.teal, '#20A39E'] : ['#E5E7EB', '#D1D5DB']}
                style={styles.primaryButtonGradient}
              >
                <Text style={[
                  styles.primaryButtonText,
                  phoneNumber.length !== 10 && styles.primaryButtonTextDisabled
                ]}>
                  Continue with Phone
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Login Section */}
          <View style={styles.socialSection}>
            <Text style={styles.sectionTitle}>Social Login</Text>
            
            {/* Google Login */}
            <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
              <View style={styles.socialButtonContent}>
                <Image 
                  source={{ uri: 'https://developers.google.com/identity/images/g-logo.png' }}
                  style={styles.socialIcon}
                />
                <Text style={styles.socialButtonText}>Continue with Google</Text>
              </View>
            </TouchableOpacity>

            {/* Facebook Login */}
            <TouchableOpacity style={styles.socialButton} onPress={handleFacebookLogin}>
              <View style={styles.socialButtonContent}>
                <View style={styles.facebookIconContainer}>
                  <Text style={styles.facebookIcon}>f</Text>
                </View>
                <Text style={styles.socialButtonText}>Continue with Facebook</Text>
              </View>
            </TouchableOpacity>

            {/* Apple Login (iOS only) */}
            {Platform.OS === 'ios' && (
              <TouchableOpacity style={styles.socialButton} onPress={handleAppleLogin}>
                <View style={styles.socialButtonContent}>
                  <View style={styles.appleIconContainer}>
                    <Text style={styles.appleIcon}></Text>
                  </View>
                  <Text style={styles.socialButtonText}>Continue with Apple</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>

          {/* Terms and Privacy */}
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By continuing, you agree to our{' '}
              <Text style={styles.linkText}>Terms & Conditions</Text>
              {' '}and{' '}
              <Text style={styles.linkText}>Privacy Policy</Text>
            </Text>
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
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: Typography.sizes.h1,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  welcomeSubtext: {
    fontSize: Typography.sizes.bodyLarge,
    fontWeight: '400',
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  authSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: Typography.sizes.h3,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  flagEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  countryCode: {
    fontSize: Typography.sizes.bodyLarge,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: Typography.sizes.bodyLarge,
    color: Colors.text.primary,
  },
  primaryButton: {
    shadowColor: Colors.primary.teal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonDisabled: {
    shadowOpacity: 0.1,
    elevation: 2,
  },
  primaryButtonGradient: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: Typography.sizes.bodyLarge,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
  primaryButtonTextDisabled: {
    color: Colors.text.secondary,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: Typography.sizes.body,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  socialSection: {
    marginBottom: 30,
  },
  socialButton: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  socialButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  facebookIconContainer: {
    width: 24,
    height: 24,
    backgroundColor: '#1877F2',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  facebookIcon: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  appleIconContainer: {
    width: 24,
    height: 24,
    backgroundColor: '#000000',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  appleIcon: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  socialButtonText: {
    fontSize: Typography.sizes.bodyLarge,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  termsContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  termsText: {
    fontSize: Typography.sizes.caption,
    fontWeight: '400',
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  linkText: {
    color: Colors.primary.teal,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});