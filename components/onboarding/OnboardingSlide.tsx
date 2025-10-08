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
      {/* Full Screen Image - No Container Boxes */}
      <View style={styles.imageWrapper}>
        <Image
          source={slide.image}
          style={styles.fullScreenImage}
          resizeMode="cover"
        />
        
        {/* Subtle Gradient Overlay for Text Readability */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)']}
          style={styles.gradientOverlay}
        />
        
        {/* Content Positioned Over Image */}
        <View style={styles.contentOverlay}>
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.description}>{slide.description}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    height: height - 200, // Reduced to allow space for bottom section
  },
  
  // Full Screen Image Wrapper
  imageWrapper: {
    flex: 1,
    position: 'relative',
  },
  
  fullScreenImage: {
    width: '100%',
    height: '100%',
    borderRadius: 0, // No rounded corners for full screen
  },
  
  // Subtle Gradient Overlay
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  
  // Content Overlay
  contentOverlay: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
    zIndex: 2,
    alignItems: 'center',
  },
  
  title: {
    fontSize: Typography.sizes.h1,
    fontWeight: '800',
    color: Colors.text.white,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: Typography.sizes.h1 + 4,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  
  description: {
    fontSize: Typography.sizes.body + 2,
    fontWeight: '500',
    color: Colors.text.white,
    textAlign: 'center',
    lineHeight: Typography.sizes.body + 8,
    letterSpacing: 0.3,
    opacity: 0.95,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});