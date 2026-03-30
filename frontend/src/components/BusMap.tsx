'use client'
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Bus } from '../utils/mockData';
import { getRoute } from '../utils/mapbox.directions.ts';
import { useTheme } from '../contexts/ThemeContext';

// ─── SVG strings ──────────────────────────────────────────────────────────────
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

const CARD = (inner: string, minWidth = 185, dark = true) => `
    <div style="
        background:${dark ? '#0f172a' : '#ffffff'};
        border-radius:14px;padding:16px 18px;min-width:${minWidth}px;
        box-shadow:0 24px 64px rgba(0,0,0,${dark ? '0.65' : '0.12'}),0 4px 16px rgba(0,0,0,${dark ? '0.4' : '0.08'});
        font-family:'Segoe UI',system-ui,sans-serif;color:${dark ? '#f8fafc' : '#0f172a'};
        border:${dark ? 'none' : '1px solid rgba(0,0,0,0.08)'};
    ">${inner}</div>`;

function buildBusPopup(bus: Bus, dark = true) {
    const isOnTime = bus.status === 'on-time';
    return CARD(`
        <div style="display:flex;align-items:center;gap:10px;padding-bottom:11px;margin-bottom:11px;border-bottom:1px solid rgba(255,255,255,0.07);">
            <div style="width:36px;height:36px;flex-shrink:0;background:rgba(255,255,255,0.06);border-radius:10px;display:flex;align-items:center;justify-content:center;">${SVG.busW}</div>
            <div>
                <div style="font-size:9px;color:rgba(255,255,255,0.32);letter-spacing:0.09em;text-transform:uppercase;margin-bottom:2px;">Bus Number</div>
                <div style="font-size:17px;font-weight:800;color:#f8fafc;">${bus.number}</div>
            </div>
        </div>
        <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:10px 12px;margin-bottom:11px;">
            <div style="display:flex;align-items:center;gap:7px;margin-bottom:4px;">${SVG.pinW}<span style="font-size:12px;color:rgba(255,255,255,0.65);font-weight:500;">${bus.startDestination}</span></div>
            <div style="margin-left:6px;border-left:1.5px dashed rgba(255,255,255,0.1);height:10px;margin-bottom:4px;"></div>
            <div style="display:flex;align-items:center;gap:7px;">${SVG.pinW}<span style="font-size:12px;color:rgba(255,255,255,0.65);font-weight:500;">${bus.endDestination}</span></div>
        </div>
        <div style="display:flex;align-items:center;gap:7px;">
            ${isOnTime ? SVG.check : SVG.warn}
            <span style="font-size:12px;font-weight:700;color:${isOnTime ? '#22c55e' : '#ef4444'};">${isOnTime ? 'On Time' : 'Delayed'}</span>
        </div>
    `, 185, dark);
}

function buildEndpointPopup(type: 'pickup' | 'destination', label: string, dark = true) {
    return CARD(`
        <div style="display:flex;align-items:center;gap:7px;margin-bottom:7px;">${SVG.pinW}
            <span style="font-size:10px;font-weight:700;color:rgba(255,255,255,0.32);letter-spacing:0.08em;text-transform:uppercase;">${type === 'pickup' ? 'Pickup Point' : 'Destination'}</span>
        </div>
        <div style="font-size:14px;font-weight:700;color:#f8fafc;">${label}</div>
    `, 165, dark);
}

