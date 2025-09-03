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
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { getLessons, getLessonById, getTracks } from './data/index';
import { db } from '../firebase';
import auth from '@react-native-firebase/auth';
import i18n from '../i18n';

// ------- Rewards Catalog (data bundles in MB; tweak anytime) -------
const REWARD_CATALOG = {
  'track-budgeting':   { dataMB: 500,  label: 'Budgeting & Cash Flow' },
  'track-tax-retire':  { dataMB: 700,  label: 'Taxes & Retirement Basics' },
  'track-credit':      { dataMB: 800,  label: 'Credit & Borrowing' },
  'track-investing':   { dataMB: 1000, label: 'Investing & Wealth Building (SA)' },
  GRAND_REWARD_MB: 3000, // big grand reward (≈3GB)
};

// Pretty print MB/GB (SI-ish: 1000 MB = 1 GB)
const formatData = (mb) => {
  if (mb >= 1000) {
    const gb = mb / 1000;
    const str = Number.isInteger(gb) ? String(gb) : gb.toFixed(1);
    return `${str} GB`;
  }
  return `${mb} MB`;
};

const LearnScreen = ({ onStartLesson }) => {
  const { t } = useTranslation();

  // Tracks (booklets) and raw lessons map
  const lessonsArray = useMemo(() => getLessons(), [i18n.language]);
const tracks = useMemo(() => getTracks(), [i18n.language]);
  const lessonsById = useMemo(
    () => Object.fromEntries(lessonsArray.map(l => [l.id, l])),
    [lessonsArray],
  );

  // ------- Helpers -------
  const isTrackComplete = (trackId, completedIds) => {
    const track = tracks.find(tr => tr.id === trackId);
    if (!track) return false;
    return track.lessonIds.every(id => completedIds.includes(id));
  };

  // Build base + dynamic achievements (unlocked is set later)
  const baseAchievementDefs = useMemo(() => {
    const base = [
      {
        id: 'ach:first-lesson',
        title: t('learnScreen.achievements.firstLesson.title'),
        description: t('learnScreen.achievements.firstLesson.description'),
      },
      {
        id: 'ach:quiz-master',
        title: t('learnScreen.achievements.quizMaster.title'),
        description: t('learnScreen.achievements.quizMaster.description'),
      },
      {
        id: 'ach:knowledge-seeker',
        title: t('learnScreen.achievements.knowledgeSeeker.title'),
        description: t('learnScreen.achievements.knowledgeSeeker.description'),
      },
    ];

    const booklet = tracks.map(tr => ({
      id: `track:${tr.id}`,
      title: t('learnScreen.achievements.bookletCompleteTitle', { title: tr.title }),
      description: t('learnScreen.achievements.bookletCompleteDescription', { title: tr.title }),
    }));

    const grand = [
      {
        id: 'ach:grand',
        title: t('learnScreen.achievements.grand.title'),
        description: t('learnScreen.achievements.grand.description'),
      },
    ];

    return [...base, ...booklet, ...grand];
  }, [tracks, t]);

  // State: achievements with unlocked flags
  const [achievements, setAchievements] = useState(
    baseAchievementDefs.map(a => ({ ...a, unlocked: false })),
  );

  // Rewards state
  const [rewardsBooklets, setRewardsBooklets] = useState({}); // { [trackId]: true }
  const [rewardGrandCollected, setRewardGrandCollected] = useState(false);

  // Track UI expand/collapse
  const [expandedTrackIds, setExpandedTrackIds] = useState(
    () => new Set(tracks.length ? [tracks[0].id] : []),
  );

  // Progress state
  const [completedLessons, setCompletedLessons] = useState([]);
  const [lessonsProgressMap, setLessonsProgressMap] = useState({});

  // ------- Locking helpers -------
  const isLessonCompleted = lessonId => completedLessons.includes(lessonId);
  const lessonProgress = lessonId =>
    typeof lessonsProgressMap[lessonId] === 'number'
      ? lessonsProgressMap[lessonId]
      : isLessonCompleted(lessonId)
      ? 100
      : 0;

  const isLessonUnlockedInTrack = (track, lessonId) => {
    const order = track.lessonIds;
    const idx = order.indexOf(lessonId);
    if (idx < 0) return true;
    if (idx === 0) return true;
    const required = order.slice(0, idx);
    return required.every(id => isLessonCompleted(id));
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
      Alert.alert(
        t('learnScreen.labels.locked'),
        t('learnScreen.lockedHint'),
      );
      return;
    }
    if (onStartLesson) onStartLesson(lessonId);
  };

  // ------- Compute & fetch user progress -------
  const recomputeAchievements = (completed, completedDifficulties, tracksCompletedObj = {}) => {
    const trackDoneSet = new Set(
      tracks
        .filter(tr => tracksCompletedObj[tr.id] || isTrackComplete(tr.id, completed))
        .map(tr => tr.id),
    );

    const firstLesson = completed.length >= 1;
    const quizMaster = !!completedDifficulties?.Intermediate;
    const knowledgeSeeker = completed.length >= 5;

    const unlockedById = new Map();
    unlockedById.set('ach:first-lesson', firstLesson);
    unlockedById.set('ach:quiz-master', quizMaster);
    unlockedById.set('ach:knowledge-seeker', knowledgeSeeker);
    tracks.forEach(tr => unlockedById.set(`track:${tr.id}`, trackDoneSet.has(tr.id)));

    const allOthersUnlocked = baseAchievementDefs
      .filter(a => a.id !== 'ach:grand')
      .every(a => unlockedById.get(a.id));
    unlockedById.set('ach:grand', allOthersUnlocked);

    const next = baseAchievementDefs.map(a => ({
      ...a,
      unlocked: !!unlockedById.get(a.id),
    }));
    setAchievements(next);
  };

  useEffect(() => {
    const fetchUserProgress = async () => {
      try {
        const user = auth().currentUser;
        if (!user) return;
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (!userDoc.exists) return;

        const data = userDoc.data();
        const completed = data.lessonsCompleted || [];
        const completedDifficulties =
          data.completedDifficulties || { Beginner: false, Intermediate: false };
        const lp = data.lessonsProgress || {};
        const rewards = data.rewards || {};
        const tracksCompleted = data.tracksCompleted || {};

        setCompletedLessons(completed);
        setLessonsProgressMap(lp);
        setRewardsBooklets(rewards.booklets || {});
        setRewardGrandCollected(!!(rewards.grand || data?.reward?.collected));

        recomputeAchievements(completed, completedDifficulties, tracksCompleted);
      } catch (e) {
        console.log('Error fetching user data:', e);
      }
    };
    fetchUserProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  // ------- Collect Rewards (data bundles) -------
  const handleCollectTrackReward = async (trackId) => {
    try {
      const user = auth().currentUser;
      if (!user) {
        Alert.alert(t('learnScreen.errors.error'), t('learnScreen.errors.noUserSignedIn'));
        return;
      }

      const eligible = isTrackComplete(trackId, completedLessons);
      if (!eligible) {
        Alert.alert(
          t('learnScreen.rewards.notYet.title'),
          t('learnScreen.rewards.notYet.booklet'),
        );
        return;
      }
      if (rewardsBooklets?.[trackId]) {
        Alert.alert(
          t('learnScreen.rewards.alreadyCollected.title'),
          t('learnScreen.rewards.alreadyCollected.message'),
        );
        return;
      }

      const userDocRef = db.collection('users').doc(user.uid);
      const snap = await userDocRef.get();
      const data = snap.exists ? snap.data() : {};
      const rewardMB = REWARD_CATALOG[trackId]?.dataMB ?? 500;

      await userDocRef.update({
        [`rewards.booklets.${trackId}`]: true,
        dataBalanceMB: (data?.dataBalanceMB || 0) + rewardMB,
      });

      setRewardsBooklets(prev => ({ ...prev, [trackId]: true }));
      Alert.alert(
        t('learnScreen.rewards.collectedToast.title'),
        t('learnScreen.rewards.collectedToast.message', { amount: formatData(rewardMB) }),
      );
    } catch (e) {
      console.log('handleCollectTrackReward error:', e);
      Alert.alert(t('learnScreen.errors.error'), t('learnScreen.errors.failedToCollectReward'));
    }
  };

  const handleCollectGrandReward = async () => {
    try {
      const user = auth().currentUser;
      if (!user) {
        Alert.alert(t('learnScreen.errors.error'), t('learnScreen.errors.noUserSignedIn'));
        return;
      }

      const allUnlocked = achievements
        .filter(a => a.id !== 'ach:grand')
        .every(a => a.unlocked);
      if (!allUnlocked) {
        Alert.alert(
          t('learnScreen.rewards.notYet.title'),
          t('learnScreen.rewards.notYet.grand'),
        );
        return;
      }
      if (rewardGrandCollected) {
        Alert.alert(
          t('learnScreen.rewards.alreadyCollected.title'),
          t('learnScreen.rewards.alreadyCollected.message'),
        );
        return;
      }

      const userDocRef = db.collection('users').doc(user.uid);
      const snap = await userDocRef.get();
      const data = snap.exists ? snap.data() : {};
      const bonusMB = REWARD_CATALOG.GRAND_REWARD_MB;

      await userDocRef.update({
        'rewards.grand': true,
        'reward.collected': true, // legacy compat
        dataBalanceMB: (data?.dataBalanceMB || 0) + bonusMB,
      });

      setRewardGrandCollected(true);
      Alert.alert(
        t('learnScreen.rewards.grand.collectedTitle'),
        t('learnScreen.rewards.collectedToast.message', { amount: formatData(bonusMB) }),
      );
    } catch (e) {
      console.log('handleCollectGrandReward error:', e);
      Alert.alert(t('learnScreen.errors.error'), t('learnScreen.errors.failedToCollectReward'));
    }
  };

  // ------- Rendering -------
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
            {!unlocked && <Text style={styles.lockedBadge}>🔒 {t('learnScreen.labels.locked')}</Text>}
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
            {t('learnScreen.lockedHint')}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  const renderTrackCard = track => {
    const completedCount = track.lessonIds.filter(id => isLessonCompleted(id)).length;
    const total = track.lessonIds.length;
    const expanded = expandedTrackIds.has(track.id);
    const trackComplete = completedCount === total && total > 0;
    const trackRewardCollected = !!rewardsBooklets[track.id];
    const rewardMB = REWARD_CATALOG[track.id]?.dataMB ?? 0;

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
            {t('learnScreen.tracks.progressLabel', { completed: completedCount, total })}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${total ? (completedCount / total) * 100 : 0}%` },
              ]}
            />
          </View>
        </TouchableOpacity>

        {/* Reward row with neutral styling */}
        <View style={styles.trackRewardRow}>
          <Text style={styles.rewardHint}>
            {t('learnScreen.rewards.rewardHint', { amount: formatData(rewardMB) })}
          </Text>
          <TouchableOpacity
            style={[
              styles.trackRewardButton,
              (!trackComplete || trackRewardCollected) && styles.disabledButton,
            ]}
            disabled={!trackComplete || trackRewardCollected}
            onPress={() => handleCollectTrackReward(track.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.trackRewardButtonText}>
              {trackRewardCollected
                ? t('learnScreen.rewards.collected')
                : t('learnScreen.rewards.collect')}
            </Text>
          </TouchableOpacity>
        </View>

        {expanded && (
          <View style={styles.lessonsContainer}>
            {track.lessonIds.map(lessonId => renderLessonCard(track, lessonId))}
          </View>
        )}
      </View>
    );
  };

  const allNonGrandUnlocked = achievements
    .filter(a => a.id !== 'ach:grand')
    .every(a => a.unlocked);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Booklets / Tracks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('learnScreen.sections.courses')}</Text>
          {tracks.map(tr => renderTrackCard(tr))}
        </View>

        {/* Achievements */}
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
        </View>

        {/* Rewards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('learnScreen.sections.rewards')}</Text>

          {/* Grand reward (neutral button) */}
          <View style={[styles.rewardCard, !allNonGrandUnlocked && styles.lockedAchievement]}>
            <View style={styles.achievementIcon}>
              <Text style={styles.achievementEmoji}>
                {rewardGrandCollected ? '🌟' : '🏅'}
              </Text>
            </View>
            <View style={styles.rewardContent}>
              <Text style={styles.achievementTitle}>{t('learnScreen.rewards.grandTitle')}</Text>
              <Text style={styles.achievementDescription}>
                {t('learnScreen.rewards.grandDescription', {
                  amount: formatData(REWARD_CATALOG.GRAND_REWARD_MB),
                })}
              </Text>
              <TouchableOpacity
                style={[
                  styles.rewardButton,
                  (!allNonGrandUnlocked || rewardGrandCollected) && styles.disabledButton,
                ]}
                onPress={handleCollectGrandReward}
                disabled={!allNonGrandUnlocked || rewardGrandCollected}
              >
                <Text style={styles.rewardButtonText}>
                  {rewardGrandCollected
                    ? t('learnScreen.rewards.collected')
                    : t('learnScreen.rewards.collect')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Tips */}
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

  // Reward row (per-track)
  trackRewardRow: {
    marginTop: 12,
    alignItems: 'flex-start',
  },
  rewardHint: { fontSize: 12, color: '#475569', marginBottom: 8 },
  trackRewardButton: {
    backgroundColor: '#64748b', // neutral slate
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  trackRewardButtonText: { color: 'white', fontSize: 14, fontWeight: '600' },

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

  // Rewards (grand)
  rewardCard: {
    backgroundColor: 'white',
    marginHorizontal: 24,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  rewardContent: { flex: 1 },
  rewardButton: {
    backgroundColor: '#64748b', // neutral slate
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  disabledButton: {
    backgroundColor: '#cbd5e1',
    opacity: 0.6,
  },
  rewardButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

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
});

export default LearnScreen;
