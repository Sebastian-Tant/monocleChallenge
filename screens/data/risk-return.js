
export default {
  id: 'risk-return',
  title: 'Understanding Risk and Return',
  description:
    'Discover the relationship between risk and potential rewards in investing.',
  duration: '7 min',
  difficulty: 'Beginner',
  completed: false,
  progress: 0,
  pages: [
    {
      id: 'intro',
      type: 'story',
      title: 'What is Risk?',
      content:
        'Risk is how much your investment can go up or down. Higher risk can mean higher gains — but also bigger drops.',
      graphic: '🎢',
      backgroundColor: '#f0f9ff',
    },
    {
      id: 'tradeoff',
      type: 'story',
      title: 'The Trade-off',
      content:
        'Safer assets (like cash) have lower returns. Riskier assets (like stocks) can grow more over time but swing more.',
      graphic: '⚖️',
      backgroundColor: '#fefce8',
    },
    {
      id: 'interactive',
      type: 'interactive',
      title: 'Pick Your Path',
      content:
        'Move the slider between “safe” and “risky” to see how volatility and long-term return might change.',
      backgroundColor: '#f0fdf4',
    },
    {
      id: 'quiz',
      type: 'quiz',
      title: 'Quick Check',
      question: 'Which statement is most accurate?',
      options: [
        { id: 'A', text: 'Higher returns always mean less risk', correct: false },
        { id: 'B', text: 'Higher potential returns usually come with higher risk', correct: true },
      ],
      backgroundColor: '#fdf2f8',
    },
  ],
};
