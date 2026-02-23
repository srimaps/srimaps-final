import React from 'react';
import { motion } from 'framer-motion';
import {
  PackageIcon,
  CalendarIcon,
  ClockIcon,
  BusIcon,
  PhoneIcon } from
'lucide-react';
import { LostFoundItem } from '../utils/mockData';
import { useLanguage } from '../contexts/LanguageContext';
import { translate } from '../utils/translations';
interface LostFoundCardProps {
  item: LostFoundItem;
  type: 'lost' | 'found';
  index: number;
  onAction: (item: LostFoundItem) => void;
}
export function LostFoundCard({
  item,
  type,
  index,
  onAction
}: LostFoundCardProps) {
  const { language } = useLanguage();
  const isLost = type === 'lost';
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      transition={{
        delay: index * 0.05
      }}
      whileHover={{
        y: -4,
        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
      }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-xl transition-all">

      <div className="flex items-start gap-4">
        <div
          className={`p-3 rounded-lg flex-shrink-0 ${isLost ? 'bg-red-100 dark:bg-red-900/30' : 'bg-green-100 dark:bg-green-900/30'}`}>

          <PackageIcon
            className={`w-6 h-6 ${isLost ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`} />

        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {item.itemName}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
            {item.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <div className="flex items-center gap-1">
              <BusIcon className="w-4 h-4" />
              <span>Route {item.route}</span>
            </div>
            <div className="flex items-center gap-1">
              <CalendarIcon className="w-4 h-4" />
              <span>{item.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <ClockIcon className="w-4 h-4" />
              <span>{item.time}</span>
            </div>
          </div>

          <motion.button
            whileHover={{
              scale: 1.05
            }}
            whileTap={{
              scale: 0.95
            }}
            onClick={() => onAction(item)}
            className={`w-full sm:w-auto px-6 py-2 rounded-lg font-medium text-white transition-colors ${isLost ? 'bg-green-600 hover:bg-green-700' : 'bg-primary-600 hover:bg-primary-700'}`}>

            {isLost ?
            translate('iFoundThis', language) :
            translate('claimItem', language)}
          </motion.button>
        </div>
      </div>
    </motion.div>);

}