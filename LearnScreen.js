// screens/LearnScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

const LearnScreen = ({ onStartLesson }) => {
  const lessons = [
    {
      id: 1,
      title: 'The Magic of Compounding',
      description: 'Learn how your money can grow exponentially over time through the power of compound interest.',
      progress: 0,
      duration: '5 min',
      difficulty: 'Beginner',
      completed: false,
    },
    {
      id: 2,
      title: 'Understanding Risk and Return',
      description: 'Discover the relationship between risk and potential rewards in investing.',
      progress: 0,
      duration: '7 min',
      difficulty: 'Beginner',
      completed: false,
    },
    {
      id: 3,
      title: 'Building Your First Portfolio',
      description: 'Create a diversified investment portfolio that matches your goals and risk tolerance.',
      progress: 0,
      duration: '10 min',
      difficulty: 'Intermediate',
      completed: false,
    },
    {
      id: 4,
      title: 'Emergency Funds Explained',
      description: 'Why you need an emergency fund and how much to save before investing.',
      progress: 0,
      duration: '6 min',
      difficulty: 'Beginner',
      completed: false,
    },
    {
      id: 5,
      title: 'Tax-Efficient Investing',
      description: 'Learn about tax-free savings accounts and other tax-efficient investment strategies.',
      progress: 0,
      duration: '8 min',
      difficulty: 'Intermediate',
      completed: false,
    },
  ];

  const achievements = [
    { id: 1, title: 'First Lesson', description: 'Complete your first lesson', unlocked: false },
    { id: 2, title: 'Quiz Master', description: 'Score 100% on 3 quizzes', unlocked: false },
    { id: 3, title: 'Knowledge Seeker', description: 'Complete 5 lessons', unlocked: false },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Learn</Text>
          <Text style={styles.subtitle}>
            Interactive lessons to build your financial knowledge
          </Text>
        </View>

        {/* Progress Overview */}
        <View style={styles.progressOverview}>
          <View style={styles.progressCard}>
            <Text style={styles.progressNumber}>0</Text>
            <Text style={styles.progressLabel}>Lessons Completed</Text>
          </View>
          <View style={styles.progressCard}>
            <Text style={styles.progressNumber}>0</Text>
            <Text style={styles.progressLabel}>Achievements</Text>
          </View>
          <View style={styles.progressCard}>
            <Text style={styles.progressNumber}>0%</Text>
            <Text style={styles.progressLabel}>Overall Progress</Text>
          </View>
        </View>

        {/* Lessons Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Lessons</Text>
          <View style={styles.lessonsContainer}>
            {lessons.map((lesson) => (
              <TouchableOpacity
                key={lesson.id}
                style={styles.lessonCard}
                onPress={() => onStartLesson?.(lesson.title)}
                activeOpacity={0.8}
              >
                <View style={styles.lessonHeader}>
                  <View style={styles.lessonTitleContainer}>
                    <Text style={styles.lessonTitle}>{lesson.title}</Text>
                    {lesson.completed && (
                      <Text style={styles.completedBadge}>✓ Completed</Text>
                    )}
                  </View>
                  <View style={styles.lessonMeta}>
                    <Text style={styles.duration}>{lesson.duration}</Text>
                    <View style={[
                      styles.difficultyBadge,
                      lesson.difficulty === 'Beginner' && styles.beginnerBadge,
                      lesson.difficulty === 'Intermediate' && styles.intermediateBadge,
                    ]}>
                      <Text style={[
                        styles.difficultyText,
                        lesson.difficulty === 'Beginner' && styles.beginnerText,
                        lesson.difficulty === 'Intermediate' && styles.intermediateText,
                      ]}>
                        {lesson.difficulty}
                      </Text>
                    </View>
                  </View>
                </View>
                
                <Text style={styles.lessonDescription}>{lesson.description}</Text>
                
                {lesson.progress > 0 ? (
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View 
                        style={[styles.progressFill, { width: `${lesson.progress}%` }]} 
                      />
                    </View>
                    <Text style={styles.progressText}>{lesson.progress}% complete</Text>
                  </View>
                ) : (
                  <TouchableOpacity 
                    style={styles.startButton}
                    onPress={() => onStartLesson?.(lesson.title)}
                  >
                    <Text style={styles.startButtonText}>Start Lesson</Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Achievements Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsContainer}>
            {achievements.map((achievement) => (
              <View 
                key={achievement.id} 
                style={[
                  styles.achievementCard,
                  !achievement.unlocked && styles.lockedAchievement
                ]}
              >
                <View style={styles.achievementIcon}>
                  <Text style={styles.achievementEmoji}>
                    {achievement.unlocked ? '🏆' : '🔒'}
                  </Text>
                </View>
                <View style={styles.achievementContent}>
                  <Text style={[
                    styles.achievementTitle,
                    !achievement.unlocked && styles.lockedText
                  ]}>
                    {achievement.title}
                  </Text>
                  <Text style={[
                    styles.achievementDescription,
                    !achievement.unlocked && styles.lockedText
                  ]}>
                    {achievement.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Tips Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Learning Tips</Text>
          <View style={styles.tipsContainer}>
            <View style={styles.tipCard}>
              <Text style={styles.tipEmoji}>💡</Text>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Take Your Time</Text>
                <Text style={styles.tipDescription}>
                  Don't rush through lessons. Take time to understand each concept.
                </Text>
              </View>
            </View>
            
            <View style={styles.tipCard}>
              <Text style={styles.tipEmoji}>🔄</Text>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Practice Makes Perfect</Text>
                <Text style={styles.tipDescription}>
                  Revisit lessons and try the interactive elements multiple times.
                </Text>
              </View>
            </View>
            
            <View style={styles.tipCard}>
              <Text style={styles.tipEmoji}>📱</Text>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Learn Daily</Text>
                <Text style={styles.tipDescription}>
                  Spend just 5-10 minutes daily to build your financial knowledge.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  screenTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 22,
  },
  progressOverview: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 32,
    gap: 12,
  },
  progressCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  progressNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#667eea',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  lessonsContainer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  lessonCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lessonHeader: {
    marginBottom: 12,
  },
  lessonTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
    marginRight: 12,
  },
  completedBadge: {
    fontSize: 12,
    color: '#10b981',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontWeight: '500',
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  duration: {
    fontSize: 12,
    color: '#64748b',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  beginnerBadge: {
    backgroundColor: '#f0fdf4',
  },
  intermediateBadge: {
    backgroundColor: '#fef3c7',
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '500',
  },
  beginnerText: {
    color: '#10b981',
  },
  intermediateText: {
    color: '#f59e0b',
  },
  lessonDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '500',
  },
  startButton: {
    backgroundColor: '#667eea',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  startButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  achievementsContainer: {
    paddingHorizontal: 24,
    gap: 12,
  },
  achievementCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  lockedAchievement: {
    opacity: 0.6,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementEmoji: {
    fontSize: 20,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#64748b',
  },
  lockedText: {
    color: '#94a3b8',
  },
  tipsContainer: {
    paddingHorizontal: 24,
    gap: 12,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tipEmoji: {
    fontSize: 24,
    marginRight: 12,
    marginTop: 2,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
});

export default LearnScreen;