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

export async function signupDriver(payload: {
  fullName: string;
  username: string;
  phoneNumber: string;
  password: string;
}): Promise<DriverAuthResponse> {
  const response = await fetch(`${API_BASE}/drivers/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<DriverAuthResponse>(response);
}

export async function loginDriver(payload: {
  username: string;
  password: string;
}): Promise<DriverAuthResponse> {
  const response = await fetch(`${API_BASE}/drivers/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<DriverAuthResponse>(response);
}

export async function updateDriverRoute(
  driverId: number,
  routeNumber: string
): Promise<DriverAuthResponse> {
  const response = await fetch(`${API_BASE}/drivers/${driverId}/route`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ routeNumber }),
  });
  return handleResponse<DriverAuthResponse>(response);
}

export async function sendDriverLocation(
  driverId: number,
  payload: { latitude: number; longitude: number; speed?: number }
) {
  const response = await fetch(`${API_BASE}/locations/driver/${driverId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
}

export async function getLiveLocationsByRoute(routeNumber: string): Promise<LiveBus[]> {
  const response = await fetch(
    `${API_BASE}/locations/live?routeNumber=${encodeURIComponent(routeNumber)}`
  );
  return handleResponse<LiveBus[]>(response);
}

export async function getNews(routeNumber?: string): Promise<NewsApiItem[]> {
  const url = routeNumber?.trim()
    ? `${API_BASE}/news?routeNumber=${encodeURIComponent(routeNumber)}`
    : `${API_BASE}/news`;
  return handleResponse<NewsApiItem[]>(await fetch(url));
}

export async function createNews(payload: {
  title: string;
  description: string;
  postedBy?: string;
  routeId?: number | null;
}) {
  const response = await fetch(`${API_BASE}/news`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
}

export async function getLostFound(params?: {
  type?: string;
  status?: string;
  routeNumber?: string;
}): Promise<LostFoundApiItem[]> {
  const search = new URLSearchParams();
  if (params?.type) search.set('type', params.type);
  if (params?.status) search.set('status', params.status);
  if (params?.routeNumber) search.set('routeNumber', params.routeNumber);

  const qs = search.toString();
  const url = qs ? `${API_BASE}/lost-found?${qs}` : `${API_BASE}/lost-found`;

  return handleResponse<LostFoundApiItem[]>(await fetch(url));
}

export async function createLostFound(payload: {
  itemType: string;
  itemName: string;
  description: string;
  contactInfo: string;
  routeId?: number | null;
}) {
  const response = await fetch(`${API_BASE}/lost-found`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
}

export async function getAlerts(routeNumber?: string): Promise<AlertApiItem[]> {
  const url = routeNumber?.trim()
    ? `${API_BASE}/alerts?routeNumber=${encodeURIComponent(routeNumber)}`
    : `${API_BASE}/alerts`;
  return handleResponse<AlertApiItem[]>(await fetch(url));
}

export async function getSchedules(params?: {
  routeNumber?: string;
  start?: string;
  end?: string;
}): Promise<ScheduleApiItem[]> {
  const search = new URLSearchParams();
  if (params?.routeNumber) search.set('routeNumber', params.routeNumber);
  if (params?.start) search.set('start', params.start);
  if (params?.end) search.set('end', params.end);

  const qs = search.toString();
  const url = qs ? `${API_BASE}/schedules?${qs}` : `${API_BASE}/schedules`;

  return handleResponse<ScheduleApiItem[]>(await fetch(url));
}

export async function getRoutes() {
  return handleResponse<any[]>(await fetch(`${API_BASE}/routes`));
}
