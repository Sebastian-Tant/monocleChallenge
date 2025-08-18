// src/locales/i18n.js

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './en.json';
import af from './af.json';
import zu from './zu.json';
import xh from './xh.json';
import nr from './nr.json';
import nso from './nso.json';
import st from './st.json';
import tn from './tn.json';
import ss from './ss.json';
import ve from './ve.json';
import ts from './ts.json';

// 2. Combine all translations into a single resources object
const resources = {
  en: { translation: en },
  af: { translation: af },
  zu: { translation: zu },
  xh: { translation: xh },
  nr: { translation: nr },
  nso: { translation: nso },
  st: { translation: st },
  tn: { translation: tn },
  ss: { translation: ss },
  ve: { translation: ve },
  ts: { translation: ts },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    compatibilityJSON: 'v3', // Important for React Native
    resources,
    lng: 'en', // The default language
    fallbackLng: 'en', // Fallback language if a translation is missing
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
  });

export default i18n;