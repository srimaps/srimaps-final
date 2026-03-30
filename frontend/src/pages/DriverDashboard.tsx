import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { LogOutIcon, MapPinIcon, RadioIcon, SaveIcon, TruckIcon } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { sendDriverLocation } from '../utils/api';

export function DriverDashboard() {
  const { driver, logoutDriver, updateDriverRoute } = useUser();

  const [routeNumber, setRouteNumber] = useState(driver?.routeNumber || '');
  const [status, setStatus] = useState('');
  const [sharing, setSharing] = useState(false);
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    setRouteNumber(driver?.routeNumber || '');
  }, [driver?.routeNumber]);

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const handleRouteSave = async () => {
    setStatus('');
    const result = await updateDriverRoute(routeNumber.trim());
    if (!result.success) {
      setStatus(result.error || 'Could not update route');
      return;
    }
    setStatus('Route updated successfully');
  };

  const startSharing = async () => {
    if (!driver) return;

    if (!driver.routeNumber && !routeNumber.trim()) {
      setStatus('Please set your route first');
      return;
    }

    if (!driver.routeNumber && routeNumber.trim()) {
      const result = await updateDriverRoute(routeNumber.trim());
      if (!result.success) {
        setStatus(result.error || 'Could not update route');
        return;
      }
    }

    if (!navigator.geolocation) {
      setStatus('Geolocation is not supported on this device');
      return;
    }

    setSharing(true);
    setStatus('Live location sharing started');

    watchIdRef.current = navigator.geolocation.watchPosition(
      async (position) => {
        try {
          await sendDriverLocation(driver.driverId, {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            speed: position.coords.speed ?? 0,
          });
        } catch (error) {
          setStatus(error instanceof Error ? error.message : 'Failed to send location');
        }
      },
      (error) => {
        setStatus(error.message);
        setSharing(false);
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );
  };

  const stopSharing = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setSharing(false);
    setStatus('Live location sharing stopped');
  };

  if (!driver) return null;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="bg-teal-100 dark:bg-teal-900/40 p-3 rounded-xl">
              <TruckIcon className="text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold dark:text-white">Driver Dashboard</h2>
              <p className="text-gray-500 dark:text-gray-400">
                {driver.fullName} ({driver.username})
              </p>
            </div>
          </div>

          <button
            onClick={logoutDriver}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
          >
            <LogOutIcon size={18} />
            Logout
          </button>
        </div>
      </motion.div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4">
        <h3 className="text-xl font-semibold dark:text-white">Selected Route</h3>

        <div className="flex gap-3 flex-wrap">
          <input
            value={routeNumber}
            onChange={(e) => setRouteNumber(e.target.value)}
            placeholder="Enter route number (e.g. 138)"
            className="flex-1 min-w-[220px] px-4 py-3 border rounded-lg dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={handleRouteSave}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
          >
            <SaveIcon size={18} />
            Save Route
          </button>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Current route: {driver.routeNumber || 'Not selected yet'}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4">
        <h3 className="text-xl font-semibold dark:text-white">Location Sharing</h3>

        <div className="flex items-center gap-2 text-sm">
          <RadioIcon size={18} className={sharing ? 'text-green-500' : 'text-gray-400'} />
          <span className="dark:text-white">{sharing ? 'Sharing is active' : 'Sharing is inactive'}</span>
        </div>

        <div className="flex gap-3 flex-wrap">
          {!sharing ? (
            <button
              onClick={startSharing}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white"
            >
              <MapPinIcon size={18} />
              Start Sharing
            </button>
          ) : (
            <button
              onClick={stopSharing}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white"
            >
              <MapPinIcon size={18} />
              Stop Sharing
            </button>
          )}
        </div>

        {status && <p className="text-sm text-gray-600 dark:text-gray-300">{status}</p>}
      </div>
    </div>
  );
}
