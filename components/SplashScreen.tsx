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
  const [logoScale] = useState(new Animated.Value(0.8));
  const [taglineOpacity] = useState(new Animated.Value(0));
  const [taglineTranslateY] = useState(new Animated.Value(30));
  const [versionOpacity] = useState(new Animated.Value(0));

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
    // Logo animation - fade in and scale
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(logoScale, {
          toValue: 1.1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Tagline animation - fade in and slide up
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(taglineTranslateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }, 400);

    // Version animation - fade in
    setTimeout(() => {
      Animated.timing(versionOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }, 800);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      
      {/* Gradient Background */}
      <LinearGradient
        colors={[Colors.gradient.splashStart, Colors.gradient.splashEnd]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Main Content */}
        <View style={styles.content}>
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
              <Image
                source={require('@/assets/images/Mova.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </Animated.View>
            
            {/* Tagline */}
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
            </Animated.View>
          </View>

          {/* Decorative Elements */}
          <View style={styles.decorativeSection}>
            <Image
              source={require('@/assets/images/movawheel.png')}
              style={styles.wheelIcon}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Version Number */}
        <Animated.View 
          style={[
            styles.versionContainer, 
            { opacity: versionOpacity }
          ]}
        >
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </Animated.View>

        {/* Subtle overlay for depth */}
        <View style={styles.overlay} />
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
  overlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  content: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 40,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  logoSection: {
    alignItems: 'center' as const,
    marginBottom: 60,
  },
  logoContainer: {
    marginBottom: 24,
    shadowColor: Colors.text.white,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logo: {
    width: 180,
    height: 120,
    tintColor: Colors.text.white,
  },
  taglineContainer: {
    alignItems: 'center' as const,
  },
  tagline: {
    fontSize: Typography.sizes.h2,
    fontWeight: '700' as const,
    color: Colors.text.white,
    textAlign: 'center' as const,
    letterSpacing: 1.2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  decorativeSection: {
    position: 'absolute' as const,
    bottom: 120,
    right: -20,
    opacity: 0.1,
  },
  wheelIcon: {
    width: 150,
    height: 150,
    tintColor: Colors.text.white,
  },
  versionContainer: {
    position: 'absolute' as const,
    bottom: Platform.OS === 'ios' ? 50 : 30,
    left: 0,
    right: 0,
    alignItems: 'center' as const,
  },
  versionText: {
    fontSize: Typography.sizes.caption,
    fontWeight: '400' as const,
    color: Colors.text.white,
    opacity: 0.8,
    letterSpacing: 0.5,
  },
});