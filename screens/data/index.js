// screens/data/index.js
import getCompoundingBasics from './compounding_basics';
import getCompoundingIntermediate from './compounding_intermediate';
import getCompoundingAdvanced from './compounding_advanced';

import getTaxRetireTaxBasics from './tax_retire_1_tax_basics'; 
import getTaxRetireRetirementAccounts from './tax_retire_2_retirement_accounts';
import getTaxRetireTfsaVsTaxable from './tax_retire_3_tfsa_vs_taxable';
import getTaxRetireDrawdown101 from './tax_retire_4_drawdown_101';
import getBudgetingBasics from './budgeting_basics';
import getBudgetingIntermediate from './budgeting_intermediate';
import getBudgetingAdvanced from './budgeting_advanced';
import getCreditBasics from './credit_basics';
import getCreditIntermediate from './credit_intermediate';
import getCreditAdvanced from './credit_advanced';
import getInvestingBasics from './investing_basics';
import getInvestingIntermediate from './investing_intermediate';
import getInvestingAdvanced from './investing_advanced';



// Return fresh lesson objects each call
export const getLessons = () => ([
  // Compounding booklet lessons
  getCompoundingBasics(),
  getCompoundingIntermediate(),
  getCompoundingAdvanced(),

  // Taxes & Retirement booklet lessons
  getTaxRetireTaxBasics(),
  getTaxRetireRetirementAccounts(),
  getTaxRetireTfsaVsTaxable(),
  getTaxRetireDrawdown101(),

  // budgeting lessons
  getBudgetingBasics(),
  getBudgetingIntermediate(),
  getBudgetingAdvanced(),

  // credit lessons
  getCreditBasics(),
  getCreditIntermediate(),
  getCreditAdvanced(),

  //investing lessons
  getInvestingBasics(),
  getInvestingIntermediate(),
  getInvestingAdvanced(),
]);

export const getLessonById = (id) =>
  getLessons().find((l) => l.id === id);

// Booklets / Tracks (order controls locking)
export const getTracks = () => ([
  {
    id: 'track-compounding',
    title: 'Compounding Basics',
    description: 'From basics to advanced: master compounding step by step.',
    lessonIds: [
      'compounding-basics',
      'compounding-intermediate',
      'compounding-advanced',
    ],
  },
  {
    id: 'track-tax-retire',
    title: 'Taxes & Retirement Basics',
    description: 'Understand brackets, pre-tax vs after-tax saving, and plan for retirement.',
    lessonIds: [
      'tax-retire-1-tax-basics',
      'tax-retire-2-retirement-accounts', 
      'tax-retire-3-tfsa-vs-taxable',    
      'tax-retire-4-drawdown-101',        
    ],
  },
  {
    id: 'track-budgeting',
    title: 'Budgeting & Cash Flow',
    description: 'Plan spending, build a buffer, and reduce stress around money.',
    lessonIds: [
      'budgeting-basics',
      'budgeting-intermediate',
      'budgeting-advanced'
    ],
  },
  {
    id: 'track-credit',
    title: 'Credit & Borrowing',
    description: 'Use credit wisely, compare costs, and avoid debt traps.',
    lessonIds: [
      'credit-basics', 
      'credit-intermediate',
      'credit-advanced'
    ],
  },
  {
    id: 'track-investing',
    title: 'Investing & Wealth Building',
    description: 'Diversify, keep costs low, and stay invested for the long run.',
    lessonIds: [
      'investing-basics',
      'investing-intermediate',
      'investing-advanced',
    ],
  },
]);
