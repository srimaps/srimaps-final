import React from 'react';
import { motion } from 'framer-motion';
import {
    PackageIcon,
    CalendarIcon,
    ClockIcon,
    BusIcon,
    PhoneIcon
} from
    'lucide-react';
import { LostFoundItem } from '../utils/mockData';
import { useLanguage } from '../contexts/LanguageContext';
import { translate } from '../utils/translations';

interface LostFoundCardProps {
    item: LostFoundItem;
    type: 'lost' | 'found';
    index: number;
    onAction: (item: LostFoundItem) => void;
}
export function LostFoundCard({
    item,
    type,
    index,
    onAction
}: LostFoundCardProps) {
    const { language } = useLanguage();
    const isLost = type === 'lost';
    return ( <motion.div
            initial={{
                opacity: 0,
                y: 20
            }}
            animate={{
                opacity: 1,
                y: 0
            }}
            transition={{
                delay: index * 0.05
            }}
            whileHover={{
                y: -4,
                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
            }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-xl transition-all"></motion.div>
           );
}
