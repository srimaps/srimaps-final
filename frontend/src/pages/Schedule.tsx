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
    }



