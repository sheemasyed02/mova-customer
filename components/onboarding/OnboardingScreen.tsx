import OnboardingSlide from '@/components/onboarding/OnboardingSlide';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { Colors } from '@/constants/Colors';
import { onboardingData } from '@/constants/OnboardingData';
import { Typography } from '@/constants/Typography';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
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

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);
  const intervalRef = useRef<any>(null);

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    setCurrentIndex(viewableItems[0]?.index || 0);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  // Auto-slide functionality
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (currentIndex < onboardingData.length - 1) {
        slidesRef.current?.scrollToIndex({ 
          index: currentIndex + 1,
          animated: true 
        });
      } else {
        // Reset to first slide
        slidesRef.current?.scrollToIndex({ 
          index: 0,
          animated: true 
        });
      }
    }, 4000); // 4 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentIndex]);

  // Clear interval when component unmounts
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const goNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      // Navigate to main app
      router.replace('/(tabs)');
    }
  };

  const getStarted = () => {
    router.push('/languageselection');
  };

  const skip = () => {
    router.push('/languageselection');
  };

  const isLastSlide = currentIndex === onboardingData.length - 1;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={false} />

      {/* Slides Container - Controlled Height */}
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
          contentContainerStyle={styles.flatListContent}
        />
      </View>

      {/* Clean Bottom Section with Better Design */}
      <View style={styles.bottomSection}>
        <LinearGradient
          colors={['transparent', 'rgba(255, 255, 255, 0.95)', '#ffffff']}
          style={styles.bottomGradient}
        >
          {/* Simple Progress Indicator */}
          <View style={styles.progressContainer}>
            <View style={styles.progressDotsContainer}>
              {onboardingData.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.progressDot,
                    currentIndex === index && styles.activeDot,
                    { 
                      backgroundColor: currentIndex === index ? Colors.primary.teal : '#E5E7EB'
                    }
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Original Button with Scroll Functionality */}
          <View style={styles.buttonContainer}>
            <AnimatedButton
              title="Get Started"
              onPress={getStarted}
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
  
  slidesContainer: {
    height: height * 0.75, // Match the slide height
    paddingHorizontal: 16, // Add some padding for better visual
  },

  flatListContent: {
    alignItems: 'center',
  },
  
  // Clean Bottom Section
  bottomSection: {
    flex: 1, // Take remaining space
    backgroundColor: '#ffffff',
    paddingTop: 20,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  
  bottomGradient: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
  
  // Simple Progress Container
  progressContainer: {
    alignItems: 'center' as const,
    marginBottom: 30,
  },
  
  progressDotsContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
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
  
  // Button Container
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
  
  // Login Container
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