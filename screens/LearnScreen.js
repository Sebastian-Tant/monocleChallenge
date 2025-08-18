import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { lessons } from './data/index';
import { db } from '../firebase';
import auth from '@react-native-firebase/auth';

const LearnScreen = ({ onStartLesson }) => {
  const [achievements, setAchievements] = useState([
    { id: 1, title: 'First Lesson', description: 'Complete your first lesson', unlocked: false },
    { id: 2, title: 'Quiz Master', description: 'Complete an intermediate quiz', unlocked: false },
    { id: 3, title: 'Knowledge Seeker', description: 'Complete 5 lessons', unlocked: false },
  ]);
  const [rewardCollected, setRewardCollected] = useState(false); // New state to track reward status

  const handleLessonCompletion = async (lessonId, difficulty) => {
    try {
      const user = auth().currentUser;
      if (!user) {
        Alert.alert('Error', 'No user signed in');
        return;
      }
      const userId = user.uid;

      const userDocRef = db.collection('users').doc(userId);
      const userDoc = await userDocRef.get();

      if (userDoc.exists) {
        const data = userDoc.data();
        const updatedLessonsCompleted = [...(data.lessonsCompleted || []), lessonId];
        const updatedDifficulties = {
          ...data.completedDifficulties || { Beginner: false, Intermediate: false },
          [difficulty]: true,
        };

        await userDocRef.update({
          lessonsCompleted: updatedLessonsCompleted,
          completedDifficulties: updatedDifficulties,
        });

        const updatedDoc = await userDocRef.get();
        const updatedData = updatedDoc.data();
        const completedLessons = updatedData.lessonsCompleted || [];
        const completedDifficulties = updatedData.completedDifficulties || { Beginner: false, Intermediate: false };

        setAchievements((prevAchievements) =>
          prevAchievements.map((achievement) => {
            if (achievement.id === 1) return { ...achievement, unlocked: completedLessons.length >= 1 };
            if (achievement.id === 2) return { ...achievement, unlocked: completedDifficulties.Intermediate };
            if (achievement.id === 3) return { ...achievement, unlocked: completedLessons.length >= 5 };
            return achievement;
          })
        );
      } else {
        Alert.alert('Error', 'User document not found');
      }
    } catch (error) {
      console.log('Error updating lesson completion:', error);
      Alert.alert('Error', 'Failed to update progress');
    }
  };

  useEffect(() => {
    const fetchUserProgress = async () => {
      try {
        const user = auth().currentUser;
        if (!user) {
          console.log('No user signed in');
          return;
        }
        const userId = user.uid;

        const userDoc = await db.collection('users').doc(userId).get();

        if (userDoc.exists) {
          const data = userDoc.data();
          const completedLessons = data.lessonsCompleted || [];
          const completedDifficulties = data.completedDifficulties || { Beginner: false, Intermediate: false };
          const rewardStatus = data.reward?.collected || false; // Fetch reward status

          setAchievements((prevAchievements) =>
            prevAchievements.map((achievement) => {
              if (achievement.id === 1) return { ...achievement, unlocked: completedLessons.length >= 1 };
              if (achievement.id === 2) return { ...achievement, unlocked: completedDifficulties.Intermediate };
              if (achievement.id === 3) return { ...achievement, unlocked: completedLessons.length >= 5 };
              return achievement;
            })
          );
          setRewardCollected(rewardStatus); // Update reward state
        } else {
          console.log('No user document found');
        }
      } catch (error) {
        console.log('Error fetching user data:', error);
      }
    };

    fetchUserProgress();
  }, []);

  const handleCollectReward = async () => {
    try {
      const user = auth().currentUser;
      if (!user) {
        Alert.alert('Error', 'No user signed in');
        return;
      }
      const userId = user.uid;

      const userDocRef = db.collection('users').doc(userId);
      const userDoc = await userDocRef.get();

      if (userDoc.exists) {
        const data = userDoc.data();
        const isAllAchieved = achievements.every((achievement) => achievement.unlocked);
        const isCollected = data.reward?.collected || false;

        if (isAllAchieved && !isCollected) {
          await userDocRef.update({
            'reward.collected': true,
          });
          setRewardCollected(true);
          Alert.alert('Reward Collected', 'You’ve earned 500MB of data! Enjoy!');
        } else if (isCollected) {
          Alert.alert('Reward Already Collected', 'You’ve already claimed your 500MB reward!');
        } else {
          Alert.alert('Not Eligible', 'Complete all achievements to collect your reward!');
        }
      }
    } catch (error) {
      console.log('Error collecting reward:', error);
      Alert.alert('Error', 'Failed to collect reward');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Lessons Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Lessons</Text>
          <View style={styles.lessonsContainer}>
            {lessons.map((lesson) => (
              <TouchableOpacity
                key={lesson.id}
                style={styles.lessonCard}
                onPress={() => {
                  if (onStartLesson) {
                    onStartLesson(lesson.id);
                    handleLessonCompletion(lesson.id, lesson.difficulty);
                  }
                }}
                activeOpacity={0.8}
              >
                <View style={styles.lessonHeader}>
                  <View style={styles.lessonTitleContainer}>
                    <Text style={styles.lessonTitle}>{lesson.title}</Text>
                    {lesson.completed && <Text style={styles.completedBadge}>✓ Completed</Text>}
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
                      <View style={[styles.progressFill, { width: `${lesson.progress}%` }]} />
                    </View>
                    <Text style={styles.progressText}>{lesson.progress}% complete</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.startButton}
                    onPress={() => {
                      if (onStartLesson) {
                        onStartLesson(lesson.id);
                        handleLessonCompletion(lesson.id, lesson.difficulty);
                      }
                    }}
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
                  !achievement.unlocked && styles.lockedAchievement,
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
                    !achievement.unlocked && styles.lockedText,
                  ]}>
                    {achievement.title}
                  </Text>
                  <Text style={[
                    styles.achievementDescription,
                    !achievement.unlocked && styles.lockedText,
                  ]}>
                    {achievement.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
          {/* Collect Reward Button */}
          <TouchableOpacity
            style={[
              styles.rewardButton,
              (!achievements.every((achievement) => achievement.unlocked) || rewardCollected) && styles.disabledButton,
            ]}
            onPress={handleCollectReward}
            disabled={!achievements.every((achievement) => achievement.unlocked) || rewardCollected}
          >
            <Text style={styles.rewardButtonText}>Collect Reward</Text>
          </TouchableOpacity>
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
  container: { flex: 1, backgroundColor: '#f8fafc', paddingTop: 50 },
  scrollContent: { paddingBottom: 32 },
  section: { marginBottom: 32 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  lessonsContainer: { paddingHorizontal: 24, gap: 16 },
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
  lessonHeader: { marginBottom: 12 },
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
  lessonMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  duration: { fontSize: 12, color: '#64748b' },
  difficultyBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  beginnerBadge: { backgroundColor: '#f0fdf4' },
  intermediateBadge: { backgroundColor: '#fef3c7' },
  difficultyText: { fontSize: 12, fontWeight: '500' },
  beginnerText: { color: '#10b981' },
  intermediateText: { color: '#f59e0b' },
  lessonDescription: { fontSize: 14, color: '#64748b', lineHeight: 20, marginBottom: 16 },
  progressContainer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  progressBar: { flex: 1, height: 6, backgroundColor: '#e2e8f0', borderRadius: 3 },
  progressFill: { height: '100%', backgroundColor: '#10b981', borderRadius: 3 },
  progressText: { fontSize: 12, color: '#10b981', fontWeight: '500' },
  startButton: {
    backgroundColor: '#667eea',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  startButtonText: { color: 'white', fontSize: 14, fontWeight: '600' },
  achievementsContainer: { paddingHorizontal: 24, gap: 12 },
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
  lockedAchievement: { opacity: 0.6 },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementEmoji: { fontSize: 20 },
  achievementContent: { flex: 1 },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  achievementDescription: { fontSize: 14, color: '#64748b' },
  lockedText: { color: '#94a3b8' },
  tipsContainer: { paddingHorizontal: 24, gap: 12 },
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
  tipEmoji: { fontSize: 24, marginRight: 12, marginTop: 2 },
  tipContent: { flex: 1 },
  tipTitle: { fontSize: 16, fontWeight: '600', color: '#1e293b', marginBottom: 4 },
  tipDescription: { fontSize: 14, color: '#64748b', lineHeight: 20 },
  rewardButton: {
    backgroundColor: '#10b981',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: 'center',
    marginTop: 16,
  },
  disabledButton: {
    backgroundColor: '#a3bffa',
    opacity: 0.6,
  },
  rewardButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LearnScreen;