/**
 * MOVA Brand Colors
 * Car Rental App Color Palette
 */

export const Colors = {
  // Primary Colors
  primary: {
    teal: '#2D9B8E',
    darkTeal: '#238276',
    lightTeal: '#4DBFAF',
  },
  
  // Accent Colors
  accent: {
    cyan: '#5DCDCB',
    blue: '#3FA5B8',
  },
  
  // Background Colors
  background: {
    white: '#FFFFFF',
    lightGrey: '#F5F8F9',
    darkMode: '#0A2F35',
  },
  
  // Functional Colors
  functional: {
    success: '#2ECC71',
    warning: '#F39C12',
    error: '#E74C3C',
    info: '#3498DB',
  },
  
  // Text Colors
  text: {
    primary: '#0A2F35',
    secondary: '#6B7280',
    white: '#FFFFFF',
    light: '#9CA3AF',
  },
  
  // Gradient Colors
  gradient: {
    splashStart: '#2D9B8E', // Teal
    splashEnd: '#0A2F35',   // Dark Blue
  },
};

const tintColorLight = '#2D9B8E';
const tintColorDark = '#4DBFAF';

export default {
  light: {
    text: '#0A2F35',
    background: '#FFFFFF',
    tint: tintColorLight,
    tabIconDefault: '#6B7280',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#FFFFFF',
    background: '#0A2F35',
    tint: tintColorDark,
    tabIconDefault: '#9CA3AF',
    tabIconSelected: tintColorDark,
  },
};
