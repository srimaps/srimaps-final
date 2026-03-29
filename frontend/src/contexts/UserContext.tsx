import React, { createContext, useContext, useMemo, useState } from 'react';
import {
  loginDriver as loginDriverApi,
  signupDriver as signupDriverApi,
  updateDriverRoute as updateDriverRouteApi,
  type DriverAuthResponse,
} from '../utils/api';

type Role = 'passenger' | 'driver' | null;

type DriverUser = {
  driverId: number;
  fullName: string;
  username: string;
  phoneNumber: string;
  routeNumber: string | null;
};

type UserContextType = {
  role: Role;
  setRole: (role: Role) => void;
  driver: DriverUser | null;
  loginDriver: (username: string, password: string) => Promise<boolean>;
  signupDriver: (
    fullName: string,
    username: string,
    phoneNumber: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  updateDriverRoute: (
    routeNumber: string
  ) => Promise<{ success: boolean; error?: string }>;
  logoutDriver: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

function toDriverUser(data: DriverAuthResponse): DriverUser {
  return {
    driverId: data.driverId,
    fullName: data.fullName,
    username: data.username,
    phoneNumber: data.phoneNumber,
    routeNumber: data.routeNumber,
  };
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>(null);
  const [driver, setDriver] = useState<DriverUser | null>(null);

  const loginDriver = async (username: string, password: string) => {
    try {
      const data = await loginDriverApi({ username, password });
      setDriver(toDriverUser(data));
      return true;
    } catch {
      return false;
    }
  };

  const signupDriver = async (
    fullName: string,
    username: string,
    phoneNumber: string,
    password: string
  ) => {
    try {
      await signupDriverApi({ fullName, username, phoneNumber, password });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Signup failed',
      };
    }
  };

  const updateDriverRoute = async (routeNumber: string) => {
    if (!driver) {
      return { success: false, error: 'Driver not logged in' };
    }

    try {
      const data = await updateDriverRouteApi(driver.driverId, routeNumber);
      setDriver(toDriverUser(data));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Route update failed',
      };
    }
  };

  const logoutDriver = () => {
    setDriver(null);
    setRole(null);
  };

  const value = useMemo(
    () => ({
      role,
      setRole,
      driver,
      loginDriver,
      signupDriver,
      updateDriverRoute,
      logoutDriver,
    }),
    [role, driver]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
