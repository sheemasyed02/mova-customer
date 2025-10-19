import { Colors } from '@/src/shared/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export const DocumentsNavigationPatterns = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* From Profile Menu */}
      <TouchableOpacity 
        style={styles.menuItem}
        onPress={() => router.push('/documents-page' as any)}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="document-text" size={20} color={Colors.primary.teal} />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>My Documents</Text>
          <Text style={styles.subtitle}>ID verification & licenses</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={Colors.text.secondary} />
      </TouchableOpacity>

      {/* Quick Access Button */}
      <TouchableOpacity 
        style={styles.quickAccessButton}
        onPress={() => router.push('/documents-page' as any)}
      >
        <Ionicons name="document" size={16} color="#ffffff" />
        <Text style={styles.quickAccessText}>Documents</Text>
      </TouchableOpacity>

      {/* Verification Required Banner */}
      <TouchableOpacity 
        style={styles.verificationBanner}
        onPress={() => router.push('/documents-page' as any)}
      >
        <View style={styles.bannerIcon}>
          <Ionicons name="warning" size={20} color={Colors.functional.warning} />
        </View>
        <View style={styles.bannerContent}>
          <Text style={styles.bannerTitle}>Verification Required</Text>
          <Text style={styles.bannerSubtitle}>Upload documents to start booking</Text>
        </View>
        <Ionicons name="arrow-forward" size={16} color={Colors.functional.warning} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
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
  quickAccessButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary.teal,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
    alignSelf: 'flex-start',
  },
  quickAccessText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  verificationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.functional.warning + '10',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.functional.warning + '30',
  },
  bannerIcon: {
    marginRight: 12,
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 2,
  },
});