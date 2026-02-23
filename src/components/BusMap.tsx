import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { motion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Bus } from '../utils/mockData';
// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});
// Custom bus icon
const createBusIcon = (status: 'on-time' | 'delayed') => {
  const color = status === 'on-time' ? '#10b981' : '#ef4444';
  return L.divIcon({
    className: 'custom-bus-marker',
    html: `
      <div style="position: relative;">
        <div style="
          width: 32px;
          height: 32px;
          background: ${color};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pulse 2s infinite;
        ">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M17 20H7V21C7 21.5523 6.55228 22 6 22H5C4.44772 22 4 21.5523 4 21V12L2.14286 12C1.51167 12 1 11.4883 1 10.8571C1 10.5714 1.14286 10.2857 1.28571 10.1429L3 8V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V8L22.7143 10.1429C23 10.4286 23 10.8571 23 11.1429C23 11.6429 22.5714 12 22.1429 12H20V21C20 21.5523 19.5523 22 19 22H18C17.4477 22 17 21.5523 17 21V20ZM5 5V14H19V5H5ZM5 16V18H19V16H5Z"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
};
interface MapUpdaterProps {
  center: [number, number];
  zoom: number;
}
function MapUpdater({ center, zoom }: MapUpdaterProps) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}
interface BusMapProps {
  buses: Bus[];
  selectedBus?: Bus | null;
}
export function BusMap({ buses, selectedBus }: BusMapProps) {
  const center: [number, number] = selectedBus ?
  [selectedBus.currentLocation.lat, selectedBus.currentLocation.lng] :
  [6.9271, 79.8612]; // Colombo, Sri Lanka
  const zoom = selectedBus ? 14 : 12;
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.95
      }}
      animate={{
        opacity: 1,
        scale: 1
      }}
      transition={{
        duration: 0.3
      }}
      className="w-full h-full rounded-xl overflow-hidden shadow-lg">

      <MapContainer
        center={center}
        zoom={zoom}
        style={{
          height: '100%',
          width: '100%'
        }}
        zoomControl={true}>

        <MapUpdater center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />


        {buses.map((bus) =>
        <Marker
          key={bus.id}
          position={[bus.currentLocation.lat, bus.currentLocation.lng]}
          icon={createBusIcon(bus.status)}>

            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg mb-1">Bus {bus.number}</h3>
                <p className="text-sm text-gray-600 mb-2">{bus.route}</p>
                <div className="flex items-center gap-2">
                  <span
                  className={`px-2 py-1 rounded text-xs font-medium ${bus.status === 'on-time' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>

                    {bus.status === 'on-time' ? 'On Time' : 'Delayed'}
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }
      `}</style>
    </motion.div>);

}