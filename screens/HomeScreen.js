// screens/HomeScreen.js
import React, { useState, useEffect, useRef, useMemo } from 'react';
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

// lightweight pseudo account number based on goal name (stable across renders)
const makeAcctNumber = (seed = 'Savings') => {
  let h = 0 >>> 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const digits = String(h).padStart(10, '0').slice(-10); // 10 digits
  return `SA ${digits.slice(0, 4)} ${digits.slice(4, 8)} ${digits.slice(8)}`;
};

const defaultSources = [
  { id: 'cheque',   name: 'Cheque Account',   number: '••12 3456', emoji: '💳', balance: 12500 },
  { id: 'everyday', name: 'Everyday Account', number: '••98 7654', emoji: '👜', balance: 2400  },
  { id: 'salary',   name: 'Salary Account',   number: '••00 1122', emoji: '💼', balance: 30300 },
];

const HomeScreen = ({
  userName = 'Alex',
  goalName = 'Car Fund',
  goalAmount = 80000,
  institutionName = 'Monocle Bank',
  simulatedNetWorth = 15200,
  sparklineData = [12800, 13200, 13800, 14100, 14600, 15000, 15200],
  onContinueLesson,
  onViewSimulation,
  // data callbacks (optional)
  onDeposit,              // new: (amount, sourceAccountObj)
  onMakeContribution,     // legacy: (amount)
  // optional: pass your own source accounts list
  sourceAccounts = defaultSources,
}) => {
  const insets = useSafeAreaInsets();

  // Greeting
  const [greeting, setGreeting] = useState('');

  // --- Savings Account state (starts at 0 visually) ---
  const [savingsBalance, setSavingsBalance] = useState(0); // shown balance
  const [transactions, setTransactions] = useState([]);    // {id, type:'deposit', amount, date, sourceId}

  // Animations
  const fadeInAnimation = useRef(new Animated.Value(0)).current;
  const slideUpAnimation = useRef(new Animated.Value(30)).current;

  const balAnim = useRef(new Animated.Value(0)).current;      // number counter
  const progressAnim = useRef(new Animated.Value(0)).current;  // 0..1 progress
  const [animatedBalance, setAnimatedBalance] = useState(0);

  const netWorthAnimation = useRef(new Animated.Value(0)).current;
  const [animatedNetWorth, setAnimatedNetWorth] = useState(0);

  // Deposit sheet (single entry point)
  const [showSheet, setShowSheet] = useState(false);
  const [depositInput, setDepositInput] = useState('');
  const sanitizeDigits = (s) => (s || '').replace(/[^\d]/g, '');
  const setDepositSafe = (s) => setDepositInput(sanitizeDigits(s));
  const QUICK_PICKS = ['100', '200', '500', '1000'];

  // Source account selection
  const [selectedSourceId, setSelectedSourceId] = useState(
    sourceAccounts?.[0]?.id || null
  );
  const selectedSource = useMemo(
    () => sourceAccounts.find(a => a.id === selectedSourceId) || null,
    [selectedSourceId, sourceAccounts]
  );

  // Stable account number from goal
  const accountNumber = useMemo(() => makeAcctNumber(goalName), [goalName]);

  useEffect(() => {
    // Greeting
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    // Entrance anims
    Animated.parallel([
      Animated.timing(fadeInAnimation, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideUpAnimation, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();

    // Net worth counter
    setTimeout(() => {
      Animated.timing(netWorthAnimation, {
        toValue: simulatedNetWorth,
        duration: 2000,
        useNativeDriver: false,
      }).start();
    }, 400);

    const nwListener = netWorthAnimation.addListener(({ value }) => {
      setAnimatedNetWorth(Math.floor(value));
    });

    const balListener = balAnim.addListener(({ value }) => {
      setAnimatedBalance(Math.floor(value));
    });

    return () => {
      netWorthAnimation.removeListener(nwListener);
      balAnim.removeListener(balListener);
    };
  }, []);

  // Animate balance counter & progress whenever savingsBalance changes
  useEffect(() => {
    Animated.timing(balAnim, {
      toValue: savingsBalance,
      duration: 800,
      useNativeDriver: false,
    }).start();

    const target = goalAmount > 0 ? Math.min(savingsBalance / goalAmount, 1) : 0;
    Animated.timing(progressAnim, {
      toValue: target,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [savingsBalance, goalAmount]);

  const formatCurrency = (amount) => `R ${Number(amount).toLocaleString()}`;

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
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

  // Deposit sheet (single entry point)
  const openDepositSheet = () => {
    setDepositInput('');
    if (!selectedSourceId && sourceAccounts.length) {
      setSelectedSourceId(sourceAccounts[0].id);
    }
    setShowSheet(true);
  };
  const closeDepositSheet = () => setShowSheet(false);

  const confirmDeposit = () => {
    const amt = parseInt(depositInput || '0', 10);
    if (!amt || amt <= 0 || !selectedSource) {
      closeDepositSheet();
      return;
    }
    // update local balance & transactions
    setSavingsBalance((b) => b + amt);
    setTransactions((tx) => [
      {
        id: String(Date.now()),
        type: 'deposit',
        amount: amt,
        date: new Date().toISOString(),
        sourceId: selectedSource.id,
      },
      ...tx,
    ]);
    closeDepositSheet();
    // callbacks
    if (typeof onDeposit === 'function') onDeposit(amt, selectedSource);
    if (typeof onMakeContribution === 'function') onMakeContribution(amt); // backward compat
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

        {/* Savings Account Card (only one deposit entry: Add money pill) */}
        <Animated.View
          style={[
            styles.accountCard,
            { opacity: fadeInAnimation, transform: [{ translateY: slideUpAnimation }] },
          ]}
        >
          <LinearGradient
            colors={['#0ea5e9', '#22c55e']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.accountGradient}
          >
            <View style={styles.accountHeaderRow}>
              <Text style={styles.bankName}>{institutionName}</Text>
              <TouchableOpacity onPress={openDepositSheet} activeOpacity={0.9} style={styles.addMoneyPill}>
                <Text style={styles.addMoneyText}>Add money</Text>
                <Text style={styles.addMoneyArrow}>➕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.accountLabel}>Savings Account</Text>
            <Text style={styles.accountNumber}>{accountNumber}</Text>

            <View style={styles.balanceRow}>
              <Text style={styles.balanceLabel}>Balance</Text>
              <Text style={styles.balanceValue}>{formatCurrency(animatedBalance)}</Text>
            </View>

            {/* Progress vs. goal */}
            <View style={styles.progressWrap}>
              <View style={styles.progressTrack}>
                <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
              </View>
              <View style={styles.goalRow}>
                <Text style={styles.goalNameText}>{goalName}</Text>
                <Text style={styles.goalTargetText}>Target {formatCurrency(goalAmount)}</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Recent Activity */}
        <Animated.View
          style={[
            styles.activityCard,
            { opacity: fadeInAnimation, transform: [{ translateY: slideUpAnimation }] },
          ]}
        >
          <Text style={styles.activityTitle}>Recent activity</Text>
          {transactions.length === 0 ? (
            <View style={styles.activityEmpty}>
              <Text style={styles.activityEmptyText}>
                No transactions yet. Tap “Add money” to make your first deposit.
              </Text>
            </View>
          ) : (
            transactions.slice(0, 6).map((tx) => {
              const src = sourceAccounts.find(s => s.id === tx.sourceId);
              return (
                <View key={tx.id} style={styles.txRow}>
                  <View style={styles.txLeft}>
                    <Text style={styles.txEmoji}>{src?.emoji || '⬆️'}</Text>
                    <View>
                      <Text style={styles.txTitle}>
                        Deposit {src ? `from ${src.name}` : ''}
                      </Text>
                      <Text style={styles.txSub}>
                        {new Date(tx.date).toLocaleString()}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.txAmountPositive}>+ {formatCurrency(tx.amount)}</Text>
                </View>
              );
            })
          )}
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

      {/* Deposit Bottom Sheet (single entry point) */}
      <Modal visible={showSheet} animationType="fade" transparent onRequestClose={closeDepositSheet}>
        <Pressable style={styles.sheetBackdrop} onPress={closeDepositSheet}>
          <Pressable style={[styles.sheetContainer, { paddingBottom: insets.bottom + 16 }]} onPress={() => {}}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Deposit to Savings</Text>
            <Text style={styles.sheetSubtitle}>
              {institutionName} • {accountNumber}
            </Text>

            {/* Source account selector */}
            <Text style={styles.sectionLabel}>From</Text>
            <View style={styles.sourcesWrap}>
              {sourceAccounts.map((acc) => {
                const selected = acc.id === selectedSourceId;
                return (
                  <TouchableOpacity
                    key={acc.id}
                    style={[styles.sourceRow, selected && styles.sourceRowSelected]}
                    activeOpacity={0.85}
                    onPress={() => setSelectedSourceId(acc.id)}
                  >
                    <Text style={styles.sourceEmoji}>{acc.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.sourceName}>{acc.name}</Text>
                      <Text style={styles.sourceSub}>
                        {acc.number} • Bal {formatCurrency(acc.balance)}
                      </Text>
                    </View>
                    <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
                      {selected && <View style={styles.radioInner} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Quick picks */}
            <Text style={[styles.sectionLabel, { marginTop: 10 }]}>Amount</Text>
            <View style={styles.chipsRow}>
              {QUICK_PICKS.map((v) => (
                <TouchableOpacity
                  key={v}
                  style={styles.chip}
                  onPress={() => setDepositSafe(v)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.chipText}>{`R ${Number(v).toLocaleString()}`}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Amount input */}
            <View style={styles.inputRow}>
              <Text style={styles.inputCurrency}>R</Text>
              <TextInput
                style={styles.inputField}
                value={depositInput}
                onChangeText={setDepositSafe}
                placeholder="0"
                keyboardType="number-pad"
                returnKeyType="done"
              />
            </View>

            {/* Confirm */}
            <TouchableOpacity
              style={[
                styles.sheetCta,
                (!depositInput || parseInt(depositInput || '0', 10) <= 0 || !selectedSourceId) && styles.sheetCtaDisabled,
              ]}
              activeOpacity={0.9}
              disabled={!depositInput || parseInt(depositInput || '0', 10) <= 0 || !selectedSourceId}
              onPress={confirmDeposit}
            >
              <LinearGradient
                colors={depositInput ? ['#22c55e', '#16a34a'] : ['#cbd5e1', '#94a3b8']}
                style={styles.sheetCtaGrad}
              >
                <Text style={styles.sheetCtaText}>
                  {depositInput
                    ? `Deposit R ${Number(depositInput).toLocaleString()}`
                    : 'Enter an amount'}
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

  // Savings account card
  accountCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 24,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
      },
      android: { elevation: 6 },
    }),
  },
  accountGradient: { padding: 20 },
  accountHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bankName: { color: 'white', fontWeight: '800', fontSize: 14, letterSpacing: 0.5 },
  addMoneyPill: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addMoneyText: { color: 'white', fontWeight: '700' },
  addMoneyArrow: { color: 'white', fontWeight: '900' },

  accountLabel: { marginTop: 10, color: 'rgba(255,255,255,0.9)', fontWeight: '600' },
  accountNumber: { color: 'white', fontSize: 18, fontWeight: '800', marginTop: 2, letterSpacing: 0.5 },

  balanceRow: { marginTop: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  balanceLabel: { color: 'rgba(255,255,255,0.9)' },
  balanceValue: { color: 'white', fontSize: 28, fontWeight: '900' },

  progressWrap: { marginTop: 14 },
  progressTrack: { width: '100%', height: 12, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 999, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: 'white' },
  goalRow: { marginTop: 8, flexDirection: 'row', justifyContent: 'space-between' },
  goalNameText: { color: 'white', fontWeight: '700' },
  goalTargetText: { color: 'rgba(255,255,255,0.9)' },

  // Activity
  activityCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    padding: 16,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  activityTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a', marginBottom: 8 },
  activityEmpty: { paddingVertical: 12 },
  activityEmptyText: { color: '#64748b' },
  txRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  txLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  txEmoji: { fontSize: 18 },
  txTitle: { fontWeight: '700', color: '#0f172a' },
  txSub: { color: '#64748b', fontSize: 12, marginTop: 2 },
  txAmountPositive: { color: '#16a34a', fontWeight: '800' },

  // Next step
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

  // Simulation
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
  simulationHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  simulationTitle: { fontSize: 15, fontWeight: '600', color: '#475569', marginBottom: 4 },
  simulationAmount: { fontSize: 22, fontWeight: '800', color: '#16a34a' },
  simulationSubtext: { fontSize: 12, color: '#94a3b8' },
  sparklineContainer: { flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
  sparklineBar: { width: 3, borderRadius: 999 },

  // Daily bite
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
  dailyBiteHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  dailyBiteDate: { fontSize: 12, fontWeight: '600', color: '#4f46e5', textTransform: 'uppercase', letterSpacing: 0.5 },
  dailyBiteEmoji: { fontSize: 18 },
  dailyBiteText: { fontSize: 15, color: '#334155', lineHeight: 21 },
  termHighlight: { fontWeight: '700', color: '#0f172a' },

  // Bottom sheet (deposit)
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

  sectionLabel: { fontSize: 12, color: '#64748b', marginBottom: 6, letterSpacing: 0.3, textTransform: 'uppercase' },

  sourcesWrap: { marginBottom: 10 },
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    marginBottom: 8,
  },
  sourceRowSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#eef2ff',
  },
  sourceEmoji: { fontSize: 18 },
  sourceName: { fontWeight: '700', color: '#0f172a' },
  sourceSub: { fontSize: 12, color: '#64748b', marginTop: 2 },

  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#94a3b8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: { borderColor: '#4f46e5', backgroundColor: '#e0e7ff' },
  radioInner: { width: 8, height: 8, borderRadius: 999, backgroundColor: '#4f46e5' },

  chipsRow: { flexDirection: 'row', gap: 8, marginBottom: 12, marginTop: 4 },
  chip: { backgroundColor: '#eef2ff', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
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
