// screens/data/risk-return.js
import { t } from 'i18next';

const getRiskReturnData = () => ({
  id: 'risk-return',
  title: t('riskReturn.title'),
  description: t('riskReturn.description'),
  duration: t('riskReturn.duration'),
  difficulty: t('riskReturn.difficulty'),
  completed: false,
  progress: 0,
  pages: [
    {
      id: 'intro',
      type: 'story',
      title: t('riskReturn.pages.intro.title'),
      content: t('riskReturn.pages.intro.content'),
      graphic: '🎢',
      backgroundColor: '#f0f9ff',
    },
    {
      id: 'tradeoff',
      type: 'story',
      title: t('riskReturn.pages.tradeoff.title'),
      content: t('riskReturn.pages.tradeoff.content'),
      graphic: '⚖️',
      backgroundColor: '#fefce8',
    },
    {
      id: 'quiz',
      type: 'quiz',
      title: t('riskReturn.pages.quiz.title'),
      question: t('riskReturn.pages.quiz.question'),
      options: [
        { 
          id: 'A', 
          text: t('riskReturn.pages.quiz.options.A'), 
          correct: false 
        },
        { 
          id: 'B', 
          text: t('riskReturn.pages.quiz.options.B'), 
          correct: true 
        },
      ],
      backgroundColor: '#fdf2f8',
    },
  ],
});

export default getRiskReturnData;
