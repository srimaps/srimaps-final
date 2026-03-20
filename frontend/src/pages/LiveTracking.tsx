import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchBox } from '@mapbox/search-js-react';
import { SearchIcon, MapPinIcon, BusIcon, ArrowUpDown} from 'lucide-react';
import { BusMap } from '../components/BusMap';
import { QuickBusButtons } from '../components/QuickBusButton';
import { mockBuses, Bus } from '../utils/mockData';
import { useLanguage } from '../contexts/LanguageContext';
import { translate } from '../utils/translations';
import { ErrorBoundary } from '../components/ErrorBoundary';
import 'mapbox-gl/dist/mapbox-gl.css';

interface BusRoute {
  number: string;
  from: string;
  to: string;
  fromCoords: [number, number]; // [lng, lat]
  toCoords:   [number, number];
}
const BUS_ROUTES: BusRoute[] = [
  {
    number:     '216',
    from:       'Kadawatha Bus Stand',
    to:         'Colombo Fort Bus Stand',
    fromCoords: [79.9545, 7.0051],   // Kadawatha Bus Stand, Kadawatha-Ganemulla Rd
    toCoords:   [79.8567, 6.9353],   // Colombo Central Bus Stand, Olcott Mawatha
  },
  {
    number:     '261',
    from:       'Kadawatha Bus Stand',
    to:         'Colombo Fort Bus Stand',
    fromCoords: [79.9545, 7.0051],   // Same route as 216
    toCoords:   [79.8567, 6.9353],
  },
  {
    number:     '100',
    from:       'Moratuwa Bus Stand',
    to:         'Dehiwala Bus Stand',
    fromCoords: [79.8863, 6.7589],   // Moratuwa (Angulana) bus terminus
    toCoords:   [79.8658, 6.8540],   // Dehiwala main bus stop, Galle Rd
  },
  {
    number:     '101',
    from:       'Moratuwa Bus Stand',
    to:         'Pettah Bus Stand',
    fromCoords: [79.8863, 6.7589],   // Moratuwa (Angulana) bus terminus
    toCoords:   [79.8574, 6.9350],   // Pettah Bus Stand, Bastian Mawatha
  },
];
interface BusStand {
  label:   string;           // canonical display name
  coords:  [number, number]; // [lng, lat]
  aliases: string[];         // lowercase keywords that trigger a snap
}
//Bus stand with alias
const BUS_STANDS: BusStand[] = [
  {
    label:   'Kadawatha Bus Stand',
    coords:  [79.9545, 7.0051],
    aliases: ['kadawatha'],
  },
  {
    label:   'Colombo Fort Bus Stand',
    coords:  [79.8567, 6.9353],
    aliases: ['fort', 'colombo fort', 'colombo 1', 'fort station'],
  },
  {
    label:   'Pettah Bus Stand',
    coords:  [79.8574, 6.9350],
    aliases: ['pettah', 'bastian', 'colombo 11'],
  },
  {
    label:   'Moratuwa Bus Stand',
    coords:  [79.8863, 6.7589],
    aliases: ['moratuwa', 'angulana'],
  },
  {
    label:   'Dehiwala Bus Stand',
    coords:  [79.8658, 6.8540],
    aliases: ['dehiwala'],
  },
];

function snapToBusStand(name: string): BusStand | null {
  const n = name.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
  for (const stand of BUS_STANDS) {
    if (stand.aliases.some(alias => n.includes(alias) || alias.includes(n.split(' ')[0]))) {
      return stand;
    }
  }
  return null;
}

// Normalize for loose matching
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

// Find a bus route matching from/to in either direction (matches city name OR bus stand label)
function findRouteMatch(from: string, to: string): BusRoute | null {
  // First try to snap both to known bus stands
  const snapFrom = snapToBusStand(from);
  const snapTo   = snapToBusStand(to);
  const nf = norm(snapFrom?.label ?? from);
  const nt = norm(snapTo?.label   ?? to);

  for (const r of BUS_ROUTES) {
    const rf = norm(r.from);
    const rt = norm(r.to);
    const fwdMatch = (nf.includes(rf) || rf.includes(nf)) && (nt.includes(rt) || rt.includes(nt));
    const revMatch = (nf.includes(rt) || rt.includes(nf)) && (nt.includes(rf) || rf.includes(nf));
    if (fwdMatch || revMatch) return r;
  }
  return null;
}

