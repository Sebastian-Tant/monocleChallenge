// screens/data/budgeting_intermediate.js
// Plain strings; no i18n required.

const getBudgetingIntermediate = () => ({
  id: 'budgeting-intermediate',
  title: 'Budgeting Intermediate: Zero-Based & Sinking Funds',
  description:
    'Take control with zero-based budgeting, plan irregular costs with sinking funds, and smooth your month using a cash-flow calendar.',
  duration: '10–12 min',
  difficulty: 'Intermediate',
  completed: false,
  progress: 0,
  pages: [
    // --- Teachings ---
    {
      id: 'zbb',
      type: 'story',
      title: 'Zero-Based Budgeting (ZBB)',
      content:
        'With zero-based budgeting you give EVERY rand a job. Income − Expenses − Savings/Debt = 0. You can still be flexible: adjust categories as real life happens, but unassigned money should be zero.',
      graphic: '🧮',
      backgroundColor: '#eff6ff',
    },
    {
      id: 'sinking-funds',
      type: 'story',
      title: 'Sinking Funds for Irregulars',
      content:
        'Irregular costs (car service, school fees, annual subscriptions) aren’t emergencies. Create a “sinking fund” for each and contribute monthly (e.g., R3,600 per year → R300 per month). When the bill hits, you’re ready.',
      graphic: '🧺',
      backgroundColor: '#fefce8',
    },
    {
      id: 'cashflow-calendar',
      type: 'story',
      title: 'Cash-Flow Calendar',
      content:
        'Map paydays and due dates. If most bills are due early but you’re paid late, you might need a one-month buffer or split large bills across paychecks. Timing prevents mid-month cash crunches.',
      graphic: '📆',
      backgroundColor: '#f0fdf4',
    },

    // --- Quizzes (with rationales) ---
    {
      id: 'quiz-1',
      type: 'quiz',
      title: 'Quick Check 1',
      question: 'What BEST captures zero-based budgeting?',
      options: [
        {
          id: 'A',
          text: 'Spend less than you earn and leave the rest unassigned.',
          correct: false,
          rationale:
            'Leaving money unassigned weakens the plan; ZBB assigns every rand a job.',
        },
        {
          id: 'B',
          text: 'Give every rand a job so income minus outgo equals zero.',
          correct: true,
          rationale:
            'Yes — ZBB means all income is intentionally allocated to categories (spend, save, debt).',
        },
        {
          id: 'C',
          text: 'Track spending after the month ends.',
          correct: false,
          rationale:
            'Tracking is useful, but ZBB is proactive: plan before you spend.',
        },
        {
          id: 'D',
          text: 'Always cut Wants to 0%.',
          correct: false,
          rationale:
            'Not necessary; ZBB is about intentionality, not total deprivation.',
        },
      ],
      rationaleIfCorrect:
        'Perfect. Assigning every rand before the month starts gives clarity and control.',
      rationaleIfWrong:
        'In ZBB, income − expenses − savings/debt = 0 because every rand is assigned a job.',
      backgroundColor: '#fdf2f8',
    },
    {
      id: 'quiz-2',
      type: 'quiz',
      title: 'Quick Check 2',
      question:
        'An annual car service costs ~R3,600. Which is the best sinking-fund plan?',
      options: [
        {
          id: 'A',
          text: 'Save R300 each month into a “Car Service” category.',
          correct: true,
          rationale:
            'Exactly — you spread the known annual cost across the year so the bill never surprises you.',
        },
        {
          id: 'B',
          text: 'Ignore it until the month it happens and use the emergency fund.',
          correct: false,
          rationale:
            'This is predictable, not an emergency. Use a sinking fund instead.',
        },
        {
          id: 'C',
          text: 'Pay with a credit card and deal with it later.',
          correct: false,
          rationale:
            'That risks interest and debt. Plan ahead with monthly contributions.',
        },
        {
          id: 'D',
          text: 'Cut groceries that month to cover it.',
          correct: false,
          rationale:
            'Reactive cuts create stress and may not be realistic. Plan in advance.',
        },
      ],
      rationaleIfCorrect:
        'Spot on. R300/month makes the annual bill painless.',
      rationaleIfWrong:
        'Use a sinking fund: divide the annual amount by 12 and save that monthly.',
      backgroundColor: '#eef2ff',
    },
    {
      id: 'quiz-3',
      type: 'quiz',
      title: 'Quick Check 3',
      question:
        'You’re paid on the 25th; rent is due on the 1st. What helps avoid a cash squeeze?',
      options: [
        {
          id: 'A',
          text: 'Wait for the 25th and hope for the best.',
          correct: false,
          rationale:
            'Hope is not a plan; timing mismatches cause crunches.',
        },
        {
          id: 'B',
          text: 'Build a one-month buffer or split rent across paychecks.',
          correct: true,
          rationale:
            'Right — a buffer or paycheck-splitting aligns cash timing with due dates.',
        },
        {
          id: 'C',
          text: 'Pay rent late and accept the penalty as a “budget item.”',
          correct: false,
          rationale:
            'Late fees drain your budget and hurt your record.',
        },
        {
          id: 'D',
          text: 'Put rent on a credit card every month.',
          correct: false,
          rationale:
            'Fees/interest can add up and hide the timing problem.',
        },
      ],
      rationaleIfCorrect:
        'Exactly. A buffer or splitting large bills smooths cash flow.',
      rationaleIfWrong:
        'Use a cash-flow calendar: build a small buffer or split big bills so due dates match paydays.',
      backgroundColor: '#fff7ed',
    },
  ],
});

export default getBudgetingIntermediate;
