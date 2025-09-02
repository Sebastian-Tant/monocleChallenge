// screens/data/investing_advanced.js
// Plain strings; no i18n required.

const getInvestingAdvanced = () => ({
  id: 'investing-advanced',
  title: 'Investing Advanced (SA): Global Mix, Sequence Risk & Withdrawals',
  description:
    'Tackle home-bias and currency risk, understand sequence-of-returns risk, and build a sensible withdrawal plan for later stages.',
  duration: '12–14 min',
  difficulty: 'Advanced',
  completed: false,
  progress: 0,
  pages: [
    // --- Teachings ---
    {
      id: 'global-diversification',
      type: 'story',
      title: 'Global Diversification & Home Bias',
      content:
        'South Africans often concentrate in local assets (home bias). Adding broad global equity (developed + emerging markets) reduces single-country risk, political risk, and sector concentration. Mix local and offshore ETFs to balance currency exposure and opportunity.',
      graphic: '🌐',
      backgroundColor: '#eff6ff',
    },
    {
      id: 'sequence-risk',
      type: 'story',
      title: 'Sequence-of-Returns Risk',
      content:
        'Average return isn’t the whole story. The ORDER of returns matters when you’re drawing money. Large early losses near retirement (or a major goal) can hurt sustainability even if long-run averages are similar. Mitigate by de-risking as the goal nears and keeping a “cash/bonds runway.”',
      graphic: '🧭',
      backgroundColor: '#fefce8',
    },
    {
      id: 'withdrawals',
      type: 'story',
      title: 'Withdrawals: Rules of Thumb (Not Advice)',
      content:
        'A classic starting point is ~4% of portfolio value (inflation-adjusted), but it’s NOT a guarantee. Flexibility helps: lower withdrawals after bad years, harvest from assets that outperformed, and rebalance. Costs, taxes, and your asset mix all affect safe withdrawal rates.',
      graphic: '💼',
      backgroundColor: '#f0fdf4',
    },

    // --- Quizzes (with rationales) ---
    {
      id: 'quiz-1',
      type: 'quiz',
      title: 'Quick Check 1',
      question:
        'Which portfolio best reduces home-country concentration risk for a South African investor?',
      options: [
        {
          id: 'A',
          text: 'Only a single JSE-listed stock.',
          correct: false,
          rationale:
            'Single-stock exposure is highly concentrated — sector and company risk are huge.',
        },
        {
          id: 'B',
          text: '50% SA equity ETF + 50% broad global equity ETF.',
          correct: true,
          rationale:
            'Mixing local and broad global exposure cuts single-country and sector risk.',
        },
        {
          id: 'C',
          text: 'Keep everything in ZAR cash to avoid volatility.',
          correct: false,
          rationale:
            'Cash lowers volatility but risks long-run underperformance vs inflation and no equity growth.',
        },
        {
          id: 'D',
          text: 'Only USD cash and no equities.',
          correct: false,
          rationale:
            'Currency alone isn’t diversification; you still miss equity growth and remain concentrated in one asset type.',
        },
      ],
      rationaleIfCorrect:
        'Exactly — blending local with broad global equity trims home-bias risk.',
      rationaleIfWrong:
        'Diversify beyond one stock or one currency: combine SA equity with a broad global equity ETF.',
      backgroundColor: '#fdf2f8',
    },
    {
      id: 'quiz-2',
      type: 'quiz',
      title: 'Quick Check 2',
      question:
        'You’re 2–3 years from a big goal. What most directly lowers sequence-of-returns risk?',
      options: [
        {
          id: 'A',
          text: 'Increase equities to chase the last bit of growth.',
          correct: false,
          rationale:
            'More equity increases the chance of a large drawdown right before the goal.',
        },
        {
          id: 'B',
          text: 'Gradually shift part of the portfolio to bonds/cash and build a 1–3 year spending runway.',
          correct: true,
          rationale:
            'De-risking + a short-term runway reduces the need to sell after a bad market year.',
        },
        {
          id: 'C',
          text: 'Ignore market conditions and hope for average returns.',
          correct: false,
          rationale:
            'Hope isn’t a plan; sequence risk is about timing of returns when withdrawing.',
        },
        {
          id: 'D',
          text: 'Sell everything and hold only cash for a decade.',
          correct: false,
          rationale:
            'All-cash for long periods risks falling behind inflation and missing growth.',
        },
      ],
      rationaleIfCorrect:
        'Right — a de-risked runway helps you avoid selling equities at bad times.',
      rationaleIfWrong:
        'Build a 1–3 year cash/bonds runway and reduce equity exposure as the goal nears.',
      backgroundColor: '#eef2ff',
    },
    {
      id: 'quiz-3',
      type: 'quiz',
      title: 'Quick Check 3',
      question:
        'Which statement about withdrawal strategies is MOST accurate?',
      options: [
        {
          id: 'A',
          text: 'The “4% rule” guarantees you’ll never run out of money.',
          correct: false,
          rationale:
            'It’s a guideline from historical simulations, not a guarantee for the future.',
        },
        {
          id: 'B',
          text: 'A flexible approach (spend less after bad years, rebalance, harvest gains) helps sustainability.',
          correct: true,
          rationale:
            'Flexibility adapts to market conditions and can improve longevity of the portfolio.',
        },
        {
          id: 'C',
          text: 'Only dividends should be spent; never sell shares.',
          correct: false,
          rationale:
            'Total-return approaches (dividends + sales) can be more efficient and diversified.',
        },
        {
          id: 'D',
          text: 'Fees and taxes don’t affect safe withdrawal rates.',
          correct: false,
          rationale:
            'They absolutely do — higher costs reduce what you can sustainably withdraw.',
        },
      ],
      rationaleIfCorrect:
        'Exactly — flexible withdrawals and disciplined rebalancing can improve durability.',
      rationaleIfWrong:
        'Use a flexible, total-return approach and mind fees/taxes; 4% is a starting point, not a promise.',
      backgroundColor: '#fff7ed',
    },
  ],
});

export default getInvestingAdvanced;
