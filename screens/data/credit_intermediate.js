// screens/data/credit_intermediate.js
// Plain strings; no i18n required.

const getCreditIntermediate = () => ({
  id: 'credit-intermediate',
  title: 'Credit Intermediate: Compare, Amortize & Pay Down',
  description:
    'Read loan offers like a pro, understand amortization, and choose a paydown strategy that actually sticks.',
  duration: '10–12 min',
  difficulty: 'Intermediate',
  completed: false,
  progress: 0,
  pages: [
    // --- Teachings ---
    {
      id: 'amortization',
      type: 'story',
      title: 'Amortization: Where Your Payment Goes',
      content:
        'Most loans are amortizing: each payment includes interest (cost to borrow) and principal (what you owe). Early on, more goes to interest; later, more goes to principal. Paying extra toward principal earlier shortens the term and cuts total interest.',
      graphic: '📉',
      backgroundColor: '#eff6ff',
    },
    {
      id: 'compare-offers',
      type: 'story',
      title: 'Comparing Offers: APR, Fees & Features',
      content:
        'APR lets you compare yearly borrowing cost across lenders. Also check once-off/ongoing fees, fixed vs variable rates, early-settlement penalties, and promo periods. Lowest monthly payment ≠ cheapest total cost.',
      graphic: '🧾',
      backgroundColor: '#fefce8',
    },
    {
      id: 'paydown-strategies',
      type: 'story',
      title: 'Paydown Strategies: Snowball vs Avalanche',
      content:
        'Snowball: pay smallest balance first for quick wins. Avalanche: pay highest interest rate first to minimize total interest. Both work — pick the one you’ll stick with. Automate minimums, then focus all extra on your target account.',
      graphic: '🏔️',
      backgroundColor: '#f0fdf4',
    },

    // --- Quizzes (with rationales) ---
    {
      id: 'quiz-1',
      type: 'quiz',
      title: 'Quick Check 1',
      question:
        'What’s the BEST single number for comparing the yearly cost of two loan offers?',
      options: [
        {
          id: 'A',
          text: 'Lowest monthly payment.',
          correct: false,
          rationale:
            'A lower installment can hide a longer term and more total interest.',
        },
        {
          id: 'B',
          text: 'APR (annual percentage rate).',
          correct: true,
          rationale:
            'APR reflects the yearly borrowing cost and helps comparisons across lenders.',
        },
        {
          id: 'C',
          text: 'Longest term available.',
          correct: false,
          rationale:
            'Longer terms usually increase total interest paid.',
        },
        {
          id: 'D',
          text: 'Largest credit limit.',
          correct: false,
          rationale:
            'Credit limit doesn’t tell you the cost of borrowing.',
        },
      ],
      rationaleIfCorrect:
        'Exactly — APR is designed for apples-to-apples cost comparison.',
      rationaleIfWrong:
        'Use APR to compare yearly cost; monthly payment alone can be misleading.',
      backgroundColor: '#fdf2f8',
    },
    {
      id: 'quiz-2',
      type: 'quiz',
      title: 'Quick Check 2',
      question:
        'Two loans have the same interest rate and principal. Which usually leads to the LEAST total interest?',
      options: [
        {
          id: 'A',
          text: 'A 36-month term (higher monthly, shorter time).',
          correct: true,
          rationale:
            'Shorter terms mean fewer months to charge interest — total cost is lower.',
        },
        {
          id: 'B',
          text: 'A 60-month term (lower monthly, longer time).',
          correct: false,
          rationale:
            'Lower installments stretch the term and typically increase total interest.',
        },
        {
          id: 'C',
          text: 'Whichever has the lower monthly payment.',
          correct: false,
          rationale:
            'Lower monthly often means longer term and more interest overall.',
        },
        {
          id: 'D',
          text: 'They cost the same because the rate is the same.',
          correct: false,
          rationale:
            'Time matters — same rate, longer term = more total interest.',
        },
      ],
      rationaleIfCorrect:
        'Right. A shorter term reduces how long interest accrues.',
      rationaleIfWrong:
        'Shorter term = fewer months of interest. It usually wins on total cost.',
      backgroundColor: '#eef2ff',
    },
    {
      id: 'quiz-3',
      type: 'quiz',
      title: 'Quick Check 3',
      question:
        'Which approach MINIMIZES total interest most reliably (assuming you follow it)?',
      options: [
        {
          id: 'A',
          text: 'Debt Snowball (smallest balance first).',
          correct: false,
          rationale:
            'Great for motivation, but not always the cheapest mathematically.',
        },
        {
          id: 'B',
          text: 'Debt Avalanche (highest interest rate first).',
          correct: true,
          rationale:
            'Avalanche targets the most expensive debt, reducing total interest fastest.',
        },
        {
          id: 'C',
          text: 'Pay only minimums on all accounts.',
          correct: false,
          rationale:
            'Minimums keep you current but maximize interest paid.',
        },
        {
          id: 'D',
          text: 'Close all credit accounts immediately.',
          correct: false,
          rationale:
            'Closing accounts can hurt utilization/history and doesn’t pay balances down.',
        },
      ],
      rationaleIfCorrect:
        'Exactly — avalanche is the math winner (snowball can be a motivation winner).',
      rationaleIfWrong:
        'To minimize interest, focus extra payments on the highest rate (avalanche).',
      backgroundColor: '#fff7ed',
    },
  ],
});

export default getCreditIntermediate;
