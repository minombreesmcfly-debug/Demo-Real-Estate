import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language } from './translations';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: keyof typeof translations['es']) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem('demo_language');
      return (stored as Language) === 'en' ? 'en' : 'es';
    } catch {
      return 'es';
    }
  });

  const toggleLanguage = () => {
    const next = language === 'es' ? 'en' : 'es';
    setLanguage(next);
    try {
      localStorage.setItem('demo_language', next);
    } catch (e) {
      console.error(e);
    }
  };

  const t = (key: keyof typeof translations['es']): string => {
    // Falls back to key if not defined in the lang object
    return (translations[language] && translations[language][key]) || translations['es'][key] || String(key);
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
