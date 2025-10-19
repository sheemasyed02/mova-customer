import { useEffect, useRef } from 'react';

interface DebugInfo {
  scrollY: number;
  isScrollingUp: boolean;
  isScrollingDown: boolean;
  timestamp: number;
}

export const useTabBarDebug = (scrollDirection: any, enabled: boolean = false) => {
  const logRef = useRef<DebugInfo[]>([]);
  const lastLogTime = useRef(0);

  useEffect(() => {
    if (!enabled || !scrollDirection) return;

    const now = Date.now();
    if (now - lastLogTime.current < 1000) return; // Log once per second max

    const debugInfo: DebugInfo = {
      scrollY: scrollDirection.scrollY,
      isScrollingUp: scrollDirection.isScrollingUp,
      isScrollingDown: scrollDirection.isScrollingDown,
      timestamp: now,
    };

    logRef.current.push(debugInfo);
    
    // Keep only last 10 entries
    if (logRef.current.length > 10) {
      logRef.current = logRef.current.slice(-10);
    }

    console.log('TabBar State:', debugInfo);
    lastLogTime.current = now;
  }, [scrollDirection, enabled]);

  return {
    logs: logRef.current,
    clearLogs: () => {
      logRef.current = [];
    },
  };
};
