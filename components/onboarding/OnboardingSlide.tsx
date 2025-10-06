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
      {/* Clean Gradient Background */}
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
        {/* Minimal Floating Elements */}
        <View style={styles.floatingElements}>
          <View style={[styles.floatingCircle, styles.circle1, { backgroundColor: slide.accentColor }]} />
          <View style={[styles.floatingCircle, styles.circle2, { backgroundColor: Colors.text.white }]} />
          <View style={[styles.floatingCircle, styles.circle3, { backgroundColor: slide.accentColor }]} />
        </View>

        {/* Main Content - Fits Screen Height */}
        <View style={styles.content}>
          {/* Compact Image Section */}
          <View style={styles.imageSection}>
            <View style={styles.imageWrapper}>
              {/* Clean Image Container */}
              <View style={[styles.imageContainer, { 
                backgroundColor: `${Colors.text.white}15`,
                borderColor: `${Colors.text.white}30`,
              }]}>
                <Image
                  source={slide.image}
                  style={styles.mainImage}
                  resizeMode="contain"
                />
              </View>

              {/* Minimal Decorative Elements */}
              <View style={[styles.decorDot, styles.dot1, { backgroundColor: slide.accentColor }]} />
              <View style={[styles.decorDot, styles.dot2, { backgroundColor: Colors.text.white }]} />
            </View>
          </View>

          {/* Compact Text Section */}
          <View style={styles.textSection}>
            {/* Step Indicator */}
            <View style={styles.stepIndicator}>
              <View style={[styles.stepBadge, { backgroundColor: slide.accentColor }]}>
                <Text style={styles.stepNumber}>{slide.id}</Text>
              </View>
              <Text style={styles.stepText}>Step {slide.id} of 3</Text>
            </View>

            {/* Clean Title */}
            <Text style={styles.title}>{slide.title}</Text>
            
            {/* Clean Description */}
            <Text style={styles.description}>{slide.description}</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    height: height - 200, // Leave space for bottom section
  },
  gradientBackground: {
    flex: 1,
    position: 'relative' as const,
  },

  // Minimal Floating Elements
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
    opacity: 0.08,
  },
  circle1: {
    width: 80,
    height: 80,
    top: '20%',
    left: '10%',
  },
  circle2: {
    width: 50,
    height: 50,
    top: '30%',
    right: '15%',
  },
  circle3: {
    width: 60,
    height: 60,
    bottom: '25%',
    left: '15%',
  },

  // Main Content - Optimized for Height
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 100, // Account for skip button
    paddingBottom: 20,
    justifyContent: 'space-between' as const,
    zIndex: 2,
  },

  // Compact Image Section
  imageSection: {
    flex: 0.6,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  imageWrapper: {
    position: 'relative' as const,
    alignItems: 'center' as const,
  },
  imageContainer: {
    width: width * 0.55,
    height: width * 0.55,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    shadowColor: Colors.text.white,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 2,
    overflow: 'hidden' as const,
  },
  mainImage: {
    width: width * 0.45,
    height: width * 0.45,
  },

  // Minimal Decorative Elements
  decorDot: {
    position: 'absolute' as const,
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.6,
  },
  dot1: {
    top: 15,
    left: 25,
  },
  dot2: {
    bottom: 20,
    right: 30,
  },

  // Compact Text Section
  textSection: {
    flex: 0.4,
    alignItems: 'center' as const,
    paddingTop: 20,
  },

  // Clean Step Indicator
  stepIndicator: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginRight: 10,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.text.white,
  },
  stepText: {
    fontSize: Typography.sizes.caption,
    fontWeight: '500' as const,
    color: Colors.text.white,
    opacity: 0.8,
  },

  // Clean Typography
  title: {
    fontSize: Typography.sizes.h2,
    fontWeight: '700' as const,
    color: Colors.text.white,
    textAlign: 'center' as const,
    marginBottom: 12,
    lineHeight: Typography.sizes.h2 + 4,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  description: {
    fontSize: Typography.sizes.body,
    fontWeight: '400' as const,
    color: Colors.text.white,
    textAlign: 'center' as const,
    lineHeight: Typography.sizes.body + 4,
    opacity: 0.9,
    paddingHorizontal: 12,
  },
});