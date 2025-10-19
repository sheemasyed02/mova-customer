import { OnboardingSlide } from '@/src/shared/constants/OnboardingData';
import { Typography } from '@/src/shared/constants/Typography';
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
  // Dynamic positioning based on slide ID
  const getContentStyle = () => {
    switch (slide.id) {
      case 1: // First slide - default center positioning
        return {
          justifyContent: 'center' as const,
          alignItems: 'center' as const,
          paddingHorizontal: 30,
          paddingBottom: 250,
        };
      case 2: // Second slide - move text further to the right
        return {
          justifyContent: 'flex-end' as const,
          alignItems: 'flex-end' as const,
          paddingHorizontal: 30,
          paddingBottom: 350, // Move further down
          paddingRight: 20, // Move much further to the right
        };
      case 3: // Third slide - position in top-left area
        return {
          justifyContent: 'flex-start' as const,
          alignItems: 'flex-start' as const,
          paddingHorizontal: 30,
          paddingTop: 120, // Position in upper area
          paddingLeft: 40,
        };
      default:
        return {
          justifyContent: 'center' as const,
          alignItems: 'center' as const,
          paddingHorizontal: 30,
          paddingBottom: 250,
        };
    }
  };

  const getTextAlignment = () => {
    switch (slide.id) {
      case 2: // Second slide - right aligned text
        return 'right' as const;
      case 3: // Third slide - left aligned text
        return 'left' as const;
      default:
        return 'center' as const;
    }
  };

  const getGradientColors = (): [string, string, string, string] => {
    switch (slide.id) {
      case 2: // Second slide - stronger gradient at bottom-right
        return [
          'rgba(0,0,0,0.1)',
          'rgba(0,0,0,0.2)',
          'rgba(0,0,0,0.5)',
          'rgba(0,0,0,0.9)'
        ];
      case 3: // Third slide - stronger gradient at top
        return [
          'rgba(0,0,0,0.8)',
          'rgba(0,0,0,0.4)',
          'rgba(0,0,0,0.2)',
          'rgba(0,0,0,0.1)'
        ];
      default:
        return [
          'rgba(0,0,0,0.1)',
          'rgba(0,0,0,0.3)',
          'rgba(0,0,0,0.6)',
          'rgba(0,0,0,0.8)'
        ];
    }
  };

  const getGradientLocations = (): [number, number, number, number] => {
    switch (slide.id) {
      case 2:
        return [0, 0.3, 0.6, 1];
      case 3:
        return [0, 0.4, 0.7, 1];
      default:
        return [0, 0.4, 0.7, 1];
    }
  };

  // Dynamic font styling based on slide theme and colors
  const getTitleStyle = () => {
    const baseStyle = {
      fontSize: Typography.sizes.h1 + 6,
      fontWeight: '800' as const,
      marginBottom: 20,
      lineHeight: Typography.sizes.h1 + 12,
      letterSpacing: -0.5,
      textShadowOffset: { width: 0, height: 3 },
      textShadowRadius: 10,
    };

    switch (slide.id) {
      case 1: // Diverse car collection - vibrant and professional
        return {
          ...baseStyle,
          color: '#ffffff',
          textShadowColor: slide.backgroundColor + '80', // Use theme color with opacity
          fontSize: Typography.sizes.h1 + 8,
          fontWeight: '900' as const,
          letterSpacing: -0.8,
        };
      case 2: // Mobile booking - modern and tech-focused
        return {
          ...baseStyle,
          color: '#ffffff',
          textShadowColor: slide.accentColor + '60',
          fontSize: Typography.sizes.h1 + 4,
          fontWeight: '700' as const,
          letterSpacing: -0.3,
          fontStyle: 'normal' as const,
        };
      case 3: // Security shield - trust and reliability
        return {
          ...baseStyle,
          color: '#ffffff',
          textShadowColor: slide.backgroundColor + '90',
          fontSize: Typography.sizes.h1 + 6,
          fontWeight: '800' as const,
          letterSpacing: -0.6,
        };
      default:
        return {
          ...baseStyle,
          color: '#ffffff',
          textShadowColor: 'rgba(0, 0, 0, 0.8)',
        };
    }
  };

  const getDescriptionStyle = () => {
    const baseStyle = {
      fontSize: Typography.sizes.bodyLarge + 2,
      fontWeight: '500' as const,
      lineHeight: Typography.sizes.bodyLarge + 10,
      letterSpacing: 0.3,
      maxWidth: width * 0.85,
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 6,
    };

    switch (slide.id) {
      case 1: // Diverse car collection - warm and inviting
        return {
          ...baseStyle,
          color: 'rgba(255, 255, 255, 0.95)',
          textShadowColor: slide.backgroundColor + '40',
          fontSize: Typography.sizes.bodyLarge + 3,
          fontWeight: '600' as const,
          letterSpacing: 0.4,
        };
      case 2: // Mobile booking - clean and modern
        return {
          ...baseStyle,
          color: 'rgba(255, 255, 255, 0.92)',
          textShadowColor: slide.accentColor + '30',
          fontSize: Typography.sizes.bodyLarge + 1,
          fontWeight: '500' as const,
          letterSpacing: 0.2,
        };
      case 3: // Security shield - confident and reliable
        return {
          ...baseStyle,
          color: 'rgba(255, 255, 255, 0.94)',
          textShadowColor: slide.backgroundColor + '50',
          fontSize: Typography.sizes.bodyLarge + 2,
          fontWeight: '600' as const,
          letterSpacing: 0.3,
        };
      default:
        return {
          ...baseStyle,
          color: 'rgba(255, 255, 255, 0.95)',
          textShadowColor: 'rgba(0, 0, 0, 0.6)',
        };
    }
  };

  return (
    <View style={styles.container}>
      {/* Full Screen Background Image */}
      <Image
        source={slide.image}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      {/* Dynamic Gradient Overlay */}
      <LinearGradient
        colors={getGradientColors()}
        style={styles.gradientOverlay}
        locations={getGradientLocations()}
      />
      
      {/* Dynamic Content Overlay */}
      <View style={[styles.contentOverlay, getContentStyle()]}>
        <View style={[styles.textContainer, { maxWidth: width * 0.8 }]}>
          <Text style={[getTitleStyle(), { textAlign: getTextAlignment() }]}>
            {slide.title}
          </Text>
          <Text style={[getDescriptionStyle(), { textAlign: getTextAlignment() }]}>
            {slide.description}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    height,
    position: 'relative',
  },
  
  // Full Screen Background Image
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  
  // Professional Gradient Overlay
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  
  // Content Overlay (positioning handled dynamically)
  contentOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
  
  textContainer: {
    maxWidth: width * 0.8,
  },
});
