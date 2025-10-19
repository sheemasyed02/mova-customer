import { router } from 'expo-router';
import { VideoView, useVideoPlayer } from 'expo-video';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');
const SPLASH_DURATION = 4000; // 4 seconds 

export default function SplashScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);

  // Create video player
  const player = useVideoPlayer(require('@/assets/videos/splashscreen.mp4'), (player) => {
    try {
      player.loop = true;
      player.play();
      setIsLoading(false);
    } catch (error) {
      console.error('Video error:', error);
      setVideoError(true);
      setIsLoading(false);
    }
  });

  // Navigate to onboarding
  const navigateToApp = () => {
    router.replace('/(features)/onboarding/onboarding' as any);
  };

  useEffect(() => {
    // Auto-navigate after duration
    const timer = setTimeout(() => {
      navigateToApp();
    }, SPLASH_DURATION);

    // Fallback in case video doesn't load
    const fallbackTimer = setTimeout(() => {
      if (isLoading) {
        setVideoError(true);
        setIsLoading(false);
      }
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearTimeout(fallbackTimer);
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={false}
      />
      
      {/* White Background with Video */}
      <View style={styles.background}>
        {!videoError ? (
          <VideoView
            style={styles.video}
            player={player}
            nativeControls={false}
          />
        ) : (
          // Fallback if video fails
          <View style={styles.fallbackContainer}>
            <Text style={styles.brandText}>MOVA</Text>
            <Text style={styles.taglineText}>Your Premium Car Rental</Text>
          </View>
        )}
        
        {/* Loading indicator */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  } as const,
  background: {
    flex: 1,
    backgroundColor: '#FFFFFF', // White background as requested
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  brandText: {
    fontSize: 42,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 8,
    letterSpacing: 2,
  },
  taglineText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 30,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  loadingText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 10,
  },
});
