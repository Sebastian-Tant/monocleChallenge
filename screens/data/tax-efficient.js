// screens/data/tax-efficient.js
import { t } from 'i18next';

const getTaxEfficientData = () => ({
  id: 'tax-efficient',
  title: t('taxEfficient.title'),
  description: t('taxEfficient.description'),
  duration: t('taxEfficient.duration'),
  difficulty: t('taxEfficient.difficulty'),
  completed: false,
  progress: 0,
  pages: [
    {
      id: 'wrappers',
      type: 'story',
      title: t('taxEfficient.pages.wrappers.title'),
      content: t('taxEfficient.pages.wrappers.content'),
      graphic: '📦💸',
      backgroundColor: '#f0f9ff',
    },
    {
      id: 'placement',
      type: 'story',
      title: t('taxEfficient.pages.placement.title'),
      content: t('taxEfficient.pages.placement.content'),
      graphic: '🗂️',
      backgroundColor: '#fefce8',
    },
    {
      id: 'quiz',
      type: 'quiz',
      title: t('taxEfficient.pages.quiz.title'),
      question: t('taxEfficient.pages.quiz.question'),
      options: [
        { 
          id: 'A', 
          text: t('taxEfficient.pages.quiz.options.A'), 
          correct: true 
        },
        { 
          id: 'B', 
          text: t('taxEfficient.pages.quiz.options.B'), 
          correct: false 
        },
      ],
      backgroundColor: '#fdf2f8',
    },
  ],
});

export default getTaxEfficientData;
