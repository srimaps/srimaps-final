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
export function UserProvider({ children }: UserProviderProps) {
  const [role, setRole] = useState<UserRole>(null);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [isDriverSharingLocation, setIsDriverSharingLocation] = useState(false);
  const loginDriver = (busNumber: string, password: string): boolean => {
    const credentials = driverCredentials[busNumber];
    if (credentials && credentials.password === password) {
      setDriver({
        busNumber,
        name: credentials.name
      });
      setRole('driver');
      return true;
    }
    return false;
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
      }}>

      {children}
    </UserContext.Provider>);

}
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}