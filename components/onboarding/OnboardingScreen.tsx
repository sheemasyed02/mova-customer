import OnboardingSlide from '@/components/onboarding/OnboardingSlide';
import Button from '@/components/ui/Button';
import { Colors } from '@/constants/Colors';
import { onboardingData } from '@/constants/OnboardingData';
import { Typography } from '@/constants/Typography';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    FlatList,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    setCurrentIndex(viewableItems[0]?.index || 0);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const goNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      // Navigate to main app
      router.replace('/(tabs)');
    }
  };

  const getStarted = () => {
    router.replace('/(tabs)');
  };

  const skip = () => {
    router.replace('/(tabs)');
  };

  const isLastSlide = currentIndex === onboardingData.length - 1;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Modern Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={skip}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
          style={styles.skipButtonContent}
        >
          <Text style={styles.skipText}>Skip</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Slides Container */}
      <View style={styles.slidesContainer}>
        <FlatList
          ref={slidesRef}
          data={onboardingData}
          renderItem={({ item }) => <OnboardingSlide slide={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id.toString()}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          scrollEventThrottle={32}
        />
      </View>

      {/* Modern Bottom Section */}
      <View style={styles.bottomSection}>
        <LinearGradient
          colors={['transparent', 'rgba(255, 255, 255, 0.98)', '#ffffff']}
          style={styles.bottomGradient}
        >
          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <View style={styles.progressDotsContainer}>
              {onboardingData.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.progressDot,
                    currentIndex === index && styles.activeDot,
                    { backgroundColor: currentIndex === index ? Colors.primary.teal : '#E5E7EB' }
                  ]}
                />
              ))}
            </View>
            <Text style={styles.progressText}>
              {currentIndex + 1} of {onboardingData.length}
            </Text>
          </View>

          {/* Single Get Started Button */}
          <View style={styles.buttonContainer}>
            <Button
              title="Get Started"
              onPress={getStarted}
              variant="primary"
              size="large"
              style={styles.getStartedButton}
            />
            
            <TouchableOpacity onPress={getStarted} style={styles.loginContainer}>
              <Text style={styles.loginText}>
                Already have an account? <Text style={styles.loginLink}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  skipButton: {
    position: 'absolute' as const,
    top: 60,
    right: 20,
    zIndex: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  skipButtonContent: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  skipText: {
    fontSize: Typography.sizes.body,
    fontWeight: '600' as const,
    color: Colors.text.primary,
  },
  slidesContainer: {
    flex: 1,
  },
  bottomSection: {
    backgroundColor: '#ffffff',
    paddingTop: 20,
    paddingBottom: 40,
  },
  bottomGradient: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
  progressContainer: {
    alignItems: 'center' as const,
    marginBottom: 40,
  },
  progressDotsContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginBottom: 12,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: '#E5E7EB',
  },
  activeDot: {
    width: 24,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary.teal,
  },
  progressText: {
    fontSize: Typography.sizes.caption,
    fontWeight: '500' as const,
    color: Colors.text.secondary,
  },
  buttonContainer: {
    alignItems: 'center' as const,
  },
  getStartedButton: {
    width: '100%',
    marginBottom: 20,
    shadowColor: Colors.primary.teal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loginContainer: {
    alignItems: 'center' as const,
    paddingVertical: 12,
  },
  loginText: {
    fontSize: Typography.sizes.body,
    fontWeight: '400' as const,
    color: Colors.text.secondary,
  },
  loginLink: {
    color: Colors.primary.teal,
    fontWeight: '600' as const,
  },
});