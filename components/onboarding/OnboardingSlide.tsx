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
          `${slide.backgroundColor}CC`,
          slide.backgroundColor
        ]}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Enhanced Floating Background Elements */}
        <View style={styles.floatingElements}>
          <View style={[styles.floatingCircle, styles.circle1, { backgroundColor: slide.accentColor }]} />
          <View style={[styles.floatingCircle, styles.circle2, { backgroundColor: Colors.text.white }]} />
          <View style={[styles.floatingCircle, styles.circle3, { backgroundColor: slide.accentColor }]} />
          <View style={[styles.floatingCircle, styles.circle4, { backgroundColor: Colors.text.white }]} />
          <View style={[styles.floatingCircle, styles.circle5, { backgroundColor: slide.accentColor }]} />
        </View>

        {/* Geometric Pattern Background */}
        <View style={styles.geometricPattern}>
          <View style={[styles.triangle, { borderBottomColor: slide.accentColor }]} />
          <View style={[styles.diamond, { backgroundColor: Colors.text.white }]} />
        </View>

        {/* Background Icon with Animation Effect */}
        <View style={styles.backgroundIcon}>
          <Image
            source={slide.icon}
            style={[styles.bgIcon, { tintColor: Colors.text.white }]}
            resizeMode="contain"
          />
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Premium Image Section */}
          <View style={styles.imageSection}>
            <View style={styles.imageWrapper}>
              {/* Multi-layer Glow Effect */}
              <View style={[styles.imageGlow, styles.outerGlow, { backgroundColor: Colors.text.white }]} />
              <View style={[styles.imageGlow, styles.innerGlow, { backgroundColor: slide.accentColor }]} />
              
              {/* Premium Image Container */}
              <View style={[styles.imageContainer, { 
                backgroundColor: `${Colors.text.white}20`,
                borderColor: `${Colors.text.white}40`,
              }]}>
                <Image
                  source={slide.image}
                  style={styles.mainImage}
                  resizeMode="contain"
                />
                
                {/* Overlay gradient for depth */}
                <LinearGradient
                  colors={['transparent', 'rgba(255,255,255,0.1)']}
                  style={styles.imageOverlay}
                />
              </View>

              {/* Enhanced Decorative Elements */}
              <View style={[styles.decorDot, styles.dot1, { backgroundColor: slide.accentColor }]} />
              <View style={[styles.decorDot, styles.dot2, { backgroundColor: Colors.text.white }]} />
              <View style={[styles.decorDot, styles.dot3, { backgroundColor: slide.accentColor }]} />
              <View style={[styles.decorDot, styles.dot4, { backgroundColor: Colors.text.white }]} />
              
              {/* Floating rings */}
              <View style={[styles.decorRing, styles.ring1, { borderColor: Colors.text.white }]} />
              <View style={[styles.decorRing, styles.ring2, { borderColor: slide.accentColor }]} />
            </View>
          </View>

          {/* Premium Text Section */}
          <View style={styles.textSection}>
            {/* Enhanced Step Indicator */}
            <View style={styles.stepIndicator}>
              <View style={[styles.stepBadge, { backgroundColor: slide.accentColor }]}>
                <Text style={styles.stepNumber}>{slide.id}</Text>
              </View>
              <Text style={styles.stepText}>Step {slide.id} of 3</Text>
              <View style={[styles.stepLine, { backgroundColor: slide.accentColor }]} />
            </View>

            {/* Premium Title with Better Typography */}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{slide.title}</Text>
              <View style={[styles.titleUnderline, { backgroundColor: slide.accentColor }]} />
            </View>
            
            {/* Enhanced Description */}
            <View style={styles.descriptionContainer}>
              <Text style={styles.description}>{slide.description}</Text>
            </View>

            {/* Premium Feature Highlights */}
            <View style={styles.featureHighlights}>
              <View style={[styles.featureDot, styles.activeDot, { backgroundColor: Colors.text.white }]} />
              <View style={[styles.featureDot, { backgroundColor: `${Colors.text.white}60` }]} />
              <View style={[styles.featureDot, { backgroundColor: `${Colors.text.white}40` }]} />
              <View style={[styles.featureDot, { backgroundColor: `${Colors.text.white}60` }]} />
              <View style={[styles.featureDot, { backgroundColor: `${Colors.text.white}40` }]} />
            </View>
          </View>
        </View>

        {/* Premium Bottom Wave with Gradient */}
        <LinearGradient
          colors={['transparent', 'rgba(255, 255, 255, 0.15)']}
          style={styles.bottomWave}
        />
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

  // Enhanced Floating Background Elements
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
  circle4: {
    width: 45,
    height: 45,
    top: '45%',
    left: '5%',
  },
  circle5: {
    width: 70,
    height: 70,
    bottom: '35%',
    right: '10%',
  },

  // Geometric Pattern Background
  geometricPattern: {
    position: 'absolute' as const,
    top: '30%',
    left: '75%',
    zIndex: 1,
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 25,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    opacity: 0.1,
  },
  diamond: {
    width: 20,
    height: 20,
    transform: [{ rotate: '45deg' }],
    opacity: 0.1,
    marginTop: 20,
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
    borderRadius: 150,
    zIndex: 1,
  },
  outerGlow: {
    width: width * 0.8,
    height: width * 0.8,
    opacity: 0.1,
  },
  innerGlow: {
    width: width * 0.7,
    height: width * 0.7,
    opacity: 0.15,
  },
  imageContainer: {
    width: width * 0.65,
    height: width * 0.65,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    shadowColor: Colors.text.white,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    zIndex: 2,
    overflow: 'hidden' as const,
  },
  mainImage: {
    width: width * 0.55,
    height: width * 0.55,
  },
  imageOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },

  // Enhanced Decorative Elements
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
  dot4: {
    bottom: 60,
    right: 40,
  },

  // Floating rings
  decorRing: {
    position: 'absolute' as const,
    borderWidth: 2,
    borderRadius: 25,
    opacity: 0.3,
  },
  ring1: {
    width: 50,
    height: 50,
    top: -10,
    right: 10,
  },
  ring2: {
    width: 30,
    height: 30,
    bottom: 10,
    left: 5,
  },

  // Modern Text Section
  textSection: {
    flex: 0.45,
    paddingTop: 40,
    alignItems: 'center' as const,
  },

  // Enhanced Step Indicator
  stepIndicator: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 20,
  },
  stepBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginRight: 12,
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text.white,
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
  titleContainer: {
    alignItems: 'center' as const,
    marginBottom: 16,
  },
  title: {
    fontSize: Typography.sizes.h1,
    fontWeight: '800' as const,
    color: Colors.text.white,
    textAlign: 'center' as const,
    lineHeight: Typography.sizes.h1 + 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginBottom: 8,
  },
  titleUnderline: {
    width: 60,
    height: 3,
    borderRadius: 2,
  },
  descriptionContainer: {
    paddingHorizontal: 8,
    marginBottom: 24,
  },
  description: {
    fontSize: Typography.sizes.bodyLarge,
    fontWeight: '400' as const,
    color: Colors.text.white,
    textAlign: 'center' as const,
    lineHeight: Typography.sizes.bodyLarge + 6,
    opacity: 0.95,
  },

  // Enhanced Feature Highlights
  featureHighlights: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 6,
  },
  activeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },

  // Enhanced Bottom Wave
  bottomWave: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
});