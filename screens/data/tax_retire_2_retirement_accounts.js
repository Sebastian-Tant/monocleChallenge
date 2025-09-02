// screens/data/tax_retire_2_retirement_accounts.js

// Named + default export so either import style works.
export const getTaxRetireRetirementAccounts = () => ({
  id: 'tax-retire-2-retirement-accounts',
  title: 'Taxes & Retirement Basics: Retirement Accounts',
  description:
    'What retirement accounts are for, pre-tax vs after-tax concepts, employer contributions, portability, and long-term investing basics.',
  duration: '8–10 min',
  difficulty: 'Beginner',
  completed: false,
  progress: 0,
  pages: [
    // --- Teachings ---
    {
      id: 'what-is',
      type: 'story',
      title: 'Purpose of Retirement Accounts',
      content:
        'Retirement accounts are containers for long-term savings. Their key benefit is tax treatment (subject to local rules), which can help money compound more efficiently over time.',
      graphic: '🏦',
      backgroundColor: '#f0f9ff',
    },
    {
      id: 'pre-vs-post',
      type: 'story',
      title: 'Pre-Tax vs After-Tax (Concepts)',
      content:
        'Pre-tax contributions can reduce taxable income today, with taxes generally deferred until withdrawal. After-tax (“tax-free” style) contributions don’t reduce today’s taxable income, but growth/withdrawals can be tax-free up to rules and limits.',
      graphic: '⚖️',
      backgroundColor: '#fefce8',
    },
    {
      id: 'employer',
      type: 'story',
      title: 'Employer Contributions / Matching (If Offered)',
      content:
        'Some employers contribute to retirement on your behalf or match part of what you contribute. Matching is often like “free money” up to a limit—always check your employer’s policy and vesting rules.',
      graphic: '🤝',
      backgroundColor: '#f0fdf4',
    },
    {
      id: 'portability',
      type: 'story',
      title: 'Leaving a Job: Preserve or Cash Out?',
      content:
        'When changing jobs, many systems allow you to preserve/transfer retirement money to keep tax advantages and compounding intact. Cashing out early can trigger taxes/penalties and shrink long-term savings.',
      graphic: '🔁',
      backgroundColor: '#eef2ff',
    },
    {
      id: 'investing-basics',
      type: 'story',
      title: 'Long-Term Investing Basics',
      content:
        'Retirement money is typically invested for the long run. A diversified mix aligned to time horizon and risk tolerance is a common approach. Costs and consistency matter; this is education, not personal advice.',
      graphic: '📈',
      backgroundColor: '#fff7ed',
    },

    // --- Questions (with rationales) ---
    {
      id: 'quiz-1',
      type: 'quiz',
      title: 'Quick Check 1',
      question:
        'Which statement best describes a pre-tax retirement contribution (conceptually)?',
      options: [
        {
          id: 'A',
          text: 'It reduces taxable income today (within rules/limits); taxes are typically paid later on withdrawals.',
          correct: true,
          rationale:
            'Correct. Pre-tax contributions can lower current taxable income; taxation is usually deferred to withdrawal.',
        },
        {
          id: 'B',
          text: 'It increases taxable income today but is tax-free at withdrawal by definition.',
          correct: false,
          rationale:
            'Pre-tax generally lowers current taxable income. Whether withdrawals are taxed depends on the account rules.',
        },
        {
          id: 'C',
          text: 'It guarantees higher investment returns than other accounts.',
          correct: false,
          rationale:
            'Tax treatment affects after-tax outcomes, not market performance or guarantees.',
        },
        {
          id: 'D',
          text: 'It is identical to an after-tax (“tax-free”) account.',
          correct: false,
          rationale:
            'After-tax accounts are funded with after-tax money; growth/withdrawals can be tax-free within limits—different concept.',
        },
      ],
      backgroundColor: '#fdf2f8',
    },
    {
      id: 'quiz-2',
      type: 'quiz',
      title: 'Quick Check 2',
      question:
        'Your employer offers to match a portion of your contributions to a retirement account. Which statement is most accurate?',
      options: [
        {
          id: 'A',
          text: 'It’s effectively extra compensation for retirement savings up to the match limit.',
          correct: true,
          rationale:
            'Correct. Matching is essentially additional compensation when you contribute, up to policy limits.',
        },
        {
          id: 'B',
          text: 'It lowers your salary permanently.',
          correct: false,
          rationale:
            'A match does not lower your base salary; it’s an additional employer contribution.',
        },
        {
          id: 'C',
          text: 'It always vests immediately without conditions.',
          correct: false,
          rationale:
            'Vesting rules vary. Some plans vest over time—always check the policy.',
        },
        {
          id: 'D',
          text: 'It guarantees your investments will not lose value.',
          correct: false,
          rationale:
            'A match doesn’t remove investment risk; it’s about contributions, not guarantees.',
        },
      ],
      backgroundColor: '#eef2ff',
    },
    {
      id: 'quiz-3',
      type: 'quiz',
      title: 'Quick Check 3',
      question:
        'When leaving a job, which approach generally preserves the account’s tax advantages and compounding?',
      options: [
        {
          id: 'A',
          text: 'Preserve/transfer the funds according to the rules.',
          correct: true,
          rationale:
            'Correct. Preserving/transferring typically maintains tax advantages and keeps compounding going.',
        },
        {
          id: 'B',
          text: 'Cash out early because taxes/penalties never apply.',
          correct: false,
          rationale:
            'Early cash-outs can trigger taxes/penalties and reduce long-term savings.',
        },
        {
          id: 'C',
          text: 'Convert everything to cash and spend it; investment time horizon is irrelevant.',
          correct: false,
          rationale:
            'Spending eliminates future compounding and may incur taxes/penalties.',
        },
        {
          id: 'D',
          text: 'There is no difference between preserving and cashing out.',
          correct: false,
          rationale:
            'There is a significant difference for taxes and long-term growth potential.',
        },
      ],
      backgroundColor: '#fff7ed',
    },
    {
      id: 'quiz-4',
      type: 'quiz',
      title: 'Quick Check 4',
      question:
        'Which statement best describes a common approach to investing inside a long-term retirement account?',
      options: [
        {
          id: 'A',
          text: 'Hold only cash because retirement is far away.',
          correct: false,
          rationale:
            'Cash avoids volatility but may not keep up with long-term growth needs or inflation.',
        },
        {
          id: 'B',
          text: 'Use a diversified mix aligned to time horizon and risk tolerance; keep costs in mind.',
          correct: true,
          rationale:
            'Correct. A diversified, time-horizon-aware mix with attention to costs is a common long-term approach (this is education, not advice).',
        },
        {
          id: 'C',
          text: 'Chase last year’s top-performing asset; it always repeats.',
          correct: false,
          rationale:
            'Past performance is not a guarantee; chasing recent winners can increase risk.',
        },
        {
          id: 'D',
          text: 'Put everything into a single high-risk asset to maximize returns.',
          correct: false,
          rationale:
            'Concentration increases risk; diversification helps manage it for long-term goals.',
        },
      ],
      backgroundColor: '#f1f5f9',
    },
  ],
});

export default getTaxRetireRetirementAccounts;
