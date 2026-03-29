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

export type NewsApiItem = {
  newsId: number;
  title: string;
  description: string;
  route: { routeId: number; routeNumber: string } | null;
  postedBy: string;
  postedAt: string;
};

export type LostFoundApiItem = {
  itemId: number;
  itemType: string;
  itemName: string;
  description: string;
  contactInfo: string;
  route: { routeId: number; routeNumber: string } | null;
  reportedAt: string;
  status: string;
};

export type AlertApiItem = {
  alertId: number;
  title: string;
  message: string;
  severity: string;
  route: { routeId: number; routeNumber: string } | null;
  createdAt: string;
  expiresAt: string | null;
};

export type ScheduleApiItem = {
  scheduleId: number;
  route: { routeId: number; routeNumber: string };
  departureTime: string;
  arrivalTime: string;
  startDestination: string;
  endDestination: string;
  busStop: string | null;
  dayType: string;
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = 'Request failed';
    try {
      const data = await response.json();
      message = data.message || data.error || message;
    } catch {
      //
    }
    throw new Error(message);
  }
  return response.json();
}
