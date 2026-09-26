# Nuvora — Booking Platform

A public portfolio beta by **Leo Boccalini**, adapted from his existing booking application built with AI-assisted development.

[Live demo](https://nuvora-booking-platform.vercel.app/) · [Author](https://github.com/leoboccalini)

## Explore the flow

1. Choose a one-way journey or hourly service, locations, date and time.
2. Select Business, Electric, Business Van/SUV or First Class.
3. Edit the journey, fictional guest details, pickup instructions and billing information.
4. Review the itemized estimate and confirm a simulated booking.
5. Open the confirmation ticket and expand the full details.

Use the prefilled fictional passenger. This is not an operational booking service.

## Relationship to the original product

This version reuses the author's React booking form, custom calendar/time controls, category selection, editable checkout sections, confirmation ticket, formatting and pricing functions. The original dark and gold visual system and responsive layouts are retained.

Production services are replaced at explicit boundaries: local location suggestions, illustrative route diagrams, fictional prices and simulated payment. The original private repository is untouched. Its Git history, credentials, customer data and infrastructure files are not included.

The public beta currently demonstrates **ground transport**. Aviation, helicopters and nautical service catalogs are future extensions of the product concept, not implemented features of this release.

## Technology

React 18 · TypeScript · Vite · Tailwind CSS · React Router

No API keys or backend setup are required. Guest and billing edits exist only in memory; refreshing resets them. Journey details use session storage to move from the form to checkout. No card fields, payment requests, emails or real reservations exist in this beta.

## Development

Use Node.js 22 or newer.

```sh
npm install
npm run dev
npm run build
npm test
```

Vercel configuration builds the Vite application and supports direct navigation to booking routes. The production content policy blocks outbound API connections and embedded payment frames.

See [architecture and adaptation notes](docs/ADAPTATION.md) for the source-derived components and demo boundaries.
