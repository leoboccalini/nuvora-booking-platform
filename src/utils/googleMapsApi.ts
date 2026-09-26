import type { LocationSuggestion } from '../types';
export const DEMO_LOCATIONS: LocationSuggestion[] = [
    { id: 'gva', placeId: 'gva', primaryText: 'Geneva International Airport (GVA)', secondaryText: 'Geneva, Switzerland', type: 'airport' },
    { id: 'lausanne', placeId: 'lausanne', primaryText: 'Lausanne railway station', secondaryText: 'Lausanne, Switzerland', type: 'station' },
    { id: 'zurich-airport', placeId: 'zurich-airport', primaryText: 'Zurich Airport (ZRH)', secondaryText: 'Zurich, Switzerland', type: 'airport' },
    { id: 'zurich', placeId: 'zurich', primaryText: 'Zurich City Centre', secondaryText: 'Zurich, Switzerland', type: 'address' },
    { id: 'montreux', placeId: 'montreux', primaryText: 'Montreux', secondaryText: 'Lake Geneva, Switzerland', type: 'address' },
    { id: 'chamonix', placeId: 'chamonix', primaryText: 'Chamonix', secondaryText: 'French Alps, France', type: 'address' },
    { id: 'hotel', placeId: 'hotel', primaryText: 'Demo Grand Hotel', secondaryText: 'Fictional destination', type: 'hotel' },
];
export async function getPlaceAutocompleteSuggestions(query: string) {
    const q = query.toLowerCase().trim();
    return DEMO_LOCATIONS.filter(x => `${x.primaryText} ${x.secondaryText}`.toLowerCase().includes(q));
}
const resolve = (value: string) => DEMO_LOCATIONS.find(x => x.id === value || x.primaryText === value);
export async function getDirections(from: string, to: string) {
    const a = resolve(from), b = resolve(to);
    const route = [a?.id, b?.id].sort().join(':');
    const distances: Record<string, [
        number,
        number
    ]> = {
        'gva:lausanne': [62, 50], 'gva:montreux': [92, 75], 'chamonix:gva': [100, 85],
        'zurich:zurich-airport': [12, 25],
    };
    const [distanceKm, durationMinutes] = from === to ? [0, 0] : distances[route] || [35, 40];
    return { distanceKm, durationMinutes, encodedPolyline: 'demo', startAddress: a?.primaryText || from, endAddress: b?.primaryText || to };
}
