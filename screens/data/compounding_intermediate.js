// screens/data/compounding_intermediate.js
import i18n from '../../src/locales/i18n';
const t = (...args) => i18n.t(...args);

export const getCompoundingIntermediate = () => ({
  id: 'compounding-intermediate',
  title: t('lessons.compoundingIntermediate.title'),
  description: t('lessons.compoundingIntermediate.description'),
  duration: t('lessons.compoundingIntermediate.duration'),
  // Keep English token for logic; show localized label in the UI
  difficulty: 'Intermediate',
  difficultyLabel: t('lessons.common.levels.intermediate'),
  completed: false,
  progress: 0,
  pages: [
    // --- Teachings ---
    {
      id: 'intro',
      type: 'story',
      title: t('lessons.compoundingIntermediate.pages.intro.title'),
      content: t('lessons.compoundingIntermediate.pages.intro.content'),
      graphic: '🎯',
      backgroundColor: '#f8fafc',
    },
    {
      id: 'ear',
      type: 'story',
      title: t('lessons.compoundingIntermediate.pages.ear.title'),
      content: t('lessons.compoundingIntermediate.pages.ear.content'),
      graphic: '📊',
      backgroundColor: '#f0f9ff',
    },
    {
      id: 'frequency',
      type: 'story',
      title: t('lessons.compoundingIntermediate.pages.frequency.title'),
      content: t('lessons.compoundingIntermediate.pages.frequency.content'),
      graphic: '⏱️',
      backgroundColor: '#fefce8',
    },
    {
      id: 'contributions',
      type: 'story',
      title: t('lessons.compoundingIntermediate.pages.contributions.title'),
      content: t('lessons.compoundingIntermediate.pages.contributions.content'),
      graphic: '💸',
      backgroundColor: '#f0fdf4',
    },
    {
      id: 'debt',
      type: 'story',
      title: t('lessons.compoundingIntermediate.pages.debt.title'),
      content: t('lessons.compoundingIntermediate.pages.debt.content'),
      graphic: '⚠️',
      backgroundColor: '#fff7ed',
    },

    // --- Questions ---
    {
      id: 'quiz-1',
      type: 'quiz',
      title: t('lessons.compoundingIntermediate.pages.quiz1.title'),
      question: t('lessons.compoundingIntermediate.pages.quiz1.question'),
      options: [
        { id: 'A', text: t('lessons.compoundingIntermediate.pages.quiz1.options.A.text'), correct: false, rationale: t('lessons.compoundingIntermediate.pages.quiz1.options.A.rationale') },
        { id: 'B', text: t('lessons.compoundingIntermediate.pages.quiz1.options.B.text'), correct: true,  rationale: t('lessons.compoundingIntermediate.pages.quiz1.options.B.rationale') },
        { id: 'C', text: t('lessons.compoundingIntermediate.pages.quiz1.options.C.text'), correct: false, rationale: t('lessons.compoundingIntermediate.pages.quiz1.options.C.rationale') },
        { id: 'D', text: t('lessons.compoundingIntermediate.pages.quiz1.options.D.text'), correct: false, rationale: t('lessons.compoundingIntermediate.pages.quiz1.options.D.rationale') },
      ],
      backgroundColor: '#fdf2f8',
    },
    {
      id: 'quiz-2',
      type: 'quiz',
      title: t('lessons.compoundingIntermediate.pages.quiz2.title'),
      question: t('lessons.compoundingIntermediate.pages.quiz2.question'),
      options: [
        { id: 'A', text: t('lessons.compoundingIntermediate.pages.quiz2.options.A.text'), correct: false, rationale: t('lessons.compoundingIntermediate.pages.quiz2.options.A.rationale') },
        { id: 'B', text: t('lessons.compoundingIntermediate.pages.quiz2.options.B.text'), correct: true,  rationale: t('lessons.compoundingIntermediate.pages.quiz2.options.B.rationale') },
        { id: 'C', text: t('lessons.compoundingIntermediate.pages.quiz2.options.C.text'), correct: false, rationale: t('lessons.compoundingIntermediate.pages.quiz2.options.C.rationale') },
        { id: 'D', text: t('lessons.compoundingIntermediate.pages.quiz2.options.D.text'), correct: false, rationale: t('lessons.compoundingIntermediate.pages.quiz2.options.D.rationale') },
      ],
      backgroundColor: '#eef2ff',
    },
    {
      id: 'quiz-3',
      type: 'quiz',
      title: t('lessons.compoundingIntermediate.pages.quiz3.title'),
      question: t('lessons.compoundingIntermediate.pages.quiz3.question'),
      options: [
        { id: 'A', text: t('lessons.compoundingIntermediate.pages.quiz3.options.A.text'), correct: false, rationale: t('lessons.compoundingIntermediate.pages.quiz3.options.A.rationale') },
        { id: 'B', text: t('lessons.compoundingIntermediate.pages.quiz3.options.B.text'), correct: true,  rationale: t('lessons.compoundingIntermediate.pages.quiz3.options.B.rationale') },
        { id: 'C', text: t('lessons.compoundingIntermediate.pages.quiz3.options.C.text'), correct: false, rationale: t('lessons.compoundingIntermediate.pages.quiz3.options.C.rationale') },
        { id: 'D', text: t('lessons.compoundingIntermediate.pages.quiz3.options.D.text'), correct: false, rationale: t('lessons.compoundingIntermediate.pages.quiz3.options.D.rationale') },
      ],
      backgroundColor: '#f1f5f9',
    },
    {
      id: 'quiz-4',
      type: 'quiz',
      title: t('lessons.compoundingIntermediate.pages.quiz4.title'),
      question: t('lessons.compoundingIntermediate.pages.quiz4.question'),
      options: [
        { id: 'A', text: t('lessons.compoundingIntermediate.pages.quiz4.options.A.text'), correct: false, rationale: t('lessons.compoundingIntermediate.pages.quiz4.options.A.rationale') },
        { id: 'B', text: t('lessons.compoundingIntermediate.pages.quiz4.options.B.text'), correct: true,  rationale: t('lessons.compoundingIntermediate.pages.quiz4.options.B.rationale') },
        { id: 'C', text: t('lessons.compoundingIntermediate.pages.quiz4.options.C.text'), correct: false, rationale: t('lessons.compoundingIntermediate.pages.quiz4.options.C.rationale') },
        { id: 'D', text: t('lessons.compoundingIntermediate.pages.quiz4.options.D.text'), correct: false, rationale: t('lessons.compoundingIntermediate.pages.quiz4.options.D.rationale') },
      ],
      backgroundColor: '#fff1f2',
    },
    {
      id: 'quiz-5',
      type: 'quiz',
      title: t('lessons.compoundingIntermediate.pages.quiz5.title'),
      question: t('lessons.compoundingIntermediate.pages.quiz5.question'),
      options: [
        { id: 'A', text: t('lessons.compoundingIntermediate.pages.quiz5.options.A.text'), correct: false, rationale: t('lessons.compoundingIntermediate.pages.quiz5.options.A.rationale') },
        { id: 'B', text: t('lessons.compoundingIntermediate.pages.quiz5.options.B.text'), correct: true,  rationale: t('lessons.compoundingIntermediate.pages.quiz5.options.B.rationale') },
        { id: 'C', text: t('lessons.compoundingIntermediate.pages.quiz5.options.C.text'), correct: false, rationale: t('lessons.compoundingIntermediate.pages.quiz5.options.C.rationale') },
        { id: 'D', text: t('lessons.compoundingIntermediate.pages.quiz5.options.D.text'), correct: false, rationale: t('lessons.compoundingIntermediate.pages.quiz5.options.D.rationale') },
      ],
      backgroundColor: '#eef2ff',
    },
  ],
});

export default getCompoundingIntermediate;
