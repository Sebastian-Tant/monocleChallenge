// screens/data/tax_retire_4_drawdown_101.js

// Named + default export so either import style works.
export const getTaxRetireDrawdown101 = () => ({
  id: 'tax-retire-4-drawdown-101',
  title: 'Taxes & Retirement Basics: Drawdown 101',
  description:
    'What “drawdown” means, common annuity types, the idea of a sustainable withdrawal rate, and key risks (sequence risk, inflation, longevity). Education only, not advice.',
  duration: '9–11 min',
  difficulty: 'Intermediate',
  completed: false,
  progress: 0,
  pages: [
    // --- Teachings ---
    {
      id: 'what-is-drawdown',
      type: 'story',
      title: 'What Is Drawdown?',
      content:
        'Drawdown is the phase where you spend from your retirement savings. The goal is to fund living costs without depleting the portfolio too quickly.',
      graphic: '🏁',
      backgroundColor: '#f0f9ff',
    },
    {
      id: 'annuities',
      type: 'story',
      title: 'Annuity Types (High Level)',
      content:
        'Two broad approaches: (1) a “living”/investment-linked annuity where you invest and choose withdrawals; (2) a “life”/guaranteed annuity that pays a set income for life (terms vary). Each has trade-offs in flexibility, guarantees, and risk.',
      graphic: '🧩',
      backgroundColor: '#fefce8',
    },
    {
      id: 'swr-concept',
      type: 'story',
      title: 'Sustainable Withdrawal Rate (Concept)',
      content:
        'A withdrawal rate is the percentage you take from your portfolio each year. A lower rate is generally safer. Rules of thumb (like “~4%”) are rough, historical heuristics—not guarantees.',
      graphic: '📏',
      backgroundColor: '#f0fdf4',
    },
    {
      id: 'sequence-risk',
      type: 'story',
      title: 'Sequence of Returns Risk',
      content:
        'Poor market returns early in retirement can hurt more than poor returns later, because you are withdrawing while the portfolio is down. Managing risk/volatility matters.',
      graphic: '📉',
      backgroundColor: '#eef2ff',
    },
    {
      id: 'inflation-longevity',
      type: 'story',
      title: 'Inflation & Longevity',
      content:
        'Prices tend to rise (inflation) and people may live longer than expected (longevity). Drawdown plans should consider rising costs and a long time horizon.',
      graphic: '⏳',
      backgroundColor: '#fff7ed',
    },

    // --- Questions (with rationales) ---
    {
      id: 'quiz-1',
      type: 'quiz',
      title: 'Quick Check 1',
      question: 'What does “drawdown” refer to in retirement planning?',
      options: [
        {
          id: 'A',
          text: 'The phase of adding money to retirement accounts.',
          correct: false,
          rationale:
            'That’s the accumulation phase. Drawdown is when you start taking money out.',
        },
        {
          id: 'B',
          text: 'The phase where you withdraw income from your savings to live on.',
          correct: true,
          rationale:
            'Correct. Drawdown = spending from your portfolio to fund living expenses.',
        },
        {
          id: 'C',
          text: 'A market crash that always forces retirees to sell.',
          correct: false,
          rationale:
            'Market declines can be part of sequence risk, but “drawdown” here means the retirement spending phase.',
        },
        {
          id: 'D',
          text: 'An automatic guarantee that income will last for life.',
          correct: false,
          rationale:
            'A guarantee like that would be associated with a specific life annuity product, not with drawdown in general.',
        },
      ],
      backgroundColor: '#fdf2f8',
    },
    {
      id: 'quiz-2',
      type: 'quiz',
      title: 'Quick Check 2',
      question:
        'Which statement best contrasts living (investment-linked) vs life (guaranteed) annuities at a high level?',
      options: [
        {
          id: 'A',
          text: 'Living annuities offer flexibility but market risk; life annuities offer guaranteed income with less flexibility.',
          correct: true,
          rationale:
            'Correct. Living = flexible/market-linked; Life = guaranteed income/less flexible (details vary by product).',
        },
        {
          id: 'B',
          text: 'Living annuities always guarantee income for life.',
          correct: false,
          rationale:
            'Guarantees are a hallmark of life/guaranteed annuities, not living annuities.',
        },
        {
          id: 'C',
          text: 'Life annuities always produce higher investment returns.',
          correct: false,
          rationale:
            'A life annuity provides an income guarantee; it doesn’t inherently produce higher market returns.',
        },
        {
          id: 'D',
          text: 'There’s no difference between the two.',
          correct: false,
          rationale:
            'They differ meaningfully in risk, flexibility, and guarantees.',
        },
      ],
      backgroundColor: '#eef2ff',
    },
    {
      id: 'quiz-3',
      type: 'quiz',
      title: 'Quick Check 3',
      question:
        'Which statement about a “sustainable withdrawal rate” is most accurate?',
      options: [
        {
          id: 'A',
          text: 'It’s a guaranteed rate that works in all markets.',
          correct: false,
          rationale:
            'No withdrawal rate is guaranteed. It’s a planning heuristic, not a promise.',
        },
        {
          id: 'B',
          text: 'Lower withdrawal percentages generally reduce the risk of running out of money.',
          correct: true,
          rationale:
            'Correct. Withdrawing less puts less pressure on the portfolio and typically improves sustainability.',
        },
        {
          id: 'C',
          text: 'Higher withdrawal percentages are always better.',
          correct: false,
          rationale:
            'Higher withdrawals increase the chance of depleting the portfolio, especially with poor early returns.',
        },
        {
          id: 'D',
          text: 'It eliminates the need to consider inflation.',
          correct: false,
          rationale:
            'Inflation still matters—spending power needs to keep up with rising prices.',
        },
      ],
      backgroundColor: '#fff7ed',
    },
    {
      id: 'quiz-4',
      type: 'quiz',
      title: 'Quick Check 4',
      question:
        'Why is “sequence of returns” risk important in the early years of retirement?',
      options: [
        {
          id: 'A',
          text: 'Because poor early returns, combined with withdrawals, can permanently reduce the portfolio.',
          correct: true,
          rationale:
            'Correct. Selling while down early can lock in losses and shrink future compounding.',
        },
        {
          id: 'B',
          text: 'Because once returns are poor early on, markets never recover.',
          correct: false,
          rationale:
            'Markets can and do recover, but early withdrawals in a downturn can still cause lasting damage.',
        },
        {
          id: 'C',
          text: 'Because it only matters for young investors.',
          correct: false,
          rationale:
            'Sequence risk is especially relevant when you’re withdrawing (retirement), not just when you’re young.',
        },
        {
          id: 'D',
          text: 'Because it guarantees higher inflation later.',
          correct: false,
          rationale:
            'Sequence risk is about the order of returns, not inflation itself.',
        },
      ],
      backgroundColor: '#f1f5f9',
    },
    {
      id: 'quiz-5',
      type: 'quiz',
      title: 'Quick Check 5',
      question:
        'Which pairing best matches the risk with a mitigation idea (conceptually)?',
      options: [
        {
          id: 'A',
          text: 'Inflation risk → consider indexing/adjusting withdrawals over time (subject to plan)',
          correct: true,
          rationale:
            'Correct. Many plans consider inflation adjustments to maintain purchasing power (details vary).',
        },
        {
          id: 'B',
          text: 'Longevity risk → simply withdraw more each year',
          correct: false,
          rationale:
            'Withdrawing more increases the risk of running out. Longevity may require lower withdrawals or guarantees.',
        },
        {
          id: 'C',
          text: 'Sequence risk → increase equity allocation after a crash automatically',
          correct: false,
          rationale:
            'There’s no one-size rule; rebalancing and spending rules vary. The concept is to manage withdrawals/volatility prudently.',
        },
        {
          id: 'D',
          text: 'Market risk → ignore diversification',
          correct: false,
          rationale:
            'Diversification is a common way to help manage market risk, not ignore it.',
        },
      ],
      backgroundColor: '#e0f2fe',
    },
  ],
});

export default getTaxRetireDrawdown101;
