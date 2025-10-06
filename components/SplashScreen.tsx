import { ResizeMode, Video } from 'expo-av';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import {
    Dimensions,
    StatusBar,
    StyleSheet,
    View,
} from 'react-native';

const { width, height } = Dimensions.get('window');
const SPLASH_DURATION = 4000; // 4 seconds

export default function SplashScreen() {
  // Navigate to onboarding
  const navigateToApp = () => {
    router.replace('/onboarding');
  };

  useEffect(() => {
    // Auto-navigate after duration
    const timer = setTimeout(() => {
      navigateToApp();
    }, SPLASH_DURATION);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#ffffff"
        translucent={false}
      />
      
      {/* Clean White Background */}
      <View style={styles.background}>
        {/* Centered Video */}
        <View style={styles.videoContainer}>
          <Video
            source={require('@/assets/videos/splashscreen.mp4')}
            style={styles.video}
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay
            isLooping
            isMuted
          />
        </View>
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
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoContainer: {
    width: width * 0.8,
    height: width * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 10,
  },
  video: {
    width: '100%',
    height: '100%',
  },
});