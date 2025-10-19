import { Colors } from '@/src/shared/constants/Colors';
import { Typography } from '@/src/shared/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
 
import { ProfileData } from '../../authentication/screens/profile-setup-screen';

interface PreferencesStepProps {
  profileData: ProfileData;
  updateProfileData: (data: Partial<ProfileData>) => void;
  onNext: () => void;
  onSkip: () => void;
}

const vehicleTypes = [
  { id: 'hatchback', label: 'Hatchback', icon: '🚗', description: 'Compact & Economical' },
  { id: 'sedan', label: 'Sedan', icon: '🚙', description: 'Comfortable & Spacious' },
  { id: 'suv', label: 'SUV', icon: '🚐', description: 'Large & Family-friendly' },
  { id: 'luxury', label: 'Luxury', icon: '🏎️', description: 'Premium & Exclusive' },
  { id: 'bike', label: 'Bike', icon: '🏍️', description: 'Quick & Convenient' },
];

const usageTypes = [
  { 
    id: 'daily-commute', 
    label: 'Daily Commute', 
    icon: 'briefcase-outline',
    description: 'Regular office travel'
  },
  { 
    id: 'weekend-trips', 
    label: 'Weekend Trips', 
    icon: 'map-outline',
    description: 'Leisure & entertainment'
  },
  { 
    id: 'business-travel', 
    label: 'Business Travel', 
    icon: 'business-outline',
    description: 'Professional meetings'
  },
  { 
    id: 'special-occasions', 
    label: 'Special Occasions', 
    icon: 'gift-outline',
    description: 'Events & celebrations'
  },
  { 
    id: 'flexible', 
    label: 'Flexible/All Purposes', 
    icon: 'options-outline',
    description: 'Mix of different needs'
  },
];

