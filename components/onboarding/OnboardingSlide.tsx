import { Colors } from '@/constants/Colors';
import { OnboardingSlide } from '@/constants/OnboardingData';
import { Typography } from '@/constants/Typography';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    View
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface OnboardingSlideProps {
  slide: OnboardingSlide;
}

export default function OnboardingSlideComponent({ slide }: OnboardingSlideProps) {
  return (
    <View style={styles.container}>
      {/* Advanced Gradient Background */}
      <LinearGradient
        colors={[
          slide.backgroundColor,
          slide.accentColor,
          slide.backgroundColor
        ]}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Floating Background Elements */}
        <View style={styles.floatingElements}>
          <View style={[styles.floatingCircle, styles.circle1, { backgroundColor: slide.accentColor }]} />
          <View style={[styles.floatingCircle, styles.circle2, { backgroundColor: Colors.text.white }]} />
          <View style={[styles.floatingCircle, styles.circle3, { backgroundColor: slide.accentColor }]} />
        </View>

        {/* Background Icon */}
        <View style={styles.backgroundIcon}>
          <Image
            source={slide.icon}
            style={[styles.bgIcon, { tintColor: Colors.text.white }]}
            resizeMode="contain"
          />
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Image Section with Enhanced Styling */}
          <View style={styles.imageSection}>
            <View style={styles.imageWrapper}>
              {/* Glow Effect */}
              <View style={[styles.imageGlow, { backgroundColor: Colors.text.white }]} />
              
              {/* Main Illustration */}
              <View style={styles.imageContainer}>
                <Image
                  source={slide.image}
                  style={styles.mainImage}
                  resizeMode="contain"
                />
              </View>

              {/* Decorative Elements around Image */}
              <View style={[styles.decorDot, styles.dot1, { backgroundColor: slide.accentColor }]} />
              <View style={[styles.decorDot, styles.dot2, { backgroundColor: Colors.text.white }]} />
              <View style={[styles.decorDot, styles.dot3, { backgroundColor: slide.accentColor }]} />
            </View>
          </View>

          {/* Content Section with Modern Typography */}
          <View style={styles.textSection}>
            {/* Step Indicator */}
            <View style={styles.stepIndicator}>
              <Text style={styles.stepText}>Step {slide.id}</Text>
              <View style={[styles.stepLine, { backgroundColor: slide.accentColor }]} />
            </View>

            {/* Title with Enhanced Styling */}
            <Text style={styles.title}>{slide.title}</Text>
            
            {/* Description with Better Readability */}
            <Text style={styles.description}>{slide.description}</Text>

            {/* Feature Highlights */}
            <View style={styles.featureHighlights}>
              <View style={styles.featureDot} />
              <View style={styles.featureDot} />
              <View style={styles.featureDot} />
            </View>
          </View>
        </View>

        {/* Bottom Decorative Wave */}
        <View style={styles.bottomWave} />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
    position: 'relative' as const,
  },

  // Floating Background Elements
  floatingElements: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  floatingCircle: {
    position: 'absolute' as const,
    borderRadius: 50,
    opacity: 0.1,
  },
  circle1: {
    width: 100,
    height: 100,
    top: '15%',
    left: '10%',
  },
  circle2: {
    width: 60,
    height: 60,
    top: '25%',
    right: '15%',
  },
  circle3: {
    width: 80,
    height: 80,
    bottom: '20%',
    left: '20%',
  },

  // Background Icon
  backgroundIcon: {
    position: 'absolute' as const,
    top: '10%',
    right: -50,
    opacity: 0.05,
    zIndex: 1,
  },
  bgIcon: {
    width: 200,
    height: 200,
  },

  // Main Content
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    zIndex: 2,
  },

  // Enhanced Image Section
  imageSection: {
    flex: 0.55,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  imageWrapper: {
    position: 'relative' as const,
    alignItems: 'center' as const,
  },
  imageGlow: {
    position: 'absolute' as const,
    width: width * 0.75,
    height: width * 0.75,
    borderRadius: (width * 0.75) / 2,
    opacity: 0.1,
    zIndex: 1,
  },
  imageContainer: {
    width: width * 0.65,
    height: width * 0.65,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    shadowColor: Colors.text.white,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    zIndex: 2,
  },
  mainImage: {
    width: width * 0.55,
    height: width * 0.55,
  },

  // Decorative Dots around Image
  decorDot: {
    position: 'absolute' as const,
    width: 12,
    height: 12,
    borderRadius: 6,
    opacity: 0.8,
  },
  dot1: {
    top: 20,
    left: 30,
  },
  dot2: {
    top: 60,
    right: 20,
  },
  dot3: {
    bottom: 40,
    left: 20,
  },

  // Modern Text Section
  textSection: {
    flex: 0.45,
    paddingTop: 40,
    alignItems: 'center' as const,
  },

  // Step Indicator
  stepIndicator: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 20,
  },
  stepText: {
    fontSize: Typography.sizes.body,
    fontWeight: '600' as const,
    color: Colors.text.white,
    opacity: 0.8,
    marginRight: 12,
  },
  stepLine: {
    width: 40,
    height: 2,
    borderRadius: 1,
  },

  // Enhanced Typography
  title: {
    fontSize: Typography.sizes.h1,
    fontWeight: '800' as const,
    color: Colors.text.white,
    textAlign: 'center' as const,
    marginBottom: 16,
    lineHeight: Typography.sizes.h1 + 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  description: {
    fontSize: Typography.sizes.bodyLarge,
    fontWeight: '400' as const,
    color: Colors.text.white,
    textAlign: 'center' as const,
    lineHeight: Typography.sizes.bodyLarge + 6,
    opacity: 0.95,
    marginBottom: 24,
    paddingHorizontal: 8,
  },

  // Feature Highlights
  featureHighlights: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.text.white,
    marginHorizontal: 6,
    opacity: 0.6,
  },

  // Bottom Wave Effect
  bottomWave: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
});