import React, { useState, createContext, useContext } from 'react';
type UserRole = 'passenger' | 'driver' | null;
interface Driver {
  busNumber: string;
  name: string;
}
interface UserContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  driver: Driver | null;
  loginDriver: (busNumber: string, password: string) => boolean;
  logoutDriver: () => void;
  isDriverSharingLocation: boolean;
  setIsDriverSharingLocation: (sharing: boolean) => void;
}
const UserContext = createContext<UserContextType | undefined>(undefined);
interface UserProviderProps {
  children: ReactNode;
}
// Mock driver credentials
const driverCredentials: Record<
  string,
  {
    password: string;
    name: string;
  }> =
{
  '138': {
    password: 'driver138',
    name: 'Kamal Perera'
  },
  '177': {
    password: 'driver177',
    name: 'Sunil Silva'
  },
  '120': {
    password: 'driver120',
    name: 'Nimal Fernando'
  }
};




