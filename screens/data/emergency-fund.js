// screens/data/emergency-fund.js
export default {
  id: 'emergency-fund',
  title: 'Emergency Funds Explained',
  description: 'Why you need an emergency fund and how much to save before investing.',
  duration: '6 min',
  difficulty: 'Beginner',
  completed: false,
  progress: 0,
  pages: [
    {
      id: 'why',
      type: 'story',
      title: 'Why Bother?',
      content:
        'Life happens—job loss, car repairs, medical bills. An emergency fund keeps you from going into debt (or selling investments at the worst time).',
      graphic: '🧯',
      backgroundColor: '#f0f9ff',
    },
    {
      id: 'how-much',
      type: 'story',
      title: 'How Much?',
      content:
        'Common rule: 3–6 months of essential expenses. Start with a mini-goal (R5,000–R10,000), then build up.',
      graphic: '📦',
      backgroundColor: '#fefce8',
    },
    {
      id: 'interactive',
      type: 'interactive',
      title: 'Your Target',
      content:
        'Drag to set monthly essentials (rent, food, transport). We’ll show you a 3–6 month emergency target.',
      backgroundColor: '#f0fdf4',
    },
    {
      id: 'quiz',
      type: 'quiz',
      title: 'Quick Check',
      question: 'Where should an emergency fund be kept?',
      options: [
        { id: 'A', text: 'In a volatile stock ETF', correct: false },
        { id: 'B', text: 'In a safe, easy-access account', correct: true },
      ],
      backgroundColor: '#fdf2f8',
    },
  ],
};
