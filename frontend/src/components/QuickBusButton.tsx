import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { translate } from '../utils/translations';

interface QuickBusButtonsProps {
  onSelectBus: (busNumber: string) => void;
  selectedBus?: string;
}
const busNumbers = ['261', '138', '100', '101', '200'];
const ACTIVE_BUSES = new Set(['261', '100', '101']);

export function QuickBusButtons({
  onSelectBus,
  selectedBus
}: QuickBusButtonsProps) {
  const { language } = useLanguage();
  return (
    <div>
    </div>
  );

}



