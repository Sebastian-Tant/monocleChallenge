// screens/data/first-portfolio.js
export default {
  id: 'first-portfolio',
  title: 'Building Your First Portfolio',
  description:
    'Create a diversified investment portfolio that matches your goals and risk tolerance.',
  duration: '10 min',
  difficulty: 'Intermediate',
  completed: false,
  progress: 0,
  pages: [
    {
      id: 'goals',
      type: 'story',
      title: 'Start With Goals',
      content:
        'Timeline + purpose = allocation. Short-term goals → safer assets. Long-term goals → more growth assets.',
      graphic: '🎯',
      backgroundColor: '#f0f9ff',
    },
    {
      id: 'diversify',
      type: 'story',
      title: 'Diversification',
      content:
        'Mix asset classes (stocks, bonds, cash) and geographies so one loser doesn’t sink the whole ship.',
      graphic: '🧩',
      backgroundColor: '#fefce8',
    },
    {
      id: 'interactive',
      type: 'interactive',
      title: 'Try an Allocation',
      content:
        'Move sliders for stocks/bonds/cash. See simulated volatility and long-term return change in real time.',
      backgroundColor: '#f0fdf4',
    },
    {
      id: 'quiz',
      type: 'quiz',
      title: 'Quick Check',
      question: 'What’s the main benefit of diversification?',
      options: [
        { id: 'A', text: 'Maximizes short-term gains', correct: false },
        { id: 'B', text: 'Reduces risk from any single investment', correct: true },
      ],
      backgroundColor: '#fdf2f8',
    },
  ],
};
