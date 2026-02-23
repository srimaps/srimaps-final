import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SearchIcon, MapPinIcon, BusIcon } from 'lucide-react';
import { BusMap } from '../components/BusMap';
import { QuickBusButtons } from '../components/QuickBusButtons';
import { mockBuses, Bus } from '../utils/mockData';
import { useLanguage } from '../contexts/LanguageContext';
import { translate } from '../utils/translations';
export function LiveTracking() {
  const { language } = useLanguage();
  const [searchType, setSearchType] = useState<'number' | 'route'>('number');
  const [busNumber, setBusNumber] = useState('');
  const [startDest, setStartDest] = useState('');
  const [endDest, setEndDest] = useState('');
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [displayedBuses, setDisplayedBuses] = useState<Bus[]>(mockBuses);
  const handleSearch = () => {
    if (searchType === 'number' && busNumber) {
      const found = mockBuses.find((b) => b.number === busNumber);
      if (found) {
        setSelectedBus(found);
        setDisplayedBuses([found]);
      }
    } else if (searchType === 'route' && startDest && endDest) {
      const found = mockBuses.filter(
        (b) =>
        b.startDestination.toLowerCase().includes(startDest.toLowerCase()) &&
        b.endDestination.toLowerCase().includes(endDest.toLowerCase())
      );
      setDisplayedBuses(found.length > 0 ? found : mockBuses);
      setSelectedBus(found[0] || null);
    }
  };
  const handleQuickBusSelect = (number: string) => {
    setBusNumber(number);
    const found = mockBuses.find((b) => b.number === number);
    if (found) {
      setSelectedBus(found);
      setDisplayedBuses([found]);
      setSearchType('number');
    }
  };
  return (
    <div className="h-full flex flex-col lg:flex-row gap-6">
      {/* Search Panel */}
      <motion.div
        initial={{
          opacity: 0,
          x: -20
        }}
        animate={{
          opacity: 1,
          x: 0
        }}
        className="lg:w-96 flex-shrink-0 space-y-6">

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            {translate('liveTracking', language)}
          </h2>

          {/* Quick Bus Buttons */}
          <QuickBusButtons
            onSelectBus={handleQuickBusSelect}
            selectedBus={selectedBus?.number} />


          {/* Search Type Toggle */}
          <div className="flex gap-2 mb-6">
            <motion.button
              whileHover={{
                scale: 1.02
              }}
              whileTap={{
                scale: 0.98
              }}
              onClick={() => setSearchType('number')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${searchType === 'number' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>

              {translate('busNumber', language)}
            </motion.button>
            <motion.button
              whileHover={{
                scale: 1.02
              }}
              whileTap={{
                scale: 0.98
              }}
              onClick={() => setSearchType('route')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${searchType === 'route' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>

              {translate('route', language)}
            </motion.button>
          </div>

          {/* Search Inputs */}
          {searchType === 'number' ?
          <motion.div
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            className="space-y-4">

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {translate('busNumber', language)}
                </label>
                <input
                type="text"
                value={busNumber}
                onChange={(e) => setBusNumber(e.target.value)}
                placeholder="138"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" />

              </div>
            </motion.div> :

          <motion.div
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            className="space-y-4">

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {translate('startDestination', language)}
                </label>
                <input
                type="text"
                value={startDest}
                onChange={(e) => setStartDest(e.target.value)}
                placeholder="Colombo Fort"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" />

              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {translate('endDestination', language)}
                </label>
                <input
                type="text"
                value={endDest}
                onChange={(e) => setEndDest(e.target.value)}
                placeholder="Malabe"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" />

              </div>
            </motion.div>
          }

          <motion.button
            whileHover={{
              scale: 1.02
            }}
            whileTap={{
              scale: 0.98
            }}
            onClick={handleSearch}
            className="w-full mt-6 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2">

            <SearchIcon className="w-5 h-5" />
            {translate('searchButton', language)}
          </motion.button>
        </div>

        {/* Selected Bus Info */}
        {selectedBus &&
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

            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-lg">
                <BusIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Bus {selectedBus.number}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedBus.route}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPinIcon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {translate('currentLocation', language)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedBus.currentLocation.lat.toFixed(4)},{' '}
                    {selectedBus.currentLocation.lng.toFixed(4)}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t dark:border-gray-700">
                <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${selectedBus.status === 'on-time' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'}`}>

                  {selectedBus.status === 'on-time' ?
                translate('onTime', language) :
                translate('delayed', language)}
                </span>
              </div>
            </div>
          </motion.div>
        }
      </motion.div>

      {/* Map */}
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.95
        }}
        animate={{
          opacity: 1,
          scale: 1
        }}
        className="flex-1 min-h-[500px] lg:min-h-0">

        <BusMap buses={displayedBuses} selectedBus={selectedBus} />
      </motion.div>
    </div>);

}