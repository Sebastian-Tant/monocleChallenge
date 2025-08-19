// screens/data/emergency-fund.js
import { t } from 'i18next';

const getEmergencyFundData = () => ({
  id: 'emergency-fund',
  title: t('emergencyFund.title'),
  description: t('emergencyFund.description'),
  duration: t('emergencyFund.duration'),
  difficulty: t('emergencyFund.difficulty'),
  completed: false,
  progress: 0,
  pages: [
    {
      id: 'why',
      type: 'story',
      title: t('emergencyFund.pages.why.title'),
      content: t('emergencyFund.pages.why.content'),
      graphic: '🧯',
      backgroundColor: '#f0f9ff',
    },
    {
      id: 'how-much',
      type: 'story',
      title: t('emergencyFund.pages.howMuch.title'),
      content: t('emergencyFund.pages.howMuch.content'),
      graphic: '📦',
      backgroundColor: '#fefce8',
    },
    {
      id: 'interactive',
      type: 'interactive',
      title: t('emergencyFund.pages.interactive.title'),
      content: t('emergencyFund.pages.interactive.content'),
      backgroundColor: '#f0fdf4',
    },
    {
      id: 'quiz',
      type: 'quiz',
      title: t('emergencyFund.pages.quiz.title'),
      question: t('emergencyFund.pages.quiz.question'),
      options: [
        { 
          id: 'A', 
          text: t('emergencyFund.pages.quiz.options.volatileStock'), 
          correct: false 
        },
        { 
          id: 'B', 
          text: t('emergencyFund.pages.quiz.options.safeAccount'), 
          correct: true 
        },
      ],
      backgroundColor: '#fdf2f8',
    },
  ],
});

export default getEmergencyFundData;
