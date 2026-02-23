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
          {/* Passenger Card */}
          <motion.button
            initial={{
              opacity: 0,
              x: -20
            }}
            animate={{
              opacity: 1,
              x: 0
            }}
            transition={{
              delay: 0.1
            }}
            whileHover={{
              scale: 1.02,
              y: -4
            }}
            whileTap={{
              scale: 0.98
            }}
            onClick={() => onSelectRole('passenger')}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-all group">

            <div className="bg-primary-100 dark:bg-primary-900/30 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <UsersIcon className="w-12 h-12 text-primary-600 dark:text-primary-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              {translate('passenger', language)}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {translate('passengerDescription', language)}
            </p>
          </motion.button>

          {/* Driver Card */}
          <motion.button
            initial={{
              opacity: 0,
              x: 20
            }}
            animate={{
              opacity: 1,
              x: 0
            }}
            transition={{
              delay: 0.2
            }}
            whileHover={{
              scale: 1.02,
              y: -4
            }}
            whileTap={{
              scale: 0.98
            }}
            onClick={() => onSelectRole('driver')}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-all group">

            <div className="bg-teal-100 dark:bg-teal-900/30 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <TruckIcon className="w-12 h-12 text-teal-600 dark:text-teal-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              {translate('driver', language)}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {translate('driverDescription', language)}
            </p>
          </motion.button>
        </div>
      </div>
    </div>);

}