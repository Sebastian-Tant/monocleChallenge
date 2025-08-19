// screens/HomeScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const HomeScreen = ({ 
  userName = "Alex", 
  goalName = "Car Fund",
  currentAmount = 5450,
  goalAmount = 80000,
  simulatedNetWorth = 15200,
  sparklineData = [12800, 13200, 13800, 14100, 14600, 15000, 15200],
  onContinueLesson,
  onViewSimulation
}) => {
  const insets = useSafeAreaInsets();
  const [greeting, setGreeting] = useState('');
  const [animatedNetWorth, setAnimatedNetWorth] = useState(0);
  
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const netWorthAnimation = useRef(new Animated.Value(0)).current;
  const fadeInAnimation = useRef(new Animated.Value(0)).current;
  const slideUpAnimation = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Set greeting based on time
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    // Start animations
    const progressValue = currentAmount / goalAmount;
    
    Animated.parallel([
      Animated.timing(fadeInAnimation, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnimation, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnimation, {
        toValue: progressValue,
        duration: 1500,
        useNativeDriver: false,
      }),
    ]).start();

    // Animate net worth counter
    setTimeout(() => {
      Animated.timing(netWorthAnimation, {
        toValue: simulatedNetWorth,
        duration: 2000,
        useNativeDriver: false,
      }).start();
    }, 500);

    // Listen to net worth animation changes
    const listener = netWorthAnimation.addListener(({ value }) => {
      setAnimatedNetWorth(Math.floor(value));
    });

    return () => {
      netWorthAnimation.removeListener(listener);
    };
  }, []);

  const progressPercentage = (currentAmount / goalAmount) * 100;
  const progressWidth = progressAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', `${progressPercentage}%`],
    extrapolate: 'clamp',
  });

  const formatCurrency = (amount) => {
    return `R ${amount.toLocaleString()}`;
  };

  const renderSparkline = () => {
    const maxValue = Math.max(...sparklineData);
    const minValue = Math.min(...sparklineData);
    const range = maxValue - minValue;
    
    return (
      <View style={styles.sparklineContainer}>
        {sparklineData.map((value, index) => {
          const height = range > 0 ? ((value - minValue) / range) * 20 + 5 : 15;
          return (
            <View
              key={index}
              style={[
                styles.sparklineBar,
                { 
                  height,
                  backgroundColor: index === sparklineData.length - 1 ? '#10b981' : '#6ee7b7'
                }
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeInAnimation,
              transform: [{ translateY: slideUpAnimation }],
            },
          ]}
        >
          <Text style={styles.greeting}>{greeting}, {userName}!</Text>
        </Animated.View>

        {/* Main Goal Widget */}
        <Animated.View 
          style={[
            styles.goalWidget,
            {
              opacity: fadeInAnimation,
              transform: [{ translateY: slideUpAnimation }],
            },
          ]}
        >
          <View style={styles.goalHeader}>
            <Text style={styles.goalTitle}>My {goalName}</Text>
            <Text style={styles.goalAmount}>
              {formatCurrency(currentAmount)} / {formatCurrency(goalAmount)}
            </Text>
          </View>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <Animated.View 
                style={[
                  styles.progressFill,
                  { width: progressWidth }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {Math.round(progressPercentage)}% complete
            </Text>
          </View>
        </Animated.View>

        {/* Next Step Widget */}
        <Animated.View 
          style={[
            styles.nextStepWidget,
            {
              opacity: fadeInAnimation,
              transform: [{ translateY: slideUpAnimation }],
            },
          ]}
        >
          <View style={styles.nextStepHeader}>
            <Text style={styles.nextStepTitle}>Your Next Step</Text>
            <Text style={styles.nextStepEmoji}>🎯</Text>
          </View>
          <TouchableOpacity 
            style={styles.nextStepAction} 
            activeOpacity={0.8}
            onPress={onContinueLesson}
          >
            <Text style={styles.nextStepActionTitle}>Continue Lesson</Text>
            <Text style={styles.nextStepActionSubtitle}>
              The Power of Compounding
            </Text>
            <View style={styles.nextStepArrow}>
              <Text style={styles.arrowText}>→</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Simulation Snapshot Widget */}
        <Animated.View 
          style={[
            styles.simulationWidget,
            {
              opacity: fadeInAnimation,
              transform: [{ translateY: slideUpAnimation }],
            },
          ]}
        >
          <TouchableOpacity 
            style={styles.simulationHeader}
            onPress={onViewSimulation}
            activeOpacity={0.8}
          >
            <View>
              <Text style={styles.simulationTitle}>Simulated Net Worth</Text>
              <Text style={styles.simulationAmount}>
                {formatCurrency(animatedNetWorth)}
              </Text>
            </View>
            {renderSparkline()}
          </TouchableOpacity>
          <Text style={styles.simulationSubtext}>
            Last 7 days of simulation
          </Text>
        </Animated.View>

        {/* Daily Bite Feed */}
        <Animated.View 
          style={[
            styles.dailyBiteSection,
            {
              opacity: fadeInAnimation,
              transform: [{ translateY: slideUpAnimation }],
            },
          ]}
        >
          <Text style={styles.dailyBiteTitle}>Daily Bite</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dailyBiteContainer}
          >
            <View style={styles.dailyBiteCard}>
              <View style={styles.dailyBiteHeader}>
                <Text style={styles.dailyBiteDate}>Today's Tip</Text>
                <Text style={styles.dailyBiteEmoji}>💡</Text>
              </View>
              <Text style={styles.dailyBiteText}>
                Paying an extra R200 a month on a R10,000 personal loan could save you over R1,500 in interest and get you debt-free 8 months sooner!
              </Text>
            </View>
            
            <View style={styles.dailyBiteCard}>
              <View style={styles.dailyBiteHeader}>
                <Text style={styles.dailyBiteDate}>Term of the Day</Text>
                <Text style={styles.dailyBiteEmoji}>📚</Text>
              </View>
              <Text style={styles.dailyBiteText}>
                <Text style={styles.termHighlight}>What is an ETF?</Text> Think of it as a 'basket' of many different stocks that you can buy as one.
              </Text>
            </View>
            
            <View style={styles.dailyBiteCard}>
              <View style={styles.dailyBiteHeader}>
                <Text style={styles.dailyBiteDate}>Quick Fact</Text>
                <Text style={styles.dailyBiteEmoji}>⚡</Text>
              </View>
              <Text style={styles.dailyBiteText}>
                Starting to invest at age 25 instead of 35 could result in having 3x more money by retirement, thanks to compound interest!
              </Text>
            </View>
          </ScrollView>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9', // softer slate bg
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 30,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: 0.3,
  },
  goalWidget: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  goalHeader: {
    marginBottom: 20,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  goalAmount: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressTrack: {
    width: '100%',
    height: 14,
    backgroundColor: '#e2e8f0',
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#22c55e',
    borderRadius: 999,
  },
  progressText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  nextStepWidget: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 24,
    padding: 24,
    borderLeftWidth: 5,
    borderLeftColor: '#6366f1',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },
  nextStepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  nextStepTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#334155',
  },
  nextStepEmoji: {
    fontSize: 26,
  },
  nextStepAction: {
    position: 'relative',
    backgroundColor: '#eef2ff',
    borderRadius: 16,
    padding: 16,
  },
  nextStepActionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4f46e5',
    marginBottom: 4,
  },
  nextStepActionSubtitle: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  nextStepArrow: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  arrowText: {
    fontSize: 24,
    color: '#4f46e5',
    fontWeight: '800',
  },
  simulationWidget: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  simulationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  simulationTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 4,
  },
  simulationAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: '#16a34a',
  },
  simulationSubtext: {
    fontSize: 12,
    color: '#94a3b8',
  },
  sparklineContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  sparklineBar: {
    width: 3,
    borderRadius: 999,
  },
  dailyBiteSection: {
    marginTop: 8,
  },
  dailyBiteTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  dailyBiteContainer: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  dailyBiteCard: {
    backgroundColor: 'white',
    width: width * 0.78,
    borderRadius: 20,
    padding: 20,
    marginRight: 14,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  dailyBiteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dailyBiteDate: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4f46e5',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dailyBiteEmoji: {
    fontSize: 18,
  },
  dailyBiteText: {
    fontSize: 15,
    color: '#334155',
    lineHeight: 21,
  },
  termHighlight: {
    fontWeight: '700',
    color: '#0f172a',
  },
});


export default HomeScreen;