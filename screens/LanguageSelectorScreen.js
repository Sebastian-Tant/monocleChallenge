// screens/LanguageSelectorScreen.js

import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Animated,
  Dimensions,
  SafeAreaView 
} from 'react-native';
import { useTranslation } from 'react-i18next';

const { width, height } = Dimensions.get('window');

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'af', name: 'Afrikaans', flag: '🇿🇦' },
  { code: 'zu', name: 'isiZulu', flag: '🇿🇦' },
  { code: 'xh', name: 'isiXhosa', flag: '🇿🇦' },
  { code: 'nr', name: 'isiNdebele', flag: '🇿🇦' },
  { code: 'nso', name: 'Sepedi', flag: '🇿🇦' },
  { code: 'st', name: 'Sesotho', flag: '🇿🇦' },
  { code: 'tn', name: 'Setswana', flag: '🇿🇦' },
  { code: 'ss', name: 'siSwati', flag: '🇿🇦' },
  { code: 've', name: 'Tshivenda', flag: '🇿🇦' },
  { code: 'ts', name: 'Xitsonga', flag: '🇿🇦' },
];

const LanguageSelectorScreen = ({ onLanguageSelected }) => {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  
  // Animation references
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  
  // Individual button animations
  const buttonAnims = useRef(
    languages.map(() => ({
      scale: new Animated.Value(1),
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(50),
    }))
  ).current;

  useEffect(() => {
    // Main entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Staggered button animations
    const buttonAnimations = buttonAnims.map((anim, index) => 
      Animated.parallel([
        Animated.timing(anim.opacity, {
          toValue: 1,
          duration: 600,
          delay: index * 100,
          useNativeDriver: true,
        }),
        Animated.timing(anim.translateY, {
          toValue: 0,
          duration: 600,
          delay: index * 100,
          useNativeDriver: true,
        }),
      ])
    );

    Animated.sequence([
      Animated.delay(300),
      Animated.stagger(50, buttonAnimations),
    ]).start();

    // Continuous rotation for background elements
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 30000,
        useNativeDriver: true,
      })
    );
    rotateAnimation.start();

    return () => {
      rotateAnimation.stop();
    };
  }, []);

  const changeLanguage = async (langCode) => {
    setSelectedLanguage(langCode);
    await i18n.changeLanguage(langCode); 
    if (onLanguageSelected) {
      onLanguageSelected();
    }
  };

  const animateButtonPress = (index, callback) => {
    const anim = buttonAnims[index];
    Animated.sequence([
      Animated.timing(anim.scale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(anim.scale, {
        toValue: 1.05,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(anim.scale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (callback) callback();
    });
  };

  const handleLanguagePress = (langCode, index) => {
    animateButtonPress(index, () => changeLanguage(langCode));
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Animated Background */}
      <View style={styles.backgroundContainer}>
        <Animated.View 
          style={[
            styles.backgroundCircle, 
            styles.circle1,
            { transform: [{ rotate: spin }] }
          ]} 
        />
        <Animated.View 
          style={[
            styles.backgroundCircle, 
            styles.circle2,
            { transform: [{ rotate: spin }] }
          ]} 
        />
        <Animated.View 
          style={[
            styles.backgroundCircle, 
            styles.circle3,
            { transform: [{ rotate: spin }] }
          ]} 
        />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          style={[
            styles.headerContainer,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ]
            }
          ]}
        >
          <View style={styles.iconContainer}>
            <Text style={styles.headerIcon}>🌍</Text>
          </View>
          <Text style={styles.title}>
            {t('selectLanguage', 'Select Your Language')}
          </Text>
          <Text style={styles.subtitle}>
            {t('languageSelector.subtitle', 'Choose your preferred language for learning')}
          </Text>
        </Animated.View>

        <View style={styles.languageGrid}>
          {languages.map((lang, index) => {
            const isSelected = selectedLanguage === lang.code;
            const buttonAnim = buttonAnims[index];
            
            return (
              <Animated.View
                key={lang.code}
                style={[
                  {
                    opacity: buttonAnim.opacity,
                    transform: [
                      { translateY: buttonAnim.translateY },
                      { scale: buttonAnim.scale }
                    ]
                  }
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.languageButton,
                    isSelected && styles.selectedButton
                  ]}
                  onPress={() => handleLanguagePress(lang.code, index)}
                  activeOpacity={0.8}
                >
                  <View style={styles.buttonContent}>
                    <View style={[
                      styles.flagContainer,
                      isSelected && styles.selectedFlagContainer
                    ]}>
                      <Text style={styles.flag}>{lang.flag}</Text>
                    </View>
                    <View style={styles.textContainer}>
                      <Text style={[
                        styles.languageName,
                        isSelected && styles.selectedLanguageName
                      ]}>
                        {lang.name}
                      </Text>
                      <Text style={[
                        styles.languageCode,
                        isSelected && styles.selectedLanguageCode
                      ]}>
                        {lang.code.toUpperCase()}
                      </Text>
                    </View>
                    {isSelected && (
                      <View style={styles.checkmarkContainer}>
                        <Text style={styles.checkmark}>✓</Text>
                      </View>
                    )}
                  </View>
                  
                  {/* Animated border for selected item */}
                  {isSelected && <View style={styles.selectedBorder} />}
                  
                  {/* Subtle glow effect */}
                  <View style={[
                    styles.buttonGlow,
                    isSelected && styles.selectedGlow
                  ]} />
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  backgroundContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  backgroundCircle: {
    position: 'absolute',
    borderRadius: 100,
    opacity: 0.08,
  },
  circle1: {
    width: 250,
    height: 250,
    backgroundColor: '#4CAF50',
    top: -80,
    right: -80,
  },
  circle2: {
    width: 180,
    height: 180,
    backgroundColor: '#2196F3',
    bottom: -50,
    left: -50,
  },
  circle3: {
    width: 120,
    height: 120,
    backgroundColor: '#FF9800',
    top: height * 0.3,
    left: width * 0.8,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#4CAF50',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  headerIcon: {
    fontSize: 36,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    fontWeight: '400',
  },
  languageGrid: {
    width: '100%',
  },
  languageButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  selectedButton: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderColor: '#4CAF50',
    borderWidth: 2,
    shadowColor: '#4CAF50',
    shadowOpacity: 0.2,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    zIndex: 2,
  },
  flagContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
  },
  selectedFlagContainer: {
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
    borderColor: '#4CAF50',
  },
  flag: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
  },
  languageName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  selectedLanguageName: {
    color: '#2E7D32',
  },
  languageCode: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    letterSpacing: 1,
  },
  selectedLanguageCode: {
    color: '#4CAF50',
  },
  checkmarkContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  buttonGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 15,
    backgroundColor: 'rgba(148, 163, 184, 0.02)',
  },
  selectedGlow: {
    backgroundColor: 'rgba(76, 175, 80, 0.05)',
  },
});

export default LanguageSelectorScreen;