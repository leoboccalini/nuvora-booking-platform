export enum BookingType {
    OneWay = "one-way",
    ByTheHour = "by-the-hour"
}
export interface Time {
    hour: number;
    minute: number;
    period: "AM" | "PM";
}
export interface LocationSuggestion {
    id: string;
    primaryText: string;
    secondaryText: string;
    description?: string;
    type: "airport" | "station" | "hotel" | "address";
    placeId?: string;
}
export interface VehicleClass {
    id: string;
    name: string;
    description: string;
    price: number;
    passengerCapacity: number;
    luggageCapacity: number;
    passengers?: number;
    luggage?: number;
    imageUrl: string;
    priceBreakdown: {
        baseFare: number;
        kmRate?: number;
        distanceKm?: number;
        distanceCost?: number;
        subtotalHT?: number;
        tvaRate?: number;
        tvaAmount?: number;
        totalTTC?: number;
        meetAndGreet?: number;
        estimatedTax?: number;
    };
}
export interface GuestDetails {
    title: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}
export interface PickupInfoData {
    bookingFor: "myself" | "someoneElse";
    guestDetails?: GuestDetails;
    phone?: string;
    flightNumber: string;
    pickupSign: string;
    notes: string;
    refCode: string;
}
export interface BillingInformation {
    customerType?: "individual" | "company";
    companyName: string;
    taxId?: string;
    streetAddress: string;
    addressComplement: string;
    zipCode: string;
    city: string;
    country: string;
    billingEmail?: string;
}
export interface PaymentData {
    cardName?: string;
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
    paymentMethodId?: string;
    saveCard?: boolean;
    cardBrand?: string;
    last4?: string;
    expMonth?: number;
    expYear?: number;
    billingInfo?: BillingInformation;
}
export interface VehiclePricing {
    vehicleClass: string;
    baseFare: number;
    distancePrice: number;
    durationPrice: number;
    meetAndGreet: number;
    subtotal: number;
    tax: number;
    total: number;
    currency: string;
    breakdown: {
        distance: string;
        duration: string;
    };
    calculatedAt: string;
}
export interface BookingData {
    bookingId?: string;
    bookingType: BookingType;
    fromLocation: string;
    fromLocationAddress?: string;
    fromPlaceId?: string;
    toLocation?: string;
    toLocationAddress?: string;
    toPlaceId?: string;
    date: Date;
    time: Time;
    duration?: number;
    distanceKm?: number;
    durationMinutes?: number;
    encodedPolyline?: string;
    vehicle?: VehicleClass;
    preselectedVehicle?: string;
    pickupInfo?: PickupInfoData;
    paymentData?: PaymentData;
    pricingData?: VehiclePricing;
}
