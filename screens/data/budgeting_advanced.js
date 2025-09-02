// screens/data/budgeting_advanced.js
// Plain strings; no i18n required.

const getBudgetingAdvanced = () => ({
  id: 'budgeting-advanced',
  title: 'Budgeting Advanced: Forecast, Variability & Optimization',
  description:
    'Run your budget on autopilot, handle variable income with priority rules, and optimize using variance reviews and key metrics.',
  duration: '12–14 min',
  difficulty: 'Advanced',
  completed: false,
  progress: 0,
  pages: [
    // --- Teachings ---
    {
      id: 'autopilot',
      type: 'story',
      title: 'Pay Yourself First (Autopilot)',
      content:
        'Automate transfers on payday: emergency fund → investments → sinking funds → bills. Money you never see is money you never spend. Use separate “buckets” so each goal has a home.',
      graphic: '🤖',
      backgroundColor: '#eff6ff',
    },
    {
      id: 'variable-income',
      type: 'story',
      title: 'Variable Income: Percent & Priority',
      content:
        'If income fluctuates, budget by PERCENTAGES with a PRIORITY list: 1) Essentials (rent, transport, food), 2) Minimum debt + key sinking funds, 3) Investing/extra debt, 4) Wants. Contributions scale up or down safely.',
      graphic: '🎚️',
      backgroundColor: '#fefce8',
    },
    {
      id: 'variance-and-metrics',
      type: 'story',
      title: 'Variance Review & Metrics',
      content:
        'End-of-month retro: (Budget − Actual) per category. Reassign underspends, cover overspends, and change next month’s targets. Track 1–2 metrics: Savings Rate (net) and Debt-to-Income. Aim to raise savings rate over time.',
      graphic: '📈',
      backgroundColor: '#f0fdf4',
    },

    // --- Quizzes (with rationales) ---
    {
      id: 'quiz-1',
      type: 'quiz',
      title: 'Quick Check 1',
      question:
        'Your income varies each month. Which strategy best keeps your budget stable and scalable?',
      options: [
        {
          id: 'A',
          text: 'Use fixed rand amounts for each category regardless of income.',
          correct: false,
          rationale:
            'Fixed amounts can over-commit you in low-income months and under-utilize high months.',
        },
        {
          id: 'B',
          text: 'Percent-based allocations with a priority order (essentials → sinking funds → investing → wants).',
          correct: true,
          rationale:
            'Yes — allocations scale with income and your priority list ensures the basics are always funded first.',
        },
        {
          id: 'C',
          text: 'Skip budgeting on low months and “catch up” later.',
          correct: false,
          rationale:
            'Skipping the plan creates chaos and often debt; scale down rather than stop.',
        },
        {
          id: 'D',
          text: 'Put everything on a credit card to smooth cash flow.',
          correct: false,
          rationale:
            'This hides the problem and can create interest costs and risk.',
        },
      ],
      rationaleIfCorrect:
        'Exactly. Percent + priority gives you a resilient plan that expands or contracts with income.',
      rationaleIfWrong:
        'Use percent-based allocations and a priority list so essentials are funded first and the plan scales with income.',
      backgroundColor: '#fdf2f8',
    },
    {
      id: 'quiz-2',
      type: 'quiz',
      title: 'Quick Check 2',
      question:
        'You budgeted R1,500 for groceries but spent R1,800. Transport was under by R300. What is the best advanced response?',
      options: [
        {
          id: 'A',
          text: 'Ignore it; next month will average out.',
          correct: false,
          rationale:
            'Ignoring loses the learning; you want intentional adjustments.',
        },
        {
          id: 'B',
          text: 'Reassign the R300 underspend to cover groceries and adjust next month’s targets after a variance review.',
          correct: true,
          rationale:
            'Yes — close the gap now and update targets/behaviour for next month.',
        },
        {
          id: 'C',
          text: 'Label the R300 as “miscellaneous” and move on.',
          correct: false,
          rationale:
            'That hides the signal. Use categories to inform future decisions.',
        },
        {
          id: 'D',
          text: 'Take R300 from your emergency fund.',
          correct: false,
          rationale:
            'This isn’t an emergency; cover it from underspends or this month’s buffer.',
        },
      ],
      rationaleIfCorrect:
        'Perfect. Variance review → reassign → update targets. That’s how budgets improve.',
      rationaleIfWrong:
        'Do a quick variance review, reassign underspends to cover overspends, then adjust next month’s plan.',
      backgroundColor: '#eef2ff',
    },
    {
      id: 'quiz-3',
      type: 'quiz',
      title: 'Quick Check 3',
      question:
        'Which single metric most directly shows long-term budgeting progress?',
      options: [
        {
          id: 'A',
          text: 'Number of transactions per month.',
          correct: false,
          rationale:
            'Activity isn’t progress. You want a measure tied to wealth building.',
        },
        {
          id: 'B',
          text: 'Savings rate (net) — % of take-home going to saving/investing/extra debt paydown.',
          correct: true,
          rationale:
            'Yes — raising your savings rate compounds results over years.',
        },
        {
          id: 'C',
          text: 'Credit score alone.',
          correct: false,
          rationale:
            'Useful, but it can improve even while you’re not building assets.',
        },
        {
          id: 'D',
          text: 'Total spend on “Wants.”',
          correct: false,
          rationale:
            'Cutting wants can help, but the goal is sustainable progress, not austerity.',
        },
      ],
      rationaleIfCorrect:
        'Exactly. A higher net savings rate is a powerful north star for long-term outcomes.',
      rationaleIfWrong:
        'Track your net savings rate: the share of take-home that builds assets or kills debt faster.',
      backgroundColor: '#fff7ed',
    },
  ],
});

export default getBudgetingAdvanced;
