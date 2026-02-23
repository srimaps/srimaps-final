import React from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangleIcon,
  BellIcon,
  CalendarIcon,
  ClockIcon,
  BusIcon } from
'lucide-react';
import { Alert } from '../utils/mockData';
interface AlertCardProps {
  alert: Alert;
  index: number;
}
export function AlertCard({ alert, index }: AlertCardProps) {
  const isDanger = alert.severity === 'danger';
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: -20
      }}
      animate={{
        opacity: 1,
        x: 0
      }}
      transition={{
        delay: index * 0.05,
        type: 'spring',
        stiffness: 100
      }}
      whileHover={{
        x: 4
      }}
      className={`rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow ${isDanger ? 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500' : 'bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500'}`}>

      <div className="flex items-start gap-4">
        <div
          className={`p-3 rounded-lg flex-shrink-0 ${isDanger ? 'bg-red-100 dark:bg-red-900/40' : 'bg-amber-100 dark:bg-amber-900/40'}`}>

          {isDanger ?
          <AlertTriangleIcon className="w-6 h-6 text-red-600 dark:text-red-400" /> :

          <BellIcon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          }
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`text-sm font-semibold px-2 py-1 rounded ${isDanger ? 'bg-red-200 dark:bg-red-900/60 text-red-800 dark:text-red-300' : 'bg-amber-200 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300'}`}>

              Route {alert.route}
            </span>
          </div>

          <p className="text-gray-900 dark:text-gray-100 font-medium mb-3">
            {alert.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <CalendarIcon className="w-4 h-4" />
              <span>{alert.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <ClockIcon className="w-4 h-4" />
              <span>{alert.time}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>);

}