import { Colors } from '@/constants/Colors';
import { OnboardingSlide } from '@/constants/OnboardingData';
import { Typography } from '@/constants/Typography';
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
      {/* Full Screen Image Background */}
      <View style={styles.imageBackground}>
        <Image
          source={slide.image}
          style={styles.fullScreenImage}
          resizeMode="cover"
        />
        
        {/* Dark Overlay for Text Visibility */}
        <View style={styles.overlay} />
        
        {/* Text Overlay on Image */}
        <View style={styles.textOverlay}>
          {/* Clean Title - White for visibility */}
          <Text style={styles.title} numberOfLines={2}>{slide.title}</Text>
          
          {/* Clean Description - White for visibility */}
          <Text style={styles.description} numberOfLines={3}>{slide.description}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    height: height - 180, // Adjusted for better full screen effect
  },
  
  // Full Screen Image Background
  imageBackground: {
    flex: 1,
    position: 'relative' as const,
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
    borderRadius: 0, // Remove border radius for full coverage
  },
  
  // Dark Overlay for Text Visibility
  overlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Semi-transparent dark overlay
    zIndex: 1,
  },
  
  // Text Overlay on Image
  textOverlay: {
    position: 'absolute' as const,
    bottom: 40, // Position text at bottom of image
    left: 20,
    right: 20,
    alignItems: 'center' as const,
    zIndex: 2,
  },

  // White Typography for Visibility on Images
  title: {
    fontSize: Typography.sizes.h2, // Larger for better visibility
    fontWeight: '700' as const,
    color: Colors.text.white, // White for visibility on images
    textAlign: 'center' as const,
    marginBottom: 12,
    lineHeight: Typography.sizes.h2 + 4,
    paddingHorizontal: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  description: {
    fontSize: Typography.sizes.body, // Larger for better readability
    fontWeight: '400' as const,
    color: Colors.text.white, // White for visibility on images
    textAlign: 'center' as const,
    lineHeight: Typography.sizes.body + 6,
    paddingHorizontal: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});