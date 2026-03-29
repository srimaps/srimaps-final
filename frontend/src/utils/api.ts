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

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = 'Request failed';
    try {
      const data = await response.json();
      message = data.message || data.error || message;
    } catch {
      // ignore JSON parse failure
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
