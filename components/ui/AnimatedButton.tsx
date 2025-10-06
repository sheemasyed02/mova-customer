import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import React, { useRef } from 'react';
import {
    Animated,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
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

  const handlePressIn = () => {
    // Start sliding animation - much slower for better visual effect
    Animated.parallel([
      Animated.timing(slideAnimation, {
        toValue: 1,
        duration: 2000, // Much slower - 2 seconds for smooth sliding
        useNativeDriver: false,
      }),
      Animated.timing(colorAnimation, {
        toValue: 1,
        duration: 2000, // Match the slide duration
        useNativeDriver: false,
      }),
    ]).start(() => {
      // Only trigger navigation AFTER complete slide animation
      setTimeout(() => {
        onPress();
        // Reset animations after navigation
        slideAnimation.setValue(0);
        colorAnimation.setValue(0);
      }, 100); // Small delay to ensure smooth transition
    });
  };

  // Arrow starts from left and slides to right - slower and smoother
  const arrowTranslateX = slideAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width - 120], // Account for circular container size and padding
  });

  // Background color: white -> dark teal (logo color)
  const backgroundColor = colorAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#FFFFFF', Colors.text.primary], // White to dark logo color
  });

  // Text color: dark (logo color) -> white
  const textColor = colorAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.text.primary, '#FFFFFF'], // Dark to white
  });

  // Border color to maintain button structure
  const borderColor = colorAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.text.primary, Colors.text.primary], // Always dark border
  });

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPressIn={handlePressIn}
      activeOpacity={1}
    >
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
          style={[
            styles.arrowContainer,
            {
              transform: [{ translateX: arrowTranslateX }],
              backgroundColor: '#FFFFFF', // White circular background
              borderRadius: 20, // Make it circular
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
            color={Colors.text.primary} 
          />
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
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
    left: 16, // Start from left side with some padding
    alignItems: 'center',
    justifyContent: 'center',
    width: 40, // Larger circular container
    height: 40,
    borderRadius: 20, // Perfect circle
  },
});