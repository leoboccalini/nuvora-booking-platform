import React from 'react';
import { BookingData, BookingType } from '../../types';
import { formatTime, formatDate } from '../../utils/formatters';
interface RideDetailsSummaryProps {
    bookingData: BookingData;
    minimal?: boolean;
    bgColor?: string;
}
export const RideDetailsSummary: React.FC<RideDetailsSummaryProps> = ({ bookingData, minimal = false, }) => {
    const { bookingType, fromLocation, fromLocationAddress, toLocation, toLocationAddress, date, time, duration, distanceKm, durationMinutes, vehicle, pickupInfo, paymentData } = bookingData;
    const formattedDateDisplay = formatDate(date);
    const formattedTimeDisplay = formatTime(date, time);
    const getGuestName = () => {
        if (pickupInfo?.guestDetails) {
            const { title, firstName, lastName } = pickupInfo.guestDetails;
            return `${title || ''} ${firstName || ''} ${lastName || ''}`.trim() || 'Not provided';
        }
        return 'Not provided';
    };
    const sectionTitleClasses = minimal
        ? "font-medium text-[9px] uppercase tracking-[0.1em] text-gray-400 mb-2 pb-1 border-b border-gray-100"
        : "font-medium text-[10px] uppercase tracking-[0.1em] text-gray-400 mb-4 pb-2 border-b border-gray-100";
    const itemClasses = minimal
        ? "flex flex-col sm:flex-row sm:items-start gap-0.5 sm:gap-4 text-xs mb-2"
        : "flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 text-sm mb-4";
    const labelClasses = minimal
        ? "font-normal text-gray-400 min-w-[120px] uppercase text-[8px] tracking-wider"
        : "font-normal text-gray-400 min-w-[140px] uppercase text-[9px] tracking-wider";
    const valueClasses = "text-[#303030] font-medium flex-1";
    return (<div className={`${minimal ? 'space-y-4' : 'space-y-8'} py-1`}>
            
            <section>
                <h4 className={sectionTitleClasses}>Route Information</h4>
                <div className={minimal ? "space-y-1.5" : "space-y-3"}>
                    <div className={itemClasses}>
                        <span className={labelClasses}>From:</span>
                        <div className="flex-1">
                            <div className={valueClasses}>{fromLocation}</div>
                            {fromLocationAddress && (<div className="text-[11px] text-gray-400 mt-0.5 font-normal">{fromLocationAddress}</div>)}
                        </div>
                    </div>
                    <div className={itemClasses}>
                        <span className={labelClasses}>To:</span>
                        <div className="flex-1">
                            <div className={valueClasses}>{toLocation || 'As directed'}</div>
                            {toLocationAddress && (<div className="text-[11px] text-gray-400 mt-0.5 font-normal">{toLocationAddress}</div>)}
                        </div>
                    </div>
                    <div className={itemClasses}>
                        <span className={labelClasses}>Schedule:</span>
                        <span className={valueClasses}>{formattedDateDisplay} · {formattedTimeDisplay}</span>
                    </div>
                    <div className={itemClasses}>
                        <span className={labelClasses}>Service:</span>
                        <span className={valueClasses}>
                            {bookingType === BookingType.OneWay ? 'Point to Point' : 'By The Hour'}
                            {bookingType === BookingType.ByTheHour && duration && ` (${duration} hours)`}
                        </span>
                    </div>
                </div>
            </section>

            
            {vehicle && (<section>
                    <h4 className={sectionTitleClasses}>Vehicle Selection</h4>
                    <div className={itemClasses}>
                        <span className={labelClasses}>Class:</span>
                        <span className={valueClasses}>{vehicle.name}</span>
                    </div>
                    <div className={itemClasses}>
                        <span className={labelClasses}>Capacity:</span>
                        <span className={valueClasses}>
                            {vehicle.passengerCapacity || (vehicle as any).passengers} Passengers · {vehicle.luggageCapacity || (vehicle as any).luggage} Luggage
                        </span>
                    </div>
                </section>)}

            
            {pickupInfo && (<section>
                    <h4 className={sectionTitleClasses}>Passenger & Pickup</h4>
                    <div className={minimal ? "space-y-2" : "space-y-4"}>
                        <div className={itemClasses}>
                            <span className={labelClasses}>Guest:</span>
                            <span className={valueClasses}>{getGuestName()}</span>
                        </div>
                        {pickupInfo.guestDetails?.email && (<div className={itemClasses}>
                                <span className={labelClasses}>Email:</span>
                                <span className={valueClasses}>{pickupInfo.guestDetails.email}</span>
                            </div>)}
                        {pickupInfo.guestDetails?.phone && (<div className={itemClasses}>
                                <span className={labelClasses}>Phone:</span>
                                <span className={valueClasses}>{pickupInfo.guestDetails.phone}</span>
                            </div>)}
                        {pickupInfo.flightNumber && (<div className={itemClasses}>
                                <span className={labelClasses}>Flight Number:</span>
                                <span className={valueClasses}>{pickupInfo.flightNumber}</span>
                            </div>)}
                        {pickupInfo.pickupSign && (<div className={itemClasses}>
                                <span className={labelClasses}>Pickup Sign:</span>
                                <span className={valueClasses}>{pickupInfo.pickupSign}</span>
                            </div>)}
                        {pickupInfo.notes && (<div className={itemClasses}>
                                <span className={labelClasses}>Instructions:</span>
                                <p className="text-gray-600 text-sm leading-relaxed font-normal">{pickupInfo.notes}</p>
                            </div>)}
                    </div>
                </section>)}

            
            {paymentData && (<section>
                    <h4 className={sectionTitleClasses}>Payment & Billing</h4>
                    <div className={minimal ? "space-y-2" : "space-y-4"}>
                        <div className={itemClasses}>
                            <span className={labelClasses}>Cardholder:</span>
                            <span className={valueClasses}>{paymentData.cardName || 'Card Holder'}</span>
                        </div>
                        <div className={itemClasses}>
                            <span className={labelClasses}>Method:</span>
                            <span className={valueClasses}>
                                {paymentData.cardNumber === '****' ? '**** 8484' : paymentData.cardNumber}
                            </span>
                        </div>

                        {paymentData.billingInfo && (<div className={itemClasses}>
                                <span className={labelClasses}>Billing Address:</span>
                                <div className="text-sm text-gray-700 leading-snug font-normal flex-1">
                                    {paymentData.billingInfo.companyName && (<div className="font-medium mb-1">{paymentData.billingInfo.companyName}</div>)}
                                    {paymentData.billingInfo.streetAddress && (<div>{paymentData.billingInfo.streetAddress}</div>)}
                                    {paymentData.billingInfo.addressComplement && (<div>{paymentData.billingInfo.addressComplement}</div>)}
                                    {(paymentData.billingInfo.zipCode || paymentData.billingInfo.city) && (<div>
                                            {paymentData.billingInfo.zipCode} {paymentData.billingInfo.city}
                                        </div>)}
                                    {paymentData.billingInfo.country && (<div className="font-medium">{paymentData.billingInfo.country}</div>)}
                                </div>
                            </div>)}
                    </div>
                </section>)}
        </div>);
};
