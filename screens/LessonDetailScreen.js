// screens/LessonDetailScreen.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  PanGestureHandler,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LessonPage from '../components/LessonPage';
import ProgressIndicator from '../components/ProgressIndicator';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const LessonDetailScreen = ({ 
  lessonTitle = "The Magic of Compounding",
  onComplete,
  onBack 
}) => {
  const insets = useSafeAreaInsets();
  const [currentPage, setCurrentPage] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);

  // Lesson content data
  const lessonPages = [
    {
      id: 'concept',
      type: 'story',
      title: 'The Concept',
      content: "Imagine you have a money tree. Compound interest is like planting the seeds that fall from your tree, so they grow into new money trees.",
      graphic: '🌳',
      backgroundColor: '#f0f9ff',
    },
    {
      id: 'core-idea',
      type: 'story',
      title: 'The Core Idea',
      content: "You earn interest on your money. Then, you earn *interest on your interest*. That's the magic.",
      graphic: '✨',
      backgroundColor: '#fefce8',
    },
    {
      id: 'interactive',
      type: 'interactive',
      title: 'See It In Action',
      content: "Let's see it in action. Drag the slider to see how a R10,000 investment grows at 8% interest.",
      backgroundColor: '#f0fdf4',
    },
    {
      id: 'quiz',
      type: 'quiz',
      title: 'Quick Question',
      question: 'Which is more powerful for compounding?',
      options: [
        { id: 'A', text: 'A high starting amount', correct: false },
        { id: 'B', text: 'Starting as early as possible', correct: true }
      ],
      backgroundColor: '#fdf2f8',
    },
  ];

  const handlePageChange = (pageIndex) => {
    setCurrentPage(pageIndex);
    if (pageIndex === lessonPages.length - 1 && !lessonCompleted) {
      // User reached the last page
      setTimeout(() => {
        setLessonCompleted(true);
      }, 1000);
    }
  };

  const handleNext = () => {
    if (currentPage < lessonPages.length - 1) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      flatListRef.current?.scrollToIndex({ index: nextPage, animated: true });
      handlePageChange(nextPage);
    } else if (lessonCompleted) {
      onComplete?.();
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      flatListRef.current?.scrollToIndex({ index: prevPage, animated: true });
    }
  };

  const handleQuizAnswer = (answerId) => {
    setQuizAnswer(answerId);
    const isCorrect = lessonPages[3].options.find(opt => opt.id === answerId)?.correct;
    
    // Auto-advance after answering
    setTimeout(() => {
      if (currentPage === lessonPages.length - 1) {
        setLessonCompleted(true);
      }
    }, 1500);
  };

  const renderPage = ({ item, index }) => (
    <LessonPage
      page={item}
      isActive={index === currentPage}
      onQuizAnswer={handleQuizAnswer}
      quizAnswer={quizAnswer}
    />
  );

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { 
      useNativeDriver: false,
      listener: (event) => {
        const pageIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
        if (pageIndex !== currentPage) {
          setCurrentPage(pageIndex);
          handlePageChange(pageIndex);
        }
      }
    }
  );

  const canProceed = () => {
    if (currentPage === 3) { // Quiz page
      return quizAnswer !== null;
    }
    return true;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lesson: {lessonTitle}</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Progress Indicator */}
      <ProgressIndicator 
        currentPage={currentPage}
        totalPages={lessonPages.length}
        scrollX={scrollX}
      />

      {/* Lesson Content */}
      <Animated.FlatList
        ref={flatListRef}
        data={lessonPages}
        renderItem={renderPage}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        getItemLayout={(data, index) => ({
          length: screenWidth,
          offset: screenWidth * index,
          index,
        })}
      />

      {/* Navigation Controls */}
      <View style={[styles.navigationControls, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={[styles.navButton, currentPage === 0 && styles.disabledButton]}
          onPress={handlePrevious}
          disabled={currentPage === 0}
          activeOpacity={0.7}
        >
          <Text style={[styles.navButtonText, currentPage === 0 && styles.disabledText]}>
            Previous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.nextButton,
            !canProceed() && styles.disabledButton,
            lessonCompleted && styles.completedButton,
          ]}
          onPress={handleNext}
          disabled={!canProceed()}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.nextButtonText,
            !canProceed() && styles.disabledText,
          ]}>
            {currentPage === lessonPages.length - 1 
              ? (lessonCompleted ? 'Complete Lesson' : 'Finish') 
              : 'Next'
            }
          </Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: -12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#667eea',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 60, // Balance the back button
  },
  navigationControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  navButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  nextButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#667eea',
  },
  completedButton: {
    backgroundColor: '#10b981',
  },
  disabledButton: {
    backgroundColor: '#e2e8f0',
    opacity: 0.6,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#475569',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  disabledText: {
    color: '#94a3b8',
  },
});

export default LessonDetailScreen;