function buildRouteHoverPopup(from: string, to: string, busNumbers: string, dark = true) {
    return CARD(`
        <div style="display:flex;align-items:center;gap:8px;padding-bottom:11px;margin-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.07);">
            ${SVG.routeIcon}
            <span style="font-size:10px;font-weight:700;color:rgba(255,255,255,0.35);letter-spacing:0.1em;text-transform:uppercase;">Route Overview</span>
        </div>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:5px;">
            <div style="width:26px;height:26px;flex-shrink:0;background:rgba(255,255,255,0.06);border-radius:50%;display:flex;align-items:center;justify-content:center;">${SVG.originDot}</div>
            <div>
                <div style="font-size:9px;color:rgba(255,255,255,0.3);letter-spacing:0.09em;text-transform:uppercase;margin-bottom:2px;">Pickup</div>
                <div style="font-size:13px;font-weight:700;color:#f8fafc;">${from}</div>
            </div>
        </div>
        <div style="margin-left:12px;border-left:1.5px dashed rgba(255,255,255,0.1);height:18px;margin-bottom:5px;"></div>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:${busNumbers ? '14' : '0'}px;">
            <div style="width:26px;height:26px;flex-shrink:0;background:rgba(255,255,255,0.06);border-radius:50%;display:flex;align-items:center;justify-content:center;">${SVG.destPin}</div>
            <div>
                <div style="font-size:9px;color:rgba(255,255,255,0.3);letter-spacing:0.09em;text-transform:uppercase;margin-bottom:2px;">Destination</div>
                <div style="font-size:13px;font-weight:700;color:#f8fafc;">${to}</div>
            </div>
        </div>
        ${busNumbers ? `<div style="display:flex;align-items:center;gap:8px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:8px 12px;">${SVG.busW}<span style="font-size:11px;font-weight:700;color:rgba(255,255,255,0.8);">${busNumbers}</span></div>` : ''}
    `, 215, dark);
}

function createOriginMarkerEl(label: string): HTMLElement {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;cursor:pointer;user-select:none;';
    wrap.innerHTML = `
        <div style="background:#0f172a;color:#fff;font-family:'Segoe UI',system-ui,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.06em;padding:4px 13px;border-radius:100px;margin-bottom:9px;white-space:nowrap;box-shadow:0 4px 14px rgba(0,0,0,0.4);">${label}</div>
        <svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 4px 10px rgba(0,0,0,0.45))">
            <circle cx="13" cy="13" r="13" fill="#0f172a"/><circle cx="13" cy="13" r="8" fill="#fff"/><circle cx="13" cy="13" r="4.5" fill="#0f172a"/>
        </svg>
        <div style="width:2px;height:13px;background:#0f172a;border-radius:2px;margin-top:2px;opacity:0.55;"></div>
        <div style="width:8px;height:3px;background:#0f172a;border-radius:100px;opacity:0.12;"></div>`;
    return wrap;
}

function createDestinationMarkerEl(label: string): HTMLElement {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;cursor:pointer;user-select:none;';
    wrap.innerHTML = `
        <div style="background:#0f172a;color:#fff;font-family:'Segoe UI',system-ui,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.06em;padding:4px 13px;border-radius:100px;margin-bottom:9px;white-space:nowrap;box-shadow:0 4px 14px rgba(0,0,0,0.4);">${label}</div>
        <svg width="32" height="42" viewBox="0 0 32 42" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 6px 14px rgba(0,0,0,0.5))">
            <ellipse cx="16" cy="41" rx="8" ry="2.5" fill="#000" opacity="0.12"/>
            <path d="M16 1C8.268 1 2 7.268 2 15C2 25 16 40 16 40C16 40 30 25 30 15C30 7.268 23.732 1 16 1Z" fill="#0f172a"/>
            <circle cx="16" cy="15" r="8" fill="#fff"/><circle cx="16" cy="15" r="4" fill="#0f172a"/>
        </svg>`;
    return wrap;
}

function createBusMarkerEl(status: string, number: string): HTMLElement {
    const el = document.createElement('div');
    const dot = status === 'on-time' ? '#22c55e' : '#ef4444';
    el.style.cssText = 'display:block;cursor:pointer;position:relative;';
    el.innerHTML = `
        <div class="bus-inner" style="width:46px;height:46px;background:#0f172a;border-radius:50%;border:3px solid #fff;box-shadow:0 6px 18px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;transition:transform 0.15s cubic-bezier(.34,1.56,.64,1);position:relative;">
            ${SVG.busW}
            <div style="position:absolute;top:-2px;right:-2px;width:13px;height:13px;background:${dot};border-radius:50%;border:2.5px solid #fff;"></div>
        </div>
        <div style="position:absolute;bottom:-20px;left:50%;transform:translateX(-50%);background:#0f172a;color:#fff;font-family:'Segoe UI',system-ui,sans-serif;font-size:9px;font-weight:800;letter-spacing:0.07em;padding:2px 8px;border-radius:100px;white-space:nowrap;">${number}</div>`;
    const inner = el.querySelector('.bus-inner') as HTMLElement;
    el.addEventListener('mouseenter', () => { inner.style.transform = 'scale(1.12)'; });
    el.addEventListener('mouseleave', () => { inner.style.transform = 'scale(1)'; });
    return el;
}

