import OnboardingSlide from '@/components/onboarding/OnboardingSlide';
import PaginationDots from '@/components/onboarding/PaginationDots';
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
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
      // Navigate to login/register
      router.replace('/(tabs)'); // For now, go to main app
    }
  };

  const skip = () => {
    router.replace('/(tabs)'); // For now, go to main app
  };

  const goToLogin = () => {
    router.push('/(tabs)'); // For now, go to main app
  };

  const isLastSlide = currentIndex === onboardingData.length - 1;
  const currentSlide = onboardingData[currentIndex];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Enhanced Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={skip}>
        <View style={styles.skipButtonContent}>
          <Text style={styles.skipText}>Skip</Text>
        </View>
      </TouchableOpacity>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <Animated.View 
            style={[
              styles.progressBar,
              {
                width: scrollX.interpolate({
                  inputRange: [0, (onboardingData.length - 1) * width],
                  outputRange: ['33%', '100%'],
                  extrapolate: 'clamp',
                }),
              }
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {currentIndex + 1} of {onboardingData.length}
        </Text>
      </View>

      {/* Slides */}
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

      {/* Enhanced Bottom Section */}
      <View style={styles.bottomSection}>
        {/* Gradient Background for Bottom */}
        <LinearGradient
          colors={['transparent', 'rgba(255, 255, 255, 0.95)', Colors.text.white]}
          style={styles.bottomGradient}
        >
          {/* Pagination Dots */}
          <View style={styles.paginationSection}>
            <PaginationDots data={onboardingData} scrollX={scrollX} />
          </View>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <View style={styles.buttonRow}>
              {/* Previous Button (if not first slide) */}
              {currentIndex > 0 && (
                <TouchableOpacity 
                  style={styles.prevButton}
                  onPress={() => slidesRef.current?.scrollToIndex({ index: currentIndex - 1 })}
                >
                  <Text style={styles.prevButtonText}>Previous</Text>
                </TouchableOpacity>
              )}

              {/* Main Action Button */}
              <View style={[styles.mainButtonWrapper, currentIndex === 0 && styles.fullWidth]}>
                <Button
                  title={isLastSlide ? "Get Started" : "Continue"}
                  onPress={goNext}
                  variant="primary"
                  size="large"
                  style={styles.mainButton}
                />
              </View>
            </View>

            {/* Login Link */}
            <TouchableOpacity onPress={goToLogin} style={styles.loginContainer}>
              <Text style={styles.loginText}>
                Already have an account? <Text style={styles.loginLink}>Sign In</Text>
              </Text>
            </TouchableOpacity>

            {/* Brand Footer */}
            <View style={styles.brandFooter}>
              <Text style={styles.brandFooterText}>Powered by MOVA</Text>
              <View style={styles.brandDot} />
            </View>
          </View>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.teal,
  },
  skipButton: {
    position: 'absolute' as const,
    top: Platform.OS === 'ios' ? 60 : 50,
    right: 20,
    zIndex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  skipButtonContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
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
  progressContainer: {
    position: 'absolute' as const,
    top: Platform.OS === 'ios' ? 120 : 110,
    left: 20,
    right: 20,
    zIndex: 1,
    alignItems: 'center' as const,
  },
  progressTrack: {
    width: '100%',
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary.teal,
    borderRadius: 2,
  },
  progressText: {
    fontSize: Typography.sizes.caption,
    fontWeight: '500' as const,
    color: Colors.text.white,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bottomSection: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    height: 300,
  },
  bottomGradient: {
    flex: 1,
    justifyContent: 'flex-end' as const,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  paginationSection: {
    alignItems: 'center' as const,
    marginBottom: 30,
  },
  actionContainer: {
    gap: 20,
  },
  buttonRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 12,
  },
  prevButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    minWidth: 100,
    alignItems: 'center' as const,
  },
  prevButtonText: {
    fontSize: Typography.sizes.body,
    fontWeight: '500' as const,
    color: Colors.text.primary,
  },
  mainButtonWrapper: {
    flex: 1,
  },
  fullWidth: {
    flex: 1,
    width: '100%',
  },
  mainButton: {
    shadowColor: Colors.primary.teal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loginContainer: {
    alignItems: 'center' as const,
    marginTop: 8,
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
  brandFooter: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginTop: 16,
    gap: 8,
  },
  brandFooterText: {
    fontSize: Typography.sizes.caption,
    color: Colors.text.secondary,
    fontWeight: '500' as const,
  },
  brandDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary.teal,
  },
  // Legacy styles for compatibility
  bottomContainer: {
    backgroundColor: Colors.text.white,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  buttonContainer: {
    paddingHorizontal: 20,
  },
  getStartedButton: {
    width: '100%',
    marginBottom: 16,
  },
});