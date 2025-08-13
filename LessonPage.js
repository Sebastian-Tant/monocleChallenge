// components/LessonPage.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
} from 'react-native';
import CompoundInterestSlider from './CompoundInterestSlider';

const { width: screenWidth } = Dimensions.get('window');

const LessonPage = ({ page, isActive, onQuizAnswer, quizAnswer }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    if (isActive) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      slideAnim.setValue(30);
    }
  }, [isActive]);

  const renderStoryPage = () => (
    <Animated.View style={[
      styles.pageContent,
      { backgroundColor: page.backgroundColor },
      {
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      },
    ]}>
      <View style={styles.graphicContainer}>
        <Text style={styles.graphic}>{page.graphic}</Text>
      </View>
      
      <View style={styles.textContainer}>
        <Text style={styles.pageTitle}>{page.title}</Text>
        <Text style={styles.pageText}>{page.content}</Text>
      </View>
    </Animated.View>
  );

  const renderInteractivePage = () => (
    <Animated.View style={[
      styles.pageContent,
      { backgroundColor: page.backgroundColor },
      {
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      },
    ]}>
      <View style={styles.textContainer}>
        <Text style={styles.pageTitle}>{page.title}</Text>
        <Text style={styles.pageText}>{page.content}</Text>
      </View>
      
      <View style={styles.interactiveContainer}>
        <CompoundInterestSlider />
      </View>
    </Animated.View>
  );

  const renderQuizPage = () => (
    <Animated.View style={[
      styles.pageContent,
      { backgroundColor: page.backgroundColor },
      {
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      },
    ]}>
      <View style={styles.textContainer}>
        <Text style={styles.pageTitle}>{page.title}</Text>
        <Text style={styles.pageText}>{page.question}</Text>
      </View>
      
      <View style={styles.quizContainer}>
        {page.options.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.quizOption,
              quizAnswer === option.id && styles.selectedOption,
              quizAnswer && option.correct && styles.correctOption,
              quizAnswer && quizAnswer === option.id && !option.correct && styles.incorrectOption,
            ]}
            onPress={() => onQuizAnswer(option.id)}
            disabled={quizAnswer !== null}
            activeOpacity={0.8}
          >
            <View style={styles.optionContent}>
              <Text style={[
                styles.optionText,
                quizAnswer === option.id && styles.selectedOptionText,
              ]}>
                {option.text}
              </Text>
              {quizAnswer && option.correct && (
                <Text style={styles.correctIcon}>✓</Text>
              )}
              {quizAnswer && quizAnswer === option.id && !option.correct && (
                <Text style={styles.incorrectIcon}>✗</Text>
              )}
            </View>
            {quizAnswer && option.correct && quizAnswer !== option.id && (
              <Text style={styles.correctLabel}>Correct Answer</Text>
            )}
          </TouchableOpacity>
        ))}
        
        {quizAnswer && (
          <Animated.View style={styles.quizFeedback}>
            {page.options.find(opt => opt.id === quizAnswer)?.correct ? (
              <Text style={styles.correctFeedback}>
                🎉 Correct! Starting early gives compound interest more time to work its magic.
              </Text>
            ) : (
              <Text style={styles.incorrectFeedback}>
                Not quite. Starting early gives compound interest more time to work its magic, making it more powerful than just a high starting amount.
              </Text>
            )}
          </Animated.View>
        )}
      </View>
    </Animated.View>
  );

  const renderPageContent = () => {
    switch (page.type) {
      case 'story':
        return renderStoryPage();
      case 'interactive':
        return renderInteractivePage();
      case 'quiz':
        return renderQuizPage();
      default:
        return renderStoryPage();
    }
  };

  return (
    <View style={styles.pageContainer}>
      {renderPageContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    width: screenWidth,
    flex: 1,
  },
  pageContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: 'center',
  },
  graphicContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  graphic: {
    fontSize: 80,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
    textAlign: 'center',
  },
  pageText: {
    fontSize: 18,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 16,
  },
  interactiveContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  quizContainer: {
    gap: 16,
  },
  quizOption: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedOption: {
    borderColor: '#667eea',
    backgroundColor: '#f0f4ff',
  },
  correctOption: {
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4',
  },
  incorrectOption: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
    flex: 1,
  },
  selectedOptionText: {
    color: '#667eea',
  },
  correctIcon: {
    color: '#10b981',
    fontSize: 20,
    fontWeight: 'bold',
  },
  incorrectIcon: {
    color: '#ef4444',
    fontSize: 20,
    fontWeight: 'bold',
  },
  correctLabel: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
    marginTop: 8,
  },
  quizFeedback: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  correctFeedback: {
    fontSize: 16,
    color: '#059669',
    textAlign: 'center',
    lineHeight: 22,
  },
  incorrectFeedback: {
    fontSize: 16,
    color: '#dc2626',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default LessonPage;