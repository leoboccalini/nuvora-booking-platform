export const TVA_RATE = 0.081;
export const TVA_MULTIPLIER = 1 + TVA_RATE;
export interface PriceBreakdown {
    baseFare: number;
    kmRate: number;
    distanceKm: number;
    distanceCost: number;
    subtotalHT: number;
    tvaRate: number;
    tvaAmount: number;
    totalTTC: number;
    currency: string;
    calculatedAt: string;
}
export function convertTTCtoHT(valueTTC: number): number {
    return valueTTC / TVA_MULTIPLIER;
}
export function convertHTtoTTC(valueHT: number): number {
    return valueHT * TVA_MULTIPLIER;
}
export function calculateTripPrice(distanceKm: number, kmRate: number, baseFare: number = 0, currency: string = 'CHF'): PriceBreakdown {
    const distanceCost = distanceKm * kmRate;
    const subtotalHT = distanceCost + baseFare;
    const tvaAmount = subtotalHT * TVA_RATE;
    const totalTTC = subtotalHT + tvaAmount;
    return {
        baseFare,
        kmRate,
        distanceKm,
        distanceCost: Math.round(distanceCost * 100) / 100,
        subtotalHT: Math.round(subtotalHT * 100) / 100,
        tvaRate: TVA_RATE,
        tvaAmount: Math.round(tvaAmount * 100) / 100,
        totalTTC: Math.round(totalTTC * 100) / 100,
        currency,
        calculatedAt: new Date().toISOString(),
    };
}
export function calculateFromCounterTable(totalTTC: number, distanceKm: number, baseFare: number = 0, currency: string = 'CHF'): PriceBreakdown {
    const subtotalHT = convertTTCtoHT(totalTTC);
    const distanceCost = subtotalHT - baseFare;
    const kmRate = distanceCost / distanceKm;
    const tvaAmount = subtotalHT * TVA_RATE;
    const recalculatedTTC = subtotalHT + tvaAmount;
    return {
        baseFare,
        kmRate: Math.round(kmRate * 100) / 100,
        distanceKm,
        distanceCost: Math.round(distanceCost * 100) / 100,
        subtotalHT: Math.round(subtotalHT * 100) / 100,
        tvaRate: TVA_RATE,
        tvaAmount: Math.round(tvaAmount * 100) / 100,
        totalTTC: Math.round(recalculatedTTC * 100) / 100,
        currency,
        calculatedAt: new Date().toISOString(),
    };
}
export function formatPrice(amount: number, currency: string = 'CHF'): string {
    return `${currency} ${amount.toFixed(2)}`;
}
export function formatPriceBreakdown(breakdown: PriceBreakdown): string {
    return `
Subtotal HT: ${formatPrice(breakdown.subtotalHT, breakdown.currency)}
TVA (${(breakdown.tvaRate * 100).toFixed(1)}%): ${formatPrice(breakdown.tvaAmount, breakdown.currency)}
────────────────────────
Total: ${formatPrice(breakdown.totalTTC, breakdown.currency)}
  `.trim();
}
