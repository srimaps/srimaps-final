import React from 'react';
import { motion } from 'framer-motion';
import { UsersIcon, TruckIcon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { translate } from '../utils/translations';
interface RoleSelectionProps {
  onSelectRole: (role: 'passenger' | 'driver') => void;
}
export function RoleSelection({ onSelectRole }: RoleSelectionProps) {
  const { language } = useLanguage();
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="max-w-4xl w-full px-4">
        <motion.div
          initial={{
            opacity: 0,
            y: -20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className="text-center mb-12">
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {translate('welcomeToSriMaps', language)}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {translate('selectYourRole', language)}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">





