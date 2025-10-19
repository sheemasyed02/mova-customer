import { Colors } from '@/src/shared/constants/Colors';
import { Typography } from '@/src/shared/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Notifications from 'expo-notifications';
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
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function NotificationPermissionScreen() {
  const [animatedValue] = useState(new Animated.Value(0));
  const [notificationLoading, setNotificationLoading] = useState(false);

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const requestNotificationPermission = async () => {
    setNotificationLoading(true);
    
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      
      if (status === 'granted') {
        // Permission granted, navigate to main app
        Alert.alert(
          'Notifications Enabled!',
          'You\'ll now receive important updates about your bookings.',
          [{ text: 'Continue', onPress: () => router.push('/(main)' as any) }]
        );
      } else {
        // Permission denied
        Alert.alert(
          'Notifications Not Enabled',
          'You can enable notifications later in settings to stay updated.',
          [
            { text: 'Try Again', onPress: () => requestNotificationPermission() },
            { text: 'Continue', onPress: () => router.push('/(main)' as any) },
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
      setNotificationLoading(false);
    }
  };

  const skipPermission = () => {
    router.push('/(main)' as any);
  };

  const benefits = [
    {
      icon: 'checkmark-circle-outline',
      title: 'Booking confirmations',
      description: 'Get instant confirmation when your ride is booked'
    },
    {
      icon: 'time-outline',
      title: 'Trip reminders',
      description: 'Never miss your scheduled trips with timely alerts'
    },
    {
      icon: 'gift-outline',
      title: 'Exclusive deals',
      description: 'Be the first to know about special offers and discounts'
    },
    {
      icon: 'information-circle-outline',
      title: 'Important updates',
      description: 'Stay informed about service changes and announcements'
    }
  ];

  const BellIllustration = () => (
    <Animated.View style={[styles.illustrationContainer, {
      opacity: animatedValue,
      transform: [{
        scale: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1],
        })
      }]
    }]}>
      {/* Bell Background Circle */}
      <LinearGradient
        colors={['rgba(45, 155, 142, 0.1)', 'rgba(45, 155, 142, 0.05)', 'transparent']}
        style={styles.bellBackground}
      >
        {/* Notification Rings */}
        <Animated.View style={[styles.notificationRing, styles.ring1, {
          opacity: animatedValue.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 0.3, 0.6],
          }),
          transform: [{
            scale: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0.5, 1.5],
            })
          }]
        }]} />

        <Animated.View style={[styles.notificationRing, styles.ring2, {
          opacity: animatedValue.interpolate({
            inputRange: [0, 0.7, 1],
            outputRange: [0, 0.2, 0.4],
          }),
          transform: [{
            scale: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 1.8],
            })
          }]
        }]} />

        <Animated.View style={[styles.notificationRing, styles.ring3, {
          opacity: animatedValue.interpolate({
            inputRange: [0, 0.9, 1],
            outputRange: [0, 0.1, 0.2],
          }),
          transform: [{
            scale: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0.1, 2.1],
            })
          }]
        }]} />

        {/* Main Bell */}
        <Animated.View style={[styles.bellContainer, {
          transform: [{
            scale: animatedValue.interpolate({
              inputRange: [0, 0.6, 1],
              outputRange: [0, 1.1, 1],
            })
          }, {
            rotate: animatedValue.interpolate({
              inputRange: [0, 0.3, 0.6, 1],
              outputRange: ['0deg', '-5deg', '5deg', '0deg'],
            })
          }]
        }]}>
          <LinearGradient
            colors={[Colors.primary.teal, '#20A39E', '#1A8B87']}
            style={styles.bell}
          >
            <Ionicons name="notifications" size={48} color="#ffffff" />
          </LinearGradient>

          {/* Bell Shadow */}
          <View style={styles.bellShadow} />
        </Animated.View>

        {/* Notification Badge */}
        <Animated.View style={[styles.notificationBadge, {
          opacity: animatedValue.interpolate({
            inputRange: [0, 0.8, 1],
            outputRange: [0, 0, 1],
          }),
          transform: [{
            scale: animatedValue.interpolate({
              inputRange: [0, 0.8, 0.9, 1],
              outputRange: [0, 0, 1.3, 1],
            })
          }]
        }]}>
          <LinearGradient
            colors={['#EF4444', '#DC2626']}
            style={styles.badge}
          >
            <Text style={styles.badgeText}>3</Text>
          </LinearGradient>
        </Animated.View>

        {/* Floating Notification Icons */}
        <Animated.View style={[styles.floatingIcon, styles.icon1, {
          opacity: animatedValue.interpolate({
            inputRange: [0, 0.7, 1],
            outputRange: [0, 0, 1],
          }),
          transform: [{
            translateY: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            })
          }]
        }]}>
          <View style={styles.miniNotification}>
            <Ionicons name="car" size={12} color={Colors.primary.teal} />
          </View>
        </Animated.View>

        <Animated.View style={[styles.floatingIcon, styles.icon2, {
          opacity: animatedValue.interpolate({
            inputRange: [0, 0.8, 1],
            outputRange: [0, 0, 1],
          }),
          transform: [{
            translateY: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [15, 0],
            })
          }]
        }]}>
          <View style={styles.miniNotification}>
            <Ionicons name="gift" size={12} color={Colors.primary.teal} />
          </View>
        </Animated.View>

        <Animated.View style={[styles.floatingIcon, styles.icon3, {
          opacity: animatedValue.interpolate({
            inputRange: [0, 0.9, 1],
            outputRange: [0, 0, 1],
          }),
          transform: [{
            translateY: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [10, 0],
            })
          }]
        }]}>
          <View style={styles.miniNotification}>
            <Ionicons name="time" size={12} color={Colors.primary.teal} />
          </View>
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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
        {/* Bell Illustration */}
        <BellIllustration />

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
            <Text style={styles.heading}>Stay Updated</Text>
            <Text style={styles.description}>
              Get instant updates about your bookings, offers, and more
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
                style={styles.enableButton}
                onPress={requestNotificationPermission}
                disabled={notificationLoading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[Colors.primary.teal, '#20A39E', '#1A8B87']}
                  style={styles.enableButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  {notificationLoading ? (
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
                    <Ionicons name="notifications" size={18} color="#ffffff" />
                  )}
                  <Text style={styles.enableButtonText}>
                    {notificationLoading ? 'Requesting Permission...' : 'Enable Notifications'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity onPress={skipPermission} style={styles.skipButton}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
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
    paddingTop: 20,
    paddingBottom: 40,
  },
  illustrationContainer: {
    height: height * 0.3,
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellBackground: {
    width: width * 0.8,
    height: height * 0.3,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  notificationRing: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: Colors.primary.teal,
    borderRadius: 100,
  },
  ring1: {
    width: 120,
    height: 120,
  },
  ring2: {
    width: 160,
    height: 160,
  },
  ring3: {
    width: 200,
    height: 200,
  },
  bellContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  bell: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary.teal,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  bellShadow: {
    position: 'absolute',
    bottom: -8,
    width: 40,
    height: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    zIndex: 1,
  },
  notificationBadge: {
    position: 'absolute',
    top: '25%',
    right: '30%',
    zIndex: 3,
  },
  badge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
  },
  floatingIcon: {
    position: 'absolute',
  },
  icon1: {
    top: '20%',
    left: '15%',
  },
  icon2: {
    top: '25%',
    right: '10%',
  },
  icon3: {
    bottom: '25%',
    left: '20%',
  },
  miniNotification: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(45, 155, 142, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(45, 155, 142, 0.3)',
  },
  contentSection: {
    flex: 1,
    justifyContent: 'center',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 25,
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
    marginBottom: 25,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
  enableButton: {
    width: '100%',
    marginBottom: 20,
    shadowColor: Colors.primary.teal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  enableButtonGradient: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  enableButtonText: {
    fontSize: Typography.sizes.body,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  skipText: {
    fontSize: Typography.sizes.body,
    fontWeight: '500',
    color: Colors.text.secondary,
    textDecorationLine: 'underline',
  },
});

