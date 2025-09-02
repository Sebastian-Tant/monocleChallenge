// screens/data/credit_advanced.js
// Plain strings; no i18n required.

const getCreditAdvanced = () => ({
  id: 'credit-advanced',
  title: 'Credit Advanced: Optimize, Transfer & Consolidate Safely',
  description:
    'Master statement-cycle tactics, balance-transfer maths, and when consolidation helps (or hurts).',
  duration: '12–14 min',
  difficulty: 'Advanced',
  completed: false,
  progress: 0,
  pages: [
    // --- Teachings ---
    {
      id: 'statement-cycle',
      type: 'story',
      title: 'Statement Cycles, Grace Periods & Daily Interest',
      content:
        'Cards typically charge interest daily on your Average Daily Balance if you don’t pay in full. Pay the FULL statement balance by the due date to keep the grace period. Partial payments usually forfeit the grace period and interest can accrue on new purchases.\n\nTip: Paying down before the statement CLOSE date (not just the due date) can lower reported utilisation and the interest-bearing balance.',
      graphic: '🗓️',
      backgroundColor: '#eff6ff',
    },
    {
      id: 'balance-transfer',
      type: 'story',
      title: 'Balance Transfers: 0% Promos & Fees',
      content:
        'A 0% promo with a 2–3% transfer fee can be cheaper than a high APR — IF you can clear the balance during the promo. Watch for: transfer fee, promo length, revert APR, and whether purchases lose the grace period on that card. Best practice: park the balance, avoid new spending on that card, and automate payoff to finish before the promo ends.',
      graphic: '🔁',
      backgroundColor: '#fefce8',
    },
    {
      id: 'consolidation',
      type: 'story',
      title: 'Consolidation & Refinancing: Pros, Cons & Pitfalls',
      content:
        'Consolidation can lower your monthly payment by stretching the term — but often increases TOTAL interest. Check APR, fees, and early-settlement penalties. Keep old cards open (if there’s no fee) to preserve utilisation/age, but consider locking them away to prevent re-accumulation. If you consolidate, commit to a fixed payoff plan and throw extra at principal.',
      graphic: '🧰',
      backgroundColor: '#f0fdf4',
    },

    // --- Quizzes (with rationales) ---
    {
      id: 'quiz-1',
      type: 'quiz',
      title: 'Quick Check 1',
      question:
        'You want your reported utilisation to drop on next month’s statement. What helps MOST?',
      options: [
        {
          id: 'A',
          text: 'Make a large payment the day AFTER the statement closes.',
          correct: false,
          rationale:
            'After close, the high balance is already reported. It still helps interest, but not utilisation reporting for that cycle.',
        },
        {
          id: 'B',
          text: 'Make a large payment a few days BEFORE the statement close date.',
          correct: true,
          rationale:
            'Paying before close lowers the balance that gets reported, reducing utilisation for that cycle.',
        },
        {
          id: 'C',
          text: 'Only pay the minimum on the due date.',
          correct: false,
          rationale:
            'Minimums won’t lower reported utilisation meaningfully and risk more interest.',
        },
        {
          id: 'D',
          text: 'Open a new card and immediately max it.',
          correct: false,
          rationale:
            'That raises utilisation and adds risk; not helpful.',
        },
      ],
      rationaleIfCorrect:
        'Exactly — aim to reduce the balance BEFORE statement close so the reported figure is lower.',
      rationaleIfWrong:
        'Lower the balance BEFORE statement close; that’s what gets reported as your utilisation snapshot.',
      backgroundColor: '#fdf2f8',
    },
    {
      id: 'quiz-2',
      type: 'quiz',
      title: 'Quick Check 2',
      question:
        'You owe R20,000 at 22% APR. A 0% transfer for 12 months charges a 3% fee. You can repay in 12 months. Which is typically CHEAPER?',
      options: [
        {
          id: 'A',
          text: 'Transfer: pay ~R600 fee now, then 0% if you finish in 12 months.',
          correct: true,
          rationale:
            'The ~R600 fee is usually far less than a year of 22% interest on R20,000, assuming you finish before the promo ends.',
        },
        {
          id: 'B',
          text: 'Stay at 22% APR; avoid the transfer fee.',
          correct: false,
          rationale:
            'Avoiding the fee looks nice, but a full year at 22% on R20k is typically much more costly.',
        },
        {
          id: 'C',
          text: 'They cost the same.',
          correct: false,
          rationale:
            'With full payoff during the promo, 0% + small fee wins in most cases.',
        },
        {
          id: 'D',
          text: 'Impossible to know without a credit score.',
          correct: false,
          rationale:
            'Your score affects approval, but the cost comparison here is fee vs interest.',
        },
      ],
      rationaleIfCorrect:
        'Right. A 3% fee (~R600) is usually far cheaper than 12 months at 22% if you clear the balance in time.',
      rationaleIfWrong:
        'If you will repay within the promo, the one-time 3% fee is typically much less than a year of 22% interest.',
      backgroundColor: '#eef2ff',
    },
    {
      id: 'quiz-3',
      type: 'quiz',
      title: 'Quick Check 3',
      question:
        'A consolidation loan lowers your monthly payment by extending the term at a similar APR. What’s the BIGGEST risk?',
      options: [
        {
          id: 'A',
          text: 'Paying MORE total interest over the life of the loan.',
          correct: true,
          rationale:
            'A longer term at similar APR usually increases total interest despite smaller installments.',
        },
        {
          id: 'B',
          text: 'Your utilisation will instantly drop to 0%.',
          correct: false,
          rationale:
            'Utilisation may improve if revolving balances are paid off, but not to 0% if you still owe.',
        },
        {
          id: 'C',
          text: 'Your credit score becomes permanently fixed.',
          correct: false,
          rationale:
            'Scores still change with behaviour and time.',
        },
        {
          id: 'D',
          text: 'There’s no way to pay it off early.',
          correct: false,
          rationale:
            'You often can pay early; just check for prepayment penalties.',
        },
      ],
      rationaleIfCorrect:
        'Exactly. Longer term = more months to charge interest. If you consolidate, pay extra toward principal to shorten the term.',
      rationaleIfWrong:
        'The key risk is higher TOTAL interest from a longer term. Combat this by paying extra and avoiding new debt.',
      backgroundColor: '#fff7ed',
    },
  ],
});

export default getCreditAdvanced;
