import OnboardingSlide from '@/components/onboarding/OnboardingSlide';
import AnimatedButton from '@/components/ui/AnimatedButton';
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
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    setCurrentIndex(viewableItems[0]?.index || 0);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  // Smooth entrance animations
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Auto-slide functionality with longer duration for reading
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (currentIndex < onboardingData.length - 1) {
        slidesRef.current?.scrollToIndex({ 
          index: currentIndex + 1,
          animated: true 
        });
      } else {
        // Reset to first slide for continuous loop
        slidesRef.current?.scrollToIndex({ 
          index: 0,
          animated: true 
        });
      }
    }, 5000); // 5 seconds for better reading time

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

  const getStarted = () => {
    router.push('/languageselection');
  };

  const goToSlide = (index: number) => {
    slidesRef.current?.scrollToIndex({ index });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Full Screen Image Carousel */}
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
          scrollEventThrottle={16}
        />
      </View>

      {/* Elegant Progress Indicator */}
      <Animated.View 
        style={[
          styles.progressSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideUpAnim }]
          }
        ]}
      >
        <View style={styles.progressContainer}>
          {onboardingData.map((_, index) => {
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ];

            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [10, 40, 10],
              extrapolate: 'clamp',
            });

            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.4, 1, 0.4],
              extrapolate: 'clamp',
            });

            return (
              <TouchableOpacity
                key={index}
                onPress={() => goToSlide(index)}
                style={styles.dotContainer}
              >
                <Animated.View
                  style={[
                    styles.progressDot,
                    {
                      width: dotWidth,
                      opacity,
                    },
                  ]}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </Animated.View>

      {/* Bottom Action Section with Glassmorphism */}
      <Animated.View 
        style={[
          styles.bottomSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideUpAnim }]
          }
        ]}
      >
        <LinearGradient
          colors={[
            'rgba(255, 255, 255, 0.1)',
            'rgba(255, 255, 255, 0.15)',
            'rgba(255, 255, 255, 0.1)'
          ]}
          style={styles.bottomGradient}
        >
          <View style={styles.actionContainer}>
            <AnimatedButton
              title="Get Started"
              onPress={getStarted}
              style={styles.getStartedButton}
            />
            
            <TouchableOpacity onPress={getStarted} style={styles.signInContainer}>
              <Text style={styles.signInText}>
                Already have an account?{' '}
                <Text style={styles.signInLink}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  
  // Full Screen Slides
  slidesContainer: {
    flex: 1,
  },
  
  // Progress Section
  progressSection: {
    position: 'absolute',
    bottom: 200,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  
  dotContainer: {
    marginHorizontal: 4,
    height: 10,
    justifyContent: 'center',
  },
  
  progressDot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  
  // Bottom Section
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 160,
    zIndex: 10,
  },
  
  bottomGradient: {
    flex: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 20,
    paddingHorizontal: 24,
    paddingBottom: 40,
    backdropFilter: 'blur(20px)',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  
  // Action Container
  actionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  getStartedButton: {
    width: '100%',
    marginBottom: 12,
  },
  
  signInContainer: {
    paddingVertical: 8,
  },
  
  signInText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: Typography.sizes.body,
    fontWeight: '400',
    textAlign: 'center',
  },
  
  signInLink: {
    color: '#ffffff',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});