// screens/data/index.js
import getCompoundingData from './compounding';
import getEmergencyFundData from './emergency-fund';
import getFirstPortfolioData from './first-portfolio';
import getRiskReturnData from './risk-return';
import getTaxEfficientData from './tax-efficient';

// This function gets all lessons, ensuring they are translated.
export const getLessons = () => [
  getCompoundingData(),
  getEmergencyFundData(),
  getFirstPortfolioData(),
  getRiskReturnData(),
  getTaxEfficientData(),
];

// NEW: This function finds a single lesson by its ID.
// This is what LessonDetailScreen needs to work correctly.
export const getLessonById = (id) => {
  const allLessons = getLessons();
  return allLessons.find((lesson) => lesson.id === id);
};
