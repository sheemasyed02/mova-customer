import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import React, { useRef } from 'react';
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    ViewStyle,
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
    // Start sliding animation
    Animated.parallel([
      Animated.timing(slideAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(colorAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    // Complete the slide and trigger navigation
    Animated.parallel([
      Animated.timing(slideAnimation, {
        toValue: 2,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(colorAnimation, {
        toValue: 2,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start(() => {
      // Reset and call onPress
      slideAnimation.setValue(0);
      colorAnimation.setValue(0);
      onPress();
    });
  };

  const arrowTranslateX = slideAnimation.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, width * 0.6, width],
  });

  const backgroundColor = colorAnimation.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [Colors.primary.teal, Colors.primary.darkTeal, Colors.functional.success],
  });

  const arrowScale = slideAnimation.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [1, 1.2, 0],
  });

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <Animated.View style={[styles.button, { backgroundColor }]}>
        <Text style={styles.text}>{title}</Text>
        
        <Animated.View 
          style={[
            styles.arrowContainer,
            {
              transform: [
                { translateX: arrowTranslateX },
                { scale: arrowScale }
              ]
            }
          ]}
        >
          <Ionicons 
            name="arrow-forward" 
            size={24} 
            color={Colors.text.white} 
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
    color: Colors.text.white,
    textAlign: 'center',
    flex: 1,
  },
  arrowContainer: {
    position: 'absolute',
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});