import { Colors } from '@/constants/Colors';
import { OnboardingSlide } from '@/constants/OnboardingData';
import { Typography } from '@/constants/Typography';
import React from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface OnboardingSlideProps {
  slide: OnboardingSlide;
}

export default function OnboardingSlideComponent({ slide }: OnboardingSlideProps) {
  return (
    <View style={[styles.container, { backgroundColor: slide.backgroundColor }]}>
      {/* Image Section */}
      <View style={styles.imageContainer}>
        <Image
          source={slide.image}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {/* Content Section */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.description}>{slide.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingHorizontal: 20,
  },
  imageContainer: {
    flex: 0.6,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginTop: 60,
  },
  image: {
    width: width * 0.8,
    height: height * 0.4,
    tintColor: Colors.text.white,
  },
  contentContainer: {
    flex: 0.4,
    alignItems: 'center' as const,
    justifyContent: 'flex-start' as const,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: Typography.sizes.h1,
    fontWeight: '700' as const,
    color: Colors.text.white,
    textAlign: 'center' as const,
    marginBottom: 16,
    lineHeight: Typography.lineHeights.h1,
  },
  description: {
    fontSize: Typography.sizes.bodyLarge,
    fontWeight: '400' as const,
    color: Colors.text.white,
    textAlign: 'center' as const,
    lineHeight: Typography.lineHeights.bodyLarge,
    opacity: 0.9,
  },
});