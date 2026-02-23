import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { translate } from '../utils/translations';
interface QuickBusButtonsProps {
  onSelectBus: (busNumber: string) => void;
  selectedBus?: string;
}
const busNumbers = ['261', '138', '100', '101', '200'];
export function QuickBusButtons({
  onSelectBus,
  selectedBus
}: QuickBusButtonsProps) {
  const { language } = useLanguage();
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        {translate('quickAccess', language)}
      </label>
      <div className="flex flex-wrap gap-2">
        {busNumbers.map((number, index) => {
          const isActive = number === '138';
          const isSelected = selectedBus === number;
          return (
            <motion.button
              key={number}
              initial={{
                opacity: 0,
                scale: 0.9
              }}
              animate={{
                opacity: 1,
                scale: 1
              }}
              transition={{
                delay: index * 0.05
              }}
              whileHover={
              isActive ?
              {
                scale: 1.05
              } :
              {}
              }
              whileTap={
              isActive ?
              {
                scale: 0.95
              } :
              {}
              }
              onClick={() => isActive && onSelectBus(number)}
              disabled={!isActive}
              className={`px-4 py-2 rounded-full font-semibold transition-all ${isSelected && isActive ? 'bg-primary-600 text-white shadow-md' : isActive ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-900/50' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50'}`}>

              {number}
            </motion.button>);

        })}
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        {translate('quickAccessNote', language)}
      </p>
    </div>);

}