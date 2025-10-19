import React, { useCallback, useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    Platform,
    StyleSheet,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface AnimatedTabBarProps {
  children: React.ReactNode;
  scrollDirection?: {
    isScrollingUp: boolean;
    isScrollingDown: boolean;
    scrollY: number;
  };
  style?: any;
}

export const AnimatedTabBar: React.FC<AnimatedTabBarProps> = ({
  children,
  scrollDirection,
  style,
}) => {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const animationInProgress = useRef(false);
  const isHidden = useRef(false);
  
  // Increased tab bar height for better visibility and spacing
  const TAB_BAR_HEIGHT = 80 + insets.bottom;
  
  // Memoized animation functions to prevent recreation
  const hideTabBar = useCallback(() => {
    if (animationInProgress.current || isHidden.current) return;
    
    animationInProgress.current = true;
    isHidden.current = true;
    
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: TAB_BAR_HEIGHT + 30,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      animationInProgress.current = false;
    });
  }, [translateY, opacity, TAB_BAR_HEIGHT]);

  const showTabBar = useCallback(() => {
    if (animationInProgress.current || !isHidden.current) return;
    
    animationInProgress.current = true;
    isHidden.current = false;
    
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      animationInProgress.current = false;
    });
  }, [translateY, opacity]);

  useEffect(() => {
    if (!scrollDirection) return;
    
    const { isScrollingUp, isScrollingDown, scrollY } = scrollDirection;
    
    // Use requestAnimationFrame to ensure smooth animation scheduling
    requestAnimationFrame(() => {
      if (isScrollingDown && scrollY > 50) {
        hideTabBar();
      } else if (isScrollingUp || scrollY <= 50) {
        showTabBar();
      }
    });
  }, [scrollDirection, hideTabBar, showTabBar]);

  // Cleanup animations on unmount
  useEffect(() => {
    return () => {
      translateY.stopAnimation();
      opacity.stopAnimation();
    };
  }, [translateY, opacity]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
          paddingBottom: insets.bottom,
          height: TAB_BAR_HEIGHT,
        },
        style,
      ]}
    >
      <View style={styles.content}>
        {children}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: -3,
        },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  content: {
    flex: 1,
    paddingTop: 12,
    paddingBottom: 8,
    paddingHorizontal: 8,
  },

});

