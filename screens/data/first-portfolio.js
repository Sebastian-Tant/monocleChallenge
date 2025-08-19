// screens/data/first-portfolio.js
import { t } from 'i18next';

const getFirstPortfolioData = () => ({
  id: 'first-portfolio',
  title: t('firstPortfolio.title'),
  description: t('firstPortfolio.description'),
  duration: t('firstPortfolio.duration'),
  difficulty: t('firstPortfolio.difficulty'),
  completed: false,
  progress: 0,
  pages: [
    {
      id: 'goals',
      type: 'story',
      title: t('firstPortfolio.pages.goals.title'),
      content: t('firstPortfolio.pages.goals.content'),
      graphic: '🎯',
      backgroundColor: '#f0f9ff',
    },
    {
      id: 'diversify',
      type: 'story',
      title: t('firstPortfolio.pages.diversify.title'),
      content: t('firstPortfolio.pages.diversify.content'),
      graphic: '🧩',
      backgroundColor: '#fefce8',
    },
    {
      id: 'interactive',
      type: 'interactive',
      title: t('firstPortfolio.pages.interactive.title'),
      content: t('firstPortfolio.pages.interactive.content'),
      backgroundColor: '#f0fdf4',
    },
    {
      id: 'quiz',
      type: 'quiz',
      title: t('firstPortfolio.pages.quiz.title'),
      question: t('firstPortfolio.pages.quiz.question'),
      options: [
        { 
          id: 'A', 
          text: t('firstPortfolio.pages.quiz.options.maximizeGains'), 
          correct: false 
        },
        { 
          id: 'B', 
          text: t('firstPortfolio.pages.quiz.options.reduceRisk'), 
          correct: true 
        },
      ],
      backgroundColor: '#fdf2f8',
    },
  ],
});

export default getFirstPortfolioData;
