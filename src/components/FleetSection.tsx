import { Button } from "@/components/ui/button";
import { Users, Briefcase, Star, Zap, Car, Crown } from "lucide-react";
import { useState } from "react";
import { useScrollReveal, useScrollRevealMultiple, } from "@/hooks/useScrollReveal";
const FleetSection = () => {
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);
    const titleReveal = useScrollReveal({ delay: 100 });
    const subtitleReveal = useScrollReveal({ delay: 300 });
    const { ref: cardsRef, visibleItems } = useScrollRevealMultiple(4, 150);
    const vehicles = [
        {
            id: "business",
            name: "Business Class",
            vehicle: "Executive sedan",
            passengers: 3,
            bags: 2,
            badge: "Most Popular",
            badgeColor: "bg-green-500",
        },
        {
            id: "van",
            name: "Business Van/SUV",
            vehicle: "Spacious people carrier",
            passengers: 5,
            bags: 5,
            badge: "More Spacious",
            badgeColor: "bg-blue-500",
        },
        {
            id: "electric",
            name: "Electric Class",
            vehicle: "Electric sedan",
            passengers: 3,
            bags: 2,
            badge: "Most Eco-friendly",
            badgeColor: "bg-green-600",
        },
        {
            id: "first",
            name: "First Class",
            vehicle: "Premium sedan",
            passengers: 3,
            bags: 2,
            badge: "Most Luxurious",
            badgeColor: "bg-gold",
        },
    ];
    const features = [
        "Four service categories",
        "Editable booking details",
        "Local demo confirmation",
    ];
    return (<section id="fleet" className="pt-20 pb-20 relative z-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-visible">
        <div className="text-center mb-16 pt-8">
          <div ref={titleReveal.ref} className={`scroll-reveal ${titleReveal.isVisible ? "visible" : ""}`}>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">
              Choose Your Category
            </h2>
          </div>
          <div ref={subtitleReveal.ref} className={`scroll-reveal ${subtitleReveal.isVisible ? "visible" : ""}`}>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Explore the four categories from the original booking flow. Select a category to try the journey and checkout.
            </p>
          </div>
        </div>

        <div ref={cardsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 overflow-visible">
          {vehicles.map((vehicle, index) => (<div key={vehicle.id} className={`relative flex flex-col justify-end bg-dark-tertiary rounded-2xl overflow-hidden border border-gold/20 hover:border-gold hover:scale-105 transform transition-all duration-300 hover-gold-glow min-h-[280px] sm:min-h-[320px] md:min-h-[380px] lg:min-h-[420px] shadow-lg scroll-reveal-scale ${visibleItems[index] ? "visible" : ""}`} onMouseEnter={() => setHoveredCard(vehicle.id)} onMouseLeave={() => setHoveredCard(null)} onTouchStart={() => setHoveredCard(vehicle.id)} onTouchEnd={() => setTimeout(() => setHoveredCard(null), 3000)}>
              <img src={`/images/vehicle-${{ business: 1, electric: 2, van: 3, first: 4 }[vehicle.id]}.svg`} alt={vehicle.name} className="absolute top-8 w-full h-44 object-contain p-3"/>
              
              {vehicle.badge && (<div className="absolute -top-8 left-1/2 -translate-x-1/2 z-50 flex justify-center w-full pointer-events-none">
                  <span className={`pointer-events-auto ${vehicle.badgeColor} text-white text-xs px-4 py-1 rounded-full font-semibold shadow-lg`}>
                    {vehicle.badge}
                  </span>
                </div>)}

              
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 pointer-events-none"></div>

              
              <div className="relative z-20 p-2 sm:p-4 md:p-5 lg:p-6 flex flex-col items-center">
                <div className="flex flex-col items-center gap-0.5 mb-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-white text-center leading-tight">
                    {vehicle.name}
                  </h3>
                </div>
                <p className="text-gray-200 text-xs sm:text-sm mb-1.5 sm:mb-3 text-center drop-shadow-md leading-tight sm:leading-relaxed">
                  {vehicle.vehicle}
                </p>
                
                <div className="flex items-center justify-center gap-3 sm:gap-6 mb-2 sm:mb-3 text-xs sm:text-sm text-gray-100">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4"/>
                    <span>{vehicle.passengers}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-3 h-3 sm:w-4 sm:h-4"/>
                    <span>{vehicle.bags}</span>
                  </div>
                </div>
                <Button className="w-full bg-[#FFD900] text-black font-semibold hover:bg-[#FFD900]/90 text-xs sm:text-sm py-2 sm:py-2.5 transition-all" onClick={() => {
                const heroSection = document.querySelector("section");
                heroSection?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
                const url = new URL(window.location.href);
                url.searchParams.set("vehicle", vehicle.id);
                window.history.pushState({}, "", url);
                window.dispatchEvent(new CustomEvent("vehiclePreselect", {
                    detail: { vehicleId: vehicle.id },
                }));
            }}>
                  Try this category
                </Button>
              </div>
            </div>))}
        </div>

        
        <div className="text-center mt-12">
          <div className="flex flex-col md:flex-row justify-center items-center gap-8">
            {features.map((feature, index) => (<div key={index} className="flex items-center gap-3">
                <div className="w-2 h-2 bg-gold rounded-full flex-shrink-0"></div>
                <span className="text-gray-300">{feature}</span>
              </div>))}
          </div>
        </div>
      </div>
    </section>);
};
export default FleetSection;
