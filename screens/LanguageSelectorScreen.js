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

const LanguageSelectorScreen = ({ onLanguageSelected }) => {
  const { t, i18n } = useTranslation();

  // Make the function async
  const changeLanguage = async (langCode) => {
    // await the language change
    await i18n.changeLanguage(langCode); 
    if (onLanguageSelected) {
      onLanguageSelected();
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{t('selectLanguage', 'Select Your Language')}</Text>
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

// ... styles remain the same
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