// ─── Google Maps styles ───────────────────────────────────────────────────────
const DARK_STYLE: google.maps.MapTypeStyle[] = [
    { elementType: 'geometry', stylers: [{ color: '#0f172a' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#0f172a' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#64748b' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#0f172a' }] },
    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#334155' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0c1522' }] },
    { featureType: 'poi', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit', stylers: [{ visibility: 'off' }] },
];
const LIGHT_STYLE: google.maps.MapTypeStyle[] = [
    { featureType: 'poi', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit', stylers: [{ visibility: 'off' }] },
];

// ─── Load Google Maps using the new importLibrary API ────────────────────────
let mapsApiPromise: Promise<void> | null = null;

function loadGoogleMaps(): Promise<void> {
    if (mapsApiPromise) return mapsApiPromise;

    mapsApiPromise = new Promise<void>((resolve, reject) => {
        // Check if already loaded
        if (typeof google !== 'undefined' && google.maps && google.maps.Map) {
            resolve();
            return;
        }

        const key = import.meta.env.VITE_GOOGLE_MAPS_KEY!;
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=maps,marker,places&callback=initMaps`;
        script.async = true;
        script.defer = true;

        // Global callback function
        (window as any).initMaps = () => {
            delete (window as any).initMaps;
            resolve();
        };

        script.onerror = () => {
            delete (window as any).initMaps;
            reject(new Error('Failed to load Google Maps script'));
        };

        document.head.appendChild(script);
    });

    return mapsApiPromise;
}


// Module-level overlay/polyline refs
const routeOverlaysRef: { current: Array<google.maps.Marker | google.maps.Polyline | google.maps.OverlayView> } = { current: [] };
const hoverInfoRef: { current: google.maps.InfoWindow | null } = { current: null };

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
    const mapRef = useRef<google.maps.Map | null>(null);
    const busMarkersRef = useRef<Array<google.maps.Marker | google.maps.OverlayView>>([]);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const centerLatLng = React.useMemo(() => {
        // If we have route coordinates, center on the route
        if (startCoords && endCoords) {
            return {
                lat: (startCoords[1] + endCoords[1]) / 2,
                lng: (startCoords[0] + endCoords[0]) / 2
            };
        }
        // Otherwise center on selected bus
        if (selectedBus) {
            return {
                lat: selectedBus.currentLocation.lat,
                lng: selectedBus.currentLocation.lng
            };
        }
        // Default to Colombo
        return { lat: 6.9271, lng: 79.8612 };
    }, [selectedBus, startCoords, endCoords]);

// Update map center when it changes
    useEffect(() => {
        if (mapRef.current && centerLatLng) {
            mapRef.current.setCenter(centerLatLng);
        }
    }, [centerLatLng]);


    // ── Init map
    useEffect(() => {
        if (!mapContainer.current || mapRef.current) return;

        loadGoogleMaps().then(() => {
            if (!mapContainer.current || mapRef.current) return;

            const map = new google.maps.Map(mapContainer.current, {
                center: centerLatLng,
                zoom: selectedBus ? 14 : 12,
                styles: isDark ? DARK_STYLE : LIGHT_STYLE,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
            });

            mapRef.current = map;

        }).catch(err => console.error('Google Maps load error:', err));

        return () => {
            if (mapRef.current) {
                routeOverlaysRef.current.forEach(o => {
                    if ('setMap' in o) o.setMap(null);
                });
                routeOverlaysRef.current = [];
                busMarkersRef.current.forEach(m => {
                    if ('setMap' in m) m.setMap(null);
                });
                busMarkersRef.current = [];
                mapRef.current = null;
            }
        };
    }, []); // Remove dependencies to prevent re-initialization

    // ── Theme switch
    useEffect(() => {
        if (!mapRef.current) return;
        mapRef.current.setOptions({ styles: isDark ? DARK_STYLE : LIGHT_STYLE });
    }, [isDark]);

    // ── Bus markers
    useEffect(() => {
        if (!mapRef.current) return;
        busMarkersRef.current.forEach(m => { if ('setMap' in m) m.setMap(null); });
        busMarkersRef.current = [];

        buses.forEach(bus => {
            const el = createBusMarkerEl(bus.status, bus.number);
            const iw = new google.maps.InfoWindow({ content: buildBusPopup(bus, isDark) });

            const overlay = new google.maps.OverlayView();
            overlay.onAdd = function () {
                this.getPanes()!.overlayMouseTarget.appendChild(el);
            };
            overlay.draw = function () {
                const proj = this.getProjection();
                const pt = proj.fromLatLngToDivPixel(
                    new google.maps.LatLng(bus.currentLocation.lat, bus.currentLocation.lng)
                )!;
                el.style.position = 'absolute';
                el.style.left = `${pt.x - 23}px`;
                el.style.top = `${pt.y - 23}px`;
            };
            overlay.onRemove = function () { el.parentNode?.removeChild(el); };
            overlay.setMap(mapRef.current);

            // Anchor marker (invisible) for InfoWindow positioning
            const anchor = new google.maps.Marker({
                position: { lat: bus.currentLocation.lat, lng: bus.currentLocation.lng },
                map: mapRef.current!,
                opacity: 0,
            });

            el.addEventListener('click', () => iw.open({ map: mapRef.current!, anchor }));
            busMarkersRef.current.push(overlay, anchor);
        });
    }, [buses, isDark]);

    // ── Route polyline + endpoint markers
    useEffect(() => {
        const map = mapRef.current;
        console.log('Route useEffect triggered:', {
            map: !!map,
            startCoords,
            endCoords,
            buses: buses.length,
            startLabel,
            endLabel
        });

        if (!map || !startCoords || !endCoords) {
            console.log('Missing map or coordinates, skipping route drawing');
            return;
        }

        const drawRoute = async () => {
            console.log('Starting to draw route...');

            // Clear existing overlays
            routeOverlaysRef.current.forEach(o => {
                if ('setMap' in o) o.setMap(null);
            });
            routeOverlaysRef.current = [];
            if (hoverInfoRef.current) hoverInfoRef.current.close();

            try {
                const geometry = await getRoute(startCoords, endCoords);
                console.log('Got route geometry:', geometry);

                const path = (geometry.coordinates as [number, number][]).map(([lng, lat]) => ({ lat, lng }));
                console.log('Path points:', path.length);

                if (path.length < 2) {
                    throw new Error('Invalid path: less than 2 points');
                }

                // Draw polylines
                const glow = new google.maps.Polyline({ path, map, strokeColor: '#22c55e', strokeOpacity: 0.14, strokeWeight: 22 });
                const casing = new google.maps.Polyline({ path, map, strokeColor: '#052e16', strokeOpacity: 1, strokeWeight: 11 });
                const main = new google.maps.Polyline({
                    path, map,
                    strokeColor: '#22c55e', strokeOpacity: 1, strokeWeight: 6,
                    icons: [{ icon: { path: 'M 0,-1 0,1', strokeOpacity: 0.35, scale: 2 }, offset: '0', repeat: '20px' }],
                });

                routeOverlaysRef.current.push(glow, casing, main);

                const fromLabel = startLabel || 'Start';
                const toLabel = endLabel || 'End';
                const busNumbers = buses.map(b => `Bus ${b.number}`).join(', ');

                // Add hover info
                hoverInfoRef.current = new google.maps.InfoWindow({ disableAutoPan: true });
                const showHover = (e: google.maps.PolyMouseEvent) => {
                    hoverInfoRef.current!.setContent(buildRouteHoverPopup(fromLabel, toLabel, busNumbers, isDark));
                    hoverInfoRef.current!.setPosition(e.latLng);
                    hoverInfoRef.current!.open(map);
                };
                main.addListener('mouseover', showHover);
                main.addListener('mousemove', showHover);
                main.addListener('mouseout', () => hoverInfoRef.current?.close());

                // Origin overlay
                const startEl = createOriginMarkerEl(fromLabel);
                const startAnchor = new google.maps.Marker({ position: { lat: startCoords[1], lng: startCoords[0] }, map, opacity: 0 });
                const startIW = new google.maps.InfoWindow({ content: buildEndpointPopup('pickup', fromLabel, isDark) });
                const startOv = makeCustomOverlay(startEl, new google.maps.LatLng(startCoords[1], startCoords[0]), map);
                startEl.addEventListener('click', () => startIW.open({ map, anchor: startAnchor }));

                // Destination overlay
                const endEl = createDestinationMarkerEl(toLabel);
                const endAnchor = new google.maps.Marker({ position: { lat: endCoords[1], lng: endCoords[0] }, map, opacity: 0 });
                const endIW = new google.maps.InfoWindow({ content: buildEndpointPopup('destination', toLabel, isDark) });
                const endOv = makeCustomOverlay(endEl, new google.maps.LatLng(endCoords[1], endCoords[0]), map);
                endEl.addEventListener('click', () => endIW.open({ map, anchor: endAnchor }));

                routeOverlaysRef.current.push(startOv, startAnchor, endOv, endAnchor);

                // Fit bounds with padding
                const bounds = new google.maps.LatLngBounds();
                path.forEach(p => bounds.extend(p));
                map.fitBounds(bounds, { top: 100, right: 100, bottom: 100, left: 100 });

                console.log('Route drawn successfully');

            } catch (err) {
                console.error('Error drawing route:', err);

                // Show error message to user
                const errorEl = document.createElement('div');
                errorEl.style.cssText = 'position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: #ef4444; color: white; padding: 12px 24px; border-radius: 8px; z-index: 1000;';
                errorEl.textContent = 'Could not draw route - showing straight line';
                document.body.appendChild(errorEl);
                setTimeout(() => document.body.removeChild(errorEl), 3000);

                // Fallback: draw straight line if route API fails
                console.log('Drawing fallback straight line...');
                const path = [
                    { lat: startCoords[1], lng: startCoords[0] },
                    { lat: endCoords[1], lng: endCoords[0] }
                ];

                const fallbackLine = new google.maps.Polyline({
                    path,
                    map,
                    strokeColor: '#ff0000',
                    strokeWeight: 4,
                    strokeOpacity: 0.8
                });

                routeOverlaysRef.current.push(fallbackLine);

                // Fit bounds to fallback line
                const bounds = new google.maps.LatLngBounds();
                path.forEach(p => bounds.extend(p));
                map.fitBounds(bounds, { top: 100, right: 100, bottom: 100, left: 100 });
            }
        };

        // Use a timeout to ensure map is ready
        const timeoutId = setTimeout(drawRoute, 300);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [startCoords, endCoords, buses, startLabel, endLabel, isDark]);

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

function makeCustomOverlay(
    el: HTMLElement,
    position: google.maps.LatLng,
    map: google.maps.Map,
): google.maps.OverlayView {
    const ov = new google.maps.OverlayView();
    ov.onAdd = function () { this.getPanes()!.overlayMouseTarget.appendChild(el); };
    ov.draw = function () {
        const pt = this.getProjection().fromLatLngToDivPixel(position)!;
        el.style.position = 'absolute';
        el.style.left = `${pt.x - el.offsetWidth / 2}px`;
        el.style.top = `${pt.y - el.offsetHeight}px`;
    };
    ov.onRemove = function () { el.parentNode?.removeChild(el); };
    ov.setMap(map);
    return ov;
}
