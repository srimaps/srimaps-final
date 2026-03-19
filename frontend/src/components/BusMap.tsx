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
