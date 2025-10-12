import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native';

interface QuickReportButtonProps {
  bookingId?: string;
  isEmergency?: boolean;
  style?: any;
  variant?: 'primary' | 'secondary' | 'emergency';
}

export default function QuickReportButton({ 
  bookingId, 
  isEmergency = false,
  style,
  variant = 'primary'
}: QuickReportButtonProps) {
  const router = useRouter();

  const handleReportPress = () => {
    const params: any = bookingId ? { bookingId } : {};
    if (isEmergency) {
      params.emergency = 'true';
    }
    
    router.push({
      pathname: '/report-issue',
      params,
    } as any);
  };

  const getButtonStyle = () => {
    switch (variant) {
      case 'emergency':
        return {
          colors: [Colors.functional.error, '#DC2626'] as const,
          textColor: Colors.text.white,
          icon: 'warning' as const,
          text: 'Emergency Report',
        };
      case 'secondary':
        return {
          colors: [Colors.background.lightGrey, Colors.background.lightGrey] as const,
          textColor: Colors.text.primary,
          icon: 'flag-outline' as const,
          text: 'Report Issue',
        };
      default:
        return {
          colors: [Colors.functional.warning, '#F59E0B'] as const,
          textColor: Colors.text.white,
          icon: 'warning-outline' as const,
          text: 'Report Issue',
        };
    }
  };

  const buttonConfig = getButtonStyle();

  return (
    <TouchableOpacity style={[styles.container, style]} onPress={handleReportPress}>
      <LinearGradient
        colors={buttonConfig.colors}
        style={styles.gradient}
      >
        <Ionicons name={buttonConfig.icon} size={16} color={buttonConfig.textColor} />
        <Text style={[styles.text, { color: buttonConfig.textColor }]}>
          {buttonConfig.text}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
    minWidth: 120,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});