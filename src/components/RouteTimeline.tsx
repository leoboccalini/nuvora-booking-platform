import React from "react";
interface RouteTimelineProps {
    fromLocation: string;
    fromLocationAddress?: string;
    toLocation: string;
    toLocationAddress?: string;
    distanceKm?: number;
    durationMinutes?: number;
}
export const RouteTimeline: React.FC<RouteTimelineProps> = ({ fromLocation, fromLocationAddress, toLocation, toLocationAddress, distanceKm, durationMinutes, }) => {
    const formatDuration = (minutes?: number) => {
        if (!minutes)
            return "35 min";
        const hours = Math.floor(minutes / 60);
        const mins = Math.round(minutes % 60);
        if (hours > 0) {
            return `${hours}h ${mins}min`;
        }
        return `${mins} min`;
    };
    const formatDistance = (km?: number) => {
        if (!km)
            return "43.5 km";
        return `${km.toFixed(1)} km`;
    };
    return (<div className="text-sm">
      
      <div className="flex items-start mb-3">
        
        <div className="flex flex-col items-center mr-3 mt-1">
          <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
          <div className="w-0.5 h-6 bg-gray-300 mt-1"></div>
        </div>

        <div className="flex-1">
          <p className="font-semibold text-gray-800">{fromLocation}</p>
          <p className="text-gray-600 text-xs">
            {fromLocationAddress || "Ponto de partida da sua viagem"}
          </p>
        </div>
      </div>

      
      <div className="flex items-start mb-4">
        
        <div className="flex flex-col items-center mr-3 mt-1">
          <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
        </div>

        <div className="flex-1">
          <p className="font-semibold text-gray-800">{toLocation}</p>
          <p className="text-gray-600 text-xs">
            {toLocationAddress || "Destino final da sua viagem"}
          </p>
        </div>
      </div>

      
      <p className="text-xs text-gray-500 mt-3">
        {formatDuration(durationMinutes)} • {formatDistance(distanceKm)}
      </p>
    </div>);
};
