import { useCallback, useMemo, useRef, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

export interface ScrollDirection {
  isScrollingUp: boolean;
  isScrollingDown: boolean;
  scrollY: number;
}

export const useScrollDirection = (threshold: number = 5) => {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>({
    isScrollingUp: false,
    isScrollingDown: false,
    scrollY: 0,
  });
  
  const lastScrollY = useRef(0);
  const lastTimestamp = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const currentScrollY = event.nativeEvent.contentOffset.y;
      const currentTimestamp = Date.now();
      
      // Clear any pending timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Debounce rapid scroll events
      if (currentTimestamp - lastTimestamp.current < 16) { // ~60fps
        return;
      }
      
      const scrollDiff = currentScrollY - lastScrollY.current;
      
      // Only update if scroll difference is greater than threshold
      if (Math.abs(scrollDiff) > threshold) {
        const isScrollingUp = scrollDiff < 0 && currentScrollY > 0;
        const isScrollingDown = scrollDiff > 0;
        
        const newDirection = {
          isScrollingUp,
          isScrollingDown,
          scrollY: Math.max(0, currentScrollY), // Ensure positive values
        };
        
        setScrollDirection(newDirection);
        
        lastScrollY.current = currentScrollY;
        lastTimestamp.current = currentTimestamp;
        
        // Reset scroll direction after a delay to prevent stuck states
        timeoutRef.current = setTimeout(() => {
          setScrollDirection(prev => ({
            ...prev,
            isScrollingUp: false,
            isScrollingDown: false,
          }));
        }, 150);
      }
    },
    [threshold]
  );

  // Cleanup timeout on unmount
  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Memoize return value to prevent unnecessary re-renders
  const returnValue = useMemo(() => ({
    scrollDirection,
    onScroll,
    cleanup,
  }), [scrollDirection, onScroll, cleanup]);

  return returnValue;
};
