// screens/data/compounding_basics.js
import i18n from '../../src/locales/i18n'; // <- adjust if your path differs
const t = i18n.t.bind(i18n);

const getCompoundingBasics = () => ({
  id: 'compounding-basics',
  title: t('lessons.compoundingBasics.title'),
  description: t('lessons.compoundingBasics.description'),
  duration: t('lessons.compoundingBasics.duration'),
  // Keep difficulty token in English so your UI style checks still work:
  difficulty: 'Beginner',
  // Optional, if you later want to display a translated label:
  difficultyLabel: t('lessons.compoundingBasics.difficulty'),
  completed: false,
  progress: 0,
  pages: [
    // --- Teachings ---
    {
      id: 'intro',
      type: 'story',
      title: t('lessons.compoundingBasics.pages.intro.title'),
      content: t('lessons.compoundingBasics.pages.intro.content'),
      graphic: '🌱',
      backgroundColor: '#f0f9ff',
    },
    {
      id: 'simple-vs-compound',
      type: 'story',
      title: t('lessons.compoundingBasics.pages.simpleVsCompound.title'),
      content: t('lessons.compoundingBasics.pages.simpleVsCompound.content'),
      graphic: '📈',
      backgroundColor: '#fefce8',
    },
    {
      id: 'frequency-matters',
      type: 'story',
      title: t('lessons.compoundingBasics.pages.frequencyMatters.title'),
      content: t('lessons.compoundingBasics.pages.frequencyMatters.content'),
      graphic: '⏱️',
      backgroundColor: '#f0fdf4',
    },

    // --- Questions ---
    {
      id: 'quiz-1',
      type: 'quiz',
      title: t('lessons.compoundingBasics.pages.quiz1.title'),
      question: t('lessons.compoundingBasics.pages.quiz1.question'),
      options: [
        {
          id: 'A',
          text: t('lessons.compoundingBasics.pages.quiz1.options.A.text'),
          correct: false,
          rationale: t('lessons.compoundingBasics.pages.quiz1.options.A.rationale'),
        },
        {
          id: 'B',
          text: t('lessons.compoundingBasics.pages.quiz1.options.B.text'),
          correct: true,
          rationale: t('lessons.compoundingBasics.pages.quiz1.options.B.rationale'),
        },
        {
          id: 'C',
          text: t('lessons.compoundingBasics.pages.quiz1.options.C.text'),
          correct: false,
          rationale: t('lessons.compoundingBasics.pages.quiz1.options.C.rationale'),
        },
        {
          id: 'D',
          text: t('lessons.compoundingBasics.pages.quiz1.options.D.text'),
          correct: false,
          rationale: t('lessons.compoundingBasics.pages.quiz1.options.D.rationale'),
        },
      ],
      backgroundColor: '#fdf2f8',
    },
    {
      id: 'quiz-2',
      type: 'quiz',
      title: t('lessons.compoundingBasics.pages.quiz2.title'),
      question: t('lessons.compoundingBasics.pages.quiz2.question'),
      options: [
        {
          id: 'A',
          text: t('lessons.compoundingBasics.pages.quiz2.options.A.text'),
          correct: true,
          rationale: t('lessons.compoundingBasics.pages.quiz2.options.A.rationale'),
        },
        {
          id: 'B',
          text: t('lessons.compoundingBasics.pages.quiz2.options.B.text'),
          correct: false,
          rationale: t('lessons.compoundingBasics.pages.quiz2.options.B.rationale'),
        },
        {
          id: 'C',
          text: t('lessons.compoundingBasics.pages.quiz2.options.C.text'),
          correct: false,
          rationale: t('lessons.compoundingBasics.pages.quiz2.options.C.rationale'),
        },
        {
          id: 'D',
          text: t('lessons.compoundingBasics.pages.quiz2.options.D.text'),
          correct: false,
          rationale: t('lessons.compoundingBasics.pages.quiz2.options.D.rationale'),
        },
      ],
      backgroundColor: '#eef2ff',
    },
    {
      id: 'quiz-3',
      type: 'quiz',
      title: t('lessons.compoundingBasics.pages.quiz3.title'),
      question: t('lessons.compoundingBasics.pages.quiz3.question'),
      options: [
        {
          id: 'A',
          text: t('lessons.compoundingBasics.pages.quiz3.options.A.text'),
          correct: false,
          rationale: t('lessons.compoundingBasics.pages.quiz3.options.A.rationale'),
        },
        {
          id: 'B',
          text: t('lessons.compoundingBasics.pages.quiz3.options.B.text'),
          correct: true,
          rationale: t('lessons.compoundingBasics.pages.quiz3.options.B.rationale'),
        },
        {
          id: 'C',
          text: t('lessons.compoundingBasics.pages.quiz3.options.C.text'),
          correct: false,
          rationale: t('lessons.compoundingBasics.pages.quiz3.options.C.rationale'),
        },
        {
          id: 'D',
          text: t('lessons.compoundingBasics.pages.quiz3.options.D.text'),
          correct: false,
          rationale: t('lessons.compoundingBasics.pages.quiz3.options.D.rationale'),
        },
      ],
      backgroundColor: '#fff7ed',
    },
    {
      id: 'quiz-4',
      type: 'quiz',
      title: t('lessons.compoundingBasics.pages.quiz4.title'),
      question: t('lessons.compoundingBasics.pages.quiz4.question'),
      options: [
        {
          id: 'A',
          text: t('lessons.compoundingBasics.pages.quiz4.options.A.text'),
          correct: true,
          rationale: t('lessons.compoundingBasics.pages.quiz4.options.A.rationale'),
        },
        {
          id: 'B',
          text: t('lessons.compoundingBasics.pages.quiz4.options.B.text'),
          correct: false,
          rationale: t('lessons.compoundingBasics.pages.quiz4.options.B.rationale'),
        },
      ],
      backgroundColor: '#f1f5f9',
    },
  ],
});

export default getCompoundingBasics;
