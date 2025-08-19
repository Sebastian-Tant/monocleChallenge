// screens/data/compounding.js
import { t } from 'i18next';

// Change the export to a function that returns the object
const getCompoundingData = () => ({
  id: 'compounding',
  title: t('compounding.title'),
  description: t('compounding.description'),
  duration: t('compounding.duration'),
  difficulty: t('compounding.difficulty'),
  completed: false,
  progress: 0,
  pages: [
    {
      id: 'concept',
      type: 'story',
      title: t('compounding.pages.concept.title'),
      content: t('compounding.pages.concept.content'),
      graphic: '🌳',
      backgroundColor: '#f0f9ff',
    },
    {
      id: 'core-idea',
      type: 'story',
      title: t('compounding.pages.coreIdea.title'),
      content: t('compounding.pages.coreIdea.content'),
      graphic: '✨',
      backgroundColor: '#fefce8',
    },
    {
      id: 'interactive',
      type: 'interactive',
      title: t('compounding.pages.interactive.title'),
      content: t('compounding.pages.interactive.content'),
      backgroundColor: '#f0fdf4',
    },
    {
      id: 'quiz',
      type: 'quiz',
      title: t('compounding.pages.quiz.title'),
      question: t('compounding.pages.quiz.question'),
      options: [
        { 
          id: 'A', 
          text: t('compounding.pages.quiz.options.highAmount'), 
          correct: false 
        },
        { 
          id: 'B', 
          text: t('compounding.pages.quiz.options.startEarly'), 
          correct: true 
        },
      ],
      backgroundColor: '#fdf2f8',
    },
  ],
});

export default getCompoundingData;
