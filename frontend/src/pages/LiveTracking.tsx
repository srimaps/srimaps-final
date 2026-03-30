import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchBox } from '@mapbox/search-js-react';
import { SearchIcon, MapPinIcon, BusIcon, ArrowUpDown } from 'lucide-react';
import { BusMap } from '../components/BusMap';
import { QuickBusButtons } from '../components/QuickBusButton';
import { useLanguage } from '../contexts/LanguageContext';
import { translate } from '../utils/translations';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { getLiveLocationsByRoute, type LiveBus } from '../utils/api';
import type { Bus } from '../utils/mockData';
import 'mapbox-gl/dist/mapbox-gl.css';

interface BusRoute {
  number: string;
  from: string;
  to: string;
  fromCoords: [number, number];
  toCoords: [number, number];
}

interface BusStand {
  label: string;
  coords: [number, number];
  aliases: string[];
}

const BUS_ROUTES: BusRoute[] = [
  {
    number: '138',
    from: 'Colombo Fort Bus Stand',
    to: 'Malabe',
    fromCoords: [79.8574, 6.9350],
    toCoords: [79.9573, 6.9061],
  },
  {
    number: '177',
    from: 'Colombo Fort Bus Stand',
    to: 'Kaduwela',
    fromCoords: [79.8574, 6.9350],
    toCoords: [79.9845, 6.9344],
  },
  {
    number: '120',
    from: 'Colombo Fort Bus Stand',
    to: 'Piliyandala',
    fromCoords: [79.8574, 6.9350],
    toCoords: [79.9220, 6.7980],
  },
  {
    number: '155',
    from: 'Colombo Fort Bus Stand',
    to: 'Nugegoda',
    fromCoords: [79.8574, 6.9350],
    toCoords: [79.8997, 6.8649],
  },
  {
    number: '261',
    from: 'Kadawatha Bus Stand',
    to: 'Colombo Fort Bus Stand',
    fromCoords: [79.9545, 7.0051],
    toCoords: [79.8567, 6.9353],
  },
  {
    number: '100',
    from: 'Moratuwa Bus Stand',
    to: 'Dehiwala Bus Stand',
    fromCoords: [79.8863, 6.7589],
    toCoords: [79.8658, 6.8540],
  },
  {
    number: '101',
    from: 'Moratuwa Bus Stand',
    to: 'Pettah Bus Stand',
    fromCoords: [79.8863, 6.7589],
    toCoords: [79.8574, 6.9350],
  },
];

const BUS_STANDS: BusStand[] = [
  {
    label: 'Colombo Fort Bus Stand',
    coords: [79.8574, 6.9350],
    aliases: ['fort', 'colombo fort', 'pettah', 'bastian'],
  },
  {
    label: 'Kadawatha Bus Stand',
    coords: [79.9545, 7.0051],
    aliases: ['kadawatha'],
  },
  {
    label: 'Moratuwa Bus Stand',
    coords: [79.8863, 6.7589],
    aliases: ['moratuwa'],
  },
  {
    label: 'Dehiwala Bus Stand',
    coords: [79.8658, 6.8540],
    aliases: ['dehiwala'],
  },
  {
    label: 'Malabe',
    coords: [79.9573, 6.9061],
    aliases: ['malabe'],
  },
  {
    label: 'Kaduwela',
    coords: [79.9845, 6.9344],
    aliases: ['kaduwela'],
  },
  {
    label: 'Piliyandala',
    coords: [79.9220, 6.7980],
    aliases: ['piliyandala'],
  },
  {
    label: 'Nugegoda',
    coords: [79.8997, 6.8649],
    aliases: ['nugegoda'],
  },
];

const norm = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]/g, '');

function snapToBusStand(name: string): BusStand | null {
  const cleaned = name.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
  for (const stand of BUS_STANDS) {
    if (stand.aliases.some(alias => cleaned.includes(alias) || alias.includes(cleaned))) {
      return stand;
    }
  }
  return null;
}

function mapLiveBusToBus(liveBus: LiveBus): Bus {
  const routeMeta = BUS_ROUTES.find(route => route.number === liveBus.routeNumber);

  return {
    id: String(liveBus.driverId),
    number: liveBus.routeNumber,
    route: routeMeta
      ? `${routeMeta.from} → ${routeMeta.to}`
      : liveBus.routeNumber,
    startDestination: routeMeta?.from ?? liveBus.routeNumber,
    endDestination: routeMeta?.to ?? 'Destination',
    currentLocation: {
      lat: liveBus.latitude,
      lng: liveBus.longitude,
    },
    status: 'on-time',
  };
}

