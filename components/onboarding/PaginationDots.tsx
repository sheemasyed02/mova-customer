import { Colors } from '@/constants/Colors';
import React from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';

const { width } = Dimensions.get('window');

interface PaginationDotsProps {
  data: any[];
  scrollX: Animated.Value;
  dotSize?: number;
}

export default function PaginationDots({ 
  data, 
  scrollX, 
  dotSize = 8 
}: PaginationDotsProps) {
  return (
    <View style={styles.container}>
      {data.map((_, index) => {
        const inputRange = [
          (index - 1) * width,
          index * width,
          (index + 1) * width,
        ];

        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [dotSize, dotSize * 2.5, dotSize],
          extrapolate: 'clamp',
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                width: dotWidth,
                height: dotSize,
                opacity,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 16,
  },
  dot: {
    backgroundColor: Colors.text.white,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});