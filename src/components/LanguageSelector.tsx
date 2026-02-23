import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlobeIcon, ChevronDownIcon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Language } from '../utils/translations';
export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const languages: {
    code: Language;
    label: string;
    flag: string;
  }[] = [
  {
    code: 'en',
    label: 'English',
    flag: '🇬🇧'
  },
  {
    code: 'si',
    label: 'සිංහල',
    flag: '🇱🇰'
  },
  {
    code: 'ta',
    label: 'தமிழ்',
    flag: '🇱🇰'
  }];

  const currentLanguage = languages.find((l) => l.code === language);
  return (
    <div className="relative">
      <motion.button
        whileHover={{
          scale: 1.05
        }}
        whileTap={{
          scale: 0.95
        }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-all"
        aria-label="Select language">

        <GlobeIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        <span className="text-sm font-medium dark:text-gray-200">
          {currentLanguage?.flag}
        </span>
        <span className="text-sm font-medium hidden sm:inline dark:text-gray-200">
          {currentLanguage?.label}
        </span>
        <ChevronDownIcon
          className={`w-4 h-4 dark:text-gray-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />

      </motion.button>

      {isOpen &&
      <>
          <div
          className="fixed inset-0 z-10"
          onClick={() => setIsOpen(false)} />

          <motion.div
          initial={{
            opacity: 0,
            y: -10
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          exit={{
            opacity: 0,
            y: -10
          }}
          className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-xl z-20 overflow-hidden">

            {languages.map((lang) =>
          <motion.button
            key={lang.code}
            whileHover={{
              backgroundColor: theme === 'dark' ? '#374151' : '#f1f5f9'
            }}
            onClick={() => {
              setLanguage(lang.code);
              setIsOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${language === lang.code ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'}`}>

                <span className="text-xl">{lang.flag}</span>
                <span className="font-medium">{lang.label}</span>
              </motion.button>
          )}
          </motion.div>
        </>
      }
    </div>);

}