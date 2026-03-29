const API_BASE = 'http://localhost:8080/api';

export type DriverAuthResponse = {
  driverId: number;
  fullName: string;
  username: string;
  phoneNumber: string;
  routeNumber: string | null;
  message: string;
};

export type LiveBus = {
  driverId: number;
  driverName: string;
  username: string;
  routeNumber: string;
  latitude: number;
  longitude: number;
  speed: number;
  recordedAt: string;
};
