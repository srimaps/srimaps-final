import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SearchIcon, CalendarIcon } from 'lucide-react';
import { ScheduleCard } from '../components/ScheduleCard';
import { mockSchedules, ScheduleItem } from '../utils/mockData';
import { useLanguage } from '../contexts/LanguageContext';
import { translate } from '../utils/translations';
export function Schedule() {