export function LiveTracking() {
  const { language } = useLanguage();
  
  const [searchType, setSearchType] = useState<'number' | 'route'>('number');
  const [busNumber, setBusNumber] = useState('');
  const [startDest, setStartDest] = useState('');
  const [endDest, setEndDest] = useState('');
  const [startDestCoords, setStartDestCoords] = useState<[number, number] | null>(null);
  const [endDestCoords, setEndDestCoords]     = useState<[number, number] | null>(null);  
  const [startLabel, setStartLabel]           = useState('');
  const [endLabel, setEndLabel]               = useState('');
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [displayedBuses, setDisplayedBuses] = useState<Bus[]>(mockBuses);
  const [swapping, setSwapping]               = useState(false);

  const [sbKey, setSbKey] = useState(0);

  const geocodePlace = async (placeName: string): Promise<[number, number] | null> => {
    try {
      const token = import.meta.env.VITE_MAPBOX_TOKEN!;
      const res   = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(placeName)}.json?country=LK&access_token=${token}`
      );
      const data = await res.json();
      if (data.features?.length > 0) {
        const [lng, lat] = data.features[0].geometry.coordinates;
        return [lng, lat];
      }
    } catch (err) {
      console.error('Geocoding error:', err);
    }
    return null;
  };
  
  const applyRouteFromCoords = (
      from: string, to: string,
      fromCoords: [number, number], toCoords: [number, number],
      bus?: Bus | null,
      reversed = false,
  ) => {
    setStartDestCoords(reversed ? toCoords   : fromCoords);
    setEndDestCoords  (reversed ? fromCoords : toCoords);
    setStartLabel     (reversed ? to         : from);
    setEndLabel       (reversed ? from       : to);
    if (bus) { setSelectedBus(bus); setDisplayedBuses([bus]); }
  };
  const applyRoute = async (from: string, to: string, bus?: Bus | null) => {
    const [fc, tc] = await Promise.all([geocodePlace(from), geocodePlace(to)]);
    if (fc && tc) {
      setStartDestCoords(fc); setEndDestCoords(tc);
      setStartLabel(from);    setEndLabel(to);
    }
    if (bus) { setSelectedBus(bus); setDisplayedBuses([bus]); }
  };
  const handleBusNumber = async (number: string) => {
    setBusNumber(number);
    setSearchType('number');

    const hardcoded = BUS_ROUTES.find(r => r.number === number);
    if (hardcoded) {
      // Always use hardcoded coords — never geocode, never trust mockBus destinations
      const mockBus = mockBuses.find(b => b.number === number) ?? null;
      applyRouteFromCoords(
          hardcoded.from, hardcoded.to,
          hardcoded.fromCoords, hardcoded.toCoords,
          mockBus,
      );
      // Always set the info panel from hardcoded data so labels are correct
      setSelectedBus({
        ...(mockBus ?? {}),
        number,
        route:            `${hardcoded.from} → ${hardcoded.to}`,
        startDestination: hardcoded.from,
        endDestination:   hardcoded.to,
        status:           mockBus?.status ?? 'on-time',
        currentLocation:  mockBus?.currentLocation ?? { lat: 0, lng: 0 },
      } as Bus);
      if (!mockBus) setDisplayedBuses([]);
      return;
    }

    const found = mockBuses.find(b => b.number === number);
    if (found) await applyRoute(found.startDestination, found.endDestination, found);
  };

  //main search
  const handleSearch = async () => {
    if (searchType === 'number' && busNumber) {
      await handleBusNumber(busNumber);
      return;
    }

    if (searchType === 'route' && startDestCoords && endDestCoords) {
      const matched = findRouteMatch(startDest, endDest);
      if (matched) {
        const mockBus = mockBuses.find(b => b.number === matched.number) ?? null;
        // Detect if user entered in reverse direction
        const reversed =
            norm(startDest).includes(norm(matched.to)) ||
            norm(matched.to).includes(norm(startDest));
        applyRouteFromCoords(
            matched.from, matched.to,
            matched.fromCoords, matched.toCoords,
            mockBus, reversed,
        );
        if (!mockBus) {
          setSelectedBus({
            number:           matched.number,
            route:            `${matched.from} → ${matched.to}`,
            startDestination: matched.from,
            endDestination:   matched.to,
            status:           'on-time',
            currentLocation:  { lat: 0, lng: 0 },
          } as Bus);
          setDisplayedBuses([]);
        }
        return;
      }

      // Generic route search against mockBuses (bidirectional)
      const nf = norm(startDest);
      const nt = norm(endDest);
      const found = mockBuses.filter(b => {
        const bf = norm(b.startDestination);
        const bt = norm(b.endDestination);
        return (
            (nf.includes(bf) || bf.includes(nf)) && (nt.includes(bt) || bt.includes(nt)) ||
            (nf.includes(bt) || bt.includes(nf)) && (nt.includes(bf) || bf.includes(nf))
        );
      });
      setDisplayedBuses(found.length > 0 ? found : mockBuses);
      setSelectedBus(found[0] ?? null);
    }
  };
  const handleSwap = async () => {
    if (!startLabel && !endLabel) return;
    setSwapping(true);

    const prevStart      = startLabel;
    const prevEnd        = endLabel;
    const prevStartCoord = startDestCoords;
    const prevEndCoord   = endDestCoords;
    const prevStartDest  = startDest;
    const prevEndDest    = endDest;

    setStartLabel(prevEnd);
    setEndLabel(prevStart);
    setStartDestCoords(prevEndCoord);
    setEndDestCoords(prevStartCoord);
    setStartDest(prevEndDest);
    setEndDest(prevStartDest);

    // Remount SearchBoxes so their displayed text updates
    setSbKey(k => k + 1);

    setTimeout(() => setSwapping(false), 400);
  };
  return (
      <div className="h-full flex flex-col lg:flex-row gap-6">

        {/* ── Search Panel ── */}
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-96 flex-shrink-0 space-y-6"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              {translate('liveTracking', language)}
            </h2>

            {/* Quick Bus Buttons */}
            <QuickBusButtons
                onSelectBus={handleBusNumber}
                selectedBus={selectedBus?.number}
            />

            {/* Search Type Toggle */}
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
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                  >
                    {type === 'number' ? translate('busNumber', language) : translate('route', language)}
                  </motion.button>
              ))}
            </div>

            {/* Search Inputs */}
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
                          placeholder="216, 100, 101…"
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
                      className="space-y-0"
                  >
                    {/* Start */}
                    <div className="mb-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {translate('startDestination', language)}
                      </label>
                      <SearchBox
                          key={`start-${sbKey}`}
                          accessToken={import.meta.env.VITE_MAPBOX_TOKEN!}
                          onRetrieve={res => {
                            const f = res.features[0];
                            if (!f) return;
                            const rawName = f.properties?.name || f.place_name || 'Start';
                            const snapped = snapToBusStand(rawName);
                            if (snapped) {
                              setStartDestCoords(snapped.coords);
                              setStartDest(snapped.label);
                              setStartLabel(snapped.label);
                            } else {
                              setStartDestCoords(f.geometry.coordinates as [number, number]);
                              setStartDest(rawName);
                              setStartLabel(rawName);
                            }
                          }}
                          placeholder={startLabel || 'e.g. Kadawatha'}
                      />
                    </div>

                    {/* Swap button — centred between the two fields */}
                    <div className="flex justify-center py-1">
                      <motion.button
                          onClick={handleSwap}
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.92 }}
                          animate={swapping ? { rotate: 180 } : { rotate: 0 }}
                          transition={{ duration: 0.3 }}
                          title="Swap destinations"
                          className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 flex items-center justify-center shadow-sm hover:bg-primary-50 dark:hover:bg-gray-600 hover:border-primary-400 transition-colors"
                      >
                        <ArrowUpDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      </motion.button>
                    </div>

                    {/* End */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {translate('endDestination', language)}
                      </label>
                      <SearchBox
                          key={`end-${sbKey}`}
                          accessToken={import.meta.env.VITE_MAPBOX_TOKEN!}
                          onRetrieve={res => {
                            const f = res.features[0];
                            if (!f) return;
                            const rawName = f.properties?.name || f.place_name || 'End';
                            const snapped = snapToBusStand(rawName);
                            if (snapped) {
                              setEndDestCoords(snapped.coords);
                              setEndDest(snapped.label);
                              setEndLabel(snapped.label);
                            } else {
                              setEndDestCoords(f.geometry.coordinates as [number, number]);
                              setEndDest(rawName);
                              setEndLabel(rawName);
                            }
                          }}
                          placeholder={endLabel || 'e.g. Colombo Fort'}
                      />
                    </div>
                  </motion.div>
              )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSearch}
                className="w-full mt-6 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
            >
              <SearchIcon className="w-5 h-5" />
              {translate('searchButton', language)}
            </motion.button>
          </div>

          {/* Selected Bus Info */}
          <AnimatePresence>
            {selectedBus && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-lg">
                      <BusIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        Bus {selectedBus.number}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{selectedBus.route}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <MapPinIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">From</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{startLabel || selectedBus.startDestination}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPinIcon className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">To</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{endLabel || selectedBus.endDestination}</p>
                      </div>
                    </div>

                    {selectedBus.currentLocation?.lat !== 0 && (
                        <div className="flex items-start gap-2">
                          <MapPinIcon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {translate('currentLocation', language)}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {selectedBus.currentLocation.lat.toFixed(4)},{' '}
                              {selectedBus.currentLocation.lng.toFixed(4)}
                            </p>
                          </div>
                        </div>
                    )}

                    <div className="pt-3 border-t dark:border-gray-700">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      selectedBus.status === 'on-time'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                  }`}>
                    {selectedBus.status === 'on-time'
                        ? translate('onTime', language)
                        : translate('delayed', language)}
                  </span>
                    </div>
                  </div>
                </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Map ── */}
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
