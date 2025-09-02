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
  Modal,
  TextInput,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const HomeScreen = ({
  userName = 'Alex',
  goalName = 'Car Fund',
  currentAmount = 5450,        // incoming prop (not shown initially; we start from 0)
  goalAmount = 80000,
  simulatedNetWorth = 15200,
  sparklineData = [12800, 13200, 13800, 14100, 14600, 15000, 15200],
  onContinueLesson,
  onViewSimulation,
  onMakeContribution,          // optional callback(amountNumber)
}) => {
  const insets = useSafeAreaInsets();

  // Greeting
  const [greeting, setGreeting] = useState('');

  // --- Contribution UI state (always start display at 0) ---
  const [displayContribution, setDisplayContribution] = useState(0); // what we show
  const amountAnim = useRef(new Animated.Value(0)).current;          // animates number shown
  const progressAnim = useRef(new Animated.Value(0)).current;        // animates 0..1
  const [animatedContribution, setAnimatedContribution] = useState(0);

  // --- Animations (intro, net worth) ---
  const fadeInAnimation = useRef(new Animated.Value(0)).current;
  const slideUpAnimation = useRef(new Animated.Value(30)).current;
  const netWorthAnimation = useRef(new Animated.Value(0)).current;
  const [animatedNetWorth, setAnimatedNetWorth] = useState(0);

  // --- Contribution sheet state ---
  const [showSheet, setShowSheet] = useState(false);
  const [contribInput, setContribInput] = useState(''); // digits only

  const sanitizeDigits = (s) => (s || '').replace(/[^\d]/g, '');
  const setInputSafe = (s) => setContribInput(sanitizeDigits(s));

  const QUICK_PICKS = ['100', '200', '500', '1000'];

  // Greeting + intro anims
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    Animated.parallel([
      Animated.timing(fadeInAnimation, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideUpAnimation, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();

    // Animate net worth counter
    setTimeout(() => {
      Animated.timing(netWorthAnimation, {
        toValue: simulatedNetWorth,
        duration: 2000,
        useNativeDriver: false,
      }).start();
    }, 500);

    const listenerNW = netWorthAnimation.addListener(({ value }) => {
      setAnimatedNetWorth(Math.floor(value));
    });

    const listenerAmt = amountAnim.addListener(({ value }) => {
      setAnimatedContribution(Math.floor(value));
    });

    return () => {
      netWorthAnimation.removeListener(listenerNW);
      amountAnim.removeListener(listenerAmt);
    };
  }, []);

  // Whenever displayContribution changes, animate number & progress
  useEffect(() => {
    Animated.timing(amountAnim, {
      toValue: displayContribution,
      duration: 800,
      useNativeDriver: false,
    }).start();

    const target = goalAmount > 0 ? displayContribution / goalAmount : 0;
    Animated.timing(progressAnim, {
      toValue: target,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [displayContribution, goalAmount]);

  const formatCurrency = (amount) => `R ${Number(amount).toLocaleString()}`;

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  const progressPercentLabel = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100],
  });

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
                  backgroundColor: index === sparklineData.length - 1 ? '#10b981' : '#6ee7b7',
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  // --- Contribution sheet actions ---
  const openContributionSheet = () => {
    setContribInput('');
    setShowSheet(true);
  };

  const closeContributionSheet = () => {
    setShowSheet(false);
  };

  const confirmContribution = () => {
    const amt = parseInt(contribInput || '0', 10);
    if (!amt || amt <= 0) {
      closeContributionSheet();
      return;
    }
    const newTotal = displayContribution + amt;
    setDisplayContribution(newTotal); // triggers animations
    closeContributionSheet();
    if (typeof onMakeContribution === 'function') onMakeContribution(amt);
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
            { opacity: fadeInAnimation, transform: [{ translateY: slideUpAnimation }] },
          ]}
        >
          <Text style={styles.greeting}>
            {greeting}, {userName}!
          </Text>
        </Animated.View>

        {/* Main Goal Widget (tap to contribute) */}
        <Animated.View
          style={[
            styles.goalWidget,
            { opacity: fadeInAnimation, transform: [{ translateY: slideUpAnimation }] },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={openContributionSheet}
            style={{ borderRadius: 24, overflow: 'hidden' }}
          >
            <LinearGradient
              colors={['#f8fafc', '#ffffff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ borderRadius: 24, padding: 24 }}
            >
              <View style={styles.goalHeader}>
                <Text style={styles.goalTitle}>My {goalName}</Text>
                <Text style={styles.goalAmount}>
                  {formatCurrency(animatedContribution)} / {formatCurrency(goalAmount)}
                </Text>
              </View>

              <View style={styles.progressContainer}>
                <View style={styles.progressTrack}>
                  <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
                </View>
                <View style={styles.progressRow}>
                  <Animated.Text style={styles.progressText}>
                    {progressPercentLabel.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0', '100'],
                    })}
                    % complete
                  </Animated.Text>
                  <Text style={styles.tapHint}>Tap to contribute</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Next Step Widget */}
        <Animated.View
          style={[
            styles.nextStepWidget,
            { opacity: fadeInAnimation, transform: [{ translateY: slideUpAnimation }] },
          ]}
        >
          <View style={styles.nextStepHeader}>
            <Text style={styles.nextStepTitle}>Your Next Step</Text>
            <Text style={styles.nextStepEmoji}>🎯</Text>
          </View>
          <TouchableOpacity style={styles.nextStepAction} activeOpacity={0.8} onPress={onContinueLesson}>
            <Text style={styles.nextStepActionTitle}>Continue Lesson</Text>
            <Text style={styles.nextStepActionSubtitle}>The Power of Compounding</Text>
            <View style={styles.nextStepArrow}>
              <Text style={styles.arrowText}>→</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Simulation Snapshot Widget */}
        <Animated.View
          style={[
            styles.simulationWidget,
            { opacity: fadeInAnimation, transform: [{ translateY: slideUpAnimation }] },
          ]}
        >
          <TouchableOpacity style={styles.simulationHeader} onPress={onViewSimulation} activeOpacity={0.8}>
            <View>
              <Text style={styles.simulationTitle}>Simulated Net Worth</Text>
              <Text style={styles.simulationAmount}>{formatCurrency(animatedNetWorth)}</Text>
            </View>
            {renderSparkline()}
          </TouchableOpacity>
          <Text style={styles.simulationSubtext}>Last 7 days of simulation</Text>
        </Animated.View>

        {/* Daily Bite Feed */}
        <Animated.View
          style={[
            styles.dailyBiteSection,
            { opacity: fadeInAnimation, transform: [{ translateY: slideUpAnimation }] },
          ]}
        >
          <Text style={styles.dailyBiteTitle}>Daily Bite</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dailyBiteContainer}>
            <View style={styles.dailyBiteCard}>
              <View style={styles.dailyBiteHeader}>
                <Text style={styles.dailyBiteDate}>Today's Tip</Text>
                <Text style={styles.dailyBiteEmoji}>💡</Text>
              </View>
              <Text style={styles.dailyBiteText}>
                Paying an extra R200 a month on a R10,000 personal loan could save you over R1,500 in interest and get you
                debt-free 8 months sooner!
              </Text>
            </View>

            <View style={styles.dailyBiteCard}>
              <View style={styles.dailyBiteHeader}>
                <Text style={styles.dailyBiteDate}>Term of the Day</Text>
                <Text style={styles.dailyBiteEmoji}>📚</Text>
              </View>
              <Text style={styles.dailyBiteText}>
                <Text style={styles.termHighlight}>What is an ETF?</Text> Think of it as a 'basket' of many different stocks
                that you can buy as one.
              </Text>
            </View>

            <View style={styles.dailyBiteCard}>
              <View style={styles.dailyBiteHeader}>
                <Text style={styles.dailyBiteDate}>Quick Fact</Text>
                <Text style={styles.dailyBiteEmoji}>⚡</Text>
              </View>
              <Text style={styles.dailyBiteText}>
                Starting to invest at age 25 instead of 35 could result in having 3x more money by retirement, thanks to
                compound interest!
              </Text>
            </View>
          </ScrollView>
        </Animated.View>
      </ScrollView>

      {/* Contribution Bottom Sheet */}
      <Modal visible={showSheet} animationType="fade" transparent onRequestClose={closeContributionSheet}>
        <Pressable style={styles.sheetBackdrop} onPress={closeContributionSheet}>
          <Pressable style={[styles.sheetContainer, { paddingBottom: insets.bottom + 16 }]} onPress={() => {}}>
            <View style={styles.sheetHandle} />

            <Text style={styles.sheetTitle}>Add a contribution</Text>
            <Text style={styles.sheetSubtitle}>Boost your {goalName.toLowerCase()} today</Text>

            <View style={styles.chipsRow}>
              {QUICK_PICKS.map((v) => (
                <TouchableOpacity
                  key={v}
                  style={styles.chip}
                  onPress={() => setInputSafe(v)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.chipText}>{`R ${Number(v).toLocaleString()}`}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.inputRow}>
              <Text style={styles.inputCurrency}>R</Text>
              <TextInput
                style={styles.inputField}
                value={contribInput}
                onChangeText={setInputSafe}
                placeholder="0"
                keyboardType="number-pad"
                returnKeyType="done"
              />
            </View>

            <TouchableOpacity
              style={[styles.sheetCta, (!contribInput || parseInt(contribInput || '0', 10) <= 0) && styles.sheetCtaDisabled]}
              activeOpacity={0.9}
              disabled={!contribInput || parseInt(contribInput || '0', 10) <= 0}
              onPress={confirmContribution}
            >
              <LinearGradient
                colors={contribInput ? ['#22c55e', '#16a34a'] : ['#cbd5e1', '#94a3b8']}
                style={styles.sheetCtaGrad}
              >
                <Text style={styles.sheetCtaText}>
                  {contribInput ? `Contribute R ${Number(contribInput).toLocaleString()}` : 'Enter an amount'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 120 },

  header: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16 },
  greeting: { fontSize: 30, fontWeight: '800', color: '#0f172a', letterSpacing: 0.3 },

  goalWidget: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 24,
    padding: 0,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  goalHeader: { marginBottom: 20 },
  goalTitle: { fontSize: 18, fontWeight: '600', color: '#334155', marginBottom: 6 },
  goalAmount: { fontSize: 26, fontWeight: '800', color: '#0f172a' },

  progressContainer: { alignItems: 'center' },
  progressTrack: {
    width: '100%',
    height: 14,
    backgroundColor: '#e2e8f0',
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: { height: '100%', backgroundColor: '#22c55e', borderRadius: 999 },
  progressRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  progressText: { fontSize: 13, fontWeight: '600', color: '#64748b' },
  tapHint: { fontSize: 12, color: '#4f46e5', fontWeight: '700' },

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
  nextStepTitle: { fontSize: 17, fontWeight: '600', color: '#334155' },
  nextStepEmoji: { fontSize: 26 },
  nextStepAction: { position: 'relative', backgroundColor: '#eef2ff', borderRadius: 16, padding: 16 },
  nextStepActionTitle: { fontSize: 18, fontWeight: '700', color: '#4f46e5', marginBottom: 4 },
  nextStepActionSubtitle: { fontSize: 14, color: '#475569', lineHeight: 20 },
  nextStepArrow: { position: 'absolute', right: 16, top: '50%', transform: [{ translateY: -12 }] },
  arrowText: { fontSize: 24, color: '#4f46e5', fontWeight: '800' },

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
  simulationTitle: { fontSize: 15, fontWeight: '600', color: '#475569', marginBottom: 4 },
  simulationAmount: { fontSize: 22, fontWeight: '800', color: '#16a34a' },
  simulationSubtext: { fontSize: 12, color: '#94a3b8' },
  sparklineContainer: { flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
  sparklineBar: { width: 3, borderRadius: 999 },

  dailyBiteSection: { marginTop: 8 },
  dailyBiteTitle: { fontSize: 20, fontWeight: '700', color: '#0f172a', marginBottom: 16, paddingHorizontal: 20 },
  dailyBiteContainer: { paddingLeft: 20, paddingRight: 20 },
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
  dailyBiteEmoji: { fontSize: 18 },
  dailyBiteText: { fontSize: 15, color: '#334155', lineHeight: 21 },
  termHighlight: { fontWeight: '700', color: '#0f172a' },

  // Bottom sheet
  sheetBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 48,
    height: 5,
    borderRadius: 999,
    backgroundColor: '#cbd5e1',
    marginBottom: 10,
  },
  sheetTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  sheetSubtitle: { fontSize: 13, color: '#64748b', marginTop: 2, marginBottom: 12 },

  chipsRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  chip: {
    backgroundColor: '#eef2ff',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipText: { color: '#4f46e5', fontWeight: '700' },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: Platform.select({ ios: 12, android: 4 }),
    marginBottom: 16,
    backgroundColor: '#f8fafc',
  },
  inputCurrency: { fontSize: 18, fontWeight: '800', color: '#334155', marginRight: 6 },
  inputField: { flex: 1, fontSize: 18, fontWeight: '700', color: '#0f172a' },

  sheetCta: { borderRadius: 14, overflow: 'hidden' },
  sheetCtaDisabled: { opacity: 0.6 },
  sheetCtaGrad: { paddingVertical: 14, alignItems: 'center' },
  sheetCtaText: { color: 'white', fontSize: 16, fontWeight: '800' },
});

export default HomeScreen;
