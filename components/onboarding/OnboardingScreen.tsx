import OnboardingSlide from '@/components/onboarding/OnboardingSlide';
import PaginationDots from '@/components/onboarding/PaginationDots';
import Button from '@/components/ui/Button';
import { Colors } from '@/constants/Colors';
import { onboardingData } from '@/constants/OnboardingData';
import { Typography } from '@/constants/Typography';
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={skip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

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

      {/* Bottom Section */}
      <View style={styles.bottomContainer}>
        {/* Pagination Dots */}
        <PaginationDots data={onboardingData} scrollX={scrollX} />

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title={isLastSlide ? "Get Started" : "Next"}
            onPress={goNext}
            variant="primary"
            size="large"
            style={styles.getStartedButton}
          />

          <TouchableOpacity onPress={goToLogin} style={styles.loginContainer}>
            <Text style={styles.loginText}>
              Already have an account? <Text style={styles.loginLink}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
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
    top: Platform.OS === 'ios' ? 60 : 40,
    right: 20,
    zIndex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    fontSize: Typography.sizes.body,
    fontWeight: '600' as const,
    color: Colors.text.white,
    opacity: 0.8,
  },
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