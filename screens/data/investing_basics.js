// screens/data/investing_basics.js
// Plain strings; no i18n required.

const getInvestingBasics = () => ({
  id: 'investing-basics',
  title: 'Investing Basics (SA): Risk, ETFs & Time in Market',
  description:
    'Learn risk vs return, why low-cost index ETFs are a strong default, and how time in the market beats timing the market.',
  duration: '10–12 min',
  difficulty: 'Beginner',
  completed: false,
  progress: 0,
  pages: [
    // --- Teachings ---
    {
      id: 'risk-return',
      type: 'story',
      title: 'Risk vs Return',
      content:
        'Higher potential return usually comes with higher risk (bigger ups and downs). The aim is not “no risk”, but the right risk for your goals and timeline.',
      graphic: '🎢',
      backgroundColor: '#f0f9ff',
    },
    {
      id: 'diversification',
      type: 'story',
      title: 'Diversification: Don’t Bet on One Thing',
      content:
        'Diversification spreads your money across many companies/markets so one loser doesn’t sink your plan. A single share is risky; a broad fund is safer for beginners.',
      graphic: '🧺',
      backgroundColor: '#fefce8',
    },
    {
      id: 'etfs-tfsa',
      type: 'story',
      title: 'ETFs & TFSAs (South Africa)',
      content:
        'An ETF tracks a basket (e.g., JSE Top 40 or global equities). Low fees + instant diversification = strong beginner default. A TFSA (Tax-Free Savings/Investment Account) lets investments grow tax-free within set limits — great for long-term goals.',
      graphic: '🌍',
      backgroundColor: '#f0fdf4',
    },

    // --- Quizzes (with rationales) ---
    {
      id: 'quiz-1',
      type: 'quiz',
      title: 'Quick Check 1',
      question: 'What is the MAIN benefit of diversification?',
      options: [
        {
          id: 'A',
          text: 'It guarantees profits every year.',
          correct: false,
          rationale:
            'No strategy guarantees profits. Diversification manages risk, it doesn’t remove it.',
        },
        {
          id: 'B',
          text: 'It reduces the impact of any single poor performer.',
          correct: true,
          rationale:
            'Exactly — spreading across many holdings lowers single-stock risk.',
        },
        {
          id: 'C',
          text: 'It eliminates all risk from markets.',
          correct: false,
          rationale:
            'Market risk remains; diversification mainly cuts concentration risk.',
        },
        {
          id: 'D',
          text: 'It makes taxes irrelevant.',
          correct: false,
          rationale:
            'Tax treatment depends on account type and local rules, not just diversification.',
        },
      ],
      rationaleIfCorrect:
        'Right — diversification reduces the damage from any one loser.',
      rationaleIfWrong:
        'Diversification lowers concentration risk by spreading exposure across many holdings.',
      backgroundColor: '#fdf2f8',
    },
    {
      id: 'quiz-2',
      type: 'quiz',
      title: 'Quick Check 2',
      question:
        'For a new SA investor wanting simple broad exposure, which is generally a sensible default?',
      options: [
        {
          id: 'A',
          text: 'Picking one hot stock you saw on social media.',
          correct: false,
          rationale:
            'Single-stock bets are concentrated risk, especially for beginners.',
        },
        {
          id: 'B',
          text: 'A low-cost diversified ETF (e.g., local Top 40 or global equity tracker).',
          correct: true,
          rationale:
            'Low fees + wide diversification make ETFs a strong default starting point.',
        },
        {
          id: 'C',
          text: 'Keeping everything in cash forever.',
          correct: false,
          rationale:
            'Cash has low volatility but may lose purchasing power to inflation over long periods.',
        },
        {
          id: 'D',
          text: 'Only buying foreign currency and holding it.',
          correct: false,
          rationale:
            'Currency alone is not a diversified investment strategy.',
        },
      ],
      rationaleIfCorrect:
        'Nice. Broad, low-cost ETFs help you capture market returns without stock-picking.',
      rationaleIfWrong:
        'A diversified, low-fee ETF is typically a better default than single-stock bets or idle cash.',
      backgroundColor: '#eef2ff',
    },
    {
      id: 'quiz-3',
      type: 'quiz',
      title: 'Quick Check 3',
      question:
        'Which habit most reliably improves long-term investing outcomes?',
      options: [
        {
          id: 'A',
          text: 'Trying to time every high and low.',
          correct: false,
          rationale:
            'Market timing is very hard even for pros; missing a few big up days can hurt returns.',
        },
        {
          id: 'B',
          text: 'Investing consistently and staying invested through cycles.',
          correct: true,
          rationale:
            'Time in the market + regular contributions lets compounding work.',
        },
        {
          id: 'C',
          text: 'Chasing whatever went up the most last month.',
          correct: false,
          rationale:
            'Performance-chasing often buys high and sells low.',
        },
        {
          id: 'D',
          text: 'Moving everything to cash after any dip.',
          correct: false,
          rationale:
            'Reacting to dips can lock in losses and miss recoveries.',
        },
      ],
      rationaleIfCorrect:
        'Exactly — steady contributions and patience are powerful.',
      rationaleIfWrong:
        'Consistency beats timing: keep investing regularly and let compounding work over time.',
      backgroundColor: '#fff7ed',
    },
  ],
});

export default getInvestingBasics;
