import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SearchIcon, CalendarIcon } from 'lucide-react';
import { ScheduleCard } from '../components/ScheduleCard';
import { mockSchedules, ScheduleItem } from '../utils/mockData';
import { useLanguage } from '../contexts/LanguageContext';
import { translate } from '../utils/translations';
export function Schedule() {
  const { language } = useLanguage();
  const [searchType, setSearchType] = useState<'number' | 'route'>('number');
  const [routeNumber, setRouteNumber] = useState('');
  const [startDest, setStartDest] = useState('');
  const [endDest, setEndDest] = useState('');
  const [filteredSchedules, setFilteredSchedules] =
  useState<ScheduleItem[]>(mockSchedules);
  const handleSearch = () => {
    if (searchType === 'number' && routeNumber) {
      const filtered = mockSchedules.filter((s) => s.route === routeNumber);
      setFilteredSchedules(filtered.length > 0 ? filtered : mockSchedules);
    } else if (searchType === 'route' && startDest && endDest) {
      const filtered = mockSchedules.filter(
        (s) =>
        s.startDestination.toLowerCase().includes(startDest.toLowerCase()) &&
        s.endDestination.toLowerCase().includes(endDest.toLowerCase())
      );
      setFilteredSchedules(filtered.length > 0 ? filtered : mockSchedules);
    }
  };
  // Group schedules by route
  const groupedSchedules = filteredSchedules.reduce(
    (acc, schedule) => {
      if (!acc[schedule.route]) {
        acc[schedule.route] = [];
      }
      acc[schedule.route].push(schedule);
      return acc;
    },
    {} as Record<string, ScheduleItem[]>
  );
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
          <CalendarIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {translate('busSchedule', language)}
        </h1>
      </motion.div>

      {/* Search Panel */}
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

            {translate('routeNumber', language)}
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
        <div className="flex flex-col sm:flex-row gap-4">
          {searchType === 'number' ?
          <input
            type="text"
            value={routeNumber}
            onChange={(e) => setRouteNumber(e.target.value)}
            placeholder="138"
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" /> :


          <>
              <input
              type="text"
              value={startDest}
              onChange={(e) => setStartDest(e.target.value)}
              placeholder={translate('startDestination', language)}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" />

              <input
              type="text"
              value={endDest}
              onChange={(e) => setEndDest(e.target.value)}
              placeholder={translate('endDestination', language)}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" />

            </>
          }
          <motion.button
            whileHover={{
              scale: 1.05
            }}
            whileTap={{
              scale: 0.95
            }}
            onClick={handleSearch}
            className="px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 whitespace-nowrap">

            <SearchIcon className="w-5 h-5" />
            {translate('searchButton', language)}
          </motion.button>
        </div>
      </motion.div>

      {/* Schedules by Route */}
      <div className="space-y-8">
        {Object.entries(groupedSchedules).map(
          ([route, schedules], groupIndex) =>
          <motion.div
            key={route}
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: groupIndex * 0.1
            }}>

              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {translate('route', language)} {route}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {schedules.map((schedule, index) =>
              <ScheduleCard
                key={schedule.id}
                schedule={schedule}
                index={index} />

              )}
              </div>
            </motion.div>

        )}
      </div>
    </div>);

}