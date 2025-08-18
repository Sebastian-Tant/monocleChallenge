// screens/LanguageSelectorScreen.js

import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'af', name: 'Afrikaans' },
  { code: 'zu', name: 'isiZulu' },
  { code: 'xh', name: 'isiXhosa' },
  { code: 'nr', name: 'isiNdebele' },
  { code: 'nso', name: 'Sepedi' },
  { code: 'st', name: 'Sesotho' },
  { code: 'tn', name: 'Setswana' },
  { code: 'ss', name: 'siSwati' },
  { code: 've', name: 'Tshivenda' },
  { code: 'ts', name: 'Xitsonga' },
];

// 1. Accept `onLanguageSelected` as a prop
const LanguageSelectorScreen = ({ onLanguageSelected }) => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    // 2. Call the function to notify App.js to navigate away
    if (onLanguageSelected) {
      onLanguageSelected();
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{t('selectLanguage')}</Text>
      <View style={styles.buttonContainer}>
        {languages.map((lang) => (
          <View key={lang.code} style={styles.buttonWrapper}>
            <Button
              title={lang.name}
              onPress={() => changeLanguage(lang.code)}
              color="#007AFF"
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
  },
  buttonWrapper: {
    marginVertical: 8,
  },
});

export default LanguageSelectorScreen;