import { Colors } from '@/constants/Colors';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface Language {
  id: string;
  name: string;
  nativeName: string;
  code: string;
  icon: string;
}

// Grid-style languages with native names and icons
const languages: Language[] = [
  { id: '1', name: 'English', nativeName: 'English', code: 'en', icon: 'E' },
  { id: '2', name: 'Hindi', nativeName: 'हिंदी', code: 'hi', icon: 'हि' },
  { id: '3', name: 'Gujarati', nativeName: 'ગુજરાતી', code: 'gu', icon: 'ગુ' },
  { id: '4', name: 'Marathi', nativeName: 'मराठी', code: 'mr', icon: 'म' },
  { id: '5', name: 'Telugu', nativeName: 'తెలుగు', code: 'te', icon: 'తె' },
  { id: '6', name: 'Tamil', nativeName: 'தமிழ்', code: 'ta', icon: 'த' },
  { id: '7', name: 'Kannada', nativeName: 'ಕನ್ನಡ', code: 'kn', icon: 'ಕ' },
  { id: '8', name: 'Bengali', nativeName: 'বাংলা', code: 'bn', icon: 'বা' },
  { id: '9', name: 'Malayalam', nativeName: 'മലയാളം', code: 'ml', icon: 'മ' },
  { id: '10', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', code: 'pa', icon: 'ਪੰ' },
  { id: '11', name: 'Urdu', nativeName: 'اردو', code: 'ur', icon: 'ا' },
  { id: '12', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', code: 'or', icon: 'ଓ' },
  { id: '13', name: 'Assamese', nativeName: 'অসমীয়া', code: 'as', icon: 'অ' },
  { id: '14', name: 'Nepali', nativeName: 'नेपाली', code: 'ne', icon: 'ने' },
  { id: '15', name: 'Sanskrit', nativeName: 'संस्कृत', code: 'sa', icon: 'सं' },
  { id: '16', name: 'Sindhi', nativeName: 'سنڌي', code: 'sd', icon: 'س' },
  { id: '17', name: 'Konkani', nativeName: 'कोंकणी', code: 'gom', icon: 'को' },
  { id: '18', name: 'Manipuri', nativeName: 'মৈতৈলোন্', code: 'mni', icon: 'মৈ' },
];

export default function LanguageSelectionScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0]); // Default to English
  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLanguageSelect = (language: Language) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedLanguage(language);
  };

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/login' as any);
  };

  const renderLanguageItem = ({ item, index }: { item: Language; index: number }) => {
    const isSelected = selectedLanguage.id === item.id;
    const row = Math.floor(index / 3);
    
    return (
      <Animated.View
        style={[
          styles.gridItem,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30 + (row * 10), 0],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.languageCard,
            isSelected && styles.selectedLanguageCard,
          ]}
          onPress={() => handleLanguageSelect(item)}
          activeOpacity={0.8}
        >
          {/* Language Icon Circle */}
          <View style={[
            styles.languageIcon,
            isSelected && styles.selectedLanguageIcon
          ]}>
            <Text style={[
              styles.iconText,
              isSelected && styles.selectedIconText
            ]}>
              {item.icon}
            </Text>
          </View>
          
          {/* Language Name */}
          <Text style={[
            styles.languageName,
            isSelected && styles.selectedLanguageName
          ]}>
            {item.name}
          </Text>
          
          {/* Native Script */}
          <Text style={[
            styles.nativeText,
            isSelected && styles.selectedNativeText
          ]}>
            {item.nativeName}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.title}>Choose your preferred language</Text>
      </Animated.View>

      {/* Language Grid */}
      <View style={styles.gridContainer}>
        <FlatList
          data={languages}
          renderItem={renderLanguageItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.gridContent}
          columnWrapperStyle={styles.gridRow}
        />
      </View>

      {/* Continue Button */}
      <Animated.View
        style={[
          styles.buttonContainer,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.9}
        >
          <Text style={styles.continueButtonText}>Done</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 32,
    paddingTop: 50, // Much smaller - moved up significantly
    paddingBottom: 15, // Reduced bottom padding
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primary.teal,
    textAlign: 'center',
    letterSpacing: 0.3,
    lineHeight: 28,
  },
  gridContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 5, // Further reduced to bring grid closer to header
  },
  gridContent: {
    paddingBottom: 120,
  },
  gridRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  gridItem: {
    width: '31%',
    marginBottom: 20,
  },
  languageCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedLanguageCard: {
    backgroundColor: Colors.primary.teal,
    borderColor: Colors.primary.teal,
    shadowColor: Colors.primary.teal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  languageIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  selectedLanguageIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  iconText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
  },
  selectedIconText: {
    color: '#FFFFFF',
  },
  languageName: {
    fontSize: 11, // Reduced from 12 to prevent wrapping
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 2,
  },
  selectedLanguageName: {
    color: '#FFFFFF',
  },
  nativeText: {
    fontSize: 12, // Reduced from 14 to prevent wrapping
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
  },
  selectedNativeText: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 32,
    paddingVertical: 32,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  continueButton: {
    backgroundColor: Colors.primary.teal,
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary.teal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});