'use client'
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { motion } from 'framer-motion';
import { Bus } from '../utils/mockData';
import { getRoute } from '../utils/mapbox.directions';
import { useTheme } from '../contexts/ThemeContext';

const POPUP_STYLE_ID = 'busmap-popup-styles';
if (typeof document !== 'undefined' && !document.getElementById(POPUP_STYLE_ID)) {
    const s = document.createElement('style');
    s.id = POPUP_STYLE_ID;
    s.textContent = `
        /* Strip every possible Mapbox shell style */
        .mapboxgl-popup-content,
        .mapboxgl-popup-content * {
            box-sizing: border-box;
        }
        .mapboxgl-popup-content {
            all: unset !important;
            display: block !important;
            background: transparent !important;
            padding: 0 !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            border: none !important;
            outline: none !important;
        }
        /* Kill the default tip — we draw our own inside the card */
        .mapboxgl-popup-tip { display: none !important; }

        /* Arrow for hover popup — downward pointing, same dark colour */
        .bm-hover-popup .mapboxgl-popup-content::after {
            content: '';
            display: block;
            position: absolute;
            bottom: -8px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 9px solid transparent;
            border-right: 9px solid transparent;
            border-top: 9px solid #0f172a;
            pointer-events: none;
        }

        .mapboxgl-popup-close-button {
            color: rgba(255,255,255,0.4) !important;
            font-size: 17px !important;
            top: 10px !important;
            right: 12px !important;
            background: transparent !important;
            border: none !important;
            outline: none !important;
            z-index: 10 !important;
            line-height: 1 !important;
        }
        .mapboxgl-popup-close-button:hover {
            color: #fff !important;
            background: transparent !important;
        }
    `;
    document.head.appendChild(s);
}

//Dark wrapper
const CARD = (inner: string, minWidth = 185, dark = true) => `
    <div style="
        background:${dark ? '#0f172a' : '#ffffff'};
        border-radius:14px;
        padding:16px 18px;
        min-width:${minWidth}px;
        box-shadow:0 24px 64px rgba(0,0,0,${dark ? '0.65' : '0.12'}),0 4px 16px rgba(0,0,0,${dark ? '0.4' : '0.08'});
        font-family:'Segoe UI',system-ui,sans-serif;
        color:${dark ? '#f8fafc' : '#0f172a'};
        border:${dark ? 'none' : '1px solid rgba(0,0,0,0.08)'};
    ">${inner}</div>`;

const SVG = {
    originDot: `<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <circle cx="6" cy="6" r="5.5" stroke="#fff" stroke-width="1.5"/>
        <circle cx="6" cy="6" r="2.5" fill="#fff"/>
    </svg>`,

    destPin: `<svg width="11" height="14" viewBox="0 0 11 14" fill="none">
        <path d="M5.5 0C2.462 0 0 2.462 0 5.5C0 9.125 5.5 14 5.5 14S11 9.125 11 5.5C11 2.462 8.538 0 5.5 0Z" fill="#fff"/>
        <circle cx="5.5" cy="5.5" r="2.2" fill="#0f172a"/>
    </svg>`,

    pinW: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z"
              stroke="rgba(255,255,255,0.45)" stroke-width="1.8"/>
        <circle cx="12" cy="9" r="3" stroke="rgba(255,255,255,0.45)" stroke-width="1.8"/>
    </svg>`,

    routeIcon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M5 20V4M5 4l4 4M5 4 1 8" stroke="rgba(255,255,255,0.4)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M19 4v16M19 20l-4-4M19 20l4-4" stroke="rgba(255,255,255,0.4)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M5 12h14" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" stroke-dasharray="3 3"/>
    </svg>`,

    busW: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="5" width="20" height="13" rx="2.5" stroke="#fff" stroke-width="1.8"/>
        <path d="M2 10h20" stroke="#fff" stroke-width="1.8"/>
        <circle cx="7"  cy="18" r="1.8" fill="#fff"/>
        <circle cx="17" cy="18" r="1.8" fill="#fff"/>
        <path d="M7 7h4M13 7h4" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/>
    </svg>`,

    check: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#22c55e" stroke-width="1.8"/>
        <path d="M8 12l3 3 5-5" stroke="#22c55e" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,

    warn: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none">
        <path d="M12 3L2 21h20L12 3Z" stroke="#ef4444" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M12 10v4M12 17v.5" stroke="#ef4444" stroke-width="1.8" stroke-linecap="round"/>
    </svg>`,
};

