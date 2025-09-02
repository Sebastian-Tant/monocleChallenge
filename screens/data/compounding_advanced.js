// screens/data/compounding_advanced.js

// Named + default export so either import style works.
export const getCompoundingAdvanced = () => ({
  id: 'compounding-advanced',
  title: 'Compounding Advanced: EAR, Continuous, Real Returns',
  description:
    'Deeper concepts: APR vs EAR, continuous compounding, real (inflation-adjusted) returns, volatility drag, and how compounding affects debt.',
  duration: '10–12 min',
  difficulty: 'Advanced',
  completed: false,
  progress: 0,
  pages: [
    // --- Teachings ---
    {
      id: 'apr-ear',
      type: 'story',
      title: 'APR vs EAR (APY)',
      content:
        'APR (nominal rate) ignores how often interest is added during the year. EAR/APY is the true annual growth including the effect of compounding frequency. For the same nominal rate, more frequent compounding → higher EAR.',
      graphic: '📊',
      backgroundColor: '#f0f9ff',
    },
    {
      id: 'continuous',
      type: 'story',
      title: 'Continuous Compounding',
      content:
        'As compounding frequency goes to infinity, we get continuous compounding. The amount after time t is A = P·e^(r·t). For a given nominal r over one year, continuous compounding yields slightly more than monthly, which yields more than annual.',
      graphic: '∞',
      backgroundColor: '#fefce8',
    },
    {
      id: 'real-returns',
      type: 'story',
      title: 'Real (Inflation-Adjusted) Return',
      content:
        'Nominal return ignores inflation. Real return ≈ (1 + nominal) / (1 + inflation) − 1. Even strong nominal gains can look modest after rising prices are considered.',
      graphic: '🎈',
      backgroundColor: '#f0fdf4',
    },
    {
      id: 'volatility-drag',
      type: 'story',
      title: 'Volatility Drag (Geometric vs Arithmetic)',
      content:
        'The arithmetic average of yearly returns can overstate growth. Compounding uses the geometric average, which is pulled down by volatility. Smoother returns with the same average usually compound to a higher final value.',
      graphic: '📉',
      backgroundColor: '#eef2ff',
    },
    {
      id: 'debt-side',
      type: 'story',
      title: 'When Compounding Hurts: Debt',
      content:
        'High-interest revolving debt compounds against you. Paying only the minimum often extends the payoff time and increases total interest. Extra payments to principal early can dramatically reduce total interest.',
      graphic: '💳',
      backgroundColor: '#fff7ed',
    },

    // --- Questions (with rationales) ---
    {
      id: 'quiz-1',
      type: 'quiz',
      title: 'Quick Check 1',
      question: 'Which best describes the Effective Annual Rate (EAR)?',
      options: [
        {
          id: 'A',
          text: 'The bank’s advertised (nominal) APR.',
          correct: false,
          rationale:
            'APR is nominal and ignores how often interest is added during the year.',
        },
        {
          id: 'B',
          text: 'The actual yearly growth including the impact of compounding frequency.',
          correct: true,
          rationale:
            'Correct. EAR/APY reflects true one-year growth once compounding during the year is accounted for.',
        },
        {
          id: 'C',
          text: 'A rate that excludes fees and taxes but includes compounding.',
          correct: false,
          rationale:
            'Fees/taxes are separate issues. EAR is about compounding frequency, not fee policy.',
        },
        {
          id: 'D',
          text: 'A fixed rate that never changes across banks.',
          correct: false,
          rationale:
            'EAR depends on both the nominal rate and how frequently it compounds, which vary by product.',
        },
      ],
      backgroundColor: '#fdf2f8',
    },
    {
      id: 'quiz-2',
      type: 'quiz',
      title: 'Quick Check 2',
      question:
        'For the same nominal 10% over one year, which typically gives the highest end amount?',
      options: [
        {
          id: 'A',
          text: '10% compounded annually',
          correct: false,
          rationale:
            'Annual adds interest once. More frequent compounding generally yields a bit more.',
        },
        {
          id: 'B',
          text: '10% compounded monthly',
          correct: false,
          rationale:
            'Monthly beats annual, but continuous compounding is the theoretical maximum.',
        },
        {
          id: 'C',
          text: '10% compounded continuously',
          correct: true,
          rationale:
            'Correct. For a fixed nominal rate, continuous compounding yields slightly more than monthly, which yields more than annual.',
        },
        {
          id: 'D',
          text: 'They are identical if the nominal is the same',
          correct: false,
          rationale:
            'Frequency matters. Higher frequency → slightly higher effective growth for the same nominal rate.',
        },
      ],
      backgroundColor: '#eef2ff',
    },
    {
      id: 'quiz-3',
      type: 'quiz',
      title: 'Quick Check 3',
      question:
        'If nominal return is 8% and inflation is 6%, the real return is closest to…',
      options: [
        {
          id: 'A',
          text: '≈ 8%',
          correct: false,
          rationale:
            'That’s the nominal return. We must adjust for inflation to find real return.',
        },
        {
          id: 'B',
          text: '≈ 1.9%',
          correct: true,
          rationale:
            'Correct. Real ≈ (1.08 / 1.06 − 1) ≈ 1.886% (about 1.9%).',
        },
        {
          id: 'C',
          text: '≈ 2.5%',
          correct: false,
          rationale:
            'Too high. The proper formula gives ≈ 1.9%, not 2.5%.',
        },
        {
          id: 'D',
          text: '≈ 14%',
          correct: false,
          rationale:
            'Adding 8% and 6% is not how real returns work; we must inflation-adjust, not add.',
        },
      ],
      backgroundColor: '#fff7ed',
    },
    {
      id: 'quiz-4',
      type: 'quiz',
      title: 'Quick Check 4',
      question:
        'Using the exact doubling-time formula T = ln(2) / r, how long to double at 6% per year?',
      options: [
        {
          id: 'A',
          text: 'About 10 years',
          correct: false,
          rationale:
            'Too short. ln(2)/0.06 ≈ 11.55 years.',
        },
        {
          id: 'B',
          text: 'About 12 years (Rule of 72)',
          correct: false,
          rationale:
            'The Rule of 72 gives ~12, which is a good approximation, but the exact value is ~11.6 years.',
        },
        {
          id: 'C',
          text: 'About 11.6 years (exact)',
          correct: true,
          rationale:
            'Correct. ln(2)/0.06 ≈ 11.55 years, a bit less than the Rule-of-72 estimate.',
        },
        {
          id: 'D',
          text: 'About 14 years',
          correct: false,
          rationale:
            'Too long for 6% using the exact doubling-time formula.',
        },
      ],
      backgroundColor: '#f1f5f9',
    },
    {
      id: 'quiz-5',
      type: 'quiz',
      title: 'Quick Check 5',
      question:
        'Two portfolios both average 8% per year arithmetically over 10 years. Portfolio X is smooth; Portfolio Y is very volatile. Which compounds to a higher final value (no deposits/withdrawals)?',
      options: [
        {
          id: 'A',
          text: 'Portfolio Y (higher volatility boosts compounding)',
          correct: false,
          rationale:
            'Higher volatility usually reduces geometric (compound) return due to volatility drag.',
        },
        {
          id: 'B',
          text: 'Portfolio X (lower volatility → higher geometric return)',
          correct: true,
          rationale:
            'Correct. With the same arithmetic average, the portfolio with lower volatility typically ends higher because compounding uses the geometric mean.',
        },
        {
          id: 'C',
          text: 'They end exactly equal',
          correct: false,
          rationale:
            'Equal arithmetic averages don’t imply equal compound outcomes; volatility matters.',
        },
        {
          id: 'D',
          text: 'Impossible to tell without fees',
          correct: false,
          rationale:
            'Even ignoring fees, volatility drag means smoother paths tend to compound better.',
        },
      ],
      backgroundColor: '#e0f2fe',
    },
    {
      id: 'quiz-6',
      type: 'quiz',
      title: 'Quick Check 6',
      question:
        'Which statement about making only minimum payments on high-interest revolving debt is most accurate?',
      options: [
        {
          id: 'A',
          text: 'It reduces total interest dramatically.',
          correct: false,
          rationale:
            'Minimums usually keep you in debt longer and can barely dent principal.',
        },
        {
          id: 'B',
          text: 'It can extend the payoff time and increase total interest; extra principal payments earlier save a lot.',
          correct: true,
          rationale:
            'Correct. Compounding works against you in debt. Paying more than the minimum reduces principal sooner and cuts total interest.',
        },
        {
          id: 'C',
          text: 'It has no effect on total interest paid.',
          correct: false,
          rationale:
            'It has a large effect: smaller principal reductions mean more interest accrues over time.',
        },
        {
          id: 'D',
          text: 'It always leads to negative amortization.',
          correct: false,
          rationale:
            'Negative amortization happens only when payments don’t even cover the interest due; minimums can avoid it, but payoff still drags out.',
        },
      ],
      backgroundColor: '#fde68a',
    },
  ],
});

export default getCompoundingAdvanced;
