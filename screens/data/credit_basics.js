// screens/data/credit_basics.js
// Plain strings; no i18n required.

const getCreditBasics = () => ({
  id: 'credit-basics',
  title: 'Credit Basics: Scores, Interest & Smart Use',
  description:
    'Understand credit reports and scores, APR vs interest, and habits that keep borrowing costs low.',
  duration: '8–10 min',
  difficulty: 'Beginner',
  completed: false,
  progress: 0,
  pages: [
    // --- Teachings ---
    {
      id: 'what-is-credit',
      type: 'story',
      title: 'What is Credit?',
      content:
        'Credit lets you borrow money now and repay later, usually with interest. Used well, it’s a tool; used poorly, it’s expensive and stressful.',
      graphic: '💳',
      backgroundColor: '#f0f9ff',
    },
    {
      id: 'reports-scores',
      type: 'story',
      title: 'Reports & Scores',
      content:
        'A credit report records your accounts and payment history. A credit score is a summary number lenders use to judge risk. On-time payments and low balances generally mean better scores and cheaper borrowing.',
      graphic: '📄',
      backgroundColor: '#fefce8',
    },
    {
      id: 'apr-vs-interest',
      type: 'story',
      title: 'APR, Interest & Utilisation',
      content:
        'APR is the yearly cost including interest and certain fees. Your utilisation (balance ÷ limit) matters: lower utilisation (e.g., under 30%) tends to help your score and reduces risk of interest charges.',
      graphic: '📈',
      backgroundColor: '#f0fdf4',
    },

    // --- Quizzes (with rationales) ---
    {
      id: 'quiz-1',
      type: 'quiz',
      title: 'Quick Check 1',
      question: 'Which action helps your credit score the MOST over time?',
      options: [
        {
          id: 'A',
          text: 'Paying bills on time every month.',
          correct: true,
          rationale:
            'Payment history is a major factor. Consistent on-time payments build trust.',
        },
        {
          id: 'B',
          text: 'Opening many new cards at once.',
          correct: false,
          rationale:
            'Multiple new accounts can lower average age and add hard inquiries.',
        },
        {
          id: 'C',
          text: 'Maxing out cards but paying minimums.',
          correct: false,
          rationale:
            'High utilisation and interest costs hurt scores and finances.',
        },
        {
          id: 'D',
          text: 'Closing your oldest account to “tidy up.”',
          correct: false,
          rationale:
            'Closing old accounts can shorten credit history and raise utilisation.',
        },
      ],
      rationaleIfCorrect:
        'Exactly. On-time payments are the foundation of a strong score.',
      rationaleIfWrong:
        'Payment history dominates: aim for 100% on-time payments to build your score.',
      backgroundColor: '#fdf2f8',
    },
    {
      id: 'quiz-2',
      type: 'quiz',
      title: 'Quick Check 2',
      question:
        'Your card has a R10,000 limit and a R2,500 balance. What is your utilisation and why does it matter?',
      options: [
        {
          id: 'A',
          text: '25% — lower is generally better for your score.',
          correct: true,
          rationale:
            'Right. Keeping utilisation under ~30% is a common guideline.',
        },
        {
          id: 'B',
          text: '2.5% — extremely low, perfect.',
          correct: false,
          rationale:
            'Careful: 2,500 ÷ 10,000 = 25%, not 2.5%.',
        },
        {
          id: 'C',
          text: '75% — lenders prefer high utilisation.',
          correct: false,
          rationale:
            'High utilisation signals risk; lower is preferred.',
        },
        {
          id: 'D',
          text: 'It doesn’t matter if you pay the minimum.',
          correct: false,
          rationale:
            'Minimums avoid late fees but can still hurt scores and cost interest.',
        },
      ],
      rationaleIfCorrect:
        'Nice. 25% utilisation is reasonable; lower is usually better.',
      rationaleIfWrong:
        'It’s balance ÷ limit. 2,500 ÷ 10,000 = 25%. Lower utilisation tends to help scores.',
      backgroundColor: '#eef2ff',
    },
    {
      id: 'quiz-3',
      type: 'quiz',
      title: 'Quick Check 3',
      question:
        'Which statement about APR is most accurate?',
      options: [
        {
          id: 'A',
          text: 'APR includes the yearly interest cost and certain fees.',
          correct: true,
          rationale:
            'Correct — APR reflects yearly borrowing cost more fully than the nominal rate.',
        },
        {
          id: 'B',
          text: 'APR is always lower than the interest rate.',
          correct: false,
          rationale:
            'APR can be higher due to fees; it’s not guaranteed to be lower.',
        },
        {
          id: 'C',
          text: 'APR doesn’t matter if you carry a balance.',
          correct: false,
          rationale:
            'APR matters most when you carry a balance — it drives your cost.',
        },
        {
          id: 'D',
          text: 'APR only applies to mortgages.',
          correct: false,
          rationale:
            'APR is used across many credit products, not just mortgages.',
        },
      ],
      rationaleIfCorrect:
        'Exactly. APR is a clearer “all-in” yearly cost than interest rate alone.',
      rationaleIfWrong:
        'APR = yearly cost including interest + some fees. It’s key when comparing loans.',
      backgroundColor: '#fff7ed',
    },
  ],
});

export default getCreditBasics;
