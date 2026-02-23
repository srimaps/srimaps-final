import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BusIcon, MenuIcon, XIcon, SunIcon, MoonIcon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { translate } from '../utils/translations';
import { LanguageSelector } from './LanguageSelector';
interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}
export function Header({ currentPage, onNavigate }: HeaderProps) {
  const { language } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navItems = [
  {
    id: 'tracking',
    label: translate('liveTracking', language)
  },
  {
    id: 'news',
    label: translate('busNews', language)
  },
  {
    id: 'alerts',
    label: translate('alerts', language)
  },
  {
    id: 'schedule',
    label: translate('schedule', language)
  },
  {
    id: 'lostfound',
    label: translate('lostAndFound', language)
  }];

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            initial={{
              opacity: 0,
              x: -20
            }}
            animate={{
              opacity: 1,
              x: 0
            }}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onNavigate('tracking')}>

            <div className="bg-primary-600 p-2 rounded-lg">
              <BusIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-primary-600">
              {translate('appName', language)}
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item, index) =>
            <motion.button
              key={item.id}
              initial={{
                opacity: 0,
                y: -10
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: index * 0.1
              }}
              whileHover={{
                scale: 1.05
              }}
              whileTap={{
                scale: 0.95
              }}
              onClick={() => onNavigate(item.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentPage === item.id ? 'bg-primary-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>

                {item.label}
              </motion.button>
            )}
          </nav>

          {/* Theme Toggle, Language Selector & Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{
                scale: 1.05
              }}
              whileTap={{
                scale: 0.95
              }}
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle theme">

              {theme === 'light' ?
              <MoonIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" /> :

              <SunIcon className="w-5 h-5 text-gray-300" />
              }
            </motion.button>

            <LanguageSelector />

            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu">

              {mobileMenuOpen ?
              <XIcon className="w-6 h-6 dark:text-gray-300" /> :

              <MenuIcon className="w-6 h-6 dark:text-gray-300" />
              }
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen &&
        <motion.nav
          initial={{
            opacity: 0,
            height: 0
          }}
          animate={{
            opacity: 1,
            height: 'auto'
          }}
          exit={{
            opacity: 0,
            height: 0
          }}
          className="md:hidden py-4 space-y-2">

            {navItems.map((item) =>
          <motion.button
            key={item.id}
            whileTap={{
              scale: 0.95
            }}
            onClick={() => {
              onNavigate(item.id);
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${currentPage === item.id ? 'bg-primary-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>

                {item.label}
              </motion.button>
          )}
          </motion.nav>
        }
      </div>
    </header>);

}