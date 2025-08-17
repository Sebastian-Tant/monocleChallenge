// screens/data/tax-efficient.js
export default {
  id: 'tax-efficient',
  title: 'Tax-Efficient Investing',
  description:
    'Learn about tax-free / tax-advantaged accounts and smart placement to keep more of your returns.',
  duration: '8 min',
  difficulty: 'Intermediate',
  completed: false,
  progress: 0,
  pages: [
    {
      id: 'wrappers',
      type: 'story',
      title: 'Use the Wrapper',
      content:
        'Tax-advantaged accounts (like TFSA/ISA/401k/RA equivalents in your region) shield growth/dividends from some taxes.',
      graphic: '📦💸',
      backgroundColor: '#f0f9ff',
    },
    {
      id: 'placement',
      type: 'story',
      title: 'Asset Location',
      content:
        'Place tax-inefficient assets (e.g., bond funds, high dividend payers) in tax-sheltered accounts first.',
      graphic: '🗂️',
      backgroundColor: '#fefce8',
    },
    {
      id: 'interactive',
      type: 'interactive',
      title: 'Smart Placement',
      content:
        'Drag funds into “Taxable” vs “Tax-Advantaged” buckets. See the estimated after-tax return improve.',
      backgroundColor: '#f0fdf4',
    },
    {
      id: 'quiz',
      type: 'quiz',
      title: 'Quick Check',
      question: 'Which move is generally MORE tax-efficient?',
      options: [
        { id: 'A', text: 'Holding bond funds in a tax-advantaged account', correct: true },
        { id: 'B', text: 'Holding bond funds in a taxable brokerage account', correct: false },
      ],
      backgroundColor: '#fdf2f8',
    },
  ],
};
