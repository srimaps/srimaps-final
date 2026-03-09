import React from 'react';
import { motion } from 'framer-motion';
import { TruckIcon, MapPinIcon, LogOutIcon, RadioIcon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { translate } from '../utils/translations';
import { useUser } from '../contexts/UserContext';
import { BusMap } from '../components/BusMap';
import { mockBuses } from '../utils/mockData';
export function DriverDashboard() {
  const { language } = useLanguage();
  const {
    driver,
    logoutDriver,
    isDriverSharingLocation,
    setIsDriverSharingLocation
  } = useUser();
  const driverBus = mockBuses.find((b) => b.number === driver?.busNumber);
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
        className="flex items-center justify-between">

        <div className="flex items-center gap-4">
          <div className="bg-teal-100 dark:bg-teal-900/30 p-3 rounded-xl">
            <TruckIcon className="w-8 h-8 text-teal-600 dark:text-teal-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {translate('driverDashboard', language)}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {driver?.name} - {translate('busNumber', language)}{' '}
              {driver?.busNumber}
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{
            scale: 1.05
          }}
          whileTap={{
            scale: 0.95
          }}
          onClick={logoutDriver}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">

          <LogOutIcon className="w-5 h-5" />
          {translate('logout', language)}
        </motion.button>
      </motion.div>
    </div>
  );

}

