# Adaptation notes

## Reused from the author's private application

| Area | Source-derived files | Public adaptation |
|---|---|---|
| Landing layout | `HeroSection`, `Navigation`, `FleetSection` | Neutral brand, portfolio text, local illustrations replacing company media |
| Booking form | `booking/BookingFormReference` | Original controls, one-way/hourly tabs, validation and preselection; local journey storage replaces draft API calls |
| Checkout | `booking/Checkout` | Original editable sections, category cards, guest/billing fields, validation and responsive layout; payment entry replaced by a simulation panel |
| Confirmation | `booking/BookingConfirmation`, `RideDetailsSummary` | Original ticket layout and expandable details; receives the in-memory booking instead of querying production |
| Shared UI | Calendar, TimePicker, LocationInput, CountrySelector, SimpleSelect, RouteTimeline, icons, button, backgrounds, scroll hooks | Reused controls; imports normalized |
| Pricing | `utils/pricingCalculator`, `utils/formatters` | Original calculation/formatting functions; fictional rates supplied by the demo service |

## Demo boundaries

- `utils/googleMapsApi.ts` is a local adapter with curated suggestions and fictional route estimates. The schematic route image is not navigation.
- `services/PricingService.ts` provides local fictional tariffs to the retained checkout interface. Tax is illustrative.
- `demo/booking.ts` creates sample guest/billing data. These details never enter persistent storage.
- `usePaymentMethods.ts` is a local compatibility adapter. No payment SDK is bundled.
- `App.tsx` keeps the original home → checkout → confirmation route structure. Confirmations only exist for the current in-memory session.
- No authentication, database, notifications, real-time operations or external API integration is enabled publicly.

## Publication boundary

Only this curated project is published. Original environment files, deployment guides, private history, server functions, branded assets and inactive legacy components are excluded. Vehicle illustrations in `public/images/*.svg` were created for this beta.

## Known limitations

Suggestions cover a small demonstration dataset. Unlisted journeys use a labeled fictional estimate. The beta preserves the original ground-transport flow; additional service catalogs need dedicated rules and interfaces. A confirmation resets on refresh because no backend booking is created.