export function LiveTracking() {
  const { language } = useLanguage();

  const [searchType, setSearchType] = useState<'number' | 'route'>('number');
  const [busNumber, setBusNumber] = useState('');
  const [startDest, setStartDest] = useState('');
  const [endDest, setEndDest] = useState('');
  const [startDestCoords, setStartDestCoords] = useState<[number, number] | null>(null);
  const [endDestCoords, setEndDestCoords] = useState<[number, number] | null>(null);
  const [startLabel, setStartLabel] = useState('');
  const [endLabel, setEndLabel] = useState('');
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [displayedBuses, setDisplayedBuses] = useState<Bus[]>([]);
  const [swapping, setSwapping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sbKey, setSbKey] = useState(0);

  const activeRouteNumbers = useMemo(
    () => Array.from(new Set(BUS_ROUTES.map(route => route.number))),
    []
  );

  const geocodePlace = async (placeName: string): Promise<[number, number] | null> => {
    try {
      const token = import.meta.env.VITE_MAPBOX_TOKEN;
      if (!token) return null;

      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          placeName
        )}.json?country=LK&access_token=${token}`
      );

      const data = await response.json();
      if (data.features?.length > 0) {
        const [lng, lat] = data.features[0].geometry.coordinates;
        return [lng, lat];
      }
    } catch (err) {
      console.error('Geocoding error:', err);
    }

    return null;
  };

  const loadRouteLiveBuses = async (routeNumber: string) => {
    setLoading(true);
    setError('');

    try {
      const liveBuses = await getLiveLocationsByRoute(routeNumber);
      const mappedBuses = liveBuses.map(mapLiveBusToBus);
      setDisplayedBuses(mappedBuses);
      setSelectedBus(mappedBuses[0] ?? null);
      return mappedBuses;
    } catch (err) {
      setDisplayedBuses([]);
      setSelectedBus(null);
      setError(err instanceof Error ? err.message : 'Failed to fetch live buses');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handleBusNumber = async (number: string) => {
    setBusNumber(number);
    setSearchType('number');

    const routeMeta = BUS_ROUTES.find(route => route.number === number);
    if (routeMeta) {
      setStartDestCoords(routeMeta.fromCoords);
      setEndDestCoords(routeMeta.toCoords);
      setStartLabel(routeMeta.from);
      setEndLabel(routeMeta.to);
    }

    await loadRouteLiveBuses(number);
  };

  const handleRouteSearch = async () => {
    if (!startDest || !endDest) return;

    const startSnap = snapToBusStand(startDest);
    const endSnap = snapToBusStand(endDest);

    const startNorm = norm(startSnap?.label ?? startDest);
    const endNorm = norm(endSnap?.label ?? endDest);

    const matchedRoute = BUS_ROUTES.find(route => {
      const routeFrom = norm(route.from);
      const routeTo = norm(route.to);

      const forward =
        (startNorm.includes(routeFrom) || routeFrom.includes(startNorm)) &&
        (endNorm.includes(routeTo) || routeTo.includes(endNorm));

      const reverse =
        (startNorm.includes(routeTo) || routeTo.includes(startNorm)) &&
        (endNorm.includes(routeFrom) || routeFrom.includes(endNorm));

      return forward || reverse;
    });

    if (!matchedRoute) {
      setError('No matching route found');
      setDisplayedBuses([]);
      setSelectedBus(null);
      return;
    }

    const reversed =
      (startNorm.includes(norm(matchedRoute.to)) || norm(matchedRoute.to).includes(startNorm)) &&
      (endNorm.includes(norm(matchedRoute.from)) || norm(matchedRoute.from).includes(endNorm));

    setStartDestCoords(reversed ? matchedRoute.toCoords : matchedRoute.fromCoords);
    setEndDestCoords(reversed ? matchedRoute.fromCoords : matchedRoute.toCoords);
    setStartLabel(reversed ? matchedRoute.to : matchedRoute.from);
    setEndLabel(reversed ? matchedRoute.from : matchedRoute.to);

    await loadRouteLiveBuses(matchedRoute.number);
  };

  const handleSearch = async () => {
    if (searchType === 'number' && busNumber.trim()) {
      await handleBusNumber(busNumber.trim());
      return;
    }

    if (searchType === 'route') {
      await handleRouteSearch();
    }
  };

  const handleSwap = () => {
    if (!startDest && !endDest) return;

    setSwapping(true);

    const prevStart = startDest;
    const prevEnd = endDest;
    const prevStartLabel = startLabel;
    const prevEndLabel = endLabel;
    const prevStartCoords = startDestCoords;
    const prevEndCoords = endDestCoords;

    setStartDest(prevEnd);
    setEndDest(prevStart);
    setStartLabel(prevEndLabel);
    setEndLabel(prevStartLabel);
    setStartDestCoords(prevEndCoords);
    setEndDestCoords(prevStartCoords);
    setSbKey(value => value + 1);

    setTimeout(() => setSwapping(false), 350);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:w-96 flex-shrink-0 space-y-6"
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            {translate('liveTracking', language)}
          </h2>

          <QuickBusButtons
            onSelectBus={handleBusNumber}
            selectedBus={selectedBus?.number}
            activeBusNumbers={activeRouteNumbers}
          />

          <div className="flex gap-2 mb-6">
            {(['number', 'route'] as const).map(type => (
              <motion.button
                key={type}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSearchType(type)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  searchType === type
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {type === 'number'
                  ? translate('busNumber', language)
                  : translate('route', language)}
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {searchType === 'number' ? (
              <motion.div
                key="number"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {translate('busNumber', language)}
                  </label>
                  <input
                    type="text"
                    value={busNumber}
                    onChange={e => setBusNumber(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    placeholder="138, 177, 120..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="route"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {translate('startDestination', language)}
                  </label>
                  <SearchBox
                    key={`start-${sbKey}`}
                    accessToken={import.meta.env.VITE_MAPBOX_TOKEN}
                    value={startDest}
                    onRetrieve={(result: any) => {
                      const feature = result?.features?.[0];
                      if (!feature) return;

                      const rawName = feature.properties?.name || feature.place_name || 'Start';
                      const snapped = snapToBusStand(rawName);

                      if (snapped) {
                        setStartDest(snapped.label);
                        setStartLabel(snapped.label);
                        setStartDestCoords(snapped.coords);
                      } else {
                        const coords = feature.geometry?.coordinates as [number, number];
                        setStartDest(rawName);
                        setStartLabel(rawName);
                        setStartDestCoords(coords);
                      }
                    }}
                    placeholder="e.g. Colombo Fort"
                  />
                </div>

                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={handleSwap}
                    disabled={swapping}
                    className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {translate('endDestination', language)}
                  </label>
                  <SearchBox
                    key={`end-${sbKey}`}
                    accessToken={import.meta.env.VITE_MAPBOX_TOKEN}
                    value={endDest}
                    onRetrieve={(result: any) => {
                      const feature = result?.features?.[0];
                      if (!feature) return;

                      const rawName = feature.properties?.name || feature.place_name || 'End';
                      const snapped = snapToBusStand(rawName);

                      if (snapped) {
                        setEndDest(snapped.label);
                        setEndLabel(snapped.label);
                        setEndDestCoords(snapped.coords);
                      } else {
                        const coords = feature.geometry?.coordinates as [number, number];
                        setEndDest(rawName);
                        setEndLabel(rawName);
                        setEndDestCoords(coords);
                      }
                    }}
                    placeholder="e.g. Malabe"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleSearch}
            disabled={loading}
            className="w-full mt-6 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <SearchIcon className="w-4 h-4" />
            {loading ? 'Loading...' : translate('searchButton', language)}
          </motion.button>

          {error && (
            <div className="mt-4 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {selectedBus && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 bg-gray-50 dark:bg-gray-900/40 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-2 mb-3">
                <BusIcon className="w-5 h-5 text-primary-600" />
                <h3 className="font-bold text-gray-900 dark:text-white">
                  Bus {selectedBus.number}
                </h3>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                {selectedBus.route}
              </p>

              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <MapPinIcon className="w-4 h-4 mt-0.5 text-green-600" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">From</div>
                    <div className="text-gray-600 dark:text-gray-300">
                      {startLabel || selectedBus.startDestination}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPinIcon className="w-4 h-4 mt-0.5 text-red-600" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">To</div>
                    <div className="text-gray-600 dark:text-gray-300">
                      {endLabel || selectedBus.endDestination}
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-gray-700 dark:text-gray-300">
                  Current location: {selectedBus.currentLocation.lat.toFixed(4)},{' '}
                  {selectedBus.currentLocation.lng.toFixed(4)}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex-1 min-h-[500px] lg:h-full relative"
      >
        <ErrorBoundary>
          <BusMap
            buses={displayedBuses}
            selectedBus={selectedBus}
            startCoords={startDestCoords ?? undefined}
            endCoords={endDestCoords ?? undefined}
            startLabel={startLabel || undefined}
            endLabel={endLabel || undefined}
          />
        </ErrorBoundary>
      </motion.div>
    </div>
  );
}
