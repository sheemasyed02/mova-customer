import { Colors } from '@/src/shared/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export const ReferralNavigationPatterns = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Profile Menu Item */}
      <TouchableOpacity 
        style={styles.menuItem}
        onPress={() => router.push('/referral-page' as any)}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="gift" size={20} color={Colors.primary.teal} />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>Refer & Earn</Text>
          <Text style={styles.subtitle}>Earn ₹500 for each referral</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={Colors.text.secondary} />
      </TouchableOpacity>

      {/* Promotional Banner */}
      <TouchableOpacity 
        style={styles.promoBanner}
        onPress={() => router.push('/referral-page' as any)}
      >
        <LinearGradient
          colors={[Colors.primary.teal, Colors.primary.darkTeal]}
          style={styles.promoBannerGradient}
        >
          <View style={styles.promoBannerContent}>
            <View style={styles.promoBannerText}>
              <Text style={styles.promoBannerTitle}>Refer Friends & Earn!</Text>
              <Text style={styles.promoBannerSubtitle}>Give ₹200, Get ₹500</Text>
            </View>
            <View style={styles.promoBannerIcon}>
              <Ionicons name="gift" size={32} color="#ffffff" />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* Quick Action Card */}
      <TouchableOpacity 
        style={styles.quickActionCard}
        onPress={() => router.push('/referral-page' as any)}
      >
        <View style={styles.quickActionHeader}>
          <View style={styles.quickActionIconContainer}>
            <Ionicons name="people" size={24} color={Colors.primary.teal} />
          </View>
          <View style={styles.quickActionInfo}>
            <Text style={styles.quickActionTitle}>Invite Friends</Text>
            <Text style={styles.quickActionSubtitle}>Share your code: RAJ123</Text>
          </View>
        </View>
        <View style={styles.quickActionStats}>
          <View style={styles.quickActionStat}>
            <Text style={styles.quickActionStatValue}>8</Text>
            <Text style={styles.quickActionStatLabel}>Referred</Text>
          </View>
          <View style={styles.quickActionStat}>
            <Text style={styles.quickActionStatValue}>₹2,500</Text>
            <Text style={styles.quickActionStatLabel}>Earned</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push('/referral-page' as any)}
      >
        <Ionicons name="share" size={24} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: Colors.primary.teal + '20',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  promoBanner: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  promoBannerGradient: {
    padding: 20,
  },
  promoBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  promoBannerText: {
    flex: 1,
  },
  promoBannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  promoBannerSubtitle: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
  },
  promoBannerIcon: {
    marginLeft: 16,
  },
  quickActionCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickActionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  quickActionIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: Colors.primary.teal + '20',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  quickActionInfo: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  quickActionSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  quickActionStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  quickActionStat: {
    alignItems: 'center',
  },
  quickActionStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary.teal,
  },
  quickActionStatLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    backgroundColor: Colors.primary.teal,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});