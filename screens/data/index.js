// screens/data/index.js
import getCompoundingData from './compounding';
import getEmergencyFundData from './emergency-fund';
import getFirstPortfolioData from './first-portfolio';
import getRiskReturnData from './risk-return';
import getTaxEfficientData from './tax-efficient';


export const getLessons = () => [
  getCompoundingData(),
  getEmergencyFundData(),
  getFirstPortfolioData(),
  getRiskReturnData(),
  getTaxEfficientData(),
];
