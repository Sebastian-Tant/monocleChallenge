// App.js

import React, { useState, useEffect } from 'react';
import { StatusBar, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingScreen from './screens/WelcomeScreen'; // or rename the file
import GoalSettingScreen from './screens/GoalSettingScreen';
import HomeScreen from './screens/HomeScreen';
import LearnScreen from './screens/LearnScreen';
import SimulateScreen from './screens/SimulateScreen';
import ProfileScreen from './screens/ProfileScreen';
import LessonDetailScreen from './screens/LessonDetailScreen';
import LanguageSelectorScreen from './screens/LanguageSelectorScreen';
import BottomNavigation from './components/BottomNavigation';
import CompoundInterestSlider from './components/CompoundInterestSlider';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import './src/locales/i18n';

// In your App.js, replace the existing GoogleSignin.configure with:
GoogleSignin.configure({
  webClientId: '665585255864-914vki4vakoqgkugmromgsicqo74vaua.apps.googleusercontent.com',
  offlineAccess: true,
  hostedDomain: '',
  forceCodeForRefreshToken: true,
  accountName: '',
  iosClientId: '', // Add this even if empty for Android
  googleServicePlistPath: '', // Add this even if empty for Android
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

  // Update userName when user data is available
  useEffect(() => {
    if (user) {
      setUserName(user.displayName?.split(' ')[0] || 'Friend');
    } else {
      // Reset to welcome screen if user signs out
      setCurrentScreen('welcome');
      setUserName('');
      setSelectedGoal(null);
      setGoalAmount('');
      setHasSelectedLanguage(false);
    }
  }, [user]);

  const handleGetStarted = () => {
    if (user) {
      // Check if user has already selected a language
      if (!hasSelectedLanguage) {
        setCurrentScreen('languageSelector');
      } else {
        setCurrentScreen('goalSetting');
      }
    }
    // If no user, the WelcomeScreen will handle the sign-in flow
  };

  const handleLanguageSelected = () => {
    setHasSelectedLanguage(true);
    setCurrentScreen('goalSetting');
  };

  const handleGoalComplete = (goal, amount) => {
    setSelectedGoal(goal);
    setGoalAmount(amount);
    // Navigate to main app (home screen) after goal is set
    setCurrentScreen('mainApp');
    setActiveTab('home');
    console.log('Goal set:', goal, 'Amount:', amount);
  };

  const handleTabPress = tabId => {
    setActiveTab(tabId);
  };

  const handleStartLesson = (lessonId) => {
    setCurrentLesson(lessonId);
    setCurrentScreen('lessonDetail');
  };

  const handleCompleteLesson = () => {
    console.log('Lesson completed:', currentLesson);
    setCurrentLesson(null);
    setCurrentScreen('mainApp');
    setActiveTab('learn');
  };

  const handleBackFromLesson = () => {
    setCurrentLesson(null);
    setCurrentScreen('mainApp');
    setActiveTab('learn');
  };

  // Sample data for the home screen - in a real app this would come from your state management/API
  const homeScreenProps = {
    userName: userName,
    goalName:
      selectedGoal?.title
        ?.replace('Save for a ', '')
        ?.replace('Build an ', '')
        ?.replace('Start My ', '')
        ?.replace('Create a Custom Goal...', 'Custom Goal') || 'Car Fund',
    currentAmount: 5450, // This would be dynamic based on user's progress
    goalAmount: parseInt(goalAmount?.replace(/[^\d]/g, '')) || 80000,
    simulatedNetWorth: 15200, // This would come from your simulation engine
    sparklineData: [12800, 13200, 13800, 14100, 14600, 15000, 15200], // Last 7 days of simulation data
    // You could add more props here for lesson progress, next steps, etc.
  };

  const renderMainAppContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen
            {...homeScreenProps}
            onContinueLesson={() => {
              console.log('Continue lesson tapped');
              handleStartLesson('The Magic of Compounding');
            }}
            onViewSimulation={() => {
              console.log('View simulation tapped');
              setActiveTab('simulate');
            }}
          />
        );
      case 'learn':
        return <LearnScreen onStartLesson={handleStartLesson} />;
      case 'simulate':
        return <SimulateScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return (
          <HomeScreen
            {...homeScreenProps}
            onContinueLesson={() => {
              console.log('Continue lesson tapped');
              handleStartLesson('The Magic of Compounding');
            }}
            onViewSimulation={() => {
              console.log('View simulation tapped');
              setActiveTab('simulate');
            }}
          />
        );
    }
  };

  if (loading) {
    return (
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {/* You can create a custom loading screen component here */}
        </View>
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
        <View style={{ flex: 1 }}>
          {renderMainAppContent()}
          <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
        </View>
      )}
    </SafeAreaProvider>
  );
};

// Root App Component with AuthProvider
const App = () => {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
};

export default App;