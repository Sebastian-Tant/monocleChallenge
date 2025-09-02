// screens/data/investing_intermediate.js
// Plain strings; no i18n required.

const getInvestingIntermediate = () => ({
  id: 'investing-intermediate',
  title: 'Investing Intermediate (SA): Allocation, Rebalancing & Costs',
  description:
    'Pick a target mix (shares/bonds/cash) that fits your goals, keep it on track with rebalancing, and cut silent costs that eat returns.',
  duration: '10–12 min',
  difficulty: 'Intermediate',
  completed: false,
  progress: 0,
  pages: [
    // --- Teachings ---
    {
      id: 'asset-allocation',
      type: 'story',
      title: 'Asset Allocation = Most of the Journey',
      content:
        'Your split between growth assets (equities) and stabilisers (bonds/cash) drives most outcomes. Longer timelines can usually hold more equities; shorter timelines need more bonds/cash. Example targets: 80/20 (aggressive), 60/40 (balanced), 40/60 (conservative).',
      graphic: '⚖️',
      backgroundColor: '#eff6ff',
    },
    {
      id: 'rebalancing',
      type: 'story',
      title: 'Rebalancing: Nudge Back to Target',
      content:
        'Markets drift. If 60/40 drifts to 70/30 after a rally, you’re taking more risk than intended. Rebalance by selling a bit of the overweight and buying the underweight. Methods: calendar (e.g., annually) or threshold (e.g., +/-5%). Prefer doing this inside TFSA/RA to avoid tax events.',
      graphic: '🔄',
      backgroundColor: '#fefce8',
    },
    {
      id: 'fees-and-tax',
      type: 'story',
      title: 'Costs & SA Tax Basics',
      content:
        'Costs compound too. Lower Total Expense Ratios (TER) and platform fees can add big value over decades. Tax notes (not advice): TFSAs shelter growth from SA tax (within limits). Outside tax shelters, capital gains tax (CGT) may apply when you sell at a profit and withholding tax can apply to some foreign dividends.',
      graphic: '💸',
      backgroundColor: '#f0fdf4',
    },

    // --- Quizzes (with rationales) ---
    {
      id: 'quiz-1',
      type: 'quiz',
      title: 'Quick Check 1',
      question:
        'You’re investing for a goal 8–10 years away and can tolerate ups and downs. Which target mix is MOST appropriate?',
      options: [
        {
          id: 'A',
          text: '80% equities / 20% bonds-cash (growth-focused).',
          correct: true,
          rationale:
            'A longer horizon can usually carry a higher equity share for growth (if you can stomach volatility).',
        },
        {
          id: 'B',
          text: '20% equities / 80% bonds-cash (very conservative).',
          correct: false,
          rationale:
            'This prioritises stability over growth; better for short horizons or low risk capacity.',
        },
        {
          id: 'C',
          text: '100% cash in a savings account.',
          correct: false,
          rationale:
            'Low volatility, but likely to trail inflation over a decade.',
        },
        {
          id: 'D',
          text: 'Whatever went up most last month.',
          correct: false,
          rationale:
            'Performance-chasing is not a strategy; stick to a deliberate allocation.',
        },
      ],
      rationaleIfCorrect:
        'Nice. A higher equity share fits long horizons if you can handle volatility.',
      rationaleIfWrong:
        'For 8–10 years, a growth-leaning allocation (e.g., 80/20) is often suitable if you can tolerate swings.',
      backgroundColor: '#fdf2f8',
    },
    {
      id: 'quiz-2',
      type: 'quiz',
      title: 'Quick Check 2',
      question:
        'Your 60/40 portfolio drifted to 70/30 after equities rallied. What’s the best next move?',
      options: [
        {
          id: 'A',
          text: 'Rebalance back toward 60/40 (sell some equities, add to bonds).',
          correct: true,
          rationale:
            'That restores your intended risk level and reduces drift.',
        },
        {
          id: 'B',
          text: 'Do nothing — higher risk is always better.',
          correct: false,
          rationale:
            'More risk isn’t always better; it must match your plan and capacity.',
        },
        {
          id: 'C',
          text: 'Move everything to cash immediately.',
          correct: false,
          rationale:
            'That’s a drastic shift and likely derails your long-term plan.',
        },
        {
          id: 'D',
          text: 'Double down on equities because they’re “hot.”',
          correct: false,
          rationale:
            'Chasing momentum can backfire; stick to your target mix.',
        },
      ],
      rationaleIfCorrect:
        'Exactly. Rebalancing controls risk and keeps the plan intentional.',
      rationaleIfWrong:
        'Rebalance back to your target mix to keep risk where you intended.',
      backgroundColor: '#eef2ff',
    },
    {
      id: 'quiz-3',
      type: 'quiz',
      title: 'Quick Check 3',
      question:
        'Which factor most reliably boosts long-term investor outcomes (all else equal)?',
      options: [
        {
          id: 'A',
          text: 'Minimising fees (TER/platform) and staying the course.',
          correct: true,
          rationale:
            'Lower costs compound in your favour and discipline keeps compounding working.',
        },
        {
          id: 'B',
          text: 'Switching funds every few months.',
          correct: false,
          rationale:
            'Frequent switching can increase costs and lead to buying high/selling low.',
        },
        {
          id: 'C',
          text: 'Waiting for the “perfect” time to invest.',
          correct: false,
          rationale:
            'Market timing is very hard; time in the market typically wins.',
        },
        {
          id: 'D',
          text: 'Picking the single best-performing stock each year.',
          correct: false,
          rationale:
            'Single-stock bets add concentration risk and are hard to repeat.',
        },
      ],
      rationaleIfCorrect:
        'Spot on. Cost control + consistency are quiet superpowers over decades.',
      rationaleIfWrong:
        'Lower costs and consistent investing usually beat frequent switching or timing bets.',
      backgroundColor: '#fff7ed',
    },
  ],
});

export default getInvestingIntermediate;
