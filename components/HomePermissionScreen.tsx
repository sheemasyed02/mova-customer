import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function HomePermissionScreen() {
  const [animatedValue] = useState(new Animated.Value(0));
  const [locationLoading, setLocationLoading] = useState(false);

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const requestLocationPermission = async () => {
    setLocationLoading(true);
    
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status === 'granted') {
        // Permission granted, navigate to main app
        Alert.alert(
          'Location Enabled!',
          'Great! We can now show you nearby vehicles.',
          [{ text: 'Continue', onPress: () => router.push('/notification-permission' as any) }]
        );
      } else {
        // Permission denied
        Alert.alert(
          'Permission Required',
          'Location access is needed to provide the best experience. You can enable it later in settings.',
          [
            { text: 'Try Again', onPress: () => requestLocationPermission() },
            { text: 'Continue Without', onPress: () => router.push('/notification-permission' as any) },
          ]
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Something went wrong. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLocationLoading(false);
    }
  };

  const skipPermission = () => {
    router.push('/notification-permission' as any);
  };

  const benefits = [
    {
      icon: 'car-outline',
      title: 'Find cars near you',
      description: 'See available vehicles in your area instantly'
    },
    {
      icon: 'location-outline',
      title: 'Accurate pickup/delivery',
      description: 'Precise location for seamless service'
    },
    {
      icon: 'search-outline',
      title: 'Better search results',
      description: 'Personalized recommendations based on your location'
    }
  ];

  const MapIllustration = () => (
    <Animated.View style={[styles.illustrationContainer, {
      opacity: animatedValue,
      transform: [{
        scale: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1],
        })
      }]
    }]}>
      {/* Map Background */}
      <LinearGradient
        colors={['rgba(45, 155, 142, 0.1)', 'rgba(45, 155, 142, 0.05)', 'transparent']}
        style={styles.mapBackground}
      >
        {/* Grid Lines */}
        <View style={styles.gridContainer}>
          {[...Array(4)].map((_, i) => (
            <View key={`h-${i}`} style={[styles.gridLineHorizontal, { top: `${25 * i}%` }]} />
          ))}
          {[...Array(4)].map((_, i) => (
            <View key={`v-${i}`} style={[styles.gridLineVertical, { left: `${25 * i}%` }]} />
          ))}
        </View>

        {/* Roads */}
        <View style={styles.roadsContainer}>
          <View style={[styles.road, styles.roadHorizontal1]} />
          <View style={[styles.road, styles.roadHorizontal2]} />
          <View style={[styles.road, styles.roadVertical1]} />
          <View style={[styles.road, styles.roadVertical2]} />
        </View>

        {/* Buildings/Landmarks */}
        <View style={styles.landmarksContainer}>
          <View style={[styles.landmark, styles.landmark1]} />
          <View style={[styles.landmark, styles.landmark2]} />
          <View style={[styles.landmark, styles.landmark3]} />
          <View style={[styles.landmark, styles.landmark4]} />
        </View>

        {/* Location Pin */}
        <Animated.View style={[styles.locationPinContainer, {
          transform: [{
            scale: animatedValue.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0, 1.2, 1],
            })
          }]
        }]}>
          <LinearGradient
            colors={[Colors.primary.teal, '#20A39E', '#1A8B87']}
            style={styles.locationPin}
          >
            <Ionicons name="location" size={24} color="#ffffff" />
          </LinearGradient>
          
          {/* Pin Shadow */}
          <View style={styles.pinShadow} />
          
          {/* Pulse Animation */}
          <Animated.View style={[styles.pulseRing, {
            opacity: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.6],
            }),
            transform: [{
              scale: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 2],
              })
            }]
          }]} />
        </Animated.View>

        {/* Vehicle Icons */}
        <Animated.View style={[styles.vehicleIcon, styles.vehicle1, {
          opacity: animatedValue.interpolate({
            inputRange: [0, 0.7, 1],
            outputRange: [0, 0, 1],
          })
        }]}>
          <View style={styles.vehicleContainer}>
            <Ionicons name="car" size={16} color={Colors.primary.teal} />
          </View>
        </Animated.View>

        <Animated.View style={[styles.vehicleIcon, styles.vehicle2, {
          opacity: animatedValue.interpolate({
            inputRange: [0, 0.8, 1],
            outputRange: [0, 0, 1],
          })
        }]}>
          <View style={styles.vehicleContainer}>
            <Ionicons name="car" size={16} color={Colors.primary.teal} />
          </View>
        </Animated.View>

        <Animated.View style={[styles.vehicleIcon, styles.vehicle3, {
          opacity: animatedValue.interpolate({
            inputRange: [0, 0.9, 1],
            outputRange: [0, 0, 1],
          })
        }]}>
          <View style={styles.vehicleContainer}>
            <Ionicons name="car" size={16} color={Colors.primary.teal} />
          </View>
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={['rgba(45, 155, 142, 0.02)', 'rgba(45, 155, 142, 0.05)', '#ffffff']}
        style={styles.backgroundGradient}
      />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Map Illustration */}
        <MapIllustration />

        {/* Content Section */}
        <Animated.View style={[styles.contentSection, {
          opacity: animatedValue,
          transform: [{
            translateY: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [30, 0],
            })
          }]
        }]}>
          {/* Header */}
          <View style={styles.headerSection}>
            <Text style={styles.heading}>Enable Location</Text>
            <Text style={styles.description}>
              We need your location to show nearby vehicles and provide accurate delivery
            </Text>
          </View>

          {/* Benefits List */}
          <View style={styles.benefitsSection}>
            {benefits.map((benefit, index) => (
              <Animated.View
                key={index}
                style={[styles.benefitItem, {
                  opacity: animatedValue,
                  transform: [{
                    translateX: animatedValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    })
                  }]
                }]}
              >
                <View style={styles.benefitIconContainer}>
                  <LinearGradient
                    colors={['rgba(45, 155, 142, 0.1)', 'rgba(45, 155, 142, 0.15)']}
                    style={styles.benefitIcon}
                  >
                    <Ionicons 
                      name={benefit.icon as any} 
                      size={20} 
                      color={Colors.primary.teal} 
                    />
                  </LinearGradient>
                </View>
                
                <View style={styles.benefitTextContainer}>
                  <Text style={styles.benefitTitle}>{benefit.title}</Text>
                  <Text style={styles.benefitDescription}>{benefit.description}</Text>
                </View>
              </Animated.View>
            ))}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            <Animated.View style={[{
              opacity: animatedValue,
              transform: [{
                translateY: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                })
              }]
            }]}>
              <TouchableOpacity
                style={styles.allowButton}
                onPress={requestLocationPermission}
                disabled={locationLoading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[Colors.primary.teal, '#20A39E', '#1A8B87']}
                  style={styles.allowButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  {locationLoading ? (
                    <Animated.View style={{
                      transform: [{
                        rotate: animatedValue.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0deg', '360deg'],
                        })
                      }]
                    }}>
                      <Ionicons name="refresh" size={18} color="#ffffff" />
                    </Animated.View>
                  ) : (
                    <Ionicons name="location" size={18} color="#ffffff" />
                  )}
                  <Text style={styles.allowButtonText}>
                    {locationLoading ? 'Requesting Permission...' : 'Allow Location Access'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity onPress={skipPermission} style={styles.skipButton}>
              <Text style={styles.skipText}>Not now</Text>
            </TouchableOpacity>

            {/* Settings Note */}
            <Animated.View style={[styles.noteContainer, {
              opacity: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.7],
              })
            }]}>
              <Ionicons name="settings-outline" size={14} color={Colors.text.secondary} />
              <Text style={styles.noteText}>You can change this in settings</Text>
            </Animated.View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  illustrationContainer: {
    height: height * 0.35,
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapBackground: {
    width: width * 0.8,
    height: height * 0.3,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  gridContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gridLineHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(45, 155, 142, 0.1)',
  },
  gridLineVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(45, 155, 142, 0.1)',
  },
  roadsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  road: {
    position: 'absolute',
    backgroundColor: 'rgba(156, 163, 175, 0.3)',
  },
  roadHorizontal1: {
    left: 0,
    right: 0,
    height: 4,
    top: '30%',
  },
  roadHorizontal2: {
    left: 0,
    right: 0,
    height: 4,
    top: '70%',
  },
  roadVertical1: {
    top: 0,
    bottom: 0,
    width: 4,
    left: '25%',
  },
  roadVertical2: {
    top: 0,
    bottom: 0,
    width: 4,
    left: '75%',
  },
  landmarksContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  landmark: {
    position: 'absolute',
    backgroundColor: 'rgba(45, 155, 142, 0.2)',
    borderRadius: 2,
  },
  landmark1: {
    width: 12,
    height: 12,
    top: '15%',
    left: '15%',
  },
  landmark2: {
    width: 16,
    height: 10,
    top: '20%',
    right: '20%',
  },
  landmark3: {
    width: 10,
    height: 14,
    bottom: '25%',
    left: '30%',
  },
  landmark4: {
    width: 14,
    height: 8,
    bottom: '20%',
    right: '15%',
  },
  locationPinContainer: {
    position: 'absolute',
    top: '45%',
    left: '45%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationPin: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary.teal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 2,
  },
  pinShadow: {
    position: 'absolute',
    bottom: -6,
    width: 20,
    height: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    zIndex: 1,
  },
  pulseRing: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: Colors.primary.teal,
    zIndex: 0,
  },
  vehicleIcon: {
    position: 'absolute',
  },
  vehicle1: {
    top: '25%',
    left: '60%',
  },
  vehicle2: {
    bottom: '30%',
    left: '20%',
  },
  vehicle3: {
    top: '60%',
    right: '25%',
  },
  vehicleContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(45, 155, 142, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentSection: {
    flex: 1,
    justifyContent: 'center',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 35,
  },
  heading: {
    fontSize: Typography.sizes.h1,
    fontWeight: '700',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: Typography.sizes.body,
    fontWeight: '400',
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  benefitsSection: {
    marginBottom: 35,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  benefitIconContainer: {
    marginRight: 16,
  },
  benefitIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitTextContainer: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: Typography.sizes.body,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: Typography.sizes.caption,
    fontWeight: '400',
    color: Colors.text.secondary,
    lineHeight: 18,
  },
  actionSection: {
    alignItems: 'center',
  },
  allowButton: {
    width: '100%',
    marginBottom: 20,
    shadowColor: Colors.primary.teal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  allowButtonGradient: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  allowButtonText: {
    fontSize: Typography.sizes.body,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  skipText: {
    fontSize: Typography.sizes.body,
    fontWeight: '500',
    color: Colors.text.secondary,
    textDecorationLine: 'underline',
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  noteText: {
    fontSize: Typography.sizes.caption,
    fontWeight: '400',
    color: Colors.text.secondary,
    marginLeft: 6,
  },
});