// screens/data/tax_retire_3_tfsa_vs_taxable.js

// Named + default export so either import style works.
export const getTaxRetireTfsaVsTaxable = () => ({
  id: 'tax-retire-3-tfsa-vs-taxable',
  title: 'Taxes & Retirement Basics: TFSA vs Taxable',
  description:
    'Understand the idea of tax-free (after-tax) accounts vs taxable accounts: contributions, limits, growth, withdrawals, and when each can make sense.',
  duration: '8–10 min',
  difficulty: 'Intermediate',
  completed: false,
  progress: 0,
  pages: [
    // --- Teachings ---
    {
      id: 'tfsa-concept',
      type: 'story',
      title: 'What is a “Tax-Free” Account (Conceptually)?',
      content:
        'You contribute after tax. Within rules and limits, growth and withdrawals are tax-free. There’s no upfront deduction, but compounding can be more efficient because returns inside the account aren’t taxed.',
      graphic: '🧺',
      backgroundColor: '#f0f9ff',
    },
    {
      id: 'limits-rules',
      type: 'story',
      title: 'Limits & Rules (High Level)',
      content:
        'Tax-free accounts usually have annual and/or lifetime contribution limits. Exceeding limits can trigger penalties or extra tax according to local rules. Know your limits and track contributions carefully.',
      graphic: '📏',
      backgroundColor: '#fefce8',
    },
    {
      id: 'taxable-basics',
      type: 'story',
      title: 'Taxable Account Basics',
      content:
        'In a regular taxable account, interest, dividends, and realised gains may be taxed. Flexibility is high (few contribution limits), but taxes can reduce the compounding of returns over time.',
      graphic: '💼',
      backgroundColor: '#f0fdf4',
    },
    {
      id: 'horizon-liquidity',
      type: 'story',
      title: 'Time Horizon & Liquidity',
      content:
        'Tax-free accounts often work best for long-term goals and steady compounding. For short-term goals with frequent withdrawals, a taxable or simple savings account might be more practical.',
      graphic: '⏳',
      backgroundColor: '#eef2ff',
    },
    {
      id: 'asset-location',
      type: 'story',
      title: 'Asset Location (Concept)',
      content:
        'Assets that generate returns that are typically taxed more heavily (like interest) may benefit more from being inside a tax-free wrapper, while already tax-efficient assets might fit fine in taxable. This is a general concept, not advice.',
      graphic: '📍',
      backgroundColor: '#fff7ed',
    },

    // --- Questions (with rationales) ---
    {
      id: 'quiz-1',
      type: 'quiz',
      title: 'Quick Check 1',
      question:
        'Which feature best defines a tax-free (after-tax) account conceptually?',
      options: [
        {
          id: 'A',
          text: 'You get a tax deduction on contributions today.',
          correct: false,
          rationale:
            'That describes pre-tax accounts. Tax-free (after-tax) generally has no upfront deduction.',
        },
        {
          id: 'B',
          text: 'You contribute after tax; growth/withdrawals are tax-free within limits.',
          correct: true,
          rationale:
            'Correct. After-tax in; returns and withdrawals can be tax-free subject to rules and limits.',
        },
        {
          id: 'C',
          text: 'It guarantees higher market returns than taxable accounts.',
          correct: false,
          rationale:
            'Tax treatment affects after-tax outcome, not market performance.',
        },
        {
          id: 'D',
          text: 'There are no limits on how much you can contribute.',
          correct: false,
          rationale:
            'Most tax-free systems impose annual and/or lifetime limits.',
        },
      ],
      backgroundColor: '#fdf2f8',
    },
    {
      id: 'quiz-2',
      type: 'quiz',
      title: 'Quick Check 2',
      question:
        'What is a likely consequence of contributing above the allowed tax-free limit?',
      options: [
        {
          id: 'A',
          text: 'Nothing changes; all growth stays tax-free.',
          correct: false,
          rationale:
            'Typically, exceeding the limit can trigger penalties or additional tax per local rules.',
        },
        {
          id: 'B',
          text: 'Penalties or extra tax may apply according to the rules.',
          correct: true,
          rationale:
            'Correct. Track contributions and know the limits to avoid penalties.',
        },
        {
          id: 'C',
          text: 'You lose your entire balance automatically.',
          correct: false,
          rationale:
            'Losing the whole balance is not how these accounts usually work; penalties/extra tax are more typical.',
        },
        {
          id: 'D',
          text: 'Your contributions are refunded with interest.',
          correct: false,
          rationale:
            'Refunds with interest are not a standard consequence of exceeding limits.',
        },
      ],
      backgroundColor: '#eef2ff',
    },
    {
      id: 'quiz-3',
      type: 'quiz',
      title: 'Quick Check 3',
      question:
        'For which goal does a tax-free account often make the most sense?',
      options: [
        {
          id: 'A',
          text: 'Short-term cash you plan to withdraw in a few weeks.',
          correct: false,
          rationale:
            'Frequent short-term withdrawals reduce the benefit of tax-free compounding.',
        },
        {
          id: 'B',
          text: 'Long-term investing where returns can compound for years.',
          correct: true,
          rationale:
            'Correct. Tax-free growth shines over longer horizons.',
        },
        {
          id: 'C',
          text: 'Daily spending money.',
          correct: false,
          rationale:
            'Daily cash belongs in flexible transactional/savings options, not typically a tax-free wrapper.',
        },
        {
          id: 'D',
          text: 'A once-off purchase next month.',
          correct: false,
          rationale:
            'Short horizons rarely benefit from tax-free compounding.',
        },
      ],
      backgroundColor: '#fff7ed',
    },
    {
      id: 'quiz-4',
      type: 'quiz',
      title: 'Quick Check 4',
      question:
        'Which statement best reflects the “asset location” idea?',
      options: [
        {
          id: 'A',
          text: 'Put assets with returns that are usually taxed more heavily inside the tax-free account.',
          correct: true,
          rationale:
            'Correct. Shielding more heavily taxed returns can improve after-tax compounding (general concept).',
        },
        {
          id: 'B',
          text: 'Hold only cash in tax-free accounts.',
          correct: false,
          rationale:
            'Over-concentrating in cash can limit growth; the mix should reflect goals and risk tolerance.',
        },
        {
          id: 'C',
          text: 'Asset location guarantees higher returns.',
          correct: false,
          rationale:
            'It can improve after-tax outcomes but cannot guarantee market returns.',
        },
        {
          id: 'D',
          text: 'Taxable accounts always produce lower returns.',
          correct: false,
          rationale:
            'Not always—outcomes depend on assets, turnover, tax rules, and investor behaviour.',
        },
      ],
      backgroundColor: '#f1f5f9',
    },
    {
      id: 'quiz-5',
      type: 'quiz',
      title: 'Quick Check 5',
      question:
        'True or False: A tax-free (after-tax) account gives you a tax deduction today.',
      options: [
        {
          id: 'A',
          text: 'True',
          correct: false,
          rationale:
            'That’s a pre-tax feature. Tax-free typically has no upfront deduction.',
        },
        {
          id: 'B',
          text: 'False',
          correct: true,
          rationale:
            'Correct. Contributions are after-tax; the benefit is tax-free growth/withdrawals within limits.',
        },
      ],
      backgroundColor: '#e0f2fe',
    },
  ],
});

export default getTaxRetireTfsaVsTaxable;
