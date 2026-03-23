import React, { useState, createContext, useContext, ReactNode } from 'react';
import { API_BASE } from '../utils/api';

type UserRole = 'passenger' | 'driver' | null;

interface Driver {
  driverId: number;
  busId: number | null;
  busNumber: string;
  name: string;
  username: string;
  routeNumber: string | null;
}

interface UserContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  driver: Driver | null;
  loginDriver: (username: string, password: string) => Promise<boolean>;
  logoutDriver: () => void;
  isDriverSharingLocation: boolean;
  setIsDriverSharingLocation: (sharing: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [role, setRole] = useState<UserRole>(null);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [isDriverSharingLocation, setIsDriverSharingLocation] = useState(false);

  const loginDriver = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE}/drivers/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) return false;

      const data = await response.json();
      setDriver({
        driverId: data.driverId,
        busId: data.busId ?? null,
        busNumber: data.busNumber ?? '',
        name: data.fullName ?? '',
        username: data.username ?? username,
        routeNumber: data.routeNumber ?? null
      });
      setRole('driver');
      return true;
    } catch {
      return false;
    }
  };

  const logoutDriver = () => {
    setDriver(null);
    setRole(null);
    setIsDriverSharingLocation(false);
  };

  return (
    <UserContext.Provider
      value={{
        role,
        setRole,
        driver,
        loginDriver,
        logoutDriver,
        isDriverSharingLocation,
        setIsDriverSharingLocation
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}










