// App.js

// 1. Import useTranslation to access the i18n instance
import React, { useState, useEffect } from 'react';
import { StatusBar, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingScreen from './screens/WelcomeScreen';
import GoalSettingScreen from './screens/GoalSettingScreen';
import HomeScreen from './screens/HomeScreen';
import LearnScreen from './screens/LearnScreen';
import SimulateScreen from './screens/SimulateScreen';
import ProfileScreen from './screens/ProfileScreen';
import LessonDetailScreen from './screens/LessonDetailScreen';
import LanguageSelectorScreen from './screens/LanguageSelectorScreen';
import BottomNavigation from './components/BottomNavigation';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useTranslation } from 'react-i18next'; // <-- 1. IMPORT THIS
import './src/locales/i18n';

GoogleSignin.configure({
  webClientId: '665585255864-914vki4vakoqgkugmromgsicqo74vaua.apps.googleusercontent.com',
  offlineAccess: true,
  hostedDomain: '',
  forceCodeForRefreshToken: true,
  accountName: '',
  iosClientId: '',
  googleServicePlistPath: '',
});

const MainApp = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const { user, loading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [activeTab, setActiveTab] = useState('home');
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [goalAmount, setGoalAmount] = useState('');
  const [userName, setUserName] = useState('');
  const [currentLesson, setCurrentLesson] = useState(null);
  const [hasSelectedLanguage, setHasSelectedLanguage] = useState(false);
  const [returnScreen, setReturnScreen] = useState(null);

  // 2. Add state and effect to listen for language changes
  const { i18n } = useTranslation();
  const [languageKey, setLanguageKey] = useState(0); // State to force re-renders

  useEffect(() => {
    // This function will run when the language is changed anywhere in the app
    const onLanguageChanged = () => {
      setLanguageKey(prev => prev + 1); // Increment the key to trigger a re-render
    };

    // Subscribe to the 'languageChanged' event
    i18n.on('languageChanged', onLanguageChanged);

    // IMPORTANT: Unsubscribe when the component unmounts to prevent memory leaks
    return () => {
      i18n.off('languageChanged', onLanguageChanged);
    };
  }, [i18n]);

  useEffect(() => {
    if (user) {
      setUserName(user.displayName?.split(' ')[0] || 'Friend');
    } else {
      setCurrentScreen('welcome');
      setUserName('');
      setSelectedGoal(null);
      setGoalAmount('');
      setHasSelectedLanguage(false);
    }
  }, [user]);

  const handleGetStarted = () => {
    if (user) {
      setReturnScreen('goalSetting');
      setCurrentScreen('languageSelector');
    }
  };

  const handleLanguageSelected = () => {
    setHasSelectedLanguage(true);
    setCurrentScreen(returnScreen || 'goalSetting');
  };

  const handleNavigateToChangeLanguage = () => {
    setReturnScreen('mainApp');
    setActiveTab('profile');
    setCurrentScreen('languageSelector');
  };

  const handleGoalComplete = (goal, amount) => {
    setSelectedGoal(goal);
    setGoalAmount(amount);
    setCurrentScreen('mainApp');
    setActiveTab('home');
  };

  const handleTabPress = tabId => {
    setActiveTab(tabId);
  };

  const handleStartLesson = lessonId => {
    setCurrentLesson(lessonId);
    setCurrentScreen('lessonDetail');
  };

  const handleCompleteLesson = () => {
    setCurrentLesson(null);
    setCurrentScreen('mainApp');
    setActiveTab('learn');
  };

  const handleBackFromLesson = () => {
    setCurrentLesson(null);
    setCurrentScreen('mainApp');
    setActiveTab('learn');
  };

  const homeScreenProps = {
    userName: userName,
    goalName:
      selectedGoal?.title
        ?.replace('Save for a ', '')
        ?.replace('Build an ', '')
        ?.replace('Start My ', '')
        ?.replace('Create a Custom Goal...', 'Custom Goal') || 'Car Fund',
    currentAmount: 5450,
    goalAmount: parseInt(goalAmount?.replace(/[^\d]/g, '')) || 80000,
    simulatedNetWorth: 15200,
    sparklineData: [12800, 13200, 13800, 14100, 14600, 15000, 15200],
  };

  const renderMainAppContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen
            {...homeScreenProps}
            onContinueLesson={() => handleStartLesson('The Magic of Compounding')}
            onViewSimulation={() => setActiveTab('simulate')}
          />
        );
      case 'learn':
        return <LearnScreen onStartLesson={handleStartLesson} />;
      case 'simulate':
        return <SimulateScreen />;
      case 'profile':
        return <ProfileScreen onChangeLanguage={handleNavigateToChangeLanguage} />;
      default:
        return (
          <HomeScreen
            {...homeScreenProps}
            onContinueLesson={() => handleStartLesson('The Magic of Compounding')}
            onViewSimulation={() => setActiveTab('simulate')}
          />
        );
    }
  };

  if (loading) {
    return (
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}></View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {currentScreen === 'welcome' && (
        <LandingScreen onGetStarted={handleGetStarted} />
      )}

      {currentScreen === 'languageSelector' && user && (
        <LanguageSelectorScreen onLanguageSelected={handleLanguageSelected} />
      )}

      {currentScreen === 'goalSetting' && user && (
        <GoalSettingScreen onGoalComplete={handleGoalComplete} />
      )}

      {currentScreen === 'lessonDetail' && user && (
        <LessonDetailScreen
          key={currentLesson || 'none'}
          lessonTitle={'The Magic of Compounding'}
          route={{ params: { lessonId: currentLesson } }}
          onComplete={handleCompleteLesson}
          onBack={handleBackFromLesson}
        />
      )}

      {currentScreen === 'mainApp' && user && (
        // 3. Apply the languageKey to the main view
        // This ensures the entire content area is recreated when the language changes
        <View style={{ flex: 1 }} key={languageKey}>
          {renderMainAppContent()}
          <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
        </View>
      )}
    </SafeAreaProvider>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
};

export default App;