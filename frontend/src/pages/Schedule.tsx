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
    }else if (searchType === 'route' && startDest && endDest) {
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






