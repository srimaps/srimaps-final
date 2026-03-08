import React from 'react';
import { motion } from 'framer-motion';
import { NewspaperIcon, CalendarIcon, ClockIcon, BusIcon } from 'lucide-react';
import { NewsItem } from '../utils/mockData';
interface NewsCardProps {
  news: NewsItem;
  index: number;
}
export function NewsCard({ news, index }: NewsCardProps) {
  return (
     <motion.div
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

