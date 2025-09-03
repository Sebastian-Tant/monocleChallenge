// screens/data/compounding_intermediate.js

// Named + default export so either import style works.
export const getCompoundingIntermediate = () => ({
  id: 'compounding-intermediate',
  title: 'Compounding Intermediate: Rate, Frequency & Contributions',
  description:
    'Go beyond the basics: effective annual rate (EAR), why frequency matters, how recurring contributions change growth, and how compounding works against you in debt.',
  duration: '8–10 min',
  difficulty: 'Intermediate',
  completed: false,
  progress: 0,
  pages: [
    // --- Teachings ---
    {
      id: 'intro',
      type: 'story',
      title: 'From Basics to Better Decisions',
      content:
        'You know compound interest grows “interest on interest”. Now we’ll use that to make practical choices: compare rates properly, understand compounding frequency, and weigh monthly deposits vs once-off amounts.',
      graphic: '🎯',
      backgroundColor: '#f8fafc',
    },
    {
      id: 'ear',
      type: 'story',
      title: 'Nominal vs Effective Annual Rate (EAR)',
      content:
        'Banks often quote a nominal rate (e.g., 12% p.a.). If interest is added during the year (monthly/weekly), the actual yearly growth is higher. That “true” yearly growth is the Effective Annual Rate (EAR). Example: 12% nominal compounded monthly ≈ 12.68% EAR.',
      graphic: '📊',
      backgroundColor: '#f0f9ff',
    },
    {
      id: 'frequency',
      type: 'story',
      title: 'Why Frequency Matters',
      content:
        'More frequent compounding means interest is added sooner and itself earns interest. For the same nominal rate, monthly compounding grows a bit faster than annual compounding; weekly is a touch faster than monthly, and so on.',
      graphic: '⏱️',
      backgroundColor: '#fefce8',
    },
    {
      id: 'contributions',
      type: 'story',
      title: 'Recurring Contributions vs Once-Off',
      content:
        'Regular monthly deposits (e.g., a debit order) build a habit and steadily add fuel to compounding. A large once-off deposit enjoys the full time in the market. Which is “better” depends on timing, amounts, and discipline.',
      graphic: '💸',
      backgroundColor: '#f0fdf4',
    },
    {
      id: 'debt',
      type: 'story',
      title: 'When Compounding Works Against You',
      content:
        'Compounding helps savings grow — but it also makes debt more expensive over time. Paying only the minimum on a high-interest card stretches the term and increases total interest paid significantly.',
      graphic: '⚠️',
      backgroundColor: '#fff7ed',
    },

    // --- Questions (with rationales) ---
    {
      id: 'quiz-1',
      type: 'quiz',
      title: 'Quick Check 1',
      question: 'What does the Effective Annual Rate (EAR) represent?',
      options: [
        { id: 'A', text: 'The bank’s advertised (nominal) percentage.', correct: false, rationale: 'Nominal excludes the effect of intra-year compounding. EAR includes it.' },
        { id: 'B', text: 'The actual yearly growth including intra-year compounding.', correct: true,  rationale: 'Yes. EAR captures the true yearly growth once compounding frequency is considered.' },
        { id: 'C', text: 'The lowest possible rate after fees.', correct: false, rationale: 'EAR isn’t “lowest after fees”. It’s about compounding, not fees.' },
        { id: 'D', text: 'A rate that ignores compounding frequency.', correct: false, rationale: 'EAR is specifically about accounting for compounding frequency.' },
      ],
      backgroundColor: '#fdf2f8',
    },
    {
      id: 'quiz-2',
      type: 'quiz',
      title: 'Quick Check 2',
      question: 'Which typically yields the higher end balance (same nominal 12%)?',
      options: [
        { id: 'A', text: '12% compounded annually', correct: false, rationale: 'Annual is slower because interest is added only once per year.' },
        { id: 'B', text: '12% compounded monthly',  correct: true,  rationale: 'Monthly adds interest more often, so it slightly outperforms annual at the same nominal rate.' },
        { id: 'C', text: 'They are always identical', correct: false, rationale: 'Frequency changes the growth even if the nominal rate is the same.' },
        { id: 'D', text: 'Depends only on the principal, not frequency', correct: false, rationale: 'Frequency matters: more frequent compounding tends to grow more.' },
      ],
      backgroundColor: '#eef2ff',
    },
    {
      id: 'quiz-3',
      type: 'quiz',
      title: 'Quick Check 3',
      question:
        'You have two choices over 5 years at 8% per year: (1) deposit R500 every month, or (2) deposit R30,000 once today. Which typically ends with more?',
      options: [
        { id: 'A', text: 'R500 monthly (total is the same, so results are the same).', correct: false, rationale: 'Totals aren’t enough — timing matters. Monthly deposits start small and build; a lump sum compounds the full time.' },
        { id: 'B', text: 'R30,000 once today (it compounds for the full 5 years).',  correct: true,  rationale: 'A lump sum placed earlier enjoys compounding for longer, usually beating equal monthly totals.' },
        { id: 'C', text: 'Both end equal because totals match.',                    correct: false, rationale: 'Even with equal totals, earlier money compounds longer and usually wins.' },
        { id: 'D', text: 'Impossible to compare without fees.',                     correct: false, rationale: 'Fees can matter, but ignoring fees the earlier lump sum typically wins.' },
      ],
      backgroundColor: '#f1f5f9',
    },
    {
      id: 'quiz-4',
      type: 'quiz',
      title: 'Quick Check 4',
      question: 'Which statement about minimum payments on high-interest debt is most accurate?',
      options: [
        { id: 'A', text: 'They reduce total interest dramatically.', correct: false, rationale: 'Minimums often barely cover interest; total interest can stay high or climb.' },
        { id: 'B', text: 'They can extend the term and increase total interest paid.', correct: true, rationale: 'Correct. Minimum-only strategies lengthen payoff time and increase interest cost.' },
        { id: 'C', text: 'They have no effect on total interest.', correct: false, rationale: 'They do — paying only minimums usually increases total interest over the life of the debt.' },
        { id: 'D', text: 'They are always better than extra repayments.', correct: false, rationale: 'Extra repayments reduce principal faster and cut interest sooner.' },
      ],
      backgroundColor: '#fff1f2',
    },
    {
      id: 'quiz-5',
      type: 'quiz',
      title: 'Quick Check 5',
      question: 'Using the “Rule of 72”, roughly how long to double money at 9% per year?',
      options: [
        { id: 'A', text: 'About 5 years',  correct: false, rationale: '72 ÷ 9 ≈ 8 years, not ~5.' },
        { id: 'B', text: 'About 8 years',  correct: true,  rationale: 'Correct. 72 ÷ 9 ≈ 8 — a handy mental shortcut.' },
        { id: 'C', text: 'About 10 years', correct: false, rationale: 'Too long for 9% using the Rule of 72.' },
        { id: 'D', text: 'About 12 years', correct: false, rationale: 'Far too long for 9% using the Rule of 72.' },
      ],
      backgroundColor: '#eef2ff',
    },
  ],
});

export default getCompoundingIntermediate;
 