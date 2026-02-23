import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { UserProvider, useUser } from './contexts/UserContext';
import { Header } from './components/Header';
import { RoleSelection } from './pages/RoleSelection';
import { DriverLogin } from './pages/DriverLogin';
import { DriverDashboard } from './pages/DriverDashboard';
import { LiveTracking } from './pages/LiveTracking';
import { BusNews } from './pages/BusNews';
import { Alerts } from './pages/Alerts';
import { Schedule } from './pages/Schedule';
import { LostAndFound } from './pages/LostAndFound';
type Page = 'tracking' | 'news' | 'alerts' | 'schedule' | 'lostfound';
function AppContent() {
  const { role, setRole } = useUser();
  const [currentPage, setCurrentPage] = useState<Page>('tracking');
  const renderPage = () => {
    switch (currentPage) {
      case 'tracking':
        return <LiveTracking />;
      case 'news':
        return <BusNews />;
      case 'alerts':
        return <Alerts />;
      case 'schedule':
        return <Schedule />;
      case 'lostfound':
        return <LostAndFound />;
      default:
        return <LiveTracking />;
    }
  };
  // Role Selection Screen
  if (role === null) {
    return (
      <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 transition-colors">
        <RoleSelection onSelectRole={setRole} />
      </div>);

  }
  // Driver Login Screen
  if (role === 'driver') {
    return (
      <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 transition-colors">
        <Header currentPage="tracking" onNavigate={() => {}} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <DriverDashboard />
        </main>
      </div>);

  }
  // Passenger View (Full Website)
  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header
        currentPage={currentPage}
        onNavigate={(page) => setCurrentPage(page as Page)} />


      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              y: -20
            }}
            transition={{
              duration: 0.3
            }}
            className="h-full">

            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>);

}
export function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <UserProvider>
          <AppContent />
        </UserProvider>
      </LanguageProvider>
    </ThemeProvider>);

}