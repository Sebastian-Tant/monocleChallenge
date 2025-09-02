// screens/data/tax_retire_1_tax_basics.js

// Named + default export so either import style works.
export const getTaxRetireTaxBasics = () => ({
  id: 'tax-retire-1-tax-basics',
  title: 'Taxes & Retirement Basics: Tax 101',
  description:
    'Understand your payslip (gross vs net), tax brackets, marginal vs effective tax, and how pre-tax retirement contributions affect taxable income.',
  duration: '8–10 min',
  difficulty: 'Beginner',
  completed: false,
  progress: 0,
  pages: [
    // --- Teachings ---
    {
      id: 'payslip-basics',
      type: 'story',
      title: 'Your Payslip: Gross vs Net',
      content:
        'Gross pay is your total before deductions. Net pay (take-home) is what lands in your account after deductions like tax, retirement contributions, and other items.',
      graphic: '🧾',
      backgroundColor: '#f0f9ff',
    },
    {
      id: 'brackets-marginal-effective',
      type: 'story',
      title: 'Brackets, Marginal vs Effective',
      content:
        'Income is usually taxed in brackets. Your marginal rate is the rate on your next rand earned (the top slice). Your effective rate is your total tax divided by total income—typically lower than the marginal rate.',
      graphic: '🪜',
      backgroundColor: '#fefce8',
    },
    {
      id: 'pretax-contributions',
      type: 'story',
      title: 'Pre-Tax Retirement Contributions (Concept)',
      content:
        'Contributing to eligible retirement accounts can reduce your taxable income (subject to the rules and limits where you live). Lower taxable income can mean less tax today while you build long-term savings.',
      graphic: '📈',
      backgroundColor: '#f0fdf4',
    },

    // --- Questions (with rationales) ---
    {
      id: 'quiz-1',
      type: 'quiz',
      title: 'Quick Check 1',
      question: 'What does your marginal tax rate represent?',
      options: [
        {
          id: 'A',
          text: 'The average tax rate on all your income.',
          correct: false,
          rationale:
            'That’s the effective (average) rate. Marginal rate applies only to the top bracket portion.',
        },
        {
          id: 'B',
          text: 'The rate applied to your next rand of income.',
          correct: true,
          rationale:
            'Correct. Marginal = the rate on your last/next unit of income (the top slice).',
        },
        {
          id: 'C',
          text: 'The lowest rate you’ll ever pay.',
          correct: false,
          rationale:
            'Not necessarily. Marginal is about the highest bracket that applies to you, not the lowest.',
        },
        {
          id: 'D',
          text: 'A fixed rate that never changes.',
          correct: false,
          rationale:
            'Rates and brackets can change over time; marginal describes which bracket your top income falls into.',
        },
      ],
      backgroundColor: '#fdf2f8',
    },
    {
      id: 'quiz-2',
      type: 'quiz',
      title: 'Quick Check 2',
      question:
        'Sipho and Ayesha earn the same salary. Ayesha contributes a portion to an eligible retirement account before tax (within allowed limits). Who has the lower taxable income today?',
      options: [
        {
          id: 'A',
          text: 'Sipho (no contribution).',
          correct: false,
          rationale:
            'Without a qualifying pre-tax contribution, Sipho’s taxable income stays higher.',
        },
        {
          id: 'B',
          text: 'Ayesha (contributes pre-tax to retirement).',
          correct: true,
          rationale:
            'Correct. Qualifying pre-tax retirement contributions reduce taxable income (up to allowed limits).',
        },
        {
          id: 'C',
          text: 'They have identical taxable income.',
          correct: false,
          rationale:
            'They’d be identical only if both contributed the same pre-tax amount or neither did.',
        },
        {
          id: 'D',
          text: 'Impossible to say without fees.',
          correct: false,
          rationale:
            'Fees matter for investing, but taxable income here mainly depends on whether contributions are pre-tax and within rules.',
        },
      ],
      backgroundColor: '#eef2ff',
    },
    {
      id: 'quiz-3',
      type: 'quiz',
      title: 'Quick Check 3',
      question:
        'Which statement best describes a “tax-free” (after-tax) savings/investment account conceptually?',
      options: [
        {
          id: 'A',
          text: 'You contribute after tax; growth/withdrawals are tax-free up to limits.',
          correct: true,
          rationale:
            'Correct. The typical idea: contribute from after-tax money; growth and withdrawals are tax-free (subject to rules/limits).',
        },
        {
          id: 'B',
          text: 'You contribute pre-tax and withdrawals are always tax-free.',
          correct: false,
          rationale:
            'Pre-tax contributions usually reduce taxable income today—but withdrawals may be taxed later. That’s a different model.',
        },
        {
          id: 'C',
          text: 'All accounts are “tax-free” if you earn little interest.',
          correct: false,
          rationale:
            '“Tax-free” is a specific account type with rules/limits, not simply low interest.',
        },
        {
          id: 'D',
          text: 'It guarantees higher returns than other accounts.',
          correct: false,
          rationale:
            'Tax treatment affects after-tax return, but it doesn’t guarantee higher market performance.',
        },
      ],
      backgroundColor: '#fff7ed',
    },
    {
      id: 'quiz-4',
      type: 'quiz',
      title: 'Quick Check 4',
      question:
        'True or False: A once-off bonus pushes ALL of your salary into a higher bracket so your entire income is taxed at that higher rate.',
      options: [
        {
          id: 'A',
          text: 'True',
          correct: false,
          rationale:
            'That’s a common myth. Only the portion above the threshold is taxed at the higher marginal rate.',
        },
        {
          id: 'B',
          text: 'False',
          correct: true,
          rationale:
            'Correct. Brackets are tiered: only the top slice is taxed at the higher rate, not your entire income.',
        },
      ],
      backgroundColor: '#f1f5f9',
    },
  ],
});

export default getTaxRetireTaxBasics;
