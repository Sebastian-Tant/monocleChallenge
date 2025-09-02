// screens/GoalSettingScreen.js
import React, { useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Animated,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';

const GoalSettingScreen = ({ onGoalComplete }) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  // ---- THEMES per goal (colors & accents) ----
  const THEMES = useMemo(
    () => ({
      car: { grad: ['#4f46e5', '#22d3ee'], chip: '#eef2ff' },
      home: { grad: ['#0ea5e9', '#34d399'], chip: '#ecfeff' },
      holiday: { grad: ['#f97316', '#ef4444'], chip: '#fff7ed' },
      emergency: { grad: ['#334155', '#64748b'], chip: '#f1f5f9' },
      retirement: { grad: ['#9333ea', '#f59e0b'], chip: '#f5f3ff' },
      custom: { grad: ['#06b6d4', '#16a34a'], chip: '#ecfeff' },
      default: { grad: ['#667eea', '#764ba2'], chip: '#eef2ff' },
    }),
    [],
  );

  // Goals (keep translations; provide fallbacks)
  const GOALS = [
    { id: 'car', icon: '🚗', title: t('goals.car', 'Buy a car'), defaultAmount: '150000' },
    { id: 'home', icon: '🏠', title: t('goals.home', 'Deposit for a home'), defaultAmount: '200000' },
    { id: 'holiday', icon: '🎒', title: t('goals.holiday', 'Holiday fund'), defaultAmount: '10000' },
    { id: 'emergency', icon: '🛡️', title: t('goals.emergency', 'Emergency savings'), defaultAmount: '20000' },
    { id: 'retirement', icon: '🌴', title: t('goals.retirement', 'Retirement'), defaultAmount: '1000000' },
    { id: 'custom', icon: '➕', title: t('goals.custom', 'Custom goal'), defaultAmount: '' },
  ];

  // ---- State ----
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [contributionType, setContributionType] = useState('monthly'); // 'monthly' | 'once'
  const [amountRaw, setAmountRaw] = useState('');         // just digits
  const [amountDisplay, setAmountDisplay] = useState(''); // formatted "R 12 345"
  const [customName, setCustomName] = useState('');
  const [showAmountInput, setShowAmountInput] = useState(false);

  // ---- Animations ----
  const amountInputAnimation = useRef(new Animated.Value(0)).current;
  const headerPulse = useRef(new Animated.Value(0)).current;
  const cardAnimations = useRef(Array(6).fill(0).map(() => new Animated.Value(0))).current;

  // pulse loop for hero
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(headerPulse, { toValue: 1, duration: 2200, useNativeDriver: true }),
        Animated.timing(headerPulse, { toValue: 0, duration: 2200, useNativeDriver: true }),
      ]),
    ).start();
  }, [headerPulse]);

  // ---- Helpers: currency ----
  const sanitizeToDigits = (s) => (s || '').replace(/[^\d]/g, '');
  const formatZAR = (digits) => {
    if (!digits) return '';
    // group by thousands with narrow no-break space
    const withSpaces = digits.replace(/\B(?=(\d{3})+(?!\d))/g, '\u202F');
    return `R ${withSpaces}`;
  };

  const setAmountFromString = (inputString) => {
    const d = sanitizeToDigits(inputString);
    setAmountRaw(d);
    setAmountDisplay(formatZAR(d));
  };

  const applyDefaultAmount = (goal) => {
    const def = sanitizeToDigits(goal.defaultAmount || '');
    setAmountRaw(def);
    setAmountDisplay(formatZAR(def));
  };

  // ---- Quick picks ----
  const QUICK_PICKS = ['200', '500', '1000', '2000', '5000']; // rands

  // ---- Handlers ----
  const handleGoalSelect = (goal, index) => {
    setSelectedGoal(goal);
    applyDefaultAmount(goal);

    // Animate selected card
    Animated.spring(cardAnimations[index], {
      toValue: 1,
      useNativeDriver: true,
      tension: 120,
      friction: 9,
    }).start();

    // Reset others
    cardAnimations.forEach((anim, i) => {
      if (i !== index) {
        Animated.spring(anim, { toValue: 0, useNativeDriver: true }).start();
      }
    });

    if (!showAmountInput) {
      setShowAmountInput(true);
      Animated.timing(amountInputAnimation, {
        toValue: 1,
        duration: 320,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleQuickPick = (val) => setAmountFromString(val);

  const handleNext = () => {
    if (!selectedGoal || !amountRaw) return;

    const niceAmount = amountDisplay || formatZAR(amountRaw);
    const goalTitle =
      selectedGoal.id === 'custom' && customName.trim() ? customName.trim() : selectedGoal.title;

    const cta = contributionType === 'monthly'
      ? t('goalSet.messageMonthly', 'Great! We’ll aim for {{amount}} / month towards {{goal}}.')
      : t('goalSet.messageOnce', 'Great! We’ll set aside {{amount}} once-off towards {{goal}}.');

    Alert.alert(
      t('goalSet.title', 'Goal set!'),
      cta.replace('{{amount}}', niceAmount).replace('{{goal}}', goalTitle.toLowerCase()),
      [
        {
          text: t('goalSet.continue', 'Continue'),
          onPress: () => onGoalComplete(
            { ...selectedGoal, title: goalTitle, contributionType },
            amountRaw, // pass raw cents-free rands
          ),
        },
      ],
    );
  };

  const isNextButtonEnabled = !!selectedGoal && !!amountRaw;

  // ---- Derived theme for header & CTA ----
  const theme = THEMES[selectedGoal?.id] || THEMES.default;
  const headerScale = headerPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.02],
  });
  const headerOpacity = headerPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1],
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Hero header */}
      <View style={styles.heroWrap}>
        <LinearGradient
          colors={theme.grad}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <Animated.View
            style={[
              styles.heroPulse,
              { opacity: headerOpacity, transform: [{ scale: headerScale }] },
            ]}
          />
          <Text style={styles.headerOverline}>
            {t('goalSetting.overline', 'Set your next goal')}
          </Text>
          <Text style={styles.headerTitle}>
            {t('goalSetting.title', 'What are you saving for?')}
          </Text>
          <Text style={styles.mainQuestion}>
            {t('goalSetting.mainQuestion', 'Pick a goal to get a tailored plan.')}
          </Text>
        </LinearGradient>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Goal grid */}
        <View style={styles.grid}>
          {GOALS.map((goal, index) => {
            const selected = selectedGoal?.id === goal.id;
            const anim = cardAnimations[index];
            const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.03] });
            const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -2] });
            const goalTheme = THEMES[goal.id] || THEMES.default;

            return (
              <TouchableOpacity
                key={goal.id}
                style={styles.cardTouchable}
                onPress={() => handleGoalSelect(goal, index)}
                activeOpacity={0.9}
              >
                <Animated.View
                  style={[
                    styles.goalCard,
                    { transform: [{ scale }, { translateY }] },
                  ]}
                >
                  <LinearGradient
                    colors={goalTheme.grad}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.cardGradient, selected && styles.cardGradientSelected]}
                  >
                    {/* Soft overlay */}
                    <View style={styles.cardOverlay} />
                    <View style={styles.cardRow}>
                      <View style={styles.iconWrap}>
                        {selected && <View style={styles.pulseRing} />}
                        <Text style={styles.goalIcon}>{goal.icon}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.goalTitle}>{goal.title}</Text>
                        {!!goal.defaultAmount && (
                          <Text style={styles.goalSubtitle}>
                            {t('goalSetting.suggested', 'Suggested:')}{' '}
                            {formatZAR(goal.defaultAmount)}
                          </Text>
                        )}
                      </View>
                      {selected && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                  </LinearGradient>
                </Animated.View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Contribution type */}
        {showAmountInput && (
          <Animated.View
            style={[
              styles.segmentWrap,
              {
                opacity: amountInputAnimation,
                transform: [
                  {
                    translateY: amountInputAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.segmentLabel}>
              {t('goalSetting.contributionType', 'Contribution type')}
            </Text>
            <View style={styles.segment}>
              {['monthly', 'once'].map((key) => {
                const active = contributionType === key;
                return (
                  <TouchableOpacity
                    key={key}
                    onPress={() => setContributionType(key)}
                    activeOpacity={0.9}
                    style={[styles.segmentBtn, active && styles.segmentBtnActive]}
                  >
                    <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
                      {key === 'monthly'
                        ? t('goalSetting.monthly', 'Monthly')
                        : t('goalSetting.once', 'Once-off')}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>
        )}

        {/* Amount + quick picks */}
        {showAmountInput && (
          <Animated.View
            style={[
              styles.amountInputContainer,
              {
                opacity: amountInputAnimation,
                transform: [
                  {
                    translateY: amountInputAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.amountLabel}>
              {t('goalSetting.amountLabel', 'How much would you like to set aside?')}
            </Text>

            <View style={styles.quickChips}>
              {QUICK_PICKS.map((v) => (
                <TouchableOpacity
                  key={v}
                  onPress={() => handleQuickPick(v)}
                  style={[styles.chip, { backgroundColor: (THEMES[selectedGoal?.id] || THEMES.default).chip }]}
                  activeOpacity={0.85}
                >
                  <Text style={styles.chipText}>{formatZAR(v)}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.amountInput}
              value={amountDisplay}
              onChangeText={setAmountFromString}
              placeholder={
                selectedGoal?.id === 'custom'
                  ? t('goalSetting.customPlaceholder', 'Enter an amount')
                  : t('goalSetting.defaultPlaceholder', 'Try R 1 000')
              }
              keyboardType="number-pad"
              returnKeyType="done"
            />

            {selectedGoal?.id === 'custom' && (
              <>
                <Text style={[styles.amountLabel, { marginTop: 16 }]}>
                  {t('goalSetting.customName', 'Give your goal a name')}
                </Text>
                <TextInput
                  style={styles.customInput}
                  value={customName}
                  onChangeText={setCustomName}
                  placeholder={t('goalSetting.customNamePlaceholder', 'e.g. “New laptop”')}
                  returnKeyType="done"
                />
              </>
            )}
          </Animated.View>
        )}

        {/* Friendly hint */}
        {showAmountInput && (
          <View style={styles.hintCard}>
            <Text style={styles.hintText}>
              {contributionType === 'monthly'
                ? t('goalSetting.hintMonthly', 'Small monthly amounts add up fast when invested.')
                : t('goalSetting.hintOnce', 'A once-off boost can kick-start your savings.')}
            </Text>
          </View>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={[styles.nextButton, isNextButtonEnabled && styles.nextButtonActive]}
          onPress={handleNext}
          disabled={!isNextButtonEnabled}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={isNextButtonEnabled ? theme.grad : ['#cbd5e1', '#94a3b8']}
            style={styles.nextButtonGradient}
          >
            <Text
              style={[
                styles.nextButtonText,
                !isNextButtonEnabled && styles.nextButtonTextDisabled,
              ]}
              numberOfLines={1}
            >
              {isNextButtonEnabled
                ? (contributionType === 'monthly'
                    ? t('common.nextMonthly', 'Start with ') + (amountDisplay || formatZAR(amountRaw)) + t('common.perMonth', ' / month')
                    : t('common.nextOnce', 'Set aside ') + (amountDisplay || formatZAR(amountRaw)))
                : t('common.next', 'Next')}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ---- Styles ----
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1220',
  },

  // HERO
  heroWrap: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  hero: {
    borderRadius: 20,
    padding: 20,
    overflow: 'hidden',
  },
  heroPulse: {
    position: 'absolute',
    right: -40,
    top: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerOverline: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: 'white',
    marginBottom: 6,
  },
  mainQuestion: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },

  scrollView: { flex: 1 },

  // GRID of cards
  grid: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 12,
  },
  cardTouchable: { borderRadius: 16, overflow: 'hidden' },
  goalCard: {
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
      },
      android: { elevation: 5 },
    }),
  },
  cardGradient: {
    padding: 16,
    borderRadius: 16,
  },
  cardGradientSelected: {
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  cardOverlay: {
    position: 'absolute',
    left: -30,
    top: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: { width: 48, height: 48, marginRight: 14, justifyContent: 'center', alignItems: 'center' },
  pulseRing: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  goalIcon: { fontSize: 28, color: 'white' },
  goalTitle: { color: 'white', fontWeight: '700', fontSize: 16 },
  goalSubtitle: { color: 'rgba(255,255,255,0.9)', marginTop: 2 },

  // Segment
  segmentWrap: { paddingHorizontal: 20, marginTop: 8 },
  segmentLabel: {
    color: '#cbd5e1',
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 6,
  },
  segment: {
    backgroundColor: '#0f172a',
    borderRadius: 999,
    padding: 4,
    flexDirection: 'row',
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    alignItems: 'center',
  },
  segmentBtnActive: {
    backgroundColor: '#1e293b',
  },
  segmentText: { color: '#cbd5e1', fontWeight: '600' },
  segmentTextActive: { color: 'white' },

  // Amount area
  amountInputContainer: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 20,
    marginTop: 12,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#1f2a44',
  },
  amountLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#e2e8f0',
    marginBottom: 10,
  },
  quickChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  chipText: { color: '#0f172a', fontWeight: '700' },
  amountInput: {
    borderWidth: 1,
    borderColor: '#233048',
    borderRadius: 12,
    padding: 14,
    fontSize: 18,
    fontWeight: '700',
    color: '#e2e8f0',
    backgroundColor: '#111827',
  },
  customInput: {
    borderWidth: 1,
    borderColor: '#233048',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#e2e8f0',
    backgroundColor: '#0b1220',
    marginTop: 8,
  },

  // Hint card
  hintCard: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#1f2a44',
  },
  hintText: { color: '#cbd5e1' },

  // Bottom CTA
  bottomContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: '#0b1220',
    borderTopWidth: 1,
    borderTopColor: '#1f2a44',
  },
  nextButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  nextButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  nextButtonActive: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.35,
        shadowRadius: 18,
      },
      android: { elevation: 10 },
    }),
  },
  nextButtonText: { color: 'white', fontSize: 16, fontWeight: '800' },
  nextButtonTextDisabled: { color: '#1f2937' },
});

export default GoalSettingScreen;
