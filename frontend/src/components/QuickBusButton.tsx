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
          return ();
  );

}

