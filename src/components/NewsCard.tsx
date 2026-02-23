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
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-xl transition-all">

      <div className="flex items-start gap-4">
        <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-lg flex-shrink-0">
          <NewspaperIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {news.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
            {news.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <BusIcon className="w-4 h-4" />
              <span>Route {news.route}</span>
            </div>
            <div className="flex items-center gap-1">
              <CalendarIcon className="w-4 h-4" />
              <span>{news.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <ClockIcon className="w-4 h-4" />
              <span>{news.time}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>);

}