function createOriginMarker(label: string): HTMLElement {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;cursor:pointer;user-select:none;';
    wrap.innerHTML = `
        <div style="background:#0f172a;color:#fff;font-family:'Segoe UI',system-ui,sans-serif;
            font-size:11px;font-weight:700;letter-spacing:0.06em;padding:4px 13px;
            border-radius:100px;margin-bottom:9px;white-space:nowrap;
            box-shadow:0 4px 14px rgba(0,0,0,0.4);">${label}</div>
        <svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"
             style="filter:drop-shadow(0 4px 10px rgba(0,0,0,0.45))">
            <circle cx="13" cy="13" r="13" fill="#0f172a"/>
            <circle cx="13" cy="13" r="8"  fill="#fff"/>
            <circle cx="13" cy="13" r="4.5" fill="#0f172a"/>
        </svg>
        <div style="width:2px;height:13px;background:#0f172a;border-radius:2px;margin-top:2px;opacity:0.55;"></div>
        <div style="width:8px;height:3px;background:#0f172a;border-radius:100px;opacity:0.12;"></div>
    `;
    return wrap;
}

function createDestinationMarker(label: string): HTMLElement {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;cursor:pointer;user-select:none;';
    wrap.innerHTML = `
        <div style="background:#0f172a;color:#fff;font-family:'Segoe UI',system-ui,sans-serif;
            font-size:11px;font-weight:700;letter-spacing:0.06em;padding:4px 13px;
            border-radius:100px;margin-bottom:9px;white-space:nowrap;
            box-shadow:0 4px 14px rgba(0,0,0,0.4);">${label}</div>
        <svg width="32" height="42" viewBox="0 0 32 42" xmlns="http://www.w3.org/2000/svg"
             style="filter:drop-shadow(0 6px 14px rgba(0,0,0,0.5))">
            <ellipse cx="16" cy="41" rx="8" ry="2.5" fill="#000" opacity="0.12"/>
            <path d="M16 1C8.268 1 2 7.268 2 15C2 25 16 40 16 40C16 40 30 25 30 15C30 7.268 23.732 1 16 1Z"
                  fill="#0f172a"/>
            <circle cx="16" cy="15" r="8" fill="#fff"/>
            <circle cx="16" cy="15" r="4" fill="#0f172a"/>
        </svg>
    `;
    return wrap;
}

function createBusMarkerEl(status: string, number: string): HTMLElement {
    const el = document.createElement('div');
    const dot = status === 'on-time' ? '#22c55e' : '#ef4444';
    el.style.cssText = 'display:block;cursor:pointer;position:relative;';
    el.innerHTML = `
        <div class="bus-inner" style="
            width:46px;height:46px;background:#0f172a;border-radius:50%;
            border:3px solid #fff;box-shadow:0 6px 18px rgba(0,0,0,0.35);
            display:flex;align-items:center;justify-content:center;
            transition:transform 0.15s cubic-bezier(.34,1.56,.64,1);position:relative;">
            ${SVG.busW}
            <div style="position:absolute;top:-2px;right:-2px;width:13px;height:13px;
                background:${dot};border-radius:50%;border:2.5px solid #fff;
                box-shadow:0 1px 5px rgba(0,0,0,0.25);"></div>
        </div>
        <div style="position:absolute;bottom:-20px;left:50%;transform:translateX(-50%);
            background:#0f172a;color:#fff;font-family:'Segoe UI',system-ui,sans-serif;
            font-size:9px;font-weight:800;letter-spacing:0.07em;padding:2px 8px;
            border-radius:100px;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.25);">${number}</div>
    `;
    const inner = el.querySelector('.bus-inner') as HTMLElement;
    el.addEventListener('mouseenter', () => { inner.style.transform = 'scale(1.12)'; });
    el.addEventListener('mouseleave', () => { inner.style.transform = 'scale(1)'; });
    return el;
}

