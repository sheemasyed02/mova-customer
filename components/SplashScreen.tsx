import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const { width, height } = Dimensions.get('window');
const SPLASH_DURATION = 3000; // 3 seconds

export default function SplashScreen() {
  // Animation values
  const [logoOpacity] = useState(new Animated.Value(0));
  const [logoScale] = useState(new Animated.Value(0.5));
  const [logoRotate] = useState(new Animated.Value(0));
  const [taglineOpacity] = useState(new Animated.Value(0));
  const [taglineTranslateY] = useState(new Animated.Value(50));
  const [wheelRotate] = useState(new Animated.Value(0));
  const [wheelScale] = useState(new Animated.Value(0));
  const [particlesOpacity] = useState(new Animated.Value(0));

  // Navigate to main app
  const navigateToApp = () => {
    router.replace('/onboarding');
  };

  useEffect(() => {
    // Start animations
    startAnimations();
    
    // Auto-navigate after duration
    const timer = setTimeout(() => {
      navigateToApp();
    }, SPLASH_DURATION);

    return () => clearTimeout(timer);
  }, []);

  const startAnimations = () => {
    // Main logo entrance - dramatic scale and fade
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(logoScale, {
          toValue: 1.2,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Wheel animation - rotate and scale
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(wheelScale, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.timing(wheelRotate, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          })
        ),
      ]).start();
    }, 300);

    // Tagline with bounce effect
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.spring(taglineTranslateY, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }, 500);

    // Floating particles effect
    setTimeout(() => {
      Animated.timing(particlesOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }, 800);
  };

  const wheelRotateInterpolate = wheelRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      
      {/* Advanced Gradient Background */}
      <LinearGradient
        colors={[
          Colors.gradient.splashStart,
          Colors.accent.blue,
          Colors.gradient.splashEnd
        ]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Floating Particles */}
        <Animated.View style={[styles.particlesContainer, { opacity: particlesOpacity }]}>
          <View style={[styles.particle, styles.particle1]} />
          <View style={[styles.particle, styles.particle2]} />
          <View style={[styles.particle, styles.particle3]} />
          <View style={[styles.particle, styles.particle4]} />
        </Animated.View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Background Decorative Wheel */}
          <Animated.View 
            style={[
              styles.backgroundWheel,
              {
                transform: [
                  { scale: wheelScale },
                  { rotate: wheelRotateInterpolate }
                ]
              }
            ]}
          >
            <Image
              source={require('@/assets/images/movawheel.png')}
              style={styles.wheelBg}
              resizeMode="contain"
            />
          </Animated.View>

          {/* Logo Section */}
          <View style={styles.logoSection}>
            <Animated.View 
              style={[
                styles.logoContainer, 
                { 
                  opacity: logoOpacity,
                  transform: [{ scale: logoScale }]
                }
              ]}
            >
              {/* Main Logo */}
              <View style={styles.logoWrapper}>
                <Image
                  source={require('@/assets/images/Mova1.jpg')}
                  style={styles.mainLogo}
                  resizeMode="contain"
                />
                {/* Glowing effect */}
                <View style={styles.logoGlow} />
              </View>

              {/* Brand Text */}
              <View style={styles.brandContainer}>
                <Text style={styles.brandText}>MOVA</Text>
                <View style={styles.brandUnderline} />
              </View>
            </Animated.View>
            
            {/* Tagline with enhanced styling */}
            <Animated.View 
              style={[
                styles.taglineContainer, 
                { 
                  opacity: taglineOpacity,
                  transform: [{ translateY: taglineTranslateY }]
                }
              ]}
            >
              <Text style={styles.tagline}>Rent. Drive. Explore.</Text>
              <Text style={styles.subtitle}>Your Premium Car Rental Experience</Text>
            </Animated.View>
          </View>

          {/* Side Decorative Elements */}
          <View style={styles.leftDecor}>
            <View style={styles.decorLine} />
            <View style={[styles.decorLine, { marginTop: 10, width: 40 }]} />
          </View>
          
          <View style={styles.rightDecor}>
            <View style={styles.decorLine} />
            <View style={[styles.decorLine, { marginTop: 10, width: 40 }]} />
          </View>
        </View>

        {/* Enhanced Version Section */}
        <View style={styles.bottomSection}>
          <View style={styles.versionContainer}>
            <View style={styles.versionDot} />
            <Text style={styles.versionText}>Version 1.0.0</Text>
            <View style={styles.versionDot} />
          </View>
          <Text style={styles.loadingText}>Loading your journey...</Text>
        </View>

        {/* Premium overlay effects */}
        <View style={styles.topOverlay} />
        <View style={styles.bottomOverlay} />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  } as const,
  gradient: {
    flex: 1,
    position: 'relative' as const,
  },
  
  // Particle Effects
  particlesContainer: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  particle: {
    position: 'absolute' as const,
    width: 4,
    height: 4,
    backgroundColor: Colors.text.white,
    borderRadius: 2,
    opacity: 0.6,
  },
  particle1: {
    top: '20%',
    left: '15%',
  },
  particle2: {
    top: '35%',
    right: '20%',
  },
  particle3: {
    bottom: '30%',
    left: '10%',
  },
  particle4: {
    bottom: '45%',
    right: '15%',
  },

  // Background Elements
  backgroundWheel: {
    position: 'absolute' as const,
    top: '15%',
    right: -100,
    opacity: 0.08,
    zIndex: 2,
  },
  wheelBg: {
    width: 300,
    height: 300,
    tintColor: Colors.text.white,
  },

  // Main Content
  content: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 40,
    zIndex: 3,
  },
  logoSection: {
    alignItems: 'center' as const,
    zIndex: 4,
  },
  logoContainer: {
    alignItems: 'center' as const,
    marginBottom: 40,
  },
  
  // Enhanced Logo Styling
  logoWrapper: {
    position: 'relative' as const,
    alignItems: 'center' as const,
    marginBottom: 20,
  },
  mainLogo: {
    width: 220,
    height: 140,
    borderRadius: 20,
    shadowColor: Colors.text.white,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  logoGlow: {
    position: 'absolute' as const,
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    backgroundColor: Colors.text.white,
    opacity: 0.1,
    borderRadius: 30,
    zIndex: -1,
  },

  // Brand Text
  brandContainer: {
    alignItems: 'center' as const,
    marginBottom: 20,
  },
  brandText: {
    fontSize: 36,
    fontWeight: '800' as const,
    color: Colors.text.white,
    letterSpacing: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  brandUnderline: {
    width: 60,
    height: 3,
    backgroundColor: Colors.accent.cyan,
    borderRadius: 2,
    marginTop: 8,
  },

  // Enhanced Tagline
  taglineContainer: {
    alignItems: 'center' as const,
    paddingHorizontal: 20,
  },
  tagline: {
    fontSize: Typography.sizes.h2,
    fontWeight: '700' as const,
    color: Colors.text.white,
    textAlign: 'center' as const,
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: Typography.sizes.body,
    fontWeight: '400' as const,
    color: Colors.text.white,
    textAlign: 'center' as const,
    opacity: 0.9,
    letterSpacing: 0.5,
  },

  // Decorative Elements
  leftDecor: {
    position: 'absolute' as const,
    left: 30,
    top: '40%',
  },
  rightDecor: {
    position: 'absolute' as const,
    right: 30,
    top: '60%',
  },
  decorLine: {
    width: 60,
    height: 2,
    backgroundColor: Colors.text.white,
    opacity: 0.3,
    borderRadius: 1,
  },

  // Bottom Section
  bottomSection: {
    paddingBottom: Platform.OS === 'ios' ? 50 : 30,
    alignItems: 'center' as const,
    zIndex: 4,
  },
  versionContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 8,
  },
  versionDot: {
    width: 6,
    height: 6,
    backgroundColor: Colors.accent.cyan,
    borderRadius: 3,
    marginHorizontal: 12,
  },
  versionText: {
    fontSize: Typography.sizes.caption,
    fontWeight: '500' as const,
    color: Colors.text.white,
    opacity: 0.8,
    letterSpacing: 1,
  },
  loadingText: {
    fontSize: Typography.sizes.caption,
    fontWeight: '400' as const,
    color: Colors.text.white,
    opacity: 0.6,
    fontStyle: 'italic' as const,
  },

  // Premium Overlays
  topOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  bottomOverlay: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
});