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

      {/* Location Sharing Control */}
      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <RadioIcon
              className={`w-6 h-6 ${isDriverSharingLocation ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`} />

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {translate('locationSharing', language)}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isDriverSharingLocation ?
                translate('sharingActive', language) :
                translate('sharingInactive', language)}
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
            onClick={() => setIsDriverSharingLocation(!isDriverSharingLocation)}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${isDriverSharingLocation ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}>

            {isDriverSharingLocation ?
            translate('stopSharing', language) :
            translate('startSharing', language)}
          </motion.button>
        </div>

        {isDriverSharingLocation && driverBus &&
        <motion.div
          initial={{
            opacity: 0,
            height: 0
          }}
          animate={{
            opacity: 1,
            height: 'auto'
          }}
          className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">

            <div className="flex items-start gap-2">
              <MapPinIcon className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-900 dark:text-green-300">
                  {translate('currentLocation', language)}
                </p>
                <p className="text-sm text-green-700 dark:text-green-400">
                  {driverBus.currentLocation.lat.toFixed(4)},{' '}
                  {driverBus.currentLocation.lng.toFixed(4)}
                </p>
                <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                  {translate('route', language)}: {driverBus.route}
                </p>
              </div>
            </div>
          </motion.div>
        }
      </motion.div>

      {/* Map */}
      {driverBus &&
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.95
        }}
        animate={{
          opacity: 1,
          scale: 1
        }}
        className="h-[500px]">

          <BusMap buses={[driverBus]} selectedBus={driverBus} />
        </motion.div>
      }
    </div>);

}