import { calculateTripPrice } from '../utils/pricingCalculator';
export class PricingService {
    static async calculatePricing(vehicle: string, distance: number, minutes = 0, ..._unused: unknown[]) {
        const rates: Record<string, number> = { business: 2, electric: 2.1, van: 2.8, first: 3.6 };
        const rate = rates[vehicle] || rates.business;
        const breakdown = distance > 0
            ? calculateTripPrice(distance, rate, 20)
            : calculateTripPrice(0, 0, Math.max(1, minutes / 60) * rate * 35);
        return { ...breakdown, total: breakdown.totalTTC, subtotal: breakdown.subtotalHT, tax: breakdown.tvaAmount };
    }
}
