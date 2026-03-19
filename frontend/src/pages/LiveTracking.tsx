import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchBox } from '@mapbox/search-js-react';
import { SearchIcon, MapPinIcon, BusIcon, ArrowUpDown} from 'lucide-react';
import { BusMap } from '../components/BusMap';
import { QuickBusButtons } from '../components/QuickBusButtons';
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
}
