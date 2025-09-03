// screens/data/index.js
import { t } from 'i18next';                 // ⬅️ add this
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
  getCompoundingBasics(),
  getCompoundingIntermediate(),
  getCompoundingAdvanced(),

  getTaxRetireTaxBasics(),
  getTaxRetireRetirementAccounts(),
  getTaxRetireTfsaVsTaxable(),
  getTaxRetireDrawdown101(),

  getBudgetingBasics(),
  getBudgetingIntermediate(),
  getBudgetingAdvanced(),

  getCreditBasics(),
  getCreditIntermediate(),
  getCreditAdvanced(),

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
    title: t('tracks.track-compounding.title'),
    description: t('tracks.track-compounding.description'),
    lessonIds: [
      'compounding-basics',
      'compounding-intermediate',
      'compounding-advanced',
    ],
  },
  {
    id: 'track-tax-retire',
    title: t('tracks.track-tax-retire.title'),
    description: t('tracks.track-tax-retire.description'),
    lessonIds: [
      'tax-retire-1-tax-basics',
      'tax-retire-2-retirement-accounts',
      'tax-retire-3-tfsa-vs-taxable',
      'tax-retire-4-drawdown-101',
    ],
  },
  {
    id: 'track-budgeting',
    title: t('tracks.track-budgeting.title'),
    description: t('tracks.track-budgeting.description'),
    lessonIds: [
      'budgeting-basics',
      'budgeting-intermediate',
      'budgeting-advanced'
    ],
  },
  {
    id: 'track-credit',
    title: t('tracks.track-credit.title'),
    description: t('tracks.track-credit.description'),
    lessonIds: [
      'credit-basics',
      'credit-intermediate',
      'credit-advanced'
    ],
  },
  {
    id: 'track-investing',
    title: t('tracks.track-investing.title'),
    description: t('tracks.track-investing.description'),
    lessonIds: [
      'investing-basics',
      'investing-intermediate',
      'investing-advanced',
    ],
  },
]);
