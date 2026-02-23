import React from 'react';
import { motion } from 'framer-motion';
import { ClockIcon, MapPinIcon, ArrowRightIcon } from 'lucide-react';
import { ScheduleItem } from '../utils/mockData';
interface ScheduleCardProps {
  schedule: ScheduleItem;
  index: number;
}
export function ScheduleCard({ schedule, index }: ScheduleCardProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.95
      }}
      animate={{
        opacity: 1,
        scale: 1
      }}
      transition={{
        delay: index * 0.05
      }}
      whileHover={{
        scale: 1.02,
        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
      }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-all">

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-primary-600 text-white px-3 py-1 rounded-lg font-bold text-sm">
            {schedule.route}
          </div>
        </div>

        <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold">
          <ClockIcon className="w-5 h-5" />
          <span className="text-lg">{schedule.departureTime}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
        <div className="flex items-center gap-2 flex-1">
          <MapPinIcon className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
          <span className="text-sm font-medium truncate">
            {schedule.startDestination}
          </span>
        </div>

        <ArrowRightIcon className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />

        <div className="flex items-center gap-2 flex-1">
          <MapPinIcon className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
          <span className="text-sm font-medium truncate">
            {schedule.endDestination}
          </span>
        </div>
      </div>
    </motion.div>);

}