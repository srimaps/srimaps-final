import React, { useState, createContext, useContext, ReactNode } from 'react';
import { Language } from '../utils/translations';
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}
const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);
interface LanguageProviderProps {
  children: ReactNode;
}
export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('srimaps-language');
    return saved as Language || 'en';
  });
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('srimaps-language', lang);
  };
  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage
      }}>

      {children}
    </LanguageContext.Provider>);

}
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}