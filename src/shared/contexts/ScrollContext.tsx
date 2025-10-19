import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

interface ScrollDirection {
  isScrollingUp: boolean;
  isScrollingDown: boolean;
  scrollY: number;
}

interface ScrollContextType {
  scrollDirection: ScrollDirection;
  updateScrollDirection: (direction: ScrollDirection) => void;
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export const ScrollProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>({
    isScrollingUp: false,
    isScrollingDown: false,
    scrollY: 0,
  });

  const updateScrollDirection = useCallback((direction: ScrollDirection) => {
    setScrollDirection(prevDirection => {
      // Only update if there's a meaningful change
      if (
        prevDirection.isScrollingUp !== direction.isScrollingUp ||
        prevDirection.isScrollingDown !== direction.isScrollingDown ||
        Math.abs(prevDirection.scrollY - direction.scrollY) > 5
      ) {
        return direction;
      }
      return prevDirection;
    });
  }, []);

  const contextValue = useMemo(() => ({
    scrollDirection,
    updateScrollDirection,
  }), [scrollDirection, updateScrollDirection]);

  return (
    <ScrollContext.Provider value={contextValue}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScrollContext = () => {
  const context = useContext(ScrollContext);
  if (context === undefined) {
    throw new Error('useScrollContext must be used within a ScrollProvider');
  }
  return context;
};
