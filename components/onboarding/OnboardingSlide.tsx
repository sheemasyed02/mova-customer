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
          {/* Clean Image Section */}
          <View style={styles.imageSection}>
            <View style={styles.imageWrapper}>
              {/* Clean Image Container - Transparent background */}
              <View style={styles.imageContainer}>
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
            {/* Clean Title - Dark MOVA Colors */}
            <Text style={styles.title} numberOfLines={2}>{slide.title}</Text>
            
            {/* Clean Description - Dark MOVA Colors */}
            <Text style={styles.description} numberOfLines={3}>{slide.description}</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    height: height - 180, // Optimized height for better fit
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

  // Main Content - Optimized for image above, text below layout
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 80, // Account for skip button
    paddingBottom: 20,
    justifyContent: 'flex-start' as const, // Changed from space-between to flex-start
    zIndex: 2,
  },

  // Clean Image Section - Smaller container height, bigger image with minimal borders
  imageSection: {
    flex: 0.7, // Increased to accommodate larger image section
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 20,
  },
  imageWrapper: {
    position: 'relative' as const,
    alignItems: 'center' as const,
  },
  imageContainer: {
    width: width * 0.8, // Bigger container width
    height: width * 0.5, // Smaller container height as requested
    borderRadius: 12,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: 'transparent',
    zIndex: 2,
    overflow: 'hidden' as const,
    padding: 4, // Small borders only
  },
  mainImage: {
    width: '100%', // Fill container completely
    height: '100%', // Fill container completely
    borderRadius: 8,
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

  // Text Section - Positioned below image with dark MOVA colors
  textSection: {
    flex: 0.3,
    alignItems: 'center' as const,
    paddingTop: 10,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },

  // Dark MOVA Colors Typography
  title: {
    fontSize: Typography.sizes.h3 - 2, // Slightly smaller to fit better
    fontWeight: '700' as const,
    color: Colors.text.primary, // Dark MOVA color #0A2F35
    textAlign: 'center' as const,
    marginBottom: 12,
    lineHeight: Typography.sizes.h3,
    paddingHorizontal: 10,
  },
  description: {
    fontSize: Typography.sizes.caption + 2, // Slightly bigger for readability
    fontWeight: '400' as const,
    color: Colors.primary.darkTeal, // Dark teal MOVA color #238276
    textAlign: 'center' as const,
    lineHeight: Typography.sizes.caption + 8, // Better line spacing
    paddingHorizontal: 15,
  },
});