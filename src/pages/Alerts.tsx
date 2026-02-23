import React from 'react';
import { motion } from 'framer-motion';
import { BellIcon } from 'lucide-react';
import { AlertCard } from '../components/AlertCard';
import { mockAlerts } from '../utils/mockData';
import { useLanguage } from '../contexts/LanguageContext';
import { translate } from '../utils/translations';
export function Alerts() {
  const { language } = useLanguage();
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{
          opacity: 0,
          y: -20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="flex items-center gap-3">

        <div className="bg-primary-600 p-3 rounded-xl">
          <BellIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {translate('realTimeAlerts', language)}
        </h1>
      </motion.div>

      {/* Alerts List */}
      <div className="space-y-4">
        {mockAlerts.map((alert, index) =>
        <AlertCard key={alert.id} alert={alert} index={index} />
        )}
      </div>

      {/* Empty State */}
      {mockAlerts.length === 0 &&
      <motion.div
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        className="text-center py-16">

          <BellIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {translate('noResults', language)}
          </p>
        </motion.div>
      }
    </div>);

}