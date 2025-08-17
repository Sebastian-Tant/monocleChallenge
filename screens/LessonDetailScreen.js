// screens/LessonDetailScreen.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, Dimensions, TouchableOpacity, Animated, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LessonPage from '../components/LessonPage';
import ProgressIndicator from '../components/ProgressIndicator';
import { getLessonById } from './data/index'; // <-- NEW

const { width: screenWidth } = Dimensions.get('window');

const LessonDetailScreen = ({
  lessonTitle = 'The Magic of Compounding',
  onComplete,
  onBack,
  route,
}) => {
  const insets = useSafeAreaInsets();

  // resolve lesson
  const lessonId = route?.params?.lessonId;
  const lesson = getLessonById(lessonId);
  const lessonPages = lesson?.pages || [];
  const title = lesson?.title || lessonTitle;

  const [currentPage, setCurrentPage] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [lessonCompleted, setLessonCompleted] = useState(false);

  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);

  // reset when lesson changes
  useEffect(() => {
    setCurrentPage(0);
    setQuizAnswer(null);
    setLessonCompleted(false);
    flatListRef.current?.scrollToOffset?.({ offset: 0, animated: false });
  }, [lessonId]);

  const handlePageChange = (pageIndex) => {
    setCurrentPage(pageIndex);
    if (pageIndex === lessonPages.length - 1 && !lessonCompleted) {
      setTimeout(() => setLessonCompleted(true), 1000);
    }
  };

  const handleNext = () => {
    if (currentPage < lessonPages.length - 1) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      flatListRef.current?.scrollToIndex({ index: nextPage, animated: true });
      handlePageChange(nextPage);
    } else if (lessonCompleted) {
      onComplete?.(lessonId || title);
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
    // correctness if you need it:
    // const page = lessonPages[currentPage];
    // const isCorrect = page?.options?.find(o => o.id === answerId)?.correct;

    setTimeout(() => {
      if (currentPage === lessonPages.length - 1) setLessonCompleted(true);
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
      listener: (e) => {
        const pageIndex = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
        if (pageIndex !== currentPage) {
          setCurrentPage(pageIndex);
          handlePageChange(pageIndex);
          setQuizAnswer(null);
        }
      },
    }
  );

  const canProceed = () => {
    const page = lessonPages[currentPage];
    return page?.type === 'quiz' ? quizAnswer !== null : true;
  };

  if (!lesson && lessonId) {
    return (
      <View style={[styles.container, { paddingTop: insets.top, alignItems: 'center', justifyContent: 'center' }]}>
        <Text>Lesson not found for id: {String(lessonId)}</Text>
        <TouchableOpacity onPress={onBack} style={{ marginTop: 12 }}>
          <Text style={{ color: '#667eea', fontWeight: '600' }}>← Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lesson: {title}</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Progress Indicator */}
      <ProgressIndicator currentPage={currentPage} totalPages={lessonPages.length} scrollX={scrollX} />

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
        getItemLayout={(_, index) => ({ length: screenWidth, offset: screenWidth * index, index })}
      />

      {/* Navigation Controls */}
      <View style={[styles.navigationControls, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={[styles.navButton, currentPage === 0 && styles.disabledButton]}
          onPress={handlePrevious}
          disabled={currentPage === 0}
          activeOpacity={0.7}
        >
          <Text style={[styles.navButtonText, currentPage === 0 && styles.disabledText]}>Previous</Text>
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
          <Text style={[styles.nextButtonText, !canProceed() && styles.disabledText]}>
            {currentPage === lessonPages.length - 1 ? (lessonCompleted ? 'Complete Lesson' : 'Finish') : 'Next'}
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