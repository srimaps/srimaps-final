//API
export async function getRoute(
    start: [number, number],
    end: [number, number]
): Promise<GeoJSON.LineString> {
    const token = import.meta.env.VITE_MAPBOX_TOKEN!;
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${token}`;

    const res  = await fetch(url);
    const data = await res.json();

    if (!data.routes || data.routes.length === 0) {
        throw new Error(`No route found between [${start}] and [${end}]`);
    }

    return data.routes[0].geometry;
}

// ─── Exact Sri Lankan bus stand coordinates [lng, lat] ────────────────────────
// Using verified GPS coordinates for each bus stand to avoid geocoding ambiguity.
export const BUS_STANDS: Record<string, [number, number]> = {
    'Kadawatha Bus Stand':      [79.9545, 7.0051],  // Kadawatha-Ganemulla Rd
    'Colombo Fort Bus Stand':   [79.8567, 6.9353],  // Colombo Central BS, Olcott Mawatha
    'Pettah Bus Stand':         [79.8574, 6.9350],  // Bastian Mawatha, Pettah
    'Moratuwa Bus Stand':       [79.8863, 6.7589],  // Angulana junction terminus
    'Dehiwala Bus Stand':       [79.8658, 6.8540],  // Galle Rd, Dehiwala
};

// ─── Bus route registry ───────────────────────────────────────────────────────
// 216 and 261 both serve the Kadawatha ↔ Colombo Fort corridor.
export const BUS_ROUTE_COORDS: Record<string, {
    from: string; to: string;
    fromCoords: [number, number]; toCoords: [number, number];
}> = {
    '216': { from: 'Kadawatha Bus Stand', to: 'Colombo Fort Bus Stand', fromCoords: [79.9545, 7.0051], toCoords: [79.8567, 6.9353] },
    '261': { from: 'Kadawatha Bus Stand', to: 'Colombo Fort Bus Stand', fromCoords: [79.9545, 7.0051], toCoords: [79.8567, 6.9353] },
    '100': { from: 'Moratuwa Bus Stand',  to: 'Dehiwala Bus Stand',     fromCoords: [79.8863, 6.7589], toCoords: [79.8658, 6.8540] },
    '101': { from: 'Moratuwa Bus Stand',  to: 'Pettah Bus Stand',       fromCoords: [79.8863, 6.7589], toCoords: [79.8574, 6.9350] },
};
