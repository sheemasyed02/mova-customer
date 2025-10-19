import { Colors } from '@/src/shared/constants/Colors';
import { Typography } from '@/src/shared/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  PanResponder, 
  StyleSheet,
  ViewStyle
} from 'react-native';

const { width } = Dimensions.get('window');

interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
}

export default function AnimatedButton({ title, onPress, style }: AnimatedButtonProps) {
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const colorAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(1)).current;
  const [isCompleted, setIsCompleted] = useState(false);

  const maxSlideDistance = width - 120; // Maximum distance the arrow can travel

  // Reset function
  const resetButton = useCallback(() => {
    slideAnimation.setValue(0);
    colorAnimation.setValue(0);
    scaleAnimation.setValue(1);
    setIsCompleted(false);
  }, [slideAnimation, colorAnimation, scaleAnimation]);

  // Reset animations when component mounts or remounts
  useEffect(() => {
    resetButton();
  }, [resetButton]);

  // Reset when screen comes into focus (when coming back from language screen)
  useFocusEffect(
    useCallback(() => {
      resetButton();
    }, [resetButton])
  );

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => !isCompleted,
    onPanResponderGrant: () => {
      // Haptic feedback when starting to drag
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      // Scale animation for press feedback
      Animated.spring(scaleAnimation, {
        toValue: 0.98,
        useNativeDriver: true,
      }).start();
    },
    onPanResponderMove: (_, gestureState) => {
      if (isCompleted) return;

      // Calculate the new position based on drag
      const newValue = Math.max(0, Math.min(gestureState.dx / maxSlideDistance, 1));
      
      // Update both animations based on drag position
      slideAnimation.setValue(newValue);
      colorAnimation.setValue(newValue);
    },
    onPanResponderRelease: (_, gestureState) => {
      // Reset scale
      Animated.spring(scaleAnimation, {
        toValue: 1,
        useNativeDriver: true,
      }).start();

      const draggedDistance = gestureState.dx;
      const progress = draggedDistance / maxSlideDistance;

      if (progress >= 0.8) { // 80% completion threshold
        // Complete the slide
        Animated.parallel([
          Animated.timing(slideAnimation, {
            toValue: 1,
            duration: 200, // Faster completion
            useNativeDriver: false,
          }),
          Animated.timing(colorAnimation, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false,
          }),
        ]).start(() => {
          setIsCompleted(true);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          // Immediate navigation - no delay
          onPress();
        });
      } else {
        // Snap back to start
        Animated.parallel([
          Animated.spring(slideAnimation, {
            toValue: 0,
            tension: 120,
            friction: 7,
            useNativeDriver: false,
          }),
          Animated.spring(colorAnimation, {
            toValue: 0,
            tension: 120,
            friction: 7,
            useNativeDriver: false,
          }),
        ]).start();
      }
    },
  });

  // Arrow position based on animation value
  const arrowTranslateX = slideAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, maxSlideDistance],
  });

  // Background color: white -> teal
  const backgroundColor = colorAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#FFFFFF', Colors.primary.teal],
  });

  // Text color: teal -> white
  const textColor = colorAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.primary.teal, '#FFFFFF'],
  });

  // Border color
  const borderColor = colorAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.primary.teal, Colors.primary.teal],
  });

  return (
    <Animated.View style={[
      styles.container, 
      style,
      { transform: [{ scale: scaleAnimation }] }
    ]}>
      <Animated.View style={[
        styles.button, 
        { 
          backgroundColor,
          borderColor,
          borderWidth: 2,
        }
      ]}>
        <Animated.Text style={[styles.text, { color: textColor }]}>
          {title}
        </Animated.Text>
        
        <Animated.View 
          {...panResponder.panHandlers}
          style={[
            styles.arrowContainer,
            {
              transform: [{ translateX: arrowTranslateX }],
              backgroundColor: '#FFFFFF',
              borderRadius: 22, // More rounded
              shadowColor: Colors.primary.teal,
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.25,
              shadowRadius: 6,
              elevation: 6,
            }
          ]}
        >
          <Ionicons 
            name="arrow-forward" 
            size={22} // Slightly larger
            color={Colors.primary.teal} 
          />
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  button: {
    borderRadius: 16, // More rounded for modern look
    paddingVertical: 18, // Slightly more padding
    paddingHorizontal: 32,
    minHeight: 64, // Taller for better touch
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: Colors.primary.teal,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  text: {
    fontSize: Typography.sizes.bodyLarge + 2, // Slightly larger
    fontWeight: '700', // Bolder
    textAlign: 'center',
    flex: 1,
    letterSpacing: 0.5, // Better spacing
  },
  arrowContainer: {
    position: 'absolute',
    left: 18, // More space from edge
    alignItems: 'center',
    justifyContent: 'center',
    width: 44, // Larger for better touch
    height: 44,
    borderRadius: 22,
  },
});
