'use client'
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { motion } from 'framer-motion';
import { Bus } from '../utils/mockData';
import { getRoute } from '../utils/mapbox.directions';

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
const CARD = (inner: string, minWidth = 185) => `
    <div style="
        background:#0f172a;
        border-radius:14px;
        padding:16px 18px;
        min-width:${minWidth}px;
        box-shadow:0 24px 64px rgba(0,0,0,0.65),0 4px 16px rgba(0,0,0,0.4);
        font-family:'Segoe UI',system-ui,sans-serif;
        color:#f8fafc;
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
