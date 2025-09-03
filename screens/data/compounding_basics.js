// screens/data/compounding_basics.js

// No i18n required; plain strings so you can drop it in immediately.
const getCompoundingBasics = () => ({
  id: 'compounding-basics',
  title: 'Compounding Basics: Start Early',
  description:
    'A quick primer on what compound interest is, why it beats simple interest, and why starting early matters.',
  duration: '6–8 min',
  difficulty: 'Beginner',
  completed: false,
  progress: 0,
  pages: [
    // --- Teachings ---
    {
      id: 'intro',
      type: 'story',
      title: 'What is Compound Interest?',
      content:
        'Compound interest means you earn interest on your original money AND on the interest that money already earned — interest on interest. Over time this snowballs.',
      graphic: '🌱',
      backgroundColor: '#f0f9ff',
    },
    {
      id: 'simple-vs-compound',
      type: 'story',
      title: 'Simple vs Compound',
      content:
        'Simple interest: interest is only on the original amount (principal). Compound interest: interest is on principal + accumulated interest. Example: R100 at 12% simple = R112 after 1 year. At 12% compounded annually = also R112 after 1 year — but keep compounding and compound wins big.',
      graphic: '📈',
      backgroundColor: '#fefce8',
    },
    {
      id: 'frequency-matters',
      type: 'story',
      title: 'Compounding Frequency',
      content:
        'More frequent compounding grows faster. R100 at 12% compounded monthly ≈ R112.68 after 1 year, versus R112 with annual compounding. Same nominal rate, slightly better growth because interest is added more often.',
      graphic: '⏱️',
      backgroundColor: '#f0fdf4',
    },

    // --- Questions ---
    {
      id: 'quiz-1',
      type: 'quiz',
      title: 'Quick Check 1',
      question: 'Which statement best describes compound interest?',
      options: [
        {
          id: 'A',
          text: 'Interest only on the original amount.',
          correct: false,
          rationale:
            'That describes simple interest. Compound interest also earns on past interest, not just the original principal.',
        },
        {
          id: 'B',
          text: 'Interest on the original amount and on past interest.',
          correct: true,
          rationale:
            'Correct. With compounding, previous interest is added to the balance and itself earns interest.',
        },
        {
          id: 'C',
          text: 'Interest rate that never changes.',
          correct: false,
          rationale:
            'Whether a rate changes or not is separate. Compounding is about earning on principal plus accumulated interest.',
        },
        {
          id: 'D',
          text: 'Interest that banks charge only on loans.',
          correct: false,
          rationale:
            'Compounding applies to savings and investments too — not just loans.',
        },
      ],
      backgroundColor: '#fdf2f8',
    },
    {
      id: 'quiz-2',
      type: 'quiz',
      title: 'Quick Check 2',
      question:
        'Two friends each save R200/month at 8% per year. Thabo starts today for 10 years. Naledi waits 5 years, then saves for 5 years. Who ends with more?',
      options: [
        {
          id: 'A',
          text: 'Thabo (starts earlier, more compounding time).',
          correct: true,
          rationale:
            'Correct. Money invested earlier compounds for longer, which typically beats starting late even with the same monthly amount.',
        },
        {
          id: 'B',
          text: 'Naledi (same monthly amount).',
          correct: false,
          rationale:
            'Same monthly amount isn’t enough — Naledi has fewer years of growth. Time in the market matters a lot.',
        },
        {
          id: 'C',
          text: 'They end with the same amount.',
          correct: false,
          rationale:
            'They won’t match — Thabo’s money grows for more years due to an earlier start.',
        },
        {
          id: 'D',
          text: 'Impossible to know.',
          correct: false,
          rationale:
            'Given equal rates and contributions, starting earlier generally wins because of extra compounding time.',
        },
      ],
      backgroundColor: '#eef2ff',
    },
    {
      id: 'quiz-3',
      type: 'quiz',
      title: 'Quick Check 3',
      question: 'All else equal, which grows savings faster over time?',
      options: [
        {
          id: 'A',
          text: '12% compounded annually.',
          correct: false,
          rationale:
            'Annual compounding adds interest once per year, which is slower than monthly at the same nominal rate.',
        },
        {
          id: 'B',
          text: '12% compounded monthly.',
          correct: true,
          rationale:
            'Correct. More frequent compounding (monthly) adds interest sooner, so it compounds slightly faster than annual.',
        },
        {
          id: 'C',
          text: '10% compounded monthly.',
          correct: false,
          rationale:
            '12% annually vs 10% monthly — the higher rate (12%) generally wins despite frequency.',
        },
        {
          id: 'D',
          text: 'Both A and B are identical.',
          correct: false,
          rationale:
            'Frequency matters. At the same nominal rate, monthly compounding grows a bit more than annual.',
        },
      ],
      backgroundColor: '#fff7ed',
    },
    {
      id: 'quiz-4',
      type: 'quiz',
      title: 'Quick Check 4',
      question:
        'True or False: With compounding, doubling the time generally more than doubles the final amount.',
      options: [
        {
          id: 'A',
          text: 'True',
          correct: true,
          rationale:
            'Correct. Compound growth is exponential — more time lets interest earn on interest, so growth accelerates.',
        },
        {
          id: 'B',
          text: 'False',
          correct: false,
          rationale:
            'That would be closer to simple (linear) growth. Compounding accelerates over time, so longer periods can produce more-than-linear gains.',
        },
      ],
      backgroundColor: '#f1f5f9',
    },
  ],
});

export default getCompoundingBasics;
