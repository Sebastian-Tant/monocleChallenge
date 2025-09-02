// screens/LearnScreen.js
import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  AppState, // ← use this instead of useIsFocused
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { getLessons, getLessonById, getTracks } from './data/index';
import { db } from '../firebase';
import auth from '@react-native-firebase/auth';

const LearnScreen = ({ onStartLesson }) => {
  const { t } = useTranslation();

  // tracks (booklets) and raw lessons map for quick lookup
  const tracks = useMemo(() => getTracks(), []);
  const lessonsArray = useMemo(() => getLessons(), []);
  const lessonsById = useMemo(
    () => Object.fromEntries(lessonsArray.map(l => [l.id, l])),
    [lessonsArray],
  );

  // Achievements (+ booklet-completion badge)
  const [achievements, setAchievements] = useState([
    {
      id: 1,
      title: t('learnScreen.achievements.firstLesson.title'),
      description: t('learnScreen.achievements.firstLesson.description'),
      unlocked: false,
    },
    {
      id: 2,
      title: t('learnScreen.achievements.quizMaster.title'),
      description: t('learnScreen.achievements.quizMaster.description'),
      unlocked: false,
    },
    {
      id: 3,
      title: t('learnScreen.achievements.knowledgeSeeker.title'),
      description: t('learnScreen.achievements.knowledgeSeeker.description'),
      unlocked: false,
    },
    {
      id: 4,
      title: 'Taxes & Retirement — Booklet Complete',
      description: 'Finish all lessons in the Taxes & Retirement Basics booklet.',
      unlocked: false,
    },
  ]);
  const [rewardCollected, setRewardCollected] = useState(false);

  // track expand/collapse UI
  const [expandedTrackIds, setExpandedTrackIds] = useState(
    () => new Set(tracks.length ? [tracks[0].id] : []), // expand first booklet by default
  );

  // user progress state used for locking & progress bars
  const [completedLessons, setCompletedLessons] = useState([]); // ['compounding-basics', ...]
  const [lessonsProgressMap, setLessonsProgressMap] = useState({}); // { [id]: 0..100 }

  // ------- Booklet helpers -------
  const isLessonCompleted = lessonId => completedLessons.includes(lessonId);
  const lessonProgress = lessonId =>
    typeof lessonsProgressMap[lessonId] === 'number'
      ? lessonsProgressMap[lessonId]
      : isLessonCompleted(lessonId)
      ? 100
      : 0;

  // unlock rule: in a track, lesson N unlocks only if all previous are completed
  const isLessonUnlockedInTrack = (track, lessonId) => {
    const order = track.lessonIds;
    const idx = order.indexOf(lessonId);
    if (idx < 0) return true; // not found; default allow
    if (idx === 0) return true; // first lesson always unlocked
    const required = order.slice(0, idx);
    return required.every(id => isLessonCompleted(id));
  };

  // Is a whole track complete?
  const isTrackComplete = (trackId, completedIds) => {
    const track = tracks.find(t => t.id === trackId);
    if (!track) return false;
    return track.lessonIds.every(id => completedIds.includes(id));
  };

  // Keep your completion writer (call it from LessonDetailScreen via onComplete if you want)
  const handleLessonCompletion = async (lessonId, difficulty, _result) => {
    try {
      const user = auth().currentUser;
      if (!user) {
        Alert.alert(
          t('learnScreen.errors.error'),
          t('learnScreen.errors.noUserSignedIn'),
        );
        return;
      }
      const userId = user.uid;

      const userDocRef = db.collection('users').doc(userId);
      const userDoc = await userDocRef.get();

      if (!userDoc.exists) {
        Alert.alert(
          t('learnScreen.errors.error'),
          t('learnScreen.errors.userDocumentNotFound'),
        );
        return;
      }

      const data = userDoc.data();
      const updatedLessonsCompleted = Array.from(
        new Set([...(data.lessonsCompleted || []), lessonId]),
      );
      const updatedDifficulties = {
        ...(data.completedDifficulties || { Beginner: false, Intermediate: false }),
        [difficulty]: true,
      };

      // compute which tracks (booklets) are now complete
      const newlyCompletedTrackIds = tracks
        .filter(tr => tr.lessonIds.every(id => updatedLessonsCompleted.includes(id)))
        .map(tr => tr.id);

      // Merge with any existing tracksCompleted map
      const prevTracksCompleted = data.tracksCompleted || {};
      const mergedTracksCompleted = { ...prevTracksCompleted };
      let anyNewTrack = false;
      for (const tid of newlyCompletedTrackIds) {
        if (!mergedTracksCompleted[tid]) {
          mergedTracksCompleted[tid] = true;
          anyNewTrack = true;
        }
      }

      // Build update payload
      const updatePayload = {
        lessonsCompleted: updatedLessonsCompleted,
        completedDifficulties: updatedDifficulties,
        [`lessonsProgress.${lessonId}`]: 100, // mark lesson as fully completed visually
      };
      if (anyNewTrack) {
        updatePayload.tracksCompleted = mergedTracksCompleted; // persist booklet completion
      }

      await userDocRef.update(updatePayload);

      // local sync
      setCompletedLessons(updatedLessonsCompleted);
      setLessonsProgressMap(prev => ({ ...prev, [lessonId]: 100 }));

      // achievements refresh (use persisted OR computed status)
      const taxTrackDoneNow =
        mergedTracksCompleted['track-tax-retire'] ||
        isTrackComplete('track-tax-retire', updatedLessonsCompleted);

      setAchievements(prevAchievements =>
        prevAchievements.map(achievement => {
          if (achievement.id === 1)
            return {
              ...achievement,
              title: t('learnScreen.achievements.firstLesson.title'),
              description: t('learnScreen.achievements.firstLesson.description'),
              unlocked: updatedLessonsCompleted.length >= 1,
            };
          if (achievement.id === 2)
            return {
              ...achievement,
              title: t('learnScreen.achievements.quizMaster.title'),
              description: t('learnScreen.achievements.quizMaster.description'),
              unlocked: updatedDifficulties.Intermediate,
            };
          if (achievement.id === 3)
            return {
              ...achievement,
              title: t('learnScreen.achievements.knowledgeSeeker.title'),
              description: t('learnScreen.achievements.knowledgeSeeker.description'),
              unlocked: updatedLessonsCompleted.length >= 5,
            };
          if (achievement.id === 4)
            return { ...achievement, unlocked: !!taxTrackDoneNow };
          return achievement;
        }),
      );

      // Optional: celebrate first-time completion of the Taxes & Retirement booklet
      if (anyNewTrack && mergedTracksCompleted['track-tax-retire']) {
        Alert.alert('Congrats!', 'You completed Taxes & Retirement Basics 🎉');
      }
    } catch (error) {
      console.log('Error updating lesson completion:', error);
      Alert.alert(
        t('learnScreen.errors.error'),
        t('learnScreen.errors.failedToUpdateProgress'),
      );
    }
  };

  // ----- Fetch progress & achievements (refetch on foreground) -----
  const fetchUserProgress = async () => {
    try {
      const user = auth().currentUser;
      if (!user) return;
      const userId = user.uid;

      const userDoc = await db.collection('users').doc(userId).get();
      if (!userDoc.exists) return;

      const data = userDoc.data();
      const completed = data.lessonsCompleted || [];
      const completedDifficulties = data.completedDifficulties || {
        Beginner: false,
        Intermediate: false,
      };
      const rewardStatus = data.reward?.collected || false;
      const lp = data.lessonsProgress || {};
      const tracksCompleted = data.tracksCompleted || {};

      setCompletedLessons(completed);
      setLessonsProgressMap(lp);

      // Prefer persisted flag; fall back to computed
      const taxTrackDone =
        tracksCompleted['track-tax-retire'] ||
        isTrackComplete('track-tax-retire', completed);

      setAchievements(prev =>
        prev.map(achievement => {
          if (achievement.id === 1)
            return {
              ...achievement,
              title: t('learnScreen.achievements.firstLesson.title'),
              description: t('learnScreen.achievements.firstLesson.description'),
              unlocked: completed.length >= 1,
            };
          if (achievement.id === 2)
            return {
              ...achievement,
              title: t('learnScreen.achievements.quizMaster.title'),
              description: t('learnScreen.achievements.quizMaster.description'),
              unlocked: completedDifficulties.Intermediate,
            };
          if (achievement.id === 3)
            return {
              ...achievement,
              title: t('learnScreen.achievements.knowledgeSeeker.title'),
              description: t('learnScreen.achievements.knowledgeSeeker.description'),
              unlocked: completed.length >= 5,
            };
          if (achievement.id === 4)
            return { ...achievement, unlocked: !!taxTrackDone };
          return achievement;
        }),
      );

      setRewardCollected(rewardStatus);
    } catch (error) {
      console.log('Error fetching user data:', error);
    }
  };

  // run once on mount / when locale changes
  useEffect(() => { fetchUserProgress(); }, [t]);

  // ALSO refetch whenever the app returns to foreground
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') fetchUserProgress();
    });
    return () => sub.remove();
  }, []);

  const handleCollectReward = async () => {
    try {
      const user = auth().currentUser;
      if (!user) {
        Alert.alert(
          t('learnScreen.errors.error'),
          t('learnScreen.errors.noUserSignedIn'),
        );
        return;
      }
      const userId = user.uid;

      const userDocRef = db.collection('users').doc(userId);
      const userDoc = await userDocRef.get();

      if (userDoc.exists) {
        const data = userDoc.data();
        const isAllAchieved = achievements.every(achievement => achievement.unlocked);
        const isCollected = data.reward?.collected || false;

        if (isAllAchieved && !isCollected) {
          await userDocRef.update({ 'reward.collected': true });
          setRewardCollected(true);
          Alert.alert(
            t('learnScreen.reward.collected'),
            t('learnScreen.reward.collectedMessage'),
          );
        } else if (isCollected) {
          Alert.alert(
            t('learnScreen.reward.alreadyCollected'),
            t('learnScreen.reward.alreadyCollectedMessage'),
          );
        } else {
          Alert.alert(
            t('learnScreen.reward.notEligible'),
            t('learnScreen.reward.notEligibleMessage'),
          );
        }
      }
    } catch (error) {
      console.log('Error collecting reward:', error);
      Alert.alert(
        t('learnScreen.errors.error'),
        t('learnScreen.errors.failedToCollectReward'),
      );
    }
  };

  const toggleTrack = trackId => {
    setExpandedTrackIds(prev => {
      const copy = new Set(Array.from(prev));
      if (copy.has(trackId)) copy.delete(trackId);
      else copy.add(trackId);
      return copy;
    });
  };

  const onPressLessonCard = (track, lessonId) => {
    const unlocked = isLessonUnlockedInTrack(track, lessonId);
    if (!unlocked) {
      Alert.alert('Locked', 'Complete the previous lesson to unlock this one.');
      return;
    }
    if (onStartLesson) onStartLesson(lessonId); // do NOT mark completion here
  };

  const renderLessonCard = (track, lessonId) => {
    const lesson = lessonsById[lessonId] || getLessonById(lessonId);
    if (!lesson) return null;

    const unlocked = isLessonUnlockedInTrack(track, lessonId);
    const completed = isLessonCompleted(lessonId);
    const progress = lessonProgress(lessonId);

    return (
      <TouchableOpacity
        key={lessonId}
        style={[styles.lessonCard, !unlocked && styles.lockedCard]}
        onPress={() => onPressLessonCard(track, lessonId)}
        activeOpacity={0.8}
        disabled={!unlocked}
      >
        <View style={styles.lessonHeader}>
          <View style={styles.lessonTitleContainer}>
            <Text style={styles.lessonTitle}>{lesson.title}</Text>
            {completed && (
              <Text style={styles.completedBadge}>
                {t('learnScreen.lesson.completed')}
              </Text>
            )}
            {!unlocked && <Text style={styles.lockedBadge}>🔒 Locked</Text>}
          </View>
          <View style={styles.lessonMeta}>
            <Text style={styles.duration}>{lesson.duration}</Text>
            <View
              style={[
                styles.difficultyBadge,
                lesson.difficulty === 'Beginner' && styles.beginnerBadge,
                lesson.difficulty === 'Intermediate' && styles.intermediateBadge,
                lesson.difficulty === 'Advanced' && styles.advancedBadge,
              ]}
            >
              <Text
                style={[
                  styles.difficultyText,
                  lesson.difficulty === 'Beginner' && styles.beginnerText,
                  lesson.difficulty === 'Intermediate' && styles.intermediateText,
                  lesson.difficulty === 'Advanced' && styles.advancedText,
                ]}
              >
                {lesson.difficulty}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.lessonDescription}>{lesson.description}</Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={[styles.progressText, completed && { color: '#10b981' }]}>
            {progress}% {t('learnScreen.lesson.complete')}
          </Text>
        </View>

        {!unlocked && (
          <Text style={styles.lockedHint}>
            Finish the previous lesson to unlock this one.
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  const renderTrackCard = track => {
    const completedCount = track.lessonIds.filter(id => isLessonCompleted(id)).length;
    const total = track.lessonIds.length;
    const expanded = expandedTrackIds.has(track.id);

    return (
      <View key={track.id} style={styles.trackCard}>
        <TouchableOpacity
          style={styles.trackHeader}
          onPress={() => toggleTrack(track.id)}
          activeOpacity={0.8}
        >
          <View style={styles.trackHeaderRow}>
            <Text style={styles.trackTitle}>{track.title}</Text>
            <Text style={styles.expandIcon}>{expanded ? '▾' : '▸'}</Text>
          </View>
          <Text style={styles.trackDescription}>{track.description}</Text>
          <Text style={styles.trackProgressLabel}>
            {completedCount}/{total} completed
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${(completedCount / total) * 100}%` },
              ]}
            />
          </View>
        </TouchableOpacity>

        {expanded && (
          <View style={styles.lessonsContainer}>
            {track.lessonIds.map(lessonId => renderLessonCard(track, lessonId))}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Booklets / Tracks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Courses & Booklets</Text>
          {tracks.map(tr => renderTrackCard(tr))}
        </View>

        {/* Achievements Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('learnScreen.sections.achievements')}
          </Text>
          <View style={styles.achievementsContainer}>
            {achievements.map(achievement => (
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
                  <Text
                    style={[
                      styles.achievementTitle,
                      !achievement.unlocked && styles.lockedText,
                    ]}
                  >
                    {achievement.title}
                  </Text>
                  <Text
                    style={[
                      styles.achievementDescription,
                      !achievement.unlocked && styles.lockedText,
                    ]}
                  >
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
              (!achievements.every(achievement => achievement.unlocked) ||
                rewardCollected) &&
                styles.disabledButton,
            ]}
            onPress={handleCollectReward}
            disabled={
              !achievements.every(achievement => achievement.unlocked) ||
              rewardCollected
            }
          >
            <Text style={styles.rewardButtonText}>
              {t('learnScreen.reward.collectReward')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tips Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('learnScreen.sections.learningTips')}
          </Text>
          <View style={styles.tipsContainer}>
            <View style={styles.tipCard}>
              <Text style={styles.tipEmoji}>💡</Text>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>
                  {t('learnScreen.tips.takeYourTime.title')}
                </Text>
                <Text style={styles.tipDescription}>
                  {t('learnScreen.tips.takeYourTime.description')}
                </Text>
              </View>
            </View>

            <View style={styles.tipCard}>
              <Text style={styles.tipEmoji}>🔄</Text>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>
                  {t('learnScreen.tips.practiceMakesPerfect.title')}
                </Text>
                <Text style={styles.tipDescription}>
                  {t('learnScreen.tips.practiceMakesPerfect.description')}
                </Text>
              </View>
            </View>

            <View style={styles.tipCard}>
              <Text style={styles.tipEmoji}>📱</Text>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>
                  {t('learnScreen.tips.learnDaily.title')}
                </Text>
                <Text style={styles.tipDescription}>
                  {t('learnScreen.tips.learnDaily.description')}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles
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

  // Track / booklet
  trackCard: {
    backgroundColor: 'white',
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  trackHeader: {},
  trackHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  trackTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  trackDescription: { marginTop: 6, color: '#475569' },
  trackProgressLabel: { marginTop: 10, fontSize: 12, color: '#64748b' },
  expandIcon: { fontSize: 18, color: '#334155' },

  lessonsContainer: { paddingTop: 12, gap: 16 },

  // Lesson card
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
  lockedCard: { opacity: 0.7 },

  lessonHeader: { marginBottom: 12 },
  lessonTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'flex-start',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginRight: 12,
    maxWidth: '100%',
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
  lockedBadge: {
    fontSize: 12,
    color: '#ef4444',
    backgroundColor: '#fef2f2',
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
  advancedBadge: { backgroundColor: '#e0e7ff' },
  difficultyText: { fontSize: 12, fontWeight: '500' },
  beginnerText: { color: '#10b981' },
  intermediateText: { color: '#f59e0b' },
  advancedText: { color: '#6366f1' },

  lessonDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 16,
  },
  progressContainer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
  },
  progressFill: { height: '100%', backgroundColor: '#10b981', borderRadius: 3 },
  progressText: { fontSize: 12, color: '#10b981', fontWeight: '500' },
  lockedHint: { marginTop: 8, fontSize: 12, color: '#ef4444' },

  // Achievements
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

  // Tips
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
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  tipDescription: { fontSize: 14, color: '#64748b', lineHeight: 20 },

  // Reward button
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
