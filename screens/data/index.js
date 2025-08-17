import compounding from './compounding';
import riskReturn from './risk-return';
import emergency from './emergency-fund';
import portfolio from './first-portfolio';
import tax from './tax-efficient';

export const lessons = [compounding, riskReturn, emergency,portfolio,tax];

export const getLessonById = (id) =>{
    if (id==null) return undefined;
    const s = String(id);
    return lessons.find((l) => String(l.id) === s);
}