export default function PreferencesStep({
  profileData,
  updateProfileData,
  onNext,
  onSkip,
}: PreferencesStepProps) {
  const [animatedValue] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const toggleVehicleType = (vehicleId: string) => {
    const currentTypes = profileData.favoriteVehicleTypes || [];
    const updatedTypes = currentTypes.includes(vehicleId)
      ? currentTypes.filter(id => id !== vehicleId)
      : [...currentTypes, vehicleId];
    
    updateProfileData({ favoriteVehicleTypes: updatedTypes });
  };

  const selectUsageType = (usageId: string) => {
    updateProfileData({ typicalUsage: usageId });
  };

  const isVehicleSelected = (vehicleId: string) => {
    return profileData.favoriteVehicleTypes?.includes(vehicleId) || false;
  };

  const canFinishSetup = () => {
    return profileData.favoriteVehicleTypes?.length > 0 || profileData.typicalUsage;
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <Animated.View style={[{
          opacity: animatedValue,
          transform: [{
            translateY: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [30, 0],
            })
          }]
        }]}>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
          {/* Vehicle Types Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Favorite Vehicle Types</Text>
            <Text style={styles.sectionSubtitle}>Select all that apply (optional)</Text>
            
            <View style={styles.vehicleGrid}>
              {vehicleTypes.map((vehicle, index) => (
                <Animated.View
                  key={vehicle.id}
                  style={[{
                    opacity: animatedValue,
                    transform: [{
                      translateY: animatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20 * (index + 1), 0],
                      })
                    }]
                  }]}
                >
                  <TouchableOpacity
                    style={[
                      styles.vehicleCard,
                      isVehicleSelected(vehicle.id) && styles.vehicleCardSelected
                    ]}
                    onPress={() => toggleVehicleType(vehicle.id)}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={isVehicleSelected(vehicle.id)
                        ? ['rgba(45, 155, 142, 0.1)', 'rgba(45, 155, 142, 0.15)']
                        : ['#ffffff', '#fafafa']
                      }
                      style={styles.vehicleCardGradient}
                    >
                      <View style={styles.vehicleIconContainer}>
                        <Text style={styles.vehicleIcon}>{vehicle.icon}</Text>
                        {isVehicleSelected(vehicle.id) && (
                          <View style={styles.vehicleCheckmark}>
                            <Ionicons name="checkmark" size={12} color="#ffffff" />
                          </View>
                        )}
                      </View>
                      
                      <Text style={[
                        styles.vehicleLabel,
                        isVehicleSelected(vehicle.id) && styles.vehicleLabelSelected
                      ]}>
                        {vehicle.label}
                      </Text>
                      
                      <Text style={[
                        styles.vehicleDescription,
                        isVehicleSelected(vehicle.id) && styles.vehicleDescriptionSelected
                      ]}>
                        {vehicle.description}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </View>

          {/* Usage Types Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Typical Usage</Text>
            <Text style={styles.sectionSubtitle}>Select your primary use case (optional)</Text>
            
            <View style={styles.usageContainer}>
              {usageTypes.map((usage, index) => (
                <Animated.View
                  key={usage.id}
                  style={[{
                    opacity: animatedValue,
                    transform: [{
                      translateX: animatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [30, 0],
                      })
                    }]
                  }]}
                >
                  <TouchableOpacity
                    style={[
                      styles.usageCard,
                      profileData.typicalUsage === usage.id && styles.usageCardSelected
                    ]}
                    onPress={() => selectUsageType(usage.id)}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={profileData.typicalUsage === usage.id
                        ? ['rgba(45, 155, 142, 0.08)', 'rgba(45, 155, 142, 0.12)']
                        : ['#ffffff', '#fafafa']
                      }
                      style={styles.usageCardGradient}
                    >
                      <View style={styles.usageContent}>
                        <View style={[
                          styles.usageIconContainer,
                          profileData.typicalUsage === usage.id && styles.usageIconContainerSelected
                        ]}>
                          <Ionicons 
                            name={usage.icon as any} 
                            size={20} 
                            color={profileData.typicalUsage === usage.id ? Colors.primary.teal : Colors.text.secondary}
                          />
                        </View>
                        
                        <View style={styles.usageTextContainer}>
                          <Text style={[
                            styles.usageLabel,
                            profileData.typicalUsage === usage.id && styles.usageLabelSelected
                          ]}>
                            {usage.label}
                          </Text>
                          <Text style={[
                            styles.usageDescription,
                            profileData.typicalUsage === usage.id && styles.usageDescriptionSelected
                          ]}>
                            {usage.description}
                          </Text>
                        </View>
                        
                        <View style={styles.usageSelector}>
                          {profileData.typicalUsage === usage.id ? (
                            <View style={styles.usageSelected}>
                              <Ionicons name="checkmark" size={14} color={Colors.primary.teal} />
                            </View>
                          ) : (
                            <View style={styles.usageUnselected} />
                          )}
                        </View>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </View>

          {/* Benefits Info */}
          <View style={styles.infoSection}>
            <View style={styles.infoCard}>
              <Ionicons name="star-outline" size={24} color={Colors.primary.teal} />
              <Text style={styles.infoText}>
                These preferences help us recommend the best vehicles and routes for your specific needs. You can always update them later in settings.
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            <TouchableOpacity
              style={styles.finishButton}
              onPress={onNext}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[Colors.primary.teal, '#20A39E', '#1A8B87']}
                style={styles.finishButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.finishButtonText}>Finish Setup</Text>
                <Ionicons name="checkmark" size={18} color="#ffffff" style={styles.finishIcon} />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={onSkip} style={styles.skipButton}>
              <Text style={styles.skipText}>Skip preferences</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    flexGrow: 1,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: Colors.text.secondary,
    marginBottom: 16,
    lineHeight: 18,
  },
  vehicleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  vehicleCard: {
    width: '47%',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  vehicleCardSelected: {
    shadowColor: Colors.primary.teal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    transform: [{ scale: 1.02 }],
  },
  vehicleCardGradient: {
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
    borderRadius: 16,
  },
  vehicleIconContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  vehicleIcon: {
    fontSize: 28,
  },
  vehicleCheckmark: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleLabel: {
    fontSize: Typography.sizes.caption,
    fontWeight: '600',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  vehicleLabelSelected: {
    color: Colors.primary.teal,
  },
  vehicleDescription: {
    fontSize: Typography.sizes.caption,
    fontWeight: '400',
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 14,
  },
  vehicleDescriptionSelected: {
    color: Colors.primary.teal,
    opacity: 0.8,
  },
  usageContainer: {
    gap: 12,
  },
  usageCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  usageCardSelected: {
    shadowColor: Colors.primary.teal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    transform: [{ scale: 1.01 }],
  },
  usageCardGradient: {
    borderWidth: 1.5,
    borderColor: 'transparent',
    borderRadius: 16,
  },
  usageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  usageIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(156, 163, 175, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  usageIconContainerSelected: {
    backgroundColor: 'rgba(45, 155, 142, 0.15)',
  },
  usageTextContainer: {
    flex: 1,
  },
  usageLabel: {
    fontSize: Typography.sizes.body,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  usageLabelSelected: {
    color: Colors.primary.teal,
  },
  usageDescription: {
    fontSize: Typography.sizes.caption,
    fontWeight: '400',
    color: Colors.text.secondary,
    lineHeight: 16,
  },
  usageDescriptionSelected: {
    color: Colors.primary.teal,
    opacity: 0.8,
  },
  usageSelector: {
    marginLeft: 12,
  },
  usageSelected: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(45, 155, 142, 0.15)',
    borderWidth: 2,
    borderColor: Colors.primary.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  usageUnselected: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: 'transparent',
  },
  infoSection: {
    marginBottom: 25,
  },
  infoCard: {
    backgroundColor: 'rgba(45, 155, 142, 0.05)',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(45, 155, 142, 0.1)',
  },
  infoText: {
    flex: 1,
    fontSize: Typography.sizes.caption,
    fontWeight: '400',
    color: Colors.text.secondary,
    lineHeight: 18,
    marginLeft: 12,
  },
  actionSection: {
    marginTop: 20,
  },
  finishButton: {
    marginBottom: 12,
    shadowColor: Colors.primary.teal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  finishButtonGradient: {
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  finishButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  finishIcon: {
    marginLeft: 8,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  skipText: {
    fontSize: Typography.sizes.caption,
    fontWeight: '500',
    color: Colors.text.secondary,
    textDecorationLine: 'underline',
  },
});
