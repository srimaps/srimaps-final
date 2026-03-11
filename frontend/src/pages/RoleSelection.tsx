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

