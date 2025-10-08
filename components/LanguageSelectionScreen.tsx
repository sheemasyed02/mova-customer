import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

interface Language {
  id: string;
  name: string;
  nativeName: string;
  flag: string;
  code: string;
}

const languages: Language[] = [
  { id: '1', name: 'English', nativeName: 'English', flag: '🇮🇳', code: 'en' },
  { id: '2', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳', code: 'hi' },
  { id: '3', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', code: 'ta' },
  { id: '4', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', code: 'te' },
  { id: '5', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', code: 'kn' },
  { id: '6', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', code: 'ml' },
  { id: '7', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', code: 'gu' },
  { id: '8', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', code: 'mr' },
  { id: '9', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳', code: 'bn' },
  { id: '10', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳', code: 'pa' },
];

export default function LanguageSelectionScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0]);

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
  };

  const handleContinue = () => {
    // Store selected language in local storage or context
    // Navigate to login screen
    router.push('/login');
  };

  const renderLanguageItem = ({ item }: { item: Language }) => (
    <TouchableOpacity
      style={[
        styles.languageItem,
        selectedLanguage.id === item.id && styles.selectedLanguageItem
      ]}
      onPress={() => handleLanguageSelect(item)}
    >
      <View style={styles.languageContent}>
        <Text style={styles.flagText}>{item.flag}</Text>
        <View style={styles.languageTextContainer}>
          <Text style={[
            styles.languageName,
            selectedLanguage.id === item.id && styles.selectedLanguageName
          ]}>
            {item.name}
          </Text>
          <Text style={[
            styles.nativeLanguageName,
            selectedLanguage.id === item.id && styles.selectedNativeLanguageName
          ]}>
            {item.nativeName}
          </Text>
        </View>
      </View>
      
      {selectedLanguage.id === item.id && (
        <View style={styles.checkmark}>
          <Text style={styles.checkmarkText}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Language</Text>
        <Text style={styles.titleHindi}>अपनी भाषा चुनें</Text>
      </View>

      {/* Language List */}
      <View style={styles.languageListContainer}>
        <FlatList
          data={languages}
          renderItem={renderLanguageItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <LinearGradient
          colors={['transparent', 'rgba(255, 255, 255, 0.98)', '#ffffff']}
          style={styles.bottomGradient}
        >
          {/* Continue Button */}
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <LinearGradient
              colors={[Colors.primary.teal, '#20A39E']}
              style={styles.continueButtonGradient}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Settings Note */}
          <Text style={styles.settingsNote}>
            You can change this later in settings
          </Text>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 24,
    paddingBottom: 25,
    alignItems: 'center',
    backgroundColor: 'rgba(45, 155, 142, 0.05)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: Typography.sizes.h2,
    fontWeight: '700',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 6,
  },
  titleHindi: {
    fontSize: Typography.sizes.body,
    fontWeight: '500',
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  languageListContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  listContent: {
    paddingBottom: 15,
  },
  languageItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  selectedLanguageItem: {
    borderColor: Colors.primary.teal,
    backgroundColor: '#F0FDFC',
    shadowColor: Colors.primary.teal,
    shadowOpacity: 0.12,
    elevation: 3,
    transform: [{ scale: 1.02 }],
  },
  languageContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagText: {
    fontSize: 22,
    marginRight: 12,
  },
  languageTextContainer: {
    flex: 1,
  },
  languageName: {
    fontSize: Typography.sizes.body,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 1,
  },
  selectedLanguageName: {
    color: Colors.primary.teal,
  },
  nativeLanguageName: {
    fontSize: Typography.sizes.caption,
    fontWeight: '400',
    color: Colors.text.secondary,
  },
  selectedNativeLanguageName: {
    color: Colors.primary.teal,
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary.teal,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  checkmarkText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  bottomSection: {
    backgroundColor: '#ffffff',
    paddingTop: 15,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  bottomGradient: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
  },
  continueButton: {
    width: '100%',
    marginBottom: 12,
    shadowColor: Colors.primary.teal,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  continueButtonGradient: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    fontSize: Typography.sizes.body,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
  settingsNote: {
    fontSize: Typography.sizes.caption,
    fontWeight: '400',
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: 8,
  },
});