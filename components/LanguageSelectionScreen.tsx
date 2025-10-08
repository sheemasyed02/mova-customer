import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
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

const { width } = Dimensions.get('window');

interface Language {
  id: string;
  name: string;
  nativeName: string;
  flag: string;
  code: string;
}

const languages: Language[] = [
  { id: '1', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳', code: 'hi' },
  { id: '2', name: 'English', nativeName: 'English', flag: '🇮🇳', code: 'en' },
  { id: '3', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', code: 'ta' },
  { id: '4', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', code: 'te' },
  { id: '5', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', code: 'kn' },
  { id: '6', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', code: 'ml' },
  { id: '7', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', code: 'gu' },
  { id: '8', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', code: 'mr' },
  { id: '9', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳', code: 'bn' },
  { id: '10', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳', code: 'pa' },
  { id: '11', name: 'Urdu', nativeName: 'اردو', flag: '🇮🇳', code: 'ur' },
  { id: '12', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳', code: 'or' },
  { id: '13', name: 'Assamese', nativeName: 'অসমীয়া', flag: '🇮🇳', code: 'as' },
  { id: '14', name: 'Sanskrit', nativeName: 'संस्कृतम्', flag: '🇮🇳', code: 'sa' },
  { id: '15', name: 'Nepali', nativeName: 'नेपाली', flag: '🇮🇳', code: 'ne' },
];

export default function LanguageSelectionScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0]);
  const [animatedValue] = useState(new Animated.Value(0));
  const [cardAnimations] = useState(
    languages.map(() => new Animated.Value(1))
  );

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLanguageSelect = (language: Language, index: number) => {
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Card animation
    Animated.sequence([
      Animated.timing(cardAnimations[index], {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(cardAnimations[index], {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    setSelectedLanguage(language);
  };

  const handleContinue = () => {
    // Success haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/login' as any);
  };

  const renderLanguageItem = ({ item, index }: { item: Language; index: number }) => {
    const isSelected = selectedLanguage.id === item.id;
    
    return (
      <Animated.View
        style={[
          {
            opacity: animatedValue,
            transform: [
              {
                translateY: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20 + (index * 5), 0],
                }),
              },
            ],
          },
        ]}
      >
        {isSelected ? (
          <TouchableOpacity
            style={styles.selectedLanguageButton}
            onPress={() => handleLanguageSelect(item, index)}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={[Colors.primary.teal, '#20A39E']}
              style={styles.selectedLanguageGradient}
            >
              <Text style={styles.selectedLanguageText}>{item.name}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.languageOption}
            onPress={() => handleLanguageSelect(item, index)}
            activeOpacity={0.7}
          >
            <Text style={styles.languageOptionText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
      
      {/* Background Decorative Dots */}
      <View style={styles.decorativeDots}>
        <View style={[styles.dot, styles.dot1]} />
        <View style={[styles.dot, styles.dot2]} />
        <View style={[styles.dot, styles.dot3]} />
        <View style={[styles.dot, styles.dot4]} />
      </View>

      {/* Main Content Card */}
      <Animated.View style={[styles.contentCard, {
        opacity: animatedValue,
        transform: [{
          translateY: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0],
          })
        }]
      }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Select a preferred language</Text>
        </View>

        {/* Language List */}
        <View style={styles.languageListContainer}>
          <FlatList
            data={languages}
            renderItem={renderLanguageItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>

        {/* Continue Button */}
        <Animated.View style={[styles.bottomSection, {
          opacity: animatedValue,
        }]}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[Colors.primary.teal, '#20A39E']}
              style={styles.continueButtonGradient}
            >
              <Ionicons name="arrow-forward" size={20} color="#ffffff" />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: 20,
    justifyContent: 'center',
  },
  decorativeDots: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  dot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dot1: {
    backgroundColor: Colors.primary.teal,
    top: '15%',
    left: '10%',
  },
  dot2: {
    backgroundColor: '#FF9500',
    top: '8%',
    right: '15%',
  },
  dot3: {
    backgroundColor: Colors.primary.teal,
    bottom: '25%',
    left: '8%',
  },
  dot4: {
    backgroundColor: '#FF9500',
    bottom: '10%',
    right: '12%',
  },
  contentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    maxHeight: '85%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    textAlign: 'center',
    lineHeight: 24,
  },
  languageListContainer: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 10,
  },
  separator: {
    height: 8,
  },
  selectedLanguageButton: {
    marginVertical: 4,
    shadowColor: Colors.primary.teal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedLanguageGradient: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedLanguageText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  languageOption: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  languageOptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  bottomSection: {
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 20,
  },
  continueButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    shadowColor: Colors.primary.teal,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  continueButtonGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});