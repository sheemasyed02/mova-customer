import { Colors } from '@/src/shared/constants/Colors';
import { Typography } from '@/src/shared/constants/Typography';
import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large'; 
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps) {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle[] = [styles.button, styles[size]];
    
    switch (variant) {
      case 'primary':
        baseStyle.push(styles.primary);
        break;
      case 'secondary':
        baseStyle.push(styles.secondary);
        break;
      case 'outline':
        baseStyle.push(styles.outline);
        break;
    }
    
    if (disabled) {
      baseStyle.push(styles.disabled);
    }
    
    return StyleSheet.flatten([...baseStyle, style]);
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle[] = [styles.text, styles[`${size}Text` as keyof typeof styles] as TextStyle];
    
    switch (variant) {
      case 'primary':
        baseTextStyle.push(styles.primaryText);
        break;
      case 'secondary':
        baseTextStyle.push(styles.secondaryText);
        break;
      case 'outline':
        baseTextStyle.push(styles.outlineText);
        break;
    }
    
    if (disabled) {
      baseTextStyle.push(styles.disabledText);
    }
    
    return StyleSheet.flatten([...baseTextStyle, textStyle]);
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'primary' ? Colors.text.white : Colors.primary.teal} 
          size="small" 
        />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    flexDirection: 'row' as const,
  },
  
  // Sizes
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 36,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: 48,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    minHeight: 56,
  },
  
  // Variants
  primary: {
    backgroundColor: Colors.primary.teal,
    shadowColor: Colors.primary.teal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  secondary: {
    backgroundColor: Colors.background.lightGrey,
    borderWidth: 1,
    borderColor: Colors.primary.teal,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary.teal,
  },
  disabled: {
    backgroundColor: Colors.text.light,
    shadowOpacity: 0,
    elevation: 0,
  },
  
  // Text styles
  text: {
    fontSize: Typography.sizes.button,
    fontWeight: '600' as const,
    textAlign: 'center' as const,
  },
  smallText: {
    fontSize: Typography.sizes.body,
  },
  mediumText: {
    fontSize: Typography.sizes.button,
  },
  largeText: {
    fontSize: Typography.sizes.bodyLarge,
  },
  
  // Text variants
  primaryText: {
    color: Colors.text.white,
  },
  secondaryText: {
    color: Colors.primary.teal,
  },
  outlineText: {
    color: Colors.primary.teal,
  },
  disabledText: {
    color: Colors.text.secondary,
  },
});
