import React from 'react';
import { motion } from 'framer-motion';
import { TruckIcon, MapPinIcon, LogOutIcon, RadioIcon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { translate } from '../utils/translations';
import { useUser } from '../contexts/UserContext';
import { BusMap } from '../components/BusMap';
import { mockBuses } from '../utils/mockData';
export function DriverDashboard() {
  const { language } = useLanguage();
  const {
    driver,
    logoutDriver,
    isDriverSharingLocation,
    setIsDriverSharingLocation
  } = useUser();
  const driverBus = mockBuses.find((b) => b.number === driver?.busNumber);
  return ();

}
