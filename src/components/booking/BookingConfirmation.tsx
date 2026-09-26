import React, { useState } from "react";
import { BookingData } from "../../types";
import { ChevronDownIcon } from "./icons";
import { Copy, Users, Luggage } from "lucide-react";
import { toast } from "sonner";
import { formatDate, formatTime } from "../../utils/formatters";
import { RideDetailsSummary } from "./RideDetailsSummary";
import { VEHICLE_CLASSES } from "../../constants";
import { RideMap } from "../RideMap";
export function BookingConfirmation({ bookingData }: {
    bookingData: BookingData;
}) {
    const [showRideDetails, setShowRideDetails] = useState(false);
    const reconstructedBookingData = bookingData;
    const shortUrl = window.location.origin;
    const booking = {
        booking_number: bookingData.bookingId,
        from_place_id: bookingData.fromPlaceId || "demo-a",
        to_place_id: bookingData.toPlaceId || "demo-b",
        from_location: bookingData.fromLocation,
        to_location: bookingData.toLocation,
        vehicle_class: bookingData.vehicle?.id,
    };
    const pickupDate = reconstructedBookingData.date;
    const formattedDateDisplay = formatDate(pickupDate);
    const formattedTimeDisplay = formatTime(pickupDate, reconstructedBookingData.time);
    const formattedDateTime = `${formattedDateDisplay} · ${formattedTimeDisplay}`;
    return (<div className="min-h-screen bg-black pt-6 pb-4 px-2 sm:pt-8 sm:pb-8 sm:px-4 flex flex-col items-center relative" style={{
            backgroundImage: 'radial-gradient(rgba(255, 217, 0, 0.15) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            backgroundPosition: 'center center'
        }}>
      
      <div className="flex items-center justify-center mb-4 sm:mb-6 w-full max-w-lg">
        <span className="text-3xl font-bold text-white">nu<span className="text-[#FFD900]">vora</span></span>
      </div>

      <div className="max-w-lg w-full">
        <div className="bg-gray-100 rounded-3xl overflow-hidden shadow-inner">
          <div className="px-5 sm:px-10 py-6 sm:py-8 text-center border-b border-gray-200 bg-gradient-to-b from-gray-200/50 to-gray-100">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="w-10 h-10 sm:w-14 sm:h-14">
                <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-[#303030] mb-1 sm:mb-2 tracking-tight">
              Your demo booking is complete.
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm mb-3 sm:mb-4 leading-tight">
              Demo reference{" "}
              <span className="font-mono font-bold text-gray-900">
                {booking?.booking_number || "..."}
              </span>
            </p>

            <div className="rounded-xl p-2 sm:p-3 flex items-center gap-2 border border-gray-300 max-w-sm mx-auto">
              <div className="flex-1 text-left min-w-0">
                <p className="text-[9px] sm:text-[10px] uppercase font-bold text-gray-400 mb-0.5 tracking-wider">
                  Share this portfolio
                </p>
                <p className="text-xs sm:text-sm font-mono text-gray-600 truncate">
                  {shortUrl || "Portfolio link"}
                </p>
              </div>
              <button onClick={() => {
            navigator.clipboard.writeText(shortUrl).then(() => toast.success("Link copied!")).catch(() => toast.error("Copy the link from your address bar."));
        }} className="p-2.5 hover:bg-gray-300 rounded-lg transition-colors text-gray-500 active:scale-95" title="Copy Link">
                <Copy className="w-4 h-4"/>
              </button>
            </div>
          </div>

          
          <div className="px-5 sm:px-10 py-2 sm:py-4">
            
            <div className="flex items-center justify-center mb-2 sm:mb-3 text-[#303030]">
              <span className="font-bold text-sm sm:text-base">
                {formattedDateTime}
              </span>
            </div>

            
            <div className="mb-2 sm:mb-3 rounded-xl overflow-hidden border border-gray-300 bg-gray-100">
              {booking?.from_place_id && booking?.to_place_id ? (<div className="w-full h-24 sm:h-32">
                  <RideMap originPlaceId={booking.from_place_id} destinationPlaceId={booking.to_place_id} theme="light"/>
                </div>) : (<div className="w-full h-24 sm:h-32 flex flex-col items-center justify-center gap-2 bg-gray-100">
                  <div className="text-center px-4">
                    <p className="font-semibold mb-2 text-xs sm:text-sm text-gray-400">
                      🗺️ Map not available
                    </p>
                  </div>
                </div>)}
            </div>

            
            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="space-y-1">
                <span className="text-gray-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wide block">
                  From
                </span>
                <p className="text-[#303030] font-bold text-sm sm:text-base leading-tight">
                  {reconstructedBookingData.fromLocation}
                </p>
                {reconstructedBookingData.fromLocationAddress && (<p className="text-gray-600 text-[10px] sm:text-xs leading-relaxed">
                    {reconstructedBookingData.fromLocationAddress}
                  </p>)}
              </div>

              <div className="space-y-1">
                <span className="text-gray-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wide block">
                  To
                </span>
                <p className="text-[#303030] font-bold text-sm sm:text-base leading-tight">
                  {reconstructedBookingData.toLocation}
                </p>
                {reconstructedBookingData.toLocationAddress && (<p className="text-gray-600 text-[10px] sm:text-xs leading-relaxed">
                    {reconstructedBookingData.toLocationAddress}
                  </p>)}
              </div>
            </div>

            
            <div className="mb-2 sm:mb-3 mt-4 sm:mt-6">
              <div className="py-4 sm:py-6 border-t border-gray-200/80 flex items-center gap-3 sm:gap-6">
                
                <div className="flex-shrink-0">
                  <img src={reconstructedBookingData.vehicle?.imageUrl} alt={reconstructedBookingData.vehicle?.name} className="w-24 sm:w-32 h-auto object-contain"/>
                </div>

                
                <div className="flex-1 text-left">
                  <p className="text-[8px] sm:text-[9px] uppercase font-bold text-gray-500 mb-0 tracking-wider">
                    Vehicle Class
                  </p>
                  <p className="text-[#303030] font-bold text-sm sm:text-base mb-0">
                    {reconstructedBookingData.vehicle?.name}
                  </p>
                  <p className="text-gray-600 text-[10px] sm:text-xs mb-2">
                    {reconstructedBookingData.vehicle?.description ||
            "Luxury transfer service"}
                  </p>
                  <div className="flex items-center gap-3 sm:gap-6">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600"/>
                      <span className="text-[10px] sm:text-xs font-semibold text-gray-700">
                        {VEHICLE_CLASSES.find((v) => v.id === booking?.vehicle_class)?.passengerCapacity ||
            reconstructedBookingData.vehicle?.passengerCapacity}{" "}
                        passengers
                      </span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Luggage className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600"/>
                      <span className="text-[10px] sm:text-xs font-semibold text-gray-700">
                        {VEHICLE_CLASSES.find((v) => v.id === booking?.vehicle_class)?.luggageCapacity ||
            reconstructedBookingData.vehicle?.luggageCapacity}{" "}
                        luggage
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            
            <div className="py-3 sm:py-4 border-y border-gray-200/80 mb-2 sm:mb-3">
              <div className="flex items-center justify-between">
                <div className="flex flex-col justify-center gap-0.5">
                  <p className="text-xs sm:text-sm uppercase font-bold text-gray-500 tracking-wider">
                    Simulated Total
                  </p>
                  <p className="text-gray-400 text-[9px] sm:text-[10px] font-semibold">
                    Illustrative tax included
                  </p>
                </div>
                <div className="flex items-center">
                  <p className="text-[#303030] font-black text-2xl sm:text-3xl tracking-tight">
                    CHF {reconstructedBookingData.vehicle?.price.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            
            <div className="flex flex-col gap-2 mt-2 mb-1">
              <button onClick={() => setShowRideDetails(!showRideDetails)} className="w-full py-2 text-gray-500 font-bold text-xs sm:text-sm hover:text-[#303030] transition-all flex items-center justify-center gap-2">
                {showRideDetails ? "Hide full details" : "View full details"}
                <ChevronDownIcon className={`w-3.5 h-3.5 transition-transform ${showRideDetails ? "rotate-180" : ""}`}/>
              </button>

              {showRideDetails && (<div className="mt-1 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="border border-gray-300/60 rounded-xl overflow-hidden p-2 sm:p-3">
                    <RideDetailsSummary bookingData={reconstructedBookingData} minimal bgColor="transparent"/>
                  </div>
                </div>)}
            </div>
          </div>
        </div>

        
        <div className="mt-6 flex flex-col gap-3">

          <button onClick={() => (window.location.href = "/")} className="w-full py-3.5 bg-transparent text-white font-black text-sm rounded-xl hover:text-[#FFD900] transition-all active:scale-95">
            Back to Home
          </button>
        </div>

        
        <p className="mt-8 text-center text-gray-500 text-[10px] sm:text-xs px-4 leading-relaxed">
          Simulation only. No reservation, payment or email was created.
          <br className="hidden sm:block"/>
          <span className="text-white/40 font-medium">
            Created by Leo Boccalini with AI-assisted development.
          </span>
        </p>
      </div>
    </div>);
}
;
