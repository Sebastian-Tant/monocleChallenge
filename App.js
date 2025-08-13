// App.js
import React, { useState } from 'react';
import { StatusBar, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import WelcomeScreen from './screens/WelcomeScreen';
import GoalSettingScreen from './screens/GoalSettingScreen';
import HomeScreen from './screens/HomeScreen';
import LearnScreen from './screens/LearnScreen';
import SimulateScreen from './screens/SimulateScreen';
import ProfileScreen from './screens/ProfileScreen';
import LessonDetailScreen from './screens/LessonDetailScreen';
import BottomNavigation from './components/BottomNavigation';
import CompoundInterestSlider from './components/CompoundInterestSlider';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [activeTab, setActiveTab] = useState('home');
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [goalAmount, setGoalAmount] = useState('');
  const [userName, setUserName] = useState('Alex'); // This could come from user input later
  const [currentLesson, setCurrentLesson] = useState(null);

  const handleGetStarted = () => {
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

  const handleStartLesson = lessonTitle => {
    setCurrentLesson(lessonTitle);
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
        return <HomeScreen {...homeScreenProps} />;
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {currentScreen === 'welcome' && (
        <WelcomeScreen onGetStarted={handleGetStarted} />
      )}

      {currentScreen === 'goalSetting' && (
        <GoalSettingScreen onGoalComplete={handleGoalComplete} />
      )}

      {currentScreen === 'lessonDetail' && (
        <LessonDetailScreen
          lessonTitle={currentLesson}
          onComplete={handleCompleteLesson}
          onBack={handleBackFromLesson}
        />
      )}

      {currentScreen === 'mainApp' && (
        <View style={{ flex: 1 }}>
          {renderMainAppContent()}
          <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
        </View>
      )}
    </SafeAreaProvider>
  );
}

export default App;
