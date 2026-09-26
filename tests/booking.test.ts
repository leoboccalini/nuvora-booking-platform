import test from 'node:test';
import assert from 'node:assert/strict';
import {calculateTripPrice,convertTTCtoHT} from '../src/utils/pricingCalculator';
import {getDirections,getPlaceAutocompleteSuggestions} from '../src/utils/googleMapsApi';
import {PricingService} from '../src/services/PricingService';
import {parseJourney,prepareBooking} from '../src/demo/booking';
import {BookingType} from '../src/types';

test('original pricing formula preserves subtotal, tax and rounded total',()=>{
 const p=calculateTripPrice(62,2,20);
 assert.equal(p.subtotalHT,144);assert.equal(p.tvaAmount,11.66);assert.equal(p.totalTTC,155.66);
 assert.ok(Math.abs(convertTTCtoHT(108.1)-100)<0.00001);
});
test('hourly pricing changes with duration and category',async()=>{
 const a=await PricingService.calculatePricing('business',0,120);
 const b=await PricingService.calculatePricing('business',0,240);
 const c=await PricingService.calculatePricing('van',0,120);
 assert.equal(b.total,2*a.total);assert.ok(c.total>a.total);
});
test('local route adapter resolves suggestions and reverse journeys',async()=>{
 assert.ok((await getPlaceAutocompleteSuggestions('geneva')).some(x=>x.id==='gva'));
 assert.equal((await getDirections('gva','lausanne')).distanceKm,62);
 assert.equal((await getDirections('lausanne','gva')).distanceKm,62);
});
test('journey parser rejects missing and malformed drafts',()=>{
 assert.equal(parseJourney(null),null);assert.equal(parseJourney('{'),null);
 assert.equal(parseJourney(JSON.stringify({bookingType:'one-way'})),null);
});
test('preselected category survives the journey-to-checkout transition',async()=>{
 const booking=await prepareBooking({bookingType:BookingType.OneWay,fromLocation:'Geneva',toLocation:'Lausanne',date:new Date(),time:{hour:12,minute:0,period:'PM'},distanceKm:62,durationMinutes:50,preselectedVehicle:'van'});
 assert.equal(booking.vehicle?.id,'van');assert.equal(booking.paymentData?.paymentMethodId,'demo');
 assert.equal(booking.pickupInfo?.guestDetails?.email,'alex@example.com');
});
