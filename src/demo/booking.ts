import { BookingType, type BookingData } from '../types';
import { VEHICLE_CLASSES } from '../constants';
import { PricingService } from '../services/PricingService';
export async function prepareBooking(journey: BookingData): Promise<BookingData> {
    const vehicle = VEHICLE_CLASSES.find(v => v.id === journey.preselectedVehicle) || VEHICLE_CLASSES[0];
    const pricing = await PricingService.calculatePricing(vehicle.id, journey.distanceKm || 0, journey.durationMinutes || 0);
    return { ...journey, date: new Date(journey.date), bookingId: `DEMO-${Date.now().toString(36).toUpperCase()}`,
        vehicle: { ...vehicle, price: pricing.total, priceBreakdown: { ...pricing, estimatedTax: pricing.tvaAmount } },
        pickupInfo: { bookingFor: 'myself', guestDetails: { title: 'Mx.', firstName: 'Alex', lastName: 'Demo', email: 'alex@example.com', phone: '+12025550123' }, flightNumber: 'DEMO 123', pickupSign: 'Alex Demo', notes: 'Fictional passenger for the portfolio demonstration.', refCode: '' },
        paymentData: { paymentMethodId: 'demo', cardName: 'Demo guest', cardBrand: 'demo', last4: 'DEMO', billingInfo: { customerType: 'individual', companyName: '', streetAddress: '1 Demo Street', addressComplement: '', zipCode: '00000', city: 'Demo City', country: 'CH', billingEmail: 'alex@example.com' } } };
}
export function parseJourney(raw: string | null): BookingData | null {
    try {
        if (!raw)
            return null;
        const data = JSON.parse(raw);
        if (![BookingType.OneWay, BookingType.ByTheHour].includes(data.bookingType) || typeof data.fromLocation !== 'string' || !data.fromLocation.trim() || !Number.isFinite(new Date(data.date).getTime()) || !data.time || !['AM', 'PM'].includes(data.time.period) || data.time.hour < 1 || data.time.hour > 12 || data.time.minute < 0 || data.time.minute > 59)
            return null;
        if (data.bookingType === BookingType.OneWay && (typeof data.toLocation !== 'string' || !data.toLocation.trim()))
            return null;
        if (data.bookingType === BookingType.ByTheHour && (!Number.isFinite(data.duration) || data.duration < 1 || data.duration > 12))
            return null;
        return { ...data, date: new Date(data.date) };
    }
    catch {
        return null;
    }
}
