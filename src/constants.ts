import type { VehicleClass } from './types';
export const VEHICLE_CLASSES: VehicleClass[] = [
    { id: 'business', name: 'Business Class', description: 'Executive sedan · most popular', passengerCapacity: 3, luggageCapacity: 2, imageUrl: '/images/vehicle-1.svg', price: 155.66, priceBreakdown: { baseFare: 144, subtotalHT: 144, tvaAmount: 11.66, totalTTC: 155.66 } },
    { id: 'electric', name: 'Electric Class', description: 'Electric sedan · quiet and comfortable', passengerCapacity: 3, luggageCapacity: 2, imageUrl: '/images/vehicle-2.svg', price: 162.36, priceBreakdown: { baseFare: 150.2, subtotalHT: 150.2, tvaAmount: 12.16, totalTTC: 162.36 } },
    { id: 'van', name: 'Business Van/SUV', description: 'People carrier · space for your group', passengerCapacity: 5, luggageCapacity: 5, imageUrl: '/images/vehicle-3.svg', price: 209.28, priceBreakdown: { baseFare: 193.6, subtotalHT: 193.6, tvaAmount: 15.68, totalTTC: 209.28 } },
    { id: 'first', name: 'First Class', description: 'Premium sedan · extra comfort', passengerCapacity: 2, luggageCapacity: 2, imageUrl: '/images/vehicle-4.svg', price: 262.90, priceBreakdown: { baseFare: 243.2, subtotalHT: 243.2, tvaAmount: 19.70, totalTTC: 262.90 } }
];
