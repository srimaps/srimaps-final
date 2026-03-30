import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SearchIcon } from 'lucide-react';
import { getLiveLocationsByRoute, type LiveBus } from '../utils/api';
import { BusMap } from '../components/BusMap';

export function LiveTracking() {
  const [routeNumber, setRouteNumber] = useState('');
  const [buses, setBuses] = useState<LiveBus[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!routeNumber.trim()) {
      setError('Enter a route number');
      setBuses([]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await getLiveLocationsByRoute(routeNumber.trim());
      setBuses(data);
      if (data.length === 0) {
        setError('No live buses are currently sharing on this route');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load live buses');
      setBuses([]);
    } finally {
      setLoading(false);
    }
  };

  // Convert LiveBus (from API) to Bus shape expected by BusMap
  const mappedBuses = buses.map((bus) => ({
    id: String(bus.driverId),
    number: bus.routeNumber,
    status: 'on-time' as const,
    startDestination: '',
    endDestination: '',
    currentLocation: {
      lat: bus.latitude,
      lng: bus.longitude,
    },
  }));

  return (
    <div className="space-y-6">
      {/* Search card */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold dark:text-white mb-2">Live Bus Tracking</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-5">
          Enter a route number to see all drivers currently sharing location on that route.
        </p>

        <div className="flex gap-3 flex-wrap">
          <input
            value={routeNumber}
            onChange={(e) => setRouteNumber(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Enter route number (e.g. 138)"
            className="flex-1 min-w-[220px] px-4 py-3 border rounded-lg dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white"
          >
            <SearchIcon size={18} />
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </motion.div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-xl p-4">
          {error}
        </div>
      )}

      {/* Map — shown once we have results */}
      {buses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
          style={{ height: '480px' }}
        >
          <BusMap buses={mappedBuses} />
        </motion.div>
      )}

      {/* Bus cards */}
      <div className="grid gap-4">
        {buses.map((bus) => (
          <motion.div
            key={bus.driverId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5"
          >
            <h3 className="text-lg font-semibold dark:text-white">{bus.driverName}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">@{bus.username}</p>
            <div className="mt-3 space-y-1 text-sm dark:text-gray-200">
              <p>Route: <span className="font-medium">{bus.routeNumber}</span></p>
              <p>Latitude: {bus.latitude}</p>
              <p>Longitude: {bus.longitude}</p>
              <p>Speed: {bus.speed ?? 0} km/h</p>
              <p>Updated: {new Date(bus.recordedAt).toLocaleString()}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
