import React from 'react';
import { motion } from 'framer-motion';
import { BellIcon } from 'lucide-react';
import { AlertCard } from '../components/AlertCard';
import { mockAlerts } from '../utils/mockData';
import { useLanguage } from '../contexts/LanguageContext';
import { translate } from '../utils/translations';
export function Alerts()
