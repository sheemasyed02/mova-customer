import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
        translucent={false}
      />
      
      <View style={styles.content}>
        {/* MOVA Icon */}
        <View style={styles.iconContainer}>
          <Image
            source={require('@/assets/images/icon.png')}
            style={styles.icon}
            resizeMode="contain"
          />
        </View>
        
        {/* App Name */}
        <Text style={styles.appName}>MOVA</Text>
        <Text style={styles.tagline}>Your Premium Car Rental</Text>
        
        {/* Loading Indicator */}
        <View style={styles.loadingContainer}>
          <ActivityIndicator 
            size="large" 
            color={Colors.primary.teal} 
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // White background
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    marginBottom: 30,
    shadowColor: Colors.primary.teal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderRadius: 20,
    overflow: 'hidden',
  },
  icon: {
    width: 160,
    height: 160,
  },
  appName: {
    fontSize: Typography.sizes.h1 + 8,
    fontWeight: '700',
    color: Colors.text.primary, // Dark MOVA color to match logo
    marginBottom: 8,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: Typography.sizes.bodyLarge,
    fontWeight: '400',
    color: Colors.primary.darkTeal, // Dark teal to match logo
    textAlign: 'center',
    marginBottom: 40,
  },
  loadingContainer: {
    marginTop: 20,
  },
});