function buildRouteHoverPopup(from: string, to: string, busNumbers: string): string {
    return CARD(`
        <div style="display:flex;align-items:center;gap:8px;
                    padding-bottom:11px;margin-bottom:12px;
                    border-bottom:1px solid rgba(255,255,255,0.07);">
            ${SVG.routeIcon}
            <span style="font-size:10px;font-weight:700;color:rgba(255,255,255,0.35);
                         letter-spacing:0.1em;text-transform:uppercase;">Route Overview</span>
        </div>

        <div style="display:flex;align-items:center;gap:10px;margin-bottom:5px;">
            <div style="width:26px;height:26px;flex-shrink:0;background:rgba(255,255,255,0.06);
                        border-radius:50%;display:flex;align-items:center;justify-content:center;">
                ${SVG.originDot}
            </div>
            <div>
                <div style="font-size:9px;color:rgba(255,255,255,0.3);letter-spacing:0.09em;
                             text-transform:uppercase;margin-bottom:2px;">Pickup</div>
                <div style="font-size:13px;font-weight:700;color:#f8fafc;">${from}</div>
            </div>
        </div>

        <div style="margin-left:12px;border-left:1.5px dashed rgba(255,255,255,0.1);
                    height:18px;margin-bottom:5px;"></div>

        <div style="display:flex;align-items:center;gap:10px;margin-bottom:${busNumbers ? '14' : '0'}px;">
            <div style="width:26px;height:26px;flex-shrink:0;background:rgba(255,255,255,0.06);
                        border-radius:50%;display:flex;align-items:center;justify-content:center;">
                ${SVG.destPin}
            </div>
            <div>
                <div style="font-size:9px;color:rgba(255,255,255,0.3);letter-spacing:0.09em;
                             text-transform:uppercase;margin-bottom:2px;">Destination</div>
                <div style="font-size:13px;font-weight:700;color:#f8fafc;">${to}</div>
            </div>
        </div>

        ${busNumbers ? `
        <div style="display:flex;align-items:center;gap:8px;
                    background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);
                    border-radius:10px;padding:8px 12px;">
            ${SVG.busW}
            <span style="font-size:11px;font-weight:700;color:rgba(255,255,255,0.8);">${busNumbers}</span>
        </div>` : ''}
    `, 215);
}
function buildEndpointPopup(type: 'pickup' | 'destination', label: string): string {
    return CARD(`
        <div style="display:flex;align-items:center;gap:7px;margin-bottom:7px;">
            ${SVG.pinW}
            <span style="font-size:10px;font-weight:700;color:rgba(255,255,255,0.32);
                         letter-spacing:0.08em;text-transform:uppercase;">
                ${type === 'pickup' ? 'Pickup Point' : 'Destination'}
            </span>
        </div>
        <div style="font-size:14px;font-weight:700;color:#f8fafc;">${label}</div>
    `, 165);
}
function buildBusPopup(bus: Bus): string {
    const isOnTime = bus.status === 'on-time';
    return CARD(`
        <div style="display:flex;align-items:center;gap:10px;
                    padding-bottom:11px;margin-bottom:11px;
                    border-bottom:1px solid rgba(255,255,255,0.07);">
            <div style="width:36px;height:36px;flex-shrink:0;
                        background:rgba(255,255,255,0.06);border-radius:10px;
                        display:flex;align-items:center;justify-content:center;">
                ${SVG.busW}
            </div>
            <div>
                <div style="font-size:9px;color:rgba(255,255,255,0.32);letter-spacing:0.09em;
                             text-transform:uppercase;margin-bottom:2px;">Bus Number</div>
                <div style="font-size:17px;font-weight:800;color:#f8fafc;letter-spacing:0.01em;">${bus.number}</div>
            </div>
        </div>

        <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);
                    border-radius:10px;padding:10px 12px;margin-bottom:11px;">
            <div style="display:flex;align-items:center;gap:7px;margin-bottom:4px;">
                ${SVG.pinW}
                <span style="font-size:12px;color:rgba(255,255,255,0.65);font-weight:500;">${bus.startDestination}</span>
            </div>
            <div style="margin-left:6px;border-left:1.5px dashed rgba(255,255,255,0.1);
                        height:10px;margin-bottom:4px;"></div>
            <div style="display:flex;align-items:center;gap:7px;">
                ${SVG.pinW}
                <span style="font-size:12px;color:rgba(255,255,255,0.65);font-weight:500;">${bus.endDestination}</span>
            </div>
        </div>

        <div style="display:flex;align-items:center;gap:7px;">
            ${isOnTime ? SVG.check : SVG.warn}
            <span style="font-size:12px;font-weight:700;color:${isOnTime ? '#22c55e' : '#ef4444'};">
                ${isOnTime ? 'On Time' : 'Delayed'}
            </span>
        </div>
    `);
}
const routeMarkersRef: { current: mapboxgl.Marker[] } = { current: [] };
// Store hover handlers so we can remove them before re-adding on redraw
const hoverHandlers: {
    enter?: (e: mapboxgl.MapMouseEvent) => void;
    move?:  (e: mapboxgl.MapMouseEvent) => void;
    leave?: () => void;
} = {};

