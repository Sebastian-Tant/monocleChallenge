// screens/data/compounding.js
export default {
  id: 'compounding',
  title: 'The Magic of Compounding',
  description:
    'Learn how your money can grow exponentially over time through the power of compound interest.',
  duration: '5 min',
  difficulty: 'Beginner',
  completed: false,
  progress: 0,
  pages: [
    {
      id: 'concept',
      type: 'story',
      title: 'The Concept',
      content:
        "Imagine you have a money tree. Compound interest is like planting the seeds that fall from your tree, so they grow into new money trees.",
      graphic: '🌳',
      backgroundColor: '#f0f9ff',
    },
    {
      id: 'core-idea',
      type: 'story',
      title: 'The Core Idea',
      content:
        "You earn interest on your money. Then, you earn *interest on your interest*. That's the magic.",
      graphic: '✨',
      backgroundColor: '#fefce8',
    },
    {
      id: 'interactive',
      type: 'interactive',
      title: 'See It In Action',
      content:
        "Let's see it in action. Drag the slider to see how a R10,000 investment grows at 8% interest.",
      backgroundColor: '#f0fdf4',
    },
    {
      id: 'quiz',
      type: 'quiz',
      title: 'Quick Question',
      question: 'Which is more powerful for compounding?',
      options: [
        { id: 'A', text: 'A high starting amount', correct: false },
        { id: 'B', text: 'Starting as early as possible', correct: true },
      ],
      backgroundColor: '#fdf2f8',
    },
  ],
};
