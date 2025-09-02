// screens/data/budgeting_basics.js
// Plain strings; no i18n required.

const getBudgetingBasics = () => ({
  id: 'budgeting-basics',
  title: 'Budgeting Basics: Control Your Cash',
  description:
    'What a budget is, simple methods like 50/30/20, and why an emergency fund keeps you stress-free.',
  duration: '8–10 min',
  difficulty: 'Beginner',
  completed: false,
  progress: 0,
  pages: [
    // --- Teachings ---
    {
      id: 'intro',
      type: 'story',
      title: 'What is a Budget?',
      content:
        'A budget is a plan for your money: income in, expenses out, and a choice for what remains. A good budget shows where your cash actually goes and helps you make trade-offs on purpose.',
      graphic: '🧭',
      backgroundColor: '#f0f9ff',
    },
    {
      id: 'rule-503020',
      type: 'story',
      title: 'The 50/30/20 Rule (Simple Starter)',
      content:
        'A popular beginner method is 50/30/20: 50% Needs (rent, transport, groceries), 30% Wants (eating out, entertainment), 20% Saving/Debt Paydown (emergency fund, investments, extra on debt).',
      graphic: '📊',
      backgroundColor: '#fefce8',
    },
    {
      id: 'emergency-fund',
      type: 'story',
      title: 'Emergency Fund',
      content:
        'An emergency fund is cash for surprises (car repair, medical bill). A common goal is 3–6 months of essential expenses. If that feels big, start with R5,000–R10,000 and build up.',
      graphic: '🛟',
      backgroundColor: '#f0fdf4',
    },

    // --- Questions (with rationales) ---
    {
      id: 'quiz-1',
      type: 'quiz',
      title: 'Quick Check 1',
      question: 'What’s the best FIRST step when starting a budget?',
      options: [
        {
          id: 'A',
          text: 'Buy budgeting software and start guessing categories.',
          correct: false,
          rationale:
            'Tools help, but guessing categories without data often leads to frustration.',
        },
        {
          id: 'B',
          text: 'Track last month’s income and expenses to see your baseline.',
          correct: true,
          rationale:
            'A real baseline (income in, money out) makes your first budget realistic.',
        },
        {
          id: 'C',
          text: 'Cut all wants to zero immediately.',
          correct: false,
          rationale:
            'Extreme cuts aren’t sustainable. Start with visibility, then adjust.',
        },
        {
          id: 'D',
          text: 'Move all spending to cash only.',
          correct: false,
          rationale:
            'Cash can help some people, but it isn’t the essential first step for everyone.',
        },
      ],
      rationaleIfCorrect:
        'Nice! A quick spending audit (last 30–60 days) gives you truth before targets.',
      rationaleIfWrong:
        'Start by measuring reality: list income and review recent statements to see where your money actually goes.',
      backgroundColor: '#fdf2f8',
    },
    {
      id: 'quiz-2',
      type: 'quiz',
      title: 'Quick Check 2',
      question: 'In the 50/30/20 rule, what does the 20% bucket cover?',
      options: [
        {
          id: 'A',
          text: 'Groceries and transport (needs).',
          correct: false,
          rationale: 'Those are Needs (the 50%).',
        },
        {
          id: 'B',
          text: 'Streaming services and eating out (wants).',
          correct: false,
          rationale: 'Those are Wants (the 30%).',
        },
        {
          id: 'C',
          text: 'Saving/investing and extra debt repayments.',
          correct: true,
          rationale:
            'Correct — 20% is for building assets (savings/investing) and speeding up debt payoff.',
        },
        {
          id: 'D',
          text: 'Bank fees and data bundles.',
          correct: false,
          rationale:
            'These usually live in Needs or Wants depending on what they cover.',
        },
      ],
      rationaleIfCorrect:
        'Exactly. That 20% is your “future you” money: emergency fund, investments, and extra debt paydown.',
      rationaleIfWrong:
        'The 20% bucket is for saving/investing and extra debt repayments — the engine for progress.',
      backgroundColor: '#eef2ff',
    },
    {
      id: 'quiz-3',
      type: 'quiz',
      title: 'Quick Check 3',
      question:
        'What’s a solid emergency-fund target once you’re past the starter level?',
      options: [
        {
          id: 'A',
          text: 'One week of expenses.',
          correct: false,
          rationale:
            'Helpful, but too small for most real emergencies.',
        },
        {
          id: 'B',
          text: 'Three to six months of essential expenses.',
          correct: true,
          rationale:
            'Yes — 3–6 months is a common, resilient target; start smaller and build.',
        },
        {
          id: 'C',
          text: 'Exactly one year of total salary.',
          correct: false,
          rationale:
            'That’s overkill for most people and may delay investing unnecessarily.',
        },
        {
          id: 'D',
          text: 'No emergency fund needed if you have a credit card.',
          correct: false,
          rationale:
            'Credit is not a substitute for cash — interest can turn emergencies into debt spirals.',
        },
      ],
      rationaleIfCorrect:
        'Great. Aim for 3–6 months of essentials; reach it gradually while balancing other goals.',
      rationaleIfWrong:
        'Rule of thumb: build toward 3–6 months of essential expenses. If that’s big, start with R5,000–R10,000 and keep going.',
      backgroundColor: '#fff7ed',
    },
  ],
});

export default getBudgetingBasics;