interface BusMapProps {
    buses: Bus[];
    selectedBus?: Bus | null;
    startCoords?: [number, number];
    endCoords?: [number, number];
    startLabel?: string;
    endLabel?: string;
}
export function BusMap({ buses, selectedBus, startCoords, endCoords, startLabel, endLabel }: BusMapProps) {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const mapRef       = useRef<mapboxgl.Map | null>(null);
    const markersRef = useRef<mapboxgl.Marker[]>([]);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const center: [number, number] = selectedBus
        ? [selectedBus.currentLocation.lng, selectedBus.currentLocation.lat]
        : [79.8612, 6.9271];

    // ── Init map
    useEffect(() => {
        if (!mapContainer.current || mapRef.current) return;
        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN!;
        mapRef.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/dark-v11',
            center,
            zoom: selectedBus ? 14 : 12,
        });
        mapRef.current.on('load', () => mapRef.current?.resize());
        return () => { mapRef.current?.remove(); mapRef.current = null; };
    }, []);

    // ── Bus markers
    useEffect(() => {
        if (!mapRef.current) return;
        markersRef.current.forEach(m => m.remove());
        markersRef.current = [];

        buses.forEach(bus => {
            const el = createBusMarkerEl(bus.status, bus.number);
            const popup = new mapboxgl.Popup({ offset: 38, maxWidth: 'none' })
                .setHTML(buildBusPopup(bus));
            const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
                .setLngLat([bus.currentLocation.lng, bus.currentLocation.lat])
                .setPopup(popup)
                .addTo(mapRef.current!);
            markersRef.current.push(marker);
        });
    }, [buses]);

    // ── Route + markers
    useEffect(() => {
        const map = mapRef.current;
        if (!map || !startCoords || !endCoords) return;

        const drawRoute = async () => {
            if (!map.isStyleLoaded()) {
                await new Promise<void>(res => map.once('load', res));
            }
            try {
                const geometry = await getRoute(startCoords, endCoords);

                ['route-line-dash', 'route-line', 'route-line-casing', 'route-line-glow'].forEach(id => {
                    if (map.getLayer(id)) map.removeLayer(id);
                });
                if (map.getSource('route')) map.removeSource('route');
                routeMarkersRef.current.forEach(m => m.remove());
                routeMarkersRef.current = [];

                map.addSource('route', {
                    type: 'geojson',
                    data: { type: 'Feature', geometry, properties: {} },
                });

                // Soft green halo
                map.addLayer({
                    id: 'route-line-glow',
                    type: 'line',
                    source: 'route',
                    layout: { 'line-join': 'round', 'line-cap': 'round' },
                    paint: { 'line-color': '#22c55e', 'line-width': 22, 'line-opacity': 0.14 },
                });
                // Dark casing
                map.addLayer({
                    id: 'route-line-casing',
                    type: 'line',
                    source: 'route',
                    layout: { 'line-join': 'round', 'line-cap': 'round' },
                    paint: { 'line-color': '#052e16', 'line-width': 11, 'line-opacity': 1 },
                });
                // Green main line
                map.addLayer({
                    id: 'route-line',
                    type: 'line',
                    source: 'route',
                    layout: { 'line-join': 'round', 'line-cap': 'round' },
                    paint: { 'line-color': '#22c55e', 'line-width': 6, 'line-opacity': 1 },
                });
                // White direction dashes
                map.addLayer({
                    id: 'route-line-dash',
                    type: 'line',
                    source: 'route',
                    layout: { 'line-join': 'round', 'line-cap': 'round' },
                    paint: {
                        'line-color': '#fff',
                        'line-width': 1.5,
                        'line-opacity': 0.35,
                        'line-dasharray': [2, 10],
                    },
                });

                const fromLabel  = startLabel || 'Start';
                const toLabel    = endLabel   || 'End';
                const busNumbers = buses.map(b => `Bus ${b.number}`).join(', ');

                // Origin
                const startEl = createOriginMarker(fromLabel);
                const startMarker = new mapboxgl.Marker({ element: startEl, anchor: 'bottom' })
                    .setLngLat(startCoords)
                    .setPopup(new mapboxgl.Popup({ offset: 18, maxWidth: 'none' })
                        .setHTML(buildEndpointPopup('pickup', fromLabel)))
                    .addTo(map);

                // Destination
                const endEl = createDestinationMarker(toLabel);
                const endMarker = new mapboxgl.Marker({ element: endEl, anchor: 'bottom' })
                    .setLngLat(endCoords)
                    .setPopup(new mapboxgl.Popup({ offset: 18, maxWidth: 'none' })
                        .setHTML(buildEndpointPopup('destination', toLabel)))
                    .addTo(map);

                routeMarkersRef.current.push(startMarker, endMarker);

                // Hover popup — remove any previous listeners first to prevent stacking
                const hoverPopup = new mapboxgl.Popup({
                    closeButton: false,
                    closeOnClick: false,
                    offset: 14,
                    maxWidth: 'none',
                    className: 'bm-hover-popup',
                });

                // Tear down previous handlers
                if (hoverHandlers.enter) map.off('mouseenter', 'route-line', hoverHandlers.enter);
                if (hoverHandlers.move)  map.off('mousemove',  'route-line', hoverHandlers.move);
                if (hoverHandlers.leave) map.off('mouseleave', 'route-line', hoverHandlers.leave);

                hoverHandlers.enter = (e) => {
                    map.getCanvas().style.cursor = 'pointer';
                    // Remove any existing instance before showing a new one
                    hoverPopup.remove();
                    hoverPopup
                        .setLngLat(e.lngLat)
                        .setHTML(buildRouteHoverPopup(fromLabel, toLabel, busNumbers))
                        .addTo(map);
                };
                hoverHandlers.move  = (e) => { hoverPopup.setLngLat(e.lngLat); };
                hoverHandlers.leave = () => {
                    map.getCanvas().style.cursor = '';
                    hoverPopup.remove();
                };

                map.on('mouseenter', 'route-line', hoverHandlers.enter);
                map.on('mousemove',  'route-line', hoverHandlers.move);
                map.on('mouseleave', 'route-line', hoverHandlers.leave);

                // Fit bounds
                const coords = geometry.coordinates as [number, number][];
                const bounds = coords.reduce(
                    (b, c) => b.extend(c),
                    new mapboxgl.LngLatBounds(coords[0], coords[0])
                );
                map.fitBounds(bounds, { padding: 90, maxZoom: 14, duration: 900 });

            } catch (err) {
                console.error('Error drawing route:', err);
            }
        };

        drawRoute();
    }, [startCoords, endCoords, buses, startLabel, endLabel]);

    return (
        <motion.div
            ref={mapContainer}
            className="w-full h-full rounded-2xl overflow-hidden"
            style={{ minHeight: '500px' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
        />
    );
}
