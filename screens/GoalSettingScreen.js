// screens/GoalSettingScreen.js
import React, { useState, useRef } from 'react';
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
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [amount, setAmount] = useState('');
  const [showAmountInput, setShowAmountInput] = useState(false);
  
  const amountInputAnimation = useRef(new Animated.Value(0)).current;
  const cardAnimations = useRef(Array(6).fill(0).map(() => new Animated.Value(0))).current;

  // Goals array using translations
  const GOALS = [
    { id: 'car', icon: '🚗', title: t('goals.car'), defaultAmount: t('goals.carAmount') },
    { id: 'home', icon: '🏠', title: t('goals.home'), defaultAmount: t('goals.homeAmount') },
    { id: 'holiday', icon: '🎒', title: t('goals.holiday'), defaultAmount: t('goals.holidayAmount') },
    { id: 'emergency', icon: '🛡️', title: t('goals.emergency'), defaultAmount: t('goals.emergencyAmount') },
    { id: 'retirement', icon: '🌴', title: t('goals.retirement'), defaultAmount: t('goals.retirementAmount') },
    { id: 'custom', icon: '➕', title: t('goals.custom'), defaultAmount: '' },
  ];

  const handleGoalSelect = (goal, index) => {
    setSelectedGoal(goal);
    setAmount(goal.defaultAmount);
    
    // Animate card selection
    Animated.spring(cardAnimations[index], {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
    
    // Reset other card animations
    cardAnimations.forEach((anim, i) => {
      if (i !== index) {
        Animated.spring(anim, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    });

    // Show amount input with animation
    if (!showAmountInput) {
      setShowAmountInput(true);
      Animated.timing(amountInputAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleNext = () => {
    if (selectedGoal && amount.trim()) {
      // Show success animation/feedback
      Alert.alert(
        t('goalSet.title'),
        t('goalSet.message', { amount: amount, goalTitle: selectedGoal.title.toLowerCase() }),
        [
          {
            text: t('goalSet.continue'),
            onPress: () => onGoalComplete(selectedGoal, amount),
          },
        ]
      );
    }
  };

  const isNextButtonEnabled = selectedGoal && amount.trim() !== '';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('goalSetting.title')}</Text>
          <Text style={styles.mainQuestion}>
            {t('goalSetting.mainQuestion')}
          </Text>
          <Text style={styles.instruction}>
            {t('goalSetting.instruction')}
          </Text>
        </View>

        <View style={styles.goalsContainer}>
          {GOALS.map((goal, index) => (
            <TouchableOpacity
              key={goal.id}
              style={[
                styles.goalCard,
                selectedGoal?.id === goal.id && styles.selectedCard,
              ]}
              onPress={() => handleGoalSelect(goal, index)}
              activeOpacity={0.7}
            >
              <Animated.View
                style={[
                  styles.cardContent,
                  {
                    transform: [
                      {
                        scale: cardAnimations[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 1.02],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Text style={styles.goalIcon}>{goal.icon}</Text>
                <Text style={styles.goalTitle}>{goal.title}</Text>
                {selectedGoal?.id === goal.id && (
                  <Animated.Text
                    style={[
                      styles.checkmark,
                      {
                        transform: [
                          {
                            scale: cardAnimations[index].interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, 1],
                            }),
                          },
                        ],
                      },
                    ]}
                  >
                    ✓
                  </Animated.Text>
                )}
              </Animated.View>
            </TouchableOpacity>
          ))}
        </View>

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
            <Text style={styles.amountLabel}>{t('goalSetting.amountLabel')}</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              placeholder={selectedGoal?.id === 'custom' ? t('goalSetting.customPlaceholder') : t('goalSetting.defaultPlaceholder')}
              keyboardType="default"
              returnKeyType="done"
            />
          </Animated.View>
        )}
      </ScrollView>

      <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            isNextButtonEnabled && styles.nextButtonActive,
          ]}
          onPress={handleNext}
          disabled={!isNextButtonEnabled}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={isNextButtonEnabled ? ['#667eea', '#764ba2'] : ['#cbd5e1', '#94a3b8']}
            style={styles.nextButtonGradient}
          >
            <Text style={[
              styles.nextButtonText,
              !isNextButtonEnabled && styles.nextButtonTextDisabled,
            ]}>
              {t('common.next')}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
    textAlign: 'center',
  },
  mainQuestion: {
    fontSize: 18,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 26,
  },
  instruction: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  goalsContainer: {
    paddingBottom: 24,
  },
  goalCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  selectedCard: {
    borderColor: '#667eea',
    backgroundColor: '#f0f4ff',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  goalIcon: {
    fontSize: 32,
    marginRight: 16,
    width: 40,
    textAlign: 'center',
  },
  goalTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
  },
  checkmark: {
    position: 'absolute',
    right: 0,
    top: -5,
    color: '#667eea',
    fontSize: 20,
    fontWeight: 'bold',
  },
  amountInputContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  amountLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 12,
  },
  amountInput: {
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    backgroundColor: '#f8fafc',
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  nextButton: {
    borderRadius: 50,
    overflow: 'hidden',
  },
  nextButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  nextButtonActive: {
    ...Platform.select({
      ios: {
        shadowColor: '#667eea',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  nextButtonTextDisabled: {
    color: '#64748b',
  },
});

export default GoalSettingScreen;