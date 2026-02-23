import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TruckIcon, ArrowLeftIcon, AlertCircleIcon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { translate } from '../utils/translations';
import { useUser } from '../contexts/UserContext';
interface DriverLoginProps {
  onBack: () => void;
}
export function DriverLogin({ onBack }: DriverLoginProps) {
  const { language } = useLanguage();
  const { loginDriver } = useUser();
  const [busNumber, setBusNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = loginDriver(busNumber, password);
    if (!success) {
      setError(translate('invalidCredentials', language));
    }
  };
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="max-w-md w-full px-4">
        <motion.button
          initial={{
            opacity: 0,
            x: -20
          }}
          animate={{
            opacity: 1,
            x: 0
          }}
          whileHover={{
            x: -4
          }}
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-8 transition-colors">

          <ArrowLeftIcon className="w-5 h-5" />
          {translate('back', language)}
        </motion.button>

        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">

          <div className="flex items-center justify-center mb-6">
            <div className="bg-teal-100 dark:bg-teal-900/30 w-16 h-16 rounded-full flex items-center justify-center">
              <TruckIcon className="w-8 h-8 text-teal-600 dark:text-teal-400" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100 mb-2">
            {translate('driverLogin', language)}
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            {translate('enterYourCredentials', language)}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {translate('busNumber', language)}
              </label>
              <input
                type="text"
                required
                value={busNumber}
                onChange={(e) => setBusNumber(e.target.value)}
                placeholder="138"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all" />

            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {translate('password', language)}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all" />

            </div>

            {error &&
            <motion.div
              initial={{
                opacity: 0,
                y: -10
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">

                <AlertCircleIcon className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              </motion.div>
            }

            <motion.button
              type="submit"
              whileHover={{
                scale: 1.02
              }}
              whileTap={{
                scale: 0.98
              }}
              className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors">

              {translate('login', language)}
            </motion.button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
              {translate('demoCredentials', language)}
              <br />
              <span className="font-mono">138 / driver138</span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>);

}