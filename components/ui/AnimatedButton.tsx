import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  View,
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
  const [isCompleted, setIsCompleted] = useState(false);

  const maxSlideDistance = width - 120; // Maximum distance the arrow can travel

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      // Haptic feedback when starting to drag
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
      const draggedDistance = gestureState.dx;
      const progress = draggedDistance / maxSlideDistance;

      if (progress >= 0.8) { // 80% completion threshold
        // Complete the slide
        Animated.parallel([
          Animated.timing(slideAnimation, {
            toValue: 1,
            duration: 300, // Fast completion
            useNativeDriver: false,
          }),
          Animated.timing(colorAnimation, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
          }),
        ]).start(() => {
          setIsCompleted(true);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setTimeout(() => {
            onPress();
          }, 200);
        });
      } else {
        // Snap back to start
        Animated.parallel([
          Animated.spring(slideAnimation, {
            toValue: 0,
            tension: 100,
            friction: 8,
            useNativeDriver: false,
          }),
          Animated.spring(colorAnimation, {
            toValue: 0,
            tension: 100,
            friction: 8,
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
    <View style={[styles.container, style]}>
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
              borderRadius: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }
          ]}
        >
          <Ionicons 
            name="arrow-forward" 
            size={20} 
            color={Colors.primary.teal} 
          />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: Colors.primary.teal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  text: {
    fontSize: Typography.sizes.bodyLarge,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },
  arrowContainer: {
    position: 'absolute',
    left: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});